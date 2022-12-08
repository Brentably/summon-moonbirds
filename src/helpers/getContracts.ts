import SummonManager from '../contracts/SummonManager.json';

function getContracts(chainID: number | null | 'moonbirds'): any[] | string {
if(chainID == null) return []
if(chainID == 'moonbirds') return '0x058e91A0fEeDB62b364C24339299BeC2DA6deAB6' // MoonBirds NFT address
const ManagerABI = SummonManager.abi
const ManagerAddress = chainID == 1 ? "0x00000000000000000000000000000000000000" : "0x2DD46BeF8C76c16C7d66F612d73a0f9Ae21D40c7"

const returnArray = new Array<any>(ManagerAddress, ManagerABI)
// return address and abi
if(chainID == 5) return returnArray
else {
console.error(`wrong chain: ${chainID}`)
return returnArray}
}

export default getContracts