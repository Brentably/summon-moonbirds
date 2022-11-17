import {useState} from "react"
import defaultNFTicon from '../template/defaultNFTicon.png'
import leftArrow from '../template/leftArrow.png'
import Button from "./Button"


const Lending = (props: any) => {
  const [state, setState] = props.store
  const {action: {lend}} = state
  const { started, tokenAddress, tokenId, toAddress, image, name, collectionName, NFTTitle, isVideo} = lend
  const [lendingStatus, setLendingStatus] = useState<string>("lend")
  const [localToAddress, setLocalToAddress] = useState<string>(`${toAddress}`)

  const handleAddress = (e:any) => {
    setLocalToAddress(e.target.value)
    // console.log(e)
    // setState({...state, lend: {...lend, toAddress: e.target.value}})
  }

  function handleClick() {
    console.log("lending")
  }
  
  function handleBack() {
    setState({...state, view: "lend"})
    console.log("goingback")
  }



  return (
    <div className="LendingPage">
      <div className="lendingHeader">
        <div className="backButton" onClick={handleBack}>
          <img src={leftArrow} className="backButton" />
        </div>
        <span className="lendingHeaderTitle">summon</span>
        
      </div>
      <div className="lendingStatusHeader">{lendingStatus}</div>
      <div className="lendingNFTCard">
          {isVideo ? <video className="NFTCardImage"><source src={image} type="video/mp4" /></video> : <img className="lendNFTCardImage" src={image || defaultNFTicon}/> }
          <div className="lendingNFTTitle">{NFTTitle}</div>
          <div className="lendingCollectionName">{collectionName}</div>
      </div>
      <div className="lendingTo">to</div>
      <input type="text" placeholder='Ex: 0xABC, ric.eth' value={localToAddress} onChange={handleAddress}/>
      <Button text="lend NFT" onClick={handleClick} bright/> 
    </div>
  )
}

export default Lending