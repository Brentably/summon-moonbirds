
import { ethers } from "ethers"
import { AbiCoder } from "ethers/lib/utils"
import { IConnection, IAsset } from "../store/types"
import getApiKey from "./getApiKey"
import getContracts from "./getContracts"


async function getLendedNFTBalance(connection: IConnection): Promise<IAsset[] | []> {

  // First part is finding the tokens that are currently lended out. We do this by searching for on chain log events
  // and then do some js magic to get a set of lended tokens at the bottom.
  const {walletAddress, chainID, signer} = connection
  const [ManagerAddress, ManagerABI] = getContracts(chainID)
  const SummonManager = new ethers.Contract(ManagerAddress, ManagerABI, signer)
  // console.dir(SummonManager)
  const filterLend = SummonManager.filters.TokenLendedFrom(walletAddress);
  const filterRetrieve = SummonManager.filters.TokenWithdrawnTo(walletAddress);
  const lendLogs = await SummonManager.queryFilter(filterLend, -100000, "latest");
  const retrieveLogs = await SummonManager.queryFilter(filterRetrieve, -100000, "latest");
  
  // returns nice arrays of lender, summon, tokenAddress, and tokenId
  
  const filteredLendLogs = lendLogs.map(elog => elog.args && ({...elog.args, tokenId: `${elog.args.tokenId.toString()}`, eventType: "lend"}))
  const filteredRetrieveLogs = retrieveLogs.map(elog => elog.args && ({...elog.args, tokenId: `${elog.args.tokenId.toString()}`, eventType: "retrieve"}))
  // const filteredRetrieveLogs = retrieveLogs.map(elog => elog.args && ({...elog.args, tokenId: `${elog.args.tokenId.toString()}`, eventType: "retrieve"}))
  console.log(`${filteredLendLogs.length - filteredRetrieveLogs.length} tokens currently lended out`)

  const TokenEventsForAddress:Array<any> = filteredLendLogs.concat(filteredRetrieveLogs) // all events
  // console.log(TokenEventsForAddress)
  
  type TokensByAddress = {
    tokenAddress: { tokenid: number} // move count
  }
  // tokens is supposed to be an array of all the tokens. increment the move count by 
  let AllTokens:any = new Object()
  for(let tokenEvent of TokenEventsForAddress) {
    let {lender, summon, tokenAddress, tokenId, eventType} = tokenEvent
    // console.log(tokenEvent)
    
    let hasTokenAddress = AllTokens[tokenAddress]
    if(!hasTokenAddress) AllTokens[tokenAddress] = {[tokenId]: 1}

    let hasToken = AllTokens[tokenAddress][tokenId]
    if(!hasToken) AllTokens[tokenAddress][tokenId] = 1

    if(hasToken && hasTokenAddress) AllTokens[tokenAddress][tokenId] += 1


  }
// console.log(AllTokens)
let LendedTokens:any[] = []

for(let address in AllTokens) {
  for(let tokenId in AllTokens[address]) {
    if(AllTokens[address][tokenId] % 2) LendedTokens.push([address, tokenId])
  }
}

if(LendedTokens.length == 0) return LendedTokens
// console.log(LendedTokens)

// so we have a list of collection addresses and tokenId's. now we need the external data, so we have to make either 1 api call to opensea (where you can search for multiple collections and tokens at the same time. Or we have to iterate through the tokens / addreses and make multiple api calls.

// until now I have built everything to be composable with any evm chain

const OPENSEA_KEY = getApiKey("opensea")

function getOpenSeaParamsFromTokens(LendedTokens: Array<Array<string>>) {

let stringArr: string[] = []
LendedTokens.forEach(token => {
stringArr.push(`asset_contract_addresses=${token[0]}`)
stringArr.push(`token_ids=${token[1]}`)
})

return stringArr.join('&')

}

const queryParams = getOpenSeaParamsFromTokens(LendedTokens)

// const resp = await fetch(`https://testnets-api.opensea.io/api/v1/assets?token_ids=1140991&asset_contract_addresses=0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b&token_ids=278&asset_contract_addresses=0x932Ca55B9Ef0b3094E8Fa82435b3b4c50d713043`, {


const endpoint = chainID == 5 ? `https://testnets-api.opensea.io/api/v1/assets?limit=30&${queryParams}` : `https://api.opensea.io/api/v1/assets?limit=30&${queryParams}`

const resp = await fetch(endpoint, {
method: 'GET',
headers: {
  Accept: "application/json",
  'X-API-KEY': OPENSEA_KEY
},
})
if (!resp.ok) console.log('ERROR' + resp.status)

const data = await resp.json()
console.log(data.assets)
if(data.assets.length == 30) console.error("HIT 30 ASSET API CALL LIMIT: contact one of the Summon people and tell them you saw this error -Brent")

// bug will show up here b/c if you searched for [0xABC, 3] and [0xBCD, 4] OpenSea will return you [0xABC, 4] and [0xBCD, 3] as well, so I'm filtering stuff
const filteredData:any[] = data.assets.filter((asset:any) => {
  const assetToken: Array<string> = [asset.asset_contract.address, asset.token_id]
  return LendedTokens.some(lendedToken => lendedToken.join().toLowerCase() == assetToken.join().toLowerCase())
})

const final = filteredData.map(asset => {
  const {image_url: image, name, token_id, collection: {name: collectionName}, asset_contract: {address: tokenAddress}} = asset
    const NFTTitle = name ? `${name}` : `#${token_id}`
    const isVideo = image && image.endsWith(".mp4")
    const status = "lended"

    return {image, name, token_id, collectionName, tokenAddress, NFTTitle, isVideo, status}

}

)  

  return final
}

export default getLendedNFTBalance