import React from 'react'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Panel from '../admin/Panel/Panel'

const useStyles = makeStyles(theme => ({
  footer:{
    margin:'40px 0 0',
  },
  footertext:{
    textAlign:'center',
    fontSize:14,
  },
}));

function Footer() {
  const classes = useStyles();
  return (
    <div className={classes.footer}>
    <Typography className={classes.footertext} color="textSecondary">
      DEX is free trade. Let freedom ring. This is a free, open source, unrestricted portal into the{" "}
      <a color="textprimary" href="http://Bancor.network" target="_blank" rel="noopener noreferrer">Bancor.network</a>,{" "}
      made by <a color="textprimary" href="https://about.cotrader.com/" rel="noopener noreferrer" target="_blank">CoTrader</a>
    </Typography>
    <Typography className={classes.footertext} color="textSecondary">
      <a color="textprimary" href="https://t.me/cotrader" target="_blank" rel="noopener noreferrer"> Chat and Support</a>
    </Typography>
    <div align="center">
    <Panel/>
    </div>
    </div>
  )
}

export default Footer
