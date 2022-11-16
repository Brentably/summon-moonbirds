import {ethers} from 'ethers'

import getApiKey from './getApiKey'

const factoryAddress = "0x4C8D779e3D4dAEC47369408aE4D8F7aA85FF1023" // this is for GOERLI


//we can do this by searching for safe creation calls to the safeProxyFactoryAddress by the walletAddress
async function getSummonSafe(walletAddress:string, chainID:number) {
  const COVALENT_API_KEY = getApiKey()
  console.log("BRRRR getting summon safe")






  const resp = await fetch(`https://api.covalenthq.com/v1/${chainID}/address/${walletAddress}/transactions_v2/?&key=${COVALENT_API_KEY}`, {
  method: 'GET',
  headers: {
    Accept: "application/json"
  },
  })
  if (!resp.ok) console.log('ERROR' + resp.status)
  const {data: {items: txs}} = await resp.json() //gets an array of tx's


  // filters the tx's for the ones sent to the safeProxyFactoryAddress
  const validTxs:Array<any> = await txs.filter((tx:any) => {
    return !tx.to_address ? false : // if the to_address is null, return false
    (tx.to_address.toLowerCase() == factoryAddress.toLowerCase()) // if the to_address matches the factoryAddress, return true
  
  })

  if(validTxs.length > 1) console.error("there are multiple summon creation tx's")
  if(validTxs.length < 1) console.log("this user has not deployed a summon")

  console.log(validTxs)
  const SummonSafe:string = (validTxs.length > 0) ? validTxs[0].log_events[0].decoded.params[0].value : "NO_SAFE_FOUND";

  console.log(SummonSafe);

  (validTxs.length > 0) && console.log(`Safe Detetected! Address: ${SummonSafe}`)

  return SummonSafe // returns safe value or "NO_SAFE_FOUND"
}

export default getSummonSafe