import {ethers} from 'ethers'
import getContracts from '../helpers/getContracts'
import {IConnection} from '../store/types'
import ERC721AndNesting from '../abi/ERC721AndNesting.json'

async function retrieve(tokenAddress: string, tokenId: string, connection: IConnection, updateNFTStatus: (tokenAddress: string, tokenId: string, status: string)=>void ) {

updateNFTStatus(tokenAddress, tokenId, "retrieving")
const {walletAddress, chainID, signer} = connection
const [ManagerABI, ManagerAddress] = getContracts(chainID)
const [MoonbirdsAddress] = getContracts(chainID, 'moonbirds')

const Moonbirds = new ethers.Contract(MoonbirdsAddress, ERC721AndNesting, signer)


const summonVaultAddress = await Moonbirds.ownerOf(tokenId)
const [, SummonABI] = getContracts(chainID, 'summon')

const Summon = new ethers.Contract(summonVaultAddress, SummonABI, signer )

try {
let tx = await Summon.safeWithdrawMoonBird(tokenId)
console.log(tx)
let tx_r = await tx.wait()
console.log(tx_r)
tx_r.status == 1 ? updateNFTStatus(tokenAddress, tokenId, "retrieved") : updateNFTStatus(tokenAddress, tokenId, "failed :(")
} catch {
  console.log('something something error something')
  updateNFTStatus(tokenAddress, tokenId, "lended")
}

console.log("WOOOHOOO NFT retrieved")

}

export default retrieve
