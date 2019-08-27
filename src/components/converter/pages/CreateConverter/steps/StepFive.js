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
  BNTAmount:0,
  connectorAmount:0,
  rateAmount:0,
  rateInDAI:0
  }
 }

 _isMounted = false

 componentDidMount () {
   // in case to recive props
   setTimeout(() => this.init(), 1000)
 }

 componentDidUpdate(prevProps, prevState) {
   if(prevState.BNTAmount !== this.state.BNTAmount || prevState.connectorAmount !== this.state.connectorAmount){
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

 calculateRate = async () => {
   let rateAmount
   let rateInDAI
   if(this.state.BNTAmount > 0 && this.state.connectorAmount > 0){
     rateAmount = this.state.connectorAmount / this.state.BNTAmount
     rateInDAI = await this.convertBNTToDAI(rateAmount)
   }
   this.setState({ rateAmount, rateInDAI })
 }

 convertBNTToDAI = async (amount) => {
   const web3 = this.props.MobXStorage.web3
   const bancorNetworkContract = new web3.eth.Contract(ABIBancorNetwork, BancorNetwork)
   // BNT, DAI Smart Token, DAI
   const path = ["0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C", "0xee01b3AB5F6728adc137Be101d99c678938E6E72", "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359"]

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
    The ratio you’ve set is 1 {this.state.symbol} per X BNT (1 BNT per Y {this.state.symbol})
    </Typography>
    <Typography variant="body1" className={'mb-2'} component="p">
    The current USD price would be roughly 1 {this.state.symbol} per X USD (1 USD per Y {this.state.symbol})
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
    <Form.Control name="fee" onChange={e => this.setState({BNTAmount:e.target.value})} type="number" placeholder="Enter BNT amount"/>
    <hr/>
    <Form.Control name="fee" onChange={e => this.setState({connectorAmount:e.target.value})} type="number" placeholder={`Enter email ${this.state.symbol}`}/>
    <br/>
    {
      this.state.rateAmount > 0
      ?
      (
        <Typography variant="body1" className={'mb-2'} component="p">
        The price of {this.state.connectorAmount} {this.state.symbol} will be {this.state.rateAmount} BNT ({this.state.rateInDAI.toFixed(2)} $)
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
