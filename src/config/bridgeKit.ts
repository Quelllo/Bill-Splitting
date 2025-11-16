/**
 * Circle Bridge Kit Configuration
 * 
 * This file contains configuration for Circle's Cross-Chain Transfer Protocol (CCTP)
 * which enables native USDC transfers across blockchains.
 * 
 * HOW IT WORKS:
 * 1. Burn USDC on the source chain
 * 2. Generate attestation proof
 * 3. Mint equivalent USDC on destination chain
 * 
 * TODO: Update these values based on Circle Bridge Kit documentation
 * Reference: https://developers.circle.com/stablecoins/docs/cctp-getting-started
 */

/**
 * Bridge Kit Environment Configuration
 * - 'testnet' for development/testing
 * - 'mainnet' for production (not used in this demo)
 */
export const BRIDGE_KIT_ENV = 'testnet' as const

/**
 * Chain Domain IDs used by Circle's CCTP
 * These are Circle-specific domain identifiers (different from chain IDs)
 * 
 * TODO: Verify these domain IDs from Circle docs
 * Reference: https://developers.circle.com/stablecoins/docs/cctp-protocol-contract#domain-ids
 */
export const CIRCLE_DOMAIN_IDS: Record<number, number> = {
  // Ethereum Sepolia
  11155111: 0, // TODO: Verify this domain ID from Circle docs
  
  // Avalanche Fuji
  43113: 1, // TODO: Verify this domain ID from Circle docs
  
  // Arbitrum Sepolia
  421614: 3, // TODO: Verify this domain ID from Circle docs
  
  // Base Sepolia
  84532: 6, // TODO: Verify this domain ID from Circle docs
  
  // Arc Testnet
  // TODO: Add Arc testnet domain ID once available
  // 12345: ??,
}

/**
 * Message Transmitter Contract Addresses
 * These contracts handle the cross-chain message passing for CCTP
 * 
 * TODO: Update with real addresses from Circle docs
 * Reference: https://developers.circle.com/stablecoins/docs/cctp-protocol-contract
 */
export const MESSAGE_TRANSMITTER_ADDRESSES: Record<number, `0x${string}`> = {
  11155111: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD', // Ethereum Sepolia - TODO: Verify
  43113: '0xa9fb1b3009dcb79e2fe346c16a604b8fa8ae0a79', // Avalanche Fuji - TODO: Verify
  421614: '0xaCF1ceeF35caAc005e15888dDb8A3515C41B4872', // Arbitrum Sepolia - TODO: Verify
  84532: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD', // Base Sepolia - TODO: Verify
  // Arc Testnet - TODO: Add once available
}

/**
 * Token Messenger Contract Addresses
 * These contracts handle the burn/mint of USDC tokens
 * 
 * TODO: Update with real addresses from Circle docs
 * Reference: https://developers.circle.com/stablecoins/docs/cctp-protocol-contract
 */
export const TOKEN_MESSENGER_ADDRESSES: Record<number, `0x${string}`> = {
  11155111: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5', // Ethereum Sepolia - TODO: Verify
  43113: '0xeb08f243e5d3fcff26a9e38ae5520a669f4019d0', // Avalanche Fuji - TODO: Verify
  421614: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5', // Arbitrum Sepolia - TODO: Verify
  84532: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5', // Base Sepolia - TODO: Verify
  // Arc Testnet - TODO: Add once available
}

/**
 * RPC URLs for each supported chain
 * Bridge Kit may need dedicated RPC endpoints for better reliability
 * 
 * TODO: Consider using Alchemy/Infura/QuickNode for production
 * You can add API keys via environment variables
 */
export const BRIDGE_RPC_URLS: Record<number, string> = {
  11155111: process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC || 'https://ethereum-sepolia-rpc.publicnode.com',
  43113: process.env.NEXT_PUBLIC_AVALANCHE_FUJI_RPC || 'https://api.avax-test.network/ext/bc/C/rpc',
  421614: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC || 'https://sepolia-rollup.arbitrum.io/rpc',
  84532: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org',
  5042002: process.env.NEXT_PUBLIC_ARC_TESTNET_RPC || 'https://rpc.testnet.arc.network', // Arc Testnet
}

/**
 * Circle API Configuration (if needed)
 * Some Bridge Kit operations may require Circle API access
 * 
 * TODO: Check if your Bridge Kit integration needs API keys
 */
export const CIRCLE_API_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_CIRCLE_API_KEY,
  environment: BRIDGE_KIT_ENV,
}

/**
 * Helper function to check if a chain is supported by CCTP
 */
export function isCCTPSupported(chainId: number): boolean {
  return chainId in CIRCLE_DOMAIN_IDS
}

/**
 * Get Circle domain ID for a given chain ID
 */
export function getCircleDomainId(chainId: number): number | undefined {
  return CIRCLE_DOMAIN_IDS[chainId]
}

/**
 * Get chain name for display (for error messages)
 */
export function getChainName(chainId: number): string {
  const names: Record<number, string> = {
    11155111: 'Ethereum Sepolia',
    43113: 'Avalanche Fuji',
    421614: 'Arbitrum Sepolia',
    84532: 'Base Sepolia',
    12345: 'Arc Testnet',
  }
  return names[chainId] || `Chain ${chainId}`
}

