import { ABIConverter } from '../../../../../config'
import { Form } from "react-bootstrap"
import React, { Component } from 'react'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

class StepFour extends Component {
 constructor(props, context) {
 super(props, context);
  this.state = {
  fee:1000
  }
 }

 change = e => {
     this.setState({
     [e.target.name]: e.target.value
 })
 }

 setFee = async () => {
   const web3 = this.props.MobXStorage.web3
   const accounts = this.props.MobXStorage.accounts
   const converterAddress = window.localStorage.getItem('Converter')

   if(this.state.fee < 1000 || this.state.fee > 1000000){
     alert('Incorrect fee number, min should be 1000, max 1000000')
   }
   else{
   if(converterAddress !== null && converterAddress !== "undefined"){
     const converter = new web3.eth.Contract(ABIConverter, converterAddress)
     console.log("PARAMS: ", this.state.fee)
     const gasPrice = this.props.MobXStorage.GasPrice

     converter.methods.setConversionFee(this.state.fee).send({
       from:accounts[0],
       gas:1372732,
       gasPrice
     }).on('transactionHash', (hash) => {
      console.log("SetFee hash ", hash)
      window.localStorage.setItem('StepNext', "Five")
      window.localStorage.setItem('txLatest', hash)
      this.props.MobXStorage.setPending(true)
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      this.props.MobXStorage.txFinish()
    })
  }
  else{
    alert("Need create converter contract")
  }
 }
 }

render() {
  return(
    <Card>
    <CardContent>
    <Typography variant="h4" gutterBottom component="h4">
    Step 4
    </Typography>
    <Typography variant="body1" className={'mb-2'} component="p">
    <strong>Set conversion fee</strong>
    </Typography>
    <Typography variant="body1" className={'mb-2'} component="p">
    <small>Fee: 1,000 (0.1%) by default</small>
    </Typography>
    <Typography className={'mt-2 mb-2'} component="div">
    <hr/>
    <Form style={{margin: '10px 0', maxWidth: '350px', width:'100%'}}>
    <Form.Group>
    <Form.Control name="fee" value={this.state.fee} onChange={e => this.change(e)} type="number" min="1000"/>
    </Form.Group>
    <Button variant="contained" color="primary" size="medium" onClick={() => this.setFee()}>set conversion fee</Button>
    </Form>
    </Typography>
    </CardContent>
    </Card>
  )
}
}

export default StepFour
