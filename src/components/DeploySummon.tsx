import Button from './Button'


function DeploySummon(store:any) {

  function handleDeploy() {
    console.log("BBRRRRRR Deploying Summon")
  }


  return (
    <div className='flex-container'>
      <Button text="deploy summon wallet" onClick={handleDeploy} bright/>
    </div>
  )
}

export default DeploySummon