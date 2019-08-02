import defaultWeb3 from '../utils/defaultWeb3'


// For case if client not have web3 but he need read data from contract
// Check curent web3
const getWeb3ForRead = (userWeb3) => {
  if(userWeb3){
    return userWeb3
  }else{
    return defaultWeb3
  }
}

export default getWeb3ForRead
