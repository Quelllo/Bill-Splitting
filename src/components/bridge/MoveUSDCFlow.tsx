'use client'

import { useState, useMemo, useEffect } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { ArrowDown, Loader2, AlertCircle, CheckCircle2, ExternalLink, Zap } from 'lucide-react'
import { SUPPORTED_NETWORKS, getNetworkInfo } from '@/config/chains'
import { getUSDCAddress } from '@/config/tokens'
import { bridgeUSDC, estimateBridgeTime, isBridgeRouteAvailable, getRouteAvailabilityError } from '@/services/bridgeKitClient'
import { isCCTPSupported } from '@/config/bridgeKit'
import { useUSDCBalances } from '@/hooks/useUSDCBalances'
import { useTransfers } from '@/hooks/useTransfers'

type TransferStatus = 'idle' | 'preparing' | 'awaiting_approval' | 'in_transit' | 'completed' | 'error'

export default function MoveUSDCFlow() {
  const { address, isConnected, chain: connectedChain } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { balances, refresh: refreshBalances } = useUSDCBalances()
  const { addTransfer } = useTransfers()

  // Form state
  const [fromChainId, setFromChainId] = useState<number | null>(null)
  const [toChainId, setToChainId] = useState<number | null>(null)
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [status, setStatus] = useState<TransferStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [txHash, setTxHash] = useState<string | null>(null)

  // Set recipient to connected address when wallet connects
  useEffect(() => {
    if (address && !recipient) {
      setRecipient(address)
    }
  }, [address, recipient])

  // Set from chain to currently connected chain if available
  useEffect(() => {
    if (connectedChain && !fromChainId) {
      const network = getNetworkInfo(connectedChain.id)
      if (network) {
        setFromChainId(connectedChain.id)
      }
    }
  }, [connectedChain, fromChainId])

  // Refresh component state when wallet connects/disconnects
  useEffect(() => {
    if (isConnected && address && walletClient) {
      console.log('✅ Wallet connected and ready:', { address, walletClient: !!walletClient })
      // Refresh balances when wallet connects
      refreshBalances()
      // Reset any error states when wallet connects
      if (status === 'error' && errorMessage.includes('Wallet')) {
        setStatus('idle')
        setErrorMessage('')
      }
    } else if (!isConnected) {
      console.log('🔌 Wallet disconnected')
      // Reset form when wallet disconnects
      setStatus('idle')
      setErrorMessage('')
    }
  }, [isConnected, address, walletClient, status, errorMessage, refreshBalances])

  // Show all networks in "to" dropdown (validation will prevent same-chain bridging)
  // This allows users to see all options, but they'll get a clear error if they select the same chain
  const availableToNetworks = SUPPORTED_NETWORKS

  // Get balance for selected "from" chain
  const fromChainBalance = useMemo(() => {
    if (!fromChainId || !balances[fromChainId]) return '0'
    return balances[fromChainId] || '0'
  }, [fromChainId, balances])

  // Calculate percentage amounts
  const setPercentage = (percent: number) => {
    const balance = parseFloat(fromChainBalance)
    if (balance > 0) {
      const percentAmount = (balance * percent) / 100
      setAmount(percentAmount.toFixed(2))
    }
  }

  // Set max amount
  const setMaxAmount = () => {
    setAmount(fromChainBalance)
  }

  // Validate form
  const validation = useMemo(() => {
    if (!isConnected) return { isValid: false, error: 'Please connect your wallet' }
    if (!fromChainId) return { isValid: false, error: 'Please select source network' }
    if (!toChainId) return { isValid: false, error: 'Please select destination network' }
    if (!amount || parseFloat(amount) <= 0) return { isValid: false, error: 'Please enter an amount' }
    if (!recipient || !recipient.startsWith('0x')) return { isValid: false, error: 'Please enter a valid recipient address' }
    
    const amountNum = parseFloat(amount)
    const balanceNum = parseFloat(fromChainBalance)
    if (amountNum > balanceNum) return { isValid: false, error: 'Insufficient balance' }
    
    // Check if same chain selected
    if (fromChainId === toChainId) {
      return { isValid: false, error: 'Cannot bridge to the same network. Please select a different destination chain.' }
    }
    
    // Check if route is available (CCTP support)
    if (!isBridgeRouteAvailable(fromChainId, toChainId)) {
      return { isValid: false, error: getRouteAvailabilityError(fromChainId, toChainId) }
    }

    return { isValid: true, error: null }
  }, [isConnected, fromChainId, toChainId, amount, recipient, fromChainBalance])

  // Handle bridge transaction
  const handleBridge = async () => {
    console.log('🔵 handleBridge called')
    console.log('  validation.isValid:', validation.isValid)
    console.log('  isConnected:', isConnected)
    console.log('  walletClient:', walletClient ? 'exists' : 'missing')
    console.log('  address:', address)
    console.log('  fromChainId:', fromChainId)
    console.log('  toChainId:', toChainId)
    
    // Check each condition and log what's missing
    if (!validation.isValid) {
      console.error('❌ Validation failed:', validation.error)
      setStatus('error')
      setErrorMessage(validation.error || 'Please check your inputs')
      return
    }
    
    // Check connection status first
    if (!isConnected) {
      console.error('❌ Wallet not connected')
      setStatus('error')
      setErrorMessage('Please connect your wallet first.')
      return
    }
    
    if (!address) {
      console.error('❌ No wallet address')
      setStatus('error')
      setErrorMessage('No wallet address found. Please reconnect your wallet.')
      return
    }
    
    if (!fromChainId || !toChainId) {
      console.error('❌ Missing chain IDs:', { fromChainId, toChainId })
      setStatus('error')
      setErrorMessage('Please select both source and destination networks.')
      return
    }
    
    // walletClient might not be immediately available, try to get it
    let client = walletClient
    if (!client) {
      console.warn('⚠️ walletClient not available, trying to get it...')
      // Sometimes walletClient needs a moment to be ready
      // Try waiting a bit or check if we can proceed
      setStatus('error')
      setErrorMessage('Wallet client is not ready. Please try disconnecting and reconnecting your wallet, then try again.')
      return
    }

    console.log('✅ All checks passed, starting bridge...')
    setStatus('preparing')
    setErrorMessage('')
    setTxHash(null)

    try {
      const fromNetwork = getNetworkInfo(fromChainId)
      const toNetwork = getNetworkInfo(toChainId)

      if (!fromNetwork || !toNetwork) {
        throw new Error('Network configuration not found')
      }

      setStatus('awaiting_approval')

      const result = await bridgeUSDC(
        {
          fromChainId,
          toChainId,
          amount,
          recipient: recipient as `0x${string}`,
          sourceChain: fromNetwork.chain,
          destinationChain: toNetwork.chain,
        },
        client
      )

      if (result.success && result.txHash) {
        setTxHash(result.txHash)
        setStatus('in_transit')
        
        // Save transfer to history
        const explorerUrl = fromNetwork.chain.blockExplorers?.default.url
          ? `${fromNetwork.chain.blockExplorers.default.url}/tx/${result.txHash}`
          : undefined
        
        addTransfer({
          fromChainId,
          fromChainName: fromNetwork.chain.name,
          toChainId,
          toChainName: toNetwork.chain.name,
          amount,
          recipient: recipient as `0x${string}`,
          status: 'in_transit',
          txHash: result.txHash,
          explorerUrl,
        })
        
        // TODO: In a full implementation, you would:
        // - Poll for attestation from Circle
        // - Track when minting occurs on destination
        // - Update to 'completed' when done
        // For now, we show "in_transit" and user can check manually
        
      } else {
        setStatus('error')
        setErrorMessage(result.error || 'Transaction failed')
      }
    } catch (error) {
      console.error('Bridge error:', error)
      setStatus('error')
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Something went wrong before your USDC moved. Please try again.'
      )
    }
  }

  // Reset form
  const resetForm = () => {
    setStatus('idle')
    setErrorMessage('')
    setTxHash(null)
    setAmount('')
  }

  // Quick reset - just reset status to allow new transfers (keep form values)
  const quickReset = () => {
    setStatus('idle')
    setErrorMessage('')
    // Keep form values so user doesn't have to re-enter
  }

  const fromNetwork = fromChainId ? getNetworkInfo(fromChainId) : null
  const toNetwork = toChainId ? getNetworkInfo(toChainId) : null
  const estimatedTime = fromChainId && toChainId ? estimateBridgeTime(fromChainId, toChainId) : 15

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Move USDC
      </h2>

      {/* From Network Section */}
      <div className="space-y-2 mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          From Network
        </label>
        <select
          value={fromChainId || ''}
          onChange={(e) => {
            const chainId = e.target.value ? parseInt(e.target.value) : null
            setFromChainId(chainId)
            // Reset "to" if it's the same as "from" (can't bridge to same chain)
            if (toChainId === chainId) {
              setToChainId(null)
            }
          }}
          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={status !== 'idle'}
        >
          <option value="">Select source network</option>
          {SUPPORTED_NETWORKS.length > 0 ? (
            SUPPORTED_NETWORKS.map((network) => {
              const hasCCTP = isCCTPSupported(network.chain.id)
              return (
                <option key={network.chain.id} value={network.chain.id}>
                  {network.logo} {network.chain.name} {hasCCTP ? '✓' : '(CCTP not configured)'}
                </option>
              )
            })
          ) : (
            <option value="" disabled>No networks available</option>
          )}
        </select>
        {fromChainId && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Balance: {parseFloat(fromChainBalance).toFixed(2)} USDC
          </p>
        )}
      </div>

      {/* Amount Input */}
      <div className="space-y-2 mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Amount
        </label>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-2xl font-semibold text-gray-900 dark:text-white outline-none w-full"
              disabled={status !== 'idle'}
            />
            <button
              onClick={setMaxAmount}
              className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
              disabled={status !== 'idle'}
            >
              Max
            </button>
          </div>

          {/* Percentage Chips */}
          <div className="flex gap-2">
            {[25, 50, 100].map((percent) => (
              <button
                key={percent}
                onClick={() => setPercentage(percent)}
                className="flex-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                disabled={status !== 'idle'}
              >
                {percent}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Swap Arrow */}
      <div className="flex justify-center -my-2 relative z-10">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2">
          <ArrowDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </div>
      </div>

      {/* To Network Section */}
      <div className="space-y-2 mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          To Network
        </label>
        <select
          value={toChainId || ''}
          onChange={(e) => setToChainId(parseInt(e.target.value))}
          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={status !== 'idle'}
        >
          <option value="">Select destination network</option>
          {availableToNetworks.length > 0 ? (
            availableToNetworks.map((network) => {
              const hasCCTP = isCCTPSupported(network.chain.id)
              return (
                <option key={network.chain.id} value={network.chain.id}>
                  {network.logo} {network.chain.name} {hasCCTP ? '✓' : '(CCTP not configured)'}
                </option>
              )
            })
          ) : (
            <option value="" disabled>No networks available</option>
          )}
        </select>
        {fromChainId && toChainId && fromChainId === toChainId && (
          <p className="text-xs text-orange-600 dark:text-orange-400">
            ⚠️ Cannot bridge to the same network. Please select a different destination.
          </p>
        )}
      </div>

      {/* Recipient Address */}
      <div className="space-y-2 mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Recipient Address
        </label>
        <input
          type="text"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={status !== 'idle'}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          USDC will be sent to this address on the destination network
        </p>
      </div>

      {/* Review Section */}
      {validation.isValid && fromNetwork && toNetwork && amount && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Review Your Transfer
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
            You are moving <strong>{amount} USDC</strong> from{' '}
            <strong>{fromNetwork.chain.name}</strong> to{' '}
            <strong>{toNetwork.chain.name}</strong>.
          </p>
          <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
            <div className="flex justify-between">
              <span>Estimated time:</span>
              <span className="font-medium">{estimatedTime} minutes</span>
            </div>
            <div className="flex justify-between">
              <span>Bridge fee:</span>
              <span className="font-medium">$0 (gas only)</span>
            </div>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">
            💡 Plus network gas fees on the source chain
          </p>
        </div>
      )}

      {/* Error Message */}
      {status === 'error' && errorMessage && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
              Transfer Failed
            </p>
            <p className="text-sm text-red-800 dark:text-red-200">
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      {/* Status Panel */}
      {status !== 'idle' && status !== 'error' && (
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 rounded-lg p-4 mb-6 border border-primary-200 dark:border-primary-800">
          <div className="flex items-center gap-3 mb-3">
            {status === 'completed' ? (
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            ) : (
              <Loader2 className="w-6 h-6 text-primary-600 dark:text-primary-400 animate-spin" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-primary-900 dark:text-primary-100">
                {status === 'preparing' && 'Preparing transfer...'}
                {status === 'awaiting_approval' && 'Waiting for your confirmation'}
                {status === 'in_transit' && 'Your USDC is on the way!'}
                {status === 'completed' && 'Transfer Complete!'}
              </h3>
              <p className="text-sm text-primary-700 dark:text-primary-300 mt-0.5">
                {status === 'preparing' && 'Setting up your transfer'}
                {status === 'awaiting_approval' && 'Please approve the transaction in your wallet'}
                {status === 'in_transit' && `USDC will arrive in ~${estimatedTime} minutes`}
                {status === 'completed' && 'Your USDC has arrived on the destination chain'}
              </p>
            </div>
          </div>

          {/* Transaction Link */}
          {txHash && fromNetwork && (
            <a
              href={`${fromNetwork.chain.blockExplorers?.default.url}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary-700 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View transaction on {fromNetwork.chain.name}
            </a>
          )}

          {/* Progress Steps */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${status === 'preparing' || status === 'awaiting_approval' || status === 'in_transit' || status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-gray-700 dark:text-gray-300">Transfer prepared</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${status === 'in_transit' || status === 'completed' ? 'bg-green-500' : status === 'awaiting_approval' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-gray-700 dark:text-gray-300">Wallet confirmed</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${status === 'completed' ? 'bg-green-500' : status === 'in_transit' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-gray-700 dark:text-gray-300">In transit</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-gray-700 dark:text-gray-300">Arrived on destination</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      {status === 'idle' && (
        <button
          onClick={(e) => {
            e.preventDefault()
            console.log('🟢 Button clicked!')
            console.log('  Button disabled?', !validation.isValid)
            console.log('  Current validation:', validation)
            handleBridge()
          }}
          disabled={!validation.isValid || !isConnected || !walletClient}
          className={`w-full py-4 rounded-lg font-semibold text-white transition-colors ${
            validation.isValid
              ? 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800'
              : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
          }`}
        >
          {validation.isValid && isConnected && walletClient ? (
            <span className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              Move USDC
            </span>
          ) : !isConnected ? (
            <span className="text-gray-500 dark:text-gray-400">Please connect your wallet</span>
          ) : !walletClient ? (
            <span className="text-gray-500 dark:text-gray-400">Wallet initializing...</span>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">{validation.error}</span>
          )}
        </button>
      )}

      {/* Reset Button - Show when status is stuck */}
      {status !== 'idle' && status !== 'error' && (
        <button
          onClick={quickReset}
          className="w-full py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Reset Form (Try Again)
        </button>
      )}

      {/* Try Again Button */}
      {status === 'error' && (
        <button
          onClick={resetForm}
          className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
        >
          Try Again
        </button>
      )}

      {/* In Progress - Disabled Button */}
      {(status === 'preparing' || status === 'awaiting_approval') && (
        <button
          disabled
          className="w-full py-4 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg font-semibold cursor-not-allowed"
        >
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </span>
        </button>
      )}

      {/* In Transit - Reset Button */}
      {status === 'in_transit' && (
        <button
          onClick={resetForm}
          className="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Start New Transfer
        </button>
      )}

      {/* Completed - Reset Button */}
      {status === 'completed' && (
        <button
          onClick={resetForm}
          className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
        >
          Transfer More USDC
        </button>
      )}
    </div>
  )
}

