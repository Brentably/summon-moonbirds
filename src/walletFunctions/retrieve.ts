import {ethers} from 'ethers'
import getContracts from '../helpers/getContracts'
import IConnection from '../types/types'

async function retrieve(tokenAddress: string, tokenId: string, connection: IConnection, updateNFTStatus: Function) {
  const {walletAddress, chainID, signer} = connection
const [ManagerABI, ManagerAddress] = getContracts(chainID)

const SummonManager = new ethers.Contract(ManagerABI, ManagerAddress, signer)

console.log('hi')

// const encodedToken = await SummonManager.getEncodedToken(tokenAddress, tokenId)
let tx = await SummonManager.withdrawTokenFromSummon(tokenAddress, tokenId)
updateNFTStatus(tokenAddress, tokenId, "retrieving")
console.log(tx)
let tx_r = await tx.wait()
console.log(tx_r)
tx_r.status = 1 ? updateNFTStatus(tokenAddress, tokenId, "retrieved") : updateNFTStatus(tokenAddress, tokenId, "failed :(")


console.log("WOOOHOOO NFT retrieved (not really)")

}

export default retrieve
