import NFTlistButton from "./NFTlistButton"

function NFTCard(props:any) {
//need to destructure NFT image, collection title, specific NFT name from NFT item
// const {NFTitem} = props
const {external_data: {image, name}, token_id} = props.NFTitem
const {contract_name: collectionName} = props.NFTcollection
console.log(props.NFTitem.external_data)
// console.log(image)
// console.log(props.NFTitem)
// console.log(image_1024)
// console.log(token_id)
// console.log(collectionName)

const cardTitle = name ? `${name}` : `#${token_id}`
const isVideo = image && image.endsWith(".mp4")
return (
  <div className="NFTcardContainer">
    <div className="NFTcardLeft">
      {isVideo ? 
      <video className="NFTcardImage">
        <source src={image} type="video/mp4" />
    </video> 
    : <img className="NFTcardImage" src={image}/> }
      <div className="NFTcardTitles">
        <div className="NFTnameText">{cardTitle}</div>
        <div className="collectionTitleText">{collectionName}</div>
      </div> 
    </div>
    <NFTlistButton text="retrieve" bright={false} />
  </div>
)
} 

export default NFTCard