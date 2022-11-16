import {useEffect, useState, createContext, useContext} from 'react';
import { ethers } from "ethers";
import './App.css';
import WalletConnect from "@walletconnect/client";
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import SafeServiceClient from '@gnosis.pm/safe-service-client'
import Safe, { SafeFactory } from '@gnosis.pm/safe-core-sdk'
import { ContractNetworksConfig } from '@gnosis.pm/safe-core-sdk'
import { SafeTransactionDataPartial } from '@gnosis.pm/safe-core-sdk-types'
import NFTlist from './components/NFTlist'

import getSummonSafe from './helpers/getSummonSafe';
import IConnection from './types/types'




function App() {
  const [lendSelected, setLendSelected] = useState<boolean>(true)
  // const [provider, setProvider] = useState<any>(null)
  // const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null)
  // const [walletAddress, setWalletAddress] = useState<string>("") // wallet address of connected wallet
  // const [chainID, setChainID] = useState<number>(0)
  // const [safeAddress, setSafeAddress] = useState<string>("loading") // 0x897C500f2196bD04b3f89B22727746c70Dc6b231
  const [connection, setConnection] = useState<IConnection>({provider: undefined, signer: undefined, walletAddress: "", chainID: undefined, safeAddress: ""})
  //destructure connection
  const {provider, signer, walletAddress, chainID, safeAddress} = connection

  const [uri, setUri] = useState<any>("") // wallet connect URI


  const rejectWithMessage = (connector: WalletConnect, id: number | undefined, message: string) => {
    connector.rejectRequest({ id, error: { message } })
  }
  

  
  
const onUriChange = async () => {
  if(!uri) return // called on component did mount, so there will have to return for the times there is not a uri
  if(!uri.startsWith("wc:")) {
    console.error("onUriChange was called, but the URI doesn't start with wc:")
  }
  if(!signer || !safeAddress) {
    console.error("onUriChange was called, but it's missing the signer or safe address")
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
        safeAddress
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

const connect = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
  if(!provider) return
  // refreshes things on network changs
  provider.on("network", (newNetwork, oldNetwork) => {
    // When a Provider makes its initial connection, it emits a "network"
    // event with a null oldNetwork along with the newNetwork. So, if the
    // oldNetwork exists, it represents a changing network
    if (oldNetwork) {
        window.location.reload();
    }
  })
  // console.log(provider)
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner()
  // setProvider(provider)
  // setSigner(signer)
  const walletAddress = await signer.getAddress()
  // setWalletAddress(walletAddress)
  const chainID = await signer.getChainId()
  // setChainID(chainID)

  const SummonSafe = "0x51148060911b6669E5edc27A4500624516A5ae14"
  // setSafeAddress(SummonSafe)

  setConnection({
  provider: provider,
  signer: signer,
  walletAddress: walletAddress,
  chainID: chainID,
  safeAddress: SummonSafe})


}

  

useEffect(()=> {connect()}, [])


useEffect(() => console.log(connection), [connection])


const testFunc = async () => {



}
  const isSafeFound = safeAddress != "NO_SAFE_FOUND" && safeAddress != ""
  return (
    <div className="App">
      <div className="summonHeader">
      <span className="summonHeaderText">summon </span>
      <button onClick={connect} className={signer ? "connect connected" : "connect notConnected"}> </button>
      </div>
      {/* remove in future */}
      <input type="text" value={`${uri}`} onChange={(e) => setUri(e.target.value)} />
      <br /><br />
      <button onClick={testFunc}>TESTING BUTTTION</button>
      {/* remove in future */}

      
      <div className="tabsContainer">
      <span className={lendSelected ? "tabs selected" : "tabs"} onClick={()=> setLendSelected(true)}>lend</span> 
      <span className={lendSelected ? "tabs" : "tabs selected"} onClick={()=> setLendSelected(false)}>borrow</span></div>

    <div className={lendSelected ? "" : "invisible"}>
      {(walletAddress != undefined) ? <NFTlist connection={connection} isSafe={false} /> : <h1>NO WALLET CONNECTED</h1> }
    </div>
    <div className={lendSelected ? "invisible" : ""}>
      {isSafeFound ? <NFTlist connection={connection} isSafe={true} /> : <h1>NO SAFE FOUND</h1> }
    </div>





    {/* this is what I want to do, but it's calling the API every time I switch tabs, so I've come up with the solution above :/ */}
    {/* {lendSelected ? <NFTlist address={walletAddress} chainID={chainID} isSafe={false} /> : <NFTlist address={safeAddress} chainID={chainID} isSafe={true} />} */}

    </div>
  );
}

export default App;
