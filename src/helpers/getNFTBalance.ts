import getApiKey from "./getApiKey"
import {ethers} from 'ethers'

// returns all the NFT's in your wallet
async function getNFTBalance(address: string, chainID: number) {
  if(!chainID || !address) return []
  const ALCHEMY_KEY = getApiKey("alchemy", chainID)

  
  
  
  



  console.log(`use NFT Balance is running. chainID: ${chainID} address: ${address}`)

  const query = new URLSearchParams({
    // owner: address,
    owner: address,
    "excludeFilters[]": "SPAM"
  }).toString()
  console.log(`query is ${query}`)



  const endpoint = chainID == 5 ? `https://eth-goerli.g.alchemy.com/nft/v2/${ALCHEMY_KEY}/getNFTs?${query}` : `https://eth-mainnet.g.alchemy.com/nft/v2/${ALCHEMY_KEY}/getNFTs?${query}`
  console.log(`calling ${endpoint}`)

  const resp = await fetch(endpoint, {
  method: 'GET',
  headers: {Accept: "application/json"},
  })
  if (!resp.ok) console.log('ERROR' + resp.status)

  const data = await resp.json()
  console.log(data)

  // const filteredData = data.filter( => item && true) insert filter later for making sure you dont have double scoops


  const final = data.ownedNfts.map((NFT:any) => {
    const image = NFT.metadata.image
    const name = NFT.title
    const encodedTokenId = NFT.id.tokenId

    const [bigNumStringTokenId] = ethers.utils.defaultAbiCoder.decode(['uint'], encodedTokenId)
    const bigNumTokenId = ethers.BigNumber.from(bigNumStringTokenId)
    const token_id = bigNumTokenId.toString() // had to parse this from their api
    const collectionName = NFT.contractMetadata.name
    const tokenAddress = NFT.contract.address
    const NFTTitle = name ? `${name} #${token_id}` : `#${token_id}`
    const isVideo = image && image.endsWith(".mp4")
    return {image, name, token_id, collectionName, tokenAddress, NFTTitle, isVideo}
  })
  
    return final
  
}


export default getNFTBalance