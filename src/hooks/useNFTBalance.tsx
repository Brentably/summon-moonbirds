import {useEffect, useState, useCallback} from "react"
import getApiKey from "../helpers/getApiKey"

// i know what you're thinking... you're right, this does not need to be a hook, and I did not need to do it this way. oh well

// needs a wallet address and a function to update state
async function useNFTBalance(setNFTBalance: Function, walletAddress: String, chainID: number) {
  const COVALENT_API_KEY = getApiKey()
  const [data, setData] = useState<Array<any> | null>(null)
  
  if(!chainID) return
    console.log("use NFT Balance is running, the chainID is" + chainID)

    const query = new URLSearchParams({
      "quote-currency": 'USD',
      format: "JSON",
      nft: "true",
      "no-nft-fetch": "false"
    }).toString()
    // console.log(`query is ${query}`)


    if(!data && walletAddress) {

    console.log(`calling https://api.covalenthq.com/v1/${chainID}/address/${walletAddress}/balances_v2/?${query}&key=${COVALENT_API_KEY}`)
    const resp = await fetch(`https://api.covalenthq.com/v1/${chainID}/address/${walletAddress}/balances_v2/?${query}&key=${COVALENT_API_KEY}`, {
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
  setNFTBalance(filteredItems)
  }





// return { updateNFTBalance }
}


export default useNFTBalance