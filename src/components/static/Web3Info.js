import React from 'react'
import { Alert } from 'react-bootstrap'


function Web3Info(props) {
  return (
   <React.Fragment>
   {
     props.isDataLoad && !props.web3
     ?
     (
      <Alert variant="warning">To actually make trades, you'll need to use <strong>Metamask</strong> for <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">web</a> or <a href="https://play.google.com/store/apps/details?id=io.metamask" target="_blank" rel="noopener noreferrer">Android</a>  or <strong>TrustWallet</strong> for <a href="https://apps.apple.com/us/app/trust-ethereum-wallet/id1288339409" target="_blank" rel="noopener noreferrer">IPhone</a> or <a href="https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp" target="_blank" rel="noopener noreferrer">Android</a> </Alert>
     )
     :
     (null)
   }
   </React.Fragment>
  )
}

export default Web3Info
