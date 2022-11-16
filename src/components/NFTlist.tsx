import React, {useEffect, useState} from 'react'
import getNFTBalance from "../helpers/getNFTBalance"
import NFTcard from './NFTcard'
import IConnection from '../types/types'


//NFT list works to render a list of NFT's whether its NFT's in a wallet, or NFT's in a summon wallet
function NFTlist(props: {connection: IConnection, isSummon: boolean}) {
  // that means the first thing we need to do is determine which address we're showing NFT's for
  const {connection, isSummon} = props
  const address = isSummon ? connection.summonAddress : connection.walletAddress
  const {chainID} = connection

  const [NFTBalance, setNFTBalance] = useState<Array<any> | undefined>(undefined)
  


  //instead of useNFTBalance being a hook that you pass the setNFTBalance function to, turn it into an async helper function called getNFTBalance(walletAddress, chainID)
  //setNFTBalance to getNFTBalance on componentDidMount
  // useNFTBalance(setNFTBalance, walletAddress, chainID) 

  useEffect(() => {
    
    async function updateNFTs() {
      if(!address || !chainID) return
      const NFTBalance:(any[] | undefined) = await getNFTBalance(address, chainID)
      setNFTBalance(await NFTBalance)
    }
    updateNFTs()
  }, [address, chainID])


    



  if(!address) return <h1>connect wallet</h1>
  if(!NFTBalance) return <h1>Loading NFTs</h1>
  if(NFTBalance.length < 1) return <h1>no nft's :/</h1>


  const listitems = NFTBalance.map(collection => {
    const listitemstest = collection.nft_data.map((NFT:any) => <NFTcard key={`${NFT.token_id}+${collection.contract_address}`} NFTitem={NFT} NFTcollection={collection} />)
    return listitemstest
  })
  return (
    <>
    {listitems}
    </>
  )
}

export default NFTlist