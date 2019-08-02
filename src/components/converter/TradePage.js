import React from 'react'

import TradeModal from './modals/TradeModal'
import { Card } from 'react-bootstrap'

import { updateData } from '../../config'

function TradePage() {
  return (
    <React.Fragment>

    <Card className="text-center">
    <Card.Header>Convert ERC20 to ERC20</Card.Header>
    <Card.Body>
    <Card.Title></Card.Title>
    <Card.Text>
    This opensource dapp allows you to convert both official and unofficial tokens in the Bancor Network.
    </Card.Text>
    <Card.Text>
    Please be careful when you choosing unofficial tokens.
    </Card.Text>
    <Card.Text>
    You can also add your own tokens to the unofficial list in the "add converter" tab.
    </Card.Text>
    <Card.Text>
    More updates coming soon.
    </Card.Text>

    <TradeModal/>
     </Card.Body>
     <Card.Footer className="text-muted">last update: { updateData }</Card.Footer>
    </Card>
    </React.Fragment>
  )

}

export default TradePage
