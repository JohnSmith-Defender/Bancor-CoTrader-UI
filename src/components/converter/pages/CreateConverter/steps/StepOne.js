import { ABISmartToken, BYTECODESmartToken, gasPrice } from '../../../../../config'
import { Form, Button, Card } from "react-bootstrap"
import { inject } from 'mobx-react'
import React, { Component } from 'react'

class StepOne extends Component {
 constructor(props, context) {
 super(props, context)
 this.state = {
  address:null
 }
 }

 change = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
 }

 createSmartToken = async (tokenAddress) => {
   const web3 = this.props.MobXStorage.web3
   const accounts = this.props.MobXStorage.accounts
   if(web3.utils.isAddress(tokenAddress)){
     // Get name for smart token from input tokenAddress
     // write txs in local storage
     let token = new web3.eth.Contract(ABISmartToken, tokenAddress)
     let name = await token.methods.name().call()
     let symbol = await token.methods.symbol().call()

     // in case if return bytes32
     if(typeof name !== "string" || typeof symbol !== "string"){
       name = prompt("Enter token name");
       symbol = prompt("Enter token symbol");
     }

     if(name === null && symbol === null){
       alert("Token can't be without name and symbol")
     }
     else{
       console.log("Name ", name, "Symbol ", symbol)
       const contract = new web3.eth.Contract(ABISmartToken, null)

       const stname = name + " Smart Relay Token"
       const stsymbol = symbol+"BNT"

       window.localStorage.setItem('userToken', tokenAddress);

       console.log("PARAMS: ", stname, stsymbol, 18)

       contract.deploy({
           data: BYTECODESmartToken,
           arguments: [stname, stsymbol, 18]
       })
       .send({
         from: accounts[0],
         gas:2372732,
         gasPrice
       })
       .on('transactionHash', (hash) => {
        console.log("smart token hash ", hash)
        window.localStorage.setItem('txSmartToken', hash)
        this.props.MobXStorage.setPending(true)
        window.localStorage.setItem('StepNext', "Two")
        window.localStorage.setItem('txLatest', hash)
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        this.props.MobXStorage.checkTxStatus(receipt.transactionHash)
      })
     }
   }
   else{
     alert('Not correct address')
   }
 }

render() {
  return(
    <Card className="text-center">
   <h3>Step 1</h3>
   <strong>Create Relay Token (aka SmartToken)</strong>
   <p>If your token is called AAA, a relay token called AAABNT will be created.</p>
   <p>Relay tokens are a bridge between your token and the Bancor BNT trade network.</p>
   <strong>This will be executed with these parameters</strong>
   <small>Name: AAA Smart Relay Token</small>
   <small>Symbol: AAABNT</small>
   <small>Decimals: 18</small>
   <br/>
   <Form>
   <Form.Group>
    <Form.Label>Enter Token Address:</Form.Label>
    <Form.Control name="address" placeholder="0x..." onChange={e => this.change(e)}/>
    <Form.Text>Note: your token must have 18 decimals.</Form.Text>
   </Form.Group>
   <Button size="sm" onClick={() => this.createSmartToken(this.state.address)}>create smart token</Button>
   </Form>
    </Card>
  )
}
}

export default inject('MobXStorage')(StepOne)
