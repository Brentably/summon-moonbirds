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







function App() {

  const store = useState<{connection: IConnection, uri: string, view: string, action: any}>({
    connection: {provider: undefined, signer: undefined, walletAddress: "", chainID: undefined, summonAddress: ""},
    uri: "",
    view: 'lend',
    action: {
      lend: {
        started: false,
        tokenAddress: "",
        tokenId: null,
        toAddress: "",
        image: "",
        name: "",
        collectionName: "",
        NFTTitle: "",
        isVideo: false
      }
    }
  })
  const [state, setState] = store
  const {connection, uri, view} = state
  const {provider, signer, walletAddress, chainID, summonAddress} = connection
  
  // const [uri, setUri] = useState<any>("") // wallet connect URI

  
  const rejectWithMessage = (connector: WalletConnect, id: number | undefined, message: string) => {
    connector.rejectRequest({ id, error: { message } })
  }
  
  
  
  const onUriChange = async () => {
    if(!uri) return // called on component did mount, so there will have to return for the times there is not a uri
    if(!uri.startsWith("wc:")) {
      console.error("onUriChange was called, but the URI doesn't start with wc:")
    }
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
    console.log('anything random')
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

} //end onUriChange

useEffect(() => {onUriChange()}, [uri])




useEffect(()=> {
  const thisPatternIsStupid = async() => {
    let newConnection:IConnection|undefined = await getConnection(connection)
    setState({...state, connection: {...newConnection}})
  }
  thisPatternIsStupid()
}, [])


useEffect(() => {console.log(connection)}, [connection])
useEffect(() => {console.log(view)}, [view])

const testFunc = async () => {
}






  return (
    <div className="App">
 
    <div className={view == "lend" || view == "borrow" ? "" : "invisible"}>

      <Header store={store} />

    </div>

    <div className={view == "lend" ? "" : "invisible"}>

      <LendedNFTList store={store} />
      
      <NFTList store={store} isSummon={false} />
    </div>


    <div className={view == "borrow" && summonAddress != "needs" ? "" : "invisible"}>
      
      <input type="text" value={`${uri}`} onChange={(e) => setState({...state, uri: e.target.value})} />
      <NFTList store={store} isSummon={true} />
    </div>

    <div className={view == "borrow" && summonAddress == "needs" ? "" : "invisible"}>

      <DeploySummon store={store}/>
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
