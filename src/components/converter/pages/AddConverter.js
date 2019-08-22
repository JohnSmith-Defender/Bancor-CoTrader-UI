import React, { Component } from 'react'
import { ConvertersRegistryList, ConvertersRegistryListABI } from '../../../config'
import { Form, Button, Card } from "react-bootstrap"
import { Alert } from "react-bootstrap"
import { inject } from 'mobx-react'

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
  const registry = new web3.eth.Contract(ConvertersRegistryListABI, ConvertersRegistryList)
  console.log(this.state.converter)

  registry.methods.addConverter(String(this.state.converter)).send({
    from:this.props.MobXStorage.accounts[0]
  }).on('transactionHash', (hash) => {
   this.setState({ isFinish:true })
  })
 }

render() {
  return(
    <React.Fragment>
   {
     this.props.MobXStorage.web3
     ?
     (
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
       <Card.Footer className="text-muted">DEX is free trade; let freedom ring</Card.Footer>
       </Card>
       <br />
       {
         this.state.isFinish
         ?
         (
          <React.Fragment>
          <Alert variant="info">
          <p>Congratulations, after confirm transaction Your smart token will be added</p>
          </Alert>
          </React.Fragment>
         )
         :
         (null)
       }
       </React.Fragment>
     )
     :
     (
       <Alert variant="warning">Please connect to web3</Alert>
     )
   }
    </React.Fragment>
  )
}
}

export default inject('MobXStorage')(AddConverter)
