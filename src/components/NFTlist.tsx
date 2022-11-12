import {useEffect, useState} from 'react'
import useNFTBalance from "../hooks/useNFTBalance"
import NFTcard from './NFTcard'

type INFTList = {
  walletAddress: String
}

function NFTlist(props : INFTList) {
  const {walletAddress} = props
  const [NFTBalance, setNFTBalance] = useState<any>(null)
  // const [loading, setLoading] = useState<Boolean>(false)
  
  useNFTBalance(walletAddress, setNFTBalance) 
  // setLoading(true)

  // useEffect(() => {NFTBalance && setLoading(false)}, [NFTBalance])
  
  if(!walletAddress) return <h1>connect wallet</h1>
  if(!NFTBalance) return <h1>Loading NFTs</h1>
  return (
    <div>
    {walletAddress}
    <NFTcard NFTitem={NFTBalance[0].nft_data[0]}/>
    </div>
  )
}

export default NFTlist