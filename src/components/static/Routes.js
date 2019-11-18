import React from 'react';
import {
  Route,
  Switch,
  // Redirect
} from 'react-router-dom'

import TradePage from "../main/pages/TradePage"
import HomePage from "../main/pages/HomePage"
import SendPage from "../main/pages/SendPage"
import RelaysPage from "../main/pages/RelaysPage"
import PoolPage from "../main/pages/PoolPage"
// import AddConverter from "../converter/pages/AddConverter"
import CreateConverter from "../main/pages/CreateConverter/CreateConverter"
import ConverterSettingsPage from "../main/pages/ConverterSettingsPage/ConverterSettingsPage"
import StablePool from "../main/pages/StablePoolPage/StablePool"


export default function Routes() {

  return (
   <Switch>
     <Route exact path="/" component={(props) => <HomePage {...props} />} />
     <Route path="/trade" component={(props) => <TradePage {...props} />} />
     <Route path="/send" component={(props) => <SendPage {...props} />} />
     <Route path="/pool" component={(props) => <PoolPage {...props} />} />
     <Route path="/stable-pool" component={(props) => <StablePool {...props} />} />
     <Route path="/relay" component={(props) => <RelaysPage {...props} />} />
     <Route path="/create-converter" component={(props) => <CreateConverter {...props} />} />
     <Route path="/converter-settings" component={(props) => <ConverterSettingsPage{...props} />} />
    </Switch>
  );
}
