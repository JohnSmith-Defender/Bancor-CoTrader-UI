import officialTokens from '../storage/officialTokens'
import CoTraderVerified from '../storage/CoTraderVerified'

// return oficial symbols, official smart tokens symbols and oficial token storage
const getOfficialSymbols = () => {
  // add CoTrader verified to official list
  const official = officialTokens.concat(CoTraderVerified)

  let officialSymbols = official.map((item) => item.symbol)

  // Add ETH
  officialSymbols = officialSymbols.concat("ETH")

  const officialSmartTokenSymbols = official.map((item) => item.smartTokenSymbol)
  return [officialSymbols, officialSmartTokenSymbols, official]
}

export default getOfficialSymbols
