// NOT used for now

import React from 'react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Home from '@material-ui/icons/Home';
import SwapHoriz from '@material-ui/icons/SwapHoriz'
import Send from '@material-ui/icons/Send'
import Pool from '@material-ui/icons/Pool'
import Timeline from '@material-ui/icons/Timeline'
import Create from '@material-ui/icons/Create'
import Settings from '@material-ui/icons/Settings'
import logo from '../../assets/img/logo.png';
import logo2 from '../../assets/img/bancor-logo.png';
import Container from '@material-ui/core/Container';
import Desktop from '@material-ui/icons/DesktopMac';
import Laptop from '@material-ui/icons/LaptopMac';
import Tablet from '@material-ui/icons/Tablet';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    marginBottom:20
  },
  logo1:{
    marginRight:10,
    maxHeight:25,
    flexGrow: 1,
  },
  logo2:{
    marginRight:10,
    maxHeight:25,
    [theme.breakpoints.down('sm')]: {
      width: '27px',
    },
  },
  logoimg:{
    maxHeight:25,
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    zIndex:0,
  },
  appBarShift: {
    //width: `calc(100% - ${drawerWidth}px)`,
    //marginLeft: '58px',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    //width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function Navbar() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }

  function fullWidth(){
    if (!document.body.classList.contains('fullWidth_container')){
      document.body.classList.remove('tablet_container');
      document.body.classList.remove('laptop_container');
      document.body.classList.add('fullWidth_container');
    }
  }

  function laptopWidth(){
    if (!document.body.classList.contains('laptop_container')){
      document.body.classList.remove('fullWidth_container');
      document.body.classList.remove('tablet_container');
      document.body.classList.add('laptop_container');
    }
  }

  function tabletWidth(){
    if (!document.body.classList.contains('tablet_container')){
      document.body.classList.remove('fullWidth_container');
      document.body.classList.remove('laptop_container');
      document.body.classList.add('tablet_container');
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="relative"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
      <Container maxWidth="md">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>


          <Typography className={classes.logo1} variant="inherit" noWrap>
            <img className={classes.logoimg} src={logo2} alt="Bancor" />
          </Typography>

          <Typography className={classes.logo2} variant="inherit" noWrap>
            <a href="https://cotrader.com/" target="_blank" rel="noopener noreferrer"><img className={classes.logoimg} src={logo} alt="Cotrader" /></a>
          </Typography>

        </Toolbar>
        </Container>

        <div className="screen-toggle-bar">
        <Desktop className={'fullscreen-toggle'} onClick={fullWidth} title="Full Screen" style={{fontSize: '25px', cursor: 'pointer', float: 'right', marginLeft: '10px'}}/>
        <Laptop className={'fullscreen-toggle'} onClick={laptopWidth} title="Medium Screen" style={{fontSize: '25px', cursor: 'pointer', float: 'right', marginLeft: '10px'}}/>
        <Tablet className={'fullscreen-toggle'} onClick={tabletWidth} title="Small Screen" style={{fontSize: '25px', cursor: 'pointer', float: 'right', marginLeft: '10px'}}/>
        </div>

      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>

        <NavLink to="/" >
        <ListItem button key={"Home"} onClick={() => handleDrawerClose()}>
          <ListItemIcon><Home /></ListItemIcon>
          <ListItemText primary={'Home'} />
        </ListItem>
        </NavLink>

        <NavLink to="/trade" onClick={() => handleDrawerClose()}>
        <ListItem button key={"Trade"}>
          <ListItemIcon><SwapHoriz /></ListItemIcon>
          <ListItemText primary={'Trade'} />
        </ListItem>
        </NavLink>

        <NavLink to="/send" onClick={() => handleDrawerClose()}>
        <ListItem button key={"Send"}>
          <ListItemIcon><Send /></ListItemIcon>
          <ListItemText primary={'Send'} />
        </ListItem>
        </NavLink>

        <NavLink to="/pool" onClick={() => handleDrawerClose()}>
        <ListItem button key={"Pool"}>
          <ListItemIcon><Pool /></ListItemIcon>
          <ListItemText primary={'Pool'} />
        </ListItem>
        </NavLink>

        <NavLink to="/relay" onClick={() => handleDrawerClose()}>
        <ListItem button key={"Relay"}>
          <ListItemIcon><Timeline /></ListItemIcon>
          <ListItemText primary={'Relay'} />
        </ListItem>
        </NavLink>


        <NavLink to="/create-converter" onClick={() => handleDrawerClose()}>
        <ListItem button key={"Create converter"}>
          <ListItemIcon><Create/></ListItemIcon>
          <ListItemText primary={'Create converter'} />
        </ListItem>
        </NavLink>


        <NavLink to="/converter-settings" onClick={() => handleDrawerClose()}>
        <ListItem button key={"Converter settings"}>
          <ListItemIcon><Settings /></ListItemIcon>
          <ListItemText primary={'Converter settings'} />
        </ListItem>
        </NavLink>

        </List>
        <Divider />
      </Drawer>
    </div>
  );
}
