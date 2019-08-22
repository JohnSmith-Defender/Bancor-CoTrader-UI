import React, { Component } from 'react'
import { ABISmartToken, gasPrice } from '../../../../../config'
import { Form, Button, Card } from "react-bootstrap"
import { inject } from 'mobx-react'

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

       this.setState({ smartToken, converter: converterAddress})
       console.log("PARAMS: ", converterAddress)
       smartToken.methods.transferOwnership(converterAddress).send({
         from:accounts[0],
         gas:1372732,
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
    <Card className="text-center">
    <h3>Step 6</h3>
    <strong>Activation</strong>
    <p>Once the system is set, it’s time to activate it. Activation means transferring the token ownership
    to the converter.</p>
    <br/>
    <strong>This will be executed with these parameters</strong>
    <small>converter address</small>
    <Form>
    <Button size="sm" variant="primary" onClick={() => this.Activation()}>activation</Button>
    </Form>
    </Card>
    </React.Fragment>
  )
}
}

export default inject('MobXStorage')(StepSix)
