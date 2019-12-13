import React, { Component } from 'react'
import { ABISmartToken } from '../../../../../config'
import { Form } from "react-bootstrap"

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import UserInfo from '../../../../templates/UserInfo'

class StepSix extends Component {
  state = {
  smartToken: '',
  converter: ''
  }

 Activation = async () => {
  const web3 = this.props.MobXStorage.web3
  const accounts = this.props.MobXStorage.accounts
  const converterHash = window.localStorage.getItem('txConverter')
  const converterInfo = await web3.eth.getTransactionReceipt(converterHash)


  if(converterInfo !== null && converterInfo !== "undefined"){
     const converterAddress = converterInfo.contractAddress

     const smartTokenHash = window.localStorage.getItem('txSmartToken')
     const smartTokenInfo = await web3.eth.getTransactionReceipt(smartTokenHash)

     if(smartTokenInfo !== null && smartTokenInfo !== "undefined"){
       const smartToken = new web3.eth.Contract(ABISmartToken, smartTokenInfo.contractAddress)
       const gasPrice = this.props.MobXStorage.GasPrice

       this.setState({ smartToken, converter: converterAddress})
       console.log("PARAMS: ", converterAddress)
       smartToken.methods.transferOwnership(converterAddress).send({
         from:accounts[0],
         gas:1872732,
         gasPrice
       }).on('transactionHash', (hash) => {
         window.localStorage.setItem('StepNext', "Seven")
         window.localStorage.setItem('txLatest', hash)
        this.props.MobXStorage.setPending(true)
       })
       .on('confirmation', (confirmationNumber, receipt) => {
         this.props.MobXStorage.txFinish()
       })
     }else{
       alert("Need create smart token")
     }
  }else{
    alert("Need create converter contract")
  }
 }

render() {
  return(
    <React.Fragment>
    <Card style={{backgroundColor:'rgba(255,255,255,0.1)'}}>
    <CardContent>
    <Typography variant="h4" gutterBottom component="h4">
    Step 6
    </Typography>
    <Typography variant="body1" className={'mb-2'} component="p">
    <strong>Activation</strong>
    </Typography>
    <Typography variant="body1" className={'mb-2'} component="p">
    Once the system is set, it’s time to activate it. Activation means transferring the token ownership
    to the converter.
    </Typography>
    <Typography variant="body1" className={'mb-2'} component="p">
    <UserInfo label="Bancor documentation" info="Owner: converter address"/>
    </Typography>

    <Form style={{margin: '10px auto', maxWidth: '350px', width:'100%'}}>
    <Button variant="contained" color="primary" size="medium" onClick={() => this.Activation()}>activation</Button>
    </Form>
    </CardContent>
    </Card>
    </React.Fragment>
  )
}
}

export default StepSix
