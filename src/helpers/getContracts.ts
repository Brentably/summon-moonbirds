import SummonManager from '../contracts/SummonV2Manager.json';

function getContracts(chainID: number): any[] {
if(chainID == 0) return []

const ManagerABI = SummonManager.abi

const returnArray = new Array<any>("0xE7144D25a66DAeda0032F7Cd19551B166d9b8468", ManagerABI)
// return address and abi
if(chainID == 5) return returnArray
else {
console.error(`wrong chain: ${chainID}`)
return returnArray}
}

export default getContracts