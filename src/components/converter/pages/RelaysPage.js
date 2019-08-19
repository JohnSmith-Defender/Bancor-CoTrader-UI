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
    To earn from every trade of any token, add liquidity to that token's pool.
    </Card.Text>
    <Card.Text>
    For example, to start earning from COT trades, you'd deposit both:
    </Card.Text>
    <Card.Text>
    When COT is traded volume, a % of the value buys the COTBNT relay. This increases the relay price.
    </Card.Text>
    <Card.Text>
    You can pay less for relays by avoiding slippage. To do this, use the pool tab to get relay tokens, instead of buying them directly, here. The downside is you need to keep funds held in pool.
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
