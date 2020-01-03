import React, { Component } from 'react'
import { HashRouter } from 'react-router-dom'

import getWeb3 from "./utils/getWeb3"
import { inject, observer } from 'mobx-react'
import { netId, API_endpoint } from './config'
import axios from 'axios'

import Footer from "./components/static/Footer"
import Web3Info from "./components/static/Web3Info"
import Navbar from './components/static/Navbar'
import Routes from './components/static/Routes'

import getOfficialData from "./service/getOfficialData"

import { Alert } from "react-bootstrap"
import Container from '@material-ui/core/Container'

import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import themeicon from './assets/img/themeicon.svg';

class App extends Component {
  constructor(props, context) {
  super(props, context);
  this.state = {
    accounts: null,
    isDataLoad:false,
    netId:undefined,
    web3:null,
    themeType : 'light',
    }
  }

  changeTheme(){
    if (this.state.themeType === 'dark'){
      this.setState({themeType:'light'});
      document.body.classList.remove('dark');
    } else {
      this.setState({themeType:'dark'});
      document.body.classList.add('dark');
    }
  }

  componentDidMount = async () => {
    console.log("version 21/12/19")
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

    // relaod app if accout was changed
    if(window.ethereum)
    window.ethereum.on('accountsChanged', () => window.location.reload())
  }

  initData = async () => {
    this.setState({ isDataLoad:true })
    // try get data from server
    try{
      await this.getDataFromServer()
      console.log("Load data from server")
    }
    // if server not work get data form file and blockchain
    catch(e){
      await this.getDataFromFile()
      console.log("Load data from file")
    }
  }

  // The main function for loading data
  getDataFromServer = async () => {
    let official = await axios.get(API_endpoint + '/official')
    official = official.data.result
    const officialSymbols = official.map(item => item.symbol)
    const officialSmartTokenSymbols = official.map(item => item.smartTokenSymbol)

    this.props.MobXStorage.initOfficialSymbols(officialSymbols)
    this.props.MobXStorage.initOfficialSmartTokenSymbols(officialSmartTokenSymbols)
    this.props.MobXStorage.initBancorStorage(official)
  }

  // A second function for loading data in case the server does not respond,
  // app get data from file
  getDataFromFile = async () => {
    const officialData = getOfficialData()

    this.props.MobXStorage.initOfficialSymbols(officialData[0])
    this.props.MobXStorage.initOfficialSmartTokenSymbols(officialData[1])
    this.props.MobXStorage.initBancorStorage(officialData[2])
  }


  render() {
    let theme = createMuiTheme({
      palette: {
        primary: {
          light: '#3f51b5',
          main: '#3f51b5',
          dark: '#039be5',
        },
        secondary: {
          light: '#3f51b5',
          main: '#3f51b5',
          dark: '#039be5',
        },
        background: {
          default: this.state.themeType === 'light' ? '#fff' : '#000',
          paper: this.state.themeType === 'light' ? '#fff' : '#000',
        },
        type: this.state.themeType
      }
    });

    return(
      <HashRouter>
      <MuiThemeProvider theme={theme}>
      <CssBaseline />


      <Navbar />
      <Container maxWidth="md" className={'text-center'} style={{position: 'relative'}}>
      <span variant="transparent" color="primary" className={'theme_switcher'} onClick={()=>{this.changeTheme()}}><img style={{maxHeight: '25px'}} src={themeicon} alt="Change Theme" title="Change Theme" /></span>
       <Web3Info isDataLoad={this.state.isDataLoad} web3={this.state.web3}/>
       {
         this.state.netId && this.state.netId !== netId
         ?
         (
           <Alert variant="warning">Please switch network to { netId === 1 ? <strong>Mainnet</strong> : <strong>Ropsten</strong>} in Your wallet</Alert>
         )
         :
         (
           <Routes />
         )
       }

       <Footer/>
       </Container>
       </MuiThemeProvider>
      </HashRouter>
    )
  }
}

export default inject('MobXStorage')(observer(App))
