import React from 'react'

import SendModal from './modals/SendModal'
import { Card } from 'react-bootstrap'

import { updateData } from '../../config'

function SendPage() {
  return (
    <React.Fragment>

    <Card className="text-center">
    <Card.Header>Convert ERC20 to ERC20</Card.Header>
    <Card.Body>
    <Card.Title></Card.Title>
    <Card.Text>
    This page allow You exchange tokens and send for any ETH address
    </Card.Text>
    <Card.Text>
    Please be careful when you choosing unofficial tokens.
    </Card.Text>
    <Card.Text>
    More updates coming soon.
    </Card.Text>

    <SendModal/>
     </Card.Body>
     <Card.Footer className="text-muted">last update: { updateData }</Card.Footer>
    </Card>
    </React.Fragment>
  )

}

export default SendPage
