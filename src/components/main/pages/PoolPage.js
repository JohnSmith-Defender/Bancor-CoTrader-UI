import React from 'react'
import PoolForm from '../forms/PoolForm/PoolForm'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { ArrowRight } from '@material-ui/icons'
import pageStyles from '../../../css/pageStyles'
import TabBar from '../../static/TabBar'
//import { isMobile } from 'react-device-detect'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = pageStyles

function PoolPage(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}><ArrowRight className={classes.icon} /></span>;
  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardContent maxwidth="md">
          <Typography className={classes.modal} component="div">
            <TabBar location={props.location.pathname}/>
          </Typography>
          <Typography className={classes.title} gutterBottom>
            Bancor liquidity pools
          </Typography>












          <Typography className={classes.modal} component="div">
            <PoolForm/>
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
            {bull} To earn from all trades, add liquidity to pools.
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
            {bull} When you do this, you'll receive “relay tokens”.
          </Typography>




          <ExpansionPanel className={classes.readmore}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="read-more"
              className={classes.readmorebtn}
              color="primary"
            >
            <Typography className={classes.heading} component="span">Read More</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.readmorecontent}>
            <Typography variant="body1" className={'mb-2'} component="p">
              {bull} For example, to earn from every trade of DAI, you can deposit both:
            </Typography>
            <Typography variant="body1" className={'mb-2'} component="p">
              {bull} BNT and DAI.
            </Typography>
            <Typography variant="body1" className={'mb-2'} component="p">
              {bull} You'll receive a relay token called DAIBNT for the DAI pool.
            </Typography>
            <Typography variant="body1" className={'mb-2'} component="p">
              {bull} To get the deposit back, just return the DAIBNT.
            </Typography>
            <Typography variant="body1" className={'mb-2'} component="p">
              {bull} When DAI is traded, a % of the conversion buys DAIBNT relay tokens.  This increases the price of DAIBNT.
            </Typography>
            <Typography variant="body1" className={'mb-2'} component="p">
              {bull} Relay tokens like DAIBNT are also speculative assets. They can be bought and sold separately in the "Relays" tab without depositing in pools. However, that incurs slippage.
            </Typography>
            <Typography variant="body1" className={'mb-2'} component="p">
              {bull} More updates coming soon.
            </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>



        </CardContent>
      </Card>
    </React.Fragment>
  )
}
export default PoolPage
