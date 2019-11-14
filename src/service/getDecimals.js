// get direction decimals from storage
// param storage tokenInfoFrom, tokenInfoTo object
const getDecimals = (tokenInfoFrom, tokenInfoTo) => {
  let fromDecimals
  let toDecimals

  try{
    fromDecimals = tokenInfoFrom['tokenDecimals']
  }catch(e){
    fromDecimals = 18
  }

  try{
    toDecimals = tokenInfoTo['tokenDecimals']
  }catch(e){
    toDecimals = 18
  }

  return { fromDecimals, toDecimals }
}

export default getDecimals
