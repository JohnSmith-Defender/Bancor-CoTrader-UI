import React, { Component } from 'react'
import { Button, Form, Alert } from "react-bootstrap"
import { toWeiByDecimals, fromWeiByDecimals } from '../../../../service/weiByDecimals'
import FakeButton from '../../../templates/FakeButton'
import getBancorGasLimit from '../../../../service/getBancorGasLimit'


class Liquidate extends Component {
  state = {
    directionAmount:0,
    smartTokenBalance:0,
    smarTokenAddress:null
  }

  componentDidUpdate = async (prevProps, prevState) => {
    // Update connectors info by input change
    if(prevProps.from !== this.props.from || prevState.directionAmount !== this.state.directionAmount){
      if(this.props.from){
      const smarTokenAddress = this.props.getInfoBySymbol()[3]
      const smartTokenBalance = await this.props.getTokenBalance(this.props.web3, smarTokenAddress, this.props.accounts[0])
      this.setState({ smartTokenBalance, smarTokenAddress })
      }
    }
  }

  liquidate = async() => {
    if(this.state.directionAmount > 0){
      const converter = this.props.getInfoBySymbol()[0]
      const gasPrice = await getBancorGasLimit()
      const smarTokenAddress = this.props.getInfoBySymbol()[3]
      const amount = await toWeiByDecimals(smarTokenAddress, this.state.directionAmount, this.props.web3)
      converter.methods.liquidate(amount)
      .send({ from:this.props.accounts[0], gasPrice})
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
        this.state.directionAmount > 0 && this.props.from && this.state.smarTokenAddress
        ?
        (
          <Alert variant="info">Your balance of {this.props.from}BNT is {fromWeiByDecimals(this.state.smarTokenAddress, this.state.smartTokenBalance, this.props.web3)}</Alert>
        )
        :
        (null)
      }
      </React.Fragment>
    )
  }

}

export default Liquidate
