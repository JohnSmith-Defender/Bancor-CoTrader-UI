import React from 'react'
import SendModal from '../modals/SendModal'
import { Card } from 'react-bootstrap'


function SendPage() {
  return (
    <React.Fragment>

    <Card className="text-center">
    <Card.Header>Trade and send via Bancor</Card.Header>
    <Card.Body>
    <Card.Text>
    This page allows trade and send to any ETH address.
    </Card.Text>
    <Card.Text>
    Please be careful when choosing unverified tokens.
    </Card.Text>
    <Card.Text>
    More updates coming soon.
    </Card.Text>

    <SendModal/>
     </Card.Body>
     <Card.Footer className="text-muted">DEX is free trade; let freedom ring</Card.Footer>
    </Card>
    </React.Fragment>
  )

}

export default SendPage
