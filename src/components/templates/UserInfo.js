import React from 'react'
import { OverlayTrigger, Tooltip, Badge } from "react-bootstrap"

const UserInfo = (props) => {
  return(
      <OverlayTrigger
      placement="top"
      overlay={
      <Tooltip id="tooltip">
      { props.info }
      </Tooltip>
      }
      >
      <Badge variant="info">{props.label ? props.label : "info"}</Badge>
      </OverlayTrigger>
    )
}

export default UserInfo
