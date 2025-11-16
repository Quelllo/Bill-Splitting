'use client'

import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { Network, ChevronDown, ExternalLink } from 'lucide-react'
import { SUPPORTED_NETWORKS, getNetworkInfo } from '@/config/chains'
import { useState, useEffect } from 'react'

export default function NetworkStatus() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [isNetworkMenuOpen, setIsNetworkMenuOpen] = useState(false)

  // Debug logging (only when values change)
  useEffect(() => {
    if (isConnected && address && chainId) {
      const currentNetwork = getNetworkInfo(chainId)
      console.log(`🔗 Wallet connected: ${address}`)
      console.log(`🌐 Chain ID from wallet: ${chainId}`)
      console.log(`📋 Network:`, currentNetwork ? currentNetwork.chain.name : `Unsupported (${chainId})`)
    }
  }, [isConnected, address, chainId])

  if (!isConnected || !address) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Connect your wallet to get started
        </p>
      </div>
    )
  }

  const currentNetwork = getNetworkInfo(chainId)
  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Network className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        Network Status
      </h3>

      {/* Connected Address */}
      <div className="space-y-1">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">
          Your Wallet
        </p>
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
          <code className="text-sm font-mono text-gray-900 dark:text-white">
            {shortenedAddress}
          </code>
          {currentNetwork && (
            <a
              href={`${currentNetwork.chain.blockExplorers?.default.url}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              aria-label="View on explorer"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Current Network */}
      <div className="space-y-1">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">
          Current Network
        </p>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
          {currentNetwork ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentNetwork.logo}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {currentNetwork.chain.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Chain ID: {chainId} {chainId === 12345 && '(Placeholder - update in chains.ts)'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-medium text-orange-600 dark:text-orange-400">
                  Unsupported Network
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Please switch to a supported network
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Network Switcher */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">
          Switch Network
        </p>
        <div className="relative">
          <button
            onClick={() => setIsNetworkMenuOpen(!isNetworkMenuOpen)}
            className="w-full flex items-center justify-between bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-3 transition-colors font-medium"
          >
            <span>Change Network</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isNetworkMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isNetworkMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
              {SUPPORTED_NETWORKS.map((network) => {
                const isCurrent = network.chain.id === chainId
                
                return (
                  <button
                    key={network.chain.id}
                    onClick={() => {
                      if (!isCurrent) {
                        switchChain({ chainId: network.chain.id })
                      }
                      setIsNetworkMenuOpen(false)
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                      isCurrent ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                    disabled={isCurrent}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{network.logo}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {network.chain.name}
                          </p>
                          {isCurrent && (
                            <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded">
                              Connected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {network.description}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Network Description */}
      {currentNetwork && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-800 dark:text-blue-300">
            💡 {currentNetwork.description}
          </p>
        </div>
      )}
    </div>
  )
}

