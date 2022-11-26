import React, {useCallback, useEffect, useState} from 'react'
import getNFTBalance from "../helpers/getNFTBalance"
import getSummonNFTBalance from "../helpers/getSummonNFTBalance"

import IConnection, { IAsset } from '../types/types'
import lend from '../walletFunctions/lend'
import SummonNFTCard from './SummonNFTCard'
import Loader from './Loader'
import NFTCard from './NFTCard'



//NFT list works to render a list of NFT's whether its NFT's in a wallet, or NFT's in a summon wallet
function NFTList(props: {store:any, isSummon: boolean}) {
  // that means the first thing we need to do is determine which address we're showing NFT's for
  const {store: [state, dispatch], isSummon} = props
  const {connection, summonAddress, MainNFTBalance, SummonNFTBalance} = state
  const {walletAddress, chainID} = connection
  const address = isSummon ? summonAddress : walletAddress
  const NFTBalance = isSummon ? SummonNFTBalance : MainNFTBalance

  // const [NFTBalance, setNFTBalance] = useState<Array<any> | undefined>(undefined)
  


  //instead of useNFTBalance being a hook that you pass the setNFTBalance function to, turn it into an async helper function called getNFTBalance(walletAddress, chainID)
  //setNFTBalance to getNFTBalance on componentDidMount
  // useNFTBalance(setNFTBalance, walletAddress, chainID) 

  useEffect(() => {
    
    async function updateNFTs() {
      if(!address || !chainID || address == "needs") return
      
      function delay(time:number) {
        return new Promise((resolve) => setTimeout(resolve, time))
      }
      // if(!isSummon) return //for testing

      await delay(1000)
      if(isSummon) await delay(1000)
      const NFTBalance:any[] = isSummon ? await getSummonNFTBalance(connection) : await getNFTBalance(address, chainID)

      // const NFTBalance:any[] = await getNFTBalance(address, chainID)
      isSummon ? dispatch({type: "set", payload: {SummonNFTBalance: NFTBalance}}) : dispatch({type: "set", payload: {MainNFTBalance: NFTBalance}})

      console.log(NFTBalance)


    }
    updateNFTs()
  }, [address, chainID])


function handleLend(asset:any) {
  const {image, name, token_id, collectionName, tokenAddress, NFTTitle, isVideo} = asset

  dispatch({type: "set",
  payload: { 
    view: "lending",
    lendData: {
      started: true,
      tokenAddress: tokenAddress,
      tokenId: token_id,
      toAddress: "",
      image: image,
      name: name,
      collectionName: collectionName,
      NFTTitle: NFTTitle,
      isVideo: isVideo
    }
  }
  })
}
    



if(address == "needs") return <h3 className="sub left">No NFTs Found</h3>
  if(!address) return <h1>connect wallet</h1>
  if(!NFTBalance) return <Loader />
  if(NFTBalance.length < 1 && isSummon) return <h3 className="sub left">No NFTs Found... try lending one to yourself :)</h3>
  if(NFTBalance.length < 1) return <h3 className="sub left">No NFTs Found, <a href="https://goerli-nfts.vercel.app/" target="_blank">mint Goerli NFT's here</a></h3>
  
  
  

  const listitems = NFTBalance.map((asset: IAsset)=> {

    const {image, name, token_id, collectionName, tokenAddress, NFTTitle, isVideo} = asset


    if(isSummon) return <NFTCard key={tokenAddress+token_id} icon={image} isVideo={isVideo} NFTTitle={NFTTitle} collectionName={collectionName} />

    return <NFTCard key={tokenAddress+token_id} icon={image} isVideo={isVideo} NFTTitle={NFTTitle} collectionName={collectionName} buttonText="lend" onButton={() => handleLend(asset)} bright />
  

  })

  return (
    <>
    {listitems}
    </>
  )


  

}

export default NFTList