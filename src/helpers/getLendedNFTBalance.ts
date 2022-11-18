
import { ethers } from "ethers"
import IConnection from "../types/types"
import getApiKey from "./getApiKey"
import getContracts from "./getContracts"


async function getLendedNFTBalance(connection: IConnection) {

  // First part is finding the tokens that are currently lended out. We do this by searching for on chain log events
  // and then do some js magic to get a set of lended tokens at the bottom.
  const {walletAddress, chainID, signer} = connection
  const [ManagerAddress, ManagerABI] = getContracts(5)
  const SummonManager = new ethers.Contract(ManagerAddress, ManagerABI, signer)
  // console.dir(SummonManager)
  const filterLend = SummonManager.filters.TokenLendedFrom(walletAddress);
  const filterRetrieve = SummonManager.filters.TokenWithdrawnTo(walletAddress);
  const lendLogs = await SummonManager.queryFilter(filterLend, -10000, "latest");
  const retrieveLogs = await SummonManager.queryFilter(filterRetrieve, -10000, "latest");
  
  // returns nice arrays of lender, summon, tokenAddress, and tokenId
  const filteredLendLogs = lendLogs.map(elog => elog.args && ({...elog.args, tokenId: elog.args.tokenId.toNumber(), eventType: "lend"}))
  const filteredRetrieveLogs = retrieveLogs.map(elog => elog.args && ({...elog.args, tokenId: elog.args.tokenId.toNumber(), eventType: "retrieve"}))
  console.log(`${filteredLendLogs.length - filteredRetrieveLogs.length} tokens currently lended out`)

  const TokenEventsForAddress:Array<any> = filteredLendLogs.concat(filteredRetrieveLogs) // all events
  // console.log(TokenEventsForAddress)
  
  let Tokens = new Set<Array<string | number>>()
  for(let tokenEvent of TokenEventsForAddress) {
    let {lender, summon, tokenAddress, tokenId, eventType} = tokenEvent
    let hasToken = Tokens.has([tokenAddress, tokenId])
    hasToken ? Tokens.delete([tokenAddress, tokenId]) : Tokens.add([tokenAddress, tokenId])
    console.log(Tokens)
  }
// so we have a list of collection addresses and tokenId's. now we need the external data, so we have to make either 1 api call to opensea (where you can search for multiple collections and tokens at the same time. Or we have to iterate through the tokens / addreses and make multiple api calls.

// until now I have built everything to be composable with any evm chain

const options = {method: 'GET'};
const OPENSEA_KEY = getApiKey("opensea")

function getOpenSeaParamsFromTokens(Tokens: Set<Array<string | number>>) {

let stringArr: string[] = []
Tokens.forEach(token => {
stringArr.push(`asset_contract_addresses=${token[0]}`)
stringArr.push(`token_ids=${token[1]}`)
})

return stringArr.join('&')

}

const queryParams = getOpenSeaParamsFromTokens(Tokens)

// const resp = await fetch(`https://testnets-api.opensea.io/api/v1/assets?token_ids=1140991&asset_contract_addresses=0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b&token_ids=278&asset_contract_addresses=0x932Ca55B9Ef0b3094E8Fa82435b3b4c50d713043`, {
const resp = await fetch(`https://testnets-api.opensea.io/api/v1/assets?${queryParams}`, {
method: 'GET',
headers: {
  Accept: "application/json"
},
})
if (!resp.ok) console.log('ERROR' + resp.status)
// bug will show up here b/c if you searched for [0xABC, 3] and [0xBCD, 4] OpenSea will return you [0xABC, 4] and [0xBCD, 3] as well
const data = await resp.json()






  return undefined
}

export default getLendedNFTBalance