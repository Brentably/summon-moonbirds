import getApiKey from "./getApiKey"


// calls the covalent api, returning the NFTs @ an address and their metadata
// needs to handle the NFT's in your wallet, AND the summon contract NFT's
// start with the NFT's in your wallet: switch to OpenSeaApi
async function getNFTBalance(address: string, chainID: number) {
  if(!chainID || !address) return
  const OPENSEA_KEY = getApiKey("opensea", chainID)

  
  
  
  
  


    console.log(`use NFT Balance is running. chainID: ${chainID} address: ${address}`)

    const query = new URLSearchParams({
      owner: address,
      limit: "30"
    }).toString()
    console.log(`query is ${query}`)



    const endpoint = chainID == 5 ? `https://testnets-api.opensea.io/api/v1/assets?${query}` : `https://api.opensea.io/api/v1/assets?${query}`
    console.log(`calling ${endpoint}`)

    const resp = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: "application/json",
      'X-API-KEY': OPENSEA_KEY
    },
    })
    if (!resp.ok) console.log('ERROR' + resp.status)

    const data = await resp.json()

    const assets = data.assets
    const next = data.next // next endpoint 



  return assets
}


export default getNFTBalance