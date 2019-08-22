import { ABIConverter, BYTECODEConverter, BancorRegistry, BNTToken, gasPrice } from '../../../../../config'
import { Form, Button, Card } from "react-bootstrap"
import { inject } from 'mobx-react'
import React, { Component } from 'react'

class StepTwo extends Component {
 state = {
   maxFee:200000
 }

 createConverter = async (tokenAddress) => {
  // Get name for smart token from input tokenAddress
  // write txs in local storage
  const web3 = this.props.MobXStorage.web3
  const accounts = this.props.MobXStorage.accounts
  const stHash = window.localStorage.getItem('txSmartToken')

  const stInfo = await web3.eth.getTransactionReceipt(stHash)
  if(this.state.maxFee > 1000000 || this.state.maxFee < 1000){
    alert("please set correct maxFee")
  }
  else if(stInfo !== null && stInfo !== "undefined"){
    const smartToken = stInfo.contractAddress
    window.localStorage.setItem('smartToken', smartToken)
    const contract =  new web3.eth.Contract(ABIConverter, null)

    console.log("smartToken address ", smartToken)
    console.log("PARAMS: ", smartToken, BancorRegistry, 30000, BNTToken, 500000)

    contract.deploy({
        data: BYTECODEConverter,
        arguments: [smartToken, BancorRegistry, this.state.maxFee, BNTToken, 500000]
    })
    .send({
      from: accounts[0],
      gas:6372732,
      gasPrice
    })
    .on('transactionHash', (hash) => {
     console.log("converter hash ", hash)
     window.localStorage.setItem('txConverter', hash)
     this.props.MobXStorage.setPending(true)
     window.localStorage.setItem('StepNext', "Three")
     window.localStorage.setItem('txLatest', hash)
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      this.props.MobXStorage.txFinish()
    })
  }
  else{
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
    <small>Max Fee: {this.state.maxFee}</small>
    <small>Connector: BNT token address</small>
    <small>Weight: 500,000 (50%)</small>
    <Form>
    <Form.Control name="fee" onChange={e => this.setState({maxFee:e.target.value})} type="number" min="1000" max="1000000"/>
    <Form.Text className="text-muted">
    Min fee 1000 (0.1%) max fee 1000000 (100%)
    </Form.Text>
    <Button size="sm" onClick={() => this.createConverter()}>create converter</Button>
    </Form>
    </Card>
  )
}
}

export default inject('MobXStorage')(StepTwo)
