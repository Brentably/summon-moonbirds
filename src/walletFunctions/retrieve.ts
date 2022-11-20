import {ethers} from 'ethers'
import getContracts from '../helpers/getContracts'
import IConnection from '../types/types'

async function retrieve(tokenAddress: string, tokenId: string, connection: IConnection, setStatus: Function) {
  const {walletAddress, chainID, signer} = connection
const [ManagerABI, ManagerAddress] = getContracts(chainID)

const SummonManager = new ethers.Contract(ManagerABI, ManagerAddress, signer)

console.log('hi')

// const encodedToken = await SummonManager.getEncodedToken(tokenAddress, tokenId)
let tx = await SummonManager.withdrawTokenFromSummon(tokenAddress, tokenId)
setStatus("retrieving")
let tx_r = await tx.wait()
tx_r.status = 1 ? setStatus("retrieved") : setStatus("failed :(")


console.log("WOOOHOOO NFT retrieved (not really)")

}

export default retrieve
