import { useReducer } from "react";
import React from 'react'
import type {IAsset, IState} from './types'
// context has to export TWO things now: 1, State (or context, and 2, a function to update it.)

const initialState:IState = {
  connection: {provider: undefined, signer: undefined, walletAddress: "", chainID: null},
  summonAddress: "",
  LendedNFTBalance: undefined,
  MainNFTBalance: undefined,
  SummonNFTBalance: undefined,
  uri: "",
  uriValid: true,
  view: 'lend',
  lendData: {
    started: false,
    tokenAddress: "",
    tokenId: null,
    image: "",
    name: "",
    collectionName: "",
    NFTTitle: "",
    isVideo: false
  },
  connector: null
}


function reducer(state: IState, action: {type: string, payload: any, target?: string}) {
  switch (action.type) {
    case 'set':
      console.log('reducer updating state:', action.payload)
      return {...state, ...action.payload};
    case 'updateNFTStatus':
      if(!action.target) return
      const [tokenAddress, tokenId, status] = action.payload
      const newNFTBalance = state[action.target as keyof IState].map((NFT: IAsset) => {
        if(NFT.tokenAddress == tokenAddress && NFT.token_id == tokenId) return {...NFT, status: status}
        else return NFT
      })
      return {...state, [action.target as keyof IState]: newNFTBalance};
    default:
      throw new Error();
  }
}

export const GlobalContext = React.createContext<[IState, React.Dispatch<unknown> | (() => void)]>([initialState, ()=>console.error("dispatch called without init")])

export const useGlobalStore = () => useReducer(reducer, initialState);