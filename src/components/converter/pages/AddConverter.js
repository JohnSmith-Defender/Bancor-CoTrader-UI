import React, { Component } from 'react'
import { ConvertersRegistryList, ConvertersRegistryListABI } from '../../../config'
import { Form } from "react-bootstrap"
import { Alert } from "react-bootstrap"
import { inject } from 'mobx-react'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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
        <Card style={{margin: '16px 0px'}}>
          <CardContent>
            <Typography variant="h4" style={{fontSize: 22}} gutterBottom component="h4">
              Add converter
            </Typography>
            <Typography variant="body1" className={'mb-2'} component="p">
              To add your token to an unofficial list that will enable anyone to trade it, add it to this registry contract.
            </Typography>
            <Typography className={'mt-2 mb-2'} component="div">
            <hr/>
            <Form style={{margin: '10px 0', maxWidth: '350px', width:'100%'}}>
            <Form.Group>
             <Form.Label>Your converter address</Form.Label>
             <Form.Control name="converter" placeholder="Your converter address" onChange={e => this.change(e)}/>
            </Form.Group>
            <Button variant="contained" color="primary" size="medium" onClick={() => this.AddToList()}>add to list</Button>
            </Form>
            </Typography>
          </CardContent>
        </Card>
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
