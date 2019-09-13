// Parse bancor oblect by props (token or smartToken)
const findByProps = (obj, props, value) => {
  return obj.filter(item => {
    if(item[props] === value){
      return item
    }
    else{
      return null
    }
  })
}

export default findByProps
