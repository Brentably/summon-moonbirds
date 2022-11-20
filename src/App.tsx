import {useEffect, useState, createContext, useContext} from 'react';
import { ethers } from "ethers";
import './App.css';
import WalletConnect from "@walletconnect/client";
import NFTList from './components/NFTList'
import LendedNFTList from './components/LendedNFTList'
import IConnection from './types/types'
import getConnection from './helpers/getConnection';
import Header from './components/Header';
import DeploySummon from './components/DeploySummon';
import Lending from './components/Lending'
import getSummonAddress from './helpers/getSummonAddress';
import walletConnectLogo from './template/walletConnectHQ.png'
import Loader from './components/Loader';






function App() {

  const store = useState<{connection: IConnection, summonAddress: string, uri: string, uriValid: boolean, view: string, lendData: any}>({
    connection: {provider: undefined, signer: undefined, walletAddress: "", chainID: 0},
    summonAddress: "",
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
  })
  const [state, setState] = store
  const {connection, summonAddress, uri, uriValid, view} = state
  const {provider, signer, walletAddress, chainID} = connection
  
  // const [uri, setUri] = useState<any>("") // wallet connect URI

  
  const rejectWithMessage = (connector: WalletConnect, id: number | undefined, message: string) => {
    connector.rejectRequest({ id, error: { message } })
  }
  
  
  useEffect(() => {
  const onUriChange = async () => {
    let uriValid = (uri.length >= 12 && uri.startsWith('wc:') || uri.length == 0) // 12 is random i didnt actually look that up
    setState({...state, uriValid: uriValid })
    
    if(!uri) return // called on component did mount, so there will have to return for the times there is not a uri
    if(!signer || !summonAddress) {
      console.error("onUriChange was called, but it's missing the signer or summon address")
      return
    }
    
    console.log("init new connector")
 const connector = await new WalletConnect({
  uri: uri,
  // bridge: "https://bridge.walletconnect.org"
  // ,
  clientMeta: {
    description: "WalletConnect Developer App",
    url: "https://walletconnect.org",
    icons: ["https://walletconnect.org/walletconnect-logo.png"],
    name: "WalletConnect",
  }
  })

  console.log(connector)



  if (!connector.connected) {
    console.log('bop')
    // create new session
    const createSession = async () => {
    await connector.createSession();
    }
    createSession()
  }


  connector.on("connect", ()=> console.log('connect'))

  connector.on("session_request", (error, payload) => {
    if (error) {
      throw error;
    }
    console.log("session req")
    console.log(payload)

    connector.approveSession({
      accounts: [                 // required
        summonAddress
      //  '0xa0f43C52211DEf09Be4cdEAB5cC0a19E0baBe88a'
      ],
      chainId: 5   }) 

  });


  connector.on("call_request", async (error, payload) => {
    if (error) {
      throw error;
    }
  
    console.log("call req")
    console.log(payload)

    console.log(payload.id)
    if(payload.method != "personal_sign") {
    connector.approveRequest({
      id: payload.id,
      result: `payload ${payload.id} approved`
    });
  }
  
    if(payload.method == "personal_sign") {
  const message = payload.params[0]
  const wallet = payload.params[1]
  const signedMessage = await signer?.signMessage(ethers.utils.toUtf8String(message))

  console.log(`message is ${message}`)
  console.log(`wallet is ${wallet}`)
  console.log(`signed message is ` + await signedMessage)
    
  connector.approveRequest({
    id: payload.id,
    result: signedMessage
  })


  }
    // Handle Call Request
  
    /* payload:
    {
      id: 1,
      jsonrpc: '2.0'.
      method: 'eth_sign',
      params: [
        "0xbc28ea04101f03ea7a94c1379bc3ab32e65e62d3",
        "My email is john@doe.com - 1537836206101"
      ]
    }
    */
  });

  connector.on("disconnect", (error, payload) => {
    console.log("DISCONNENCTEJNELKJ")
    if (error) {
      throw error;
    }
  
     // Delete connector
});


console.log(connector)

} 
onUriChange() 

}, [uri])




useEffect(()=> {
  const thisPatternIsStupid = async() => {
    let newConnection:IConnection = await getConnection()
    setState({...state, connection: {...newConnection}})

    //maybe move this to another useEffect
    let summonAddress:string = await getSummonAddress(newConnection)
    setState({...state, connection: {...newConnection}, summonAddress: summonAddress}) //set states are async but destructuring should take care of any issues
  }
  thisPatternIsStupid()
}, [])





useEffect(() => {console.log(`view changed to: ${view}`)}, [view])

const testFunc = async () => {
}






  return (
    <div className="App">
 
    <div className={view == "lend" || view == "borrow" ? "" : "invisible"}>

      <Header store={store} />

    </div>

    <div className={view == "lend" ? "tabContainer" : "invisible"}>

      <LendedNFTList store={store} />
      
      <NFTList store={store} isSummon={false} />
    </div>

        
    <div className={view == "borrow" ? "" : "invisible"}>
      <div className={summonAddress != "needs" ? "tabContainer" : "invisible"}>
        <div className="walletConnectContainer">
          <img src={walletConnectLogo} className="walletConnectLogo" />
          <input type="text" className={uriValid ? "" : "invalidInput"} placeholder="Paste Connection Link" value={`${uri}`} onChange={(e) => setState({...state, uri: e.target.value})} />
        </div>
        <h3 className='sub left'>Your borrowed NFTs</h3>
        <NFTList store={store} isSummon={true} />
      </div>
      <div className={summonAddress == "needs" ? "tabContainer" : "invisible"}>
        <DeploySummon store={store}/>
      </div>
    </div>

    <div className={view == "lending" ? "" : "invisible"}>

      <Lending store={store} />
    </div>


    {/* this is what I want to do, but it's calling the API every time I switch tabs, so I've come up with the solution above :/ */}
    {/* {lendSelected ? <NFTlist address={walletAddress} chainID={chainID} isSummon={false} /> : <NFTlist address={summonAddress} chainID={chainID} isSummon={true} />} */}

    </div>
  );
}

export default App;
