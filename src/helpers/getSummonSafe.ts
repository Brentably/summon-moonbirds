import {ethers} from 'ethers'
import getContractNetworks from './getContractNetworks'
import getApiKey from './getApiKey'

//we can do this by searching for safe creation calls to the safeProxyFactoryAddress by the walletAddress
async function getSummonSafe(walletAddress:String, chainID:number) {
  const COVALENT_API_KEY = getApiKey()
  console.log("BRRRR getting summon safe (if there is one ;)")
  const {[5]: {safeProxyFactoryAddress}} = getContractNetworks()
  // 






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
    (tx.to_address.toLowerCase() == safeProxyFactoryAddress.toLowerCase()) // if the to_address matches the safeProxyFactoryAddress, return true
  
  })


  if(validTxs.length > 1) console.error("there are multiple safe creation tx's")

  const SummonSafe = validTxs[0].log_events[0].decoded.params[0].value

  console.log(`Safe Detetected! Address: ${SummonSafe}`)

  return SummonSafe
}

export default getSummonSafe