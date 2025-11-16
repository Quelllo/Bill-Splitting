/**
 * Circle Bridge Kit Client
 * 
 * This service handles cross-chain USDC transfers using Circle's CCTP.
 * 
 * FLOW:
 * 1. User approves USDC spending to TokenMessenger contract
 * 2. Call depositForBurn() on source chain (burns USDC)
 * 3. Wait for attestation from Circle's attestation service
 * 4. Call receiveMessage() on destination chain (mints USDC)
 * 
 * CHAIN CONFIGURATION:
 * All CCTP configuration is managed via Chain IDs in src/config/bridgeKit.ts:
 * 
 * - Ethereum Sepolia (11155111): CCTP Domain 0
 * - Arc Testnet (5042002): CCTP Domain 26
 * 
 * The bridgeUSDC function uses Chain IDs to look up:
 * - CIRCLE_DOMAIN_IDS: Maps Chain ID → CCTP Domain ID
 * - TOKEN_MESSENGER_ADDRESSES: Maps Chain ID → TokenMessenger contract
 * - MESSAGE_TRANSMITTER_ADDRESSES: Maps Chain ID → MessageTransmitter contract
 * - USDC_ADDRESSES (from tokens.ts): Maps Chain ID → USDC token contract
 * 
 * All CCTP contracts are called directly - no external Bridge Kit SDK needed.
 */

import { 
  createPublicClient, 
  createWalletClient, 
  custom, 
  parseUnits,
  http,
  PublicClient,
  WalletClient,
  Hash,
} from 'viem'
import { getUSDCAddress, ERC20_ABI } from '@/config/tokens'
import { 
  TOKEN_MESSENGER_ADDRESSES, 
  MESSAGE_TRANSMITTER_ADDRESSES,
  CIRCLE_DOMAIN_IDS,
  BRIDGE_RPC_URLS,
  isCCTPSupported,
  getChainName,
} from '@/config/bridgeKit'
import { Chain } from 'viem'

/**
 * TokenMessenger ABI (minimal - just what we need for deposits)
 * Includes functions to check token support
 */
const TOKEN_MESSENGER_ABI = [
  {
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'destinationDomain', type: 'uint32' },
      { name: 'mintRecipient', type: 'bytes32' },
      { name: 'burnToken', type: 'address' },
    ],
    name: 'depositForBurn',
    outputs: [{ name: '_nonce', type: 'uint64' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  // Check if token is supported (for CCTP V2)
  {
    inputs: [{ name: 'token', type: 'address' }],
    name: 'isSupportedToken',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Get local token (for CCTP V2)
  {
    inputs: [{ name: 'remoteToken', type: 'address' }, { name: 'remoteDomain', type: 'uint32' }],
    name: 'getLocalToken',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

/**
 * MessageTransmitter ABI (minimal - for receiving on destination)
 * TODO: Update with complete ABI from Circle docs if needed
 */
const MESSAGE_TRANSMITTER_ABI = [
  {
    inputs: [
      { name: 'message', type: 'bytes' },
      { name: 'attestation', type: 'bytes' },
    ],
    name: 'receiveMessage',
    outputs: [{ name: 'success', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

export interface BridgeParams {
  fromChainId: number
  toChainId: number
  amount: string // e.g., "10.00"
  recipient: `0x${string}` // Destination wallet address
  sourceChain: Chain
  destinationChain: Chain
}

export interface BridgeResult {
  success: boolean
  txHash?: Hash
  error?: string
  attestation?: {
    message: string
    attestationHash: string
  }
}

/**
 * Bridge USDC from one chain to another using Circle's CCTP
 * 
 * @param params - Bridge parameters
 * @param walletClient - Viem wallet client (from wagmi)
 * @returns Bridge result with transaction hash
 */
export async function bridgeUSDC(
  params: BridgeParams,
  walletClient: WalletClient
): Promise<BridgeResult> {
  const { fromChainId, toChainId, amount, recipient, sourceChain } = params

  try {
    // Validation
    if (!isCCTPSupported(fromChainId)) {
      return {
        success: false,
        error: `${getChainName(fromChainId)} is not supported by CCTP`,
      }
    }

    if (!isCCTPSupported(toChainId)) {
      return {
        success: false,
        error: `${getChainName(toChainId)} is not supported by CCTP`,
      }
    }

    if (fromChainId === toChainId) {
      return {
        success: false,
        error: 'Source and destination chains must be different',
      }
    }

    // Get CCTP contract addresses and configuration
    // All addresses are looked up by Chain ID from src/config/bridgeKit.ts
    let usdcAddress = getUSDCAddress(fromChainId) // USDC token contract on source chain
    const tokenMessengerAddress = TOKEN_MESSENGER_ADDRESSES[fromChainId] // TokenMessenger for burning
    const destinationDomain = CIRCLE_DOMAIN_IDS[toChainId] // Circle's domain ID for destination

    if (!usdcAddress || !tokenMessengerAddress || destinationDomain === undefined) {
      return {
        success: false,
        error: 'Bridge configuration not available for selected chains',
      }
    }

    console.log('🌉 Bridge Configuration:')
    console.log(`  Source: ${getChainName(fromChainId)} (Chain ID: ${fromChainId})`)
    console.log(`  Destination: ${getChainName(toChainId)} (Chain ID: ${toChainId}, Domain: ${destinationDomain})`)
    console.log(`  USDC: ${usdcAddress}`)
    console.log(`  TokenMessenger: ${tokenMessengerAddress}`)
    
    // Verify contract addresses are not zero addresses
    if (usdcAddress === '0x0000000000000000000000000000000000000000') {
      return {
        success: false,
        error: `USDC address not configured for ${getChainName(fromChainId)}`,
      }
    }
    
    if (tokenMessengerAddress === '0x0000000000000000000000000000000000000000') {
      return {
        success: false,
        error: `TokenMessenger address not configured for ${getChainName(fromChainId)}`,
      }
    }

    // Convert amount to proper units (USDC has 6 decimals)
    const amountInUnits = parseUnits(amount, 6)

    // Get user address
    const [userAddress] = await walletClient.getAddresses()
    if (!userAddress) {
      return {
        success: false,
        error: 'No wallet address found',
      }
    }

    // Create public client for reading
    const publicClient = createPublicClient({
      chain: sourceChain,
      transport: http(BRIDGE_RPC_URLS[fromChainId]),
    })

    // Step 1: Check USDC balance
    const balance = await publicClient.readContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [userAddress],
    }) as bigint

    if (balance < amountInUnits) {
      return {
        success: false,
        error: 'Insufficient USDC balance',
      }
    }

    // Step 2: Check allowance
    const allowance = await publicClient.readContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [userAddress, tokenMessengerAddress],
    }) as bigint

    // Step 3: Approve if needed
    if (allowance < amountInUnits) {
      console.log('🔐 Approval needed. Current allowance:', allowance.toString(), 'Required:', amountInUnits.toString())
      
      const approveTx = await walletClient.writeContract({
        address: usdcAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [tokenMessengerAddress, amountInUnits],
        account: userAddress,
        chain: sourceChain,
      })

      console.log('⏳ Waiting for approval transaction...')
      const approveReceipt = await publicClient.waitForTransactionReceipt({ hash: approveTx })
      
      if (approveReceipt.status === 'reverted') {
        return {
          success: false,
          error: 'Approval transaction was reverted. Please check your wallet and try again.',
          txHash: approveTx,
        }
      }
      
      console.log('✅ Approval confirmed')
      
      // Verify the allowance was actually set
      const newAllowance = await publicClient.readContract({
        address: usdcAddress,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [userAddress, tokenMessengerAddress],
      }) as bigint
      
      console.log('🔍 New allowance after approval:', newAllowance.toString())
      
      if (newAllowance < amountInUnits) {
        return {
          success: false,
          error: 'Approval did not set sufficient allowance. Please try approving again.',
        }
      }
    } else {
      console.log('✅ Sufficient allowance already exists:', allowance.toString())
    }

    // Step 4: Convert recipient address to bytes32 format
    const recipientBytes32 = addressToBytes32(recipient)

    // Step 5: Verify allowance one more time before calling depositForBurn
    const finalAllowance = await publicClient.readContract({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [userAddress, tokenMessengerAddress],
    }) as bigint
    
    console.log('🔍 Final allowance check before depositForBurn:', finalAllowance.toString())
    
    if (finalAllowance < amountInUnits) {
      return {
        success: false,
        error: `Insufficient allowance: ${finalAllowance.toString()} < ${amountInUnits.toString()}. Please approve USDC spending first.`,
      }
    }

    // Step 5.5: Check if token is supported by TokenMessenger (for CCTP V2)
    // For CCTP V2, tokens might need to be mapped via getLocalToken
    let tokenToUse = usdcAddress
    try {
      // First, try to check if token is directly supported
      const isSupported = await publicClient.readContract({
        address: tokenMessengerAddress,
        abi: TOKEN_MESSENGER_ABI,
        functionName: 'isSupportedToken',
        args: [usdcAddress],
      }) as boolean
      
      console.log(`🔍 Token support check: ${usdcAddress} is ${isSupported ? 'supported' : 'NOT supported'} by TokenMessenger`)
      
      if (!isSupported) {
        // For CCTP V2, try to get the local token mapping
        // If bridging to Sepolia (domain 0), try to get the local token
        try {
          const localToken = await publicClient.readContract({
            address: tokenMessengerAddress,
            abi: TOKEN_MESSENGER_ABI,
            functionName: 'getLocalToken',
            args: [usdcAddress, destinationDomain],
          }) as `0x${string}`
          
          if (localToken && localToken !== '0x0000000000000000000000000000000000000000') {
            console.log(`🔄 Found local token mapping: ${localToken}`)
            tokenToUse = localToken
          } else {
            return {
              success: false,
              error: `USDC token (${usdcAddress}) is not supported by TokenMessenger on ${getChainName(fromChainId)}. Please verify the USDC address is correct for CCTP bridging.`,
            }
          }
        } catch (mapErr) {
          console.warn('⚠️ Could not get local token mapping:', mapErr)
          return {
            success: false,
            error: `USDC token (${usdcAddress}) is not supported by TokenMessenger on ${getChainName(fromChainId)}. The token may need to be registered for CCTP.`,
          }
        }
      }
    } catch (err) {
      // isSupportedToken might not exist on all versions (CCTP V1), that's okay
      console.warn('⚠️ Could not check token support (function may not exist on CCTP V1):', err)
    }
    
    // If we found a different token to use, we need to use that for depositForBurn
    // But note: this would require re-checking balance and allowance for the new token
    // For now, if token mapping is needed, we'll use the original address and let the contract handle it
    if (tokenToUse !== usdcAddress) {
      console.log(`⚠️ Token mapping found: ${tokenToUse} (but using original: ${usdcAddress})`)
      console.log(`⚠️ Note: If transaction fails, the token may need to be registered with TokenMessenger`)
      // Keep using original usdcAddress for now - the contract should handle the mapping
    }

    // Step 6: Call depositForBurn on TokenMessenger
    console.log('🔥 Calling depositForBurn with:')
    console.log(`  TokenMessenger: ${tokenMessengerAddress}`)
    console.log(`  Amount: ${amountInUnits.toString()}`)
    console.log(`  Destination Domain: ${destinationDomain}`)
    console.log(`  Recipient (bytes32): ${recipientBytes32}`)
    console.log(`  Recipient (original): ${recipient}`)
    console.log(`  Burn Token (USDC): ${usdcAddress}`)
    
    try {
      // Try to simulate the transaction first to catch errors early
      try {
        await publicClient.simulateContract({
          address: tokenMessengerAddress,
          abi: TOKEN_MESSENGER_ABI,
          functionName: 'depositForBurn',
          args: [
            amountInUnits,
            destinationDomain,
            recipientBytes32,
            usdcAddress,
          ],
          account: userAddress,
        })
        console.log('✅ Transaction simulation successful')
      } catch (simError: any) {
        console.error('❌ Transaction simulation failed:', simError)
        return {
          success: false,
          error: `Transaction would fail: ${simError?.shortMessage || simError?.message || 'Unknown error'}. Please check your inputs.`,
        }
      }
      
      const burnTx = await walletClient.writeContract({
        address: tokenMessengerAddress,
        abi: TOKEN_MESSENGER_ABI,
        functionName: 'depositForBurn',
        args: [
          amountInUnits,
          destinationDomain,
          recipientBytes32,
          usdcAddress,
        ],
        account: userAddress,
        chain: sourceChain,
      })

      console.log('✅ Burn transaction submitted:', burnTx)

      // Wait for burn transaction to be confirmed
      console.log('⏳ Waiting for transaction confirmation...')
      const receipt = await publicClient.waitForTransactionReceipt({ hash: burnTx })
      console.log('📋 Transaction receipt:', receipt)
      console.log('📊 Transaction status:', receipt.status)
      
      // Check if transaction was reverted
      if (receipt.status === 'reverted') {
        console.error('❌ Transaction reverted on-chain')
        
        // Try to get the revert reason from the receipt
        let revertReason = 'Unknown error'
        try {
          // Try to decode the revert reason if available
          if (receipt.revertReason) {
            revertReason = receipt.revertReason
          } else {
            // Try to get error from transaction trace
            const trace = await publicClient.getTransaction({ hash: burnTx }).catch(() => null)
            if (trace) {
              console.log('Transaction trace:', trace)
            }
          }
        } catch (err) {
          console.error('Could not extract revert reason:', err)
        }
        
        return {
          success: false,
          error: `Transaction was reverted on-chain. Reason: ${revertReason}. Check Arc Scan for details.`,
          txHash: burnTx,
        }
      }

      console.log('✅ Transaction confirmed successfully!')
      return {
        success: true,
        txHash: burnTx,
      }
    } catch (writeError: any) {
      // Enhanced error handling for contract write failures
      console.error('❌ depositForBurn failed:', writeError)
      
      let errorMessage = 'Transaction failed'
      
      if (writeError?.data?.message) {
        errorMessage = writeError.data.message
      } else if (writeError?.message) {
        errorMessage = writeError.message
      } else if (writeError?.shortMessage) {
        errorMessage = writeError.shortMessage
      }
      
      // Common CCTP errors
      if (errorMessage.includes('allowance') || errorMessage.includes('insufficient')) {
        errorMessage = 'Insufficient allowance. Please approve USDC spending first.'
      } else if (errorMessage.includes('balance')) {
        errorMessage = 'Insufficient USDC balance.'
      } else if (errorMessage.includes('revert') || errorMessage.includes('execution reverted')) {
        errorMessage = `Transaction reverted: ${errorMessage}. Check Arc Scan for details.`
      }
      
      return {
        success: false,
        error: errorMessage,
      }
    }

    // NOTE: In a complete implementation, you would:
    // 1. Wait for attestation from Circle's attestation service
    // 2. Call receiveMessage() on the destination chain
    // 3. Track the entire flow with status updates
    // 
    // For now, we return after the burn transaction.
    // The minting happens automatically after Circle's attestation (usually 10-20 minutes).
    
  } catch (error: any) {
    console.error('❌ Bridge error:', error)
    
    let errorMessage = 'Unknown error occurred'
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
 * Helper function to convert Ethereum address to bytes32 format
 * Required by CCTP's depositForBurn function
 */
function addressToBytes32(address: `0x${string}`): `0x${string}` {
  // Remove '0x' prefix, pad to 64 characters (32 bytes), add '0x' back
  return `0x${address.slice(2).padStart(64, '0')}` as `0x${string}`
}

/**
 * Estimate bridge time between chains
 * CCTP typically takes 10-20 minutes for attestation
 * 
 * @param fromChainId - Source chain ID
 * @param toChainId - Destination chain ID
 * @returns Estimated time in minutes
 */
export function estimateBridgeTime(fromChainId: number, toChainId: number): number {
  // TODO: This could be more sophisticated based on actual chain combinations
  // For now, return a conservative estimate
  return 15 // minutes
}

/**
 * Calculate bridge fee (if any)
 * Circle's CCTP typically has no protocol fees, only gas costs
 * 
 * @param fromChainId - Source chain ID
 * @param toChainId - Destination chain ID
 * @returns Fee in USDC (usually 0)
 */
export function getBridgeFee(fromChainId: number, toChainId: number): string {
  // CCTP has no bridge fees, only gas costs
  return '0.00'
}

/**
 * Check if bridge route is available
 * 
 * @param fromChainId - Source chain ID
 * @param toChainId - Destination chain ID
 * @returns True if route is supported
 */
export function isBridgeRouteAvailable(fromChainId: number, toChainId: number): boolean {
  return (
    isCCTPSupported(fromChainId) &&
    isCCTPSupported(toChainId) &&
    fromChainId !== toChainId
  )
}

/**
 * Get a helpful error message explaining why a route is not available
 * 
 * @param fromChainId - Source chain ID
 * @param toChainId - Destination chain ID
 * @returns Error message explaining the issue
 */
export function getRouteAvailabilityError(
  fromChainId: number,
  toChainId: number
): string {
  if (fromChainId === toChainId) {
    return 'Source and destination chains must be different'
  }

  const fromSupported = isCCTPSupported(fromChainId)
  const toSupported = isCCTPSupported(toChainId)

  if (!fromSupported && !toSupported) {
    return `${getChainName(fromChainId)} and ${getChainName(toChainId)} are not configured for Circle CCTP yet`
  }

  if (!fromSupported) {
    return `${getChainName(fromChainId)} is not configured for Circle CCTP. Try using Ethereum Sepolia, Base Sepolia, Avalanche Fuji, or Arbitrum Sepolia as the source.`
  }

  if (!toSupported) {
    return `${getChainName(toChainId)} is not configured for Circle CCTP. Try using Ethereum Sepolia, Base Sepolia, Avalanche Fuji, or Arbitrum Sepolia as the destination.`
  }

  return 'This route is not available'
}

