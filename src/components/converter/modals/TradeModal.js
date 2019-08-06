// THIS COMPONENT CONVERT ONLY ETH AND ERC20 
// TODO refactoring (Presentational and Container)
// TODO DRY

import React, { Component } from 'react'
import { Button, ButtonGroup, Alert, Form,  Modal, Badge } from "react-bootstrap"
import { inject, observer } from 'mobx-react'
import { hexToNumberString, toWei, fromWei } from 'web3-utils'
import {
  ABISmartToken,
  ABIBancorNetwork,
  BancorNetwork,
  ABIConverter
} from '../../../config'

import getWeb3ForRead from '../../../service/getWeb3ForRead'
import findByProps from '../../../service/findByProps'
import getPath from '../../../service/getPath'

import { Typeahead } from 'react-bootstrap-typeahead'

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
      this.getRate()
      this.checkRequireApprove()
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
      const bancorNetworkContract = web3.eth.Contract(ABIBancorNetwork, BancorNetwork)
      const path = getPath(this.state.from, this.state.to, this.state.bancorTokensStorageJson)

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
  }
  }

  // not need approve for ETH, BNT
  checkRequireApprove = () => {
    if(this.state.from === "ETH" || this.state.from === "BNT"){
      this.setState({ requireApprove: false})
    }else{
      this.setState({ requireApprove: true})
    }
  }


  // approve ERC20 standard
  approve = () => {
    if(this.state.from){
      const tokenInfoFrom = findByProps(this.state.bancorTokensStorageJson, "symbol", this.state.from)[0]
      const token = this.props.MobXStorage.web3.eth.Contract(ABISmartToken, tokenInfoFrom.tokenAddress)
      token.methods.approve(
        BancorNetwork,
        this.props.MobXStorage.web3.utils.toWei(String(this.state.directionAmount))
      ).send({from: this.props.MobXStorage.accounts[0]})
    }
    else{
      console.log(this.state.to, this.state.from, this.state.directionAmount)
      alert('Not correct input data')
    }
  }

  // choose an receiver (Converter or Bancor Network)
  // depending on the type of exchange (external or internal)
  wrapperApprove = async () => {
    if(this.state.to === "BNT" || this.state.from === "BNT"){
      console.log("Approve to converter")
      const tokenInfoFrom = findByProps(this.state.bancorTokensStorageJson, "symbol", this.state.from)[0]

      const converterAddress = tokenInfoFrom.converterAddress
      this.approve(converterAddress)
    }else{
      console.log("Approve to BancorNetwork")
      this.approve(BancorNetwork)
    }
  }

  // for ERC20 to ERC20
  claimAndConvert = () => {
    const web3 = this.props.MobXStorage.web3
    const bancorNetworkContract = web3.eth.Contract(ABIBancorNetwork, BancorNetwork)
    const path = getPath(this.state.from, this.state.to, this.state.bancorTokensStorageJson)

    bancorNetworkContract.methods.claimAndConvert(path,
      toWei(this.state.directionAmount),
      1
    ).send({from: this.props.MobXStorage.accounts[0]})
    this.closeModal()
  }

  // for BNT to ERC20 or vice versa
  quickConvert = () => {
    const web3 = this.props.MobXStorage.web3
    const tokenInfoFrom = findByProps(this.state.bancorTokensStorageJson, this.state.from)[0]
    const path = getPath(this.state.from, this.state.to, this.state.bancorTokensStorageJson)

    const converterContract = web3.eth.Contract(ABIConverter, tokenInfoFrom.converterAddress)
    converterContract.methods.quickConvert(
      path,
      web3.utils.toWei(String(this.state.directionAmount)),
      1
    ).send({from: this.props.MobXStorage.accounts[0]})
    this.closeModal()
  }

  // in case if from === ETH
  convertFromETH = () => {
    const web3 = this.props.MobXStorage.web3
    const bancorNetworkContract = web3.eth.Contract(ABIBancorNetwork, BancorNetwork)
    const path = getPath(this.state.from, this.state.to, this.state.bancorTokensStorageJson)
    const amount = web3.utils.toWei(String(this.state.directionAmount))

    bancorNetworkContract.methods.convert(path, amount, 1)
    .send({from: this.props.MobXStorage.accounts[0], value:amount })
    this.closeModal()
  }

  // trade
  trade = () => {
  if(this.state.to && this.state.from && this.state.directionAmount > 0){
    if(this.state.to !== this.state.from){
      if(this.state.from === "ETH"){
        this.convertFromETH()
      }
      else if(this.state.to === "BNT" && this.state.from !== "ETH"){
        this.quickConvert()
      }
      else if(this.state.from === "BNT"){
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
    requireApprove:false
  })



// TODO move this to a Presentational component
  render(){
    return(
    <React.Fragment>
    {
      this.props.MobXStorage.bancorTokensStorageJson
      ?
      (
        <Button variant="primary" size="sm" onClick={() => this.setState({ ShowModal: true })}>
        Trade
        </Button>
      )
      :
      (<Badge variant="primary">loading data...</Badge>)
    }
    <Modal
      size="lg"
      show={this.state.ShowModal}
      onHide={() => this.closeModal()}
      aria-labelledby="example-modal-sizes-title-lg"
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
          <Form.Group>
          <Form.Check
          name="selectFromOficial"
          type="checkbox"
          label="Show unofficial"
          onChange={e => this.change(e)}
          />
          </Form.Group>

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

      <br/>

      {/*select to*/}
      <React.Fragment>
      {
        this.state.officialSymbols && this.state.unofficialSymbols
        ?
        (
          <React.Fragment>
          <Form.Group>
          <Form.Check
          name="selectToOficial"
          type="checkbox"
          label="Show unofficial"
          onChange={e => this.change(e)}
          />
          </Form.Group>

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
      <Form.Control name="directionAmount" placeholder="Enter token amount" onChange={e => this.change(e)} type="number" min="1"/>
      <br/>
      {
        this.state.amountReturn > 0
        ?
        ( <div>
          <Alert variant="primary">You will receive {this.state.amountReturn} {this.state.reciveSymbol}</Alert>
          <br/>
          {
            this.props.MobXStorage.web3
            ?
            (
              <ButtonGroup size="sm">
              {
                this.state.requireApprove
                ?
                (
                  <Button variant="outline-primary" onClick={() => this.wrapperApprove()}>Approve</Button>
                )
                :
                (null)
              }
              <Button variant="outline-primary" onClick={() => this.trade()}>Trade</Button>
              </ButtonGroup>
            )
            :
            (null)
          }
          </div>
        )
        :
        (null)
      }
      </Modal.Body>
    </Modal>
    </React.Fragment>
    )
  }
}

export default inject('MobXStorage')(observer(TradeModal))
