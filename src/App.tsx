import {useEffect, useState} from 'react';
import { ethers } from "ethers";
import './App.css';
import WalletConnect from "@walletconnect/client";




function App() {
  const [lendSelected, setLendSelected] = useState<boolean>(true)
  const [safeAddress, setSafeAddress] = useState<any>("0x897C500f2196bD04b3f89B22727746c70Dc6b231")
  const [provider, setProvider] = useState<any>(null)
  const [signer, setSigner] = useState<any>(null)
  const [payload, setPayload] = useState<any>(null)
  const [uri, setUri] = useState<any>("")
  // const [connector, setConnector] = useState<WalletConnect | undefined>()



  const rejectWithMessage = (connector: WalletConnect, id: number | undefined, message: string) => {
    connector.rejectRequest({ id, error: { message } })
  }
  

  
  
const onPageLoad = async () => {
  if(!uri) return
  if(!uri.startsWith("wc:")) return
  
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
  const signedMessage = await signer.signMessage(ethers.utils.toUtf8String(message))

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

} //end onPageLoad 

useEffect(() => {onPageLoad()}, [uri])

  const connect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
    console.log(provider)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    setProvider(provider)
    setSigner(signer)
    }


  //  const testSafe =  new ethers.Contract("0xa0f43C52211DEf09Be4cdEAB5cC0a19E0baBe88a" , abi , signerOrProvider )
  const testFunc = async () => {
    console.log("testing function")
    
  }

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
<span className={lendSelected ? "tabs selected" : "tabs"} onClick={()=> setLendSelected(true)}>lend</span> <span className={lendSelected ? "tabs" : "tabs selected"} onClick={()=> setLendSelected(false)}>borrow</span></div>
    </div>
  );
}

export default App;
