import {useEffect, useState} from "react"
import defaultNFTicon from '../template/defaultNFTicon.png'
import leftArrow from '../template/leftArrow.png'
import Button from "./Button"
import lend from '../walletFunctions/lend'

const Lending = (props: any) => {
  const [state, setState] = props.store
  const {lendData, connection} = state
  const { started, tokenAddress, tokenId, image, name, collectionName, NFTTitle, isVideo} = lendData
  const [lendingStatus, setLendingStatus] = useState<string>("lend")
  // const [localToAddress, setLocalToAddress] = useState<string>('0x6A5a2a99A9B4c732fFfcccB9D9484c0Fe3a21F2e')
  const [localToAddress, setLocalToAddress] = useState<string>('0x1c7e51D7481fb83249C4e60d87ed4C937A23cD37')
  const [toAddressValid, setToAddressValid] = useState<boolean>(false)
  const handleAddress = (e:any) => {
    setLocalToAddress(e.target.value)

    // console.log(e)
    // setState({...state, lendData: {...lendData, toAddress: e.target.value}})
  }

  async function handleClick() {
    // toAddress: string, tokenAddress: string, tokenId: number, connection: IConnection
    console.log("lending")
    if (!toAddressValid) console.error("to address is not valid")



    lend(localToAddress, tokenAddress, tokenId, connection)
  }
  
  function handleBack() {
    setState({...state, view: "lend"})
    console.log("goingback")
  }

  //checks if the toAddress is Valid
  useEffect(() => {

    let valid = (localToAddress.length == 42 && localToAddress.startsWith('0x') || localToAddress.length == 0)
    setToAddressValid(valid)
  }, [localToAddress])



  return (
    <div className="LendingPage">
      <div className="lendingHeader">
        <div className="backButton" onClick={handleBack}>
          <img src={leftArrow} className="backButton" />
        </div>
        <div className="lendingHeaderTitle">summon</div>
        
      </div>
      <div className="lendingStatusHeader">{lendingStatus}</div>
      <div className="lendingNFTCard">
          {isVideo ? <video className="NFTCardImage"><source src={image} type="video/mp4" /></video> : <img className="lendNFTCardImage" src={image || defaultNFTicon}/> }
          <div className="lendingNFTTitle">{NFTTitle}</div>
          <div className="lendingCollectionName">{collectionName}</div>
      </div>
      <div className="lendingTo">to</div>
      <input className={toAddressValid ? "" : "invalidInput"} type="text" placeholder='Ex: 0xABC, ric.eth' value={localToAddress} onChange={handleAddress}/>
      <Button text="lend NFT" onClick={handleClick} bright/> 
    </div>
  )
}

export default Lending