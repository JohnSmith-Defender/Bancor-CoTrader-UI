import React, { Component } from 'react'
import { ABIConverter, gasPrice } from '../../../../../config'
import { Form, Button, Card } from "react-bootstrap"
import { inject } from 'mobx-react'

class StepSeven extends Component {
 acceptTokenOwnership = async () => {
  const web3 = this.props.MobXStorage.web3
  const accounts = this.props.MobXStorage.accounts
  const converterAddress = window.localStorage.getItem('Converter')
  const registry = web3.eth.Contract(ABIConverter, converterAddress)

  registry.methods.acceptTokenOwnership().send({
    from:accounts[0],
    gasPrice
  }).on('transactionHash', (hash) => {
   console.log("acceptTokenOwnership hash ", hash)
   window.localStorage.setItem('Step', "Eighth");
   this.props.MobXStorage.setPending(true)
 })
 .on('confirmation', (confirmationNumber, receipt) => {
   this.props.MobXStorage.txFinish()
 })
 }

render() {
  return(
    <React.Fragment>
    <Card className="text-center">
    <h3>Step 7</h3>
    <strong>Accept token ownership</strong>
    <p>The relay will be activate in blockhain only if converter confirm ownership</p>
    <Form>
    <Button variant="primary" size="sm" onClick={() => this.acceptTokenOwnership()}>accept token ownership</Button>
    </Form>
    </Card>
    </React.Fragment>
  )
}
}

export default inject('MobXStorage')(StepSeven)
