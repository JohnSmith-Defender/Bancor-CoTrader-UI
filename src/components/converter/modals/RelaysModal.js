// THIS COMPONENT CONVERT ETH, ERC20 and SMARTTOKEN
// TODO refactoring (Presentational and Container)
// TODO DRY

import React, { Component } from 'react'
import { ButtonGroup, Alert, Form,  Modal } from "react-bootstrap"
import { inject, observer } from 'mobx-react'
import { hexToNumberString, toWei, fromWei } from 'web3-utils'
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
    bancorNetworkContract: null,
    selectToOficial:true,
    selectFromOficial:true,
    web3:null,
    useERC20AsSelectFrom:true,
    useERC20AsSelectTo:false,
    requireApprove:false
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
      this.checkRateAndApprove()
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

  // not need approve for ETH, BNT, smart token
  checkRequireApprove = () => {
    const { isRelatedDirection } = this.overrideGetDirectionData()

    if(isRelatedDirection){
      this.setState({ requireApprove: true})
    }
    else if(!this.state.useERC20AsSelectFrom || this.state.from === "ETH" || this.state.from === "BNT"){
      this.setState({ requireApprove: false})
    }
    else{
      this.setState({ requireApprove: true})
    }
  }

  // TODO DRY refactoring, all this methods in one file for POLL, TRADE, SEND modals
  // View rate
  getRate = async () => {
    const web3 = getWeb3ForRead(this.props.MobXStorage.web3)
    const bancorNetworkContract = new web3.eth.Contract(ABIBancorNetwork, BancorNetwork)
    const { objPropsFrom, objPropsTo, isRelatedDirection } = this.overrideGetDirectionData()

    const path = getPath(
      this.state.from,
      this.state.to,
      this.state.bancorTokensStorageJson,
      objPropsFrom,
      objPropsTo,
      isRelatedDirection
    )

    let amountReturn = await bancorNetworkContract.methods.getReturnByPath(
      path,
      toWei(this.state.directionAmount)
    ).call()

    if(amountReturn){
      amountReturn = Number(fromWei(hexToNumberString(amountReturn[0]._hex)))
    }else{
      amountReturn = 0
    }

    this.setState({
      reciveSymbol:this.state.to,
      amountReturn
    })
  }

  // not need call this functions if user not select to and from
  checkRateAndApprove = () => {
    if(this.state.from && this.state.to && this.state.directionAmount > 0){
      this.getRate()
      this.checkRequireApprove()
    }
  }

   // TODO DRY refactoring, all this methods in one file for POLL, TRADE, SEND modals
  // approve ERC20 standard
  approve = (reciver) => {
    if(this.state.from){
      const { sendFrom } = this.overrideGetDirectionData()

      const token = new this.props.MobXStorage.web3.eth.Contract(ABISmartToken, sendFrom)
      token.methods.approve(
        reciver,
        this.props.MobXStorage.web3.utils.toWei(String(this.state.directionAmount))
      ).send({from: this.props.MobXStorage.accounts[0]})
    }
    else{
      alert('Not correct input data')
    }
  }


  // choose an receiver (Converter or Bancor Network)
  // depending on the type of exchange (external or internal)
  wrapperApprove = async () => {
    if(this.state.to === "BNT" || this.state.from === "BNT"){
      console.log("Approve to converter")
      const { tokenInfoFrom } = this.overrideGetDirectionData()

      const converterAddress = tokenInfoFrom.converterAddress
      this.approve(converterAddress)
    }else{
      console.log("Approve to BancorNetwork")
      this.approve(BancorNetwork)
    }
  }

  // TODO DRY refactoring, all this methods in one file for POLL, TRADE, SEND modals
  // trade between source and source
  // or COTBNT/COT or vice versa case
  claimAndConvert = () => {
    const web3 = this.props.MobXStorage.web3
    const bancorNetworkContract = new web3.eth.Contract(ABIBancorNetwork, BancorNetwork)
    const { objPropsFrom, objPropsTo, isRelatedDirection } = this.overrideGetDirectionData()
    const path = getPath(this.state.from, this.state.to, this.state.bancorTokensStorageJson, objPropsFrom, objPropsTo, isRelatedDirection)

    bancorNetworkContract.methods.claimAndConvert(path,
      toWei(this.state.directionAmount),
      this.props.MobXStorage.minReturn
    ).send({from: this.props.MobXStorage.accounts[0]})
    this.closeModal()
  }

  // TODO DRY refactoring, all this methods in one file for POLL, TRADE, SEND modals
  // trade between source and BNT
  // or if from === smart token
  quickConvert = () => {
    const web3 = this.props.MobXStorage.web3
    const { tokenInfoFrom, objPropsFrom, objPropsTo } = this.overrideGetDirectionData()
    const converterContract = new web3.eth.Contract(ABIConverter, tokenInfoFrom.converterAddress)
    const path = getPath(this.state.from, this.state.to, this.state.bancorTokensStorageJson, objPropsFrom, objPropsTo)

    converterContract.methods.quickConvert(
      path,
      web3.utils.toWei(String(this.state.directionAmount)),
      this.props.MobXStorage.minReturn
    ).send({from: this.props.MobXStorage.accounts[0]})
    this.closeModal()
  }

  // TODO DRY refactoring, all this methods in one file for POLL, TRADE, SEND modals
  // in case if from === ETH
  convertFromETH = () => {
    const web3 = this.props.MobXStorage.web3
    const bancorNetworkContract = new web3.eth.Contract(ABIBancorNetwork, BancorNetwork)
    const { objPropsFrom, objPropsTo } = this.overrideGetDirectionData()
    const path = getPath(this.state.from, this.state.to, this.state.bancorTokensStorageJson, objPropsFrom, objPropsTo)
    const amount = web3.utils.toWei(String(this.state.directionAmount))

    bancorNetworkContract.methods.convert(path, amount, this.props.MobXStorage.minReturn)
    .send({from: this.props.MobXStorage.accounts[0], value:amount })
    this.closeModal()
  }

  // internal and extarnal trade
  trade = () => {
  if(this.state.to && this.state.from && this.state.directionAmount > 0){
    if(this.state.to !== this.state.from){
      const { isRelatedDirection } = this.overrideGetDirectionData()
      if(this.state.from === "ETH"){
        this.convertFromETH()
      }
      else if (isRelatedDirection){
        this.claimAndConvert()
      }
      else if(this.state.from === "BNT" || !this.state.useERC20AsSelectFrom){
        this.quickConvert()
      }else if(this.state.to === "BNT" && this.state.from !== "ETH"){
        this.quickConvert()
      }
      else{
        this.claimAndConvert()
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
              control={<Checkbox onChange={e => this.change(e)} name="selectFromOficial" color="primary" />}
              label="Show unofficial"
          />
          <FormControlLabel
              control={<Checkbox
                onChange={e => this.setState({ useERC20AsSelectFrom: !this.state.useERC20AsSelectFrom })}
                checked={!this.state.useERC20AsSelectFrom} color="primary"/>}
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
              control={<Checkbox onChange={e => this.change(e)} name="selectToOficial" color="primary" />}
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
      <Form.Control name="directionAmount" placeholder="Enter amount to send" onChange={e => this.change(e)} type="number" min="1"/>
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
              <ButtonGroup size="sm">
              {
                this.state.requireApprove
                ?
                (
                  <Button variant="contained" style={{marginRight: '10px'}} color="primary" onClick={() => this.wrapperApprove()}>Approve</Button>
                )
                :
                (null)
              }
              <Button variant="contained" color="primary" onClick={() => this.trade()}>Trade</Button>
              </ButtonGroup>
            )
            :
            (
              <ButtonGroup size="sm">
              {
                this.state.requireApprove
                ?
                (
                  <FakeButton info="Please connect to web3" buttonName="Approve"/>
                )
                :
                (null)
              }
              <FakeButton info="Please connect to web3" buttonName="Trade"/>
              </ButtonGroup>
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
      />
      </Modal.Body>
    </Modal>
    </React.Fragment>
    )
  }
}

export default inject('MobXStorage')(observer(RelaysModal))
