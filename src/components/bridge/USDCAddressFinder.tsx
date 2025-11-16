'use client'

import { useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { checkWalletUSDCBalance, verifyUSDCAddress } from '@/lib/verifyUSDC'
import { getAllChains, getNetworkInfo } from '@/config/chains'
import { Loader2, CheckCircle2, XCircle, Search } from 'lucide-react'

/**
 * Component to help find/verify USDC contract addresses
 * Useful for debugging and finding the correct USDC address for a chain
 */
export default function USDCAddressFinder() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [testingAddress, setTestingAddress] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [result, setResult] = useState<{
    isValid: boolean
    symbol?: string
    decimals?: number
    balance?: string
    error?: string
  } | null>(null)

  if (!isConnected || !address) {
    return null
  }

  const currentChain = getNetworkInfo(chainId)

  const handleTestAddress = async () => {
    if (!testingAddress || !testingAddress.startsWith('0x')) {
      setResult({
        isValid: false,
        error: 'Please enter a valid Ethereum address (starts with 0x)',
      })
      return
    }

    if (!currentChain) {
      setResult({
        isValid: false,
        error: 'Please connect to a supported network',
      })
      return
    }

    setIsTesting(true)
    setResult(null)

    try {
      // First verify it's USDC
      const verification = await verifyUSDCAddress(
        testingAddress as `0x${string}`,
        currentChain.chain
      )

      if (!verification.isValid) {
        setResult({
          isValid: false,
          symbol: verification.symbol,
          error: verification.error || `Token symbol is "${verification.symbol}", not USDC`,
        })
        setIsTesting(false)
        return
      }

      // Then check balance
      const balanceCheck = await checkWalletUSDCBalance(
        address,
        testingAddress as `0x${string}`,
        currentChain.chain
      )

      setResult({
        isValid: true,
        symbol: verification.symbol,
        decimals: verification.decimals,
        balance: balanceCheck.balance,
        error: balanceCheck.error,
      })
    } catch (error) {
      setResult({
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        Find USDC Contract Address
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Test an address to see if it's a USDC contract and check your balance.
        This helps verify the correct USDC address for {currentChain?.chain.name || 'this network'}.
      </p>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="0x..."
            value={testingAddress}
            onChange={(e) => setTestingAddress(e.target.value)}
            className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            onClick={handleTestAddress}
            disabled={isTesting || !testingAddress}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isTesting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Test
              </>
            )}
          </button>
        </div>

        {result && (
          <div
            className={`p-4 rounded-lg border ${
              result.isValid
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-start gap-3">
              {result.isValid ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                {result.isValid ? (
                  <>
                    <p className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      ✅ Valid USDC Contract!
                    </p>
                    <div className="space-y-1 text-sm text-green-800 dark:text-green-200">
                      <p>
                        <strong>Symbol:</strong> {result.symbol}
                      </p>
                      <p>
                        <strong>Decimals:</strong> {result.decimals}
                      </p>
                      {result.balance !== undefined && (
                        <p>
                          <strong>Your Balance:</strong> {result.balance} USDC
                        </p>
                      )}
                      <p className="mt-2 font-mono text-xs bg-white/50 dark:bg-gray-900/50 p-2 rounded">
                        {testingAddress}
                      </p>
                      <p className="text-xs mt-2">
                        💡 Copy this address to <code className="bg-white/50 dark:bg-gray-900/50 px-1 rounded">src/config/tokens.ts</code> for chain ID {chainId}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-red-900 dark:text-red-100 mb-2">
                      ❌ Not a USDC Contract
                    </p>
                    <div className="space-y-1 text-sm text-red-800 dark:text-red-200">
                      {result.symbol && (
                        <p>
                          <strong>Token Symbol:</strong> {result.symbol} (expected USDC)
                        </p>
                      )}
                      {result.error && <p>{result.error}</p>}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

