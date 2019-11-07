// Stupid component for render data

import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { ArrowRight } from '@material-ui/icons'
import pageStyles from '../../../../css/pageStyles'
import UserInfo from '../../../templates/UserInfo'
import { Col, Row } from "react-bootstrap"
import PoolChart from './PoolChart'

const useStyles = pageStyles

function StablePoolPage(props) {
  if(props.data)
  console.log("props.data.token_price_in_base_token",props.data.token_price_in_base_token)
  const classes = useStyles()
  const bull = <span className={classes.bullet}><ArrowRight className={classes.icon} /></span>
  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} gutterBottom>
            Stable Pool ROI
          </Typography>
          {
            props.stableSymbols && props.data
            ?
            (
              <React.Fragment>
              {props.stableSymbols.map((symbol, key) =>
                <Row key={key} style={{backgroundColor:"whitesmoke"}}>
                <Col><strong style={{color:"mediumslateblue"}}>{symbol.toUpperCase()}</strong></Col>
                <Col>price: <span style={{color:"mediumslateblue"}}>{props.data[symbol].token_price_in_base_token}</span></Col>
                <Col><PoolChart label="Volume" data={props.data[symbol]} property="token_price_in_base_token"/></Col>
                <Col><PoolChart label="ROI" data={props.data[symbol]} property="token_price_in_usd"/></Col>
                </Row>
              )
              }
              </React.Fragment>
            )
            :
            (<p>Loading data ...</p>)
          }
          <br/>
          <Typography variant="body1" className={'mb-2'} component="p">
            {bull} Liquidity pools in AMM DEXs (<UserInfo label="?" info={ <span> Bancor is an AMM DEX, which means you can always buy or sell tokens A to B from Bancor smart contracts at the price of the B/A ratio in the “relay token” reserves (ignoring slippage) <a href="https://medium.com/@cotrader.com/bancor-amm-dex-formula-calculation-example-9dbc00ca3a5e" target="_blank" rel="noopener noreferrer">learn more</a> </span>} /> replace buy and sell orders in legacy exchanges.

          </Typography>

          <Typography variant="body1" className={'mb-2'} component="p">
            {bull} The larger the pool, the less slippage there is in trading.
          </Typography>

          <Typography variant="body1" className={'mb-2'} component="p">
            {bull} The smaller the pool, the higher the earnings per value traded (<UserInfo label="?" info="ROI per Trade per Liquidity Depth (LD): The higher your share (holding %) of the pool’s relay tokens, the larger your earnings-per-trade of the token. This explains what the ROI per Trade *would be* for the given LD now."/>)
          </Typography>

          <Typography variant="body1" className={'mb-2'} component="p">
            {bull} ROI maximizing: the less volatile a token is, the lower the “impermanent loss”, and the higher the ROI from entering trading pools, all else being equal  (<UserInfo label="?" info="To learn more about impermanent loss and its effect on pool ROI," />)
          </Typography>

          <Typography variant="body1" className={'mb-2'} component="p">
            {bull} Pools of stable tokens traded against other stable tokens are thus potentially very lucrative, because there will be near 0 volatility, meaning low impermanent loss and high returns.
          </Typography>

        </CardContent>
      </Card>
    </React.Fragment>
  )
}

export default StablePoolPage
