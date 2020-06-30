import React, { Component } from 'react'
import { Form, Alert } from "react-bootstrap"
import { toWeiByDecimalsInput, fromWeiByDecimalsInput } from '../../../../service/weiByDecimals'
import getBancorGasLimit from '../../../../service/getBancorGasLimit'
import Button from '@material-ui/core/Button'
import BigNumber from 'bignumber.js'

class Liquidate extends Component {
  state = {
    directionAmount:0,
    smartTokenBalance:0,
    decimals:18
  }

  componentDidUpdate = async (prevProps, prevState) => {
    // Update connectors info by input change
    if(prevProps.from !== this.props.from || prevState.directionAmount !== this.state.directionAmount){
      if(this.props.from){
      const tokenInfo = await this.props.getInfoBySymbol()
      const smarTokenAddress = tokenInfo[3]
      const decimals = tokenInfo[5].tokenDecimals
      const smartTokenBalance = await this.props.getTokenBalance(this.props.web3, smarTokenAddress, this.props.accounts[0])

      this.setState({ smartTokenBalance, decimals })
      }
    }
  }

  liquidate = async() => {
    if(this.state.directionAmount > 0){
      const tokenInfo = await this.props.getInfoBySymbol()
      const converter = tokenInfo[0]
      const bancorGasLimit = await getBancorGasLimit()
      const gasPrice = Number(bancorGasLimit) < 6000000000 ? bancorGasLimit : 6000000000 // 6gwei by default
      const toWeiInput = BigNumber(toWeiByDecimalsInput(this.state.decimals, String(this.state.directionAmount)))

      converter.methods.liquidate(String(toWeiInput))
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
          <Button variant="contained" color="primary" onClick={() => this.liquidate()}>Liquidate</Button>
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
          <Alert variant="info">Your balance of {this.props.from}BNT is {fromWeiByDecimalsInput(this.state.decimals, String(this.state.smartTokenBalance))}</Alert>
        )
        :
        (null)
      }
      </React.Fragment>
    )
  }

}

export default Liquidate
