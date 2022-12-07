import SummonManager from '../contracts/SummonV2Manager.json';

function getContracts(chainID: number | null): any[] {
if(chainID == null) return []

const ManagerABI = SummonManager.abi
const ManagerAddress = chainID == 1 ? "0xdc2E5925598Cde53D37b6b8428aEFc3dc1Ff677C" : "0x594ad6ed051e18676CBF006F1cDA93137bB3d72f"

const returnArray = new Array<any>(ManagerAddress, ManagerABI)
// return address and abi
if(chainID == 5) return returnArray
else {
console.error(`wrong chain: ${chainID}`)
return returnArray}
}

export default getContracts