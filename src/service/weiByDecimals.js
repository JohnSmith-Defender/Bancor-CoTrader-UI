// get token decimals, then calculate wei by decimals
// for USDT and another no standsrd tokens with decimals !== 18
// like 2 or 8 which no support in web3.utils

import { ABISmartToken } from '../config'
import BigNumber from 'bignumber.js'
import { toWei, fromWei } from 'web3-utils'


// params address - token address, amount - token amount, web3
export const toWeiByDecimals = async (address, amount, web3) => {
  try{
    const token = new web3.eth.Contract(ABISmartToken, address)
    const decimals = await token.methods.decimals().call()
    const factor = 10 ** decimals
    amount = new BigNumber(amount)
    amount = amount.multipliedBy(factor)
    return amount.toString()
  }catch(e){
    return toWei(amount)
  }
}

export const fromWeiByDecimals = async (address, amount, web3) => {
  try{
    const token = new web3.eth.Contract(ABISmartToken, address)
    const decimals = await token.methods.decimals().call()
    const factor = 10 ** decimals
    amount = new BigNumber(amount)
    amount = amount.dividedBy(factor)
    return amount.toString()
  }catch(e){
    return fromWei(amount)
  }
}
