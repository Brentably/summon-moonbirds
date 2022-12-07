import {useEffect, useState, createContext, useContext, useReducer} from 'react';
import { ethers } from "ethers";
import './App.css';
import WalletConnect from "@walletconnect/client";
import NFTList from './components/NFTList'
import LendedNFTList from './components/LendedNFTList'
import { IAsset, IState } from './store/types'
import getConnection from './helpers/getConnection';
import Header from './components/Header';
import DeploySummon from './components/DeploySummon';
import Lending from './components/Lending'
import getSummonAddress from './helpers/getSummonAddress';
import Loader from './components/Loader';
import Footer from './components/Footer';
import WalletConnectComponent from './components/WalletConnectComponent';
import { useConnectWallet } from '@web3-onboard/react';
import { useWeb3Onboard } from '@web3-onboard/react/dist/context';
import { GlobalContext, useGlobalStore } from './store/context';










function App() {
  const store:[IState, React.Dispatch<any>] = useGlobalStore()
  const [state, dispatch] = store
  const {connection, summonAddress, uri, uriValid, view} = state
  const {provider, signer, walletAddress, chainID} = connection
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const onboard = useWeb3Onboard()
  // const [uri, setUri] = useState<any>("") // wallet connect URI
  
  useEffect(() => {

    const stupid = async () => {
        // If the wallet has a provider than the wallet is connected
      if (wallet) {
        let newConnection = await getConnection(wallet.provider)
        console.log(newConnection)
        dispatch({type: 'set', payload: {connection: newConnection}})
      }}
    stupid()
    }, [])

    
  const rejectWithMessage = (connector: WalletConnect, id: number | undefined, message: string) => {
    connector.rejectRequest({ id, error: { message } })
  }
  
  
  // useEffect(() => {
  //   const stupid = async () => {
  //     // If the wallet has a provider than the wallet is connected
  //     if (wallet?.provider) {
  //       let newConnection = await getConnection(wallet.provider)
  //       dispatch({type: 'set', payload: {connection: newConnection}})
  
  //   }}
  
  //   stupid()
  // }
  // , [wallet])



// useEffect(()=> {
//   const thisPatternIsStupid = async() => {
//     let newConnection:IConnection = await getConnection()
//     dispatch({type: "set", payload: {connection: {...newConnection}}})
//   }
//   thisPatternIsStupid()
// }, [])



useEffect(()=> {
  const thisPatternIsStupid = async() => {
    // let newConnection:IConnection = await getConnection()
    // dispatch({type: "set", payload: {connection: {...newConnection}}})

    let summonAddress:string = await getSummonAddress(connection)
    dispatch({type: "set", payload: {summonAddress: summonAddress}})
  }
  thisPatternIsStupid()
}, [connection])





useEffect(() => {console.log(`view changed to: ${view}`)}, [view])



  return (
    <GlobalContext.Provider value={store}>
    <div className="App">
 
    <div className={view == "lend" || view == "borrow" ? "" : "invisible"}>

      <Header />

    </div>
    {chainID != 5 && chainID != 0 && chainID != 1 && <h3 className='sub'>Summon is currently live on testnet, switch chains to Goerli</h3>}
    {chainID == 1 && <h3 className='sub red'>Summon is experimental on mainnet. <br /> Switch chains to Goerli or use at your own risk.</h3>}
    <div className={view == "lend" ? "tabContainer" : "invisible"}>

      <LendedNFTList />
      
      <NFTList isSummon={false} />
    </div>

        
    <div className={view == "borrow" ? "" : "invisible"}>
      <div className="tabContainer">
        <WalletConnectComponent />
        <h3 className='sub left'>Your borrowed NFTs</h3>
        <NFTList isSummon={true} />
      </div>
      {/* <div className={summonAddress == "needs" ? "tabContainer" : "invisible"}>
        <h3 className="sub">nobody has lended you anything. hint: try lending yourself something</h3>
        {/* <DeploySummon store={store}/> */}
      {/* </div> */} 
    </div>

    {/* <div className={view == "lending" ? "" : "invisible"}>

      <Lending store={store} />
    </div> */}
    {view == "lending" && <Lending/>}

    {/* this is what I want to do, but it's calling the API every time I switch tabs, so I've come up with the solution above :/ */}
    {/* {lendSelected ? <NFTlist address={walletAddress} chainID={chainID} isSummon={false} /> : <NFTlist address={summonAddress} chainID={chainID} isSummon={true} />} */}
    <Footer />
    </div>
    </GlobalContext.Provider>
  );
}

export default App;
