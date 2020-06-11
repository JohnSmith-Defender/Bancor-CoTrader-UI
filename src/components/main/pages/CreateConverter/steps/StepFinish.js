// Stupid component for render data

import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import pageStyles from '../../../../../css/pageStyles'
import { Button } from "react-bootstrap"

const useStyles = pageStyles

function clearStorageAndRefreshPage(){
  window.localStorage.clear()
  window.location.reload()
}

function StepFinish(props) {
  const classes = useStyles()
  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} gutterBottom>
            Congratulations after confirming the transaction, your token will be added in Bancor Network.
          </Typography>

          <Typography variant="body1" className={'mb-2'} component="p">
            After confirming you can go to the "Pool page", find your token and add reserve.
          </Typography>

          <Typography variant="body1" className={'mb-2'} component="p">
            It usually takes 10 to 15 minutes after confirmation.
          </Typography>

          <Button onClick={() => clearStorageAndRefreshPage()}>Add new another token</Button>

        </CardContent>
      </Card>
    </React.Fragment>
  )
}

export default StepFinish
