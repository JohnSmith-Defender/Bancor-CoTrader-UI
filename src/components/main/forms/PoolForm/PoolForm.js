// THIS COMPONENT ALLOW USER CALL FUND AND LIQUIDATE FROM A CERTAIN CONVERTER
// TODO refactoring (Presentational and Container)
// TODO DRY

import React, { Component } from 'react'
import { Form } from "react-bootstrap"
import { inject, observer } from 'mobx-react'
import findByProps from '../../../../service/findByProps'
import getWeb3ForRead from '../../../../service/getWeb3ForRead'
import { ABIConverter, ABISmartToken } from '../../../../config'
import { hexToNumberString } from 'web3-utils'
import { isMobile } from 'react-device-detect'
import Liquidate from './Liquidate'
import Fund from './Fund'

import { Typeahead } from 'react-bootstrap-typeahead'

import Chip from '@material-ui/core/Chip';
// import Checkbox from '@material-ui/core/Checkbox';
// import FormControlLabel from '@material-ui/core/FormControlLabel';

class PoolForm extends Component {
  constructor(props, context) {
   super(props, context)
    this.state = {
    from:undefined,
    ShowModal:false,
    bancorTokensStorageJson:null,
    selectFromOficial:true,
    officialSymbols:undefined,
    selectAction:'Add liquidity'
    }
  }

  // helper for setState
  change = e => {
    if(typeof this.state[e.target.name] === "boolean"){
      this.setState({
        [e.target.name]: !this.state[e.target.name]
      })
    }else{
      this.setState({
        [e.target.name]: e.target.value
      })
    }
  }

  unmounted = false
  componentDidMount(){
    this.unmounted = false
    // if data alredy load
    if(this.props.MobXStorage.bancorTokensStorageJson){
      this.initData()
    }
    // check data status via interval
    else{
      const interval = setInterval(() => {
      if(this.props.MobXStorage.bancorTokensStorageJson){
        this.initData()
        clearInterval(interval)
      }
    }, 1000)
    }
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  initData(){
    let officialSymbols = this.props.MobXStorage.officialSymbols
    const bancorTokensStorageJson = this.props.MobXStorage.bancorTokensStorageJson

    // delete BNT and ETH from pool
    officialSymbols = officialSymbols.filter(e => e !== 'BNT')
    officialSymbols = officialSymbols.filter(e => e !== 'ETH')

    if(!this.unmounted)
    this.setState({
      officialSymbols,
      bancorTokensStorageJson
    })
  }

  getTokenBalance = async (web3, tokenAddress, user) => {
    const tokenContract = new web3.eth.Contract(ABISmartToken, tokenAddress)
    let tokenBalance = await tokenContract.methods.balanceOf(user).call()
    tokenBalance = hexToNumberString(tokenBalance._hex)
    return tokenBalance
  }

  /*
  return converter contract,
  converter address,
  connector (ERC20) token address,
  smart token address,
  smart token contract,
  and all token info object */
  getInfoBySymbol = async () => {
    if(this.state.from && this.state.bancorTokensStorageJson){
      const web3 = getWeb3ForRead(this.props.MobXStorage.web3)
      const tokenInfo = findByProps(this.state.bancorTokensStorageJson, 'symbol', this.state.from)[0]
      const smartTokenContract = new web3.eth.Contract(ABISmartToken, tokenInfo.smartTokenAddress)
      // get latest converter address not from api, but from contracts 
      const converterAddress = await smartTokenContract.methods.owner().call()
      const converterContract = new web3.eth.Contract(ABIConverter, converterAddress)

      return [
        converterContract,
        converterAddress,
        tokenInfo.tokenAddress,
        tokenInfo.smartTokenAddress,
        smartTokenContract,
        tokenInfo
      ]
    }
  }
  // TODO move this to a Presentational component
    render(){
      return(
      <React.Fragment>
      {
        this.props.MobXStorage.bancorTokensStorageJson
        ?
        (
          <div style={!isMobile ? {textAlign:"left", maxWidth: "550px", margin:"auto", padding:"20px", border:"1px solid #eee", borderRadius:"10px"}: null}>
            {
              this.state.officialSymbols
              ?
              (
                <React.Fragment>

                <Form.Group>
                <Form.Label>Action</Form.Label>
                <Form.Control as="select" size="sm" name="selectAction" onChange={e => this.change(e)}>
                <option>Add liquidity</option>
                <option>Remove liquidity</option>
                </Form.Control>
                </Form.Group>
                <Typeahead
                    labelKey="fromOfficialTokens"
                    multiple={false}
                    id="officialTokens"
                    options={this.state.officialSymbols}
                    onChange={(s) => this.setState({from: s[0]})}
                    placeholder="Choose a symbol for send"
                />
                <br/>
                {
                  this.state.selectAction === "Add liquidity"
                  ?
                  (
                    <Fund
                    from={this.state.from}
                    web3={this.props.MobXStorage.web3}
                    getInfoBySymbol={this.getInfoBySymbol}
                    accounts={this.props.MobXStorage.accounts}
                    bancorTokensStorageJson={this.props.MobXStorage.bancorTokensStorageJson}
                    getTokenBalance={this.getTokenBalance}
                    />
                  )
                  :
                  (
                    <Liquidate
                    from={this.state.from}
                    getInfoBySymbol={this.getInfoBySymbol}
                    web3={this.props.MobXStorage.web3}
                    accounts={this.props.MobXStorage.accounts}
                    getTokenBalance={this.getTokenBalance}
                    />
                  )
                }
                </React.Fragment>
              )

           :(<Chip label="update states..." style={{marginBottom: '15px'}} variant="outlined" color="primary"/>)
         }
          </div>
        )
        :
        (<Chip label="loading data..." style={{marginBottom: '15px'}} variant="outlined" color="primary"/>)
      }

      </React.Fragment>
      )
    }
}

export default inject('MobXStorage')(observer(PoolForm))
