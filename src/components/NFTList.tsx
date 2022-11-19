import React, {useCallback, useEffect, useState} from 'react'
import getNFTBalance from "../helpers/getNFTBalance"
import LendNFTCard from './LendNFTCard'
import IConnection from '../types/types'
import lend from '../walletFunctions/lend'
import SummonNFTCard from './SummonNFTCard'
import Loader from './Loader'


//NFT list works to render a list of NFT's whether its NFT's in a wallet, or NFT's in a summon wallet
function NFTList(props: {store:any, isSummon: boolean}) {
  // that means the first thing we need to do is determine which address we're showing NFT's for
  const {store, isSummon} = props
  const {connection, summonAddress} = store[0]
  const {walletAddress} = connection
  const address = isSummon ? summonAddress : walletAddress
  const {chainID} = connection

  const [NFTBalance, setNFTBalance] = useState<Array<any> | undefined>(undefined)
  


  //instead of useNFTBalance being a hook that you pass the setNFTBalance function to, turn it into an async helper function called getNFTBalance(walletAddress, chainID)
  //setNFTBalance to getNFTBalance on componentDidMount
  // useNFTBalance(setNFTBalance, walletAddress, chainID) 

  useEffect(() => {
    
    async function updateNFTs() {
      if(!address || !chainID || address == "needs") return
      const NFTBalance:(any[] | undefined) = await getNFTBalance(address, chainID)
      setNFTBalance(NFTBalance)




    }
    updateNFTs()
  }, [address, chainID])


    


  if(address == "needs") return <h1 style={{textAlign: "left"}}>NO Summon Found</h1>
  if(!address) return <h1>connect wallet</h1>
  if(!NFTBalance) return <Loader />
  if(NFTBalance.length < 1 && isSummon) return <h3 className="sub">No NFTs Found</h3>
  if(NFTBalance.length < 1) return <h3 className="sub">No NFTs Found, <a href="https://goerli-nfts.vercel.app/" target="_blank">mint Goerli NFT's here</a></h3>
  

  
  const listitems = NFTBalance.map(collection => {
    
    const listitemstest = collection.nft_data.map((NFT:any) => {
    if(isSummon) return <SummonNFTCard key={`${NFT.token_id}+${collection.contract_address}`} NFTitem={NFT} NFTcollection={collection} store={store}/>

    return <LendNFTCard key={`${NFT.token_id}+${collection.contract_address}`} NFTitem={NFT} NFTcollection={collection} store={store}/>
  })

    return listitemstest
  })
  return (
    <>
    {listitems}
    </>
  )
}

export default NFTList