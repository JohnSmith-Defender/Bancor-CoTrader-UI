import { ABIConverter, gasPrice } from '../../../../../config'
import { Form, Button, Card } from "react-bootstrap"
import { inject } from 'mobx-react'
import React, { Component } from 'react'

class StepThree extends Component {

 addConnector = async (tokenAddress) => {
  const web3 = this.props.MobXStorage.web3
  const accounts = this.props.MobXStorage.accounts
  const converterHash = window.localStorage.getItem('txConverter')
  const converterInfo = await web3.eth.getTransactionReceipt(converterHash)

  if(converterInfo !== null && converterInfo !== "undefined"){
    window.localStorage.setItem('Converter', converterInfo.contractAddress)
    const converter = web3.eth.Contract(ABIConverter, converterInfo.contractAddress)
    console.log("PARAMS: ", window.localStorage.getItem('userToken'), 500000, false)

    converter.methods.addConnector(window.localStorage.getItem('userToken'), 500000, false).send({
      from:accounts[0],
      gas:1372732,
      gasPrice
    }).on('transactionHash', (hash) => {
     console.log("addConnector hash ", hash)
     window.localStorage.setItem('Step', "Four");
     this.props.MobXStorage.setPending(true)
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      this.props.MobXStorage.txFinish()
    })
 }else{
   alert("Converter contract not deployed yet, please wait")
 }
 }

render() {
  return(
    <Card className="text-center">
    <h3>Step 3</h3>
    <strong>Add connector</strong>
    <strong>This will be executed with these parameters.</strong>
    <small>Existing ERC20 token address</small>
    <small>Weight, 500,000 (50%)</small>
    <small>enableVirtualB-alance - false (can be updated later on if needed)</small>
    <Form>
    <Button size="sm" onClick={() => this.addConnector()}>add connector</Button>
    </Form>
    </Card>
  )
}
}

export default inject('MobXStorage')(StepThree)
