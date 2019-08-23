import React from 'react'
import TradeModal from '../modals/TradeModal'
import { Card } from 'react-bootstrap'


function TradePage() {
  return (
    <React.Fragment>

    <Card className="text-center">
    <Card.Header>Trade via Bancor</Card.Header>
    <Card.Body>
    <Card.Text>
    This opensource dapp allows you to add and trade tokens in the Bancor Network.
    </Card.Text>
    <Card.Text>
    Our default lists include both Bancor official and CoTrader verified tokens.
    </Card.Text>
    <Card.Text>
    You can add a new token in the "add converter" tab.
    </Card.Text>
    <Card.Text>
    You can ask us to verify the token in "Chat & Support" below.
    </Card.Text>
    <Card.Text>
    Please be careful when you choosing unverified tokens.
    </Card.Text>
    <Card.Text>
    More updates coming soon.
    </Card.Text>

    <TradeModal/>
     </Card.Body>
     <Card.Footer className="text-muted">DEX is free trade; let freedom ring</Card.Footer>
    </Card>
    </React.Fragment>
  )

}

export default TradePage
