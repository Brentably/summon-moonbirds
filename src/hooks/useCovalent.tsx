// currenlty just used for fetching NFT data. you might call this useCovalentForNFTdata

type IUseCovalent = {
  walletAddress?: String
}

function useCovalent(params : IUseCovalent) {
 return params.walletAddress && params.walletAddress
}

export default useCovalent