import {
  ABISmartToken,
  BNTToken,
  ABIBancorNetwork,
  BancorNetwork,
  EtherscanLink,
  USDBToken
} from '../../../../../config'

import { Form, Alert } from "react-bootstrap"
import React, { Component } from 'react'
import { hexToNumberString, toWei, fromWei } from 'web3-utils'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import StepFiveBNT from './modules/StepFiveBNT'
import UserInfo from '../../../../templates/UserInfo'

class StepFive extends Component {
 constructor(props, context) {
 super(props, context);
  this.state = {
  converterAddress:null,
  web3:null,
  symbol:undefined,
  USDAmount:0,
  totalAmount:0,
  connectorType:null
  }
 }

 componentDidMount () {
   // in case to recive props
   setTimeout(() => this.init(), 1000)
 }

 componentDidUpdate(prevProps, prevState) {
   // Update Bancor connector type by select
   if(this.state.connectorType && prevState.connectorType !== this.state.connectorType){
     window.localStorage.setItem('connectorType', this.state.connectorType)
     if(this.state.connectorType === "USDB" || this.state.connectorType === "BNT"){
       const bancorConncectorAddress = this.state.connectorType === "USDB" ? USDBToken : BNTToken
       this.setState({ bancorConncectorAddress })
     }
   }
 }

 init = async () => {
    const converterAddress = window.localStorage.getItem('Converter')
    const symbol = window.localStorage.getItem('tokenSymbol') ? window.localStorage.getItem('tokenSymbol') : "Your token"
    const userAddress = window.localStorage.getItem('userAddress')
    const connectorType = window.localStorage.getItem('connectorType')
    let bancorConncectorAddress

    if(connectorType === "USDB" || connectorType === "BNT")
       bancorConncectorAddress = this.state.connectorType === "USDB" ? USDBToken : BNTToken

    this.setState({ converterAddress, symbol, userAddress, connectorType, bancorConncectorAddress})
 }

 // Get rate from Bancor contract
 getRate = async (amount, path) => {
   const web3 = this.props.MobXStorage.web3
   const bancorNetworkContract = new web3.eth.Contract(ABIBancorNetwork, BancorNetwork)

   let amountReturn = await bancorNetworkContract.methods.getReturnByPath(
     path,
     toWei(String(amount))
   ).call()

   if(amountReturn){
     amountReturn = Number(fromWei(hexToNumberString(amountReturn[0]._hex)))
   }else{
     amountReturn = 0
   }
   return amountReturn
 }

 // Issue new smart tokens
 issue = async () => {
  const web3 = this.props.MobXStorage.web3
  const accounts = this.props.MobXStorage.accounts

  const smartTokenAddress = window.localStorage.getItem('smartToken')
  const connectorTokenAddress = window.localStorage.getItem('userToken')

  // Conector 1
  const bancorConnectorContract = new web3.eth.Contract(ABISmartToken, this.state.bancorConncectorAddress)
  let balance = await bancorConnectorContract.methods.balanceOf(this.state.converterAddress).call()
  balance = web3.utils.hexToNumberString(balance._hex)
  balance = Number(web3.utils.fromWei(balance))

  // Connector 2
  const ConnectorToken = new web3.eth.Contract(ABISmartToken, connectorTokenAddress)
  let connectorBalance = await ConnectorToken.methods.balanceOf(this.state.converterAddress).call()
  connectorBalance = web3.utils.hexToNumberString(connectorBalance._hex)
  connectorBalance  = Number(web3.utils.fromWei(connectorBalance))

  if(balance > 0 && connectorBalance > 0){
    // Balance 2x for BNT rate
    balance = balance * 2
    balance = web3.utils.toWei(String(balance))

    const converter = new web3.eth.Contract(ABISmartToken, smartTokenAddress)
    console.log("PARAMS: ", accounts[0], balance)
    const gasPrice = this.props.MobXStorage.GasPrice

    converter.methods.issue(accounts[0], balance).send({
      from:accounts[0],
      gas:1372732,
      gasPrice
    }).on('transactionHash', (hash) => {
     console.log("SetFee hash ", hash)
     window.localStorage.setItem('StepNext', "Six")
     window.localStorage.setItem('txLatest', hash)
     this.props.MobXStorage.setPending(true)
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      this.props.MobXStorage.txFinish()
    })
  }
  else{
    alert("Converter has not received balance yet")
  }
 }


render() {
  return(
    <React.Fragment>
    {
      this.state.userAddress
      ?
      (
        <Alert variant="warning"> <small>Please do deposit from the same wallet address you started with: <strong> {this.state.userAddress} </strong></small></Alert>
      )
      :(null)
    }

    <Card>
    <CardContent>
    <Typography variant="h4" gutterBottom component="h4">
    Step 5
    </Typography>

    <Typography variant="body1" className={'mb-2'} component="p">
    <strong>Funding & Initial Supply</strong>
    </Typography>
    <Typography variant="h6" gutterBottom component="h6">
    ACTIONS
    </Typography>

    <hr/>
    <Form style={{margin: '10px 0', maxWidth: '350px', width:'100%'}}>
    <Form.Group controlId="exampleForm.ControlSelect1">
    <Form.Label>Select connector type</Form.Label>
    <Form.Control as="select" onChange={(e) => this.setState({ connectorType:e.target.value })}>
      <option>...</option>
      <option>BNT</option>
      <option>USDB</option>
    </Form.Control>
    </Form.Group>
    </Form>
    <hr/>
    {
      this.state.connectorType === "BNT"
      ?
      (
        <StepFiveBNT
         userAddress={this.state.userAddress}
         symbol={this.state.symbol}
         converterAddress={this.state.converterAddress}
         getRate={this.getRate}
        />
      )
      :(null)
    }
    {
      this.state.connectorType === "USDB"
      ?
      (
        <Typography variant="body1" className={'mb-2'} component="p">
        Please deposit your token and USDB according to USD rate
        </Typography>
      )
      :(null)
    }
    <hr/>
    {
      this.state.connectorType === "BNT" || this.state.connectorType === "USDB"
      ?
      (
        <React.Fragment>
        <Typography variant="body1" className={'mb-2'} component="p">
        You selected {<a style={{color: '#3f51b5'}} href={EtherscanLink + "token/" + this.state.bancorConncectorAddress} target="_blank" rel="noopener noreferrer">{this.state.connectorType}</a>} connector type
        </Typography>
        <Typography variant="body1" className={'mb-2'} component="p">
        This <UserInfo label="Bancor documentation" info="Converter address (received from the token issuer), BNT connector balance x2"/> step will be done
        </Typography>
        <Button variant="contained" color="primary" size="medium" onClick={() => this.issue()}>issue</Button>
        </React.Fragment>
      )
      :(null)
    }
    </CardContent>
    </Card>
    </React.Fragment>
  )
}
}

export default StepFive
