import React, {useEffect, useState} from 'react'
import getNFTBalance from "../helpers/getNFTBalance"
import NFTcard from './NFTcard'

type INFTList = {
  address: string,
  chainID: number,
  isSafe: boolean
}

function NFTlist(props : INFTList) {
  const {address, chainID, isSafe} = props
  const [NFTBalance, setNFTBalance] = useState<Array<any> | undefined>([])
  

  
  //instead of useNFTBalance being a hook that you pass the setNFTBalance function to, turn it into an async helper function called getNFTBalance(walletAddress, chainID)
  //setNFTBalance to getNFTBalance on componentDidMount
  // useNFTBalance(setNFTBalance, walletAddress, chainID) 

  useEffect(() => {
    async function updateNFTs() {
      const NFTBalance:(any[] | undefined) = await getNFTBalance(address, chainID)
      setNFTBalance(await NFTBalance)
    }
    updateNFTs()
  }, [address, chainID])


    



  if(!address) return <h1>connect wallet</h1>
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