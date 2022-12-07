import getConnection from "../helpers/getConnection"
import { useContext, useEffect } from "react"
import { useAccountCenter, useConnectWallet } from '@web3-onboard/react'
import Button from "./Button"
import { stringify } from "querystring"
import { GlobalContext } from "../store/context"


function Header() {
const [state, dispatch] = useContext(GlobalContext)
const {connection, view} = state
const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
// const updateAccountCenter = useAccountCenter()


// useEffect(() => {
//   const stupid = async () => {
//     // If the wallet has a provider than the wallet is connected
//     if (wallet?.provider) {
//       let newConnection = await getConnection(wallet.provider)
//       dispatch({type: 'set', payload: {connection: newConnection}})

//   }}

//   stupid()
// }
// , [wallet])


// useEffect(() => console.log(connection), [connection])
//{connecting ? 'connecting' : wallet ? 'disconnect' : 'connect'}
  return (<>
    {}
    <div className="summonHeader">
    <span className="summonHeaderText">summon </span>
    {/* <button disabled={connecting} onClick={() => connect()} className={connection.signer ? "connect connected" : "connect notConnected"}>Connect Wallet</button> */}
    </div>
    {!wallet && <div className="buttonContainer connectWalletContainer pointer">
      <Button onClick={() => connect()} text="connect wallet" bright/>
    </div>}
    <div className="tabsContainer">
    <span className={view == "lend" ? "tabs selected" : "tabs"} onClick={()=> dispatch({type: 'set', payload: {view: "lend"}})}>lend</span> 
    <span className={view == "borrow" ? "tabs selected" : "tabs"} onClick={()=> dispatch({type: 'set', payload: {view: "borrow"}})}>borrow</span></div>
    </>)
}
export default Header