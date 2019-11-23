import React, { Component } from 'react'
import { Form } from "react-bootstrap"

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

class StepZero extends Component {
  state = {
    connectorType:null
  }

  componentDidUpdate(prevProps, prevState) {
    // Update Bancor connector type by select
    if(prevState.connectorType !== this.state.connectorType){
      if(this.state.connectorType === '...'){
        window.localStorage.setItem('connectorType', null)
        this.setState({ connectorType:null })
      }else{
        window.localStorage.setItem('connectorType', this.state.connectorType)
      }
    }
  }

  start(){
    window.localStorage.setItem('Step', "One")
    this.props.MobXStorage.updateStep()
  }

  render() {
    return (
      <Card style={{backgroundColor:'rgba(255,255,255,0.1)'}}>
      <CardContent>
      <Typography variant="body1" className={'mb-2'} component="p">
      Do you want
      &thinsp;
      <a className="text_blue" href="https://www.bancor.network/token/BNT" target="_blank" rel="noopener noreferrer">BNT</a>
       &thinsp;
       or
       &thinsp;
       <a className="text_blue" href="https://www.bancor.network/token/USDB" target="_blank" rel="noopener noreferrer">USDB</a>
      &thinsp;
       as the reserve liquidity of your new token exchange?
      </Typography>

      <Form style={{margin: '10px auto', maxWidth: '350px', width:'100%'}}>
      <Form.Group controlId="exampleForm.ControlSelect1">
      <Form.Label><small>Select connector type</small></Form.Label>
      <Form.Control as="select" onChange={(e) => this.setState({ connectorType:e.target.value })}>
        <option>...</option>
        <option>BNT</option>
        <option>USDB</option>
      </Form.Control>
      </Form.Group>
      </Form>
      {
        this.state.connectorType
        ?
        (
          <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={() => this.start()}>Start</Button>
        )
        :
        (null)
      }
      </CardContent>
      </Card>
    )
  }

}

export default StepZero
