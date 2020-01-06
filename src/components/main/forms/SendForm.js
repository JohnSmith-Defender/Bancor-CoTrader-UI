// THIS COMPONENT CONVERT ONLY ETH AND ERC20 AND THEN SEND TO ANY ETH ADDRESS
// TODO refactoring (Presentational and Container)
// TODO DRY

import React, { Component } from 'react'
import { Alert, Form, Col, Row } from "react-bootstrap"
import { inject, observer } from 'mobx-react'
import SelectSymbols from './modules/SelectSymbols'
import { isMobile } from 'react-device-detect'

import {
  ABISmartToken,
  ABIBancorNetwork,
  BancorNetwork,
  netId
} from '../../../config'

import {
  toWeiByDecimals,
  //fromWeiByDecimals
} from '../../../service/weiByDecimals'

import findByProps from '../../../service/findByProps'
import getWeb3ForRead from '../../../service/getWeb3ForRead'
import getPath from '../../../service/getPath'
import getRateByPath from '../../../service/getRateByPath'
import getBancorGasLimit from '../../../service/getBancorGasLimit'

import DirectionInfo from './modules/DirectionInfo'
import FakeButton from '../../templates/FakeButton'
import SetMinReturn from './modules/SetMinReturn'
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';



class SendForm extends Component {
  constructor(props, context) {
   super(props, context)
    this.state = {
    directionAmount:0,
    amountReturn:0,
    bancorNetworkContract: null,
    web3:null,
    receiverAddress: null,
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
    if(this.props.MobXStorage.from  && this.props.MobXStorage.to && this.state.directionAmount > 0){
    if(this.props.MobXStorage.from  !== this.props.MobXStorage.to){
      const web3 = getWeb3ForRead(this.props.MobXStorage.web3)
      const path = getPath(this.props.MobXStorage.from , this.props.MobXStorage.to, this.props.MobXStorage.bancorTokensStorageJson)
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
  approveAndTradeFor = async () => {
    const web3 = this.props.MobXStorage.web3
    const tokenInfoFrom = findByProps(this.props.MobXStorage.bancorTokensStorageJson, "symbol", this.props.MobXStorage.from )[0]
    const token = new web3.eth.Contract(ABISmartToken, tokenInfoFrom.tokenAddress)
    const bancorNetworkContract = new web3.eth.Contract(ABIBancorNetwork, BancorNetwork)
    const bancorGasLimit = await getBancorGasLimit()
    const gasPrice = Number(bancorGasLimit) < 6000000000 ? bancorGasLimit : 6000000000 // 6gwei by default
    const amountSend = await toWeiByDecimals(tokenInfoFrom.tokenAddress, this.state.directionAmount, web3)
    let batch = new web3.BatchRequest()

    // approve tx
    const approveData = token.methods.approve(
    BancorNetwork,
    amountSend
    ).encodeABI({from: this.props.MobXStorage.accounts[0]})

    const approve = {
      "from": this.props.MobXStorage.accounts[0],
      "to": tokenInfoFrom.tokenAddress,
      "value": "0x0",
      "data": approveData,
      "gasPrice": web3.eth.utils.toHex(gasPrice),
      "gas": web3.eth.utils.toHex(85000),
    }

    // trade tx
    const path = getPath(this.props.MobXStorage.from , this.props.MobXStorage.to, this.props.MobXStorage.bancorTokensStorageJson)
    const tradeData = bancorNetworkContract.methods.claimAndConvertFor(path,
      amountSend,
      this.props.MobXStorage.minReturn,
      this.state.receiverAddress
    ).encodeABI({from: this.props.MobXStorage.accounts[0]})

    const trade = {
      "from": this.props.MobXStorage.accounts[0],
      "to": BancorNetwork,
      "value": "0x0",
      "data": tradeData,
      "gasPrice": web3.eth.utils.toHex(gasPrice),
      "gas": web3.eth.utils.toHex(950000),
    }

    batch.add(web3.eth.sendTransaction.request(approve, () => console.log("Approve")))
    batch.add(web3.eth.sendTransaction.request(trade, () => console.log("Trade")))
    batch.execute()
  }

  // For ETH to ERC20
  convertFor = async () => {
    const web3 = this.props.MobXStorage.web3
    const bancorNetworkContract = new web3.eth.Contract(ABIBancorNetwork, BancorNetwork)
    const path = getPath(this.props.MobXStorage.from , this.props.MobXStorage.to, this.props.MobXStorage.bancorTokensStorageJson)
    const amount = await toWeiByDecimals(path[0], this.state.directionAmount, web3)
    const bancorGasLimit = await getBancorGasLimit()
    const gasPrice = Number(bancorGasLimit) < 6000000000 ? bancorGasLimit : 6000000000 // 6gwei by default

    bancorNetworkContract.methods.convertFor(path, amount, this.props.MobXStorage.minReturn, this.state.receiverAddress)
    .send({from: this.props.MobXStorage.accounts[0], gas: 950000, gasPrice, value:amount })
  }

  // trade ERC20 and ETH
  trade = () => {
  const web3 = this.props.MobXStorage.web3
  if(web3.utils.isAddress(this.state.receiverAddress)){
  if(this.props.MobXStorage.to && this.props.MobXStorage.from  && this.state.directionAmount > 0){
    if(this.props.MobXStorage.from  === "ETH"){
      this.convertFor()
    }else{
      this.approveAndTradeFor()
    }
  }
  else{
    alert('Not correct input data')
  }
  }else{
    alert('Not correct reciever address')
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
        <div style={!isMobile ? {textAlign:"left", maxWidth: "550px", margin:"auto", padding:"20px", border:"1px solid #eee", borderRadius:"10px"}: null}>
        {/* select */}
        <SelectSymbols symbolDirection="from" useSmartTokenSymbols={false}/>
        <SelectSymbols symbolDirection="to" useSmartTokenSymbols={false}/>

        <br/>
        <Form.Control
        name="directionAmount"
        placeholder={`Enter ${this.props.MobXStorage.from  ? this.props.MobXStorage.from  : 'token'} amount`}
        onChange={e => this.setState({ directionAmount:e.target.value })}
        type="number" min="1"/>
        <br/>
        <Form.Control
        name="receiverAddress"
        placeholder="Enter receiver address"
        onChange={e => this.setState({ receiverAddress:e.target.value })}/>
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
                <Row>
                <Col><Button variant="contained" color="primary" onClick={() => this.trade()}>Trade</Button></Col>
                <Col>
                <SetMinReturn
                amountReturn={this.state.amountReturn}
                from={this.props.MobXStorage.from }
                to={this.props.MobXStorage.to}
                directionAmount={this.state.directionAmount}
                />
                </Col>
                </Row>
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
        {
          netId === 1
          ?
          (
            <DirectionInfo
            from={this.props.MobXStorage.from }
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

export default inject('MobXStorage')(observer(SendForm))
