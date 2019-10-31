import React from 'react'
import PoolModal from '../modals/PoolModal/PoolModal'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { ArrowRight } from '@material-ui/icons'
import pageStyles from '../../../css/pageStyles'

const useStyles = pageStyles

function PoolPage() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}><ArrowRight className={classes.icon} /></span>;
  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} gutterBottom>
            Bancor liquidity pools
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
            {bull} To earn from all trades, add liquidity to pools.
          </Typography>
          <Typography variant="body1" className={'mb-2'} component="p">
            {bull} When you do this, you'll receive “relay tokens”.
          </Typography>
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
          <Typography className={classes.modal} component="div">
            <PoolModal/>
          </Typography>
        </CardContent>
      </Card>
    </React.Fragment>
  )
}
export default PoolPage
