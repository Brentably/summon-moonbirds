import NFTListButton from './NFTListButton'
import defaultNFTicon from '../template/defaultNFTicon.png'
import lend from '../walletFunctions/lend'
import retrieve from '../walletFunctions/retrieve'
import IConnection from '../types/types'

function NFTCard(props: {store: any, NFTitem:any, NFTcollection:any}) {
//need to destructure NFT image, collection title, specific NFT name from NFT item
// const {NFTitem} = props
const [state, setState] = props.store
const {connection} = state
const {external_data: {image, name}, token_id} = props.NFTitem
const {contract_name: collectionName, contract_address: tokenAddress} = props.NFTcollection


function handleClick() {
  setState({...state, 
  view: "home/lend/lending",
  action: {
    lend: {
      started: true,
      tokenAddress: tokenAddress,
      tokenId: token_id,
      toAddress: "",
    }
  }})
}


const cardTitle = name ? `${name}` : `#${token_id}`
const isVideo = image && image.endsWith(".mp4")
// const isVideo = true // testing
return (
  <div className="NFTCardContainer">
    <div className="NFTCardLeft">
      {isVideo ? 
      <video className="NFTCardImage">
        <source src={image} type="video/mp4" />
    </video> 
    : <img className="NFTCardImage" src={image || defaultNFTicon}/> }
      <div className="NFTCardTitles">
        <div className="NFTNameText">{cardTitle}</div>
        <div className="collectionTitleText">{collectionName}</div>
      </div> 
    </div>
     <NFTListButton type="lend" onClick={handleClick} /> 
  </div>
)
} 

export default NFTCard