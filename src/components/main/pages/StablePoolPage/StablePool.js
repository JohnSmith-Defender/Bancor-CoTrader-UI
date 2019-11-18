// use react hooks
// Smart component for load data
import React, { useState, useLayoutEffect } from 'react'
import { inject, observer } from 'mobx-react'
import StablePoolPage from './StablePoolPage'
import findByProps from '../../../../service/findByProps'
import axios from 'axios'

const endPoint = 'https://bancor-analytics-api.herokuapp.com/api/v1/'

function StablePool(props) {
  const [data, setData] = useState(null)
  const stableSymbols = ["daiusdb", "usdtusdb"]

  useLayoutEffect(() => {
    let isCancelled = false
    async function fetchData(){
     let result = {}
     try{
       let symbol
       let roi
       let info
       let tokenInfo
       let tokenObj
       for(let i=0; i<stableSymbols.length; i++){
         symbol = stableSymbols[i]
         // get data from api
         roi = await axios(
           `${endPoint}roi/${symbol}`,
         )
         info = await axios(
           `${endPoint}info/${symbol}`,
         )
         // get additional data about token from global storage
         tokenInfo = findByProps(props.MobXStorage.bancorTokensStorageJson, "smartTokenSymbol", symbol.toUpperCase())

         // create objectWith data and pass to props
         tokenObj = { ...roi.data, ...info.data, tokenInfo }
         result[symbol] = tokenObj
       }
     }
     catch(e){
       result = { data:null }
       console.log('Cant get data in Stable Pool component')
     }
      if(!isCancelled)
      setData(result)
    }
    if(!data)
    fetchData()
    return () => {
      isCancelled = true;
    }
  })

  return(
    <StablePoolPage stableSymbols={stableSymbols} data={data} MobXStorage={props.MobXStorage}/>
  )
}

export default inject('MobXStorage')(observer(StablePool))
