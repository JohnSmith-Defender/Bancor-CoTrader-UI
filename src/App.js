import React, { Component } from 'react'
import getWeb3 from "./utils/getWeb3"
import { inject, observer } from 'mobx-react'

import TradePage from "./components/converter/TradePage"
import SendPage from "./components/converter/SendPage"
import RelaysPage from "./components/converter/RelaysPage"
import PoolPage from "./components/converter/PoolPage"

import AddConverter from "./components/converter/AddConverter"
import CreateConverter from "./components/converter/CreateConverter"

import getOfficialData from "./service/getOfficialData"
import getUnofficialData from "./service/getUnofficialData"

import { Tabs, Tab } from "react-bootstrap"

class App extends Component {
  constructor(props, context) {
  super(props, context);
  this.state = {
    accounts: null,
    isDataLoad:false
    }
  }

  componentDidMount = async () => {
    // init curent step for create converter
    this.props.MobXStorage.updateStep()
    // load tokens data
    // make litle delay for correct getweb3() call getWeb3()
    setTimeout(() => this.initData(), 500)

    // get web3 and account
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3()
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()

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
        <div className="container-fluid">
        <Tabs defaultActiveKey="trade" id="create">

        <Tab eventKey="trade" title="Trade">
        <TradePage/>
        </Tab>

        <Tab eventKey="send" title="Send">
        <SendPage/>
        </Tab>

        <Tab eventKey="pool" title="Pool">
        <PoolPage/>
        </Tab>

        <Tab eventKey="relays" title="Relays">
        <RelaysPage/>
        </Tab>

        <Tab eventKey="create" title="Create converter">
        {
          this.props.MobXStorage.web3
          ?
          (<CreateConverter/>)
          :
          (<p>Please connect to web3</p>)
        }
        </Tab>

        <Tab eventKey="addConverter" title="Add converter">
        {
          this.props.MobXStorage.web3
          ?
          (<AddConverter />)
          :
          (<p>Please connect to web3</p>)
        }
        </Tab>

        </Tabs>
        </div>
      )

      </React.Fragment>
    )
  }
}

export default inject('MobXStorage')(observer(App))
