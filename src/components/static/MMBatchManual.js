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
      If you use <strong style={{color:'red'}}>MetaMask</strong> please read this small &nbsp;

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

      &nbsp; before execude transaction. Otherwise you may get an error.
      </small>

      <Modal show={show} size="lg" onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Batch manual</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>If You see more then 1 transaction for confirm and switches, this means we use batch requests for ERC20 transfers</p>
        <Image src="img/manuals/batch-order/two-transaction.png" fluid />
        <p>In this case transaction should start from Approve. Approve allow contract transfer your ERC20 tokens.</p>
        <p>For ERC20 standard approve should always be sent first</p>
        <p>But unfortunately metamask has problems with transactions order, and sometimes the order may be confused and this will lead to an error</p>
        <br/>
        <hr/>
        <h3 style={{color:"red"}}>This is not correct order</h3>
        <Image src="img/manuals/batch-order/wrong-order.png" fluid />
        <br/>
        <hr/>
        <h3 style={{color:"green"}}>This is correct order:</h3>
        <Image src="img/manuals/batch-order/correct-order.png" fluid />
        <br/>
        <hr/>
        <h4>How to fix</h4>
        <p>Just use the switches to set the correct order, if you see incorect order.</p>
        <Image src="img/manuals/batch-order/switch.png" fluid />
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
        <h5>Notice</h5>
        <p>You don't need approve, when you trade from ETH, BNT and Relay tokens.</p>
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
