import {ethers} from 'ethers'
import getContracts from '../helpers/getContracts'
import {IConnection} from '../store/types'
import ERC721AndNesting from '../abi/ERC721AndNesting.json'



// address or summonAddress will work for address, we won't let them fuck it up :salute:
async function lend(toAddress: string, tokenId: number, connection: IConnection, updateStatus: (status: string) => void ) {
const {provider, signer, walletAddress, chainID} = connection
const [ManagerAddress, ManagerABI] = getContracts(chainID)
const [, SummonABI] = getContracts(chainID, 'summon')
// find out if toAddress is Summon or wallet 
const [MoonbirdsAddress] = getContracts(chainID, 'moonbirds')


let SummonManager = new ethers.Contract( ManagerAddress , ManagerABI , signer)
let SummonAddress:string = await SummonManager.OwnerToSummonAddress(toAddress)

if(SummonAddress == "0x0000000000000000000000000000000000000000") {
  updateStatus('deploying summon')
  let tx = await SummonManager.CreateNewSummon(toAddress)
  let tx_r = await tx.wait(1)
  console.log(`Summon successfully deployed: ${tx_r.status}`)
  SummonAddress = await SummonManager.OwnerToSummonAddress(toAddress)
  if(SummonAddress == "0x0000000000000000000000000000000000000000") throw new Error("not picking up SummonAddress after deploy")
  updateStatus('lend')
}

const Summon = new ethers.Contract(SummonAddress, SummonABI, signer)


const MoonBirdsContract = new ethers.Contract(MoonbirdsAddress, ERC721AndNesting , signer)
console.dir(MoonBirdsContract)


// get all you have to do is safeTransferWhileNesting to the Summon


console.log(toAddress, tokenId)
let tx = await MoonBirdsContract.safeTransferWhileNesting(walletAddress, SummonAddress, tokenId)
updateStatus("lending")
console.log(`processing lending transaction at hash: ${tx.hash} `)
let tx_r = await tx.wait()
console.log(`deposit success? ${tx_r.status} to ${toAddress}`)
updateStatus("lended")

if(tx_r.status != 1) console.error("issue with token deposit")


}

export default lend