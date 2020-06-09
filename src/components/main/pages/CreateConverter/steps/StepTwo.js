import {
  ABIConverter,
  BNTToken,
  USDBToken
} from '../../../../../config'
import { Form } from "react-bootstrap"
import React, { Component } from 'react'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


class StepTwo extends Component {
 state = {
   bancorConncectorAddress:null
 }

 componentDidMount () {
   let bancorConncectorAddress
   const connectorType = window.localStorage.getItem('connectorType')
   if(connectorType === "USDB" || connectorType === "BNT"){
     bancorConncectorAddress = connectorType === "USDB" ? USDBToken : BNTToken
   }else{
     bancorConncectorAddress = BNTToken
     alert('You have problem with connector type, we set BNT by default')
   }
   this.setState({ bancorConncectorAddress })
 }

 acceptOwnership = async () => {
  // Get name for smart token from input tokenAddress
  // write txs in local storage
  const web3 = this.props.MobXStorage.web3
  const accounts = this.props.MobXStorage.accounts
  const stHash = window.localStorage.getItem('txConverter')

  const stInfo = await web3.eth.getTransactionReceipt(stHash)
  if(stInfo){
    const contractAddress = stInfo.contractAddress
    console.log("contractAddress", contractAddress, stInfo)
    const contract =  new web3.eth.Contract(ABIConverter, contractAddress)
    const gasPrice = this.props.MobXStorage.GasPrice

    contract.methods.AcceptOwnership()
    .send({
      from: accounts[0],
      gas:7372732,
      gasPrice
    })
    .on('transactionHash', (hash) => {
      this.props.MobXStorage.setPending(true)
      console.log("converter hash ", hash)
      window.localStorage.setItem('txLatest', hash)
      window.localStorage.setItem('StepNext', "Finish")
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      //this.props.MobXStorage.txFinish()
    })
  }
  else{
    alert("Your pool contract not deplyed, please wait")
  }


 }
render() {
  return(
    <Card style={{backgroundColor:'rgba(255,255,255,0.1)'}}>
      <CardContent>
        <Typography variant="h4" gutterBottom component="h4">
          Step 2 of 2
        </Typography>
        <Typography variant="body1" className={'mb-2'} component="p">
        <strong>Accept ownership</strong>
        </Typography>
        <Typography className={'mt-2 mb-2'} component="div">
        <hr/>
        <Form style={{margin: '10px auto', maxWidth: '350px', width:'100%'}}>
          <Button variant="contained" color="primary" size="medium" onClick={() => this.acceptOwnership()}>Accept ownership</Button>
        </Form>
        </Typography>
      </CardContent>
    </Card>
  )
}
}

export default StepTwo
