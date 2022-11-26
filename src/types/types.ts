import {ethers} from 'ethers'


type IConnection = {
  provider: ethers.providers.Provider | undefined ,
  signer: ethers.Signer | undefined,
  walletAddress: string,
  chainID: number,
}

export type IAsset = { 
  image: string, 
  name: string, 
  token_id: string, 
  collectionName: string, 
  tokenAddress: string, 
  NFTTitle: string, 
  isVideo: boolean,
  status?: string
}

export default IConnection