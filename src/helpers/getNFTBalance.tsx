import getApiKey from "./getApiKey"


// needs a wallet address and a function to update state
async function getNFTBalance(address: string, chainID: number) {
  const COVALENT_API_KEY = getApiKey()

  
  if(!chainID || !address) return
    console.log("use NFT Balance is running, the chainID is: " + chainID)
    console.log("use NFT Balance is running, the address is: " + address)

    const query = new URLSearchParams({
      "quote-currency": 'USD',
      format: "JSON",
      nft: "true",
      "no-nft-fetch": "false"
    }).toString()
    // console.log(`query is ${query}`)




    console.log(`calling https://api.covalenthq.com/v1/${chainID}/address/${address}/balances_v2/?${query}&key=${COVALENT_API_KEY}`)
    const resp = await fetch(`https://api.covalenthq.com/v1/${chainID}/address/${address}/balances_v2/?${query}&key=${COVALENT_API_KEY}`, {
    method: 'GET',
    headers: {
      Accept: "application/json"
    },
    })

  if (!resp.ok) console.log('ERROR' + resp.status)
  const data = await resp.json()
  console.log(data)

  //filtering balance data for NFT data
  const items:Array<any> = await data.data.items
  const filteredItems = await items.filter((item:any) => item.type == "nft")
  // filter((item:any) => item.type == "nft")

  console.log(filteredItems)







return filteredItems
}


export default getNFTBalance