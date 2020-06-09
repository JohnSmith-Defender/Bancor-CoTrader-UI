import {
  ABISmartToken,
  ERC20Bytes32ABI,
  BancorConverterRegistryABI,
  BNTToken,
  USDBToken
 } from '../../../../../config'

import getBancorContractByName from '../../../../../service/getBancorContractByName'

import { Form } from "react-bootstrap"
import React, { Component } from 'react'
import { toUtf8 } from 'web3-utils'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'


class StepOne extends Component {
 constructor(props, context) {
 super(props, context)
   this.state = {
    address:null,
    connectorType:''
   }
 }

 componentDidMount() {
   const connectorType = window.localStorage.getItem('connectorType')
   this.setState({ connectorType })
 }

 change = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
 }

 // Return true if token alredy exist in official with the same connector time
 checkToken = async (token) => {
   let status = false
   try{
     let bancorConncectorAddress
     const connectorType = window.localStorage.getItem('connectorType')

     if(connectorType === "USDB" || connectorType === "BNT"){
       bancorConncectorAddress = connectorType === "USDB" ? USDBToken : BNTToken
     }
     const web3 = this.props.MobXStorage.web3
     const BancorRegistryAddress = await getBancorContractByName("BancorConverterRegistry")
     const bancorregistry = new web3.eth.Contract(BancorConverterRegistryABI, BancorRegistryAddress)

     // check if token and connector exist or not
     const sideOne = await bancorregistry.methods.getLiquidityPoolByReserveConfig([token, bancorConncectorAddress], [500000,500000]).call()
     const sideTwo = await bancorregistry.methods.getLiquidityPoolByReserveConfig([bancorConncectorAddress, token], [500000,500000]).call()

     console.log(sideOne, sideTwo)

     if(sideOne !== '0x0000000000000000000000000000000000000000' || sideTwo !== '0x0000000000000000000000000000000000000000')
        status = true
   }
   catch(e){
     alert("Can not check token status, please try latter")
     console.log("error :", e)
   }
   return status
 }

 createNewPool = async (tokenAddress) => {
   const web3 = this.props.MobXStorage.web3
   const accounts = this.props.MobXStorage.accounts
   const isRegistered = await this.checkToken(tokenAddress)
   if(isRegistered){
     const connectorType = window.localStorage.getItem('connectorType')
     alert(`Sorry, but this token alredy exists in the official registry with ${connectorType} connector type`)
     window.localStorage.clear()
     window.location.reload()
   }
   else if(web3.utils.isAddress(tokenAddress)){
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
         const BancorConverterRegistryAddress = await getBancorContractByName('BancorConverterRegistry')
         const BancorConverterRegistry = new web3.eth.Contract(BancorConverterRegistryABI, BancorConverterRegistryAddress)

         const connectorSymbol = this.state.connectorType
         const stname = name + " Smart Relay Token"
         const stsymbol = symbol+connectorSymbol
         const connectorType = window.localStorage.getItem('connectorType')
         const bancorConncectorAddress = connectorType === "USDB" ? USDBToken : BNTToken

         window.localStorage.setItem('userToken', tokenAddress)
         window.localStorage.setItem('tokenSymbol', symbol)

         console.log("PARAMS: ", stname, stsymbol, 18)
         const gasPrice = this.props.MobXStorage.GasPrice

         BancorConverterRegistry.methods.newConverter(
           1,
           stname,
           stsymbol,
           18,
           500000,
           [bancorConncectorAddress, tokenAddress],
           [500000,500000]
         )
         .send({
           from: accounts[0],
           //gas:3372732,
           gasPrice
         })
         .on('transactionHash', (hash) => {
          console.log("step one hash ", hash)
          window.localStorage.setItem('txConverter', hash)
          this.props.MobXStorage.setPending(true)
          window.localStorage.setItem('StepNext', "Two")
          window.localStorage.setItem('txLatest', hash)
          window.localStorage.setItem('userAddress', this.props.MobXStorage.accounts[0])
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
    <Card style={{backgroundColor:'rgba(255,255,255,0.1)'}}>
      <CardContent>
        <Typography variant="h4" gutterBottom component="h4">
          Step 1 of 2
        </Typography>
        <Typography variant="body1" className={'mb-2'} component="p">
          <strong>Add a new token to the Bancor network</strong>
        </Typography>
        <Typography variant="body1" className={'mb-2'} component="p">
          If your token is called AAA, a relay token called AAA{this.state.connectorType} will be created.
        </Typography>
        <Typography variant="body1" className={'mb-2'} component="p">
          Relay tokens are a bridge between your token and the Bancor BNT trade network.
        </Typography>
        <Typography className={'mt-2 mb-2'} component="div">
        <hr/>
        <Form style={{margin: '10px auto', maxWidth: '350px', width:'100%'}}>
        <Form.Group>
         <Form.Label>Enter the Address of your token - the token you want to add to Bancor:</Form.Label>
         <Form.Control name="address" placeholder="0x..." onChange={e => this.change(e)}/>
        </Form.Group>
        <Button variant="contained" color="primary" size="medium" onClick={() => this.createNewPool(this.state.address)}>create new pool</Button>
        </Form>
        </Typography>
      </CardContent>
    </Card>
  )
}
}

export default StepOne
