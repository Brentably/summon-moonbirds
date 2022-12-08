import { ethers } from "ethers"
import { AbiCoder } from "ethers/lib/utils"
import { IConnection, IAsset } from "../store/types"
import getApiKey from "./getApiKey"
import getContracts from "./getContracts"
import ERC721AndNesting from '../abi/ERC721AndNesting.json'

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
  const AllSummonsLogs = await SummonManager.queryFilter(AllSummonsFilter, -100000, 'latest')
  let SummonSet = new Set()
  AllSummonsLogs.forEach(log => SummonSet.add(log.args?.summonAddress))


  const encodedWalletAddress = ethers.utils.defaultAbiCoder.encode(['address'], [walletAddress])
  
  const lendedFromLogs = await provider.getLogs({fromBlock: -100000, toBlock: "latest", topics: ['0x4a2cfb1bdeab8d6bec71e25f25d3cda681b559c71f0311a859c20860852eaa93', encodedWalletAddress ] }) // lended 
  const retrievedToLogs = await provider.getLogs({fromBlock: -100000, toBlock: "latest", topics: ['0x6ac7eb65de93c0fcde2094ae05cc3907ac639493d5f87b05dc0e02819f67850c', encodedWalletAddress]}) // retrieved


  let AllTokenEvents:{[tokenId: string]: number} = {

  }

  let lendedTokensEvents = lendedFromLogs.map(log => {

    const [BigNumtokenId] = ethers.utils.defaultAbiCoder.decode(['uint'], log.topics[2])
    const tokenId = BigNumtokenId.toString()
    if(!AllTokenEvents[tokenId]) AllTokenEvents[tokenId] = 0
    AllTokenEvents[tokenId]++
    return tokenId
  })
  let retrievedTokensEvents = retrievedToLogs.map(log => {
    const [BigNumtokenId] = ethers.utils.defaultAbiCoder.decode(['uint'], log.topics[2])
    const tokenId = BigNumtokenId.toString()
    if(!AllTokenEvents[tokenId]) console.error("this should never be the case... check back")
    AllTokenEvents[tokenId]++
    return tokenId
  })



  console.log(`${lendedTokensEvents.length - retrievedTokensEvents.length} tokens currently lended out`)

  let lendedTokenIds = []

  for(let tokenId in AllTokenEvents) {
    if(AllTokenEvents[tokenId] % 2 == 1) lendedTokenIds.push(tokenId)
  }

  if(lendedTokenIds.length == 0) return []


const [MoonbirdsAddress] = getContracts(chainID, 'moonbirds')
  
const OPENSEA_KEY = getApiKey("opensea")

function getOpenSeaParamsFromTokens(lendedTokenIds: Array<string>) {

let stringArr: string[] = []
stringArr.push(`asset_contract_address=${MoonbirdsAddress}`)
lendedTokenIds.forEach(token => {
  stringArr.push(`token_ids=${token}`)
})

return stringArr.join('&')

}

const queryParams = getOpenSeaParamsFromTokens(lendedTokenIds)

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



const final = data.assets.map((asset:any) => {
  const {image_url: image, name, token_id, collection: {name: collectionName}, asset_contract: {address: tokenAddress}} = asset
    const NFTTitle = name ? `${name}` : `#${token_id}`
    const isVideo = image && image.endsWith(".mp4")
    const status = "lended"

    return {image, name, token_id, collectionName, tokenAddress, NFTTitle, isVideo, status}

}

)  

  return final
}

export default getLendedMoonbirds