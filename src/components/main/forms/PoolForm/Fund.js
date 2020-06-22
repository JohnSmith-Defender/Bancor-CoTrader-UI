// TODO DRY

import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { hexToNumberString, toWei, fromWei } from 'web3-utils'

import {
  fromWeiByDecimals,
  fromWeiByDecimalsInput,
  toWeiByDecimals
} from '../../../../service/weiByDecimals'

import {
  ABISmartToken,
  BNTToken,
  USDBToken,
  EtherscanLink,
  CoTraderPoolPortal,
  CoTraderPoolPortalABI,
  ABILiquidityPoolV1Converter
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
    bancorAmount:0,
    connectorAmount:0,
    customBancorAmount:0,
    customConnectorAmount:0,
    smartTokenAddress:null,
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
    isBlackListed:false,
    converterVersion : null,
    isRequireApproval:false,
    isBNTUnlocked:false,
    isConnectorUnlocked:false,
    stopCheckApprove:false
    }
  }


  // helper for setState
  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  // Update info by input change
  componentDidUpdate = async (prevProps, prevState) => {
    if(prevProps.from !== this.props.from || prevState.directionAmount !== this.state.directionAmount){
      this.setState({
        bancorAmount:0,
        payAmount:0
      })
    }

    if(prevProps.from !== this.props.from && this.props.from){
       this.getConverterVersion()
       this.checkRequireApproval()
       const BancorConnectorType = await this.getBancorConnectorType()
       this.setState({ stopCheckApprove:true, BancorConnectorType })
    }
  }

  // Calculate connectors amount by pool amount
  calculateCostByPoolAmount = async () => {
    // Update connectors info by input change
    if(Number(this.state.directionAmount) > 0 && this.props.from){
      this.setState({ isLoadData:true })
      const { bancorAmount, connectorAmount } = await this.calculateConnectorBySmartTokenAmount()

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
        userConnectorBalance } = await this.getRelayInfo(BancorConnectorType)

      const payAmount = await fromWeiByDecimals(tokenAddress, connectorAmount, this.props.web3)

      // check if pool converter in BlackList
      const isBlackListed = this.checkBlackList(tokenInfo["converterAddress"])

      this.setState({
        tokenInfo,
        bancorAmount,
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
      }
    else{
       this.setState({
       bancorAmount:0,
       payAmount:0
       })
    }
  }

  // return bool if converter black listed or not
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

  // return user pool % of total pool supply
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
    const tokenData = this.props.getInfoBySymbol()
    const smartTokenAddress = tokenData[3]
    const amount = toWei(String(this.state.directionAmount))
    const poolPortal = new this.props.web3.eth.Contract(CoTraderPoolPortalABI,CoTraderPoolPortal)

    try{
       let { bancorAmount,  connectorAmount } = await poolPortal.methods.getBancorConnectorsAmountByRelayAmount(
        amount,
        smartTokenAddress
       ).call()

       bancorAmount = hexToNumberString(bancorAmount._hex)
       connectorAmount = hexToNumberString(connectorAmount._hex)
       return { bancorAmount,  connectorAmount }
     }catch(e){
       alert("Error, check the console")
       console.log("error ", e)
       return {bancorAmount:0, connectorAmount:0}
    }
  }

  // update version of current selected converter address
  getConverterVersion = async () => {
    const tokenInfo = this.props.getInfoBySymbol()
    const converterVersion = tokenInfo[5].converterVersion
    this.setState({ converterVersion })
  }


  checkRequireApproval = async () => {
    // no need call this function, if user not connected
    if(this.props.accounts){
      const web3 = this.props.web3
      // get additional info
      const tokenInfo = this.props.getInfoBySymbol()
      const converterAddress = tokenInfo[1]
      const bancorConnectorAddress = this.state.BancorConnectorType === "USDB" ? USDBToken : BNTToken
      const connectorAddress = tokenInfo[2]
      // get contracts
      const bntContract = new web3.eth.Contract(ABISmartToken, bancorConnectorAddress)
      const connectorContract = new web3.eth.Contract(ABISmartToken, connectorAddress)
      // get allowance
      const bntAllowance = await bntContract.methods.allowance(this.props.accounts[0], converterAddress).call()
      const connectorAllowance = await connectorContract.methods.allowance(this.props.accounts[0], converterAddress).call()

      // check if BNT and Connectors unlocked
      const isBNTUnlocked = Number(fromWei(bntAllowance.toString())) > 10000000000000 ? true : false
      const isConnectorUnlocked = Number(fromWei(connectorAllowance.toString())) > 10000000000000 ? true : false

      // update states
      if(isBNTUnlocked && isConnectorUnlocked){
        this.setState({
          isRequireApproval:false,
          isBNTUnlocked,
          isConnectorUnlocked
        })
      }else{
        this.setState({
          isRequireApproval:true,
          isBNTUnlocked,
          isConnectorUnlocked
        })
      }
    }
  }

  // Batch request for unlock connectors and add reserve
  // Approvewith max AMOUNT
  batchApprove = async () => {
     // get web3 and create batch
     const web3 = this.props.web3
     let batch = new web3.BatchRequest()

     // get additional info
     const tokenInfo = this.props.getInfoBySymbol()
     const converterAddress = tokenInfo[1]
     const bancorConnectorAddress = this.state.BancorConnectorType === "USDB" ? USDBToken : BNTToken
     const bnt = new this.props.web3.eth.Contract(ABISmartToken, bancorConnectorAddress)
     const connectorAddress = tokenInfo[2]
     const connector = new this.props.web3.eth.Contract(ABISmartToken, connectorAddress)

     // Prepare transaction data
     const commonData = {
       "from": this.props.accounts[0],
       "value": "0x0"
     }

     // Approve BNT if BNT not unlocked
     if(!this.state.isBNTUnlocked){
       const approveBancorData = bnt.methods.approve(
         converterAddress,
         toWei("10000000000000000000000000000000000000")
       ).encodeABI({from: this.props.accounts[0]})

       const approveBancor = {
         "to": bancorConnectorAddress,
         "data": approveBancorData,
         ...commonData
       }

       // add additional request reset approve for case if approved alredy BNT or USDB
       // because BNT not allow do new approve, if alredy approved
       if(bancorConnectorAddress === BNTToken || bancorConnectorAddress === USDBToken){
         let bancorApproved = await bnt.methods.allowance(this.props.accounts[0], converterAddress).call()
         bancorApproved = fromWei(bancorApproved.toString())

         if(bancorApproved > 0){
           const resetApproveData = bnt.methods.approve(
             converterAddress,
             0
           ).encodeABI({from: this.props.accounts[0]})

           const resetApprove = {
             "to": bancorConnectorAddress,
             "data": resetApproveData,
             ...commonData
           }
           // add reset approve
           batch.add(web3.eth.sendTransaction.request(resetApprove, () => console.log("ResetBancorApprove")))
         }
       }
       // add approve BNT
       batch.add(web3.eth.sendTransaction.request(approveBancor, () => console.log("Approve Bancor")))
     }

     // Approve Connector if Connector not unlocked
     if(!this.state.isConnectorUnlocked){
       const approveConnectorData = connector.methods.approve(
         converterAddress,
         toWei("10000000000000000000000000000000000000")
       ).encodeABI({from: this.props.accounts[0]})

       const approveConnector = {
         "to": connectorAddress,
         "data": approveConnectorData,
         ...commonData
       }
       // add approve connector
       batch.add(web3.eth.sendTransaction.request(approveConnector, () => console.log("Approve connector")))
     }

     // execude batch request
     batch.execute()

     const interval = setInterval(() => {
       console.log("Start check")
       this.checkRequireApproval()
       if(!this.state.isRequireApproval || this.setState.stopCheckApprove)
        clearInterval(interval)
     }, 10000)
  }


  // for version < 28
  fund = async () => {
    const bancorGasLimit = await getBancorGasLimit()
    const gasPrice = Number(bancorGasLimit) < 6000000000 ? bancorGasLimit : 6000000000 // 6gwei by default
    const tokenInfo = this.props.getInfoBySymbol()
    const converter = tokenInfo[0]

    converter.methods.fund(toWei(String(this.state.directionAmount)))
    .send({from: this.props.accounts[0], gasPrice})
  }

  // for versions >= 28
  addLiquidity = async () => {
    const tokenInfo = this.props.getInfoBySymbol()
    const converterAddress = tokenInfo[1]
    const bancorGasLimit = await getBancorGasLimit()
    const gasPrice = Number(bancorGasLimit) < 30000000000 ? bancorGasLimit : 30000000000 // 30 gwei by default
    const bancorConnectorAddress = this.state.BancorConnectorType === "USDB" ? USDBToken : BNTToken
    const connectorAddress = tokenInfo[2]
    const converter = new this.props.web3.eth.Contract(ABILiquidityPoolV1Converter, converterAddress)
    const bancorAmountWEI = await toWeiByDecimals(bancorConnectorAddress, this.state.customBancorAmount)
    const connectorAmountWEI = await toWeiByDecimals(connectorAddress, this.state.customConnectorAmount)

    converter.methods.addLiquidity(
      [bancorConnectorAddress, connectorAddress],
      [bancorAmountWEI, connectorAmountWEI],
      1).send({from: this.props.accounts[0], gasPrice})
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
          !this.state.isLoadData && this.state.converterVersion
          ?
          (
            <>
            {
              this.state.converterVersion >= 28
              ?
              (
                <>
                <Form.Text className="text-muted">
                  Enter { this.state.BancorConnectorType } amount
                </Form.Text>
                <Form.Control
                name="customBancorAmount"
                value={this.state.customBancorAmount}
                onChange={e => this.change(e)}
                type="number" min="1"
                />
                <br/>
                <Form.Text className="text-muted">
                  Enter { this.props.from } amount
                </Form.Text>
                <Form.Control
                name="customConnectorAmount"
                value={this.state.customConnectorAmount}
                onChange={e => this.change(e)}
                type="number" min="1"
                />
                {
                  this.state.isRequireApproval
                  ?
                  (
                    <Button variant="contained" color="primary" onClick={() => this.batchApprove()}>Unlock Assets</Button>
                  )
                  :
                  (
                    <Button variant="contained" color="primary" onClick={() => this.addLiquidity()}>Add Liquidity</Button>
                  )
                }
                </>
              )
              :
              (
                <>
                <Form.Text className="text-muted">
                  Enter pool amount
                </Form.Text>
                <Form.Control
                name="directionAmount"
                value={this.state.directionAmount}
                placeholder="Enter relay amount"
                onChange={e => this.change(e)}
                type="number" min="1"
                />
                <Button variant="contained" color="primary" onClick={() => this.calculateCostByPoolAmount()}>Calculate</Button>
                <br/>
                </>
              )
            }
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
      /* Render additional info and fund button for versions < 28 */
      this.state.bancorAmount > 0 && this.state.connectorAmount > 0 && !this.state.isLoadData && this.state.converterVersion < 28
      ?
      (
        <React.Fragment>
        <Alert variant="warning">
        <small>Stake {this.state.BancorConnectorType}:
        &nbsp;
        {fromWei(String(this.state.bancorAmount))},
        &nbsp;
        {this.props.from}:
        &nbsp;
        {this.state.payAmount}
        </small>
        </Alert>

        <Alert variant="info">
        <small>Get {this.state.directionAmount}
        &thinsp;
        <a href={EtherscanLink + "token/" + this.state.smartTokenAddress}target="_blank" rel="noopener noreferrer">
        {this.state.tokenInfo['smartTokenSymbol']}</a>,
        &thinsp; which is the relay token for the &thinsp;
        <a href={EtherscanLink + "token/" + this.state.tokenAddress} target="_blank" rel="noopener noreferrer">
        {this.props.from}{this.state.tokenInfo['connectorType'] !== 'USDB' ? <>({this.state.tokenInfo['connectorType']})</> : null}</a>
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
              Number(fromWei(String(this.state.bancorAmount))) > Number(fromWei(String(this.state.userBNTBalance)))
              ?
              (
                <small><Alert variant="danger">Get the <NavLink to="/trade">{this.state.tokenInfo["smartTokenSymbol"]}</NavLink> you need ({fromWei(String(this.state.bancorAmount))}) </Alert></small>
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
            <>
            {
              this.state.isRequireApproval
              ?
              (
                <Button variant="contained" color="primary" onClick={() => this.batchApprove()}>Unlock Assets</Button>
              )
              :
              (
                <Button variant="contained" color="primary" onClick={() => this.fund()}>Fund</Button>
              )
            }
            </>
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
