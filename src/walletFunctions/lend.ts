import {ethers} from 'ethers'
import getContracts from '../helpers/getContracts'
import IConnection from '../types/types'
import ERC721 from '../abi/ERC721.json'



// address or summonAddress will work for address, we won't let them fuck it up :salute:
async function lend(toAddress: string, tokenAddress: string, tokenId: number, connection: IConnection, updateStatus: Function ) {
const {provider, signer, walletAddress, chainID} = connection
const [ManagerAddress, ManagerABI] = getContracts(chainID)

// find out if toAddress is Summon or wallet 



let SummonManager = new ethers.Contract( ManagerAddress , ManagerABI , signer)
console.dir(SummonManager)

// if it's a wallet, find out if they have a Summon Address




// console.log(`to Summon Address is ${OnChainSummonAddress}`)
// now take the summon address, set approval for all if it hasn't been, 

let TokenContract = new ethers.Contract(tokenAddress, ERC721 , signer)
console.dir(TokenContract)

//NEED TO CHECK AND GIVE SUMMON MANAGER APPROVAL, NOT SUMMON ADDRESS
const isApprovedForAll = await TokenContract.isApprovedForAll(walletAddress, ManagerAddress) // owner, Manager 
console.log(`${tokenAddress}.isApprovedforAll(${walletAddress}, ${ManagerAddress} returned ${isApprovedForAll})`)


if(!isApprovedForAll) {
  let tx = await TokenContract.setApprovalForAll(ManagerAddress, true)
  updateStatus("approving")
  let tx_r = await tx.wait(1)
  console.log(`Summon Manager address was approved for all status: ${tx_r.status}`)
  if(tx_r.status == 1) updateStatus("lend")
}


// and then call deposit NFT on the summon address

console.log(toAddress, tokenAddress, tokenId)
let tx = await SummonManager.lendTokenToBorrower(toAddress, tokenAddress, tokenId)
updateStatus("lending")
console.log(`processing lending transaction at hash: ${tx.hash} `)
let tx_r = await tx.wait()
console.log(`deposit success? ${tx_r.status} to ${toAddress}`)
updateStatus("lended")

if(tx_r.status != 1) console.error("issue with token deposit")




}

export default lend