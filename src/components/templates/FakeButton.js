import React from 'react'
import { OverlayTrigger, Tooltip } from "react-bootstrap"

import Button from '@material-ui/core/Button'

const FakeButton = (props) => (
  <OverlayTrigger
     placement="bottom"
     overlay={
     <Tooltip id="tooltip">
     { props.info }
     </Tooltip>
     }
     >
     <Button variant="contained" color="primary">{ props.buttonName }</Button>
     </OverlayTrigger>
)

export default FakeButton;
