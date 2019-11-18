import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Alert, Badge, ButtonGroup } from 'react-bootstrap'
import { EtherscanLink } from '../../../../config'
import ChangeCommision from './actions/ChangeCommision'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

class ConverterSettingsPage extends Component {
  constructor(props, context) {
   super(props, context)
    this.state = {
    storage:null,
    symbols:null,
    bancorTokensStorageJson:null,
    converterInfoObj: null
    }
  }

  _isMounted = false

  componentDidMount () {
    this._isMounted = true
    setTimeout(() => {
      if(this.props.MobXStorage.bancorTokensStorageJson && this._isMounted)
        this.setConvertersByOwner()
    }, 2000)
  }

  componentWillUnmount() {
    this._isMounted = false
  }


  setConvertersByOwner = () => {
    const user = this.props.MobXStorage.accounts[0]
    const storage = this.props.MobXStorage.bancorTokensStorageJson.filter(converter => converter.owner && converter.owner.includes(user))
    const symbols = storage.map((converter) => converter.symbol)
    this.setState({
      bancorTokensStorageJson:this.props.MobXStorage.bancorTokensStorageJson,
      symbols,
      storage
    })
  }

  setConverterInfoObjBySymbol = (symbol) => {
    const converterInfoObj = this.state.storage.filter(converter => converter.symbol && converter.symbol.includes(symbol))[0]
    this.setState({ converterInfoObj })
  }

  render() {
    return (
      <React.Fragment>
      {
        this.props.MobXStorage.web3
        ?
        (
          <React.Fragment>
          <Card style={{margin: '16px 0px', backgroundColor:'rgba(255,255,255,0.1)'}}>
          <CardContent>

          <Typography variant="h4" style={{fontSize: 22}} gutterBottom component="h4">
            Manage your converter
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
            Set converter settings such as conversion fee %.
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
            The conversion fee % is used to buy relay tokens.
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
            For example, whenever DAI tokens are traded, a small % of the conversion buys DAIBNT relay tokens.
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
            This benefits those who added to the DAI liquidity pool in the “Pool” tab, or got the DAIBNT relay token in the “Relays’ tab.
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
          More contract methods will be added soon.
          </Typography>
          {
            this.props.MobXStorage.bancorTokensStorageJson&&this.state.symbols
            ?
            (
              <React.Fragment>
              {
                this.state.symbols.length > 0
                ?
                (
                  <div style={{width:"300px", margin: "0px auto"}}>
                  <Form.Group>
                  <Form.Label>Select Your token from list</Form.Label>
                  <Form.Control
                  name="selectConverters"
                  onChange={(e) => this.setConverterInfoObjBySymbol(e.target.value)}
                  as="select"
                  >
                  <option>...</option>
                  {this.state.symbols.map((index, key) => <option key={key}>{index}</option>)}
                  </Form.Control>
                  </Form.Group>
                  </div>
                )
                :
                (
                  <Alert variant="warning" style={{color: '#3f51b5'}}>You don't have any converters</Alert>
                )
              }
              {
                // Converters info
                <React.Fragment>
                {
                  this.state.converterInfoObj
                  ?
                  (
                    <React.Fragment>
                    <Form.Group>
                    <Badge variant="light">Converter address: <a href={EtherscanLink+ "address/" +this.state.converterInfoObj.converterAddress} target="_blank" rel="noopener noreferrer">{this.state.converterInfoObj.converterAddress.substr(0, this.state.converterInfoObj.converterAddress.length - 15)}...</a></Badge>
                    <Badge variant="light">Smart token address: <a href={EtherscanLink+ "address/" +this.state.converterInfoObj.smartTokenAddress} target="_blank" rel="noopener noreferrer">{this.state.converterInfoObj.smartTokenAddress.substr(0, this.state.converterInfoObj.smartTokenAddress.length - 15)}...</a></Badge>
                    <br/>
                    <br/>
                    <ButtonGroup size="sm">
                    <ChangeCommision
                    converterAddress={this.state.converterInfoObj.converterAddress}
                    web3={this.props.MobXStorage.web3}
                    accounts={this.props.MobXStorage.accounts}
                    />
                    </ButtonGroup>
                      </Form.Group>
                    </React.Fragment>
                  )
                  :
                  (null)
                }
                </React.Fragment>
              }
              </React.Fragment>
            )
            :
            (
              <Form.Group>
              <Badge variant="primary">loading data...</Badge>
              </Form.Group>
            )
          }
          </CardContent>
          </Card>
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

export default inject('MobXStorage')(observer(ConverterSettingsPage))
