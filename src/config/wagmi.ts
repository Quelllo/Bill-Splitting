import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { getAllChains } from './chains'

// Get all supported chains
const chains = getAllChains()

export const wagmiConfig = getDefaultConfig({
  appName: 'USDC Bridge',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: chains as any,
  ssr: true, // Enable server-side rendering support
})

