import Button from './Button'



function DeploySummon(store:any) {

  function handleDeploy() {
    console.log("BBRRRRRR Deploying Summon")
  }


  return <Button text="deploy Summon wallet :)" onClick={handleDeploy} bright/>
}

export default DeploySummon