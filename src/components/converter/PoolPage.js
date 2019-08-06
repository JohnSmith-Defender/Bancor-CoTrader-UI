import React from 'react'
import { Card } from 'react-bootstrap'
import { updateData } from '../../config'

function RelaysPage() {
  return (
    <React.Fragment>

    <Card className="text-center">
    <Card.Header>Pool</Card.Header>
    <Card.Body>
    <Card.Title></Card.Title>
    <Card.Text>
    To own part of any token's exchange, add liquidity to that token's pool.
    </Card.Text>
    <Card.Text>
    When you do this, you'll receive a relay token (aka smart token), for that pool.
    </Card.Text>
    <Card.Text>
    For example, to own part of the COT exchange, you'll deposit both:
    </Card.Text>
    <Card.Text>
    BNT and COT
    </Card.Text>
    <Card.Text>
    You'll receive the relay token for COT, called COTBNT.
    </Card.Text>
    <Card.Text>
    This relay token, COTBNT, is bought up whenever COT is traded, which raises its price.
    </Card.Text>
    <Card.Text>
    Relay tokens like COTBNT are also speculative assets. They can be bought and sold separately in the "Relays" tab.
    </Card.Text>
    <Card.Text>
    More updates coming soon.
    </Card.Text>
    <Card.Text>
    [Pool now]
    </Card.Text>
     </Card.Body>
     <Card.Footer className="text-muted">last update: { updateData }</Card.Footer>
    </Card>
    </React.Fragment>
  )

}

export default RelaysPage
