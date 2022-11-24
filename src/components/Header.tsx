import IConnection from "../types/types"
import getConnection from "../helpers/getConnection"
import { useEffect } from "react"
import { useConnectWallet } from '@web3-onboard/react'
import Button from "./Button"

function Header(props: {store: any}) {
const [state, setState] = props.store
const {connection, view} = state
const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

const handleConnect = async () => {
  let newConnection = await getConnection()
  setState({...state, connection: newConnection})
  console.log(newConnection)
}

useEffect(() => {
  const stupid = async () => {
  // If the wallet has a provider than the wallet is connected
  if (wallet?.provider) {
    let newConnection = await getConnection(wallet.provider)
    setState({...state, connection: newConnection})
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
    <span className={view == "lend" ? "tabs selected" : "tabs"} onClick={()=> setState({...state, view: "lend"})}>lend</span> 
    <span className={view == "borrow" ? "tabs selected" : "tabs"} onClick={()=> setState({...state, view: "borrow"})}>borrow</span></div>
    </>)
}
export default Header