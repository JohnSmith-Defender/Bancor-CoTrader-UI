import React, { Component } from 'react'
import { Button, ButtonGroup, Badge, Alert } from 'react-bootstrap'
import { gasPrice, EtherscanLink } from '../../../../config'
import UserInfo from '../../../templates/UserInfo'
import getWeb3ForRead from '../../../../service/getWeb3ForRead'


class ConverterSettings extends Component {
  state = {
    currentGasStatus:undefined
  }

  componentDidMount = async () => {
    let currentGasStatus = window.localStorage.getItem('gasPriceState')
    if(!currentGasStatus)
       currentGasStatus = "highGasPrice"
    await this.setGasPrice(currentGasStatus)
    this.setState({ currentGasStatus })
  }

  setGasPrice = async (gasPriceState) => {
    const web3 = getWeb3ForRead(this.props.MobXStorage.web3)
    const price = await web3.eth.getGasPrice()
    switch (gasPriceState) {
      case "highGasPrice":
        this.props.MobXStorage.updateGasPrice(price)
        window.localStorage.setItem('gasPrice', price)
      break;

      case "averageGasPrice":
        let averagePrice = price / 2
        if(averagePrice < 1000000000)
           averagePrice = price
        this.props.MobXStorage.updateGasPrice(averagePrice)
        window.localStorage.setItem('gasPrice', averagePrice)
      break;

      default:
        this.props.MobXStorage.updateGasPrice(gasPrice)
        window.localStorage.setItem('gasPrice', gasPrice)
    }
  }


  gasPriceToogle(gasPriceState) {
    window.localStorage.setItem('gasPriceState', gasPriceState)
    this.setGasPrice(gasPriceState)
    this.setState({ currentGasStatus:gasPriceState })
  }

  render() {
    return (
      <div className="container-fluid" align="center">
        <Badge variant="primary">My settings</Badge>
        <br/>
        <UserInfo info="The price you pay for gas effects the speed and cost for transactions. Gas prices vary greatly. They tend to be low several hours around midnight, GMT+0, especially on weekends. You can save money by trying expensive transactions during those times."/>
        <br/>
        <small>Please select <a style={{color: '#3f51b5'}} href={EtherscanLink + "/gasTracker"} target="_blank" rel="noopener noreferrer"> gas price</a></small>
        <br/>
        <ButtonGroup size="sm">
        <Button
        variant={this.state.currentGasStatus === "highGasPrice" ? "primary":"outline-primary"}
        onClick={() => this.gasPriceToogle("highGasPrice")}>High</Button>

        <Button
        variant={this.state.currentGasStatus === "averageGasPrice" ? "primary":"outline-primary"}
        onClick={() => this.gasPriceToogle("averageGasPrice")}>Average</Button>

        <Button
        variant={this.state.currentGasStatus === "lowGasPrice" ? "primary":"outline-primary"}
        onClick={() => this.gasPriceToogle("lowGasPrice")}>Low</Button>
        </ButtonGroup>
        <br/>
        <br/>
        <small><Alert variant="warning">For faster completion, increase the gas price in your waller after clicking our action buttons, but before confirming transactions in your wallet. <a href="https://metamask.zendesk.com/hc/en-us/articles/360015488771-How-to-Adjust-Gas-Price-and-Gas-Limit-" target="_blank" rel="noopener noreferrer">See how</a></Alert></small>
      </div>
    )
  }

}

export default ConverterSettings
