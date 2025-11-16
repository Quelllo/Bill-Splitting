import { Chain } from 'viem'

/**
 * Supported testnet networks for the USDC Bridge demo
 * TODO: Update RPC URLs and chain IDs with real values from documentation
 */

// Arc Testnet Configuration
export const arcTestnet = {
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: {
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ARC_TESTNET_RPC || 'https://rpc.testnet.arc.network'],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_ARC_TESTNET_RPC || 'https://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Arc Explorer', 
      url: 'https://testnet.arcscan.app'
    },
  },
  testnet: true,
} as const satisfies Chain

// Ethereum Sepolia (official testnet)
export const ethereumSepolia = {
  id: 11155111,
  name: 'Ethereum Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC || 'https://ethereum-sepolia-rpc.publicnode.com'],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC || 'https://ethereum-sepolia-rpc.publicnode.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
  },
  testnet: true,
} as const satisfies Chain

// Base Sepolia (official testnet)
export const baseSepolia = {
  id: 84532,
  name: 'Base Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Basescan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
} as const satisfies Chain

// Avalanche Fuji (official testnet)
export const avalancheFuji = {
  id: 43113,
  name: 'Avalanche Fuji',
  nativeCurrency: {
    decimals: 18,
    name: 'AVAX',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: {
      http: ['https://api.avax-test.network/ext/bc/C/rpc'],
    },
    public: {
      http: ['https://api.avax-test.network/ext/bc/C/rpc'],
    },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://testnet.snowtrace.io' },
  },
  testnet: true,
} as const satisfies Chain

// Arbitrum Sepolia (official testnet)
export const arbitrumSepolia = {
  id: 421614,
  name: 'Arbitrum Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Sepolia ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia-rollup.arbitrum.io/rpc'],
    },
    public: {
      http: ['https://sepolia-rollup.arbitrum.io/rpc'],
    },
  },
  blockExplorers: {
    default: { name: 'Arbiscan', url: 'https://sepolia.arbiscan.io' },
  },
  testnet: true,
} as const satisfies Chain

/**
 * Network metadata for UX display
 */
export interface NetworkInfo {
  chain: Chain
  description: string
  logo: string // Emoji for now, can be replaced with image URLs
  faucetUrl?: string
}

export const SUPPORTED_NETWORKS: NetworkInfo[] = [
  {
    chain: arcTestnet,
    description: 'Arc – stablecoin-first testnet where USDC is used for gas',
    logo: '🌐',
    faucetUrl: 'https://faucet.arc.network', // PLACEHOLDER
  },
  {
    chain: ethereumSepolia,
    description: "Ethereum's official testnet for development",
    logo: '⟠',
    faucetUrl: 'https://sepoliafaucet.com',
  },
  {
    chain: baseSepolia,
    description: 'Base L2 testnet – fast and low-cost transactions',
    logo: '🔵',
    faucetUrl: 'https://portal.cdp.coinbase.com/products/faucet',
  },
  {
    chain: avalancheFuji,
    description: 'Avalanche testnet – high-speed subnet infrastructure',
    logo: '🔺',
    faucetUrl: 'https://core.app/tools/testnet-faucet',
  },
  {
    chain: arbitrumSepolia,
    description: 'Arbitrum L2 testnet – Ethereum scaling solution',
    logo: '🔷',
    faucetUrl: 'https://arbitrum.faucet.dev',
  },
]

// Helper functions
export function getNetworkInfo(chainId: number): NetworkInfo | undefined {
  return SUPPORTED_NETWORKS.find(network => network.chain.id === chainId)
}

export function getNetworkByName(name: string): NetworkInfo | undefined {
  return SUPPORTED_NETWORKS.find(
    network => network.chain.name.toLowerCase() === name.toLowerCase()
  )
}

export function getAllChains(): Chain[] {
  return SUPPORTED_NETWORKS.map(network => network.chain)
}

