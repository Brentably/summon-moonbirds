// currently just on goerli so this is fine
// in the repo dipo made the safe core sdk didn't ask for a multisend call only address, so I'm just giving it this string right now and crossing my fingers that it won't be an issue in the future lol


function getContractNetworks() {
  return(
  {
    [5]: {
      multiSendAddress: '0xE215b2C6D42400302810A35Ba6997cb6D43d795D',
      multiSendCallOnlyAddress: '<MULTI_SEND_CALL_ONLY_ADDRESS>',  //wtf maybe this will work
      // multiSendCallOnlyAddress: '0xE215b2C6D42400302810A35Ba6997cb6D43d795D',  //wtf maybe this will work
      safeMasterCopyAddress: '0x4Ac24ADc4611F57cE6Cb5Ba5dCa89B109C24c589',
      safeProxyFactoryAddress: '0xA96503b5a9E6071FBCE5e1AdDf64295d78a43f24'
    }
  }
  )
}

export default getContractNetworks