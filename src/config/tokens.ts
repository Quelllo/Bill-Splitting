/**
 * USDC Token Addresses for Testnets
 * 
 * Official contract addresses from Circle and Arc documentation:
 * - Circle testnet addresses: https://developers.circle.com/stablecoins/docs/usdc-on-test-networks
 * - Arc Testnet USDC: From official Arc Network documentation
 */

export const USDC_ADDRESSES: Record<number, `0x${string}`> = {
  // Arc Testnet
  // Official USDC address from Circle documentation
  // Note: On Arc Testnet, USDC is the native currency, and this address represents the USDC token
  // This address may serve as both the native currency address and the ERC-20 token contract address
  // Reference: Circle's official documentation for Arc Testnet
  5042002: '0x3600000000000000000000000000000000000000',
  
  // Ethereum Sepolia
  // Official Circle testnet USDC contract address for Sepolia
  // Reference: https://developers.circle.com/stablecoins/docs/usdc-on-test-networks
  11155111: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  
  // Base Sepolia - VERIFIED
  // Circle's official testnet USDC for Base Sepolia
  // Reference: https://developers.circle.com/stablecoins/docs/usdc-on-test-networks
  // This is the primary CCTP demo route: Sepolia ↔ Base Sepolia
  84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  
  // Avalanche Fuji
  // Circle's official testnet USDC for Avalanche Fuji
  43113: '0x5425890298aed601595a70AB815c96711a31Bc65',
  
  // Arbitrum Sepolia
  // Circle's official testnet USDC for Arbitrum Sepolia
  421614: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
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
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
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

