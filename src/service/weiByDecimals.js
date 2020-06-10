// get token decimals, then calculate wei by decimals
// for USDT and another no standsrd tokens with decimals !== 18
// like 2 or 8 which no support in web3.utils

import { ABISmartToken, ETHAddress } from '../config'
import BigNumber from 'bignumber.js'
import { toWei, fromWei } from 'web3-utils'


// params address - token address, amount - token amount, web3
export const toWeiByDecimals = async (address, amount, web3) => {
  amount = String(amount)
  try{
    // get decimals by address
    let decimals
    if(address === ETHAddress){
      decimals = 18
    }else{
      const token = new web3.eth.Contract(ABISmartToken, address)
      decimals = await token.methods.decimals().call()
    }

    // calculate
    const factor = 10 ** decimals
    amount = new BigNumber(amount)
    amount = amount.multipliedBy(factor)
    return new BigNumber(amount).toString()
  }catch(e){
    return toWei(amount)
  }
}

export const fromWeiByDecimals = async (address, amount, web3) => {
  amount = String(amount)
  try{
    // get decimals by address
    let decimals
    if(address === ETHAddress){
      decimals = 18
    }else{
      const token = new web3.eth.Contract(ABISmartToken, address)
      decimals = await token.methods.decimals().call()
    }

    // calculate 
    const factor = 10 ** decimals
    amount = new BigNumber(amount)
    amount = amount.dividedBy(factor)
    return new BigNumber(amount).toString()
  }catch(e){
    return fromWei(amount)
  }
}

// THIS NOT TESTED
// THIS FOR CASE WHEN WE KNOWN DECIMALS AMOUNT
// AND NO NEED SEND REUEST FOR GET THIS AMOUNT
 export const toWeiByDecimalsInput = (decimals, amount) => {
   amount = String(amount)
    try{
      const factor = 10 ** decimals
      amount = new BigNumber(amount)
      amount = amount.multipliedBy(factor)
      return new BigNumber(amount).toString()
    }catch(e){
      return toWei(amount)
    }
 }

 export const fromWeiByDecimalsInput = (decimals, amount) => {
   amount = String(amount)
    try{
      const factor = 10 ** decimals
      amount = new BigNumber(amount)
      amount = amount.dividedBy(factor)
      return new BigNumber(amount).toString()
    }catch(e){
      return fromWei(amount)
 }
}
