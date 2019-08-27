import React from 'react'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  footer:{
    margin:'40px 0 0',
  },
  footertext:{
    textAlign:'center',
    fontSize:14,
    color:'#333'
  },
}));

function Footer() {
  const classes = useStyles();
  return (
    <div className={classes.footer}>
    <Typography className={classes.footertext} color="textSecondary">
      DEX is free trade. Let freedom ring. This is a free, open source, unrestricted portal into the{" "}
      <a style={{color: '#3f51b5'}} href="http://Bancor.network" target="_blank" rel="noopener noreferrer">Bancor.network</a>,{" "}
      made by <a style={{color: '#3f51b5'}} href="https://about.cotrader.com/" rel="noopener noreferrer" target="_blank">CoTrader</a>
    </Typography>
    <Typography className={classes.footertext} color="textSecondary">
      <a style={{color: '#3f51b5'}} href="https://t.me/cotrader" target="_blank" rel="noopener noreferrer"> Chat and Support</a>
    </Typography>
    </div>
  )
}

export default Footer
