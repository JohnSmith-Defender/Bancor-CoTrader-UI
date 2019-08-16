import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Form, Alert, Badge, Card, ButtonGroup } from 'react-bootstrap'
import { EtherscanLink } from '../../../../config'
import ChangeCommision from './actions/ChangeCommision'

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

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.MobXStorage.bancorTokensStorageJson !== this.state.bancorTokensStorageJson){
      this.setConvertersByOwner()
    }
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
          <br/>
          <Card className="text-center">
          <Card.Header>
           Manage your converter
          </Card.Header>
          <Card.Text>This page allow You get converter info, and the ability to interact with contract functionality</Card.Text>
          <Card.Text>More contract methods will be added soon.</Card.Text>
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
                  <Alert variant="warning">You not have any converter</Alert>
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
                    <ChangeCommision/>
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
          <Card.Footer className="text-muted">DEX is free trade; let freedom ring</Card.Footer>
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
