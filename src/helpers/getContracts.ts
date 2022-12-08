import SummonManager from '../contracts/SummonManager.json';
// import Summon from '../contracts/Summon.json'

// by default returns manager contracts, but which can update which contracts to pull
function getContracts(chainID: number | null, which?: string): any[] {
if(chainID == null) return []


if(which == 'moonbirds' && chainID == 5) return ['0xd2072448b2B387292e128bB72BfB82E512804328']
// const SummonABI = Summon.abi
// if(which == 'summon' && chainID == 5) return ["must calculate", SummonABI]

const ManagerABI = SummonManager.abi
const ManagerAddress = chainID == 1 ? "0x00000000000000000000000000000000000000" : "0xD63F37bB9ba76B6B9555E814431b0616Ee4f07a3"

const returnArray = new Array<any>(ManagerAddress, ManagerABI)
// return address and abi
if(chainID == 5) return returnArray
else {
console.error(`wrong chain: ${chainID}`)
return returnArray}
}

export default getContracts