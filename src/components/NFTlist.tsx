import useCovalent from "../hooks/useCovalent"

type INFTList = {
  walletAddress?: String
}

function NFTlist(props : INFTList) {
  const {walletAddress} = props

  console.log(useCovalent({walletAddress}))



  return (
    <div>
    {walletAddress}
    </div>
  )
}

export default NFTlist