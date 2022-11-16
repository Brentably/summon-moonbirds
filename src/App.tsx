import {useEffect, useState, createContext, useContext} from 'react';
import { ethers } from "ethers";
import './App.css';
import WalletConnect from "@walletconnect/client";
import NFTList from './components/NFTList'
import LendedNFTList from './components/LendedNFTList'
import IConnection from './types/types'
import getSummonAddress from './helpers/getSummonAddress';




function App() {
  const [lendSelected, setLendSelected] = useState<boolean>(true)

  const [connection, setConnection] = useState<IConnection>({provider: undefined, signer: undefined, walletAddress: "", chainID: undefined, summonAddress: ""})
  //destructure connection
  const {provider, signer, walletAddress, chainID, summonAddress} = connection

  const [uri, setUri] = useState<any>("") // wallet connect URI


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

  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner()

  const walletAddress = await signer.getAddress()

  const chainID = await signer.getChainId()


  const summonAddress = await getSummonAddress(walletAddress, chainID)


  setConnection({
  provider: provider,
  signer: signer,
  walletAddress: walletAddress,
  chainID: chainID,
  summonAddress: summonAddress})


}

  

useEffect(()=> {connect()}, [])


useEffect(() => console.log(connection), [connection])


const testFunc = async () => {



}
  const isSummonFound = summonAddress != "NO_SUMMON_FOUND" && summonAddress != ""
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
      {(walletAddress != undefined) ? <><LendedNFTList connection={connection} /><NFTList connection={connection} isSummon={false} /></> : <h1>NO WALLET CONNECTED</h1> }
    </div>
    <div className={lendSelected ? "invisible" : ""}>
      {isSummonFound ? <NFTList connection={connection} isSummon={true} /> : <h1>NO SUMMON FOUND</h1> }
    </div>





    {/* this is what I want to do, but it's calling the API every time I switch tabs, so I've come up with the solution above :/ */}
    {/* {lendSelected ? <NFTlist address={walletAddress} chainID={chainID} isSummon={false} /> : <NFTlist address={summonAddress} chainID={chainID} isSummon={true} />} */}

    </div>
  );
}

export default App;
