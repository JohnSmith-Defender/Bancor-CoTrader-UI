import React, { Component } from 'react'
import { ConvertersRegistryList, ConvertersRegistryListABI } from '../../../../../config'
import { Form, Button, Card } from "react-bootstrap"
import { Alert } from "react-bootstrap"
import { inject } from 'mobx-react'

class StepEighth extends Component {
  state = {
  isFinish:false,
  smartToken: '',
  converter: ''
  }

 reset = () => {
   let conf = window.confirm(`Are sure do You want start from scratch?`)
   if(conf){
     window.localStorage.clear()
     this.props.MobXStorage.updateStep()
   }
 }

 AddToList = async () => {
  const web3 = this.props.MobXStorage.web3
  const accounts = this.props.MobXStorage.accounts
  const converterAddress = window.localStorage.getItem('Converter')
  const registry = web3.eth.Contract(ConvertersRegistryListABI, ConvertersRegistryList)

  registry.methods.addConverter(converterAddress).send({
    from:accounts[0]
  }).on('transactionHash', (hash) => {
   this.setState({ isFinish:true })
  })
 }

render() {
  const smartTokenTx = window.localStorage.getItem('txSmartToken')
  const converterTx = window.localStorage.getItem('txConverter')
  return(
    <React.Fragment>
    <Card className="text-center">
    <h3>Step 8 (Final step)</h3>
    <strong>Add to list</strong>
    <p>To add your token to an unofficial list that will enable anyone to trade it, add it to this registry.</p>
    <Form>
    <Button variant="primary" size="sm" onClick={() => this.AddToList()}>add to list</Button>
    </Form>
    <br/>
    <Form>
    <Button variant="danger" size="sm" onClick={() => this.reset()}>back to step "One"</Button>
    </Form>
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

export default inject('MobXStorage')(StepEighth)
