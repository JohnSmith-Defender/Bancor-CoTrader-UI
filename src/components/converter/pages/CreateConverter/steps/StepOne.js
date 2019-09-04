import { ABISmartToken, BYTECODESmartToken, ERC20Bytes32ABI } from '../../../../../config'
import { Form } from "react-bootstrap"
//import { inject } from 'mobx-react'
import React, { Component } from 'react'
import { toUtf8 } from 'web3-utils'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import UserInfo from '../../../../templates/UserInfo'

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

     if(decimals < 0){
       alert("Sorry, but You have no standard token")
     }
     else{
       const conf = window.confirm(`Your token name is ${name} your decimals is ${decimals}`)
       if(conf){
         console.log("Name ", name, "Symbol ", symbol)
         const contract = new web3.eth.Contract(ABISmartToken, null)

         const stname = name + " Smart Relay Token"
         const stsymbol = symbol+"BNT"

         window.localStorage.setItem('userToken', tokenAddress)
         window.localStorage.setItem('tokenSymbol', symbol)

         console.log("PARAMS: ", stname, stsymbol, decimals)
         const gasPrice = this.props.MobXStorage.GasPrice

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
   }
   else{
     alert('Not correct address')
   }
 }

render() {
  return(
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom component="h4">
          Step 1
        </Typography>
        <Typography variant="body1" className={'mb-2'} component="p">
          <strong>Create Relay Token (aka SmartToken)</strong>
        </Typography>
        <Typography variant="body1" className={'mb-2'} component="p">
          If your token is called AAA, a relay token called AAABNT will be created.
        </Typography>
        <Typography variant="body1" className={'mb-2'} component="p">
          Relay tokens are a bridge between your token and the Bancor BNT trade network.
        </Typography>
        <Typography variant="body1" className={'mb-2'} component="p">
          This <UserInfo label="Bancor documentation" info="Name: AAA Smart Relay Token, Symbol: AAABNT, Decimals: Your decimals number"/> step will be done
        </Typography>
        <Typography className={'mt-2 mb-2'} component="div">
        <hr/>
        <Form style={{margin: '10px 0', maxWidth: '350px', width:'100%'}}>
        <Form.Group>
         <Form.Label>Enter Address of the Token You'd Like to Create a Relay For:</Form.Label>
         <Form.Control name="address" placeholder="0x..." onChange={e => this.change(e)}/>
        </Form.Group>
        <Button variant="contained" color="primary" size="medium" onClick={() => this.createSmartToken(this.state.address)}>create smart token</Button>
        </Form>
        </Typography>
      </CardContent>
    </Card>
  )
}
}

export default StepOne
