import React, { Component } from 'react'
import { ABIConverter } from '../../../../../config'
import { Form } from "react-bootstrap"

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

class StepSeven extends Component {
 acceptTokenOwnership = async () => {
  const web3 = this.props.MobXStorage.web3
  const accounts = this.props.MobXStorage.accounts
  const converterAddress = window.localStorage.getItem('Converter')
  const registry = new web3.eth.Contract(ABIConverter, converterAddress)
  const gasPrice = this.props.MobXStorage.GasPrice

  registry.methods.acceptTokenOwnership().send({
    from:accounts[0],
    gasPrice
  }).on('transactionHash', (hash) => {
   console.log("acceptTokenOwnership hash ", hash)
   window.localStorage.setItem('StepNext', "Eighth")
   window.localStorage.setItem('txLatest', hash)
   this.props.MobXStorage.setPending(true)
 })
 .on('confirmation', (confirmationNumber, receipt) => {
   this.props.MobXStorage.txFinish()
 })
 }

render() {
  return(
    <React.Fragment>
    <Card style={{backgroundColor:'rgba(255,255,255,0.1)'}}>
    <CardContent>
    <Typography variant="h4" gutterBottom component="h4">
    Step 7
    </Typography>
    <Typography variant="body1" className={'mb-2'} component="p">
    <strong>Accept token ownership</strong>
    </Typography>
    <Typography variant="body1" className={'mb-2'} component="p">
    The relay will be activate in blockhain only if converter confirm ownership
    </Typography>
    <Form style={{margin: '10px auto', maxWidth: '350px', width:'100%'}}>
    <Button variant="contained" color="primary" size="medium" onClick={() => this.acceptTokenOwnership()}>accept token ownership</Button>
    </Form>
    </CardContent>
    </Card>
    </React.Fragment>
  )
}
}

export default StepSeven
