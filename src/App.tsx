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
import walletConnectLogo from './template/walletConnectHQ.png'
import Loader from './components/Loader';

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
  const [wConnected, setWConnected] = useState(false)
  
  // const [uri, setUri] = useState<any>("") // wallet connect URI
  
  
  
  const rejectWithMessage = (connector: WalletConnect, id: number | undefined, message: string) => {
    connector.rejectRequest({ id, error: { message } })
  }
  
  
  useEffect(() => {
    console.log('useeffect called')
    const onUriChange = async () => {
    let uriValid = (uri.length >= 12 && uri.startsWith('wc:') || uri.length == 0) // 12 is random i didnt actually look that up
    dispatch({type: "set", payload: {uriValid: uriValid }})
    
    if(!uri) return // called on component did mount, so there will have to return for the times there is not a uri
    if(summonAddress == "needs") {
      console.log("on uri change was called but there's no summon address")
      return
    }
    if(!signer || !summonAddress) {
      console.error("onUriChange was called, but it's missing the signer or summon address")
      return
    }
    
    console.log("init new connector")
 const connector = new WalletConnect({
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

  connector.on("connect", () => {
    console.log("WC connected")
    setWConnected(true)
  })


  if (!connector.connected) {
    console.log('bop')
    // create new session
    const createSession = async () => {
    await connector.createSession();
    }
    createSession()
  }



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
  console.log(`signed message is ` + signedMessage)
    
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
    setWConnected(false)
    console.log("DISCONNENCTEJNELKJ")
    if (error) {
      throw error;
    }
  
     // Delete connector
});


console.log(connector)

} 
onUriChange() 

}, [uri, connection, summonAddress])




useEffect(()=> {
  const thisPatternIsStupid = async() => {
    let newConnection:IConnection = await getConnection()
    // setState({...state, connection: {...newConnection}})
    dispatch({type: "set", payload: {connection: {...newConnection}}})
    //maybe move this to another useEffect
    let summonAddress:string = await getSummonAddress(newConnection)
    // setState({...state, connection: {...newConnection}, summonAddress: summonAddress}) //set states are async but destructuring should take care of any issues
    dispatch({type: "set", payload: { connection: {...newConnection}, summonAddress: summonAddress }})
  }
  thisPatternIsStupid()
}, [])





useEffect(() => {console.log(`view changed to: ${view}`)}, [view])



  return (
    <div className="App">
 
    <div className={view == "lend" || view == "borrow" ? "" : "invisible"}>

      <Header store={store} />

    </div>
    {chainID != 5 && chainID != 0 && <h3 className='sub'>Summon is currently live on testnet, switch chains to Goerli</h3>}
    <div className={view == "lend" ? "tabContainer" : "invisible"}>

      <LendedNFTList store={store} />
      
      <NFTList store={store} isSummon={false} />
    </div>

        
    <div className={view == "borrow" ? "" : "invisible"}>
      <div className="tabContainer">
        <div className="walletConnectContainer">
          <img src={walletConnectLogo} className="walletConnectLogo" />
          
            <input type="text" className={wConnected ? "greenBorder" : uriValid ? "" : "invalidInput"} placeholder="Paste Connection Link" value={`${uri}`} onChange={(e) => dispatch({type: 'set', payload: {uri: e.target.value}})} />
          
        </div>
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

    </div>
  );
}

export default App;
