import officialTokens from '../storage/officialTokens'

// return oficial symbols, official smart tokens symbols and oficial token storage
const getOfficialSymbols = () => {
  let officialSymbols = officialTokens.map((item) => item.symbol)
  
  // Add ETH
  officialSymbols = officialSymbols.concat("ETH")

  const officialSmartTokenSymbols = officialTokens.map((item) => item.smartTokenSymbol)
  return [officialSymbols, officialSmartTokenSymbols, officialTokens]
}

export default getOfficialSymbols
