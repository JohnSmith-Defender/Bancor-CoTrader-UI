// THIS COMPONENT CONVERT ETH, ERC20 and SMARTTOKEN
// TODO refactoring (Presentational and Container)
// TODO DRY

import React, { Component } from 'react'
import { Alert, Form,  Modal } from "react-bootstrap"
import { inject, observer } from 'mobx-react'
import SetMinReturn from './modules/SetMinReturn'
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';

import {
  ABISmartToken,
  ABIConverter,
  ABIBancorNetwork,
  BancorNetwork
} from '../../../config'

import {
  toWeiByDecimals,
  //fromWeiByDecimals 
} from '../../../service/weiByDecimals'

import getDirectionData from '../../../service/getDirectionData'
import getWeb3ForRead from '../../../service/getWeb3ForRead'
import getPath from '../../../service/getPath'
import getRateByPath from '../../../service/getRateByPath'
import getBancorGasLimit from '../../../service/getBancorGasLimit'
import findByProps from '../../../service/findByProps'
import MMBatchManual from '../../static/MMBatchManual'

import SelectSymbols from './modules/SelectSymbols'
//import { Typeahead } from 'react-bootstrap-typeahead'
import DirectionInfo from './modules/DirectionInfo'
import FakeButton from '../../templates/FakeButton'


class RelaysModal extends Component {
  constructor(props, context) {
   super(props, context)
    this.state = {
    directionAmount:0,
    connectorSymbol:'',
    amountReturn:0,
    ShowModal:false,
    bancorTokensStorageJson:null,
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


  // override for case not input the same parameters each time
  overrideGetDirectionData = () => {
    return getDirectionData(
      this.props.MobXStorage.from,
      this.props.MobXStorage.to,
      this.props.MobXStorage.bancorTokensStorageJson,
      this.props.MobXStorage.useERC20AsSelectFrom,
      this.props.MobXStorage.useERC20AsSelectTo
    )
  }

  // View rate
  // return amount and fee
  getRate = async () => {
    if(this.props.MobXStorage.from && this.props.MobXStorage.to && this.state.directionAmount > 0){
    if(this.props.MobXStorage.from !== this.props.MobXStorage.to){
      const web3 = getWeb3ForRead(this.props.MobXStorage.web3)
      // for detect in path this smart token or not
      const { objPropsFrom, objPropsTo } = this.overrideGetDirectionData()
      const path = getPath(
        this.props.MobXStorage.from,
        this.props.MobXStorage.to,
        this.props.MobXStorage.bancorTokensStorageJson,
        objPropsFrom,
        objPropsTo
      )
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
  approveAndTradeRelay = async () => {
    const web3 = this.props.MobXStorage.web3
    const { objPropsFrom, objPropsTo } = this.overrideGetDirectionData()

    const tokenInfoFrom = findByProps(this.props.MobXStorage.bancorTokensStorageJson, objPropsFrom, this.props.MobXStorage.from)[0]
    const token = new web3.eth.Contract(ABISmartToken, tokenInfoFrom.tokenAddress)
    const gasPrice = await getBancorGasLimit()

    const path = getPath(
      this.props.MobXStorage.from,
      this.props.MobXStorage.to,
      this.props.MobXStorage.bancorTokensStorageJson,
      objPropsFrom,
      objPropsTo
    )
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
    const bancorNetworkContract = new web3.eth.Contract(ABIBancorNetwork, BancorNetwork)
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
    this.closeModal()
  }

  // trade between source and BNT
  // or if from === smart token
  quickConvert = async () => {
    const web3 = this.props.MobXStorage.web3
    const { tokenInfoFrom, objPropsFrom, objPropsTo } = this.overrideGetDirectionData()
    const converterContract = new web3.eth.Contract(ABIConverter, tokenInfoFrom.converterAddress)
    const path = getPath(this.props.MobXStorage.from, this.props.MobXStorage.to, this.props.MobXStorage.bancorTokensStorageJson, objPropsFrom, objPropsTo)
    const gasPrice = await getBancorGasLimit()
    const amountSend = await toWeiByDecimals(tokenInfoFrom.tokenAddress, this.state.directionAmount, web3)

    converterContract.methods.quickConvert(
      path,
      amountSend,
      this.props.MobXStorage.minReturn
    ).send({from: this.props.MobXStorage.accounts[0], gasPrice})
    this.closeModal()
  }

  // in case if from === ETH
  convertFromETH = async () => {
    const web3 = this.props.MobXStorage.web3
    const bancorNetworkContract = new web3.eth.Contract(ABIBancorNetwork, BancorNetwork)
    const { objPropsFrom, objPropsTo } = this.overrideGetDirectionData()
    const path = getPath(this.props.MobXStorage.from, this.props.MobXStorage.to, this.props.MobXStorage.bancorTokensStorageJson, objPropsFrom, objPropsTo)
    const amount = await toWeiByDecimals(path[0], this.state.directionAmount, web3)
    const gasPrice = await getBancorGasLimit()

    bancorNetworkContract.methods.convert(path, amount, this.props.MobXStorage.minReturn)
    .send({from: this.props.MobXStorage.accounts[0], gasPrice, value:amount })
    this.closeModal()
  }


  trade = () => {
  if(this.props.MobXStorage.to && this.props.MobXStorage.from && this.state.directionAmount > 0){
    if(this.props.MobXStorage.to !== this.props.MobXStorage.from){
      if(this.props.MobXStorage.from === "ETH"){
        this.convertFromETH()
      }
      else if(this.props.MobXStorage.from === "BNT" || !this.props.MobXStorage.useERC20AsSelectFrom){
        this.quickConvert()
      }
      else{
        this.approveAndTradeRelay()
      }
    }
  }
  else{
    alert('Not correct input data')
  }
  }

  // reset states after close modal
  closeModal = () => this.setState({
    to:undefined,
    from:undefined,
    directionAmount:0,
    amountReturn:0,
    ShowModal:false,
  })



// TODO move this to a Presentational component
  render(){
    return(
    <React.Fragment>
    {
      this.props.MobXStorage.bancorTokensStorageJson
      ?
      (
        <Button variant="contained" color="primary" onClick={() => this.setState({ ShowModal: true })}>
          Relays
        </Button>
      )
      :
      (<Chip label="loading data..." style={{marginBottom: '15px'}} variant="outlined" color="primary"/>)
    }

    <Modal
      size="lg"
      show={this.state.ShowModal}
      onHide={() => this.closeModal()}
      aria-labelledby="example-modal-sizes-title-lg"
      >
      <Modal.Header closeButton>
      <Modal.Title id="example-modal-sizes-title-lg">
      <small>Buy/sell relays</small>
      </Modal.Title>
      </Modal.Header>
      <Modal.Body>

      <SelectSymbols symbolDirection="from" useSmartTokenSymbols={true}/>
      <SelectSymbols symbolDirection="to" useSmartTokenSymbols={true}/>

      <br/>
      <Form.Control name="directionAmount" placeholder={`Enter ${this.props.MobXStorage.from ? this.props.MobXStorage.from : 'token'} amount`} onChange={e => this.setState({directionAmount:e.target.value})} type="number" min="1"/>
      <br/>
      {
        this.state.directionAmount > 0
        ?
        ( <div>
          <Alert variant="success">You will receive {this.state.amountReturn} {this.props.MobXStorage.to}</Alert>
          {
            /*Buttons*/
            this.props.MobXStorage.web3
            ?
            (
              <React.Fragment>
              <Button variant="contained" color="primary" onClick={() => this.trade()}>Trade</Button>
              <hr/>
              <MMBatchManual/>
              <hr/>
              </React.Fragment>
            )
            :
            (
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
      <DirectionInfo
      from={this.props.MobXStorage.from}
      to={this.props.MobXStorage.to}
      directionAmount={this.state.directionAmount}
      bancorTokensStorageJson={this.props.MobXStorage.bancorTokensStorageJson}
      web3={this.props.MobXStorage.web3}
      accounts={this.props.MobXStorage.accounts}
      useERC20AsSelectFrom={this.props.MobXStorage.useERC20AsSelectFrom}
      useERC20AsSelectTo={this.props.MobXStorage.useERC20AsSelectTo}
      amountReturn={this.state.amountReturn}
      fee={this.state.fee}
      />
      </Modal.Body>
    </Modal>
    </React.Fragment>
    )
  }
}

export default inject('MobXStorage')(observer(RelaysModal))
