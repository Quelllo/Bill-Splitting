import { createPublicClient, http } from 'viem'
import { ERC20_ABI } from '@/config/tokens'
import { BRIDGE_RPC_URLS } from '@/config/bridgeKit'
import { Chain } from 'viem'

/**
 * Verify if an address is a USDC token contract
 * Checks the token symbol to confirm it's USDC
 */
export async function verifyUSDCAddress(
  address: `0x${string}`,
  chain: Chain
): Promise<{ isValid: boolean; symbol?: string; decimals?: number; error?: string }> {
  try {
    const rpcUrl = BRIDGE_RPC_URLS[chain.id] || chain.rpcUrls.default.http[0]
    
    if (!rpcUrl) {
      return {
        isValid: false,
        error: `No RPC URL available for ${chain.name}`,
      }
    }

    const client = createPublicClient({
      chain,
      transport: http(rpcUrl),
    })

    // Check symbol
    const symbol = (await client.readContract({
      address,
      abi: ERC20_ABI,
      functionName: 'symbol',
    })) as string

    // Check decimals
    const decimals = (await client.readContract({
      address,
      abi: ERC20_ABI,
      functionName: 'decimals',
    })) as number

    const isValid = symbol === 'USDC' || symbol === 'USDC.e'

    return {
      isValid,
      symbol,
      decimals,
    }
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Check wallet's USDC balance at a specific address
 * Useful for verifying which USDC contract the wallet is using
 */
export async function checkWalletUSDCBalance(
  walletAddress: `0x${string}`,
  usdcAddress: `0x${string}`,
  chain: Chain
): Promise<{ balance: string; symbol?: string; decimals?: number; error?: string }> {
  try {
    const rpcUrl = BRIDGE_RPC_URLS[chain.id] || chain.rpcUrls.default.http[0]
    
    if (!rpcUrl) {
      return {
        balance: '0',
        error: `No RPC URL available for ${chain.name}`,
      }
    }

    const client = createPublicClient({
      chain,
      transport: http(rpcUrl),
    })

    // Get symbol and decimals
    const symbol = (await client.readContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'symbol',
    })) as string

    const decimals = (await client.readContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'decimals',
    })) as number

    // Get balance
    const balance = (await client.readContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [walletAddress],
    })) as bigint

    const formattedBalance = (Number(balance) / Math.pow(10, decimals)).toFixed(6)

    return {
      balance: formattedBalance,
      symbol,
      decimals,
    }
  } catch (error) {
    return {
      balance: '0',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

