import {ethers} from 'ethers'
import getContracts from '../helpers/getContracts'
import IConnection from '../types/types'

// address or summonAddress will work for address, we won't let them fuck it up :salute:
async function lend(toAddress: string, tokenAddress: string, tokenId: number, connection: IConnection) {
const {provider, signer, walletAddress, chainID} = connection
const [ManagerAddress, ManagerABI] = getContracts(chainID)

// find out if toAddress is Summon or wallet 



let SummonManager = new ethers.Contract( ManagerAddress , ManagerABI , signer)
console.dir(SummonManager)


let OwnerToSummonAddress = await SummonManager.OwnerToSummonAddress(toAddress)
if(await OwnerToSummonAddress == "0x0000000000000000000000000000000000000000") {
  console.log((await SummonManager.estimateGas.CreateNewSummon(toAddress)).toNumber())
}

// if it's a wallet, find out if they have a Summon Address

// if they don't, deploy one

// now take the summon address, set approval for all if it hasn't been, 

// and then call deposit NFT on the summon address



console.log("WOOOOHOO NFT LENDED (not really)")
console.log(`to: ${toAddress} token: ${tokenAddress} tokenId: ${tokenId}`)



}

export default lend