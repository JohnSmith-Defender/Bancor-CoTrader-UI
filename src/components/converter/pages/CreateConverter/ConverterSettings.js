import React, { Component } from 'react'
import { Form, Badge } from 'react-bootstrap'
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
        label="Set the optimal gas price"
        checked={this.state.isNotDefaultPrice}
        onChange={() => this.gasPriceToogle()}
        />
        <UserInfo info="We suggest you set a gas price as 5 gwei. If you uncheck the price will become 1 gwei. You can also change the settings in your wallet."/>
        </Form.Group>
      </div>
    )
  }

}

export default ConverterSettings
