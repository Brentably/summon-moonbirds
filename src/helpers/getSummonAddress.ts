import {ethers} from 'ethers'

import getApiKey from './getApiKey'
import getFactoryAddress from './getFactoryAddress'



//we can do this by searching for summon creation calls to the factoryAddress by the walletAddress
async function getSummonAddress(walletAddress:string, chainID:number) {
  const COVALENT_API_KEY = getApiKey()
  const factoryAddress = getFactoryAddress(chainID)
  console.log("BRRRR getting summon wallet")





  const resp = await fetch(`https://api.covalenthq.com/v1/${chainID}/address/${factoryAddress}/transactions_v2/?&key=${COVALENT_API_KEY}`, {
  method: 'GET',
  headers: {
    Accept: "application/json"
  },
  })
  if (!resp.ok) console.log('ERROR' + resp.status)
  const {data: {items: txs}} = await resp.json() //gets an array of tx's




  
  
  // const tx_logs_data = txs[0].log_events[0].raw_log_data
  
  // this is awful but we're rolling with it right now. once we have the contracts a little more established, we can just search for log events with a decoded abi
  const rightTxs = txs.filter((tx:any) => {
    const [owner, summonAddress] = ethers.utils.defaultAbiCoder.decode(["address", "address"], tx.log_events[0].raw_log_data)
    return (owner == walletAddress)
  })
  
  if(rightTxs.length > 1) console.error("there are multiple summon creation tx's! returning the first one")
  if(rightTxs.length < 1) return "NO_SUMMON_FOUND"

  const [owner, summonAddress] = ethers.utils.defaultAbiCoder.decode(["address", "address"], rightTxs[0].log_events[0].raw_log_data)
  owner != walletAddress && console.log("somethings broken here")

  


  console.log(summonAddress);

  console.log(`Summon Address Detetected! Address: ${summonAddress}`)

  return summonAddress // returns summon address or "NO_SUMMON_FOUND"
}

export default getSummonAddress