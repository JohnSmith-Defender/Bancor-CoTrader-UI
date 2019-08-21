import React from 'react'
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap"

const FakeButton = (props) => (
  <OverlayTrigger
     placement="bottom"
     overlay={
     <Tooltip id="tooltip">
     { props.info }
     </Tooltip>
     }
     >
     <Button className="buttonsAdditional" size={props.size ? props.size:"sm"} variant="outline-primary">{ props.buttonName }</Button>
     </OverlayTrigger>
)

export default FakeButton;
