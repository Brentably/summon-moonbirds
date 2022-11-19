import React, {useEffect, useState} from 'react'
import getLendedNFTBalance from '../helpers/getLendedNFTBalance'
import getNFTBalance from "../helpers/getNFTBalance"

import IConnection from '../types/types'
import LendNFTCard from './LendNFTCard'


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
  
   
  //  const listitems = NFTBalance.map(collection => {
     
  //    const listitemstest = collection.nft_data.map((NFT:any) => {
  //    return (
  //    <LendNFTCard key={`${NFT.token_id}+${collection.contract_address}`} NFTitem={NFT} NFTcollection={collection} store={store}/>
  //  )})
  //    return listitemstest
  //  })
  //  return (
  //    <>
  //    {listitems}
  //    </>
  //  )


  return <h1>lended NFT's here</h1>
}

export default LendedNFTList