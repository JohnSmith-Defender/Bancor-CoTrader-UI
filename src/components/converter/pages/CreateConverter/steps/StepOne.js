import { ABISmartToken, BYTECODESmartToken, ERC20Bytes32ABI, gasPrice } from '../../../../../config'
import { Form, Button, Card } from "react-bootstrap"
import { inject } from 'mobx-react'
import React, { Component } from 'react'
import { toUtf8 } from 'web3-utils'

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
     let name
     let symbol

     try{
       name = await token.methods.name().call()
       symbol = await token.methods.symbol().call()

     }
     // for no standard bytes32 return
     catch(error){
       try{
       token = new web3.eth.Contract(ERC20Bytes32ABI, tokenAddress)
       name = toUtf8(await token.methods.name().call())
       symbol = toUtf8(await token.methods.symbol().call())
     }catch(err){
       alert("Sorry, but You have no standard token")
     }
     }

     const decimals = await token.methods.decimals.call()

     if(!decimals){
       alert("Sorry, but You have no standard token")
     }

     let conf = window.confirm(`Your token name is ${name} your decimals is ${decimals}`)


     if(conf){
       console.log("Name ", name, "Symbol ", symbol)
       const contract = new web3.eth.Contract(ABISmartToken, null)

       const stname = name + " Smart Relay Token"
       const stsymbol = symbol+"BNT"

       window.localStorage.setItem('userToken', tokenAddress);

       console.log("PARAMS: ", stname, stsymbol, decimals)

       contract.deploy({
           data: BYTECODESmartToken,
           arguments: [stname, stsymbol, decimals]
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
        this.props.MobXStorage.txFinish()
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
   <small>Decimals: Your decimals number</small>
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
