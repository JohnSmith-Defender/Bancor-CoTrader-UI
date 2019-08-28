import React, { Component } from 'react'
import { Button, Form, Alert } from "react-bootstrap"
import { toWei, fromWei } from 'web3-utils'
import FakeButton from '../../../templates/FakeButton'

class Liquidate extends Component {
  state = {
    directionAmount:0,
    smartTokenBalance:0
  }

  componentDidUpdate = async (prevProps, prevState) => {
    // Update connectors info by input change
    if(prevProps.from !== this.props.from || prevState.directionAmount !== this.state.directionAmount){
      if(this.props.from){
      const smarTokenAddress = this.props.getInfoBySymbol()[3]
      const smartTokenBalance = await this.props.getTokenBalance(this.props.web3, smarTokenAddress, this.props.accounts[0])
      this.setState({ smartTokenBalance })
      }
    }
  }

  liquidate = () => {
    if(this.state.directionAmount > 0){
      const converter = this.props.getInfoBySymbol()[0]
      converter.methods.liquidate(toWei(String(this.state.directionAmount))).send({ from:this.props.accounts[0] })
    }
    else {
      alert("Please input amount")
    }
  }


  render() {
    return (
      <React.Fragment>
      <Form.Group>
      <Form.Control name="directionAmount" placeholder="Enter relay amount to liguidate" onChange={e => this.setState({directionAmount:e.target.value})} type="number" min="1"/>
      <br/>
      {
        this.props.accounts
        ?
        (
          <Button variant="outline-primary" size="sm" onClick={() => this.liquidate()}>Liguidate</Button>
        )
        :
        (
          <FakeButton info="Please connect to web3" buttonName="Liguidate"/>
        )
      }
      </Form.Group>
      {
        this.state.directionAmount > 0 && this.props.from
        ?
        (
          <Alert variant="info">Your balance of {this.props.from}BNT is {fromWei(String(this.state.smartTokenBalance))}</Alert>
        )
        :
        (null)
      }
      </React.Fragment>
    )
  }

}

export default Liquidate
