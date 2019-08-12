import React, { Component } from 'react'
import { Card, Badge } from "react-bootstrap"

import { hexToNumberString, fromWei } from 'web3-utils'

import {
  ABISmartToken,
  EtherscanLink
} from '../../../../config'

import getDirectionData from '../../../../service/getDirectionData'


class DirectionInfo extends Component {
  constructor(props, context) {
   super(props, context)
    this.state = {
    sendFrom:undefined,
    sendTo:undefined,
    userBalanceFrom:undefined,
    balanceOfTo:undefined
  }
  }

  componentDidUpdate(prevProps, prevState){
    // Update rate by onChange
    if(prevProps.from !== this.props.from || prevProps.to !== this.props.to || prevProps.directionAmount !== this.props.directionAmount){
      this.setTokensData()
    }
  }

  // set state addreses to and from and user balance from
  setTokensData = async () => {
    if(this.props.to && this.props.from && this.props.web3 && this.props.accounts){
      const { sendFrom, sendTo } = getDirectionData(
        this.props.from,
        this.props.to,
        this.props.bancorTokensStorageJson,
        this.props.useERC20AsSelectFrom,
        this.props.useERC20AsSelectTo
      )

      const web3 = this.props.web3
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

      this.setState({ sendFrom, sendTo, userBalanceFrom, balanceOfTo })
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
