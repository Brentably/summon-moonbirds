import ethers from 'ethers'
import getFactoryAddress from '../helpers/getFactoryAddress'
import IConnection from '../types/types'

// address or summonAddress will work for address, we won't let them fuck it up :salute:
async function lend(toAddress: string, tokenAddress: string, tokenId: number, connection: IConnection) {
const {provider, signer, walletAddress, chainID} = connection
const FactoryAddress = getFactoryAddress(chainID)

// find out if toAddress is Summon or wallet 

// if it's a wallet, find out if they have a Summon Address

// if they don't, deploy one

// now take the summon address, set approval for all if it hasn't been, 

// and then call deposit NFT on the summon address



console.log("WOOOOHOO NFT LENDED (not really)")
console.log(`to: ${toAddress} token: ${tokenAddress} tokenId: ${tokenId}`)



}

export default lend