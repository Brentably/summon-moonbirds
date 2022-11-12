import {useEffect, useState} from "react"

// needs a wallet address and a function to update state
async function useNFTBalance(walletAddress: String, setNFTBalance: Function) {
  const COVALENT_API_KEY="ckey_2b4e40855724423b83d84b656a6"
  const [data, setData] = useState<Array<any> | null>(null)

  const query = new URLSearchParams({
    "quote-currency": 'USD',
    format: "JSON",
    nft: "true",
    "no-nft-fetch": "false"
  }).toString()
  // console.log(`query is ${query}`)
  const getData = async () => {
  if(!data && walletAddress) {

    console.log(`fetching`)
  const resp = await fetch(`https://api.covalenthq.com/v1/5/address/${walletAddress}/balances_v2/?${query}&key=${COVALENT_API_KEY}`, {
    method: 'GET',
    headers: {
      Accept: "application/json"
    },
  })
  if (!resp.ok) console.log('ERROR' + resp.status)
  const data = await resp.json()

  //filtering balance data for NFT data
  const items:Array<any> = await data.data.items
  const filteredItems = await items.filter((item:any) => item.type == "nft")
  // filter((item:any) => item.type == "nft")
  setData(filteredItems)
  console.log(filteredItems)
  }
}

useEffect(()=> {getData()}, [walletAddress])

setNFTBalance(await data)
return data

}


export default useNFTBalance