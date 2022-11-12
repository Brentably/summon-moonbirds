import React, {useEffect, useState} from 'react'
import useNFTBalance from "../hooks/useNFTBalance"
import NFTcard from './NFTcard'

type INFTList = {
  walletAddress: String
}

function NFTlist(props : INFTList) {
  const {walletAddress} = props
  const [NFTBalance, setNFTBalance] = useState<Array<any>>([])
  // const [cardsArray, setCardsArray] = useState<Array<React.ReactElement>>()
  // const [loading, setLoading] = useState<Boolean>(false)
  
  useNFTBalance(walletAddress, setNFTBalance) 
  // setLoading(true)

  // useEffect(() => {NFTBalance && setLoading(false)}, [NFTBalance])
  

    

  let cardsArray:Array<React.ReactElement> = []


  if(!walletAddress) return <h1>connect wallet</h1>
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

  // for(const collection of NFTBalance) {
    
  //   let numCollections = collection.nft_data.length
  //   console.log(numCollections)
  //   for (const NFT of collection.nft_data) {
  //     console.log(collection.indexOf(NFT))

  //     let key = `${collection.index}:${NFT.index}`
  //     let element:React.ReactElement = React.createElement(NFTcard, [key, NFT, collection])
  //     cardsArray.push(element)
  //     console.log(key)
  //     console.log(element)
  //   }
    
  //   // setCardsArray(cardsArray)
  // }

  // return (
  //   <div>
  //     {cardsArray}
  //   {/* <NFTcard NFTitem={NFTBalance[1].nft_data[0]} NFTcollection={NFTBalance[1]}/> */}
  //   </div>
  // )
}

export default NFTlist