import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwapHoriz from '@material-ui/icons/SwapHoriz';
import Send from '@material-ui/icons/Send';
import Pool from '@material-ui/icons/Pool';
import Timeline from '@material-ui/icons/Timeline';
import Create from '@material-ui/icons/Create';
// import Add from '@material-ui/icons/Add';
import Settings from '@material-ui/icons/Settings';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


import TradePage from "../converter/pages/TradePage"
import SendPage from "../converter/pages/SendPage"
import RelaysPage from "../converter/pages/RelaysPage"
import PoolPage from "../converter/pages/PoolPage"
// import AddConverter from "../converter/pages/AddConverter"
import CreateConverter from "../converter/pages/CreateConverter/CreateConverter"
import ConverterSettingsPage from "../converter/pages/ConverterSettingsPage/ConverterSettingsPage"


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      <Box p={0}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

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
    backgroundColor : 'rgba(255,255,255,0.1)',
    borderRadius: '4px',
  }
}));

export default function TabsBar() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="secondary" className={classes.app_bg}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs"
        >
          <Tab className={classes.tab_item} label="Trade" icon={<SwapHoriz />} {...a11yProps(0)} />
          <Tab className={classes.tab_item} label="Send" icon={<Send />} {...a11yProps(1)} />
          <Tab className={classes.tab_item} label="Pool" icon={<Pool />} {...a11yProps(2)} />
          <Tab className={classes.tab_item} label="Relays" icon={<Timeline />} {...a11yProps(3)} />
          <Tab className={classes.tab_item} label="Create Converter" icon={<Create />} {...a11yProps(4)} />
          {/*<Tab className={classes.tab_item} label="Add Converter" icon={<Add />} {...a11yProps(5)} />*/}
          <Tab className={classes.tab_item} label="Converter Settings" icon={<Settings />} {...a11yProps(6)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <TradePage/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SendPage/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <PoolPage/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <RelaysPage/>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <CreateConverter/>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <ConverterSettingsPage />
      </TabPanel>
      {/*<TabPanel value={value} index={6}>
        <AddConverter />
      </TabPanel>*/}
    </div>
  );
}
