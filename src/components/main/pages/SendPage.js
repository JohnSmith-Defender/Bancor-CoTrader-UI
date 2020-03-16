import React from 'react'
import SendForm from '../forms/SendForm'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { ArrowRight } from '@material-ui/icons';
import pageStyles from '../../../css/pageStyles'
import TabBar from '../../static/TabBar'

const useStyles = pageStyles


function SendPage(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}><ArrowRight className={classes.icon} /></span>;
  return (
    <React.Fragment>
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.modal} component="div">
          <TabBar location={props.location.pathname}/>
        </Typography>
        <Typography className={classes.title} gutterBottom component="h2">
          Trade and send via Bancor
        </Typography>
        <Typography className={classes.modal} component="div">
          <SendForm/>
        </Typography>
        <Typography variant="body1" className={'mb-2'} component="p">
          {bull} This page allows trade and send to any ETH address.
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
          {bull} More updates coming soon.
        </Typography>

      </CardContent>
    </Card>
    </React.Fragment>
  )
}
export default SendPage
