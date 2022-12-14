import Button from "./Button"
import defaultNFTicon from '../template/defaultNFTicon.png'
import { MouseEventHandler } from "react";
import SmallLoader from "./SmallLoader";

function NFTCard(props: {icon: string, isVideo?: boolean, NFTTitle: string, collectionName: string, buttonText?: string, onButton?: MouseEventHandler<HTMLDivElement>, bright?: boolean, loader?:boolean, noButton?: boolean}) {
 const {icon, isVideo, NFTTitle, collectionName, buttonText, onButton, bright, loader, noButton} = props;

  

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
      {/* ok yeah I shouldn't have done it this way */}
      {((noButton && !loader) || (loader) || (!noButton && buttonText && !loader)) && <div className="buttonContainer">
          {noButton && !loader && <div className="noButtonText">{buttonText}</div>}
          {loader && <SmallLoader/>}
          {!noButton && buttonText && !loader && <Button text={buttonText} onClick={onButton} bright={bright}/>}
      </div>}
    </div>
  )
}
export default NFTCard