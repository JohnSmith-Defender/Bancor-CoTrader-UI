import React from 'react';
import {
  Route,
  Switch,
  // Redirect
} from 'react-router-dom'

import TradePage from "../converter/pages/TradePage"
import HomePage from "../converter/pages/HomePage"
import SendPage from "../converter/pages/SendPage"
import RelaysPage from "../converter/pages/RelaysPage"
import PoolPage from "../converter/pages/PoolPage"
// import AddConverter from "../converter/pages/AddConverter"
import CreateConverter from "../converter/pages/CreateConverter/CreateConverter"
import ConverterSettingsPage from "../converter/pages/ConverterSettingsPage/ConverterSettingsPage"


export default function Routes() {

  return (
   <Switch>
     <Route exact path="/" component={(props) => <HomePage {...props} />} />
     <Route path="/trade" component={(props) => <TradePage {...props} />} />
     <Route path="/send" component={(props) => <SendPage {...props} />} />
     <Route path="/pool" component={(props) => <PoolPage {...props} />} />
     <Route path="/relay" component={(props) => <RelaysPage {...props} />} />
     <Route path="/create-converter" component={(props) => <CreateConverter {...props} />} />
     <Route path="/converter-settings" component={(props) => <ConverterSettingsPage{...props} />} />
    </Switch>
  );
}
