import React, { Component } from 'react'
import { BancorRegistryABI, ABIConverter } from '../../../config'
import { Form } from "react-bootstrap"
import { Alert } from "react-bootstrap"
import { inject } from 'mobx-react'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import getBancorContractByName from '../../../service/getBancorContractByName'


class AddConverter extends Component {
  state = {
  isFinish:false,
  converter: ''
  }


  AddToList = async () => {
     const web3 = this.props.MobXStorage.web3
     const BancorRegistryAddress = await getBancorContractByName("BancorConverterRegistry")
     console.log("BancorRegistryAddress", BancorRegistryAddress);
     const registry = new web3.eth.Contract(BancorRegistryABI, BancorRegistryAddress )
     const status = await this.isThisTypeConverter(web3, this.state.converter)

     if(status){
       registry.methods.addConverter(this.state.converter).send({
         from:this.props.MobXStorage.accounts[0]
       }).on('transactionHash', (hash) => {
        this.setState({ isFinish:true })
       })
     }else{
       alert('You are trying add wrong converter address or not workable converter')
     }
  }

  isThisTypeConverter = async (web3, converterAddress) => {
    let status = false
    try{
      const converter = new web3.eth.Contract(ABIConverter, converterAddress)
      const connectorOne = await converter.methods.connectorTokens(0).call()
      const connectorTwo = await converter.methods.connectorTokens(1).call()

      if(web3.utils.isAddress(connectorOne) && web3.utils.isAddress(connectorTwo))
      status = true
    }catch(e){
      console.log("error:", e)
    }
    return status
  }

 render() {
   return(
     <React.Fragment>
     {
     this.props.MobXStorage.web3
     ?
     (
       <React.Fragment>
        <Card style={{margin: '16px 0px', backgroundColor:'rgba(255,255,255,0.1)'}}>
          <CardContent>
            <Typography variant="h4" style={{fontSize: 22}} gutterBottom component="h4">
              Add converter
            </Typography>
            <Typography variant="body1" className={'mb-2'} component="p">
              This page allows you add the converter to official registry contract if you missed step 8
            </Typography>
            <Typography className={'mt-2 mb-2'} component="div">
            <hr/>

            <Form.Group>
            <Form style={{margin: '10px 0', maxWidth: '350px', width:'100%', marginLeft: "auto", marginRight: "auto"}}>
             <Form.Label>Your converter address</Form.Label>
             <Form.Control name="converter" placeholder="Your converter address" onChange={e => this.setState({ converter:e.target.value })}/>
           </Form>
            </Form.Group>
            <Button variant="contained" color="primary" size="medium" onClick={() => this.AddToList()}>add to list</Button>

            </Typography>
          </CardContent>
        </Card>
       {
         this.state.isFinish
         ?
         (
          <React.Fragment>
          <Alert variant="info">
          <p>Congratulations, after confirm transaction your converter will be added in official list</p>
          <small>Note: this can take few minutes after confirm transaction in blockchain </small>
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
