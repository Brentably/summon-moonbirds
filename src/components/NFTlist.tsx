import {useState} from 'react'
import useNFTBalance from "../hooks/useNFTBalance"

type INFTList = {
  walletAddress: String
}

function NFTlist(props : INFTList) {
  const [NFTBalance, setNFTBalance] = useState<any>(null)
  const {walletAddress} = props

  const balance = useNFTBalance(walletAddress)

  

  return (
    <div>
    {walletAddress}
    {NFTBalance && `${NFTBalance}`}
    </div>
  )
}

export default NFTlist