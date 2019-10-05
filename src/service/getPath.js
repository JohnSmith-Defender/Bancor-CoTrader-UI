// This function create Bancor token path, depense of symbols input

import findByProps from './findByProps'
import {
  BNTToken,
  BancorETH,
  USDBToken,
  USDBBNTToken
} from '../config'

// calculate path depending on the selected symbols and token or smart token
const getPath = (from, to, bancorTokensStorageJson, _fromProp = 'symbol', _toProp = 'symbol', isRelated = false) => {
  const tokenInfoFrom = findByProps(bancorTokensStorageJson, _fromProp, from)[0]
  const tokenInfoTo = findByProps(bancorTokensStorageJson, _toProp, to)[0]
  // detect prop for case if app use smart token
  const fromProp = _fromProp === 'symbol' ? 'tokenAddress' : 'smartTokenAddress'
  const toProp = _toProp === 'symbol' ? 'tokenAddress' : 'smartTokenAddress'

  let path

  switch (from) {
    case 'BNT':
    if(to === "ETH"){
      // BNT, BNT, ETH
      path = [BNTToken, BNTToken, BancorETH]
    }
    else{
      // BNT, TO_ERC20_SmartToken, TO_ERC_OR_SmartToken
      path = [BNTToken, tokenInfoTo.smartTokenAddress, tokenInfoTo[toProp]]
    }
    break

    case 'ETH':
    if(to === "BNT"){
      // ETH, BNT, BNT
      path = [BancorETH, BNTToken, BNTToken]
    }else{
      // form USDB connector
      if (tokenInfoTo.connectorType && tokenInfoTo.connectorType === "USDB"){
        // ETH, USDB, USDB, TO_ERC20_SmartToken, TO_ERC_OR_SmartToken
        path = [BancorETH, USDBToken, USDBBNTToken, tokenInfoTo.smartTokenAddress, tokenInfoTo[toProp]]
      }
      // form BNT connecor
      else{
        // ETH, BNT, BNT, TO_ERC20_SmartToken, TO_ERC_OR_SmartToken
        path = [BancorETH, BNTToken, BNTToken, tokenInfoTo.smartTokenAddress, tokenInfoTo[toProp]]
      }
    }
    break

    default:
    if(to === "BNT"){
      // BNT, FROM_ERC20_SmartToken, TO_ERC_OR_SmartToken
      path = [tokenInfoFrom[fromProp], tokenInfoFrom.smartTokenAddress, BNTToken]
    }
    else if (to === "ETH") {
      // FROM_ERC_OR_SmartToken, FROM_ERC20_SmartToken, BNT, BNT, ETH
      path = [tokenInfoFrom[fromProp], tokenInfoFrom.smartTokenAddress, BNTToken, BNTToken, BancorETH]
    }
      // form USDB case
    else if (tokenInfoFrom.connectorType && tokenInfoFrom.connectorType === "USDB"){
      // example: cot, usdbcot, usdb, bntusdb, bnt, bntomg, omg
      path = [tokenInfoFrom[fromProp], tokenInfoFrom.smartTokenAddress, USDBToken, USDBBNTToken, BNTToken, tokenInfoTo.smartTokenAddress, tokenInfoTo[toProp]]
    }
      // to USDB case
    else if (tokenInfoTo.connectorType && tokenInfoTo.connectorType === "USDB"){
      // example: OMG, OMGBNT, BNT, USDBBNT, USDB, COTUSDB, COT
      path = [tokenInfoFrom[fromProp], tokenInfoFrom.smartTokenAddress, BNTToken, USDBBNTToken, USDBToken, tokenInfoTo.smartTokenAddress, tokenInfoTo[toProp]]
    }
    else{
      if(isRelated){
        // ERC20 (or SmartToken) FROM_ERC20_SmartToken ERC20(or SmartToken)
        path = [tokenInfoFrom[fromProp], tokenInfoFrom.smartTokenAddress, tokenInfoTo[toProp]]
      }else{
        // FROM_ERC20, FROM_ERC20_SmartToken, BNT, TO_ERC20_SmartToken, TO_ERC20
        path = [tokenInfoFrom[fromProp], tokenInfoFrom.smartTokenAddress, BNTToken, tokenInfoTo.smartTokenAddress, tokenInfoTo[toProp]]
      }
    }
  }

  return path
}

export default getPath
