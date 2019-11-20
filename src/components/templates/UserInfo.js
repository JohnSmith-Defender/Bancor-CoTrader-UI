import React from 'react'
import { OverlayTrigger, Tooltip, Badge } from "react-bootstrap"

const UserInfo = (props) => {
  return(
      <OverlayTrigger
      trigger="click"
      placement="top"
      overlay={
      <Tooltip id="tooltip">
      { props.info }
      </Tooltip>
      }
      >
      <Badge variant="info" className={'bg_blue'}>{props.label ? props.label : "info"}</Badge>
      </OverlayTrigger>
    )
}

export default UserInfo
