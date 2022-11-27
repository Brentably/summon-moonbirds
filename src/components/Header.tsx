import IConnection from "../types/types"
import getConnection from "../helpers/getConnection"
import { useEffect } from "react"
import { useAccountCenter, useConnectWallet } from '@web3-onboard/react'
import Button from "./Button"
import { stringify } from "querystring"

function Header(props: {store: any}) {
const [state, dispatch] = props.store
const {connection, view} = state
const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
const updateAccountCenter = useAccountCenter()

// const handleConnect = async () => {
//   let newConnection = await getConnection()
//   dispatch({type: 'set', payload: {connection: newConnection}})
//   console.log(newConnection)
// }

useEffect(() => {
  const stupid = async () => {
    // If the wallet has a provider than the wallet is connected
    if (wallet?.provider) {
      let newConnection = await getConnection(wallet.provider)
      // localStorage.setItem('walletProvider', JSON.stringify(wallet.provider));
      dispatch({type: 'set', payload: {connection: newConnection}})
      // updateAccountCenter({ enabled: true, position: "topRight"})

  }}

  stupid()
}
, [wallet])


useEffect(() => console.log(connection), [connection])

  return (<>
    <div className="summonHeader">
    <span className="summonHeaderText">summon </span>
    {/* <button disabled={connecting} onClick={() => connect()} className={connection.signer ? "connect connected" : "connect notConnected"}>Connect Wallet</button> */}
    </div>
    {!connection.signer && <div className="buttonContainer connectWalletContainer pointer">
      <Button onClick={() => connect()} text="connect wallet" bright/>
    </div>}
    <div className="tabsContainer">
    <span className={view == "lend" ? "tabs selected" : "tabs"} onClick={()=> dispatch({type: 'set', payload: {view: "lend"}})}>lend</span> 
    <span className={view == "borrow" ? "tabs selected" : "tabs"} onClick={()=> dispatch({type: 'set', payload: {view: "borrow"}})}>borrow</span></div>
    </>)
}
export default Header