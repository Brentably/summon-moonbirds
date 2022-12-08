import { ethers } from "ethers"
import { AbiCoder } from "ethers/lib/utils"
import { IConnection, IAsset } from "../store/types"
import getApiKey from "./getApiKey"
import getContracts from "./getContracts"

// MOONBIRDS
// theres a couple ways I could refactor this.
// I could look at the moonbirds contract for all "safeTransferWhileNesting" transfers from your address,
// and then check all the addresses to see if they were summon addresses, and get the tokens if they were summon addresses
// OR, I could get a list of all summon addresses created, and then check k



async function getLendedMoonbirds(connection: IConnection): Promise<IAsset[] | []> {
  // First part is finding the tokens that are currently lended out. We do this by searching for on chain log events
  // and then do some js magic to get a set of lended tokens at the bottom.
  const {walletAddress, chainID, signer, provider} = connection
  if(!provider) return []
  const [ManagerAddress, ManagerABI] = getContracts(chainID)
  const SummonManager = new ethers.Contract(ManagerAddress, ManagerABI, signer)
  console.log(SummonManager)
  const AllSummonsFilter = SummonManager.filters.SummonCreated()
  const lendedFilter = 
  const lendedFromLogs = 
  // const lendedFromLogs = await provider.getLogs({fromBlock: -100000, toBlock: "latest", topics: ['0x4a2cfb1bdeab8d6bec71e25f25d3cda681b559c71f0311a859c20860852eaa93']}) // lended 
  // const retrievedToLogs = await provider.getLogs({fromBlock: -100000, toBlock: "latest", topics: ['0x6ac7eb65de93c0fcde2094ae05cc3907ac639493d5f87b05dc0e02819f67850c']}) // retrieved
  // console.dir(lendedFromLogs)
  // const filteredLendLogs = lendedFromLogs.map()
  // const filteredRetrieveLogs = retrievedToLogs.map(elog => elog.args && ({...elog.args, tokenId: `${elog.args.tokenId.toString()}`, eventType: "retrieve"}))

  // console.log(`${filteredLendLogs.length - filteredRetrieveLogs.length} tokens currently lended out`)

  // const TokenEventsForAddress:Array<any> = filteredLendLogs.concat(filteredRetrieveLogs) // all events

  // returns nice arrays of lender, summon, tokenAddress, and tokenId


  return []
}

export default getLendedMoonbirds