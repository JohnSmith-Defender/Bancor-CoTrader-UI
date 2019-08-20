import React, { Component } from 'react'
import { Card, Badge } from "react-bootstrap"
import { hexToNumberString, fromWei, toWei } from 'web3-utils'
import {
  ABISmartToken,
  EtherscanLink,
  ABIBancorNetwork,
  BancorNetwork,
} from '../../../../config'
import getDirectionData from '../../../../service/getDirectionData'
import getPath from '../../../../service/getPath'


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

  getRateInfo = async (objPropsFrom, objPropsTo, web3) => {
    const bancorNetwork = web3.eth.Contract(ABIBancorNetwork, BancorNetwork)
    const pathFrom = getPath(this.props.from, "DAI", this.props.bancorTokensStorageJson, objPropsFrom)
    const pathTo = getPath(this.props.to, "DAI", this.props.bancorTokensStorageJson, objPropsTo)
    const pathFromTo = getPath(this.props.from, this.props.to, this.props.bancorTokensStorageJson, objPropsFrom, objPropsTo)

    // get rate from in DAI
    let amountReturnFrom = await bancorNetwork.methods.getReturnByPath(
      pathFrom,
      toWei(String(1))
    ).call()

    if(amountReturnFrom){
      amountReturnFrom = Number(fromWei(hexToNumberString(amountReturnFrom[0]._hex)))
    }else{
      amountReturnFrom = 0
    }

    // get rate to in DAI
    let amountReturnTo = await bancorNetwork.methods.getReturnByPath(
      pathTo,
      toWei(String(1))
    ).call()

    if(amountReturnTo){
      amountReturnTo = Number(fromWei(hexToNumberString(amountReturnTo[0]._hex)))
    }else{
      amountReturnTo = 0
    }

    // get rate from/to
    let amountReturnFromTo = await bancorNetwork.methods.getReturnByPath(
      pathFromTo,
      toWei(String(1))
    ).call()

    if(amountReturnFromTo){
      amountReturnFromTo = Number(fromWei(hexToNumberString(amountReturnFromTo[0]._hex)))
    }else{
      amountReturnFromTo = 0
    }

    // get Total trade value
    let totalTradeValue
    if(this.props.amountReturn > 0){
      let value = await bancorNetwork.methods.getReturnByPath(
        pathTo,
        toWei(String(this.props.amountReturn))
      ).call()

      if(value){
        totalTradeValue = Number(fromWei(hexToNumberString(value[0]._hex)))
      }else{
        totalTradeValue = 0
      }
    }

    return { amountReturnFrom, amountReturnTo, amountReturnFromTo, totalTradeValue }
  }

  // set state addreses to and from and user balance from
  setTokensData = async () => {
    if(this.props.to && this.props.from && this.props.web3 && this.props.accounts){
      const { objPropsFrom, objPropsTo, sendFrom, sendTo } = getDirectionData(
        this.props.from,
        this.props.to,
        this.props.bancorTokensStorageJson,
        this.props.useERC20AsSelectFrom,
        this.props.useERC20AsSelectTo
      )
      const web3 = this.props.web3
      const { userBalanceFrom, balanceOfTo } = await this.getTokensBalance(sendFrom, sendTo, web3)
      const { amountReturnFrom, amountReturnTo, amountReturnFromTo, totalTradeValue } = await this.getRateInfo(objPropsFrom, objPropsTo, web3)

      this.setState({ sendFrom, sendTo, userBalanceFrom, balanceOfTo, amountReturnFrom, amountReturnTo, amountReturnFromTo, totalTradeValue })
    }
  }

  render(){
   return(
    <React.Fragment>
    {
      /*Token info*/
      this.state.sendTo && this.state.sendFrom && this.props.directionAmount > 0
      ?
      (
      <Card className="text-center">
      <Card.Text><Badge variant="primary">Additional info</Badge></Card.Text>
      <Badge variant="Light">
      Etherscan: { <a href={EtherscanLink + "token/" + this.state.sendTo} target="_blank" rel="noopener noreferrer"> {this.props.to}</a> }
      </Badge>
      <Badge variant="Light">
      Your balance of {this.props.from}: {this.state.userBalanceFrom}
      </Badge>
      <Badge variant="Light">
      Your balance of {this.props.to}: &nbsp; {this.state.balanceOfTo}
      </Badge>
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
