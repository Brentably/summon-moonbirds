import type WalletConnect from '@walletconnect/client'
import {ethers} from 'ethers'


export type IConnection = {
  provider: ethers.providers.Provider | undefined ,
  signer: ethers.Signer | undefined,
  walletAddress: string | "",
  chainID: number | null,
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

export type IState = {
  connection: IConnection, 
  summonAddress: string,
  LendedNFTBalance: IAsset[] | undefined, 
  MainNFTBalance: IAsset[] | undefined, 
  SummonNFTBalance: IAsset[] | undefined, 
  uri: string, 
  uriValid: boolean, 
  view: string, 
  lendData: any, 
  connector: WalletConnect | null
}
