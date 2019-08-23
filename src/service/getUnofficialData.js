// Get all unofficial converters, then parse unofficial connectors and unofficial smart tokens, and symbols
// return unofficialSymbols, unofficialSmartTokenSymbols, bancorTokensStorageJson,

import {
  ABISmartToken,
  ConvertersRegistryListABI,
  ConvertersRegistryList,
  ABIConverter
} from '../config'

import getWeb3ForRead from './getWeb3ForRead'
import blackList from '../storage/blackList'


const getUnofficialData = async (_web3) => {
   const web3 = getWeb3ForRead(_web3)

   const registry = new web3.eth.Contract(ConvertersRegistryListABI, ConvertersRegistryList)
   let total = await registry.methods.totalConverters().call()

   if(total){
     total = web3.utils.hexToNumberString(total._hex)
     let unofficialSymbols = []
     let unofficialSmartTokenSymbols = []
     let bancorTokensStorageJson = []
     let unofficialConverters = await registry.methods.getAllConverters().call()

     // remove black list
     unofficialConverters = unofficialConverters.filter(function(item) {
     return !blackList.includes(item);
     })

     let converter
     let tokenAddress
     let token
     let symbol
     let smartTokenAddress
     let smartToken
     let smartTokenSymbol
     let owner
     let relayObj

     for(let i = 0; i < unofficialConverters.length; i++){
       // load data expect black list
       converter = new web3.eth.Contract(ABIConverter, unofficialConverters[i])
       tokenAddress = await converter.methods.connectorTokens(1).call()
       token = new web3.eth.Contract(ABISmartToken, tokenAddress)
       symbol = await token.methods.symbol.call()
       smartTokenAddress = await converter.methods.token().call()
       smartToken = new web3.eth.Contract(ABISmartToken, smartTokenAddress)
       smartTokenSymbol = await smartToken.methods.symbol.call()
       owner = await converter.methods.owner().call()

       relayObj = {
         tokenAddress, symbol,
         converterAddress:unofficialConverters[i],
         smartTokenAddress,
         smartTokenSymbol,
         owner
         }

        bancorTokensStorageJson.push(relayObj)
        unofficialSymbols.push(symbol)
        unofficialSmartTokenSymbols.push(smartTokenSymbol)
     }

     return [unofficialSymbols, unofficialSmartTokenSymbols, bancorTokensStorageJson]
   }
 }

 export default getUnofficialData
