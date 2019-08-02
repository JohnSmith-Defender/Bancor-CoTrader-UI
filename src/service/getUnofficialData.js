// Get all unofficial converters, then parse unofficial connectors and unofficial smart tokens, and symbols
// return unofficialSymbols, unofficialSmartTokenSymbols, bancorTokensStorageJson, 

import {
  ABISmartToken,
  ConvertersRegistryListABI,
  ConvertersRegistryList,
  ABIConverter
} from '../config'

import getWeb3ForRead from './getWeb3ForRead'

const getUnofficialData = async (_web3) => {
   const web3 = getWeb3ForRead(_web3)

   const registry = web3.eth.Contract(ConvertersRegistryListABI, ConvertersRegistryList)
   let total = await registry.methods.totalConverters().call()

   if(total){
     total = web3.utils.hexToNumberString(total._hex)
     let unofficialSymbols = []
     let unofficialSmartTokenSymbols = []

     // concat oficial info with unoficial in storage
     let bancorTokensStorageJson = []
     const unofficialConverters = await registry.methods.getAllConverters().call()

     for(let i = 0; i < unofficialConverters.length; i++){
       let converter = web3.eth.Contract(ABIConverter, unofficialConverters[i])
       let tokenAddress = await converter.methods.connectorTokens(1).call()
       let token = web3.eth.Contract(ABISmartToken, tokenAddress)
       let symbol = await token.methods.symbol.call()
       let smartTokenAddress = await converter.methods.token().call()
       let smartToken = web3.eth.Contract(ABISmartToken, smartTokenAddress)
       let smartTokenSymbol = await smartToken.methods.symbol.call()

       let relayObj = {
         tokenAddress, symbol,
         converterAddress:unofficialConverters[i],
         smartTokenAddress,
         smartTokenSymbol
       }

       bancorTokensStorageJson.push(relayObj)
       unofficialSymbols.push(symbol)
       unofficialSmartTokenSymbols.push(smartTokenSymbol)
     }

     return [unofficialSymbols, unofficialSmartTokenSymbols, bancorTokensStorageJson]
   }
 }

 export default getUnofficialData
