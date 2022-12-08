

import { ethers } from "ethers";



const getConnection = async (_provider:  ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc) => {
  const provider = new ethers.providers.Web3Provider(_provider, 'any')
  // const provider = new ethers.providers.Web3Provider(window.ethereum, "any")

  // refreshes things on network changs
  provider.on("network", (newNetwork, oldNetwork) => {
    // When a Provider makes its initial connection, it emits a "network"
    // event with a null oldNetwork along with the newNetwork. So, if the
    // oldNetwork exists, it represents a changing network
    if (oldNetwork) {
        window.location.reload();
    }
  })


  const signer = provider.getSigner()

  const walletAddress = await signer.getAddress()

  const chainID = await signer.getChainId()




  return ({
  provider: provider,
  signer: signer,
  walletAddress: walletAddress,
  chainID: chainID
})


  

}

export default getConnection
