import {
  ABIConverter,
  ABISmartToken,
  USDBToken,
  BNTToken,
  BancorRegistryABI

} from '../../../../../config'
import React, { Component } from 'react'
import { fromWei } from 'web3-utils'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Pending from "../../../../templates/Spiners/Pending"
import { Form } from "react-bootstrap"
import UserInfo from '../../../../templates/UserInfo'
import getBancorContractByName from '../../../../../service/getBancorContractByName'

class StepBatch extends Component {
 constructor(props, context) {
  super(props, context);
   this.state = {
    converterAddress:undefined,
    connectorType: undefined,
    tokenSymbol: undefined,
    BNTAmount:0,
    totalERCAmount:0,
    totalBNTAmount:0,
    fee:1000
   }
 }

 componentDidMount = async () => {
   let converterAddress = await this.getConverterAddress()
   const connectorType = window.localStorage.getItem('connectorType')
   const tokenSymbol = window.localStorage.getItem('tokenSymbol')
   this.setState({ connectorType, tokenSymbol })

   if(converterAddress){
     this.setState({ converterAddress })
   }
   else{
     let timerId = setInterval(async () => {
       converterAddress = await this.getConverterAddress()
       if(converterAddress){
         this.setState({ converterAddress })
         clearInterval(timerId)
       }
     }, 5000);
   }
 }

 getConverterAddress = async () => {
   let converterAddress
   try{
     const web3 = this.props.MobXStorage.web3
     const converterHash = window.localStorage.getItem('txConverter')
     const converterInfo = await web3.eth.getTransactionReceipt(converterHash)
     converterAddress = converterInfo.contractAddress
   }catch(e){
     console.log("Can't get converter address")
   }
   return converterAddress
 }

 // helper for create batch request
 getTxObject = (from, to, data, gasPrice, gas) => {
   return {
     from,
     to,
     "value": "0x0",
     data,
     gasPrice,
     gas,
   }
 }

 calculateRate = () => {
   const totalBNTAmount = this.state.totalERCAmount * this.state.BNTAmount
   this.setState({ totalBNTAmount })
 }

 execudeBatch = async () => {
   const web3 = this.props.MobXStorage.web3
   const converterHash = window.localStorage.getItem('txConverter')
   const converterInfo = await web3.eth.getTransactionReceipt(converterHash)
   const smartTokenHash = window.localStorage.getItem('txSmartToken')
   const smartTokenInfo = await web3.eth.getTransactionReceipt(smartTokenHash)
   const smartToken = new web3.eth.Contract(ABISmartToken, smartTokenInfo.contractAddress)
   const converter = new web3.eth.Contract(ABIConverter, converterInfo.contractAddress)
   const smartTokenAddress = smartTokenInfo.contractAddress
   const converterAddress = converterInfo.contractAddress

   // Check if converter and smart token deployed and stored in local storage
   if(converterInfo && smartTokenInfo){
     const connectorTokenAddress = window.localStorage.getItem('userToken')
     const connectorType = window.localStorage.getItem('connectorType')

     let bancorConncectorAddress
     if(connectorType === "USDB" || connectorType === "BNT")
        bancorConncectorAddress = connectorType === "USDB" ? USDBToken : BNTToken

     const bancorConnectorContract = new web3.eth.Contract(ABISmartToken,  bancorConncectorAddress)
     const BNTConnectorBalance = await bancorConnectorContract.methods.balanceOf(converterAddress).call()
     const сonnectorToken = new web3.eth.Contract(ABISmartToken, connectorTokenAddress)
     const connectorBalance = await сonnectorToken.methods.balanceOf(converterAddress).call()

     console.log(connectorTokenAddress)

     // check if user makes deposit
     if(fromWei(String(BNTConnectorBalance)) > 0 && fromWei(String(connectorBalance)) > 0){
        // Do Batch request
        const gasPrice = this.props.MobXStorage.GasPrice
        const gas = 400000

        let batch = new web3.BatchRequest()

        // addReserve tx 1 (step 3)
        const addReserveData = converter.methods.addReserve(
          window.localStorage.getItem('userToken'), 500000)
        .encodeABI({from: this.props.MobXStorage.accounts[0]})
        console.log("PARAMS step 3: ", window.localStorage.getItem('userToken'), 500000)

        // setConversionFee tx 2 (step 4)
        const setConversionFeeData = converter.methods.setConversionFee(this.state.fee)
        .encodeABI({from: this.props.MobXStorage.accounts[0]})
        console.log("PARAMS step 4: ", this.state.fee)

        // get data for tx 3
        const issueBalance = BNTConnectorBalance.mul(2)

        // issue tx 3 (step 5)
        const issueData = smartToken.methods.issue(this.props.MobXStorage.accounts[0], issueBalance)
        .encodeABI({from: this.props.MobXStorage.accounts[0]})
        console.log("PARAMS step 5:", this.props.MobXStorage.accounts[0], issueBalance)

        // transferOwnership tx 4 (step 6)
        const transferOwnershipData = smartToken.methods.transferOwnership(converterAddress)
        .encodeABI({from: this.props.MobXStorage.accounts[0]})
        console.log("PARAMS step 6:", converterAddress)

        // acceptTokenOwnership tx 5 (step 7)
        const acceptTokenOwnershipData = converter.methods.acceptTokenOwnership()
        .encodeABI({from: this.props.MobXStorage.accounts[0]})
        console.log("PARAMS step 7 (no need params)")

        // add to registry tx 6 (step 8)
        const BancorRegistryAddress = await getBancorContractByName("BancorConverterRegistry")
        const registry = new web3.eth.Contract(BancorRegistryABI, BancorRegistryAddress)
        const addConverterData = registry.methods.addConverter(converterAddress)
        .encodeABI({from: this.props.MobXStorage.accounts[0]})
        console.log("PARAMS step 8", converterAddress)

        const txOne = this.getTxObject(this.props.MobXStorage.accounts[0], converterAddress, addReserveData, gasPrice, gas)
        const txTwo = this.getTxObject(this.props.MobXStorage.accounts[0], converterAddress, setConversionFeeData, gasPrice, gas)
        const txThree = this.getTxObject(this.props.MobXStorage.accounts[0], smartTokenAddress, issueData, gasPrice, gas)
        const txFour = this.getTxObject(this.props.MobXStorage.accounts[0], smartTokenAddress, transferOwnershipData, gasPrice, gas)
        const txFive = this.getTxObject(this.props.MobXStorage.accounts[0], converterAddress, acceptTokenOwnershipData, gasPrice, gas)
        const txSix = this.getTxObject(this.props.MobXStorage.accounts[0], BancorRegistryAddress, addConverterData, gasPrice, gas)


        batch.add(web3.eth.sendTransaction.request(txOne, () => console.log("tx 1")))
        batch.add(web3.eth.sendTransaction.request(txTwo, () => console.log("tx 2")))
        batch.add(web3.eth.sendTransaction.request(txThree, () => console.log("tx 3")))
        batch.add(web3.eth.sendTransaction.request(txFour, () => console.log("tx 4")))
        batch.add(web3.eth.sendTransaction.request(txFive, () => console.log("tx 5")))
        batch.add(web3.eth.sendTransaction.request(txSix, () => {
          console.log("tx 6")
          alert("Congratulations after confirming all transactions, your token will appear in the list!")
          window.localStorage.clear()
          window.location.reload()
        }))
        batch.execute()
   }
   else{
        alert('Please deposit both tokens to converter')
     }
   }
   else{
       alert("Converter contract not deployed yet, please wait")
   }
 }


 render() {
   return(
    <Card style={{backgroundColor:'rgba(255,255,255,0.1)'}}>
    <CardContent>
    {
      this.state.converterAddress
      ?
      (
        <>
        <Typography variant="h4" gutterBottom component="h4">
        Step 3 of 3
        </Typography>

        <Typography variant="body1" className={'mb-2'} component="p">
          <strong>Initial token price and settup converter and smart token</strong>
        </Typography>

        <Form style={{margin: '10px 0', maxWidth: '350px', width:'100%',  marginLeft: "auto", marginRight: "auto"}}>
        <br/>
        <Form.Label>What starting { this.state.connectorType } price do you want for your token?</Form.Label>
        <Form.Control onChange={e => this.setState({ BNTAmount:e.target.value })} type="number" placeholder={`Enter ${this.state.connectorType} amount for 1 ${this.state.tokenSymbol}`}/>
        <br/>
        <Form.Label>What {this.state.tokenSymbol} amount do you want to put in the reserves?</Form.Label>
        <Form.Control onChange={e => this.setState({ totalERCAmount:e.target.value })} type="number" placeholder={`Enter total ${this.state.tokenSymbol} amount`}/>
        <Button variant="contained" color="primary" size="medium" onClick={() => this.calculateRate()}>Calculate</Button>
        </Form>
        {
          this.state.totalBNTAmount > 0
          ?
          (
            <>
            <Typography variant="body1" className={'mb-2'} component="p">
            Please transfer {this.state.totalBNTAmount} {this.state.connectorType} and {this.state.totalERCAmount} {this.state.tokenSymbol} here:
            </Typography>

            <Typography variant="body1" className={'mb-2'} component="p">
            <strong>{this.state.converterAddress}</strong>
            </Typography>

            <Typography variant="body1" className={'mb-2'} component="p">
            After deposit please confirm all transactions in your wallet in order, and don't reject tranasactions.
            </Typography>

            <Typography variant="body1" className={'mb-2'} component="p">
            This <UserInfo label="Bancor documentation" info={`Add connector, issue relay, set conversion fee (0.1% by default), ​transfer ownership of relay to converter, ​ accept token ownership by converter​`}/> steps will be done
            </Typography>

            <Typography className={'mt-2 mb-2'} component="div">
            <hr/>
            <Button variant="contained" color="primary" size="medium" onClick={() => this.execudeBatch()}>Execude batch request</Button>
            </Typography>
            </>
          )
          :null
        }
        </>
      )
      :
      (
        <>
        <Typography variant="body1" className={'mb-2'} component="p">
        Converter not deployed yet, please wait
        </Typography>
        <Pending/>
        </>
      )
    }

    </CardContent>
  </Card>
  )
}
}

export default StepBatch
