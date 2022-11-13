import React, {useEffect, useState} from 'react'
import getNFTBalance from "../helpers/getNFTBalance"
import NFTcard from './NFTcard'

type INFTList = {
  walletAddress: String
  chainID: number
}

function NFTlist(props : INFTList) {
  const {walletAddress, chainID} = props
  const [NFTBalance, setNFTBalance] = useState<Array<any> | undefined>([])
  


  //instead of useNFTBalance being a hook that you pass the setNFTBalance function to, turn it into an async helper function called getNFTBalance(walletAddress, chainID)
  //setNFTBalance to getNFTBalance on componentDidMount
  // useNFTBalance(setNFTBalance, walletAddress, chainID) 

  useEffect(() => {
    async function updateNFTs() {
      const NFTBalance:(any[] | undefined) = await getNFTBalance(walletAddress, chainID)
      setNFTBalance(await NFTBalance)
    }
    updateNFTs()
  }, [walletAddress, chainID])


    



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