
import { WalletState, EIP1193Provider } from "@web3-onboard/core";
import { ethers } from "ethers";


const getConnection = async (_provider?: EIP1193Provider) => {
  const provider = _provider ? new ethers.providers.Web3Provider(_provider, 'any') : new ethers.providers.Web3Provider(window.ethereum, "any")
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

  await provider.send("eth_requestAccounts", []);
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
