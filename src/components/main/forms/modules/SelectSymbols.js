import React, { Component } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import { inject, observer } from 'mobx-react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

class SelectSymbols extends Component {
  constructor(props, context) {
   super(props, context)
    this.state = {
    from:undefined,
    ShowModal:false,
    officialSmartTokenSymbols:null,
    bancorTokensStorageJson:null,
    selectFromOficial:true,
    useERC20AsSelect: this.props.from ? this.props.MobXStorage.useERC20AsSelectFrom : this.props.MobXStorage.useERC20AsSelectTo,
    }
  }

  componentDidMount(){
    // Update state with tokens data
    const officialSymbols = this.props.MobXStorage.officialSymbols
    let officialSmartTokenSymbols = this.props.MobXStorage.officialSmartTokenSymbols
    // delete BNT from smart tokens
    officialSmartTokenSymbols = officialSmartTokenSymbols.filter(e => e !== 'BNT')
    const bancorTokensStorageJson = this.props.MobXStorage.bancorTokensStorageJson
    
    this.setState({
      officialSymbols,
      officialSmartTokenSymbols,
      bancorTokensStorageJson,
      useERC20AsSelect:true
    })

    // reset smart tokens select
    this.props.MobXStorage.updateSelectType("to", true)
    this.props.MobXStorage.updateSelectType("from", true)
  }

  updateMobxSelect = (value) => {
    this.props.MobXStorage.updateSymbolSelector(this.props.symbolDirection, value)
  }


  updateMobxSelectType = () => {
    this.props.MobXStorage.updateSelectType(this.props.symbolDirection, !this.state.useERC20AsSelect)
    this.setState({ useERC20AsSelect: !this.state.useERC20AsSelect })
  }


  render() {
    return (
      <React.Fragment>
      {
        this.state.officialSymbols
        ?
        (
          <React.Fragment>
          {
            this.props.useSmartTokenSymbols
            ?
            (
              <FormControlLabel
                control={<Checkbox
                onChange={e => this.updateMobxSelectType()}
                checked={this.state.useERC20AsSelect} className="custom_check" color="primary"/>}
                label="Show tokens, hide relay"
              />
            )
            :
            (null)
          }
          <br/>
          <Typeahead
              labelKey="fromOfficialTokens"
              multiple={false}
              id="officialTokens"
              options={this.state.useERC20AsSelect ? this.state.officialSymbols :this.state.officialSmartTokenSymbols}
              onChange={(s) => this.updateMobxSelect(s[0])}
              placeholder={`Choose token to ${this.props.symbolDirection === 'from' ? 'send' :'receive'}`}
          />
          </React.Fragment>
        )
        :
        (null)
      }
      </React.Fragment>
    )
  }

}

export default inject('MobXStorage')(observer(SelectSymbols))
