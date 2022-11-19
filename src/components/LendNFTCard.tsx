import Button from './Button'
import defaultNFTicon from '../template/defaultNFTicon.png'
import lend from '../walletFunctions/lend'
import retrieve from '../walletFunctions/retrieve'
import IConnection from '../types/types'
import NFTCard from './NFTCard'



function LendNFTCard(props: {store: any, NFTitem:any, NFTcollection:any}) {

//need to destructure NFT image, collection title, specific NFT name from NFT item
// const {NFTitem} = props
const [state, setState] = props.store
const {connection} = state
const {external_data: {image, name}, token_id} = props.NFTitem
const {contract_name: collectionName, contract_address: tokenAddress} = props.NFTcollection

const NFTTitle = name ? `${name} #${token_id}` : `#${token_id}`
const isVideo = image && image.endsWith(".mp4")

function handleClick() {
  setState({...state, 
  view: "lending",
  lendData: {
    started: true,
    tokenAddress: tokenAddress,
    tokenId: token_id,
    toAddress: "",
    image: image,
    name: name,
    collectionName: collectionName,
    NFTTitle: NFTTitle,
    isVideo: isVideo
  }
  })
}


// const isVideo = true // testing
return (
  <NFTCard icon={image} isVideo={isVideo} NFTTitle={NFTTitle} collectionName={collectionName} buttonText="lend" onButton={handleClick} bright/>
)
} 

export default LendNFTCard