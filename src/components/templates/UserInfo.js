import React from 'react'
import { OverlayTrigger, Tooltip, Badge } from "react-bootstrap"

const UserInfo = (props) => {
  return(
      <OverlayTrigger
      placement="bottom"
      overlay={
      <Tooltip id="tooltip">
      { props.info }
      </Tooltip>
      }
      >
      <Badge variant="info">info</Badge>
      </OverlayTrigger>
    )
}

export default UserInfo
