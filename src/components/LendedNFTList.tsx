import React, {useCallback, useEffect, useState} from 'react'
import getLendedNFTBalance from '../helpers/getLendedNFTBalance'
import getNFTBalance from "../helpers/getNFTBalance"

import IConnection from '../types/types'
import retrieve from '../walletFunctions/retrieve'

import Loader from './Loader'
import NFTCard from './NFTCard'


// lets look at every safeTransferFrom(SummonManager,...) (1 call), then query all the data for every token...
function LendedNFTList(props: {store:any}) {
  //  // that means the first thing we need to do is determine which address we're showing NFT's for
  const {store} = props
  const {connection, summonAddress} = store[0]
  const {walletAddress, chainID} = connection
  const [status, setStatus] = useState<string>("retrieve")
  const [LendedNFTBalance, setLendedNFTBalance] = useState<Array<any> | undefined>(undefined)
  const [payload, setPayload] = useState<any[]>([])
 
 
  //  //instead of useNFTBalance being a hook that you pass the setNFTBalance function to, turn it into an async helper function called getNFTBalance(walletAddress, chainID)
  //  //setNFTBalance to getNFTBalance on componentDidMount
  //  // useNFTBalance(setNFTBalance, walletAddress, chainID) 
 
   useEffect(() => {
     
     async function updateNFTs() {
      if(!walletAddress || !chainID) return
       const NFTBalance:any[] = await getLendedNFTBalance(connection)
       setLendedNFTBalance(NFTBalance)
       console.log(NFTBalance)
 
     }
     updateNFTs()
   }, [walletAddress, chainID])
 

 
   function handleRetrieve(contractAddress:string, tokenId:string) {

    retrieve(contractAddress, tokenId, connection, setStatus)
    setPayload([contractAddress, tokenId])
  }
  const memoizedRetreive = useCallback(handleRetrieve, [connection])



 
 
  if(!walletAddress) return null
  if(!LendedNFTBalance) return <Loader />
  if(LendedNFTBalance.length == 0) return null
  // if(typeof LendedNFTBalance == 'string') return <h1>No NFT's Found</h1>



   
   const listitems = LendedNFTBalance.map(asset => {
    // console.log(asset)
    const {image_url: image, name, token_id, collection: {name: collectionName}, asset_contract: {address: tokenAddress}} = asset
    const NFTTitle = name ? `${name} #${token_id}` : `#${token_id}`
    const isVideo = image && image.endsWith(".mp4")
    const isActiveToken = (tokenAddress == payload[0] && token_id == payload[1])

    return <NFTCard key={tokenAddress+token_id} icon={image} isVideo={isVideo} NFTTitle={NFTTitle} collectionName={collectionName} buttonText={status} onButton={() => memoizedRetreive(tokenAddress, token_id)} loader={isActiveToken && status == "retrieving"} noButton={isActiveToken && status=="retrieved"} />
    
   })



   return (
     <>
     {listitems}
     </>
   )






  return <h1>lended NFT's here</h1>
}

export default LendedNFTList