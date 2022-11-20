import SummonManager from '../contracts/SummonV2Manager.json';

function getContracts(chainID: number): any[] {
if(chainID == 0) return []

const ManagerABI = SummonManager.abi

const returnArray = new Array<any>("0x6f2AB9E7D74c27E53E9050C0f7A57905a9572365", ManagerABI)
// return address and abi
if(chainID == 5) return returnArray
else {
console.error(`wrong chain: ${chainID}`)
return returnArray}
}

export default getContracts