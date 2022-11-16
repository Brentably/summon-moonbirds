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



  return (
    <div className="LendingPage">
      <div className="lendingHeader">
        <span className="backButton">
          <img src={leftArrow} className="backButton" />
        </span>
        <span className="lendingHeaderTitle">summon</span>
        <span className="backButton">
          <img src={leftArrow} className="backButton" />
        </span>
      </div>
      <div className="lendingHeader">{lendingStatus}</div>
      <div className="LendingNFTCard">
          {isVideo ? <video className="NFTCardImage"><source src={image} type="video/mp4" /></video> : <img className="NFTCardImage" src={image || defaultNFTicon}/> }
          <div className="">{NFTTitle}</div>
          <div className="NFTNameText">{NFTTitle}</div>
          <div className="collectionTitleText">{collectionName}</div>
      </div>
      <div>to</div>
      <input type="text" placeholder='Ex: 0xABC, ric.eth' value={localToAddress} onChange={handleAddress}/>
      <Button text="lend NFT" onClick={handleClick} bright/> 
    </div>
  )
}

export default Lending