import React from 'react'
import TabBar from '../../static/TabBar'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { ArrowRight } from '@material-ui/icons';
import pageStyles from '../../../css/pageStyles'

const useStyles = pageStyles

function HomePage(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}><ArrowRight className={classes.icon} /></span>;
  return (
    <React.Fragment>
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} gutterBottom component="h2">
          Welcome to the Bancor Portal
        </Typography>
        <Typography variant="body1" className={'mb-2'} component="p">
          {bull} This dapp allows you to trade, send, add tokens and earn from liquidity pools in the Bancor network.
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
          {bull} Add new tokens in the "create converter" tab.
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
          {bull} Please be careful when choosing unverified tokens.
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
          {bull} Ask us to verify new tokens in "Chat & Support" below.
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
          {bull} More updates coming soon.
        </Typography>
        <Typography className={classes.modal} component="div">
          <TabBar location={props.location.pathname}/>
        </Typography>
      </CardContent>
    </Card>
    </React.Fragment>
  )
}
export default HomePage
