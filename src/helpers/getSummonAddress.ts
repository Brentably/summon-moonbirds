import {ethers} from 'ethers'
import IConnection from '../types/types'
import getApiKey from './getApiKey'
import getContracts from './getContracts'



//we can do this by searching for summon creation calls to the manager address by the walletAddress
async function getSummonAddress(connection: IConnection): Promise<string> {
  const {walletAddress, chainID, signer} = connection
  if(!walletAddress) return ""
  const COVALENT_API_KEY = getApiKey()
  const [ManagerAddress, ManagerABI] = getContracts(chainID)
  console.log("BRRRR getting summon wallet")




  // console.log(`searching for txs to ${ManagerAddress} on chain ${chainID}`)
  // const resp = await fetch(`https://api.covalenthq.com/v1/${chainID}/address/${ManagerAddress}/transactions_v2/?&key=${COVALENT_API_KEY}`, {
  // method: 'GET',
  // headers: {
  //   Accept: "application/json"
  // },
  // })
  // if (!resp.ok) console.log('ERROR' + resp.status)

  // const {data: {items: txs}} = await resp.json() //gets an array of tx's
  // console.log(txs)


  const SummonManager = new ethers.Contract(ManagerAddress, ManagerABI, signer)
  const SummonVaults = SummonManager.filters.SummonCreated(walletAddress)
  const AllVaultsLogs = await SummonManager.queryFilter(SummonVaults, -100000, "latest");
  const VaultsForAddress = AllVaultsLogs // I was filtering 2x
  // console.dir(AllVaultsLogs)
  // const VaultsForAddress = AllVaultsLogs.filter(log => log?.args?.owner == walletAddress)
  if(VaultsForAddress == undefined) return "error"
  if(VaultsForAddress.length > 1) console.error("multiple summmons deployed, returning the first one")
  if(VaultsForAddress.length < 1) return "needs"
  
  return VaultsForAddress[0].args?.summonAddress
  
  // return summonAddress // returns summon address or "needs"
}

export default getSummonAddress