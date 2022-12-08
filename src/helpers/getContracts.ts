import SummonManager from '../contracts/SummonManager.json';

// by default returns manager contracts, but which can update which contracts to pull
function getContracts(chainID: number | null, which?: string): any[] {
if(chainID == null) return []
if(which == 'moonbirds' && chainID == 5) return ['0x058e91A0fEeDB62b364C24339299BeC2DA6deAB6']
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