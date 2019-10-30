import React from 'react'
import TabBar from '../../static/TabBar'
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

function HomePage() {
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
          {bull} This app allows you to trade, send, add tokens and earn from liquidity pools in the Bancor network.
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
          {bull} Please be careful when choosing unverified tokens.
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
          {bull} More updates coming soon.
        </Typography>
        <Typography className={classes.modal} component="div">
          <TabBar/>
        </Typography>
      </CardContent>
    </Card>
    </React.Fragment>
  )
}
export default HomePage
