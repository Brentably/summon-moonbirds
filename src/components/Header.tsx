import IConnection from "../types/types"
import getConnection from "../helpers/getConnection"

function Header(props: {store: any}) {
const [state, setState] = props.store
const {connection} = state

const handleConnect = () => {
  let newConnection = getConnection(connection)
  setState({...state, ...newConnection})
}

  return (
    <div className="summonHeader">
    <span className="summonHeaderText">summon </span>
    <button onClick={() => getConnection(connection)} className={connection.signer ? "connect connected" : "connect notConnected"}> </button>
    </div>
  )
}
export default Header