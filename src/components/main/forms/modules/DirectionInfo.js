import React, { Component } from 'react'
import { fromWei } from 'web3-utils'
import { fromWeiByDecimalsInput, toWeiByDecimalsInput } from '../../../../service/weiByDecimals'
import { Alert } from "react-bootstrap"
import {
  ABISmartToken,
  EtherscanLink,
  ABIBancorNetwork,
  StableSymbol
} from '../../../../config'

import getDirectionData from '../../../../service/getDirectionData'
import getDecimals from '../../../../service/getDecimals'
import getPath from '../../../../service/getPath'
import getWeb3ForRead from '../../../../service/getWeb3ForRead'
import getBancorContractByName from '../../../../service/getBancorContractByName'


import Pending from '../../../templates/Spiners/Pending'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'

class DirectionInfo extends Component {
  constructor(props, context) {
   super(props, context)
    this.state = {
      sendFrom:undefined,
      sendTo:undefined,
      userBalanceFrom:0,
      balanceOfTo:0,
      amountReturnFrom:0,
      oneToInUSD:0,
      amountReturnFromTo:0,
      totalTradeValue:0,
      oneFromInUSD:0,
      slippage:0,
      loadData:false,
      tokenInfoTo:[],
      tokenInfoFrom:[],
      fromDecimals:18,
      toDecimals:18,
      rateToFrom:0
  }
  }

  componentDidUpdate(prevProps, prevState){
    // Update rate by onChange
    if(prevProps.from !== this.props.from || prevProps.to !== this.props.to || prevProps.directionAmount !== this.props.directionAmount || prevProps.amountReturn !== this.props.amountReturn){
      this.setTokensData()
    }
  }

  // get user balance
  getTokensBalance = async (sendFrom, sendTo, fromDecimals, toDecimals, web3) => {
    let userBalanceFrom
    let token
    let tokenTo
    let balanceOfTo

    if(this.props.from !== "ETH"){
      token = new web3.eth.Contract(ABISmartToken, sendFrom)
      userBalanceFrom = await token.methods.balanceOf(this.props.accounts[0]).call()
      userBalanceFrom = fromWeiByDecimalsInput(fromDecimals, userBalanceFrom)
    }else{
      userBalanceFrom = await web3.eth.getBalance((this.props.accounts[0]))
      userBalanceFrom = fromWei(String(parseFloat(userBalanceFrom).toFixed()))
    }

    if(this.props.to !== "ETH"){
      tokenTo = new web3.eth.Contract(ABISmartToken, sendTo)
      balanceOfTo = await tokenTo.methods.balanceOf(this.props.accounts[0]).call()
      balanceOfTo = fromWeiByDecimalsInput(toDecimals, balanceOfTo)
    }else{
      balanceOfTo = await web3.eth.getBalance((this.props.accounts[0]))
      balanceOfTo = fromWei(String(parseFloat(balanceOfTo).toFixed()))
    }

    return { userBalanceFrom, balanceOfTo }
  }

  // return rate from Bancor network and convert result from wei
  // take into account decimals
  getReturnByPath = async (path, amount, web3, fromDecimals, toDecimals) => {
    const BancorNetwork = await getBancorContractByName("BancorNetwork")
    const bancorNetwork = new web3.eth.Contract(ABIBancorNetwork, BancorNetwork)
    const amountSend = toWeiByDecimalsInput(fromDecimals, String(parseFloat(amount).toFixed(6)))

    let amountReturn = await bancorNetwork.methods.getReturnByPath(
      path,
      amountSend
    ).call()
    if(amountReturn){
      amountReturn = fromWeiByDecimalsInput(toDecimals, amountReturn[0])
    }else{
      amountReturn = 0
    }
    return amountReturn
  }

  // return rate in USDB(USDB) total trade value, slippage, average
  getRateInfo = async (objPropsFrom, objPropsTo, directionAmount, amountReturn, fromDecimals, toDecimals, web3) => {
    const pathFrom = getPath(this.props.from, StableSymbol, this.props.bancorTokensStorageJson, objPropsFrom)
    // const pathTo = getPath(this.props.to, "DAI", this.props.bancorTokensStorageJson, objPropsTo)
    const pathFromTo = getPath(this.props.from, this.props.to, this.props.bancorTokensStorageJson, objPropsFrom, objPropsTo)
    // get rate for from in DAI
    const amountReturnFrom = await this.getReturnByPath(pathFrom, directionAmount, web3, fromDecimals, 18)
    // get rate for from/to
    const amountReturnFromTo = await this.getReturnByPath(
      pathFromTo,
      directionAmount,
      web3,
      fromDecimals,
      toDecimals
    )

    // get rate in DAI for from 1 token (NOT USED)
    // Uncoment when this will be need
    const oneFromInUSD = 0 //await this.getReturnByPath(pathFrom, 1, web3, this.state.fromDecimals, 18)
    // get rate in DAI for 1 to token
    const oneToInUSD = 0 //await this.getReturnByPath(pathTo, 1, web3, this.state.toDecimals, 18)

    // to : from
    const rateToFrom = this.props.amountReturn / this.props.directionAmount

    const totalTradeValue = amountReturnFrom

    const slippage = await this.calculateSlippage(pathFromTo, directionAmount, fromDecimals, toDecimals, web3)

    return {
      amountReturnFrom,
      amountReturnFromTo,
      totalTradeValue,
      oneFromInUSD,
      oneToInUSD,
      slippage,
      rateToFrom,
     }
  }


  calculateSlippage = async (pathFromTo, directionAmount, fromDecimals, toDecimals, web3) => {
   let slippage
   try{
    const tinyDiv = directionAmount < 0.001 ? 10 : 1000
    // formula
    // tinyTrade = useroneFromInUSDFromAmount  / tinyDiv
    const tinyTrade = Number(directionAmount) / tinyDiv
    // tinyTradeRate = tinyTrade / userOuputAmountFromTinyTrade
    const outputAmountFromTinyTrade = await this.getReturnByPath(
      pathFromTo,
      tinyTrade,
      web3,
      fromDecimals,
      toDecimals
    )

    const tinyTradeRate = tinyTrade / outputAmountFromTinyTrade
    // realTradeRate = useroneFromInUSDFromAmount / userOuputAmountFromRealTrade
    const ouputAmountFromRealTrade = await this.getReturnByPath(
      pathFromTo,
      directionAmount,
      web3,
      fromDecimals,
      toDecimals
    )

    const realTradeRate = Number(directionAmount) / ouputAmountFromRealTrade
    // slippage% = (1 - realTradeRate / tinyTradeRate) * 100
    slippage = (1 - realTradeRate / tinyTradeRate) * 100
    slippage = Math.abs(parseFloat(slippage).toFixed(6))
  }catch(e){
    slippage = 0
  }
    return slippage
  }

  // update states
  setTokensData = async () => {
  if(this.props.to && this.props.from && this.props.from !== this.props.to && this.props.directionAmount > 0 && this.props.amountReturn > 0){
    this.setState({ loadData:true })

    const { objPropsFrom, objPropsTo, tokenInfoFrom, tokenInfoTo, sendFrom, sendTo } = getDirectionData(
      this.props.from,
      this.props.to,
      this.props.bancorTokensStorageJson,
      this.props.useERC20AsSelectFrom,
      this.props.useERC20AsSelectTo
    )
    const { fromDecimals, toDecimals } = getDecimals(tokenInfoFrom, tokenInfoTo)

    const web3 = getWeb3ForRead(this.props.web3)

    const { userBalanceFrom, balanceOfTo } = this.props.accounts ? await this.getTokensBalance(sendFrom, sendTo, fromDecimals, toDecimals, web3) : { userBalanceFrcom:0, balanceOfTo:0 }

    const {
      amountReturnFrom,
      amountReturnFromTo,
      totalTradeValue,
      oneFromInUSD,
      oneToInUSD,
      slippage,
      rateToFrom
    } = await this.getRateInfo(objPropsFrom, objPropsTo, this.props.directionAmount, this.props.amountReturn, fromDecimals, toDecimals, web3)

    this.setState({
      sendFrom,
      sendTo,
      userBalanceFrom,
      balanceOfTo,
      amountReturnFrom,
      amountReturnFromTo,
      totalTradeValue,
      oneFromInUSD,
      oneToInUSD,
      slippage,
      tokenInfoTo,
      tokenInfoFrom,
      rateToFrom,
      fromDecimals,
      toDecimals,
      loadData:false
     })
    }
  }

  render(){
   return(
    <React.Fragment>
    {
      this.state.loadData
      ?
      (<Pending/>)
      :
      (null)
    }

    {
      this.state.sendTo && this.state.sendFrom && this.props.directionAmount > 0 && this.props.from !== this.props.to
      ?
      (
      <React.Fragment>
      {
        this.props.accounts && this.props.directionAmount > Number(this.state.userBalanceFrom)
        ?
        (
          <Alert variant="danger">You don't have enough {this.props.from}</Alert>
        )
        :
        (null)
      }

      <Paper style={{padding: '15px'}}>
      <Chip label="Additional info" style={{marginBottom: '15px'}} variant="outlined" color="primary"/>
        <Typography component="div">
          <small>Etherscan:
          <strong>{ <a className={'text_blue'} href={EtherscanLink + "token/" + this.state.sendTo} target="_blank" rel="noopener noreferrer"> {this.props.to}</a> }</strong>,
          <strong>{ <a className={'text_blue'} href={EtherscanLink + "token/" + this.state.sendFrom} target="_blank" rel="noopener noreferrer"> {this.props.from}</a> }</strong>
          </small>
        </Typography>

        {
        this.props.accounts
        ?
        (
          <React.Fragment>
          <Typography component="div">
          <small>Your balance of {this.props.from}: <strong className={'text_blue'}>{parseFloat(this.state.userBalanceFrom).toFixed(6)}</strong></small>
          </Typography>
          <Typography component="div">
          <small>Your balance of {this.props.to}: <strong className={'text_blue'}>{parseFloat(this.state.balanceOfTo).toFixed(6)}</strong></small>
          </Typography>
          </React.Fragment>
        )
        :
        (null)
      }

       {/*Rate from and to in usd (dai) not used*/}
       {/*<Typography component="div">
        <small>USD/{this.props.from}: <strong className={'text_blue'}>${parseFloat(this.state.oneFromInUSD).toFixed(6)}</strong></small>
       </Typography>*/}

       {/*<Typography component="div">
         <small>USD/{this.props.to} <strong className={'text_blue'}>${this.state.oneToInUSD}</strong></small>
       </Typography>*/}

       {/*Need fix*/}
       {/*<Typography component="div">
        <small>Slippage: <strong className={'text_blue'}>{this.state.slippage} %</strong></small>
       </Typography>*/}

       <Typography component="div">
         <small>Trade value: <strong className={'text_blue'}>${parseFloat(this.state.totalTradeValue).toFixed(6)}</strong></small>
       </Typography>

       <Typography component="div">
         <small>Rate {this.props.from}/{this.props.to} <strong className={'text_blue'}>{this.state.rateToFrom}</strong></small>
       </Typography>

        {/*Need fix*/}
       {/*<Typography component="div">
         <small>Fee: <strong className={'text_blue'}>{this.props.fee} {this.props.to}</strong></small>
       </Typography>*/}

       {/*Need fix
          this.state.tokenInfoFrom && this.state.tokenInfoFrom.hasOwnProperty('conversionFee')
          ?
          (
            <Typography component="div">
             <small>Converison fee: <strong className={'text_blue'}>{this.state.tokenInfoFrom['conversionFee']} %</strong></small>
            </Typography>
          )
          :(null)
       */}
      </Paper>
      </React.Fragment>
      )
      :
      (null)
    }
    </React.Fragment>
   )
  }
}

export default DirectionInfo
