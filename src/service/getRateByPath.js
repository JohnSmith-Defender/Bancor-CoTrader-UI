import getWeb3ForRead from './getWeb3ForRead'
import { fromWeiByDecimals } from './weiByDecimals'
import getBancorContractByName from '../service/getBancorContractByName'

import {
  ABIBancorNetwork,
} from '../config'


// params path - array addresses, amount - number, web3 (if null, app provide web3 by default)
// return rate and commision

const getRateByPath = async (path, amountSend, _web3) => {
  const web3 = getWeb3ForRead(_web3)
  const BancorNetwork = await getBancorContractByName("BancorNetwork")
  const bancorNetworkContract = new web3.eth.Contract(ABIBancorNetwork, BancorNetwork)
  let fee = 0

  let amountReturn = await bancorNetworkContract.methods.getReturnByPath(
  path,
  amountSend
  ).call()

  if(amountReturn){
  fee = await fromWeiByDecimals(path[path.length - 1], amountReturn[1], web3)
  amountReturn = await fromWeiByDecimals(path[path.length - 1], amountReturn[0], web3)
  }else{
  amountReturn = 0
  }

  return { amountReturn, fee }
}

export default getRateByPath
