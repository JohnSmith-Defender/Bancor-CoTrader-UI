import getWeb3ForRead from './getWeb3ForRead'
import { ABIBancorRegistryMAIN, BancorRegistryMAIN } from '../config'

const getBancorContractByName = async (name) => {
  const web3 = getWeb3ForRead(null)
  const registry = new web3.eth.Contract(ABIBancorRegistryMAIN, BancorRegistryMAIN)
  const nameToBytes32 = web3.utils.fromAscii(name).padEnd(66, '0')
  const address = registry.methods.getAddress(nameToBytes32).call()
  return address
}

export default getBancorContractByName
