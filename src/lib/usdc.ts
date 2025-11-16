import { createPublicClient, http, formatUnits } from 'viem'
import { ERC20_ABI, getUSDCAddress } from '@/config/tokens'
import { BRIDGE_RPC_URLS } from '@/config/bridgeKit'
import { Chain } from 'viem'

/**
 * Fetch USDC balance for an address on a specific chain
 * 
 * @param address - Wallet address to check
 * @param chain - The chain configuration
 * @returns Balance as a formatted string (e.g., "100.50") or null on error
 */
export async function getUSDCBalance(
  address: `0x${string}`,
  chain: Chain
): Promise<string | null> {
  try {
    // Get USDC contract address for this chain
    const usdcAddress = getUSDCAddress(chain.id)
    
    if (!usdcAddress || usdcAddress === '0x0000000000000000000000000000000000000000') {
      console.warn(`No USDC address configured for chain ${chain.name} (${chain.id})`)
      return null
    }

    // Get RPC URL - prefer configured URL, fallback to chain default
    const rpcUrl = BRIDGE_RPC_URLS[chain.id] || chain.rpcUrls.default.http[0]
    
    if (!rpcUrl) {
      console.error(`No RPC URL available for chain ${chain.name} (${chain.id})`)
      return null
    }

    // Create a public client for reading blockchain data
    const client = createPublicClient({
      chain,
      transport: http(rpcUrl),
    })

    // Read the balance from the USDC contract
    const balance = await client.readContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address],
    })

    // USDC typically has 6 decimals, but we'll read it to be safe
    const decimals = await client.readContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'decimals',
    })

    // Format the balance (convert from wei-like units to readable number)
    const formattedBalance = formatUnits(balance as bigint, decimals as number)
    
    console.log(`✅ Balance fetched for ${chain.name}: ${formattedBalance} USDC`)
    return formattedBalance
  } catch (error) {
    console.error(`❌ Error fetching USDC balance on ${chain.name} (${chain.id}):`, error)
    if (error instanceof Error) {
      console.error(`   Error message: ${error.message}`)
    }
    return null
  }
}

/**
 * Fetch USDC balances across multiple chains
 * 
 * @param address - Wallet address to check
 * @param chains - Array of chain configurations
 * @returns Map of chainId to balance string
 */
export async function getUSDCBalances(
  address: `0x${string}`,
  chains: Chain[]
): Promise<Record<number, string | null>> {
  // Fetch all balances in parallel for better performance
  const balancePromises = chains.map(async (chain) => {
    const balance = await getUSDCBalance(address, chain)
    return { chainId: chain.id, balance }
  })

  const results = await Promise.all(balancePromises)

  // Convert array to object map
  const balanceMap: Record<number, string | null> = {}
  results.forEach(({ chainId, balance }) => {
    balanceMap[chainId] = balance
  })

  return balanceMap
}

/**
 * Calculate total USDC across all chains
 * 
 * @param balances - Map of chainId to balance string
 * @returns Total balance as a formatted string
 */
export function calculateTotalUSDC(balances: Record<number, string | null>): string {
  let total = 0

  Object.values(balances).forEach((balance) => {
    if (balance !== null) {
      const numBalance = parseFloat(balance)
      if (!isNaN(numBalance)) {
        total += numBalance
      }
    }
  })

  // Format with 2 decimal places
  return total.toFixed(2)
}

