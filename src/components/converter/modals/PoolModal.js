// THIS COMPONENT ALLOW USER CALL FUND AND LIQUIDATE FROM A CERTAIN CONVERTER
// TODO refactoring (Presentational and Container)
// TODO DRY

import React, { Component } from 'react'
import { Button, ButtonGroup, Alert, Form,  Modal, Badge, Card } from "react-bootstrap"
import { inject, observer } from 'mobx-react'
import { hexToNumberString, toWei, fromWei } from 'web3-utils'
import findByProps from '../../../service/findByProps'
import getWeb3ForRead from '../../../service/getWeb3ForRead'
import { ABIConverter, ABISmartToken, BNTToken, EtherscanLink } from '../../../config'
import BigNumber from 'bignumber.js'
import FakeButton from '../../templates/FakeButton'
import { Typeahead } from 'react-bootstrap-typeahead'

class PoolModal extends Component {
  constructor(props, context) {
   super(props, context)
    this.state = {
    from:undefined,
    directionAmount:0,
    ShowModal:false,
    bancorTokensStorageJson:null,
    selectFromOficial:true,
    officialSymbols:undefined,
    unofficialSymbols:undefined,
    connectorAmount:undefined,
    BNTAmount:undefined,
    isFundAction:false,
    tokenAddress:undefined,
    smartTokenAddress:undefined,
    smartTokenSupplyOriginal:0,
    smartTokenSupply:0,
    smartTokenBalance:0,
    currentUserPercent:0,
    newSmartTokenSupply:0,
    newUserPercent:0
    }
  }

  // helper for setState
  change = e => {
    if(typeof this.state[e.target.name] === "boolean"){
      this.setState({
        [e.target.name]: !this.state[e.target.name]
      })
    }else{
      this.setState({
        [e.target.name]: e.target.value
      })
    }
  }

  componentDidUpdate = async (prevProps, prevState) => {
    // Update state with tokens data
    if (prevProps.MobXStorage.bancorTokensStorageJson !== this.state.bancorTokensStorageJson) {
      const officialSymbols = this.props.MobXStorage.officialSymbols
      const unofficialSymbols = this.props.MobXStorage.unofficialSymbols
      const bancorTokensStorageJson = this.props.MobXStorage.bancorTokensStorageJson
      this.setState({
        officialSymbols,
        unofficialSymbols,
        bancorTokensStorageJson
      })
    }

    // Update connectors info by input change
    if(prevState.from !== this.state.from || prevState.directionAmount !== this.state.directionAmount){
      if(this.state.from)
        if(this.state.directionAmount > 0){
          const connectorsInfo = await this.calculateConnectorBySmartTokenAmount()
          const BNTAmount = connectorsInfo[0]
          const connectorAmount = connectorsInfo[1]
          const { smartTokenSupplyOriginal, newSmartTokenSupply, newUserPercent, smartTokenAddress, tokenAddress, currentUserPercent, smartTokenBalance } = await this.getRelayInfo()
          console.log("smartTokenBalance", smartTokenBalance)

          this.setState({ BNTAmount, connectorAmount, smartTokenAddress, smartTokenSupplyOriginal, newSmartTokenSupply, newUserPercent, tokenAddress, currentUserPercent, smartTokenBalance })
        }else{
          this.setState({ BNTAmount:0, connectorAmount:0, smartTokenAddress:undefined, smartTokenSupplyOriginal:0, newSmartTokenSupply:0, newUserPercent:0, tokenAddress:undefined, smartTokenBalance:0, currentUserPercent:0})
      }
    }
  }


  // return converter contract, converter address, connector (ERC20) token address, smart token address and smart token contract
  getInfoBySymbol = () => {
    if(this.state.from && this.state.bancorTokensStorageJson){
      const web3 = getWeb3ForRead(this.props.MobXStorage.web3)
      const tokenInfo = findByProps(this.state.bancorTokensStorageJson, 'symbol', this.state.from)[0]
      return [
        web3.eth.Contract(ABIConverter, tokenInfo.converterAddress),
        tokenInfo.converterAddress,
        tokenInfo.tokenAddress,
        tokenInfo.smartTokenAddress,
        web3.eth.Contract(ABISmartToken, tokenInfo.smartTokenAddress),
      ]
    }
  }


 // return smart token supply (old and new with input) as BN,
 // and userPercent as number and token and relay address and smartTokenBalance
 getRelayInfo = async () => {
   const info = this.getInfoBySymbol()
   const tokenAddress = info[2]
   const smartTokenAddress = info[3]
   const smartTokenContract = info[4]

   // get data for calculate user input % in relation to totalSupply
   let smartTokenSupplyOriginal = await smartTokenContract.methods.totalSupply().call()
   smartTokenSupplyOriginal = new BigNumber(smartTokenSupplyOriginal)
   let share = new BigNumber(toWei(String(this.state.directionAmount)))
   let currentUserPercent = 0
   let smartTokenBalance = 0
   const newSmartTokenSupply = smartTokenSupplyOriginal.plus(share)


   // if user connect to web3 take into account his balance
   if(this.props.MobXStorage.accounts){
     smartTokenBalance = await this.getSmartTokenBalance(this.props.MobXStorage.web3, this.props.MobXStorage.accounts[0])
     const smartTokenBalanceBN = new BigNumber(smartTokenBalance)
     // current %
     currentUserPercent = await this.calculateUserPercentFromSupply(smartTokenBalanceBN, smartTokenSupplyOriginal)
     // add to input curent user balance
     share = share.plus(smartTokenBalanceBN)
   }

   // new %
   const newUserPercent = await this.calculateUserPercentFromSupply(share, newSmartTokenSupply)
   smartTokenBalance = fromWei(String(smartTokenBalance))
   return {
     smartTokenSupplyOriginal,
     newSmartTokenSupply,
     newUserPercent,
     smartTokenAddress,
     tokenAddress,
     currentUserPercent,
     smartTokenBalance
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

 getSmartTokenBalance = async (web3, user) => {
   const info = this.getInfoBySymbol()
   const smartTokenContract = info[4]
   let smartTokenBalance = await smartTokenContract.methods.balanceOf(user).call()
   smartTokenBalance = hexToNumberString(smartTokenBalance._hex)
   return smartTokenBalance
 }

 // return BNT and ERC20 connectors amount calculated by smart token amount
 calculateConnectorBySmartTokenAmount = async () => {
   const amount = toWei(String(this.state.directionAmount))
   const converterInfo = this.getInfoBySymbol()
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

 // TEMPORARY SOLUTION UNTIL ISSUE WITH BATCHREQUEST
 approveBNT = async () => {
   const tokenInfo = this.getInfoBySymbol()
   const converterAddress = tokenInfo[1]
   console.log("converterAddress", converterAddress)

   const bnt = this.props.MobXStorage.web3.eth.Contract(ABISmartToken, BNTToken)
   bnt.methods.approve(
   converterAddress,
   this.state.BNTAmount
   ).send({from: this.props.MobXStorage.accounts[0]})
 }

 approveConnector = async () => {
   const tokenInfo = this.getInfoBySymbol()
   const converterAddress = tokenInfo[1]
   const connectorAddress = tokenInfo[2]
   const connector = this.props.MobXStorage.web3.eth.Contract(ABISmartToken, connectorAddress)
   connector.methods.approve(
   converterAddress,
   this.state.connectorAmount
   ).send({from: this.props.MobXStorage.accounts[0]})
  }




  fund = () => {
    if(this.state.directionAmount > 0){
      const converter = this.getInfoBySymbol()[0]
      const info = this.getInfoBySymbol()
      const reciver = info[1]
      console.log(reciver)
      converter.methods.fund(toWei(String(this.state.directionAmount))).send({ from:this.props.MobXStorage.accounts[0] })
    }
    else {
      alert("Please input amount")
    }
  }

  liquidate = () => {
    if(this.state.directionAmount > 0){
      const converter = this.getInfoBySymbol()[0]
      converter.methods.liquidate(toWei(String(this.state.directionAmount))).send({ from:this.props.MobXStorage.accounts[0] })
    }
    else {
      alert("Please input amount")
    }
  }

  // reset states after close modal
  closeModal = () => this.setState({
    to:undefined,
    from:undefined,
    directionAmount:0,
    ShowModal:false,
    bancorTokensStorageJson:null,
    selectToOficial:true,
    selectFromOficial:true,
    officialSymbols:undefined,
    unofficialSymbols:undefined
  })

  // TODO move this to a Presentational component
    render(){
      return(
      <React.Fragment>
      {
        this.props.MobXStorage.bancorTokensStorageJson
        ?
        (
          <Button variant="primary" size="sm" onClick={() => this.setState({ ShowModal: true })}>
          Pool
          </Button>
        )
        :
        (<Badge variant="primary">loading data...</Badge>)
      }

      <Modal
        size="lg"
        show={this.state.ShowModal}
        onHide={() => this.closeModal()}
        aria-labelledby="example-modal-sizes-title-lg"
        >
        <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
        <small>Pool</small>
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <React.Fragment>
        {
          this.state.officialSymbols && this.state.unofficialSymbols
          ?
          (
            <React.Fragment>
            <Form.Group>
            <Form.Check
            name="selectFromOficial"
            type="checkbox"
            label="Show unofficial"
            onChange={e => this.change(e)}
            />
            </Form.Group>

            {
              this.state.selectFromOficial
              ?
              (
                <Typeahead
                    labelKey="fromOfficialTokens"
                    multiple={false}
                    id="officialTokens"
                    options={this.state.officialSymbols}
                    onChange={(s) => this.setState({from: s[0]})}
                    placeholder="Choose a symbol for send"
                />
              )
              :
              (
                <Typeahead
                    labelKey="fromUnofficialTokens"
                    multiple={false}
                    id="unofficialTokens"
                    options={this.state.unofficialSymbols}
                    onChange={(s) => this.setState({from: s[0]})}
                    placeholder="Choose a symbol for send"
                />
              )
            }
            <br/>
            <Form.Control name="directionAmount" placeholder="Enter relay amount" onChange={e => this.change(e)} type="number" min="1"/>
            <br/>
            {/* Connectors info */}
            {
              this.state.BNTAmount > 0 && this.state.connectorAmount > 0
              ?
              (
                <React.Fragment>
                <Alert variant="info">
                You will receive {this.state.directionAmount} <a href={EtherscanLink + "token/" + this.state.smartTokenAddress} target="_blank" rel="noopener noreferrer">{this.state.from}BNT</a>  (the relay token for the <a href={EtherscanLink + "token/" + this.state.tokenAddress} target="_blank" rel="noopener noreferrer">{this.state.from}</a> pool)
                </Alert>

                <Alert variant="warning">
                You will pay BNT: &nbsp; {fromWei(String(this.state.BNTAmount))}, &nbsp; {this.state.from}: &nbsp; {fromWei(String(this.state.connectorAmount))}
                </Alert>

                <Alert variant="primary">
                Current supply of {this.state.from}BNT is {fromWei(String(this.state.smartTokenSupplyOriginal.toFixed(0)))},
                {
                  this.props.MobXStorage.accounts
                  ?
                  (
                    <React.Fragment>
                    Your share is {this.state.currentUserPercent} %
                    </React.Fragment>
                  )
                  :
                  (null)
                }
                </Alert>

                <Alert variant="primary">
                Your share will be {this.state.newUserPercent} % of  {fromWei(String(this.state.newSmartTokenSupply.toFixed(0)))} new supply
                </Alert>

                {
                  this.props.MobXStorage.accounts && this.state.directionAmount > this.state.smartTokenBalance
                  ?
                  (
                    <Alert variant="danger">You don't have enought balance of {this.state.from}BNT</Alert>
                  )
                  :
                  (null)
                }
                {/* Buttons */}
                <br/>
                {
                  this.props.MobXStorage.web3
                  ?
                  (
                  <ButtonGroup>
                  <Button variant={ this.state.isFundAction ? "primary":"outline-primary" }size="sm" name="isFundAction" onClick={e => this.change(e)}>Fund</Button>
                  <Button variant="outline-primary" size="sm" onClick={() => this.liquidate()}>Liguidate</Button>
                  </ButtonGroup>
                  )
                  :
                  (
                    <ButtonGroup>
                    <FakeButton info="Please connect to web3" buttonName="Fund"/>
                    <FakeButton info="Please connect to web3" buttonName="Liguidate"/>
                    </ButtonGroup>
                  )
                }
                {
                  this.state.isFundAction && this.state.BNTAmount
                  ?
                  (
                    <React.Fragment>
                    <br/>
                    <br/>
                    <Card className="text-center">
                    <Card.Body>
                    <ButtonGroup>
                    <Button variant="outline-info" size="sm" onClick={() => this.approveBNT()}>Step 1: Approve BNT</Button>
                    <Button variant="outline-info" size="sm" onClick={() => this.approveConnector()}>Step 2: Approve connector</Button>
                    <Button variant="outline-info" size="sm" onClick={() => this.fund()}>Step 3: Fund</Button>
                    </ButtonGroup>
                    <Card.Text><small>Please do not press fund button untill step 1 and 2 will be confirmed</small></Card.Text>
                    </Card.Body>
                    </Card>
                    </React.Fragment>
                  )
                  :
                  (null)
                }
                </React.Fragment>
              )
              :
              (null)
            }
            </React.Fragment>
          )
          :
          (null)
        }
        </React.Fragment>
        </Modal.Body>
      </Modal>
      </React.Fragment>
      )
    }
}

export default inject('MobXStorage')(observer(PoolModal))
