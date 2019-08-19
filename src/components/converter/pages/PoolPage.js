import React from 'react'
import { Card } from 'react-bootstrap'
import PoolModal from '../modals/PoolModal'


function PoolPage() {
  return (
    <React.Fragment>

    <Card className="text-center">
    <Card.Header>Bancor liquidity pools</Card.Header>
    <Card.Body>
    <Card.Text>
    To earn from all trades, add liquidity to pools.
    </Card.Text>
    <Card.Text>
    When you do this, you'll receive “relay tokens”.
    </Card.Text>
    <Card.Text>
    For example, to earn from every trade of DAI, you can deposit both:
    </Card.Text>
    <Card.Text>
    BNT and DAI
    </Card.Text>
    <Card.Text>
    You'll receive a relay token called DAIBNT for the DAI pool.
    </Card.Text>
    <Card.Text>
    To get the deposit back, just return the DAIBNT.
    </Card.Text>
    <Card.Text>
    When DAI is traded, a % of the conversion buys DAIBNT relay tokens.  This increases the price of DAIBNT.
    </Card.Text>
    <Card.Text>
    Relay tokens like DAIBNT are also speculative assets. They can be bought and sold separately in the "Relays" tab without depositing in pools. However, that incurs slippage.
    </Card.Text>
    <Card.Text>
    More updates coming soon.
    </Card.Text>
    <PoolModal/>
     </Card.Body>
     <Card.Footer className="text-muted">DEX is free trade; let freedom ring</Card.Footer>
    </Card>
    </React.Fragment>
  )

}

export default PoolPage
