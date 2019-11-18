import React, { Component } from 'react'
import { Form, Alert } from "react-bootstrap"
import { toWei, fromWei } from 'web3-utils'
import getBancorGasLimit from '../../../../service/getBancorGasLimit'
import Button from '@material-ui/core/Button'


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

  liquidate = async() => {
    if(this.state.directionAmount > 0){
      const converter = this.props.getInfoBySymbol()[0]
      const gasPrice = await getBancorGasLimit()

      converter.methods.liquidate(toWei(String(this.state.directionAmount)))
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
      {
        this.props.web3
        ?
        (
          <React.Fragment>
          <Form.Control name="directionAmount" placeholder="Enter relay amount to liguidate" onChange={e => this.setState({directionAmount:e.target.value})} type="number" min="1"/>
          <br/>
          <Button variant="contained" color="primary" onClick={() => this.liquidate()}>Liguidate</Button>
          </React.Fragment>
        )
        :
        (
          <Alert variant="warning">
          <strong>Please connect your wallet</strong>
          </Alert>
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
