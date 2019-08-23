import React, { Component } from 'react'
import { Form, Badge } from 'react-bootstrap'

class ConverterSettings extends Component {

  render() {
    return (
      <div className="container-fluid" align="center">
        <Badge variant="primary">My settings</Badge>
        <Form.Group>
        <Form.Check type="checkbox" label="Set 2x gas price" />
        </Form.Group>
      </div>
    )
  }

}

export default ConverterSettings
