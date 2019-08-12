// THIS COMPONENT ALLOW USER CALL FUND AND LIQUIDATE FROM A CERTAIN CONVERTER
// TODO refactoring (Presentational and Container)
// TODO DRY

import React, { Component } from 'react'
import { Button, ButtonGroup, Alert, Form,  Modal, Badge, Card } from "react-bootstrap"
import { inject, observer } from 'mobx-react'
import { hexToNumberString, toWei, fromWei } from 'web3-utils'
import findByProps from '../../../service/findByProps'
import getWeb3ForRead from '../../../service/getWeb3ForRead'
import { ABIConverter, ABISmartToken, BNTToken } from '../../../config'
import BigNumber from 'bignumber.js'

import { Typeahead } from 'react-bootstrap-typeahead'

class PoolModal extends Component {
  constructor(props, context) {
   super(props, context)
    this.state = {
    from:undefined,
    directionAmount:0,
    ShowModal:false,
    bancorTokensStorageJson:null,
    selectFromOficial:true,
    officialSymbols:undefined,
    unofficialSymbols:undefined,
    connectorAmount:undefined,
    BNTAmount:undefined,
    isFundAction:false
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

  componentDidUpdate = async (prevProps, prevState) => {
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

    // Update connctors info
    if(prevState.from !== this.state.from || prevState.directionAmount !== this.state.directionAmount){
      if(this.state.from)
        if(this.state.directionAmount > 0){
          const connectorsInfo = await this.calculateConnectorBySmartTokenAmount()
          console.log(connectorsInfo[0], connectorsInfo[1])
          const BNTAmount = connectorsInfo[0]
          const connectorAmount = connectorsInfo[1]
          console.log(connectorAmount)
          this.setState({ BNTAmount, connectorAmount })
        }else{
          this.setState({ BNTAmount:0, connectorAmount:0 })
      }
    }
  }

  // return converter contract, converter address, connector (ERC20) token address, smart token address and smart token contract
  getInfoBySymbol = () => {
    if(this.state.from && this.state.bancorTokensStorageJson){
      const web3 = getWeb3ForRead(this.props.MobXStorage.web3)
      const tokenInfo = findByProps(this.state.bancorTokensStorageJson, 'symbol', this.state.from)[0]
      return [
        web3.eth.Contract(ABIConverter, tokenInfo.converterAddress),
        tokenInfo.converterAddress,
        tokenInfo.tokenAddress,
        tokenInfo.smartToken,
        web3.eth.Contract(ABISmartToken, tokenInfo.smartTokenAddress)
      ]
    }
  }

 // calculateRelayByTokenInput = async () => {
 //  // partRelay = geRalayByInput(userInputInBNT)
 //  // Cot = getCOTByRalayRate(partRelay)
 //  // secondPart = geRalayByInput(Cot)
 //  // result = partRelay + secondPart
 //  // return calculateConnectorBySmartTokenAmount(result)
 // }

 // return BNT and ERC20 connectors amount calculated by smart token amount
 calculateConnectorBySmartTokenAmount = async () => {
   const amount = toWei(String(this.state.directionAmount))
   const converterInfo = this.getInfoBySymbol()
   const token = converterInfo[4]
   const converter = converterInfo[0]
   const connectorCount = await converter.methods.connectorTokenCount().call()

   let supply = await token.methods.totalSupply().call()
   supply = hexToNumberString(supply._hex)

   let connectorsAmount = []
   let connectorAmount
   let connectorToken
   let connectorBalance

   for(let i = 0; i < connectorCount; i++){
     connectorToken = await converter.methods.connectorTokens(i).call()
     connectorBalance = await converter.methods.getConnectorBalance(connectorToken).call()
     connectorBalance = hexToNumberString(connectorBalance._hex)
     // Bancor calculation
     // _amount.mul(connectorBalance).div(supply);
     let bigAmount = new BigNumber(amount)
     let bigConnectorBalance = new BigNumber(connectorBalance)
     let bigSupply = new BigNumber(supply)
     connectorAmount = bigAmount.multipliedBy(bigConnectorBalance).dividedBy(bigSupply).toFixed(0)

     connectorsAmount.push(connectorAmount)
   }

   return connectorsAmount
 }

 // TEMPORARY SOLUTION UNTIL ISSUE WITH BATCHREQUEST
 approveBNT = async () => {
   const tokenInfo = this.getInfoBySymbol()
   const converterAddress = tokenInfo[1]
   console.log("converterAddress", converterAddress)

   const bnt = this.props.MobXStorage.web3.eth.Contract(ABISmartToken, BNTToken)
   bnt.methods.approve(
   converterAddress,
   this.state.BNTAmount
   ).send({from: this.props.MobXStorage.accounts[0]})
 }

 approveConnector = async () => {
   const tokenInfo = this.getInfoBySymbol()
   const converterAddress = tokenInfo[1]
   const connectorAddress = tokenInfo[2]
   const connector = this.props.MobXStorage.web3.eth.Contract(ABISmartToken, connectorAddress)
   connector.methods.approve(
   converterAddress,
   this.state.connectorAmount
   ).send({from: this.props.MobXStorage.accounts[0]})
  }




  fund = () => {
    if(this.state.directionAmount > 0){
      const converter = this.getInfoBySymbol()[0]
      const info = this.getInfoBySymbol()
      const reciver = info[1]
      console.log(reciver)
      converter.methods.fund(toWei(String(this.state.directionAmount))).send({ from:this.props.MobXStorage.accounts[0] })
    }
    else {
      alert("Please input amount")
    }
  }

  liquidate = () => {
    if(this.state.directionAmount > 0){
      const converter = this.getInfoBySymbol()[0]
      converter.methods.liquidate(toWei(String(this.state.directionAmount))).send({ from:this.props.MobXStorage.accounts[0] })
    }
    else {
      alert("Please input amount")
    }
  }

  // reset states after close modal
  closeModal = () => this.setState({
    to:undefined,
    from:undefined,
    directionAmount:0,
    ShowModal:false,
    bancorTokensStorageJson:null,
    selectToOficial:true,
    selectFromOficial:true,
    officialSymbols:undefined,
    unofficialSymbols:undefined
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
          Pool
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
        <small>Pool</small>
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                    placeholder="Choose a symbol for send"
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
                    placeholder="Choose a symbol for send"
                />
              )
            }
            <br/>
            <Form.Control name="directionAmount" placeholder="Enter relay amount to recive" onChange={e => this.change(e)} type="number" min="1"/>
            <br/>
            {/* Connectors info */}
            {
              this.state.BNTAmount && this.state.connectorAmount
              ?
              (
                <Alert variant="info">
                You will pay BNT: &nbsp; {fromWei(this.state.BNTAmount)}, &nbsp; {this.state.from}: &nbsp; {fromWei(this.state.connectorAmount)}
                </Alert>
              )
              :
              (null)
            }
            {/* Buttons */}
            <br/>
            {
              this.state.from && this.props.MobXStorage.web3 && this.state.BNTAmount
              ?
              (
              <ButtonGroup>
              <Button variant={ this.state.isFundAction ? "primary":"outline-primary" }size="sm" name="isFundAction" onClick={e => this.change(e)}>Fund</Button>
              <Button variant="outline-primary" size="sm" onClick={() => this.liquidate()}>Liguidate</Button>
              </ButtonGroup>
              )
              :
              (null)
            }
            {
              this.state.isFundAction && this.state.BNTAmount
              ?
              (
                <React.Fragment>
                <br/>
                <br/>
                <Card className="text-center">
                <Card.Body>
                <ButtonGroup>
                <Button variant="outline-info" size="sm" onClick={() => this.approveBNT()}>Step 1: Approve BNT</Button>
                <Button variant="outline-info" size="sm" onClick={() => this.approveConnector()}>Step 2: Approve connector</Button>
                <Button variant="outline-info" size="sm" onClick={() => this.fund()}>Step 3: Fund</Button>
                </ButtonGroup>
                <Card.Text><small>Please do not press fund button untill step 1 and 2 will be confirmed</small></Card.Text>
                </Card.Body>
                </Card>
                </React.Fragment>
              )
              :
              (null)
            }
            </React.Fragment>
          )
          :
          (null)
        }
        </React.Fragment>
        </Modal.Body>
      </Modal>
      </React.Fragment>
      )
    }
}

export default inject('MobXStorage')(observer(PoolModal))
