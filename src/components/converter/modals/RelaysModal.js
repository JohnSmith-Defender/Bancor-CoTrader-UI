// THIS COMPONENT CONVERT ETH, ERC20 and SMARTTOKEN
// TODO refactoring (Presentational and Container)
// TODO DRY

import React, { Component } from 'react'
import { Alert, Form,  Modal } from "react-bootstrap"
import { inject, observer } from 'mobx-react'
import { toWeiByDecimals, fromWeiByDecimals } from '../../../service/weiByDecimals'
import SetMinReturn from './modules/SetMinReturn'
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Chip from '@material-ui/core/Chip';

import {
  ABISmartToken,
  ABIConverter,
  ABIBancorNetwork,
  BancorNetwork
} from '../../../config'

import getDirectionData from '../../../service/getDirectionData'
import getWeb3ForRead from '../../../service/getWeb3ForRead'
import getPath from '../../../service/getPath'
import getBancorGasLimit from '../../../service/getBancorGasLimit'
import findByProps from '../../../service/findByProps'
import MMBatchManual from '../../static/MMBatchManual'

import { Typeahead } from 'react-bootstrap-typeahead'
import DirectionInfo from './modules/DirectionInfo'
import FakeButton from '../../templates/FakeButton'

class RelaysModal extends Component {
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
    officialSmartTokenSymbols:null,
    unofficialSmartTokenSymbols:null,
    bancorTokensStorageJson:null,
    selectToOficial:true,
    selectFromOficial:true,
    web3:null,
    useERC20AsSelectFrom:true,
    useERC20AsSelectTo:false
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
        this.checkRate()
      }
    }

    // Update state with tokens data
    if (prevProps.MobXStorage.bancorTokensStorageJson !== this.state.bancorTokensStorageJson) {
      const officialSymbols = this.props.MobXStorage.officialSymbols
      const unofficialSymbols = this.props.MobXStorage.unofficialSymbols
      let officialSmartTokenSymbols = this.props.MobXStorage.officialSmartTokenSymbols

      // delete BNT from smart tokens
      officialSmartTokenSymbols = officialSmartTokenSymbols.filter(e => e !== 'BNT')

      const unofficialSmartTokenSymbols = this.props.MobXStorage.unofficialSmartTokenSymbols
      const bancorTokensStorageJson = this.props.MobXStorage.bancorTokensStorageJson
      this.setState({
        officialSymbols,
        unofficialSymbols,
        officialSmartTokenSymbols,
        unofficialSmartTokenSymbols,
        bancorTokensStorageJson
      })
    }
  }


  // override for case not input the same parameters each time
  overrideGetDirectionData = () => {
    return getDirectionData(
      this.state.from,
      this.state.to,
      this.state.bancorTokensStorageJson,
      this.state.useERC20AsSelectFrom,
      this.state.useERC20AsSelectTo
    )
  }

  // TODO DRY refactoring, all this methods in one file for POLL, TRADE, SEND modals
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

  // not need call this functions if user not select to and from
  checkRate = () => {
    if(this.state.from && this.state.to && this.state.directionAmount > 0){
      this.getRate()
    }
  }

  // Batch requset for case when from === ERC20
  approveAndTradeRelay = async () => {
    const web3 = this.props.MobXStorage.web3
    const { objPropsFrom, objPropsTo } = this.overrideGetDirectionData()

    const tokenInfoFrom = findByProps(this.state.bancorTokensStorageJson, objPropsFrom, this.state.from)[0]
    const token = new web3.eth.Contract(ABISmartToken, tokenInfoFrom.tokenAddress)
    const gasPrice = await getBancorGasLimit()

    const path = getPath(
      this.state.from,
      this.state.to,
      this.state.bancorTokensStorageJson,
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
    const path = getPath(this.state.from, this.state.to, this.state.bancorTokensStorageJson, objPropsFrom, objPropsTo)
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
    const path = getPath(this.state.from, this.state.to, this.state.bancorTokensStorageJson, objPropsFrom, objPropsTo)
    const amount = await toWeiByDecimals(path[0], this.state.directionAmount, web3)
    const gasPrice = await getBancorGasLimit()

    bancorNetworkContract.methods.convert(path, amount, this.props.MobXStorage.minReturn)
    .send({from: this.props.MobXStorage.accounts[0], gasPrice, value:amount })
    this.closeModal()
  }


  trade = () => {
  if(this.state.to && this.state.from && this.state.directionAmount > 0){
    if(this.state.to !== this.state.from){
      if(this.state.from === "ETH"){
        this.convertFromETH()
      }
      else if(this.state.from === "BNT" || !this.state.useERC20AsSelectFrom){
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
    connectorSymbol:'',
    reciveSymbol:'',
    amountReturn:0,
    ShowModal:false,
    selectToOficial:true,
    selectFromOficial:true,
    useERC20AsSelectFrom:true,
    useERC20AsSelectTo:false
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

      {/*select from*/}
      <React.Fragment>
      {
        this.state.officialSmartTokenSymbols && this.state.unofficialSmartTokenSymbols
        ?
        (
          <React.Fragment>


          <FormControlLabel
              control={<Checkbox onChange={e => this.change(e)} name="selectFromOficial" className="custom_check" color="primary" />}
              label="Show unofficial"
          />
          <FormControlLabel
              control={<Checkbox
                onChange={e => this.setState({ useERC20AsSelectFrom: !this.state.useERC20AsSelectFrom })}
                checked={!this.state.useERC20AsSelectFrom} className="custom_check" color="primary"/>}
                label="Show relays, hide tokens"
          />

          {
            this.state.selectFromOficial
            ?
            (
              <Typeahead
                  labelKey="fromOfficialTokens"
                  multiple={false}
                  id="officialTokens"
                  options={this.state.useERC20AsSelectFrom ? this.state.officialSymbols :this.state.officialSmartTokenSymbols}
                  onChange={(s) => this.setState({from: s[0]})}
                  placeholder="Choose a symbol for send"
              />
            )
            :
            (
              <Typeahead
                  labelKey="fromUnofficialTokens"
                  multiple={false}
                  id="unofficialTokens"
                  options={this.state.useERC20AsSelectFrom ? this.state.unofficialSymbols : this.state.unofficialSmartTokenSymbols}
                  onChange={(s) => this.setState({from: s[0]})}
                  placeholder="Choose a symbol for send"
              />
            )
          }
          </React.Fragment>
        )
        :
        (null)
      }
      </React.Fragment>

      <br/>

      {/*select to*/}
      <React.Fragment>
      {
        this.state.officialSmartTokenSymbols && this.state.unofficialSmartTokenSymbols
        ?
        (
          <React.Fragment>
          <FormControlLabel
              control={<Checkbox onChange={e => this.change(e)} name="selectToOficial" className="custom_check" color="primary" />}
              label="Show unofficial"
          />
          <FormControlLabel
              control={<Checkbox
                onChange={e => this.setState({ useERC20AsSelectTo: !this.state.useERC20AsSelectTo})}
                checked={!this.state.useERC20AsSelectTo} name="selectFromOficial" color="primary" />}
                label="Show relays, hide tokens"
          />
          {
            this.state.selectToOficial
            ?
            (
              <Typeahead
                  labelKey="fromOfficialTokens"
                  multiple={false}
                  id="officialTokens"
                  options={this.state.useERC20AsSelectTo ? this.state.officialSymbols : this.state.officialSmartTokenSymbols}
                  onChange={(s) => this.setState({to: s[0]})}
                  placeholder="Choose a symbol for buy"
              />
            )
            :
            (
              <Typeahead
                  labelKey="fromUnofficialTokens"
                  multiple={false}
                  id="unofficialTokens"
                  options={this.state.useERC20AsSelectTo ? this.state.unofficialSymbols : this.state.unofficialSmartTokenSymbols}
                  onChange={(s) => this.setState({to: s[0]})}
                  placeholder="Choose a symbol for buy"
              />
            )
          }
          </React.Fragment>
        )
        :
        (null)
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
      useERC20AsSelectFrom={this.state.useERC20AsSelectFrom}
      useERC20AsSelectTo={this.state.useERC20AsSelectTo}
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
