// Parse bancor oblect by props (token or smartToken)
const findByProps = (obj, props, symbol) => {
  return obj.filter(token => {
    if(token[props] === symbol){
      return token
    }
    else{
      return null
    }
  })
}

export default findByProps
