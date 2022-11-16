
import NFTListButton from './NFTListButton'
import defaultNFTicon from '../template/defaultNFTicon.png'
import lend from '../walletFunctions/lend'
import retrieve from '../walletFunctions/retrieve'
import IConnection from '../types/types'

function NFTCard(props: {connection: IConnection, NFTitem:any, NFTcollection:any, lended?:boolean}) {
//need to destructure NFT image, collection title, specific NFT name from NFT item
// const {NFTitem} = props

const {external_data: {image, name}, token_id} = props.NFTitem
const {contract_name: collectionName, contract_address: tokenAddress} = props.NFTcollection


console.log(props.NFTcollection.contract_address)

// summonAddress: string, tokenAddress: string, tokenId: number, chainID: number
function handleLend() {
 lend("fdsu", tokenAddress, token_id, props.connection)
}
function handleRetrieve() {
  console.log("FUCK")
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
    {props.lended ? <NFTListButton type="retrieve" onClick={handleRetrieve} /> : <NFTListButton type="lend" onClick={handleLend} />}
  </div>
)
} 

export default NFTCard