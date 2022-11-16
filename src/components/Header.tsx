import IConnection from "../types/types"
import getConnection from "../helpers/getConnection"

function Header(props: {store: any}) {
const [state, setState] = props.store
const {connection, view} = state

const handleConnect = async () => {
  let newConnection = await getConnection(connection)
  setState({...state, connection: newConnection})
  console.log(newConnection)
}

  return (<>
    <div className="summonHeader">
    <span className="summonHeaderText">summon </span>
    <button onClick={handleConnect} className={connection.signer ? "connect connected" : "connect notConnected"}> </button>
    </div>
    <div className="tabsContainer">
    <span className={view == "lend" ? "tabs selected" : "tabs"} onClick={()=> setState({...state, view: "lend"})}>lend</span> 
    <span className={view == "borrow" ? "tabs selected" : "tabs"} onClick={()=> setState({...state, view: "borrow"})}>borrow</span></div>
    </>)
}
export default Header