/**
 * USDC Token Addresses for Testnets
 * 
 * TODO: Replace placeholder addresses with real Circle testnet USDC addresses
 * Find them at: https://developers.circle.com/stablecoins/docs/usdc-on-test-networks
 */

export const USDC_ADDRESSES: Record<number, `0x${string}`> = {
  // Arc Testnet
  5042002: '0x3600000000000000000000000000000000000000', // Arc Testnet USDC (from Arc docs)
  
  // Ethereum Sepolia
  // TODO: Update with real Sepolia USDC address from Circle docs
  11155111: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Circle's testnet USDC (verify)
  
  // Base Sepolia
  // TODO: Update with real Base Sepolia USDC address from Circle docs
  84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // Circle's testnet USDC (verify)
  
  // Avalanche Fuji
  // TODO: Update with real Fuji USDC address from Circle docs
  43113: '0x5425890298aed601595a70AB815c96711a31Bc65', // Circle's testnet USDC (verify)
  
  // Arbitrum Sepolia
  // TODO: Update with real Arbitrum Sepolia USDC address from Circle docs
  421614: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d', // Circle's testnet USDC (verify)
}

/**
 * Standard ERC-20 ABI for common token operations
 * Includes balanceOf, decimals, symbol, approve, and allowance
 */
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
] as const

/**
 * Helper to check if a chain has a USDC address configured
 */
export function hasUSDCAddress(chainId: number): boolean {
  const address = USDC_ADDRESSES[chainId]
  return address !== undefined && address !== '0x0000000000000000000000000000000000000000'
}

/**
 * Get USDC address for a specific chain
 */
export function getUSDCAddress(chainId: number): `0x${string}` | undefined {
  return USDC_ADDRESSES[chainId]
}

