// use react hooks
// Smart component for load data
import React, { useState, useLayoutEffect } from 'react'
import { inject, observer } from 'mobx-react'
import StablePoolPage from './StablePoolPage'
import axios from 'axios'

const endPoint = 'https://bancor-analytics-api.herokuapp.com/api/v1/'

function StablePool(props) {
  const [data, setData] = useState(null)
  // stable DAI, USDB, USDT
  const stableSymbols = ["daiusdb", "usdtusdb"]

  useLayoutEffect(() => {
    let isCancelled = false
    async function fetchData(){
     let result = {}
     try{
       let roi
       let info
       let tokenObj
       for(let i=0; i<stableSymbols.length; i++){
         roi = await axios(
           `${endPoint}roi/${stableSymbols[i]}`,
         )
         info = await axios(
           `${endPoint}info/${stableSymbols[i]}`,
         )
         tokenObj = { ...roi.data, ...info.data }
         //res.push({ token: {[stableSymbols[i]]:result.data} })
         result[[stableSymbols[i]]] = tokenObj
       }
     }
     catch(e){
       result = { data:null }
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
