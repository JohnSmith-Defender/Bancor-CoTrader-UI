import {
  ABIConverter,
  BYTECODEConverter,
  BancorRegistry,
  BNTToken,
  USDBToken
} from '../../../../../config'
import { Form } from "react-bootstrap"
import React, { Component } from 'react'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import UserInfo from '../../../../templates/UserInfo'

class StepTwo extends Component {
 state = {
   maxFee:1000000,
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
    console.log("PARAMS: ", smartToken, BancorRegistry, this.state.maxFee, this.state.bancorConncectorAddress, 500000)

    const gasPrice = this.props.MobXStorage.GasPrice

    contract.deploy({
        data: BYTECODEConverter,
        arguments: [smartToken, BancorRegistry, this.state.maxFee, this.state.bancorConncectorAddress, 500000]
    })
    .send({
      from: accounts[0],
      gas:7372732,
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
    <Card style={{backgroundColor:'rgba(255,255,255,0.1)'}}>
      <CardContent>
        <Typography variant="h4" gutterBottom component="h4">
          Step 2
        </Typography>
        <Typography variant="body1" className={'mb-2'} component="p">
        <strong>Create Converter</strong>
        </Typography>
        <Typography variant="body1" className={'mb-2'} component="p">
          This <UserInfo label="Bancor documentation" info={`Smart token address from previos step, Bancor registry contract address, Max Fee:  ${this.state.maxFee}, Weight: 500,000 (50%`}/> step will be done
        </Typography>
        <Typography className={'mt-2 mb-2'} component="div">
        <hr/>
        <Form style={{margin: '10px auto', maxWidth: '350px', width:'100%'}}>
        <Form.Control name="fee" value={this.state.maxFee} onChange={e => this.setState({maxFee:e.target.value})} type="number" min="1000" max="1000000"/>
        <Form.Text className="text-muted">
        Min fee 1000 (0.1%) max fee 1000000 (100%)
        </Form.Text>
          <Button variant="contained" color="primary" size="medium" onClick={() => this.createConverter()}>create converter</Button>
        </Form>
        </Typography>
      </CardContent>
    </Card>
  )
}
}

export default StepTwo
