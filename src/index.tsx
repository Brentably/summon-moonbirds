import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Web3OnboardProvider, init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
import coinbaseWalletModule from '@web3-onboard/coinbase'


// eslint-disable-next-line @typescript-eslint/no-var-requires
window.Buffer = window.Buffer || require("buffer").Buffer; 



const ethereumGoerli = {
  id: 5,
  token: 'gETH',
  label: 'Ethereum Goerli',
  rpcUrl: `https://eth-goerli.g.alchemy.com/v2/qNtE2MdnnNXNh8G5hjIZ-baxFqFnqvoQ`
}

const mainnet = {
  id: 1,
  token: 'ETH',
  label: 'Ethereum',
  rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/w_9AET4Fxc6sx6BbrvBFqP2Yr9YYmbdP`
}

const polygonMainnet = {
  id: '0x89',
  token: 'MATIC',
  label: 'Polygon',
  rpcUrl: 'https://matic-mainnet.chainstacklabs.com'
}

const chains = [ethereumGoerli, mainnet]

const walletConnect = walletConnectModule()
const coinbaseWalletSdk = coinbaseWalletModule()
const wallets = [injectedModule(), walletConnect, coinbaseWalletSdk]

const appMetadata = {
  name: 'Connect Wallet Example',
  icon: '<svg>My App Icon</svg>',
  description: 'Example showcasing how to connect a wallet.',
  recommendedInjectedWallets: [
    { name: 'MetaMask', url: 'https://metamask.io' },
    { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
  ]
  // ,containerElements: {accountCenter: 'div'}
}

// const NoAccountCenter:AccountCenter = 

// , accountCenter: {
  //   desktop: {
  //     enabled: false},
  //   mobile: {
  //     enabled: false}
  //   }

const web3Onboard = init({
  wallets: [...wallets],
  chains,
  appMetadata
})



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      <App />
    </Web3OnboardProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
