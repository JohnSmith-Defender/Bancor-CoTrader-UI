// NOT USED
import React from 'react'
import { Modal, Image } from 'react-bootstrap'
import { useState } from 'react'
import Button from '@material-ui/core/Button'

function MMBatchManual(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <small>
      If you use <strong style={{color:'red'}}>MetaMask</strong>, please read this small &nbsp;

      <button style={{
        backgroundColor:"#3f51b5",
        border: "none",
        color: "white",
        textAlign: "center",
        textDecoration: "none",
        display: "inline-block",
        fontSize: "10px",
      }} onClick={handleShow}>
        Manual
      </button>

      &nbsp; before executing transactions. Otherwise you may sometimes get an error.
      </small>

      <Modal show={show} size="lg" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Batch manual</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>If you see arrows like those circled in red below, use them to set "Approve" before "Convert".</p>
        <Image src="img/manuals/batch-order/two-tx.png" fluid />
        <br/>
        <hr/>
        <h3 style={{color:"green"}}>This order is correct</h3>
        <Image src="img/manuals/batch-order/correct-order-tx.png" fluid />
        <br/>
        <hr/>
        <h3 style={{color:"red"}}>This order is incorrect</h3>
        <Image src="img/manuals/batch-order/wrong-order-tx.png" fluid />
        <br/>
        <hr/>
        <h4>How to fix</h4>
        <p>Use the arrows to switch the correct order, if it's incorrect</p>
        <Image src="img/manuals/batch-order/switch-tx.png" fluid />
        <br/>
        <hr/>
        <h4>Example</h4>
        <Image src="img/manuals/batch-order/manual.gif" fluid />
        <br/>
        <br/>
        <Button variant="contained" color="primary" href="https://www.youtube.com/watch?v=BqyUO7ExzBo&feature=youtu.be" target="_blank">
          Show video
        </Button>
        <hr/>
        <br/>
        <Button variant="contained" color="primary" onClick={handleClose}>
          I got it
        </Button>
        <br/>
        <br/>
        <br/>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default MMBatchManual
