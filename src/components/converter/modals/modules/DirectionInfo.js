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
    fromInDai:undefined
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

  getValueInDAI = async (objPropsFrom, web3) => {
    const bancorNetwork = web3.eth.Contract(ABIBancorNetwork, BancorNetwork)
    const path = getPath(this.props.from, "DAI", this.props.bancorTokensStorageJson, objPropsFrom)

    let amountReturn = await bancorNetwork.methods.getReturnByPath(
      path,
      toWei(String(this.props.directionAmount))
    ).call()

    if(amountReturn){
      amountReturn = Number(fromWei(hexToNumberString(amountReturn[0]._hex)))
    }else{
      amountReturn = 0
    }
    return amountReturn
  }

  // set state addreses to and from and user balance from
  setTokensData = async () => {
    if(this.props.to && this.props.from && this.props.web3 && this.props.accounts){
      const { objPropsFrom, sendFrom, sendTo } = getDirectionData(
        this.props.from,
        this.props.to,
        this.props.bancorTokensStorageJson,
        this.props.useERC20AsSelectFrom,
        this.props.useERC20AsSelectTo
      )
      const web3 = this.props.web3
      const { userBalanceFrom, balanceOfTo } = await this.getTokensBalance(sendFrom, sendTo, web3)
      const fromInDai = await this.getValueInDAI(objPropsFrom, web3)

      this.setState({ sendFrom, sendTo, userBalanceFrom, balanceOfTo, fromInDai })
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
      Your balance of {this.props.from} {this.state.userBalanceFrom}
      </Badge>
      <Badge variant="Light">
      Your balance of {this.props.to}: &nbsp; {this.state.balanceOfTo}
      </Badge>
      <Badge variant="Light">
      You will pay in DAI rate:  {this.state.fromInDai}
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
