'use client'

import { useAccount } from 'wagmi'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { useUSDCBalances } from '@/hooks/useUSDCBalances'
import { SUPPORTED_NETWORKS, getNetworkInfo } from '@/config/chains'
import { hasUSDCAddress } from '@/config/tokens'

export default function BalanceDisplay() {
  const { isConnected } = useAccount()
  const { balances, total, isLoading, error } = useUSDCBalances()

  // Show connect wallet message if not connected
  if (!isConnected) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          USDC Balances
        </h2>
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 Connect your wallet to see your balances
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      {/* Header with Total */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            USDC Balances
          </h2>
          {isLoading && (
            <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
          )}
        </div>
        
        {/* Total Balance */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
          <p className="text-sm text-primary-700 dark:text-primary-300 font-medium mb-1">
            Total Across All Networks
          </p>
          <p className="text-3xl font-bold text-primary-900 dark:text-primary-100">
            ${total}
          </p>
          <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
            USDC
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Balance Cards */}
      <div className="space-y-3">
        {SUPPORTED_NETWORKS.map((network) => {
          const balance = balances[network.chain.id]
          const isConfigured = hasUSDCAddress(network.chain.id)
          
          return (
            <div 
              key={network.chain.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800"
            >
              {/* Network Info */}
              <div className="flex items-center gap-3">
                <span className="text-2xl">{network.logo}</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {network.chain.name}
                  </div>
                  {!isConfigured && (
                    <div className="text-xs text-orange-600 dark:text-orange-400">
                      USDC address not configured
                    </div>
                  )}
                </div>
              </div>

              {/* Balance */}
              <div className="text-right">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Loading...
                    </span>
                  </div>
                ) : balance !== null ? (
                  <>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      ${parseFloat(balance).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      USDC
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-400 dark:text-gray-500">
                    —
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Help Text */}
      {isConnected && !isLoading && (
        <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            💡 Need testnet USDC? Visit the{' '}
            <a 
              href="https://faucet.circle.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Circle Testnet Faucet
            </a>
            {' '}to get free USDC on these networks.
          </p>
        </div>
      )}
    </div>
  )
}
