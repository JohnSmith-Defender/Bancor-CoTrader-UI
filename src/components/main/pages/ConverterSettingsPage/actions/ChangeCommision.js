import React, { Component } from 'react'
import { Button, Modal, Form } from "react-bootstrap"
import { ABIConverter } from '../../../../../config'

class ChangeCommision extends Component {
  state={
    show:false,
    fee:0
  }

  setFee = async () => {
    if(this.state.fee >= 1000){
      const web3 = this.props.web3
      const accounts = this.props.accounts
      const converterAddress = this.props.converterAddress
      const converter = new web3.eth.Contract(ABIConverter, converterAddress)
      converter.methods.setConversionFee(this.state.fee).send({
        from:accounts[0]
      })
      this.setState({ show:false })
    }else{
      alert('Please input correct fee amount')
    }
  }


  render() {
    return (
      <React.Fragment>
      <Button variant="outline-primary" onClick={() => this.setState({ show:true })}>Change conversion fee</Button>

      <Modal
        size="sm"
        show={this.state.show}
        onHide={() => this.setState({ show:false })}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton/>
        <Modal.Body>
        <Form>
        <Form.Group>
        <Form.Label>Input commision %</Form.Label>
        <Form.Control name="fee" onChange={e => this.setState({ fee:e.target.value })} type="number" min="1000"/>
        <Form.Text className="text-muted">
        Min fee 1000 (0.1%)
        </Form.Text>
        </Form.Group>
        <Button size="sm" onClick={() => this.setFee()}>set conversion fee</Button>
        </Form>
        </Modal.Body>
      </Modal>
      </React.Fragment>
    )
  }

}

export default ChangeCommision
