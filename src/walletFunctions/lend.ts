import {ethers} from 'ethers'
import getContracts from '../helpers/getContracts'
import IConnection from '../types/types'
import ERC721 from '../abi/ERC721.json'



// address or summonAddress will work for address, we won't let them fuck it up :salute:
async function lend(toAddress: string, tokenAddress: string, tokenId: number, connection: IConnection) {
const {provider, signer, walletAddress, chainID} = connection
const [ManagerAddress, ManagerABI] = getContracts(chainID)

// find out if toAddress is Summon or wallet 



let SummonManager = new ethers.Contract( ManagerAddress , ManagerABI , signer)
console.dir(SummonManager)

// if it's a wallet, find out if they have a Summon Address

let OnChainSummonAddress = await SummonManager.OwnerToSummonAddress(toAddress)
// if they don't, deploy one
if(await OnChainSummonAddress == "0x0000000000000000000000000000000000000000") {
  let tx = await SummonManager.CreateNewSummon(toAddress)
  let tx_r = await tx.wait()
  console.log(`lender wallet was deployed ${tx_r.status}`)
}

await OnChainSummonAddress

// now take the summon address, set approval for all if it hasn't been, 

let TokenContract = new ethers.Contract(tokenAddress, ERC721 , signer)
console.dir(TokenContract)

const isApprovedForAll = await TokenContract.isApprovedForAll(walletAddress, OnChainSummonAddress) // owner, operator

if(!isApprovedForAll) {
  let tx = await TokenContract.setApprovalForAll(OnChainSummonAddress, true)
  let tx_r = await tx.wait()
  console.log(`Summon Address was approved for all status: ${tx_r.status}`)
}


// and then call deposit NFT on the summon address


// let tx = await SummonManager.depositTokenToSummon(OnChainSummonAddress, tokenAddress, tokenId)
// let tx_r = await tx.wait()
// console.log(`deposit success? ${tx_r.status} to ${OnChainSummonAddress}`)



console.log("WOOOOHOO NFT LENDED (not really)")
console.log(`to: ${toAddress} token: ${tokenAddress} tokenId: ${tokenId}`)



}

export default lend