import React, { Component } from 'react'
import { Form } from "react-bootstrap"
import Typography from '@material-ui/core/Typography'
import { EtherscanLink } from '../../../../../../config'

class StepFiveBNT extends Component {
  state = {
    connectorAmount:0,
    BNTAmount:0,
    USDAmount:0,
    totalAmount:0
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.USDAmount !== this.state.USDAmount || prevState.totalAmount !== this.state.totalAmount){
      this.calculateRate()
    }
  }

  // Calculate rate for BNT and connector depending of user rate connector to USD (DAI)
  calculateRate = async () => {
    let connectorAmount
    let BNTAmount
    if(this.state.USDAmount > 0 && this.state.totalAmount){
      // DAI, DAI Smart Token, BNT
      const path = ["0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359","0xee01b3AB5F6728adc137Be101d99c678938E6E72", "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"]

      const half = this.state.totalAmount / 2
      // get BNT rate
      BNTAmount = await this.props.getRate(half, path)
      // get connector rate
      connectorAmount = half / this.state.USDAmount
    }
    this.setState({ BNTAmount, connectorAmount })
  }

  render() {
    return (
      <React.Fragment>
      <Typography variant="body1" className={'mb-2'} component="p">
      Great! Now define the starting price of your token!
      </Typography>

      <Typography variant="body1" className={'mb-2'} component="p">
      Fill these in so we can calculate things for you:
      </Typography>

      <Form style={{margin: '10px 0', maxWidth: '350px', width:'100%'}}>
      <Form.Label>What starting USD price do you want for your token?</Form.Label>
      <br/>
      <Form.Control onChange={e => this.setState({USDAmount:e.target.value})} type="number" placeholder={`Enter USD rate for 1 ${this.state.symbol}`}/>
      <Form.Label>What USD amount of BNT do you want to put in the reserves?</Form.Label>
      <br/>
      <Form.Control onChange={e => this.setState({totalAmount:e.target.value})} type="number" placeholder={`Enter total USD amount`}/>
      <br/>
      {
        this.state.BNTAmount > 0 && this.state.connectorAmount > 0
        ?
        (
          <React.Fragment>
          <Typography variant="body1" className={'mb-2'} component="p">
          Send {this.state.connectorAmount} {this.props.symbol} here: <strong>{this.props.converterAddress}</strong>
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
          Send {this.state.BNTAmount} BNT here: <strong>{this.props.converterAddress}</strong>
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
          Note: you can send in different amounts if you like
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
          <strong style={{color: 'red'}}>Make sure that your <a style={{color: '#3f51b5'}} href={EtherscanLink + "address/" + this.state.converterAddress} target="_blank" rel="noopener noreferrer">contract</a> received BOTH tokens, only then press "issue"</strong>
          </Typography>
          </React.Fragment>
        )
        :
        (null)
      }
      </Form>
      </React.Fragment>
    )
  }

}

export default StepFiveBNT
