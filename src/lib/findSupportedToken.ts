/**
 * Utility to find the correct USDC token address that's supported by TokenMessenger
 * 
 * This helps discover which token address is actually registered with CCTP
 */

import { createPublicClient, http, Chain } from 'viem'
import { TOKEN_MESSENGER_ADDRESSES, BRIDGE_RPC_URLS } from '@/config/bridgeKit'
import { ERC20_ABI } from '@/config/tokens'

/**
 * Extended TokenMessenger ABI with query functions
 */
const TOKEN_MESSENGER_QUERY_ABI = [
  {
    inputs: [{ name: 'token', type: 'address' }],
    name: 'isSupportedToken',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'remoteToken', type: 'address' }, { name: 'remoteDomain', type: 'uint32' }],
    name: 'getLocalToken',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

/**
 * Check if a token address is supported by TokenMessenger
 */
export async function checkTokenSupport(
  tokenAddress: `0x${string}`,
  chainId: number
): Promise<{ isSupported: boolean; error?: string }> {
  const tokenMessengerAddress = TOKEN_MESSENGER_ADDRESSES[chainId]
  const rpcUrl = BRIDGE_RPC_URLS[chainId]

  if (!tokenMessengerAddress || !rpcUrl) {
    return {
      isSupported: false,
      error: 'TokenMessenger address or RPC URL not configured for this chain',
    }
  }

  try {
    // Create a public client for this chain
    const publicClient = createPublicClient({
      transport: http(rpcUrl),
    })

    // Check if token is supported
    const isSupported = await publicClient.readContract({
      address: tokenMessengerAddress,
      abi: TOKEN_MESSENGER_QUERY_ABI,
      functionName: 'isSupportedToken',
      args: [tokenAddress],
    }) as boolean

    return { isSupported }
  } catch (error: any) {
    return {
      isSupported: false,
      error: error?.message || 'Failed to check token support',
    }
  }
}

/**
 * Try to find the correct USDC address by checking common addresses
 * 
 * This function tests multiple potential USDC addresses to find which one
 * is actually supported by TokenMessenger
 */
export async function findSupportedUSDCAddress(
  chainId: number,
  candidateAddresses: `0x${string}`[]
): Promise<{ supportedAddress: `0x${string}` | null; results: Record<string, boolean> }> {
  const results: Record<string, boolean> = {}

  for (const address of candidateAddresses) {
    const check = await checkTokenSupport(address, chainId)
    results[address] = check.isSupported
    
    if (check.isSupported) {
      return {
        supportedAddress: address,
        results,
      }
    }
  }

  return {
    supportedAddress: null,
    results,
  }
}

/**
 * Get local token mapping for a remote token
 * Useful for CCTP V2 when tokens need to be mapped
 */
export async function getLocalTokenMapping(
  remoteTokenAddress: `0x${string}`,
  remoteDomain: number,
  chainId: number
): Promise<{ localToken: `0x${string}` | null; error?: string }> {
  const tokenMessengerAddress = TOKEN_MESSENGER_ADDRESSES[chainId]
  const rpcUrl = BRIDGE_RPC_URLS[chainId]

  if (!tokenMessengerAddress || !rpcUrl) {
    return {
      localToken: null,
      error: 'TokenMessenger address or RPC URL not configured',
    }
  }

  try {
    const publicClient = createPublicClient({
      transport: http(rpcUrl),
    })

    const localToken = await publicClient.readContract({
      address: tokenMessengerAddress,
      abi: TOKEN_MESSENGER_QUERY_ABI,
      functionName: 'getLocalToken',
      args: [remoteTokenAddress, remoteDomain],
    }) as `0x${string}`

    if (localToken && localToken !== '0x0000000000000000000000000000000000000000') {
      return { localToken }
    }

    return { localToken: null }
  } catch (error: any) {
    return {
      localToken: null,
      error: error?.message || 'Failed to get local token mapping',
    }
  }
}

