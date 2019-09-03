// This component allow user set min return
import React, { Component } from 'react'
import { Accordion, Form, Button } from "react-bootstrap"
import { inject, observer } from 'mobx-react'
import BigNumber from 'bignumber.js'
import { toWei } from 'web3-utils'
import UserInfo from '../../../templates/UserInfo'

class SetMinReturn extends Component {
  state = {
    percent:'',
    show:false
  }

  componentDidMount(){
    console.log("Tets version")
    // Small delay for correct recive props
    setTimeout(() => {
      // reset previos min rate
      this.props.MobXStorage.changeMinReturn("1")
    }, 1000)
  }

  componentDidUpdate(prevProps, prevState) {
    // Set min return
    if(prevState.percent !== this.state.percent || prevProps.amountReturn !== this.props.amountReturn){
      if(this.props.amountReturn > 0){
        if(this.state.percent > 0 && this.state.percent <= 99){
          const newMinReturn = this.calculateMinReturnByPercent(this.state.percent)
          console.log(newMinReturn, "newMinReturn")
          this.props.MobXStorage.changeMinReturn(newMinReturn)
        }else{
          // set default 1%
          const newMinReturn = this.calculateMinReturnByPercent(1)
          this.props.MobXStorage.changeMinReturn(newMinReturn)
        }
      }
    }
    // reset previos min rate
    if(prevProps.from !== this.props.from || prevProps.to !== this.props.to || prevProps.directionAmount !== this.props.directionAmount){
      this.props.MobXStorage.changeMinReturn("1")
      this.setState({ percent:'' })
    }
  }

  calculateMinReturnByPercent(percent){
    const amount = new BigNumber(toWei(String(this.props.amountReturn)))
    const amountPercent = amount.dividedBy(100).multipliedBy(percent)
    return String(amount.minus(amountPercent).toFixed())
  }

  render() {
    return (
      <React.Fragment>
      {
        this.props.amountReturn > 0
        ?
        (
          <Accordion>
          <Accordion.Toggle style={{color: '#3f51b5'}} as={Button} onClick={() => this.setState({ show: !this.state.show })} variant="link" eventKey="1">
            Advanced settings { this.state.show ? <strong>&uArr;</strong>:  <strong>&dArr;</strong> }
          </Accordion.Toggle>

          <Accordion.Collapse eventKey="1">
          <Form.Group>
          <Form.Label>
          <UserInfo info="Set the maximum extra slippage beyond which the trade will be cancelled. This is helpful in limiting any front running attacks. 1% by default"/>
          </Form.Label>
          <Form.Control
          type="string"
          placeholder="Enter min return %"
          value={this.state.percent}
          onChange={(e) => this.setState({ percent:e.target.value })}
          />
          {
            this.props.MobXStorage.minReturn !== "1"
            ?
            (
              <Form.Text className="text-muted">
                Your min return: {this.props.MobXStorage.minReturn} in decimals
              </Form.Text>
            )
            :
            (null)
          }
          </Form.Group>
          </Accordion.Collapse>

         </Accordion>
        )
        :
        (null)
      }
      </React.Fragment>
    )
  }

}

export default inject('MobXStorage')(observer(SetMinReturn))
