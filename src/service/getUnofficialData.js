// Get all unofficial converters, then parse unofficial connectors and unofficial smart tokens, and symbols
// return unofficialSymbols, unofficialSmartTokenSymbols, bancorTokensStorageJson,

import {
  ABISmartToken,
  ConvertersRegistryListABI,
  ConvertersRegistryList,
  ABIConverter,
  ERC20Bytes32ABI
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
     let token
     let symbol
     let smartToken
     let smartTokenSymbol
     let owner
     let relayObj

     for(let i = 0; i < unofficialConverters.length; i++){
       // load data expect black list
       converter = new web3.eth.Contract(ABIConverter, unofficialConverters[i])
       const tokenAddress = await converter.methods.connectorTokens(1).call()


       // parse connector symbol
       try{
         token = new web3.eth.Contract(ABISmartToken, tokenAddress)
         symbol = await token.methods.symbol().call()
       }catch(err){
          // No Standard (return bytes32)
          token = new web3.eth.Contract(ERC20Bytes32ABI, tokenAddress)
          symbol = web3.utils.toUtf8(await token.methods.symbol().call())
       }

       const smartTokenAddress = await converter.methods.token().call()

       if(smartTokenAddress){
         smartToken = new web3.eth.Contract(ABISmartToken, smartTokenAddress)
         smartTokenSymbol = await smartToken.methods.symbol().call()
       }

       owner = await converter.methods.owner().call()

       if(tokenAddress && smartTokenAddress){
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
     }

     return [unofficialSymbols, unofficialSmartTokenSymbols, bancorTokensStorageJson]
   }
 }

 export default getUnofficialData
