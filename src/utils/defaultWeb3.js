// in case if user need read data from contract, but not have web3off
import Web3 from "web3"

const provider = new Web3.providers.HttpProvider(process.env.REACT_APP_INFURA)
const defaultWeb3 = new Web3(provider)

export default defaultWeb3
