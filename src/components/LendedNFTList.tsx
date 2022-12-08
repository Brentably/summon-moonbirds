import React, {useCallback, useEffect, useReducer, useState, useContext} from 'react'
// import getLendedNFTBalance from '../helpers/getLendedNFTBalance'
import getLendedMoonbirds from '../helpers/getLendedMoonbirds'
import getNFTBalance from "../helpers/getNFTBalance"
import { GlobalContext } from '../store/context'

import { IAsset } from '../store/types'
import retrieve from '../walletFunctions/retrieve'

import Loader from './Loader'
import NFTCard from './NFTCard'



// function reducer(state:Array<any> | undefined, action: any) {
//   switch (action.type) {
//     case 'set':
//       return [...action.payload];
    
//     default:
//       throw new Error();
//   }
// }


// lets look at every safeTransferFrom(SummonManager,...) (1 call), then query all the data for every token...
function LendedNFTList() {
  //  // that means the first thing we need to do is determine which address we're showing NFT's for
  const [state, dispatch] = useContext(GlobalContext)
  const {connection, summonAddress, LendedNFTBalance} = state
  const {walletAddress, chainID} = connection

 


 
   useEffect(() => {
     
     async function updateNFTs() {
      if(!walletAddress || !chainID) return
       const NFTBalance:IAsset[] = await getLendedMoonbirds(connection)
       dispatch({type: 'set', payload: {LendedNFTBalance: NFTBalance}})
      //  setLendedNFTBalance(NFTBalance)
       console.log(NFTBalance)
 
     }
     updateNFTs()
   }, [walletAddress, chainID])

   
   



 
   function handleRetrieve(contractAddress:string, tokenId:string) {
    const updateNFTStatus = (tokenAddress: string, tokenId:string, status:string) => {


      dispatch({type: "updateNFTStatus", target: "LendedNFTBalance", payload: [tokenAddress, tokenId, status]})//
  
      }

    retrieve(contractAddress, tokenId, connection, updateNFTStatus)
  }




 
 
  if(!walletAddress) return null
  if(!LendedNFTBalance) return <Loader />
  // if(LendedNFTBalance.length == 0) return null




   
   const listitems = LendedNFTBalance.map((asset: IAsset) => {
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


