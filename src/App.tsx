import {useEffect, useState} from 'react';
import { ethers } from "ethers";
import './App.css';
import WalletConnect from "@walletconnect/client";
import { IClientMeta, IWalletConnectSession } from '@walletconnect/types'
import useWalletConnect from './hooks/useWalletConnect'
import QRCodeModal from "@walletconnect/qrcode-modal";
import { parseUri } from '@walletconnect/utils'




function App() {

  const [provider, setProvider] = useState<any>(null)
  const [signer, setSigner] = useState<any>(null)
  const [payload, setPayload] = useState<any>(null)
  // const [uri, setUri] = useState<any>("")
  // const [connector, setConnector] = useState<WalletConnect | undefined>()

  const uri = 'wc:04fc808c-2986-4cb0-993b-dd787694ccb0@1?bridge=https%3A%2F%2Fg.bridge.walletconnect.org&key=f33265b24c47fe6b371382c4f6ee8da0466570e4e1c11b609eaeaa1bef42576e'



  

const connector = new WalletConnect({
  uri: uri,
  clientMeta: {
    description: "WalletConnect Developer App",
    url: "https://walletconnect.org",
    icons: ["https://walletconnect.org/walletconnect-logo.png"],
    name: "WalletConnect",
  }
})

  if (!connector.connected) {
    // create new session
    connector.createSession();
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
        '0xB7A453Ee4a8850cc8A738021245c5e08B8CaB378'
      ],
      chainId: 5   }) 
    // Handle Session Request
  
    /* payload:
    {
      id: 1,
      jsonrpc: '2.0'.
      method: 'session_request',
      params: [{
        peerId: '15d8b6a3-15bd-493e-9358-111e3a4e6ee4',
        peerMeta: {
          name: "WalletConnect Example",
          description: "Try out WalletConnect v1.0",
          icons: ["https://example.walletconnect.org/favicon.ico"],
          url: "https://example.walletconnect.org"
        }
      }]
    }
    */
  });


  connector.on("call_request", (error, payload) => {
    if (error) {
      throw error;
    }
  
    console.log("call req")
    console.log(payload)

    connector.approveRequest({
      id: 1,
      result: "0x41791102999c339c844880b23950704cc43aa840f3739e365323cda4dfa89e7a"
    });
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
    if (error) {
      throw error;
    }
  
     // Delete connector
});


    console.log(connector)



  const connect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
    console.log(provider)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    setProvider(provider)
    setSigner(signer)

    
    }

    const funcOne = () => {
      console.log("func One")

    }

    const funcTwo = () => {
      console.log("func two")
      console.dir(connector)
      
    }

    const funcThree = () => {
      console.log("func three")
      
    }

  return (
    <div className="App">
      <button onClick={connect}>{signer ? "connected" : "connect wallet"}</button>
      {/* <input type="text" value={uri} onChange={(e:any) => setUri(e.target.value)}/> */}
      <button onClick={funcOne}>funcOne</button>
      <button onClick={funcTwo}>funcTwo</button>
      <button onClick={funcThree}>funcThree</button>
      {/* <button onClick={wcConnect}>WC connect</button> */}
      <h1>hefhoiodlk</h1>
    </div>
  );
}

export default App;
