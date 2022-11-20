function getApiKey(api?: string, chainID?: number) {
  if(api == "opensea" && chainID == 1) return '3e5b9d40eaf64147882619dc07d7d50a'
  if(api == "opensea") return ''
  return "ckey_2b4e40855724423b83d84b656a6" // covalent api key
}

export default getApiKey