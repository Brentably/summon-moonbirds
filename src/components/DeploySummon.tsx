import Button from './Button'


function DeploySummon(store:any) {

  function handleDeploy() {
    console.log("BBRRRRRR Deploying Summon")
  }


  return (
    <div>
      <Button text="deploy Summon wallet :)" onClick={handleDeploy} bright/>
    </div>
  )
}

export default DeploySummon