import React, { Component } from 'react'
import { Card, Badge, Alert } from "react-bootstrap"
import { hexToNumberString, fromWei, toWei } from 'web3-utils'
import {
  ABISmartToken,
  EtherscanLink,
  ABIBancorNetwork,
  BancorNetwork,
} from '../../../../config'
import getDirectionData from '../../../../service/getDirectionData'
import getPath from '../../../../service/getPath'
import getWeb3ForRead from '../../../../service/getWeb3ForRead'


class DirectionInfo extends Component {
  constructor(props, context) {
   super(props, context)
    this.state = {
    sendFrom:undefined,
    sendTo:undefined,
    userBalanceFrom:undefined,
    balanceOfTo:undefined,
    amountReturnFrom:undefined,
    amountReturnTo:undefined,
    amountReturnFromTo:undefined,
    totalTradeValue:undefined
  }
  }

  componentDidUpdate(prevProps, prevState){
    // Update rate by onChange
    if(prevProps.from !== this.props.from || prevProps.to !== this.props.to || prevProps.directionAmount !== this.props.directionAmount){
      this.setTokensData()
    }
  }

  // get user balance
  getTokensBalance = async (sendFrom, sendTo, web3) => {
    let userBalanceFrom
    let token
    let tokenTo
    let balanceOfTo
    if(this.props.from !== "ETH"){
      token = web3.eth.Contract(ABISmartToken, sendFrom)
      userBalanceFrom = await token.methods.balanceOf(this.props.accounts[0]).call()
      userBalanceFrom = fromWei(hexToNumberString(userBalanceFrom._hex))
      tokenTo = web3.eth.Contract(ABISmartToken, sendTo)
      balanceOfTo = await tokenTo.methods.balanceOf(this.props.accounts[0]).call()
      balanceOfTo = fromWei(hexToNumberString(balanceOfTo._hex))
    }else{
      userBalanceFrom = await web3.eth.getBalance((this.props.accounts[0]))
      userBalanceFrom = fromWei(String(userBalanceFrom))
    }

    return { userBalanceFrom, balanceOfTo }
  }

  // return rate from Bancor network
  getReturnByPath = async (path, amount, web3) => {
    const bancorNetwork = web3.eth.Contract(ABIBancorNetwork, BancorNetwork)
    let amountReturn = await bancorNetwork.methods.getReturnByPath(
      path,
      toWei(String(amount))
    ).call()

    if(amountReturn){
      amountReturn = Number(fromWei(hexToNumberString(amountReturn[0]._hex)))
    }else{
      amountReturn = 0
    }

    return amountReturn
  }

  // return from 1 in dai, to 1 in dai, from/to 1, and total trade value in DAI
  getRateInfo = async (objPropsFrom, objPropsTo, web3) => {
    const pathFrom = getPath(this.props.from, "DAI", this.props.bancorTokensStorageJson, objPropsFrom)
    const pathTo = getPath(this.props.to, "DAI", this.props.bancorTokensStorageJson, objPropsTo)
    const pathFromTo = getPath(this.props.from, this.props.to, this.props.bancorTokensStorageJson, objPropsFrom, objPropsTo)

    // get rate from in DAI for 1 token
    const amountReturnFrom = await this.getReturnByPath(pathFrom, 1, web3)
    // get rate from in DAI for 1 token
    const amountReturnTo = await this.getReturnByPath(pathTo, 1, web3)
    // get rate from/to 1 token
    const amountReturnFromTo = await this.getReturnByPath(pathFromTo, 1, web3)

    // get Total trade value
    let totalTradeValue
    if(this.props.amountReturn > 0)
      totalTradeValue = await this.getReturnByPath(pathTo, this.props.amountReturn, web3)

    return { amountReturnFrom, amountReturnTo, amountReturnFromTo, totalTradeValue }
  }

  // set state addreses to and from and user balance, and direction rate data
  setTokensData = async () => {
    if(this.props.to && this.props.from){
      const { objPropsFrom, objPropsTo, sendFrom, sendTo } = getDirectionData(
        this.props.from,
        this.props.to,
        this.props.bancorTokensStorageJson,
        this.props.useERC20AsSelectFrom,
        this.props.useERC20AsSelectTo
      )
      const web3 = getWeb3ForRead(this.props.web3)
      const { userBalanceFrom, balanceOfTo } = this.props.accounts ? await this.getTokensBalance(sendFrom, sendTo, web3) : { userBalanceFrcom:0, balanceOfTo:0 }
      const { amountReturnFrom, amountReturnTo, amountReturnFromTo, totalTradeValue } = await this.getRateInfo(objPropsFrom, objPropsTo, web3)

      this.setState({ sendFrom, sendTo, userBalanceFrom, balanceOfTo, amountReturnFrom, amountReturnTo, amountReturnFromTo, totalTradeValue })
    }
  }

  render(){
   return(
    <React.Fragment>
    {
      this.props.accounts && this.props.directionAmount > this.state.userBalanceFrom
      ?
      (
        <Alert variant="danger">You don't have enought balance of {this.props.from}</Alert>
      )
      :
      (null)
    }
    {
      this.state.sendTo && this.state.sendFrom && this.props.directionAmount > 0
      ?
      (
      <Card className="text-center">
      <Card.Text><Badge variant="primary">Additional info</Badge></Card.Text>
      <Badge variant="Light">
      Etherscan: { <a href={EtherscanLink + "token/" + this.state.sendTo} target="_blank" rel="noopener noreferrer"> {this.props.to}</a> }
      </Badge>
      {
        this.props.accounts
        ?
        (
          <React.Fragment>
          <Badge variant="Light">
          Your balance of {this.props.from}: {this.state.userBalanceFrom}
          </Badge>
          <Badge variant="Light">
          Your balance of {this.props.to}: &nbsp; {this.state.balanceOfTo}
          </Badge>
          </React.Fragment>
        )
        :
        (null)
      }
      <Badge variant="Light">
      Total trade value $: {this.state.totalTradeValue}
      </Badge>
      <Badge variant="Light">
      1 {this.props.from} per $: {this.state.amountReturnFrom}
      </Badge>
      <Badge variant="Light">
      1 {this.props.to} per $: {this.state.amountReturnTo}
      </Badge>
      <Badge variant="Light">
      1 {this.props.from} per {this.props.to}: {this.state.amountReturnFromTo}
      </Badge>
      </Card>
      )
      :
      (null)
    }
    </React.Fragment>
   )
  }
}

export default DirectionInfo
