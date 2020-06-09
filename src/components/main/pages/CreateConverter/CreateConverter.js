import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Alert } from "react-bootstrap"

import StepZero from "./steps/StepZero"
import StepOne from "./steps/StepOne"
import StepTwo from "./steps/StepTwo"
import StepFinish from "./steps/StepFinish"


import Pending from "../../../templates/Spiners/Pending"
import ConverterSettings from "./ConverterSettings"

const componentList = {
  Zero:StepZero,
  One: StepOne,
  Two: StepTwo,
  Finish: StepFinish
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

  _isMounted = false
  // check tx status for case is user confirm tx and then close or reload page
  componentDidMount = () => {
    this._isMounted = true
    // Small delay for correct recive props
    setTimeout(() => {
      let pending = window.localStorage.getItem('Pending')
      pending = JSON.parse(pending)
      const userAddress = window.localStorage.getItem('userAddress')

      let hashLatest

      if(pending && this.props.MobXStorage.web3){
        hashLatest = window.localStorage.getItem('txLatest')
        this.setState({ hashLatest })
        this.props.MobXStorage.checkTxStatus(hashLatest)
      }

      if(this._isMounted)
      this.setState({ hashLatest, userAddress })
    }, 1000)
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  updateRenderStep = () => {
    this.props.MobXStorage.updateStep()
    this.props.MobXStorage.setPending(false)
  }

  render() {
    // get curent step component
    let StepComponent
    // Version compatibility check, application no longer support 8 steps
    if(this.props.MobXStorage.step in componentList){
      StepComponent = componentList[this.props.MobXStorage.step]
    }
    else{
      alert("You are trying to use the old version of the application, we will have to clear your local storage for compatibility with the new version.")
      window.localStorage.clear()
      window.location.reload()
    }

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
              <div className="full-width">
              <br />
              <Alert variant="warning"><small> <strong style={{color:"red"}}>Attention:</strong> this application uses local storage for storing parameters. Please <strong style={{color:"red"}}>do not delete your browser history</strong> before completing all steps. Please <strong style={{color:"red"}}> do not switch your wallet accounts</strong> until all steps are completed. Please <strong style={{color:"red"}}> do not proceed to the next step</strong> until your current transaction is confirmed in your wallet. Please <strong style={{color:"red"}}>do not speed up transactions</strong> after confirming them in your wallet.</small></Alert>
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
      <small><a href="https://drive.google.com/open?id=1y5jJz8B4fpub-skJCun3FmYAMUMVnUUN" target="_blank" rel="noopener noreferrer">Bancor Documentation</a></small>
      </div>
      </React.Fragment>
    )
  }
}

export default inject('MobXStorage')(observer(CreateConverter))
