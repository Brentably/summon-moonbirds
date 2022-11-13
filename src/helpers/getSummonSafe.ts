import {ethers} from 'ethers'
import getContractNetworks from './getContractNetworks'

async function getSummonSafe(provider:ethers.providers.JsonRpcProvider, signer:ethers.Signer, walletAddress:String) {
  console.log(provider, signer, walletAddress)
  console.log("BRRRR getting summon safe (if there is one ;)")


  return 'SUMMON_SAFE_ADDRESS or NULL'
}

export default getSummonSafe