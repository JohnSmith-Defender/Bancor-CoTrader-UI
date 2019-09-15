import React, { Component } from 'react'
import { Modal, Badge, Form, Button } from "react-bootstrap"
import axios from 'axios'
import { API_endpoint } from '../../../config'

import EditList from './EditList'

class Panel extends Component {
  constructor(props, context) {
   super(props, context)
    this.state = {
    ShowModal:false,
    AdminToken:null,
    isLoggedIn:false
    }
  }

  // reset states after close modal
  closeModal = () => this.setState({
    ShowModal:false,
    isLoggedIn:false,
    AdminToken:null
  })


  login = async () => {
    if(this.state.AdminToken){
      try{
      const res = await axios.post(API_endpoint + '/check-token', null,
      {
        headers: { Authorization: "Bearer " + this.state.AdminToken }
      })
      this.setState({isLoggedIn:res.data})
    }
    catch(e){
      if(e.response.status === 401){
        alert('Wrong token')
      }else{
        alert('Server error, try latter')
        }
      }
    }
    else{
      alert('Please input token')
    }
  }



  render() {
    return (
      <div className="container-fluid">
      <Badge variant="secondary" onClick={() => this.setState({ ShowModal: true })}>
        Admin panel
      </Badge>

      <Modal
        size="sm"
        show={this.state.ShowModal}
        onHide={() => this.closeModal()}
        >
        <Modal.Header closeButton>
        <Modal.Title>
        <small>Admin panel</small>
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {
          !this.state.isLoggedIn
          ?
          (
            <Form>
            <Form.Group>
            <Form.Label>Enter Your admin token</Form.Label>
            <Form.Control type="password" onChange={(e) => this.setState({ AdminToken:e.target.value })}/>
            </Form.Group>
            <Button variant="outline-secondary" size="sm" onClick={() => this.login()}>
            Submit
            </Button>
            </Form>
          )
          :
          (
            <EditList AdminToken={this.state.AdminToken}/>
          )
        }

        </Modal.Body>
      </Modal>
      </div>
    )
  }

}

export default Panel
