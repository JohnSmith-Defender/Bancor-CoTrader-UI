// THIS COMPONENT CONVERT ONLY ETH AND ERC20 TO msg.sender
// TODO refactoring (Presentational and Container)
// TODO DRY

import React, { Component } from 'react'

import { toWeiByDecimals, fromWeiByDecimals } from '../../../service/weiByDecimals'
import { inject, observer } from 'mobx-react'
import getWeb3ForRead from '../../../service/getWeb3ForRead'
import findByProps from '../../../service/findByProps'
import getPath from '../../../service/getPath'
import getBancorGasLimit from '../../../service/getBancorGasLimit'

import {
  ABISmartToken,
  ABIBancorNetwork,
  BancorNetwork,
  ABIConverter
} from '../../../config'

import DirectionInfo from './modules/DirectionInfo'
import SetMinReturn from './modules/SetMinReturn'
import FakeButton from '../../templates/FakeButton'

import { Typeahead } from 'react-bootstrap-typeahead'
import { Alert, Form,  Modal } from "react-bootstrap"
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Chip from '@material-ui/core/Chip'
import MMBatchManual from '../../static/MMBatchManual'


class TradeModal extends Component {
  constructor(props, context) {
   super(props, context)
    this.state = {
    to:undefined,
    from:undefined,
    directionAmount:0,
    connectorSymbol:'',
    reciveSymbol:'',
    amountReturn:0,
    ShowModal:false,
    officialSymbols:null,
    unofficialSymbols:null,
    bancorTokensStorageJson:null,
    bancorNetworkContract: null,
    selectToOficial:true,
    selectFromOficial:true,
    web3:null,
    fee:0
    }
  }

  // helper for setState
  change = e => {
    if(typeof this.state[e.target.name] === "boolean"){
      this.setState({
        [e.target.name]: !this.state[e.target.name]
      })
    }else{
      this.setState({
        [e.target.name]: e.target.value
      })
    }
  }

  componentDidUpdate(prevProps, prevState){
    // Update rate by onChange
    if(prevState.from !== this.state.from || prevState.to !== this.state.to || prevState.directionAmount !== this.state.directionAmount){
      if(this.state.directionAmount > 0){
        this.getRate()
      }
    }

    // Update state with tokens data
    if (prevProps.MobXStorage.bancorTokensStorageJson !== this.state.bancorTokensStorageJson) {
      const officialSymbols = this.props.MobXStorage.officialSymbols
      const unofficialSymbols = this.props.MobXStorage.unofficialSymbols
      const bancorTokensStorageJson = this.props.MobXStorage.bancorTokensStorageJson
      this.setState({
        officialSymbols,
        unofficialSymbols,
        bancorTokensStorageJson
      })
    }
  }

  // View rate
  getRate = async () => {
    if(this.state.from && this.state.to && this.state.directionAmount > 0){
    if(this.state.from !== this.state.to){
      const web3 = getWeb3ForRead(this.props.MobXStorage.web3)
      const bancorNetworkContract = new web3.eth.Contract(ABIBancorNetwork, BancorNetwork)
      const path = getPath(this.state.from, this.state.to, this.state.bancorTokensStorageJson)
      let fee = 0
      const amountSend = await toWeiByDecimals(path[0], this.state.directionAmount, web3)

      let amountReturn = await bancorNetworkContract.methods.getReturnByPath(
        path,
        amountSend
      ).call()

      if(amountReturn){
        fee = await fromWeiByDecimals(path[path.length - 1], amountReturn[1], web3)
        amountReturn = await fromWeiByDecimals(path[path.length - 1], amountReturn[0], web3)
      }else{
        amountReturn = 0
      }

      this.setState({
        reciveSymbol:this.state.to,
        amountReturn,
        fee
      })
    }
  }
  }

  // Batch requset for case when from === ERC20
  approveAndTrade = async () => {
    const web3 = this.props.MobXStorage.web3
    const tokenInfoFrom = findByProps(this.state.bancorTokensStorageJson, "symbol", this.state.from)[0]
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
    const path = getPath(this.state.from, this.state.to, this.state.bancorTokensStorageJson)
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

  // in case if from === BNT and to !== ETH
  quickConvert = async () => {
    const web3 = this.props.MobXStorage.web3
    const tokenInfoFrom = findByProps(this.state.bancorTokensStorageJson, "symbol", this.state.from)[0]
    const path = getPath(this.state.from, this.state.to, this.state.bancorTokensStorageJson)
    const gasPrice = await getBancorGasLimit()
    const converterContract = new web3.eth.Contract(ABIConverter, tokenInfoFrom.converterAddress)
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
    const path = getPath(this.state.from, this.state.to, this.state.bancorTokensStorageJson)
    const amount = await toWeiByDecimals(path[0], this.state.directionAmount, web3)
    const gasPrice = await getBancorGasLimit()

    bancorNetworkContract.methods.convert(path, amount, this.props.MobXStorage.minReturn)
    .send({from: this.props.MobXStorage.accounts[0], gasPrice, value:amount })
    this.closeModal()
  }

  // trade
  trade = () => {
  if(this.state.to && this.state.from && this.state.directionAmount > 0){
    if(this.state.to !== this.state.from){
      if(this.state.from === "ETH"){
        this.convertFromETH()
      }
      else if(this.state.from === "BNT"){
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

  // reset states after close modal
  closeModal = () => this.setState({
    to:undefined,
    from:undefined,
    directionAmount:0,
    connectorSymbol:'',
    reciveSymbol:'',
    amountReturn:0,
    ShowModal:false,
    selectToOficial:true,
    selectFromOficial:true
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
        Trade
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
      bgcolor="modal"
      >
      <Modal.Header closeButton>
      <Modal.Title id="example-modal-sizes-title-lg">
      <small>Trade ETH or tokens</small>
      </Modal.Title>
      </Modal.Header>
      <Modal.Body>

      {/*select from*/}
      <React.Fragment>
      {
        this.state.officialSymbols && this.state.unofficialSymbols
        ?
        (
          <React.Fragment>


          <FormControlLabel
              control={<Checkbox onChange={e => this.change(e)} name="selectFromOficial" className="custom_check" color="primary" />}
              label="Show unofficial"
          />


          {
            this.state.selectFromOficial
            ?
            (
              <Typeahead
                  labelKey="fromOfficialTokens"
                  multiple={false}
                  id="officialTokens"
                  options={this.state.officialSymbols}
                  onChange={(s) => this.setState({from: s[0]})}
                  placeholder="Choose a symbol from"
              />
            )
            :
            (
              <Typeahead
                  labelKey="fromUnofficialTokens"
                  multiple={false}
                  id="unofficialTokens"
                  options={this.state.unofficialSymbols}
                  onChange={(s) => this.setState({from: s[0]})}
                  placeholder="Choose a symbol from"
              />
            )
          }
          </React.Fragment>
        )
        :
        (null)
      }
      </React.Fragment>


      {/*select to*/}
      <React.Fragment>
      {
        this.state.officialSymbols && this.state.unofficialSymbols
        ?
        (
          <React.Fragment>

          <FormControlLabel
              control={<Checkbox onChange={e => this.change(e)} name="selectToOficial" className="custom_check" color="primary"/>}
              label="Show unofficial"
          />


          {
            this.state.selectToOficial
            ?
            (
              <Typeahead
                  labelKey="toOfficialTokens"
                  multiple={false}
                  id="toOfficialTokens"
                  options={this.state.officialSymbols}
                  onChange={(s) => this.setState({to: s[0]})}
                  placeholder="Choose a symbol to"
              />
            )
            :
            (
              <Typeahead
                  labelKey="toUnofficialTokens"
                  multiple={false}
                  id="toUnofficialTokens"
                  options={this.state.unofficialSymbols}
                  onChange={(s) => this.setState({to: s[0]})}
                  placeholder="Choose a symbol to"
              />
            )
          }
          </React.Fragment>
        )
        :
        (<p>Loading data ...</p>)
      }
      </React.Fragment>

      <br/>
      <Form.Control name="directionAmount" placeholder={`Enter ${this.state.from ? this.state.from : 'token'} amount`} onChange={e => this.change(e)} type="number" min="1"/>
      <br/>
      {
        this.state.directionAmount > 0
        ?
        ( <div>
          <Alert variant="success">You will receive {this.state.amountReturn} {this.state.reciveSymbol}</Alert>
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
      from={this.state.from}
      to={this.state.to}
      directionAmount={this.state.directionAmount}
      />
      <br/>
      <DirectionInfo
      from={this.state.from}
      to={this.state.to}
      directionAmount={this.state.directionAmount}
      bancorTokensStorageJson={this.state.bancorTokensStorageJson}
      web3={this.props.MobXStorage.web3}
      accounts={this.props.MobXStorage.accounts}
      useERC20AsSelectFrom={true}
      useERC20AsSelectTo={true}
      amountReturn={this.state.amountReturn}
      fee={this.state.fee}
      />
      </Modal.Body>
    </Modal>
    </React.Fragment>
    )
  }
}

export default inject('MobXStorage')(observer(TradeModal))
