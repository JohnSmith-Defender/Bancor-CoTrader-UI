import { ABISmartToken, BNTToken, ABIBancorNetwork, BancorNetwork } from '../../../../../config'
import { Form } from "react-bootstrap"
import React, { Component } from 'react'
import { hexToNumberString, toWei, fromWei } from 'web3-utils'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

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
  connectorAmount:0,
  BNTAmount:0
  }
 }

 componentDidMount () {
   // in case to recive props
   setTimeout(() => this.init(), 1000)
 }

 componentDidUpdate(prevProps, prevState) {
   if(prevState.USDAmount !== this.state.USDAmount || prevState.totalAmount !== this.state.totalAmount){
     this.calculateRate()
   }
 }

 init = async () => {
  if(this.props.MobXStorage.web3){
    const converterAddress = window.localStorage.getItem('Converter')
    const symbol = window.localStorage.getItem('tokenSymbol')

    if(converterAddress && symbol){
      this.setState({ converterAddress, symbol })
    }else{
      alert("Need create converter contract")
    }
  }
 }

 // Calculate rate for BNT and connector depending of user rate connector to USD (DAI)
 calculateRate = async () => {
   let connectorAmount
   let BNTAmount
   if(this.state.USDAmount > 0 && this.state.totalAmount){
     // DAI, DAI Smart Token, BNT
     const path = ["0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359","0xee01b3AB5F6728adc137Be101d99c678938E6E72", "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"]

     const half = this.state.totalAmount / 2
     // get BNT rate
     BNTAmount = await this.getRate(half, path)
     // get connector rate
     connectorAmount = half / this.state.USDAmount
   }
   this.setState({ BNTAmount, connectorAmount })
 }

 // Get rate from Bancor contract
 getRate = async (amount, path) => {
   const web3 = this.props.MobXStorage.web3
   const bancorNetworkContract = new web3.eth.Contract(ABIBancorNetwork, BancorNetwork)

   let amountReturn = await bancorNetworkContract.methods.getReturnByPath(
     path,
     toWei(String(amount))
   ).call()

   console.log(amountReturn)

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

  const BNTcontract = new web3.eth.Contract(ABISmartToken, BNTToken)
  let balance = await BNTcontract.methods.balanceOf(this.state.converterAddress).call()
  balance = web3.utils.hexToNumberString(balance._hex)
  balance = Number(web3.utils.fromWei(balance))

  const ConnectorToken = new web3.eth.Contract(ABISmartToken, connectorTokenAddress)
  let connectorBalance = await ConnectorToken.methods.balanceOf(this.state.converterAddress).call()
  connectorBalance = web3.utils.hexToNumberString(connectorBalance._hex)
  connectorBalance  = Number(web3.utils.fromWei(connectorBalance))

  console.log(connectorBalance, balance)

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
  console.log(this.state.symbol)
  return(
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
    <Typography variant="body1" className={'mb-2'} component="p">
    Great! Now define the starting price of your token!
    </Typography>
    <Typography variant="body1" className={'mb-2'} component="p">
    Send some Your token amount here: <strong>{this.state.converterAddress}</strong>
    </Typography>
    <Typography variant="body1" className={'mb-2'} component="p">
    Send some BNT amount here: <strong>{this.state.converterAddress}</strong>
    </Typography>
    <Typography variant="body1" className={'mb-2'} component="p">
    The RATIO of your token to BNT determines its starting price
    </Typography>

    <Typography variant="body1" className={'mb-2'} component="p">
    <strong style={{color: 'red'}}>Make sure that your contract received tokens, only then press button issue</strong>
    </Typography>
    <Typography variant="body1" className={'mb-2'} component="p">
    This <UserInfo label="Bancor documentation" info="Converter address (received from the token issuer), BNT connector balance x2"/> step will be done
    </Typography>

    <Form style={{margin: '10px 0', maxWidth: '350px', width:'100%'}}>
    <Form.Label>Calculate rate</Form.Label>
    <br/>
    <Form.Control onChange={e => this.setState({USDAmount:e.target.value})} type="number" placeholder={`Enter USD rate for 1 ${this.state.symbol}`}/>
    <hr/>
    <Form.Control onChange={e => this.setState({totalAmount:e.target.value})} type="number" placeholder={`Enter total USD amount`}/>
    <br/>
    {
      this.state.BNTAmount > 0 && this.state.connectorAmount > 0
      ?
      (
        <Typography variant="body1" className={'mb-2'} component="p">
        You need pay {this.state.BNTAmount} BNT and {this.state.connectorAmount} {this.state.symbol}
        </Typography>
      )
      :
      (null)
    }
    <Button variant="contained" color="primary" size="medium" onClick={() => this.issue()}>issue</Button>
    </Form>
    </CardContent>
    </Card>
  )
}
}

export default StepFive
