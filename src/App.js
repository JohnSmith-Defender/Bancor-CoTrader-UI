import React, { Component } from 'react'
import getWeb3 from "./utils/getWeb3"
import { inject, observer } from 'mobx-react'
import { netId, API_endpoint } from './config'
import axios from 'axios'

import Footer from "./components/static/Footer"
import Web3Info from "./components/static/Web3Info"
import Navbar from './components/static/Navbar';
import TabsBar from './components/static/TabsBar';

import getOfficialData from "./service/getOfficialData"
import getUnofficialData from "./service/getUnofficialData"

import { Alert } from "react-bootstrap"
import Container from '@material-ui/core/Container'

import { Button } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import lightblue from "@material-ui/core/colors/lightBlue";
// import purple from "@material-ui/core/colors/purple";
import themeicon from './assets/img/themeicon.svg';

class App extends Component {
  constructor(props, context) {
  super(props, context);
  this.state = {
    accounts: null,
    isDataLoad:false,
    netId:undefined,
    web3:null,
    themeType : 'dark',
    }
  }

  changeTheme(){
    if (this.state.themeType === 'dark'){
      this.setState({themeType:'light'});
    } else {
      this.setState({themeType:'dark'});
    }
  }

  componentDidMount = async () => {
    console.log("version 10/09/19")
    // init curent step for create converter
    this.props.MobXStorage.updateStep()
    // load tokens data
    // make litle delay for correct call getWeb3()
    setTimeout(() => this.initData(), 700)

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
    // try get data form server
    try{
      await this.getDataFromServer()
      console.log("Load data from server")
    }
    // if server not work get data form file and blockchain
    catch(e){
      await this.getDataFromBlockchain()
      console.log("Load data from blockchain and file")
    }
  }

  // The main function for loading data
  getDataFromServer = async () => {
    let official = await axios.get(API_endpoint + '/official')
    official = official.data.result
    let officialSymbols = official.map(item => item.symbol)
    officialSymbols = officialSymbols.concat("ETH")

    const officialSmartTokenSymbols = official.map(item => item.smartTokenSymbol)

    let unofficial = await axios.get(API_endpoint + '/unofficial')
    unofficial = unofficial.data.result
    const unofficialSymbols = unofficial.map(item => item.symbol)
    const unofficialSmartTokenSymbols = unofficial.map(item => item.smartTokenSymbol)


    this.props.MobXStorage.initOfficialSymbols(officialSymbols)
    this.props.MobXStorage.initOfficialSmartTokenSymbols(officialSmartTokenSymbols)

    this.props.MobXStorage.initUnofficialSymbols(unofficialSymbols)
    this.props.MobXStorage.initUnofficialSmartTokenSymbols(unofficialSmartTokenSymbols)

    this.props.MobXStorage.initBancorStorage(official, unofficial)
  }

  // A second function for loading data in case the server does not respond,
  // app get data from contracts and file
  getDataFromBlockchain = async () => {
    const officialData = getOfficialData()
    const unoficialData = await getUnofficialData(null)

    this.props.MobXStorage.initOfficialSymbols(officialData[0])
    this.props.MobXStorage.initOfficialSmartTokenSymbols(officialData[1])

    this.props.MobXStorage.initUnofficialSymbols(unoficialData[0])
    this.props.MobXStorage.initUnofficialSmartTokenSymbols(unoficialData[1])

    this.props.MobXStorage.initBancorStorage(officialData[2], unoficialData[2])
  }


  render() {

    let theme = createMuiTheme({
      palette: {
        primary: {
          light: '#3f51b5',
          main: '#3f51b5',
          dark: '#3f51b5',
        },
        secondary: {
          light: lightblue[300],
          main: lightblue[500],
          dark: lightblue[700],
        },
        background: {
          default: this.state.themeType === 'light' ? '#fff' : '#000',
        },
        type: this.state.themeType
      }
    });

    return(
      <React.Fragment>
      <MuiThemeProvider theme={theme}>
      <CssBaseline />


      <Navbar />
      <Container maxWidth="xl">
      <Button variant="contained" color="primary" className={'mb-2 pl-2 pr-2'} onClick={()=>{this.changeTheme()}}><img style={{maxHeight: '24px'}} src={themeicon} alt="Change Theme" title="Change Theme" /></Button>
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
       </MuiThemeProvider>
      </React.Fragment>
    )
  }
}

export default inject('MobXStorage')(observer(App))
