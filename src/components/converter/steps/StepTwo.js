import { ABIConverter, BYTECODEConverter, BancorRegistry, BNTToken } from '../../../config'
import { Form, Button, Card } from "react-bootstrap"
import { inject } from 'mobx-react'
import React, { Component } from 'react'

class StepTwo extends Component {

 createConverter = async (tokenAddress) => {
  // Get name for smart token from input tokenAddress
  // write txs in local storage
  const web3 = this.props.MobXStorage.web3
  const accounts = this.props.MobXStorage.accounts
  const stHash = window.localStorage.getItem('txSmartToken')

  const stInfo = await web3.eth.getTransactionReceipt(stHash)

  if(stInfo !== null && stInfo !== "undefined"){
    const smartToken = stInfo.contractAddress
    window.localStorage.setItem('smartToken', smartToken)
    const contract =  new web3.eth.Contract(ABIConverter, null)

    console.log("smartToken address ", smartToken)
    console.log("PARAMS: ", smartToken, BancorRegistry, 30000, BNTToken, 500000)

    contract.deploy({
        data: BYTECODEConverter,
        arguments: [smartToken, BancorRegistry, 30000, BNTToken, 500000]
    })
    .send({
      from: accounts[0],
      gas:6372732
    })
    .on('transactionHash', (hash) => {
     console.log("converter hash ", hash)
     window.localStorage.setItem('txConverter', hash);
     window.localStorage.setItem('Step', "Three");
     this.props.MobXStorage.setPending(true)
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      this.props.MobXStorage.txFinish()
    })
  }else{
    alert("Smart token contract not deployed yet, please wait")
  }


 }

render() {
  return(
    <Card className="text-center">
    <h3>Step 2</h3>
    <strong>Create Converter</strong>
    <p>converter handle the actual conversions</p>
    <strong>This will be executed with these parameters</strong>
    <small>Smart token address from previos step</small>
    <small>Bancor registry contract address</small>
    <small>Max Fee: 3000​0 (3%)</small>
    <small>Connector: BNT token address</small>
    <small>Weight: 500,000 (50%)</small>
    <Form>
    <Button size="sm" onClick={() => this.createConverter()}>create converter</Button>
    </Form>
    </Card>
  )
}
}

export default inject('MobXStorage')(StepTwo)
