import {useEffect, useState, createContext, useContext, useReducer} from 'react';
import { ethers } from "ethers";
import './App.css';
import WalletConnect from "@walletconnect/client";
import NFTList from './components/NFTList'
import LendedNFTList from './components/LendedNFTList'
import IConnection, { IAsset } from './types/types'
import getConnection from './helpers/getConnection';
import Header from './components/Header';
import DeploySummon from './components/DeploySummon';
import Lending from './components/Lending'
import getSummonAddress from './helpers/getSummonAddress';
import Loader from './components/Loader';
import Footer from './components/Footer';
import WalletConnectComponent from './components/WalletConnectComponent';

type IState = {connection: IConnection, summonAddress: string, MainNFTBalance: IAsset[] | undefined, SummonNFTBalance: IAsset[] | undefined, uri: string, uriValid: boolean, view: string, lendData: any}

const initialState = {
  connection: {provider: undefined, signer: undefined, walletAddress: "", chainID: 0},
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
  }
}



function reducer(state: IState, action: {type: string, payload: any, target?: string}) {
  switch (action.type) {
    case 'set':
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


//control f every setState to a dispatch




function App() {

  // const store = useState<>()
  const store = useReducer(reducer, initialState);

  const [state, dispatch] = store
  const {connection, summonAddress, uri, uriValid, view} = state
  const {provider, signer, walletAddress, chainID} = connection

  
  // const [uri, setUri] = useState<any>("") // wallet connect URI
  
  
  
  const rejectWithMessage = (connector: WalletConnect, id: number | undefined, message: string) => {
    connector.rejectRequest({ id, error: { message } })
  }
  
  



useEffect(()=> {
  const thisPatternIsStupid = async() => {
    let newConnection:IConnection = await getConnection()
    dispatch({type: "set", payload: {connection: {...newConnection}}})
  }
  thisPatternIsStupid()
}, [])



useEffect(()=> {
  const thisPatternIsStupid = async() => {
    // let newConnection:IConnection = await getConnection()
    // dispatch({type: "set", payload: {connection: {...newConnection}}})

    let summonAddress:string = await getSummonAddress(connection)
    dispatch({type: "set", payload: {...state, summonAddress: summonAddress }})
  }
  thisPatternIsStupid()
}, [connection])





useEffect(() => {console.log(`view changed to: ${view}`)}, [view])



  return (
    <div className="App">
 
    <div className={view == "lend" || view == "borrow" ? "" : "invisible"}>

      <Header store={store} />

    </div>
    {chainID != 5 && chainID != 0 && chainID != 1 && <h3 className='sub'>Summon is currently live on testnet, switch chains to Goerli</h3>}
    {chainID == 1 && <h3 className='sub red'>Summon is experimental on mainnet. <br /> Switch chains to Goerli or use at your own risk.</h3>}
    <div className={view == "lend" ? "tabContainer" : "invisible"}>

      <LendedNFTList store={store} />
      
      <NFTList store={store} isSummon={false} />
    </div>

        
    <div className={view == "borrow" ? "" : "invisible"}>
      <div className="tabContainer">
        <WalletConnectComponent store={store} />
        <h3 className='sub left'>Your borrowed NFTs</h3>
        <NFTList store={store} isSummon={true} />
      </div>
      {/* <div className={summonAddress == "needs" ? "tabContainer" : "invisible"}>
        <h3 className="sub">nobody has lended you anything. hint: try lending yourself something</h3>
        {/* <DeploySummon store={store}/> */}
      {/* </div> */} 
    </div>

    {/* <div className={view == "lending" ? "" : "invisible"}>

      <Lending store={store} />
    </div> */}
    {view == "lending" && <Lending store={store}/>}

    {/* this is what I want to do, but it's calling the API every time I switch tabs, so I've come up with the solution above :/ */}
    {/* {lendSelected ? <NFTlist address={walletAddress} chainID={chainID} isSummon={false} /> : <NFTlist address={summonAddress} chainID={chainID} isSummon={true} />} */}
    <Footer />
    </div>
  );
}

export default App;
