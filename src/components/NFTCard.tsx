import Button from "./Button"
import defaultNFTicon from '../template/defaultNFTicon.png'
import { MouseEventHandler } from "react";

function NFTCard(props: {icon: string, isVideo?: boolean, NFTTitle: string, collectionName: string, buttonText: string, onButton?: MouseEventHandler<HTMLDivElement>, bright?: boolean, nobutton?:boolean}) {
 const {icon, isVideo, NFTTitle, collectionName, buttonText, onButton, bright, nobutton} = props;



  // if(!icon) return null 
  return(
    <div className="NFTCardContainer">
      <div className="NFTCardLeft">
        {isVideo ? 
        <video className="NFTCardImage">
          <source src={icon} type="video/mp4" />
      </video> 
      : <img className="NFTCardImage" src={icon || defaultNFTicon}/> }
        <div className="NFTCardTitles">
          <div className="NFTNameText">{NFTTitle}</div>
          <div className="collectionTitleText">{collectionName}</div>
        </div> 
      </div>
      {!nobutton && <Button text={buttonText} onClick={onButton} bright={bright}/>}
    </div>
  )
}
export default NFTCard