import { observable, action, decorate } from 'mobx'
import { gasPrice } from './config'

class MOBXStorage {
  web3 = null
  accounts = null
  pending = JSON.parse(window.localStorage.getItem('Pending'))
  step = "One"
  officialSymbols = null
  unofficialSymbols = null
  officialSmartTokenSymbols = null
  unofficialSmartTokenSymbols = null
  bancorTokensStorageJson = null
  timer = 0
  GasPrice = gasPrice
  minReturn = "1"

  changeMinReturn = (_minReturn) => {
    const min = Math.round(parseFloat(_minReturn))
    if(min > 0){
      this.minReturn = String(min)
    }else{
      this.minReturn = "1"
    }
  }

  initWeb3AndAccounts = (_web3, accounts) => {
    this.web3 = _web3
    this.accounts = accounts
  }

  updateStep = () => {
    const _step = window.localStorage.getItem('Step')
    if(_step === null || _step === "undefined"){
      this.step = "One"
    }else{
      this.step = _step
    }
  }

  updateGasPrice = (newGasPrice) => {
    this.GasPrice = newGasPrice
  }

  setPending = (_bool) => {
    this.pending = _bool
    window.localStorage.setItem('Pending', _bool)
  }


  checkTxStatus = async (hash) => {
    const res = await this.web3.eth.getTransaction(hash)
    const status = res ? res.blockNumber : null
    if(status){
      console.log("txFinish")
      this.txFinish()
      clearTimeout(this.timer)
    }else{
      console.log("Set new timeout for check tx")
      this.timer = setTimeout(() => this.checkTxStatus(hash), 5000)
    }
  }

  txFinish = () => {
    this.pending = false
    const nextStep = window.localStorage.getItem('StepNext')
    window.localStorage.setItem('Step', nextStep)
    window.localStorage.setItem('Pending', false)
    this.updateStep()
  }

  initBancorStorage = (official, unoficial) => {
    this.bancorTokensStorageJson = official.concat(unoficial)
  }

  initOfficialSymbols = (data) => {
    this.officialSymbols = data
  }

  initUnofficialSymbols = (data) => {
    this.unofficialSymbols = data
  }

  initOfficialSmartTokenSymbols = (data) => {
    this.officialSmartTokenSymbols = data
  }

  initUnofficialSmartTokenSymbols = (data) => {
    this.unofficialSmartTokenSymbols = data
  }

}

decorate(MOBXStorage, {
    web3: observable,
    accounts: observable,
    pending: observable,
    step: observable,
    officialSymbols:observable,
    unofficialSymbols:observable,
    officialSmartTokenSymbols:observable,
    unofficialSmartTokenSymbols:observable,
    bancorTokensStorageJson:observable,
    GasPrice:observable,
    minReturn:observable,

    changeMinReturn:action,
    checkTxStatus:action,
    initWeb3AndAccounts:action,
    setPending:action,
    updateStep:action,
    txFinish:action,
    initOfficialSymbols:action,
    initUnofficialSymbols:action,
    initBancorStorage:action,
    initOfficialSmartTokenSymbols:action,
    initUnofficialSmartTokenSymbols:action,
    updateGasPrice:action
})

const MobXStorage = new MOBXStorage()

export default MobXStorage
