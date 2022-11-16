import IConnection from "../types/types"
import getConnection from "../helpers/getConnection"

function Header(props: {store: any}) {
const [state, setState] = props.store
const {connection} = state

const handleConnect = async () => {
  let newConnection = await getConnection(connection)
  setState({...state, connection: newConnection})
  console.log(newConnection)
}

  return (
    <div className="summonHeader">
    <span className="summonHeaderText">summon </span>
    <button onClick={handleConnect} className={connection.signer ? "connect connected" : "connect notConnected"}> </button>
    </div>
  )
}
export default Header