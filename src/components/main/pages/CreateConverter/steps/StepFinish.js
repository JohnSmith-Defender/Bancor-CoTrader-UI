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
  document.location.reload(true)
}

function StepFinish(props) {
  const classes = useStyles()
  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} gutterBottom>
            Congratulations now your token in the Bancor network
          </Typography>

          <Typography variant="body1" className={'mb-2'} component="p">
            Now you need to add a reserve, please go to the "Pool page"
          </Typography>


          <Button onClick={() => clearStorageAndRefreshPage()}>Add new another token</Button>

        </CardContent>
      </Card>
    </React.Fragment>
  )
}

export default StepFinish
