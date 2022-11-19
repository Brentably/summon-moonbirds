import React, {useEffect, useState} from 'react'
import getLendedNFTBalance from '../helpers/getLendedNFTBalance'
import getNFTBalance from "../helpers/getNFTBalance"

import IConnection from '../types/types'
import LendNFTCard from './LendNFTCard'
import NFTCard from './NFTCard'


// lets look at every safeTransferFrom(SummonManager,...) (1 call), then query all the data for every token...
function LendedNFTList(props: {store:any}) {
  //  // that means the first thing we need to do is determine which address we're showing NFT's for
   const {store} = props
   const {connection, summonAddress} = store[0]
   const {walletAddress, chainID} = connection
 
   const [LendedNFTBalance, setLendedNFTBalance] = useState<Array<any> | undefined>(undefined)
   
 
 
  //  //instead of useNFTBalance being a hook that you pass the setNFTBalance function to, turn it into an async helper function called getNFTBalance(walletAddress, chainID)
  //  //setNFTBalance to getNFTBalance on componentDidMount
  //  // useNFTBalance(setNFTBalance, walletAddress, chainID) 
 
   useEffect(() => {
     
     async function updateNFTs() {
      if(!walletAddress || !chainID) return
       const NFTBalance:(any[] | undefined) = await getLendedNFTBalance(connection)
       setLendedNFTBalance(NFTBalance)
 
 
       console.log(NFTBalance)
 
     }
     updateNFTs()
   }, [walletAddress, chainID])
 
 
     
 
 

  if(!walletAddress) return null
  if(LendedNFTBalance == undefined) return <h1>Loading Lended NFT's</h1>
  if(LendedNFTBalance.length == 0) return <h1>No NFT's Found</h1>
  
   function handleRetrieve() {
    console.log(`retrieve`)
   }


   
   const listitems = LendedNFTBalance.map(asset => {
    console.log(asset)
    const {image_url: image, name, token_id, collection: {name: collectionName}} = asset
    const NFTTitle = name ? `${name} #${token_id}` : `#${token_id}`
    const isVideo = image && image.endsWith(".mp4")
    return <NFTCard key={asset.asset_contract.address+token_id} icon={image} isVideo={isVideo} NFTTitle={NFTTitle} collectionName={collectionName} buttonText="retrieve" onButton={handleRetrieve} />
   })




  //  const listitems = NFTBalance.map(collection => {
     
  //    const listitemstest = collection.nft_data.map((NFT:any) => {
  //    return (
  //    <NFTCard icon={image} isVideo={isVideo} NFTTitle={NFTTitle} collectionName={collectionName} buttonText="lend" onButton={handleClick} bright/>
  //  )})
  //    return listitemstest
  //  })
   return (
     <>
     {listitems}
     </>
   )






  return <h1>lended NFT's here</h1>
}

export default LendedNFTList