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
    step:"One"
    }
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
                (<Alert variant="info"><small>Transaction pending, please don't close or reload page and don't do next step, until your wallet confirms the transaction!</small></Alert>)
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
