import {useEffect, useState} from 'react';
import { ethers } from "ethers";
import './App.css';
import WalletConnect from "@walletconnect/client";
import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
import SafeServiceClient from '@gnosis.pm/safe-service-client'
import Safe, { SafeFactory } from '@gnosis.pm/safe-core-sdk'
import { ContractNetworksConfig } from '@gnosis.pm/safe-core-sdk'
import { SafeTransactionDataPartial } from '@gnosis.pm/safe-core-sdk-types'
import NFTlist from './components/NFTlist'


function App() {
  const [lendSelected, setLendSelected] = useState<boolean>(true)
  const [safeAddress, setSafeAddress] = useState<any>("0x897C500f2196bD04b3f89B22727746c70Dc6b231")
  const [provider, setProvider] = useState<any>(null)
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null)
  const [walletAddress, setWalletAddress] = useState<String>("") // wallet address of connected wallet
  const [uri, setUri] = useState<any>("")
// TESTING SAFE STUFF
  const [safeOwner, setSafeOwner] = useState<any>(null)
  const [ethAdapter, setEthAdapter] = useState<any>(null)
  const txServiceUrl = 'https://safe-transaction.goerli.gnosis.io/' // hardcoded goerli
  const [safeService, setSafeService] = useState<any>(null)
  // const id = await ethAdapter.getChainId()
  const id = 5

  // https://github.com/safe-global/safe-core-sdk/blob/main/packages/safe-ethers-lib/contracts/Deps_V1_3_0.sol
  const contractNetworks: ContractNetworksConfig = {
    [id]: {
      multiSendAddress: '0xE215b2C6D42400302810A35Ba6997cb6D43d795D',
      multiSendCallOnlyAddress: '<MULTI_SEND_CALL_ONLY_ADDRESS>',  //wtf maybe this will work
      // multiSendCallOnlyAddress: '0xE215b2C6D42400302810A35Ba6997cb6D43d795D',  //wtf maybe this will work
      safeMasterCopyAddress: '0x4Ac24ADc4611F57cE6Cb5Ba5dCa89B109C24c589',
      safeProxyFactoryAddress: '0xA96503b5a9E6071FBCE5e1AdDf64295d78a43f24'
    }
  }
// TESTING SAFE STUFF ^^

  const rejectWithMessage = (connector: WalletConnect, id: number | undefined, message: string) => {
    connector.rejectRequest({ id, error: { message } })
  }
  

  
  
const onUriChange = async () => {
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
    // console.log(provider)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    setProvider(provider)
    setSigner(signer)
    setWalletAddress(await signer.getAddress())
    //testing
    const safeOwner = provider.getSigner(0)
    setSafeOwner(safeOwner)
    const ethAdapter = new EthersAdapter({
      ethers,
      signer: safeOwner
    })
    setEthAdapter(ethAdapter)

    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
    setSafeService(safeService)
    
    const safeFactory = await SafeFactory.create({ ethAdapter, contractNetworks })
    const safeSdk = await Safe.create({ ethAdapter, safeAddress, contractNetworks })

    // console.dir(safeSdk)
    // const nonce = await safeSdk.getNonce()
    // console.log(await nonce)

   const executeTransaction = async () => {
    const safeTransactionData: SafeTransactionDataPartial = {
      to: "0x1c7e51D7481fb83249C4e60d87ed4C937A23cD37",
      data: "0x",
      value: "20000000000000000", //0.02 eth
      // operation, // Optional
      // safeTxGas, // Optional
      // baseGas, // Optional
      // gasPrice, // Optional
      // gasToken, // Optional
      // refundReceiver, // Optional
      // nonce // Optional
    }

    // needed this part
    // console.log("1")
    // const safeTransaction = await safeSdk.createTransaction({ safeTransactionData })
    // console.log("2")
    // console.log(safeTransaction)
    // const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
    // console.log("3")
    // console.log(safeTxHash)

    // didn't need this part
    // const approveTxResponse = await safeSdk.approveTransactionHash(safeTxHash)
    // console.log("4")
    // console.log(approveTxResponse)
    // await approveTxResponse.transactionResponse?.wait()
    // console.log("5")
    // console.log(approveTxResponse)

    // need this part to successfully exec transaction
    // const executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
    // console.log("6")
    // console.log(executeTxResponse)
    // await executeTxResponse.transactionResponse?.wait()
    // console.log("7")
    // console.log(executeTxResponse)

  }
  // executeTransaction()

  }

  
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

<NFTlist walletAddress={walletAddress} />
    </div>
  );
}

export default App;
