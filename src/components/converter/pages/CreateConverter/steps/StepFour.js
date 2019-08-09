import { ABIConverter } from '../../../../../config'
import { Form, Button, Card } from "react-bootstrap"
import { inject } from 'mobx-react'
import React, { Component } from 'react'

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

   if(converterAddress !== null && converterAddress !== "undefined"){
     const converter = web3.eth.Contract(ABIConverter, converterAddress)
     console.log("PARAMS: ", this.state.fee)

     converter.methods.setConversionFee(this.state.fee).send({
       from:accounts[0],
       gas:1372732
     }).on('transactionHash', (hash) => {
      console.log("SetFee hash ", hash)
      window.localStorage.setItem('Step', "Five");
      this.props.MobXStorage.setPending(true)
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      this.props.MobXStorage.txFinish()
    })
  }else{
    alert("Need create converter contract")
  }
 }

render() {
  return(
    <Card className="text-center">
    <h3>Step 4</h3>
    <strong>Set conversion fee</strong>
    <small>Fee: 1,000 (0.1%) by default</small>
    <Form>
    <Form.Group>
    <Form.Control name="fee" onChange={e => this.change(e)} type="number" min="1000"/>
    </Form.Group>
    <Button size="sm" onClick={() => this.setFee()}>set conversion fee</Button>
    </Form>
    </Card>
  )
}
}

export default inject('MobXStorage')(StepFour)
