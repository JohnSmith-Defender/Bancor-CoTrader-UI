import React from 'react'
import { Card } from 'react-bootstrap'
import RelaysModal from '../modals/RelaysModal'

function RelaysPage() {
  return (
    <React.Fragment>

    <Card className="text-center">
    <Card.Header>Bancor relay tokens</Card.Header>
    <Card.Body>
    <Card.Text>
    To earn from all trades, buy relay tokens.
    </Card.Text>
    <Card.Text>
    For example, to earn from every trade of DAI, buy the DAIBNT relay.
    </Card.Text>
    <Card.Text>
    When DAI is traded, a % of the conversion buys DAIBNT relay tokens.  This increases the price of DAIBNT.
    </Card.Text>
    <Card.Text>
    You can pay less for relay tokens by avoiding slippage. To do this, use the pool tab to get relay tokens, instead of buying them directly, here. The downside is you need to keep funds held in pools.
    </Card.Text>
    <Card.Text>
    More updates coming soon.
    </Card.Text>
    <RelaysModal />
     </Card.Body>
     <Card.Footer className="text-muted">DEX is free trade; let freedom ring</Card.Footer>
    </Card>
    </React.Fragment>
  )

}

export default RelaysPage
