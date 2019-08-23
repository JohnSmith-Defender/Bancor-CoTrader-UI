import { ABISmartToken, BNTToken } from '../../../../../config'
import { Form, Button, Card } from "react-bootstrap"
import React, { Component } from 'react'

class StepFive extends Component {
 constructor(props, context) {
 super(props, context);
  this.state = {
  converterAddress:null,
  web3:null
  }
 }

 _isMounted = false

 componentDidMount () {
   // in case to recive props
   setTimeout(() => this.init(), 1000)
 }

 init = async () => {
  if(this.props.MobXStorage.web3){
    const converterAddress = window.localStorage.getItem('Converter')
    if(converterAddress !== null && converterAddress !== "undefined"){
      this.setState({ converterAddress })
    }else{
      alert("Need create converter contract")
    }
  }
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
    <Card className="text-center">

    <h3>Step 5</h3>
    <strong>Funding & Initial Supply</strong>
    <strong style={{"color":"DeepSkyBlue"}}>ACTIONS</strong>
    <p style={{"color":"DeepSkyBlue"}}>Great! Now define the starting price of your token!</p>
    <p style={{"color":"DeepSkyBlue"}}>Send some Your token amount here: {this.state.converterAddress}</p>
    <p style={{"color":"DeepSkyBlue"}}>Send some BNT amount here: {this.state.converterAddress}</p>
    <p>The RATIO of Your token to BNT determines its starting price!</p>
    <br/>
    <strong style={{"color":"red"}}>Make sure that a Your contract received tokens, only then press button issue</strong>
    <br/>
    <strong>This will be executed with these parameters</strong>
    <small>Address: owner address received from the token issuer</small>
    <small>Amount: BNT connector balance x 2 (remember the 18 decimals)</small>
    <Form>
    <Button size="sm" onClick={() => this.issue()}>issue</Button>
    </Form>
    </Card>
  )
}
}

export default StepFive
