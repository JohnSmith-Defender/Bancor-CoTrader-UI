import React, { Component } from 'react'
import { Form, Badge, Alert } from 'react-bootstrap'
import { gasPrice } from '../../../../config'
import UserInfo from '../../../templates/UserInfo'

class ConverterSettings extends Component {
  state = {
    getGasPrice:0,
    isNotDefaultPrice:false
  }

  componentDidMount() {
    setTimeout(() => {
      if(this.props.MobXStorage.GasPrice === gasPrice){
        this.setState({isNotDefaultPrice: true })
      }else{
        this.setState({isNotDefaultPrice: false })
      }
    }, 1000)
  }


  gasPriceToogle() {
    console.log(this.props.MobXStorage.GasPrice, gasPrice)
    if(this.props.MobXStorage.GasPrice === gasPrice){
      this.setState({ isNotDefaultPrice: !this.state.isNotDefaultPrice })
      window.localStorage.setItem('gasPrice', 1000000000)
      this.props.MobXStorage.updateGasPrice(1000000000)
    }else{
      this.setState({ isNotDefaultPrice: !this.state.isNotDefaultPrice })
      window.localStorage.setItem('gasPrice', gasPrice)
      this.props.MobXStorage.updateGasPrice(gasPrice)
    }

  }

  render() {
    return (
      <div className="container-fluid" align="center">
        <Badge variant="primary">My settings</Badge>
        <Form.Group>
        <Form.Check
        type="checkbox"
        label="Set gas price to 5 gwei"
        checked={this.state.isNotDefaultPrice}
        onChange={() => this.gasPriceToogle()}
        />
        <UserInfo info="A gas price of 5 is typically enough for average speed. If you uncheck, the price will become 1 gwei. You can also set the gas price in your wallet before confirming transactions."/>
        <small><Alert variant="warning">For faster completion, increase the gas price in your waller after clicking our action buttons, but before confirming transactions in your wallet. <a href="https://metamask.zendesk.com/hc/en-us/articles/360015488771-How-to-Adjust-Gas-Price-and-Gas-Limit-" target="_blank" rel="noopener noreferrer">See how</a></Alert></small>
        </Form.Group>
      </div>
    )
  }

}

export default ConverterSettings
