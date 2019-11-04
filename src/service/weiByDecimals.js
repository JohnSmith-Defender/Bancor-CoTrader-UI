// get token decimals, then calculate wei by decimals
// for USDT and another no standard tokens with decimals !== 18
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
    return String(amount.toFixed())
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
    return String(amount.toFixed())
  }catch(e){
    return fromWei(amount)
  }
}

// THIS NOT TESTED
// THIS FOR CASE WHEN WE KNOWN DECIMALS AMOUNT
// AND NO NEED SEND REUEST FOR GET THIS AMOUNT
 export const toWeiByDecimalsInput = (decimals, amount) => {
   // NOTE: Remember about try, catch, test should be without try catch
   const factor = 10 ** decimals
   amount = new BigNumber(amount)
   amount = amount.multipliedBy(factor)
   return String(amount.toFixed())
    // try{
    //   const factor = 10 ** decimals
    //   amount = new BigNumber(amount)
    //   amount = amount.multipliedBy(factor)
    //   return String(amount.toFixed())
    // }catch(e){
    //   return toWei(amount)
    // }
 }

 export const fromWeiByDecimalsInput = (decimals, amount) => {
    try{
      const factor = 10 ** decimals
      amount = new BigNumber(amount)
      amount = amount.dividedBy(factor)
      return String(amount.toFixed())
    }catch(e){
      return fromWei(amount)
 }
}
