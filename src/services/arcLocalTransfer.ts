/**
 * Arc Testnet Local USDC Transfers
 * 
 * This module handles local USDC transfers on Arc Testnet (same-network transfers).
 * Since Arc's USDC is the native gas token with an ERC-20 interface, we can perform
 * local transfers without using CCTP.
 * 
 * Note: This is for Arc → Arc transfers only. Cross-chain transfers via CCTP are
 * not available for Arc Testnet due to the native USDC token not being registered
 * with TokenMessenger for CCTP bridging.
 */

import { WalletClient, parseUnits, formatUnits, createPublicClient, http } from 'viem'
import { arcTestnet } from '@/config/chains'
import { getUSDCAddress, ERC20_ABI } from '@/config/tokens'

export interface LocalTransferParams {
  amount: string // "10.00"
  recipient: `0x${string}`
}

export interface LocalTransferResult {
  success: boolean
  txHash?: `0x${string}`
  error?: string
}

/**
 * Transfer USDC locally on Arc Testnet (same network)
 * 
 * This uses the ERC-20 transfer function on Arc's native USDC token.
 * Arc's USDC (0x3600000000000000000000000000000000000000) serves as both
 * the native gas token and has an ERC-20 interface for transfers.
 * 
 * @param params - Transfer parameters
 * @param walletClient - Viem wallet client from wagmi
 * @returns Transfer result with transaction hash
 */
export async function transferLocallyOnArc(
  params: LocalTransferParams,
  walletClient: WalletClient
): Promise<LocalTransferResult> {
  console.log('🌐 Starting local Arc transfer...')
  console.log('  Amount:', params.amount)
  console.log('  Recipient:', params.recipient)
  
  try {
    const usdcAddress = getUSDCAddress(arcTestnet.id)
    
    if (!usdcAddress) {
      return {
        success: false,
        error: 'USDC address not configured for Arc Testnet',
      }
    }
    
    // Get user address
    const [userAddress] = await walletClient.getAddresses()
    if (!userAddress) {
      return {
        success: false,
        error: 'No wallet address found',
      }
    }
    
    // Convert amount to proper units (USDC has 6 decimals for ERC-20 interface)
    const amountInUnits = parseUnits(params.amount, 6)
    console.log(`  Amount in units: ${amountInUnits.toString()}`)
    
    // Create public client for reading
    const publicClient = createPublicClient({
      chain: arcTestnet,
      transport: http(arcTestnet.rpcUrls.default.http[0]),
    })
    
    // Check balance
    const balance = await publicClient.readContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [userAddress],
    }) as bigint
    
    console.log(`  Current balance: ${balance.toString()}`)
    
    if (balance < amountInUnits) {
      return {
        success: false,
        error: 'Insufficient USDC balance',
      }
    }
    
    // Execute transfer
    console.log('📤 Executing ERC-20 transfer...')
    const txHash = await walletClient.writeContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [params.recipient, amountInUnits],
      account: userAddress,
      chain: arcTestnet,
    })
    
    console.log('✅ Transfer transaction submitted:', txHash)
    
    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })
    
    if (receipt.status === 'reverted') {
      return {
        success: false,
        error: 'Transaction was reverted on-chain',
        txHash,
      }
    }
    
    console.log('✅ Transfer confirmed!')
    return {
      success: true,
      txHash,
    }
    
  } catch (error: any) {
    console.error('❌ Local transfer error:', error)
    
    let errorMessage = 'Transfer failed'
    if (error?.message) {
      errorMessage = error.message
    } else if (error?.shortMessage) {
      errorMessage = error.shortMessage
    }
    
    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Check if a local transfer is possible on Arc
 */
export function canTransferLocallyOnArc(fromChainId: number, toChainId: number): boolean {
  // Only allow Arc → Arc transfers
  return fromChainId === arcTestnet.id && toChainId === arcTestnet.id
}

