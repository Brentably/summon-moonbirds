import React, {useEffect, useState} from 'react'
import getNFTBalance from "../helpers/getNFTBalance"
// import NFTCard from './NFTCard'
import IConnection from '../types/types'


//NFT list works to render a list of NFT's whether its NFT's in a wallet, or NFT's in a summon wallet
function LendedNFTList(props: {connection: IConnection}) {
  // that means the first thing we need to do is determine which address we're showing NFT's for
  const {connection} = props
  const {chainID} = connection

  // const [NFTBalance, setNFTBalance] = useState<Array<any> | undefined>(undefined)
  


  // //instead of useNFTBalance being a hook that you pass the setNFTBalance function to, turn it into an async helper function called getNFTBalance(walletAddress, chainID)
  // //setNFTBalance to getNFTBalance on componentDidMount
  // // useNFTBalance(setNFTBalance, walletAddress, chainID) 

  // useEffect(() => {
    
  //   async function updateNFTs() {
  //     if(!address || !chainID) return
  //     const NFTBalance:(any[] | undefined) = await getNFTBalance(address, chainID)
  //     setNFTBalance(NFTBalance)


  //     console.log(NFTBalance)

  //   }
  //   updateNFTs()
  // }, [address, chainID])


    

return <h1>currently lended nft's here</h1>

  // if(!address) return <h1>connect wallet</h1>
  // if(!NFTBalance) return <h1>Loading NFTs</h1>
  // if(NFTBalance.length < 1) return <h1>no nft's :/</h1>


  // const listitems = NFTBalance.map(collection => {
  //   const listitemstest = collection.nft_data.map((NFT:any) => <NFTCard key={`${NFT.token_id}+${collection.contract_address}`} NFTitem={NFT} NFTcollection={collection} lended />)
  //   return listitemstest
  // })
  // return (
  //   <>
  //   {listitems}
  //   </>
  // )
}

export default LendedNFTList