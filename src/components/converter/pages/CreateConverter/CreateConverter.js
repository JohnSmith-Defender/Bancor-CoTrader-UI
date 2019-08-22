import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Alert } from "react-bootstrap"

import StepOne from "./steps/StepOne"
import StepTwo from "./steps/StepTwo"
import StepThree from "./steps/StepThree"
import StepFour from "./steps/StepFour"
import StepFive from "./steps/StepFive"
import StepSix from "./steps/StepSix"
import StepSeven from "./steps/StepSeven"
import StepEighth from "./steps/StepEighth"

import Pending from "../../../templates/Spiners/Pending"

const componentList = {
  One: StepOne,
  Two: StepTwo,
  Three: StepThree,
  Four: StepFour,
  Five: StepFive,
  Six: StepSix,
  Seven: StepSeven,
  Eighth: StepEighth
}

class CreateConverter extends Component {
  constructor(props, context) {
  super(props, context);
  this.state = {
    step:"One",
    hashLatest:''
    }
  }

  // check tx status for case is user confirm tx and then close or reload page
  componentDidMount = () => {
    // Small delay for correct recive props
    setTimeout(() => {
      let pending = window.localStorage.getItem('Pending')
      pending = JSON.parse(pending)

      if(pending){
        const hash = window.localStorage.getItem('txLatest')
        this.setState({ hashLatest:hash })
        this.props.MobXStorage.checkTxStatus(hash)
      }
    }, 1000)
  }

  updateRenderStep = () => {
    this.props.MobXStorage.updateStep()
    this.props.MobXStorage.setPending(false)
  }

  render() {
    // get curent step component
    let StepComponent = componentList[this.props.MobXStorage.step]

    return(
      <React.Fragment>
      {
        this.props.MobXStorage.web3
        ?
        (
          <React.Fragment>
          {
            this.props.MobXStorage.web3
            ?
            (
              <div className="container-fluid">
              <br />
              <Alert variant="primary"><small>Attention this application uses local storage for storing parameters. DO NOT delete your browser history until you have completed all steps. <p style={{"color":"red"}}>Please don't do the next step until current transaction not confirmed in Your wallet!</p></small></Alert>
              <br />
              <StepComponent updateRenderStep={this.updateRenderStep}/>
              <br />
              {
                this.props.MobXStorage.pending
                ?
                (
                  <div>
                  <div align="center"><small>Transaction pending</small></div>
                  {<Pending/>}
                  </div>)
                :
                (null)
              }
              </div>
            )
            :(<p>Please connect to web3</p>)
          }
          </React.Fragment>
        )
        :
        (
          <Alert variant="warning">Please connect to web3</Alert>
        )
      }
      </React.Fragment>
    )
  }
}

export default inject('MobXStorage')(observer(CreateConverter))
