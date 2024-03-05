'use client'

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

const projectId =  process.env.NEXT_PUBLIC_PROJECT_ID

const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}

const metadata = {
  name: 'crytotax',
  description: 'Cryptocurrency tax reporting made easy.',
  url: 'https://crptotax.vercel.app/',
  icons: ['https://avatars.mywebsite.com/']
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet],
  projectId: projectId, 
  enableAnalytics: true 
})

export function Web3ModalProvider({ children }) {
  return children
}