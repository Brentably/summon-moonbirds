import {ethers} from 'ethers'


type IConnection = {
  provider?: ethers.providers.Provider,
  signer?: ethers.Signer,
  walletAddress?: string,
  chainID?: number,
  summonAddress?: string
}

export default IConnection