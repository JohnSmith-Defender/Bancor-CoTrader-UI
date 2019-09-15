import React, { Component } from 'react'
import { Form, InputGroup, Button, Alert } from "react-bootstrap"
import { API_endpoint } from '../../../config'
import axios from 'axios'


class EditList extends Component {
  constructor(props, context) {
   super(props, context)
    this.state = {
    converterAddress:false,
    blackList:true,
    COTverified:true,
    converterInfo:null,
    selectBlackList:'true',
    selectCOTlist:'true'
    }
  }

  // change isBlacklisted' or "isCoTraderVerified status
  changeListStatus = async (isBlackListSelect) => {
    if(this.state.converterAddress){
      const select = isBlackListSelect ? JSON.parse(this.state.selectBlackList) : JSON.parse(this.state.selectCOTlist)
      const value = select ? 1 : 0
      const column = isBlackListSelect ? 'isBlacklisted' : "isCoTraderVerified"

      const body = {
        column,
        value,
        converterAddress:this.state.converterAddress
      }

      const head = {
        headers: {
        'Authorization': 'Bearer ' + this.props.AdminToken
        }
      }

      const res = await axios.post(API_endpoint + '/edit-list-status', body, head)
      alert(res.data)
    }else{
      alert('Please input converter address')
    }
  }

  getStatus = async () => {
    if(this.state.converterAddress){
      const res = await axios.get(API_endpoint + '/get-converter-status/' +this.state.converterAddress)
      this.setState({ converterInfo:res.data.result[0] })
    }
    else{
      alert('Please input converter address')
    }
  }

  render() {
    return (
      <React.Fragment>
      <Form>
      <Form.Group>
      <Form.Label>Enter converter address</Form.Label>
      <Form.Control onChange={(e) => this.setState({ converterAddress:e.target.value })}/>
      <br/>
      <Button variant="outline-secondary" size="sm" onClick={() => this.getStatus()}>View status</Button>

       <hr/>
      <Form.Label>Add to Cotrader list</Form.Label>
      <InputGroup>
      <Form.Control
      as="select"
      value={this.state.selectCOTlist}
      onChange={(e) => this.setState({ selectCOTlist:e.target.value })}
      >
      <option>true</option>
      <option>false</option>
      </Form.Control>
      <InputGroup.Prepend>
      <Button variant="outline-secondary" size="sm" onClick={() => this.changeListStatus(false)}>Apply</Button>
      </InputGroup.Prepend>
      </InputGroup>

      <hr/>

      <Form.Label>Add to black list</Form.Label>
      <InputGroup>
      <Form.Control as="select"
      value={this.state.selectBlackList}
      onChange={(e) => this.setState({ selectBlackList:e.target.value })}
      >
      <option>true</option>
      <option>false</option>
      </Form.Control>
      <InputGroup.Prepend>
      <Button variant="outline-secondary" size="sm" onClick={() => this.changeListStatus(true)}>Apply</Button>
      </InputGroup.Prepend>
      </InputGroup>


      </Form.Group>

      </Form>
      {
        this.state.converterInfo
        ?
        (
          <Alert variant="warning">
          <p>black listed: { this.state.converterInfo.isBlacklisted === 1 ? <strong>true</strong>: <strong>false</strong> }</p>
          <hr/>
          <p>CoTrader verified: { this.state.converterInfo.isCoTraderVerified === 1 ? <strong>true</strong>: <strong>false</strong> }</p>
          <hr/>
          <p>Bancor official: { this.state.converterInfo.isOfficial === 1 ? <strong>true</strong>: <strong>false</strong> }</p>
          </Alert>
        )
        :
        (null)
      }
      </React.Fragment>
    )
  }

}

export default EditList
