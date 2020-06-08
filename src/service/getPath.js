// This function create Bancor token path, depense of symbols input

import { ABIBancorNetwork, ETHAddress } from '../config'
import findByProps from './findByProps'
import getBancorContractByName from './getBancorContractByName'
import getWeb3ForRead from './getWeb3ForRead'


const getPath = async (from, to, bancorTokensStorageJson, _web3=null, _fromProp = 'symbol', _toProp = 'symbol', isRelated = false) => {
  // find addresses by symbols
  const tokenInfoFrom = findByProps(bancorTokensStorageJson, _fromProp, from)[0]
  const tokenInfoTo = findByProps(bancorTokensStorageJson, _toProp, to)[0]

  const fromProp = _fromProp === 'symbol' ? 'tokenAddress' : 'smartTokenAddress'
  const toProp = _toProp === 'symbol' ? 'tokenAddress' : 'smartTokenAddress'

  const fromAddress = from === 'ETH' ? ETHAddress : tokenInfoFrom[fromProp]
  const toAddress = to === 'ETH' ? ETHAddress : tokenInfoTo[toProp]


  const web3 = _web3 ? _web3 : getWeb3ForRead(null)
  const BancorNetworkAddress = await getBancorContractByName('BancorNetwork')

  const BancorNetwork = new web3.eth.Contract(ABIBancorNetwork, BancorNetworkAddress)

  const path = await BancorNetwork.methods.conversionPath(fromAddress, toAddress).call()

  return path
}

export default getPath
