import React, { Component } from 'react'
import { Alert } from "react-bootstrap"

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
    userBalanceFrom:undefined
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
      if(this.props.from !== "ETH"){
        const token = web3.eth.Contract(ABISmartToken, sendFrom)
        userBalanceFrom = await token.methods.balanceOf(this.props.accounts[0]).call()
        userBalanceFrom = fromWei(hexToNumberString(userBalanceFrom._hex))
      }else{
        userBalanceFrom = await web3.eth.getBalance((this.props.accounts[0]))
        userBalanceFrom = fromWei(String(userBalanceFrom))
      }
      this.setState({ sendFrom, sendTo, userBalanceFrom })
    }
  }

  render(){
   return(
    <React.Fragment>
    {
      /*Token info*/
      this.state.sendTo && this.state.sendFrom && this.props.directionAmount > 0
      ?
      (<Alert variant="info">
      Etherscan: { <a href={EtherscanLink + "token/" + this.state.sendTo} target="_blank" rel="noopener noreferrer"> {this.props.to}</a> }
      &nbsp; Your balance of {this.props.from} {this.state.userBalanceFrom}
      </Alert>)
      :
      (null)
    }
    </React.Fragment>
   )
  }
}

export default DirectionInfo
