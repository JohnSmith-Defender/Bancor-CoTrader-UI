import React from 'react'
import RelaysForm from '../forms/RelaysForm'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { ArrowRight } from '@material-ui/icons';
import pageStyles from '../../../css/pageStyles'
import TabBar from '../../static/TabBar'

const useStyles = pageStyles

function RelaysPage(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}><ArrowRight className={classes.icon} /></span>;
  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.modal} component="div">
            <TabBar location={props.location.pathname}/>
          </Typography>
          <Typography className={classes.title} gutterBottom>
            Bancor relay tokens
          </Typography>
          <Typography className={classes.modal} component="div">
            <RelaysForm />
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
            {bull} To earn from all trades, buy relay tokens.
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
            {bull} For example, to earn from every trade of DAI, buy the DAIBNT relay.
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
            {bull} When DAI is traded, a % of the conversion buys DAIBNT relay tokens.  This increases the price of DAIBNT.
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
            {bull} You can pay less for relay tokens by avoiding slippage. To do this, use the pool tab to get relay tokens, instead of buying them directly, here. The downside is you need to keep funds held in pools.
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
            {bull} More updates coming soon.
          </Typography>
        </CardContent>
      </Card>
    </React.Fragment>
  )
}
export default RelaysPage
