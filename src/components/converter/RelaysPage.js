import React from 'react'
import { Card } from 'react-bootstrap'
import { updateData } from '../../config'
import RelaysModal from './modals/RelaysModal'

function RelaysPage() {
  return (
    <React.Fragment>

    <Card className="text-center">
    <Card.Header>Buy pool relays</Card.Header>
    <Card.Body>
    <Card.Title></Card.Title>
    <Card.Text>
    To own part of any token's exchange, buy its relay.
    </Card.Text>
    <Card.Text>
    For example, to own part of the COT exchange, buy the COTBNT relay.
    </Card.Text>
    <Card.Text>
    When COT is traded volume, a % of the value buys the COTBNT relay. This affects the relay price.
    </Card.Text>
    <Card.Text>
    More updates coming soon.
    </Card.Text>
    <RelaysModal />
     </Card.Body>
     <Card.Footer className="text-muted">last update: { updateData }</Card.Footer>
    </Card>
    </React.Fragment>
  )

}

export default RelaysPage
