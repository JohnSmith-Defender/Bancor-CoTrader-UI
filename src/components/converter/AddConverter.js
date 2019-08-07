import React, { Component } from 'react'
import { ConvertersRegistryList, ConvertersRegistryListABI } from '../../config'
import { Form, Button, Card } from "react-bootstrap"
import { Alert } from "react-bootstrap"
import { inject } from 'mobx-react'
import { updateData } from '../../config'

class AddConverter extends Component {
  state = {
  isFinish:false,
  smartToken: '',
  converter: ''
  }

  change = e => {
     this.setState({
       [e.target.name]: e.target.value
     })
  }

 AddToList = async () => {
  const web3 = this.props.MobXStorage.web3
  const registry = web3.eth.Contract(ConvertersRegistryListABI, ConvertersRegistryList)
  console.log(this.state.converter)

  registry.methods.addConverter(String(this.state.converter)).send({
    from:this.props.MobXStorage.accounts[0]
  }).on('transactionHash', (hash) => {
   this.setState({ isFinish:true })
  })
 }

render() {
  const smartTokenTx = window.localStorage.getItem('txSmartToken')
  const converterTx = window.localStorage.getItem('txConverter')
  return(
    <React.Fragment>
    <br />
    <Card className="text-center">
    <Card.Header>Add converter</Card.Header>
    <Card.Text>To add your token to an unofficial list that will enable anyone to trade it, add it to this registry contract.</Card.Text>

    <Form>
    <Form.Control name="converter" placeholder="Your converter address" onChange={e => this.change(e)}/>
    <br/>
    <Button variant="primary" size="sm" onClick={() => this.AddToList()}>add to list</Button>
    </Form>
    <Card.Footer className="text-muted">last update: { updateData }</Card.Footer>
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

export default inject('MobXStorage')(AddConverter)
