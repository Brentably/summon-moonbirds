import React, {useCallback, useEffect, useReducer, useState} from 'react'
import getLendedNFTBalance from '../helpers/getLendedNFTBalance'
import getNFTBalance from "../helpers/getNFTBalance"

import IConnection from '../types/types'
import retrieve from '../walletFunctions/retrieve'

import Loader from './Loader'
import NFTCard from './NFTCard'



function reducer(state:Array<any> | undefined, action: any) {
  switch (action.type) {
    case 'set':
      return [...action.payload];
    case 'updateStatus':
      if(!state) return
      const [tokenAddress, tokenId, status] = action.payload
      const newNFTBalance = state.map(NFT => {
       if(NFT.tokenAddress == tokenAddress && NFT.token_id == tokenId) return {...NFT, status: status}
       else return NFT
     })
      return newNFTBalance;
    default:
      throw new Error();
  }
}


// lets look at every safeTransferFrom(SummonManager,...) (1 call), then query all the data for every token...
function LendedNFTList(props: {store:any}) {
  //  // that means the first thing we need to do is determine which address we're showing NFT's for
  const {store} = props
  const {connection, summonAddress} = store[0]
  const {walletAddress, chainID} = connection

  const [LendedNFTState, dispatch] = useReducer(reducer, []);
 


 
   useEffect(() => {
     
     async function updateNFTs() {
      if(!walletAddress || !chainID) return
       const NFTBalance:any[] = await getLendedNFTBalance(connection)
       dispatch({type: 'set', payload: NFTBalance})
      //  setLendedNFTBalance(NFTBalance)
       console.log(NFTBalance)
 
     }
     updateNFTs()
   }, [walletAddress, chainID])

   
   



 
   function handleRetrieve(contractAddress:string, tokenId:string) {
    const updateNFTStatus = (tokenAddress: string, tokenId:string, status:string) => {


      dispatch({type: "updateStatus", payload: [tokenAddress, tokenId, status]})
  
      }

    retrieve(contractAddress, tokenId, connection, updateNFTStatus)
  }




 
 
  if(!walletAddress) return null
  if(!LendedNFTState) return <Loader />
  // if(LendedNFTBalance.length == 0) return null




   
   const listitems = LendedNFTState.map(asset => {
    // console.log(asset)
    const {image, name, token_id, collectionName, tokenAddress, NFTTitle, isVideo, status} = asset



    return <NFTCard key={tokenAddress+token_id} icon={image} isVideo={isVideo} NFTTitle={NFTTitle} collectionName={collectionName} buttonText={status == "lended" ? "retrieve" : status} onButton={() => handleRetrieve(tokenAddress, token_id)} loader={status == "retrieving"} noButton={status=="retrieved"} />
    
   })



   return (
     <>
     {listitems}
     </>
   )


}

export default LendedNFTList


