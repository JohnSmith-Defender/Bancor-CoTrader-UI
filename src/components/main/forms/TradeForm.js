// THIS COMPONENT CONVERT ONLY ETH AND ERC20 TO msg.sender
// TODO refactoring (Presentational and Container)
// TODO DRY

import React, { Component } from 'react'

import { inject, observer } from 'mobx-react'
import getWeb3ForRead from '../../../service/getWeb3ForRead'
import findByProps from '../../../service/findByProps'
import getPath from '../../../service/getPath'
import getRateByPath from '../../../service/getRateByPath'
import getBancorGasLimit from '../../../service/getBancorGasLimit'
import SelectSymbols from './modules/SelectSymbols'
import { isMobile } from 'react-device-detect'

import {
  ABISmartToken,
  ABIBancorNetwork,
  BancorNetwork,
  ABIConverter,
  netId
} from '../../../config'

import {
  toWeiByDecimals,
  //fromWeiByDecimals
} from '../../../service/weiByDecimals'

import DirectionInfo from './modules/DirectionInfo'
import SetMinReturn from './modules/SetMinReturn'
import FakeButton from '../../templates/FakeButton'
import { Alert, Form } from "react-bootstrap"
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import MMBatchManual from '../../static/MMBatchManual'


class TradeForm extends Component {
  constructor(props, context) {
   super(props, context)
    this.state = {
    directionAmount:0,
    amountReturn:0,
    bancorNetworkContract: null,
    web3:null,
    fee:0,
    to:'',
    from:''
    }
  }


  componentDidUpdate(prevProps, prevState){
    // Update rate by onChange
    if(prevProps.MobXStorage.from !== this.state.from || prevProps.MobXStorage.to !== this.state.to || prevState.directionAmount !== this.state.directionAmount){
      this.getRate()

      this.setState({
        to: this.props.MobXStorage.to,
        from: this.props.MobXStorage.from
      })
    }
  }

  // View rate
  getRate = async () => {
    if(this.props.MobXStorage.from && this.props.MobXStorage.to && this.state.directionAmount > 0){
    if(this.props.MobXStorage.from !== this.props.MobXStorage.to){
      const web3 = getWeb3ForRead(this.props.MobXStorage.web3)
      const path = getPath(this.props.MobXStorage.from, this.props.MobXStorage.to, this.props.MobXStorage.bancorTokensStorageJson)
      const amountSend = await toWeiByDecimals(path[0], this.state.directionAmount, web3)
      const { amountReturn, fee } = await getRateByPath(path, amountSend, web3)

      this.setState({
        amountReturn,
        fee
      })
    }
  }
  }

  // Batch requset for case when from === ERC20
  approveAndTrade = async () => {
    const web3 = this.props.MobXStorage.web3
    const tokenInfoFrom = findByProps(this.props.MobXStorage.bancorTokensStorageJson, "symbol", this.props.MobXStorage.from)[0]
    const token = new web3.eth.Contract(ABISmartToken, tokenInfoFrom.tokenAddress)
    const bancorNetworkContract = new web3.eth.Contract(ABIBancorNetwork, BancorNetwork)
    const gasPrice = await getBancorGasLimit()
    const amountSend = await toWeiByDecimals(tokenInfoFrom.tokenAddress, this.state.directionAmount, web3)

    let batch = new web3.BatchRequest()
    // approve tx
    const approveData = token.methods.approve(
    BancorNetwork,
    amountSend
    ).encodeABI({from: this.props.MobXStorage.accounts[0]})

    // approve gas should be more than in trade
    const approveGasPrice = Number(gasPrice) + 2000000000

    const approve = {
      "from": this.props.MobXStorage.accounts[0],
      "to": tokenInfoFrom.tokenAddress,
      "value": "0x0",
      "data": approveData,
      "gasPrice": web3.eth.utils.toHex(approveGasPrice),
      "gas": web3.eth.utils.toHex(85000),
    }

    // trade tx
    const path = getPath(this.props.MobXStorage.from, this.props.MobXStorage.to, this.props.MobXStorage.bancorTokensStorageJson)
    const tradeData = bancorNetworkContract.methods.claimAndConvert(path,
      amountSend,
      this.props.MobXStorage.minReturn
    ).encodeABI({from: this.props.MobXStorage.accounts[0]})

    const trade = {
      "from": this.props.MobXStorage.accounts[0],
      "to": BancorNetwork,
      "value": "0x0",
      "data": tradeData,
      "gasPrice": web3.eth.utils.toHex(gasPrice),
      "gas": web3.eth.utils.toHex(600000),
    }

    batch.add(web3.eth.sendTransaction.request(approve, () => console.log("Approve")))
    batch.add(web3.eth.sendTransaction.request(trade, () => console.log("Trade")))
    batch.execute()
  }

  // in case if from === BNT and to !== ETH
  quickConvert = async () => {
    const web3 = this.props.MobXStorage.web3
    const tokenInfoFrom = findByProps(this.props.MobXStorage.bancorTokensStorageJson, "symbol", this.props.MobXStorage.from)[0]
    const path = getPath(this.props.MobXStorage.from, this.props.MobXStorage.to, this.props.MobXStorage.bancorTokensStorageJson)
    const gasPrice = await getBancorGasLimit()
    const converterContract = new web3.eth.Contract(ABIConverter, tokenInfoFrom.converterAddress)
    const amountSend = await toWeiByDecimals(tokenInfoFrom.tokenAddress, this.state.directionAmount, web3)

    converterContract.methods.quickConvert(
      path,
      amountSend,
      this.props.MobXStorage.minReturn
    ).send({from: this.props.MobXStorage.accounts[0], gasPrice})
  }

  // in case if from === ETH
  convertFromETH = async () => {
    const web3 = this.props.MobXStorage.web3
    const bancorNetworkContract = new web3.eth.Contract(ABIBancorNetwork, BancorNetwork)
    const path = getPath(this.props.MobXStorage.from, this.props.MobXStorage.to, this.props.MobXStorage.bancorTokensStorageJson)
    const amount = await toWeiByDecimals(path[0], this.state.directionAmount, web3)
    const gasPrice = await getBancorGasLimit()

    bancorNetworkContract.methods.convert(path, amount, this.props.MobXStorage.minReturn)
    .send({from: this.props.MobXStorage.accounts[0], gasPrice, value:amount })
  }

  // trade
  trade = () => {
  if(this.props.MobXStorage.to && this.props.MobXStorage.from && this.state.directionAmount > 0){
    if(this.props.MobXStorage.to !== this.props.MobXStorage.from){
      if(this.props.MobXStorage.from === "ETH"){
        this.convertFromETH()
      }
      else if(this.props.MobXStorage.from === "BNT"){
        this.quickConvert()
      }
      else{
        this.approveAndTrade()
      }
    }
  }
  else{
    alert('Not correct input data')
  }
  }


// TODO move this to a Presentational component
  render(){
    return(
    <React.Fragment>
    {
      this.props.MobXStorage.bancorTokensStorageJson
      ?
      (
        <div style={!isMobile ? {align:"left", width: "550px"}: null}>

        {/*select symbols*/}
        <SelectSymbols symbolDirection="from" useSmartTokenSymbols={false}/>
        <SelectSymbols symbolDirection="to" useSmartTokenSymbols={false}/>

        <br/>
        <Form.Control
        name="directionAmount"
        placeholder={`Enter ${this.props.MobXStorage.from ? this.props.MobXStorage.from : 'token'} amount`}
        onChange={e => this.setState({ directionAmount:e.target.value })}
        type="number" min="1"/>
        <br/>
        {
          this.state.directionAmount > 0
          ?
          ( <div>
            <Alert variant="success">You will receive {this.state.amountReturn} {this.props.MobXStorage.to}</Alert>
            <br/>
            {
              this.props.MobXStorage.web3
              ?
              (
                /*If connect to web3 */
                <React.Fragment>
                <Button variant="contained" color="primary" onClick={() => this.trade()}>Trade</Button>
                <hr/>
                <MMBatchManual/>
                <hr/>
                </React.Fragment>
              )
              :
              (
                /*If NO connect to web3 */
                <FakeButton info="Please connect to web3" buttonName="Trade"/>
              )
            }
            </div>
          )
          :
          (null)
        }
        <br/>
        <SetMinReturn
        amountReturn={this.state.amountReturn}
        from={this.props.MobXStorage.from}
        to={this.props.MobXStorage.to}
        directionAmount={this.state.directionAmount}
        />
        <br/>
        {
          netId === 1
          ?
          (
            <DirectionInfo
            from={this.props.MobXStorage.from}
            to={this.props.MobXStorage.to}
            directionAmount={this.state.directionAmount}
            bancorTokensStorageJson={this.props.MobXStorage.bancorTokensStorageJson}
            web3={this.props.MobXStorage.web3}
            accounts={this.props.MobXStorage.accounts}
            useERC20AsSelectFrom={true}
            useERC20AsSelectTo={true}
            amountReturn={this.state.amountReturn}
            fee={this.state.fee}
            />
          )
          :(null)
        }
        </div>

      )
      :
      (<Chip label="loading data..." style={{marginBottom: '15px'}} variant="outlined" color="primary"/>)
    }
    </React.Fragment>
    )
  }
}

export default inject('MobXStorage')(observer(TradeForm))
