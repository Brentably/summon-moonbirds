import WalletConnect from "@walletconnect/client"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import walletConnectLogo from '../template/walletConnectHQ.png'

export default (props: {store:any}) => {
  const [state, dispatch] = props.store
  const {uriValid, uri, summonAddress, connection} = state
  const {signer} = connection
  const [wConnected, setWConnected] = useState(false)
  const [dropdown, setDropdown] = useState(false)

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

  return (
    <div className="walletConnectContainer">
          <img src={walletConnectLogo} className="walletConnectLogo" />
          
            <input type="text" className={wConnected ? "greenBorder" : uriValid ? "" : "invalidInput"} placeholder="Paste Connection Link" value={`${uri}`} onChange={(e) => dispatch({type: 'set', payload: {uri: e.target.value}})} />
            <div className="left wcQuestionContainer">
              {/* <span 
                className="wcQuestion"
                onClick={() => window.open("https://www.notion.so/Lend-and-borrow-NFTs-8be4078124024309b872a48d5c023321#55983ede7cc742ea8ed19d850ae3cda4", "_blank")}
              >
                  How to find the connection link? 	🔗
              </span>  */}
              <a 
                className="wcQuestion"
                href="https://www.notion.so/Lend-and-borrow-NFTs-8be4078124024309b872a48d5c023321#55983ede7cc742ea8ed19d850ae3cda4" target="_blank"
              >
                  How to find the connection link? 	🔗
              </a> 
            </div>
        </div>
  )
}