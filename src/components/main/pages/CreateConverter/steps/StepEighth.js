import React, { Component } from 'react'
import { ConvertersRegistryList, ConvertersRegistryListABI } from '../../../../../config'
import { Form } from "react-bootstrap"
import { Alert } from "react-bootstrap"

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'


class StepEighth extends Component {
  state = {
  isFinish:false,
  smartToken: '',
  converter: ''
  }

 reset = () => {
   let conf = window.confirm(`Are you sure you want to start from scratch?`)
   if(conf){
     window.localStorage.clear()
     window.location.reload()
   }
 }

 AddToList = async () => {
  const web3 = this.props.MobXStorage.web3
  const accounts = this.props.MobXStorage.accounts
  const converterAddress = window.localStorage.getItem('Converter')
  const registry = new web3.eth.Contract(ConvertersRegistryListABI, ConvertersRegistryList)
  const gasPrice = this.props.MobXStorage.GasPrice

  registry.methods.addConverter(converterAddress).send({
    from:accounts[0],
    gasPrice
  }).on('transactionHash', (hash) => {
   this.setState({ isFinish:true })
  })
 }

render() {
  const smartTokenTx = window.localStorage.getItem('txSmartToken')
  const converterTx = window.localStorage.getItem('txConverter')
  return(
    <React.Fragment>
    <Card style={{backgroundColor:'rgba(255,255,255,0.1)'}}>
    <CardContent>
    <Typography variant="h4" gutterBottom component="h4">
    Step 8 (Final step)
    </Typography>
    <Typography variant="body1" className={'mb-2'} component="p">
    <strong>Add to list</strong>
    </Typography>
    <Typography variant="body1" className={'mb-2'} component="p">
    To add your token to an unofficial list that will enable anyone to trade it, add it to this registry.
    </Typography>
    <Form style={{margin: '10px auto', maxWidth: '350px', width:'100%'}}>
    <Button variant="contained" color="primary" size="medium" onClick={() => this.AddToList()}>add to list</Button>
    <Button variant="contained" color="secondary" size="medium" onClick={() => this.reset()}>back to step "One"</Button>
    </Form>
    </CardContent>
    </Card>
    <br />
    {
      this.state.isFinish
      ?
      (
       <React.Fragment>
       <Alert variant="info">
       <p>Congratulations, after confirm transaction Your smart token will be added</p>
       <br/>
       <p style={{"color":"red"}}>Please save this info, in case if You need manualy interact with Bancor converter contract</p>
       <br/>
       <p>Your converter transaction hash: {converterTx}</p>
       <p>Converter ABI: https://gist.github.com/RuslanMirov/3256cb419618a6ebe34e9b588053ea71</p>
       <br/>
       <p>Your smart token transaction hash: {smartTokenTx}</p>
       <p>SmartToken ABI: https://gist.github.com/RuslanMirov/9de739810eaab40affe49d21ad393710</p>
       </Alert>
       </React.Fragment>
      )
      :
      (null)
    }
    </React.Fragment>
  )
}
}

export default StepEighth
