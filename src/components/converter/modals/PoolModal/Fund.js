import React, { Component } from 'react'
import { hexToNumberString, toWei, fromWei } from 'web3-utils'

import {
  ABISmartToken,
  BNTToken,
  EtherscanLink
} from '../../../../config'

import FakeButton from '../../../templates/FakeButton'
import BigNumber from 'bignumber.js'
//import getWeb3ForRead from '../../../../service/getWeb3ForRead'
import { Button, Alert, Form, Card, ButtonGroup } from "react-bootstrap"

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
    userConnectorBalance:0
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
      if(this.props.from)
        if(this.state.directionAmount > 0){
          const connectorsInfo = await this.calculateConnectorBySmartTokenAmount()
          const BNTAmount = connectorsInfo[0]
          const connectorAmount = connectorsInfo[1]

          const {
            smartTokenSupplyOriginal,
            newSmartTokenSupply,
            newUserPercent,
            smartTokenAddress,
            tokenAddress,
            currentUserPercent,
            smartTokenBalance,
            userBNTBalance,
            userConnectorBalance
          } = await this.getRelayInfo()

          this.setState({
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
            userConnectorBalance
          })
        }else{
          this.setState({
            BNTAmount:0,
            connectorAmount:0,
            smartTokenAddress:undefined,
            smartTokenSupplyOriginal:0,
            newSmartTokenSupply:0,
            newUserPercent:0,
            tokenAddress:undefined,
            smartTokenBalance:0,
            currentUserPercent:0,
            userBNTBalance:0,
            userConnectorBalance:0
          })
      }
    }
  }

  // return smart token supply (old and new with input) as BN,
  // and userPercent as number and token and relay address and smartTokenBalance
  getRelayInfo = async () => {
    const info = this.props.getInfoBySymbol()
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

      userBNTBalance = await this.props.getTokenBalance(this.props.web3, BNTToken, this.props.accounts[0])
      userConnectorBalance = await this.props.getTokenBalance(this.props.web3, tokenAddress, this.props.accounts[0])
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


  // return BNT and ERC20 connectors amount calculated by smart token amount
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

  // TEMPORARY SOLUTION UNTIL ISSUE WITH BATCHREQUEST
  approveBNT = async () => {
    const tokenInfo = this.props.getInfoBySymbol()
    const converterAddress = tokenInfo[1]
    console.log("converterAddress", converterAddress)

    const bnt = new this.props.web3.eth.Contract(ABISmartToken, BNTToken)
    bnt.methods.approve(
    converterAddress,
    this.state.BNTAmount
  ).send({from: this.props.accounts[0]})
  }

  approveConnector = async () => {
    const tokenInfo = this.props.getInfoBySymbol()
    const converterAddress = tokenInfo[1]
    const connectorAddress = tokenInfo[2]
    const connector = new this.props.web3.eth.Contract(ABISmartToken, connectorAddress)
    connector.methods.approve(
    converterAddress,
    this.state.connectorAmount
    ).send({from: this.props.accounts[0]})
   }

   fund = () => {
     if(this.state.directionAmount > 0){
       const info = this.props.getInfoBySymbol()
       const converter = info[0]
       const reciver = info[1]
       console.log(reciver)
       converter.methods.fund(toWei(String(this.state.directionAmount))).send({ from:this.props.accounts[0] })
     }
     else {
       alert("Please input amount")
     }
   }

  render(){
    return(
    <React.Fragment>
    <Form.Control name="directionAmount" placeholder="Enter relay amount" onChange={e => this.change(e)} type="number" min="1"/>
    <br/>
    {
      this.state.BNTAmount > 0 && this.state.connectorAmount > 0
      ?
      (
        <React.Fragment>
        <Alert variant="info">
        <small>You will receive {this.state.directionAmount} <a href={EtherscanLink + "token/" + this.state.smartTokenAddress} target="_blank" rel="noopener noreferrer">{this.props.from}BNT</a>  (the relay token for the <a href={EtherscanLink + "token/" + this.state.tokenAddress} target="_blank" rel="noopener noreferrer">{this.props.from}</a> pool )</small>
        </Alert>

        <Alert variant="warning">
        <small>You will pay BNT: &nbsp; {fromWei(String(this.state.BNTAmount))}, &nbsp; {this.props.from}: &nbsp; {fromWei(String(this.state.connectorAmount))}</small>
        </Alert>

        <Alert variant="primary">
        <small>Current supply of {this.props.from}BNT is {fromWei(String(this.state.smartTokenSupplyOriginal.toFixed(0)))},</small>
        {
          this.props.accounts
          ?
          (
            <React.Fragment>
            <small>Your share is {this.state.currentUserPercent} %</small>
            </React.Fragment>
          )
          :
          (null)
        }
        </Alert>

        <Alert variant="primary">
        <small>Your share will be {this.state.newUserPercent} % of  {fromWei(String(this.state.newSmartTokenSupply.toFixed(0)))} new supply</small>
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
                <small><Alert variant="danger">Insufficient {this.props.from}, You have { fromWei(String(this.state.userConnectorBalance)) }</Alert></small>
              )
              :
              (null)
            }
            {
              Number(fromWei(String(this.state.BNTAmount))) > Number(fromWei(String(this.state.userBNTBalance)))
              ?
              (
                <small><Alert variant="danger">Insufficient BNT, You have { fromWei(String(this.state.userBNTBalance)) }</Alert></small>
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
        {
          this.props.web3
          ?
          (
            <Card className="text-center">
            <Card.Body>
            <ButtonGroup>
            <Button variant="outline-primary" size="sm" onClick={() => this.approveBNT()}>Step 1: Approve BNT</Button>
            <Button variant="outline-primary" size="sm" onClick={() => this.approveConnector()}>Step 2: Approve connector</Button>
            <Button variant="outline-primary" size="sm" onClick={() => this.fund()}>Step 3: Fund</Button>
            </ButtonGroup>
            <Card.Text><small>Please do not press fund button untill step 1 and 2 will be confirmed</small></Card.Text>
            </Card.Body>
            </Card>
          )
          :
          (
            <ButtonGroup>
            <FakeButton info="Please connect to web3" buttonName="Approve"/>
            <FakeButton info="Please connect to web3" buttonName="Fund"/>
            </ButtonGroup>
          )
        }
        </React.Fragment>
      )
      :
      (null)
    }
    </React.Fragment>
    )
  }
}

export default Fund
