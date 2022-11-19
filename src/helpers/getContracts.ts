import SummonManager from '../contracts/SummonV2Manager.json';

function getContracts(chainID: number): any[] {
if(chainID == 0) return []

const ManagerABI = SummonManager.abi

const returnArray = new Array<any>("0x210Ca44D7308Cf9ac54643eC7204bE02D1961548", ManagerABI)
// return address and abi
if(chainID == 5) return returnArray
else {
console.error(`wrong chain: ${chainID}`)
return returnArray}
}

export default getContracts