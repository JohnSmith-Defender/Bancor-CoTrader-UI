// Description
// This component update selected symbols and useERC20AsSelect global state in mobxStorage class
// in components Relay, Send and Trade

// TODO make this component as modal

// props
// this props.symbolDirection FROM or TO
// this.props.useSmartTokenSymbols (for relay case)

// Note: props Symbol by default can be added for task popup-url

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
    unofficialSmartTokenSymbols:null,
    bancorTokensStorageJson:null,
    selectFromOficial:true,
    useERC20AsSelect: this.props.from ? this.props.MobXStorage.useERC20AsSelectFrom : this.props.MobXStorage.useERC20AsSelectTo,
    }
  }

  componentDidMount(){
    // Update state with tokens data
      const officialSymbols = this.props.MobXStorage.officialSymbols
      const unofficialSymbols = this.props.MobXStorage.unofficialSymbols
      let officialSmartTokenSymbols = this.props.MobXStorage.officialSmartTokenSymbols

      // delete BNT from smart tokens
      officialSmartTokenSymbols = officialSmartTokenSymbols.filter(e => e !== 'BNT')

      const unofficialSmartTokenSymbols = this.props.MobXStorage.unofficialSmartTokenSymbols
      const bancorTokensStorageJson = this.props.MobXStorage.bancorTokensStorageJson
      this.setState({
        officialSymbols,
        unofficialSymbols,
        officialSmartTokenSymbols,
        unofficialSmartTokenSymbols,
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
          <FormControlLabel
              control={<Checkbox onChange={e => this.setState({ selectFromOficial: !this.state.selectFromOficial })}
              name="selectFromOficial" className="custom_check" color="primary" />}
              label="Show unofficial"
          />
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
          {
            this.state.selectFromOficial
            ?
            (
              <Typeahead
                  labelKey="fromOfficialTokens"
                  multiple={false}
                  id="officialTokens"
                  options={this.state.useERC20AsSelect ? this.state.officialSymbols :this.state.officialSmartTokenSymbols}
                  onChange={(s) => this.updateMobxSelect(s[0])}
                  placeholder={`Choose a token for ${this.props.symbolDirection === 'from' ? 'send' :'receive'}`}
              />
            )
            :
            (
              <Typeahead
                  labelKey="fromUnofficialTokens"
                  multiple={false}
                  id="unofficialTokens"
                  options={this.state.useERC20AsSelect ? this.state.unofficialSymbols : this.state.unofficialSmartTokenSymbols}
                  onChange={(s) => this.updateMobxSelect(s[0])}
                  placeholder={`Choose a token for ${this.props.symbolDirection  === 'from' ? 'send' :'receive'}`}
              />
            )
          }
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
