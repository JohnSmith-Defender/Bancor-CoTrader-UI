import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Alert } from "react-bootstrap"

import StepZero from "./steps/StepZero"
import StepOne from "./steps/StepOne"
import StepTwo from "./steps/StepTwo"
import StepThree from "./steps/StepThree"
import StepFour from "./steps/StepFour"
import StepFive from "./steps/StepFive"
import StepSix from "./steps/StepSix"
import StepSeven from "./steps/StepSeven"
import StepEighth from "./steps/StepEighth"

import Pending from "../../../templates/Spiners/Pending"
import ConverterSettings from "./ConverterSettings"

const componentList = {
  Zero:StepZero,
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
    step:"Zero",
    hashLatest:'',
    userAddress:null
    }
  }

  // check tx status for case is user confirm tx and then close or reload page
  componentDidMount = () => {
    // Small delay for correct recive props
    setTimeout(() => {
      let pending = window.localStorage.getItem('Pending')
      pending = JSON.parse(pending)
      const userAddress = window.localStorage.getItem('userAddress')
      this.setState({ userAddress })

      if(pending && this.props.MobXStorage.web3){
        const hashLatest = window.localStorage.getItem('txLatest')
        this.setState({ hashLatest })
        this.props.MobXStorage.checkTxStatus(hashLatest)
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
              <Alert variant="warning"><small>Attention: this application uses local storage for storing parameters. Please <strong style={{"color":"red"}}>do not delete your browser history</strong> before completing all steps. Please <strong style={{"color":"red"}}> do not proceed to the next step</strong> until your current transaction is confirmed in your wallet. Please <strong style={{"color":"red"}}>do not speed up transactions</strong> after confirming them in your wallet.</small></Alert>
              {
                this.state.userAddress && this.state.userAddress !== this.props.MobXStorage.accounts[0]
                ?
                (
                  <Alert variant="danger"> <small>Please execute all next transactions from the same wallet address you started with: <strong> {this.state.userAddress} </strong></small></Alert>
                )
                :(null)
              }
              <StepComponent updateRenderStep={this.updateRenderStep} MobXStorage={this.props.MobXStorage}/>
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
      <ConverterSettings MobXStorage={this.props.MobXStorage}/>

      <div className="container-fluid" align="center">
      <small><a style={{color: '#3f51b5'}} href="https://drive.google.com/open?id=1y5jJz8B4fpub-skJCun3FmYAMUMVnUUN" target="_blank" rel="noopener noreferrer">Bancor Documentation</a></small>
      </div>
      </React.Fragment>
    )
  }
}

export default inject('MobXStorage')(observer(CreateConverter))
