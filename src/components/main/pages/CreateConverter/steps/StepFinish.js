// Stupid component for render data

import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { ArrowRight } from '@material-ui/icons'
import pageStyles from '../../../../../css/pageStyles'

const useStyles = pageStyles

function StepFinish(props) {
  const classes = useStyles()
  const bull = <span className={classes.bullet}><ArrowRight className={classes.icon} /></span>
  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} gutterBottom>
            Congratulations
          </Typography>

        </CardContent>
      </Card>
    </React.Fragment>
  )
}

export default StepFinish
