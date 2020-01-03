import officialTokens from '../storage/officialTokens'

// return oficial symbols, official smart tokens symbols and oficial token storage
const getOfficialSymbols = () => {
  const official = officialTokens
  let officialSymbols = official.map((item) => item.symbol)
  // Add ETH
  officialSymbols = officialSymbols.concat("ETH")

  const officialSmartTokenSymbols = official.map((item) => item.smartTokenSymbol)
  return [officialSymbols, officialSmartTokenSymbols, official]
}

export default getOfficialSymbols
