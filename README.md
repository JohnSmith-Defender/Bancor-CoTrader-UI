### Start
```
create .env
REACT_APP_INFURA=YOUR_INFURA_MAINNET_ENDPOINT
REACT_APP_API=COTRADER_API_ENDPOINT

yarn install
yarn start

TODO
1) Update src/service/getPath.js with Bancor path finder contract
Remove trade from converter and work directly with network

2) Remove directly trade from converter

3) Update pool calculation with CoTrader contract
PoolPortal.getBancorConnectorsAmountByRelayAmount()
```
