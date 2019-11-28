import React from 'react';
import { NavLink } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tab from '@material-ui/core/Tab'
import SwapHoriz from '@material-ui/icons/SwapHoriz'
import Send from '@material-ui/icons/Send'
import Pool from '@material-ui/icons/Pool'
import Timeline from '@material-ui/icons/Timeline'
import Create from '@material-ui/icons/Create'
import Grid from '@material-ui/core/Grid'
import Settings from '@material-ui/icons/Settings'
import Add from '@material-ui/icons/Add'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    //backgroundColor: theme.palette.background.paper,
    backgroundColor:'transparent',
  },
  tab_item:{
    fontWeight: '600',
    //color:'#ffffff',
  },
  app_bg:{
    backgroundColor : 'rgba(255,255,255,0.05)',
    borderRadius: '4px',
  }
}));


export default function TabBar(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static" color="secondary" className={classes.app_bg}>
      <Grid container justify="center" alignItems="center">
          <NavLink to="/trade" color="primary"><Tab color="primary" className={classes.tab_item} label="Trade" icon={<SwapHoriz />} /></NavLink>
          <NavLink to="/send"><Tab className={classes.tab_item} label="Send" icon={<Send />} /></NavLink>
          <NavLink to="/pool"><Tab className={classes.tab_item} label="Pool" icon={<Pool />} /></NavLink>
          <NavLink to="/relay"><Tab className={classes.tab_item} label="Relays" icon={<Timeline />} /></NavLink>
          {
            props.location === '/'
            ?
            (
              <>
              <NavLink to="/create-converter"><Tab className={classes.tab_item} label="Create" icon={<Create />} /></NavLink>
              <NavLink to="/add-converter"><Tab className={classes.tab_item} label="Add" icon={<Add />} /></NavLink>
              <NavLink to="/converter-settings"><Tab className={classes.tab_item} label="Settings" icon={<Settings />} /></NavLink>
              </>
            )
            :(null)
          }
        </Grid>
      </AppBar>

    </div>
  )
}
