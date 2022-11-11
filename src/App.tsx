import {useEffect, useState} from 'react';
import { ethers } from "ethers";
import './App.css';
import WalletConnect from "@walletconnect/client";




function App() {
  const [lendSelected, setLendSelected] = useState<boolean>(true)

  const [provider, setProvider] = useState<any>(null)
  const [signer, setSigner] = useState<any>(null)
  const [payload, setPayload] = useState<any>(null)
  // const [uri, setUri] = useState<any>("")
  // const [connector, setConnector] = useState<WalletConnect | undefined>()

  const uri = 'wc:85956887-bb5e-4aa8-b8d6-02fc75f8a1ae@1?bridge=https%3A%2F%2Fsafe-walletconnect.safe.global%2F&key=9b9d8d98cf5655a44f0faee76c344dd8579ca1cf591cd9454728f2bde73b9151'



  
  
  const onPageLoad = async () => {
  
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



// connector.killSession()


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
    console.log("DISCONNENCTEJNELKJ")
    if (error) {
      throw error;
    }
  
     // Delete connector
});


    console.log(connector)

}
onPageLoad()

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
      // console.dir(connector)
      
    }

    const funcThree = () => {
      console.log("func three")
      
    }

  return (
    <div className="App">
      <div className="summonHeader">
      <span className="summonHeaderText">summon </span>
      <button onClick={connect} className={signer ? "connect connected" : "connect notConnected"}> </button>
      </div>
      
      <div className="tabsContainer">
<span className={lendSelected ? "tabs selected" : "tabs"} onClick={()=> setLendSelected(true)}>lend</span> <span className={lendSelected ? "tabs" : "tabs selected"} onClick={()=> setLendSelected(false)}>borrow</span></div>
    </div>
  );
}

export default App;
