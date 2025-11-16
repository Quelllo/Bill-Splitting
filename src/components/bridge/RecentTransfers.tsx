'use client'

import { useEffect, useState } from 'react'
import { Clock, ArrowRight, ExternalLink, History, Trash2 } from 'lucide-react'
import { useTransfers } from '@/hooks/useTransfers'
import { formatRelativeTime, clearAllTransfers } from '@/lib/transferStorage'

export default function RecentTransfers() {
  const { transfers, isLoading, refresh } = useTransfers()
  const [isClearing, setIsClearing] = useState(false)

  // Refresh on mount to catch any updates from other tabs/windows
  useEffect(() => {
    refresh()
  }, [])

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all transfer history? This cannot be undone.')) {
      setIsClearing(true)
      try {
        clearAllTransfers()
        refresh() // Refresh to update the UI
      } catch (error) {
        console.error('Failed to clear transfers:', error)
      } finally {
        setIsClearing(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Transfers
        </h2>
        <div className="text-center py-8">
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (transfers.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <History className="w-5 h-5" />
          Recent Transfers
        </h2>

        {/* Empty state */}
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            No transfers yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Your transfer history will appear here after you move USDC
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <History className="w-5 h-5" />
          Recent Transfers
        </h2>
        {transfers.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={isClearing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear all transfer history"
          >
            <Trash2 className="w-4 h-4" />
            {isClearing ? 'Clearing...' : 'Clear All'}
          </button>
        )}
      </div>

      {/* Transfers List */}
      <div className="space-y-3">
        {transfers.map((transfer) => (
          <div
            key={transfer.id}
            className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          >
            {/* Header: Amount and Time */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {transfer.amount} USDC
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {formatRelativeTime(transfer.timestamp)}
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {transfer.status === 'completed' && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                    Completed
                  </span>
                )}
                {transfer.status === 'in_transit' && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded">
                    In Transit
                  </span>
                )}
                {transfer.status === 'pending' && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                    Pending
                  </span>
                )}
                {transfer.status === 'failed' && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                    Failed
                  </span>
                )}
              </div>
            </div>

            {/* Route: From → To */}
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
              <span className="font-medium">{transfer.fromChainName}</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{transfer.toChainName}</span>
            </div>

            {/* Recipient (shortened) */}
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              To: {transfer.recipient.slice(0, 6)}...{transfer.recipient.slice(-4)}
            </div>

            {/* Action: View on Explorer */}
            {transfer.explorerUrl && (
              <a
                href={transfer.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on explorer
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Footer note */}
      {transfers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Showing {transfers.length} {transfers.length === 1 ? 'transfer' : 'transfers'} stored locally
          </p>
        </div>
      )}
    </div>
  )
}

