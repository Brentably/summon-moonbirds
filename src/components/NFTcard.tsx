import NFTlistButton from "./NFTlistButton"

function NFTCard(props:any) {
//need to destructure NFT image, collection title, specific NFT name from NFT item
// const {NFTitem} = props
const {external_data: {image_1024, name}, token_id} = props.NFTitem
const {contract_name: collectionName} = props.NFTcollection
console.log(props.NFTitem.external_data)
console.log(image_1024)
// console.log(props.NFTitem)
// console.log(image_1024)
// console.log(token_id)
// console.log(collectionName)

const cardTitle = name ? `${name}` : `${token_id}`

return (
  <div className="NFTcardContainer">
    <div className="NFTcardLeft">
      <img className="NFTcardImage" src={image_1024} width={50} />
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