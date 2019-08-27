import React, { Component } from 'react'
import getWeb3 from "./utils/getWeb3"
import { inject, observer } from 'mobx-react'
import { netId } from './config'

import Footer from "./components/static/Footer"
import Web3Info from "./components/static/Web3Info"
import Navbar from './components/static/Navbar';
import TabsBar from './components/static/TabsBar';

import getOfficialData from "./service/getOfficialData"
import getUnofficialData from "./service/getUnofficialData"

import { Alert } from "react-bootstrap"
import Container from '@material-ui/core/Container';

class App extends Component {
  constructor(props, context) {
  super(props, context);
  this.state = {
    accounts: null,
    isDataLoad:false,
    netId:undefined,
    web3:null
    }
  }

  componentDidMount = async () => {
    // init curent step for create converter
    this.props.MobXStorage.updateStep()
    // load tokens data
    // make litle delay for correct call getWeb3()
    setTimeout(() => this.initData(), 500)

    // get web3 and account
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3()
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()

      // Get network ID
      web3.eth.net.getId().then(netId => {
      this.setState({
        netId,
        web3
      })
      })

      // Set web3 and accounts to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.props.MobXStorage.initWeb3AndAccounts(web3, accounts)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      )
      console.error(error)
    }
  }

  initData = async () => {
    this.setState({ isDataLoad:true })
    // init converters data
    const officialData = getOfficialData()
    const unoficialData = await getUnofficialData(null)

    this.props.MobXStorage.initOfficialSymbols(officialData[0])
    this.props.MobXStorage.initOfficialSmartTokenSymbols(officialData[1])

    this.props.MobXStorage.initUnofficialSymbols(unoficialData[0])
    this.props.MobXStorage.initUnofficialSmartTokenSymbols(unoficialData[1])

    this.props.MobXStorage.initBancorStorage(officialData[2], unoficialData[2])
  }

  render() {
    return(
      <React.Fragment>

      <Navbar />
      <Container maxWidth="xl">
       <Web3Info isDataLoad={this.state.isDataLoad} web3={this.state.web3}/>
       {
         this.state.netId && this.state.netId !== netId
         ?
         (
           <Alert variant="warning">Please switch network to { netId === 1 ? <strong>Mainnet</strong> : <strong>Ropsten</strong>} in Your wallet</Alert>
         )
         :
         (
           <TabsBar />
         )
       }
       <Footer/>
       </Container>
      </React.Fragment>
    )
  }
}

export default inject('MobXStorage')(observer(App))
