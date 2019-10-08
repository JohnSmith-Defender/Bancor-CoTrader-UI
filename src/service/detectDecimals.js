import { ABISmartToken } from '../config'

// for USDT and another no standsrd tokens with decimals !== 18
// return convert unit type
// 'ether' by default

const detectDecimals = async (address, web3) => {
  const token = new web3.eth.Contract(ABISmartToken, address)
  const decimals = await token.methods.decimals().call()
  let type

  switch (decimals) {
    case 0:
    type = 'noether'
    break

    case 1:
    type = 'wei'
    break

    case 3:
    type = 'Kwei'
    break

    case 6:
    type = 'Mwei'
    break

    case 9:
    type = 'gwei'
    break

    case 10:
    type = 'Gwei'
    break

    case 12:
    type = 'micro'
    break

    case 15:
    type = 'milli'
    break

    case 21:
    type = 'kether'
    break

    case 27:
    type = 'gether'
    break

    case 30:
    type = 'tether'
    break

    default:
    type ='ether'
    break
  }

  return type
}

export default detectDecimals
