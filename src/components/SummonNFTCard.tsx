import Button from './Button'
import defaultNFTicon from '../template/defaultNFTicon.png'
import lend from '../walletFunctions/lend'

import IConnection from '../types/types'
import NFTCard from './NFTCard'



function SummonNFTCard(props: {store: any, NFTitem:any, NFTcollection:any}) {

//need to destructure NFT image, collection title, specific NFT name from NFT item
// const {NFTitem} = props
const [state, dispatch] = props.store
const {connection} = state
const {external_data: {image, name}, token_id} = props.NFTitem
const {contract_name: collectionName, contract_address: tokenAddress} = props.NFTcollection

const NFTTitle = name ? `${name} #${token_id}` : `#${token_id}`
const isVideo = image && image.endsWith(".mp4")




// const isVideo = true // testing
return (
  <NFTCard icon={image} isVideo={isVideo} NFTTitle={NFTTitle} collectionName={collectionName} />
)
} 

export default SummonNFTCard