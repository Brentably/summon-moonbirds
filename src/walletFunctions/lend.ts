import ethers from 'ethers'
import getFactoryAddress from '../helpers/getFactoryAddress'
import IConnection from '../types/types'

// address or summonAddress will work for address, we won't let them fuck it up :salute:
async function lend(toAddress: string, tokenAddress: string, tokenId: number, connection: IConnection) {

console.log("WOOOOHOO NFT LENDED (not really)")
console.log(`to: ${toAddress} token: ${tokenAddress} tokenId: ${tokenId}`)

}

export default lend