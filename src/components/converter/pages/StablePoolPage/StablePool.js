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
     let res = {}
     try{
       let result
       for(let i=0; i<stableSymbols.length; i++){
         result = await axios(
           `${endPoint}roi/${stableSymbols[i]}`,
         )
         //res.push({ token: {[stableSymbols[i]]:result.data} })
         res[[stableSymbols[i]]] = result.data
       }
     }
     catch(e){
       res = { data:null }
     }
      if(!isCancelled)
      setData(res)
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
