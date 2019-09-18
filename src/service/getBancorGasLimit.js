import { ABIBancorGasPriceLimit, BancorGasLimit, netId } from '../config'
import getWeb3ForRead from './getWeb3ForRead'
import { hexToNumberString } from 'web3-utils'

const getBancorGasLimit = async () => {
  if(netId === 1){
    const web3 = getWeb3ForRead(null)
    const contract = new web3.eth.Contract(ABIBancorGasPriceLimit, BancorGasLimit)
    let res = await contract.methods.gasPrice().call()
    res = hexToNumberString(res._hex)
    return res
  }else{
    //for Ropsten
    return "1000000000"
  }
}

export default getBancorGasLimit
