import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { hexToNumberString, toWei, fromWei } from 'web3-utils'
import { fromWeiByDecimals, fromWeiByDecimalsInput } from '../../../../service/weiByDecimals'
import {
  ABISmartToken,
  BNTToken,
  USDBToken,
  EtherscanLink
} from '../../../../config'

import getBancorGasLimit from '../../../../service/getBancorGasLimit'
import BigNumber from 'bignumber.js'
import { Alert, Form, Card } from "react-bootstrap"
import Button from '@material-ui/core/Button'
import Pending from '../../../templates/Spiners/Pending'
import UserInfo from '../../../templates/UserInfo'
import poolBlackList from '../../../../storage/poolBlackList'


class Fund extends Component {
  constructor(props, context) {
   super(props, context)
    this.state = {
    directionAmount:0,
    BNTAmount:0,
    connectorAmount:0,
    smartTokenAddress:undefined,
    smartTokenSupplyOriginal:0,
    newSmartTokenSupply:0,
    newUserPercent:0,
    tokenAddress:0,
    currentUserPercent:0,
    smartTokenBalance:0,
    userBNTBalance:0,
    userConnectorBalance:0,
    BancorConnectorType:null,
    payAmount:0,
    tokenInfo:null,
    isLoadData:false,
    isBlackListed:false
    }
  }


  // helper for setState
  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  componentDidUpdate = async (prevProps, prevState) => {
    // Update connectors info by input change
    if(prevProps.from !== this.props.from || prevState.directionAmount !== this.state.directionAmount){
      this.setState({
        BNTAmount:0,
        payAmount:0
      })
    }
  }

  calculate = async () => {
    // Update connectors info by input change
    if(Number(this.state.directionAmount) > 0 && this.props.from){
          this.setState({ isLoadData:true })
          const connectorsInfo = await this.calculateConnectorBySmartTokenAmount()
          const BNTAmount = connectorsInfo[0]
          const connectorAmount = connectorsInfo[1]
          const BancorConnectorType = await this.getBancorConnectorType()
          const {
            tokenInfo,
            smartTokenSupplyOriginal,
            newSmartTokenSupply,
            newUserPercent,
            smartTokenAddress,
            tokenAddress,
            currentUserPercent,
            smartTokenBalance,
            userBNTBalance,
            userConnectorBalance
          } = await this.getRelayInfo(BancorConnectorType)

          const payAmount = await fromWeiByDecimals(tokenAddress, connectorAmount, this.props.web3)

          // check if pool converter in BlackList
          const isBlackListed = this.checkBlackList(tokenInfo["converterAddress"])

          this.setState({
            tokenInfo,
            BNTAmount,
            connectorAmount,
            smartTokenAddress,
            smartTokenSupplyOriginal,
            newSmartTokenSupply,
            newUserPercent,
            tokenAddress,
            currentUserPercent,
            smartTokenBalance,
            userBNTBalance,
            userConnectorBalance,
            BancorConnectorType,
            payAmount,
            isBlackListed,
            isLoadData:false
          })
        }else{
          this.setState({
            BNTAmount:0,
            payAmount:0
          })
      }
  }

  checkBlackList = (converter) => {
    const isBlackListed = poolBlackList.includes(converter)
    return isBlackListed
  }

  // return smart token supply (old and new with input) as BN,
  // and userPercent as number and token and relay address and smartTokenBalance
  getRelayInfo = async (BancorConnectorType) => {
    const info = this.props.getInfoBySymbol()
    const tokenAddress = info[2]
    const smartTokenAddress = info[3]
    const smartTokenContract = info[4]
    const tokenInfo = info[5]

    // get data for calculate user input % in relation to totalSupply
    let smartTokenSupplyOriginal = await smartTokenContract.methods.totalSupply().call()
    smartTokenSupplyOriginal = new BigNumber(smartTokenSupplyOriginal)
    let share = new BigNumber(toWei(String(this.state.directionAmount)))
    let currentUserPercent = 0
    let smartTokenBalance = 0
    const newSmartTokenSupply = smartTokenSupplyOriginal.plus(share)

    let userBNTBalance
    let userConnectorBalance

    // if user connect to web3 take into account his balance
    if(this.props.accounts){
      smartTokenBalance = await this.props.getTokenBalance(this.props.web3, smartTokenAddress, this.props.accounts[0])
      const smartTokenBalanceBN = new BigNumber(smartTokenBalance)
      // current %
      currentUserPercent = await this.calculateUserPercentFromSupply(smartTokenBalanceBN, smartTokenSupplyOriginal)
      // add to input curent user balance
      share = share.plus(smartTokenBalanceBN)
      const BNT_type = BancorConnectorType === "USDB" ? USDBToken : BNTToken
      userBNTBalance = await this.props.getTokenBalance(this.props.web3, BNT_type, this.props.accounts[0])
      userConnectorBalance = await this.props.getTokenBalance(this.props.web3, tokenAddress, this.props.accounts[0])
    }

    // new %
    const newUserPercent = await this.calculateUserPercentFromSupply(share, newSmartTokenSupply)
    smartTokenBalance = fromWei(String(smartTokenBalance))
    return {
      tokenInfo,
      smartTokenSupplyOriginal,
      newSmartTokenSupply,
      newUserPercent,
      smartTokenAddress,
      tokenAddress,
      currentUserPercent,
      smartTokenBalance,
      userBNTBalance,
      userConnectorBalance
    }
  }

  // return % of total supply
  calculateUserPercentFromSupply = (share, smartTokenSupply) => {
    const percent = smartTokenSupply.dividedBy(100)
    const partPercent = percent.dividedBy(share)
    const one = new BigNumber(1)
    const userPercent = one.dividedBy(partPercent)

    return userPercent.toNumber()
  }


  // Return Bancor connector symbol (BNT or USDB)
  getBancorConnectorType = async () => {
    const converterInfo = this.props.getInfoBySymbol()
    const converter = converterInfo[0]
    const connectorAddress = await converter.methods.connectorTokens(0).call()
    const contract = new this.props.web3.eth.Contract(ABISmartToken, connectorAddress)
    const symbol = await contract.methods.symbol().call()
    return symbol
  }


  // return BNT(or USDB) and ERC20 connectors amount calculated by smart token amount
  calculateConnectorBySmartTokenAmount = async () => {
    const amount = toWei(String(this.state.directionAmount))
    const converterInfo = this.props.getInfoBySymbol()
    const token = converterInfo[4]
    const converter = converterInfo[0]
    const connectorCount = await converter.methods.connectorTokenCount().call()

    let supply = await token.methods.totalSupply().call()
    supply = hexToNumberString(supply._hex)

    let connectorsAmount = []
    let connectorAmount
    let connectorToken
    let connectorBalance

    for(let i = 0; i < connectorCount; i++){
      connectorToken = await converter.methods.connectorTokens(i).call()
      connectorBalance = await converter.methods.getConnectorBalance(connectorToken).call()
      connectorBalance = hexToNumberString(connectorBalance._hex)
      // Bancor calculation
      // _amount.mul(connectorBalance).div(supply);
      let bigAmount = new BigNumber(amount)
      let bigConnectorBalance = new BigNumber(connectorBalance)
      let bigSupply = new BigNumber(supply)
      connectorAmount = bigAmount.multipliedBy(bigConnectorBalance).dividedBy(bigSupply).toFixed(0)

      connectorsAmount.push(connectorAmount)
    }

    return connectorsAmount
  }

  // Batch request
  approveAndPool = async () => {
     const web3 = this.props.web3
     const tokenInfo = this.props.getInfoBySymbol()
     const converter = tokenInfo[0]
     const converterAddress = tokenInfo[1]
     const gasPrice = await getBancorGasLimit()
     const bancorConnectorAddress = this.state.BancorConnectorType === "USDB" ? USDBToken : BNTToken
     const bnt = new this.props.web3.eth.Contract(ABISmartToken, bancorConnectorAddress)
     const connectorAddress = tokenInfo[2]
     const connector = new this.props.web3.eth.Contract(ABISmartToken, connectorAddress)

     let batch = new web3.BatchRequest()

     // approve tx 1
     const approveBancorData = bnt.methods.approve(
       converterAddress,
       this.state.BNTAmount
     ).encodeABI({from: this.props.accounts[0]})


     // approve tx 2
     const approveConnectorData = connector.methods.approve(
       converterAddress,
       this.state.connectorAmount
     ).encodeABI({from: this.props.accounts[0]})


     // pool
     const poolData = converter.methods.fund(toWei(String(this.state.directionAmount)))
     .encodeABI({from: this.props.accounts[0]})

     // approve gas should be more than in trade
     const approveGasPrice = Number(gasPrice) + 2000000000

     const approveBancor = {
       "from": this.props.accounts[0],
       "to": bancorConnectorAddress,
       "value": "0x0",
       "data": approveBancorData,
       "gasPrice": web3.eth.utils.toHex(approveGasPrice),
       "gas": web3.eth.utils.toHex(85000),
     }

     const approveConnector = {
       "from": this.props.accounts[0],
       "to": connectorAddress,
       "value": "0x0",
       "data": approveConnectorData,
       "gasPrice": web3.eth.utils.toHex(approveGasPrice),
       "gas": web3.eth.utils.toHex(85000),
     }

     const fund = {
       "from": this.props.accounts[0],
       "to": converterAddress,
       "value": "0x0",
       "data": poolData,
       "gasPrice": web3.eth.utils.toHex(approveGasPrice),
       "gas": web3.eth.utils.toHex(185000),
     }

     // add additional request reset approve for case if approved alredy BNT or USDB
     if(bancorConnectorAddress === BNTToken || bancorConnectorAddress === USDBToken){
       let bancorApproved = await bnt.methods.allowance(this.props.accounts[0], converterAddress).call()
       bancorApproved = hexToNumberString(bancorApproved._hex)
       console.log("bancorApproved", bancorApproved)
       if(bancorApproved > 0){
         const resetApproveData = bnt.methods.approve(
           converterAddress,
           0
         ).encodeABI({from: this.props.accounts[0]})

         const resetApprove = {
           "from": this.props.accounts[0],
           "to": bancorConnectorAddress,
           "value": "0x0",
           "data": resetApproveData,
           "gasPrice": web3.eth.utils.toHex(approveGasPrice),
           "gas": web3.eth.utils.toHex(85000),
         }

         batch.add(web3.eth.sendTransaction.request(resetApprove, () => console.log("ResetBancorApprove")))
       }
     }

     batch.add(web3.eth.sendTransaction.request(approveBancor, () => console.log("Approve Bancor")))
     batch.add(web3.eth.sendTransaction.request(approveConnector, () => console.log("Approve connector")))
     batch.add(web3.eth.sendTransaction.request(fund, () => console.log("Pool")))
     batch.execute()
  }

  render(){
    return(
    <React.Fragment>
    {
      this.props.web3
      ?
      (
        <>
        {
          !this.state.isLoadData
          ?
          (
            <>
            <Form.Control name="directionAmount" value={this.state.directionAmount} placeholder="Enter relay amount" onChange={e => this.change(e)} type="number" min="1"/>
            <Button variant="contained" color="primary" onClick={() => this.calculate()}>Calculate</Button>
            <br/>
            </>
          )
          :
          (null)
        }
        </>
      )
      :
      (
        <Alert variant="warning">
        <strong>Please connect your wallet</strong>
        </Alert>
      )
    }
    <br/>
    {
      this.state.BNTAmount > 0 && this.state.connectorAmount > 0 && !this.state.isLoadData
      ?
      (
        <React.Fragment>
        <Alert variant="warning">
        <small>Stake {this.state.BancorConnectorType}: &nbsp; {fromWei(String(this.state.BNTAmount))}, &nbsp; {this.props.from}: &nbsp; {this.state.payAmount}</small>
        </Alert>

        <Alert variant="info">
        <small>Get {this.state.directionAmount}
        &thinsp;
        <a href={EtherscanLink + "token/" + this.state.smartTokenAddress}target="_blank" rel="noopener noreferrer">{this.state.tokenInfo['smartTokenSymbol']}</a>,
        &thinsp; which is the relay token for the &thinsp;
        <a href={EtherscanLink + "token/" + this.state.tokenAddress} target="_blank" rel="noopener noreferrer">{this.props.from}{this.state.tokenInfo['connectorType'] !== 'USDB' ? <>({this.state.tokenInfo['connectorType']})</> : null}</a>
        &thinsp;
        token</small>
        </Alert>

        {
          this.state.tokenInfo && this.state.tokenInfo.hasOwnProperty('conversionFee') && this.state.tokenInfo.hasOwnProperty('connectorType')
          ?
          (
            <Alert variant="info">
            <small>
            Pool earns trade fee {this.state.tokenInfo['conversionFee']}% ({<UserInfo label="?" info={`The pool relay token holders of ${this.props.from}/${this.state.tokenInfo['connectorType']} earn the x% converter fee of every trade of ${this.props.from}`}/>})
            from converter: {<a href={EtherscanLink + "address/" + this.state.tokenInfo['converterAddress']}target="_blank" rel="noopener noreferrer">{this.state.tokenInfo['converterAddress'].slice(0, -34)}...</a>}
            </small>
            </Alert>
          )
          :
          (null)
        }
        {
          this.state.tokenInfo && this.state.tokenInfo.hasOwnProperty('connectorBancorReserve') && this.state.tokenInfo.hasOwnProperty('connectorOriginalReserve') && this.state.tokenInfo.hasOwnProperty('tokenDecimals')
          ?
          (
            <Alert variant="info">
            <small>Pool liquidity depth:(<UserInfo label="?" info="ROI per Trade per Liquidity Depth (LD): The higher your share (holding %) of the pool’s relay tokens, the larger your earnings-per-trade of the token. This explains what the ROI per Trade *would be* for the given LD now"/>)</small>
            <br/>
            <small>{this.props.from}: &nbsp; {fromWeiByDecimalsInput(this.state.tokenInfo["tokenDecimals"], String(this.state.tokenInfo["connectorOriginalReserve"]))}</small>
            <br/>
            <small>{this.state.tokenInfo["connectorType"]}: &nbsp;{fromWei(String(this.state.tokenInfo["connectorBancorReserve"]))}</small>
            </Alert>
          )
          :
          (null)
        }

        <Alert variant="primary">
        <small>Current supply of {this.state.tokenInfo["smartTokenSymbol"]} is {fromWei(String(this.state.smartTokenSupplyOriginal.toFixed(0)))}</small>
        <br/>
        <small>Your share is {this.state.currentUserPercent} %</small>
        </Alert>

        <Alert variant="primary">
        <small>Your share will be {this.state.newUserPercent} % from:</small>
        <br/>
        <small>new supply {fromWei(String(this.state.newSmartTokenSupply.toFixed(0)))}</small>
        </Alert>

        {
          this.props.accounts
          ?
          (
            <React.Fragment>
            {
              Number(fromWei(String(this.state.connectorAmount))) > Number(fromWei(String(this.state.userConnectorBalance)))
              ?
              (
                <small><Alert variant="danger">Get the <NavLink to="/trade">{this.props.from}</NavLink> you need ({fromWei(String(this.state.connectorAmount))})</Alert></small>
              )
              :
              (null)
            }
            {
              Number(fromWei(String(this.state.BNTAmount))) > Number(fromWei(String(this.state.userBNTBalance)))
              ?
              (
                <small><Alert variant="danger">Get the <NavLink to="/trade">{this.state.tokenInfo["smartTokenSymbol"]}</NavLink> you need ({fromWei(String(this.state.BNTAmount))}) </Alert></small>
              )
              :
              (null)
            }
            </React.Fragment>
          )
          :
          (null)
        }

        {/* Buttons */}
        <br/>
        <Card className="text-center">
        <Card.Body>
        {
          !this.state.isBlackListed
          ?
          (
            <Button variant="contained" color="primary" onClick={() => this.approveAndPool()}>Fund</Button>
          )
          :
          (
            <Alert style={{ backgroundColor:"#F5F524" }}>{this.props.from} &thinsp; converter needs an upgrade to enable pool</Alert>
          )
        }
        </Card.Body>
        </Card>
        </React.Fragment>
      )
      :
      (
        <React.Fragment>
        {
          this.state.isLoadData
          ?
          (
            <Pending/>
          )
          :
          (null)
        }
        </React.Fragment>
      )
    }
    </React.Fragment>
    )
  }
}

export default Fund
