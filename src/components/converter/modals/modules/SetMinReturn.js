// This component allow user set min return
import React, { Component } from 'react'
import { Accordion, Form, Button } from "react-bootstrap"
import { inject, observer } from 'mobx-react'
import BigNumber from 'bignumber.js'
import { toWei, fromWei } from 'web3-utils'

class SetMinReturn extends Component {
  state = {
    percent:'',
    show:false
  }

  componentDidMount(){
    // Small delay for correct recive props
    setTimeout(() => {
      // reset previos min rate
      this.props.MobXStorage.changeMinReturn("1")
    }, 1000)
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.percent !== this.state.percent){
      if(this.props.amountReturn > 0 && this.state.percent > 0 && this.state.percent <= 99){
        const newMinReturn = this.calculateMinReturnByPercent(this.state.percent)
        this.props.MobXStorage.changeMinReturn(newMinReturn)
      }
    }
    // Bug can be hear
    if(prevProps.from !== this.props.from || prevProps.to !== this.props.to || prevProps.directionAmount !== this.props.directionAmount){
      // reset previos min rate
      this.props.MobXStorage.changeMinReturn("1")
      this.setState({ percent:'' })
    }
  }

  calculateMinReturnByPercent(percent){
    const amount = new BigNumber(toWei(String(this.props.amountReturn)))
    const amountPercent = amount.dividedBy(100).multipliedBy(percent)
    return amount.minus(amountPercent).toFixed()
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
                Your min return: {fromWei(parseFloat(this.props.MobXStorage.minReturn).toFixed())}
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
