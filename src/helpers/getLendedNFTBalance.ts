import { ethers } from "ethers"
import IConnection from "../types/types"
import getContracts from "./getContracts"


async function getLendedNFTBalance(connection: IConnection) {
  const {walletAddress, chainID, signer} = connection
  const [ManagerAddress, ManagerABI] = getContracts(5)
  const SummonManager = new ethers.Contract(ManagerAddress, ManagerABI, signer)
  console.dir(SummonManager)
  const filterLend = SummonManager.filters.TokenLendedFrom(walletAddress);
  const filterRetrieve = SummonManager.filters.TokenWithdrawnTo(walletAddress);
  const lendLogs = await SummonManager.queryFilter(filterLend, -10000, "latest");
  const retrieveLogs = await SummonManager.queryFilter(filterLend, -10000, "latest");

  console.log(await lendLogs)

  return undefined
}

export default getLendedNFTBalance