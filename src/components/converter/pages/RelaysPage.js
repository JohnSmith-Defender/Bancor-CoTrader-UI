import React from 'react'
import RelaysModal from '../modals/RelaysModal'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { ArrowRight } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  card: {
    minWidth: 275,
    margin: theme.spacing(2, 0),
    backgroundColor:'rgba(255,255,255,0.1)',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 22,
  },
  pos: {
    marginBottom: 12,
  },
  icon: {
    margin: theme.spacing(0),
    fontSize: 25,
    marginBottom: '-6px',
  },
  footer:{
    borderTop: '1px solid #eee',
  },
  modal:{
    margin: theme.spacing(2, 0),
  },
  button:{
    margin: theme.spacing(1),
  },
  footertext:{
    textAlign:'center',
    fontSize:14
  },
}));

function RelaysPage() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}><ArrowRight className={classes.icon} /></span>;
  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} gutterBottom>
            Bancor relay tokens
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
          <Typography className={classes.modal} component="div">
            <RelaysModal />
          </Typography>
        </CardContent>
      </Card>
    </React.Fragment>
  )
}
export default RelaysPage
