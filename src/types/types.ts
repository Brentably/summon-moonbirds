import {ethers} from 'ethers'


type IConnection = {
  provider: ethers.providers.Provider | undefined ,
  signer: ethers.Signer | undefined,
  walletAddress: string,
  chainID: number,
}

export default IConnection