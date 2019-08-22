import { observable, action, decorate } from 'mobx'

class MOBXStorage {
  web3 = null
  accounts = null
  pending = window.localStorage.getItem('Pending')
  step = "One"
  officialSymbols = null
  unofficialSymbols = null
  officialSmartTokenSymbols = null
  unofficialSmartTokenSymbols = null
  bancorTokensStorageJson = null


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

  setPending = (_bool) => {
    this.pending = _bool
    window.localStorage.setItem('Pending', _bool)
  }

  timer
  checkTxStatus = async (hash) => {
    const res = await this.web3.eth.getTransaction(hash)
    console.log("checkTxStatus", res.blockNumber)
    console.log("timer", this.timer);
    if(res.blockNumber){
      this.txFinish()
      clearTimeout(this.timer)
      return
    }else{
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

    checkTxStatus:action,
    initWeb3AndAccounts:action,
    setPending:action,
    updateStep:action,
    txFinish:action,
    initOfficialSymbols:action,
    initUnofficialSymbols:action,
    initBancorStorage:action,
    initOfficialSmartTokenSymbols:action,
    initUnofficialSmartTokenSymbols:action
})

const MobXStorage = new MOBXStorage()

export default MobXStorage
