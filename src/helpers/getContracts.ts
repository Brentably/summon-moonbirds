import SummonFactoryV2 from '../contracts/SummonFactoryV2.json';

function getContracts(chainID: number): any[] {
// if(chainID == 5) return "0x4C8D779e3D4dAEC47369408aE4D8F7aA85FF1023"
const FactoryABI = SummonFactoryV2.abi

const returnArray = new Array<any>("0xEC87E83C301884E167d5D129fB3089C62626Cb4d", FactoryABI)
// return address and abi
if(chainID == 5) return returnArray

console.error("wrong chain")
return returnArray
}

export default getContracts