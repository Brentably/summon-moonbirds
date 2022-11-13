import React, {useEffect, useState} from 'react'
import useNFTBalance from "../hooks/useNFTBalance"
import NFTcard from './NFTcard'

type INFTList = {
  walletAddress: String
  chainID: number
}

function NFTlist(props : INFTList) {
  const {walletAddress, chainID} = props
  const [NFTBalance, setNFTBalance] = useState<Array<any>>([])
  
  useNFTBalance(setNFTBalance, walletAddress, chainID) 

  // useEffect(() => {NFTBalance && setLoading(false)}, [props])
  

    

  let cardsArray:Array<React.ReactElement> = []


  if(!walletAddress) return <h1>connect wallet</h1>
  if(!NFTBalance || NFTBalance.length < 1) return <h1>Loading NFTs</h1>


  const listitems = NFTBalance.map(collection => {
    const listitemstest = collection.nft_data.map((NFT:any) => <NFTcard key={`${NFT.token_id}+${collection.contract_address}`} NFTitem={NFT} NFTcollection={collection}/>)
    return listitemstest
  })
  return (
    <>
    {listitems}
    </>
  )
}

export default NFTlist