import getContracts from '../helpers/getContracts'
import {ethers} from 'ethers'
import Button from './Button'
import {useState, useCallback} from 'react'
import Loader from './Loader'


function DeploySummon(props: {store: any}) {
  const [state, setState] = props.store
  const {connection, summonAddress} = state
  const {chainID, signer, walletAddress} = connection
  const [ManagerAddress, ManagerABI] = getContracts(chainID)
  const [deployStatus, setDeployStatus] = useState<string>("deploy")
  
  async function handleDeploy() {
    const SummonManager = new ethers.Contract(ManagerAddress, ManagerABI, signer)
    console.log((await SummonManager.estimateGas.CreateNewSummon(walletAddress)).toNumber())
    let tx = await SummonManager.CreateNewSummon(walletAddress)
    setDeployStatus("deploying")
    let tx_r = await tx.wait()
    console.dir(tx_r)
  }
  const memoizedDeploy = useCallback(handleDeploy, [connection])

  if(chainID == 0) return null;

  return (
    <div className='flex-container'>
      {deployStatus == "deploy" && <Button text="deploy summon wallet" onClick={memoizedDeploy} bright />}
      {deployStatus == "deploying" && <Loader />}
    </div>
  )
}

export default DeploySummon