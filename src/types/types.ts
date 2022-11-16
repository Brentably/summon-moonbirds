import {ethers} from 'ethers'


type IConnection = {
  provider?: ethers.providers.Provider,
  signer?: ethers.Signer,
  walletAddress?: string,
  chainID?: number,
  safeAddress?: string
}

export default IConnection