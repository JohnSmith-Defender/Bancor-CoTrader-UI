// This component return select form for Trade/Send/Pool/Relay
// This component will update symbols array in mobxStorage


// For pool return only from direction
// For relay return smart tokens symbols also

// NOT Worked Yet just concept

// props
// this.props.fromOnly
// this.props.useSmartTokenSymbols

import React, { Component } from 'react'

class SelectSymbols extends Component {

  render() {
    return (
      <React.Fragment>
      {/*select from*/}
      <React.Fragment>
      {
        this.state.officialSmartTokenSymbols && this.state.unofficialSmartTokenSymbols
        ?
        (
          <React.Fragment>
          <Form.Group>
          <Form.Check
          name="selectFromOficial"
          type="checkbox"
          label="Show unofficial"
          onChange={e => this.change(e)}
          />
          {
            this.props.useSmartTokenSymbols
            ?
            (
              <Form.Check
              type="checkbox"
              label="Show relays, hide tokens"
              onChange={e => this.setState({ useERC20AsSelectFrom: !this.state.useERC20AsSelectFrom })}
              checked={!this.state.useERC20AsSelectFrom}
              />
            )
            :
            (null)
          }
          </Form.Group>

          {
            this.state.selectFromOficial
            ?
            (
              <Typeahead
                  labelKey="fromOfficialTokens"
                  multiple={false}
                  id="officialTokens"
                  options={this.state.useERC20AsSelectFrom ? this.state.officialSymbols :this.state.officialSmartTokenSymbols}
                  onChange={(s) => this.setState({from: s[0]})}
                  placeholder="Choose a symbol for send"
              />
            )
            :
            (
              <Typeahead
                  labelKey="fromUnofficialTokens"
                  multiple={false}
                  id="unofficialTokens"
                  options={this.state.useERC20AsSelectFrom ? this.state.unofficialSymbols : this.state.unofficialSmartTokenSymbols}
                  onChange={(s) => this.setState({from: s[0]})}
                  placeholder="Choose a symbol for send"
              />
            )
          }
          </React.Fragment>
        )
        :
        (null)
      }
      </React.Fragment>

      <br/>
      {
        !this.props.fromOnly
        ?
        (
          <React.Fragment>
          {
            /*
            select to
            no need for pool case
            */
          }
          {
            this.state.officialSmartTokenSymbols && this.state.unofficialSmartTokenSymbols
            ?
            (
              <React.Fragment>
              <Form.Group>
              <Form.Check
              name="selectToOficial"
              type="checkbox"
              label="Show unofficial"
              onChange={e => this.change(e)}
              />
              {
                this.props.useSmartTokenSymbols
                ?
                (
                  <Form.Check
                  type="checkbox"
                  label="Show relays, hide tokens"
                  onChange={e => this.setState({ useERC20AsSelectTo: !this.state.useERC20AsSelectTo})}
                  checked={!this.state.useERC20AsSelectTo}
                  />
                )
                :
                (null)
              }
              </Form.Group>

              {
                this.state.selectToOficial
                ?
                (
                  <Typeahead
                      labelKey="fromOfficialTokens"
                      multiple={false}
                      id="officialTokens"
                      options={this.state.useERC20AsSelectTo ? this.state.officialSymbols : this.state.officialSmartTokenSymbols}
                      onChange={(s) => this.setState({to: s[0]})}
                      placeholder="Choose a symbol for buy"
                  />
                )
                :
                (
                  <Typeahead
                      labelKey="fromUnofficialTokens"
                      multiple={false}
                      id="unofficialTokens"
                      options={this.state.useERC20AsSelectTo ? this.state.unofficialSymbols : this.state.unofficialSmartTokenSymbols}
                      onChange={(s) => this.setState({to: s[0]})}
                      placeholder="Choose a symbol for buy"
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
        :
        (null)
      }


      <React.Fragment>
    )
  }

}

export default SelectSymbols
