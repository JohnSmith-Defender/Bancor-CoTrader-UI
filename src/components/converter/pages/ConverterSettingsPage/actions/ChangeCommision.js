import React, { Component } from 'react'
import { Button, Modal } from "react-bootstrap"


class ChangeCommision extends Component {
  state={
    show:false
  }

  render() {
    return (
      <React.Fragment>
      <Button variant="outline-primary" onClick={() => this.setState({ show:true })}>Change commision</Button>

      <Modal
        size="lg"
        show={this.state.show}
        onHide={() => this.setState({ show:false })}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Small Modal
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>...</Modal.Body>
      </Modal>
      </React.Fragment>
    )
  }

}

export default ChangeCommision
