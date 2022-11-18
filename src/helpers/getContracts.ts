import SummonManager from '../contracts/SummonV2Manager.json';

function getContracts(chainID: number): any[] {
// if(chainID == 5) return "0x4C8D779e3D4dAEC47369408aE4D8F7aA85FF1023"
const ManagerABI = SummonManager.abi

const returnArray = new Array<any>("0x346995C5894ea02F1b25b32389E42E71355d6F36", ManagerABI)
// return address and abi
if(chainID == 5) return returnArray

console.error("wrong chain")
return returnArray
}

export default getContracts