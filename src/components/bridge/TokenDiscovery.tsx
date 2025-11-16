'use client'

import { useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { Search, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { checkTokenSupport, findSupportedUSDCAddress, getLocalTokenMapping } from '@/lib/findSupportedToken'
import { getUSDCAddress } from '@/config/tokens'
import { getNetworkInfo } from '@/config/chains'
import { CIRCLE_DOMAIN_IDS } from '@/config/bridgeKit'

/**
 * Component to help discover the correct USDC token address for CCTP
 * 
 * This is a debugging tool to find which token address is actually
 * supported by TokenMessenger on a given chain
 */
export default function TokenDiscovery() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const [isChecking, setIsChecking] = useState(false)
  const [manualAddress, setManualAddress] = useState('')
  const [results, setResults] = useState<{
    currentAddress?: { isSupported: boolean; error?: string }
    candidates?: { supportedAddress: string | null; results: Record<string, boolean> }
    localTokenMapping?: { localToken: string | null; error?: string }
    manualCheck?: { isSupported: boolean; error?: string }
  }>({})

  const handleCheckCurrent = async () => {
    if (!isConnected) return

    setIsChecking(true)
    const currentUSDC = getUSDCAddress(chainId)
    
    if (!currentUSDC) {
      setResults({ currentAddress: { isSupported: false, error: 'No USDC address configured' } })
      setIsChecking(false)
      return
    }

    const check = await checkTokenSupport(currentUSDC, chainId)
    setResults({ currentAddress: check })
    setIsChecking(false)
  }

  const handleFindSupported = async () => {
    if (!isConnected) return

    setIsChecking(true)
    
    // Common USDC addresses to test
    // On Arc Testnet, 0x3600000000000000000000000000000000000000 is the official USDC address from Circle
    const candidates: `0x${string}`[] = [
      getUSDCAddress(chainId) || '0x0000000000000000000000000000000000000000',
      // Add more candidate addresses here if you find them in Arc/Circle docs
    ].filter(addr => addr !== '0x0000000000000000000000000000000000000000') as `0x${string}`[]

    const found = await findSupportedUSDCAddress(chainId, candidates)
    setResults(prev => ({ ...prev, candidates: { ...found, supportedAddress: found.supportedAddress || null } }))
    setIsChecking(false)
  }

  const handleCheckMapping = async () => {
    if (!isConnected) return

    setIsChecking(true)
    
    // Try to get local token mapping using Sepolia USDC
    const sepoliaUSDC = getUSDCAddress(11155111) // Sepolia USDC
    const sepoliaDomain = CIRCLE_DOMAIN_IDS[11155111] // Domain 0
    
    if (sepoliaUSDC && sepoliaDomain !== undefined) {
      const mapping = await getLocalTokenMapping(sepoliaUSDC, sepoliaDomain, chainId)
      setResults(prev => ({ ...prev, localTokenMapping: mapping }))
    }
    
    setIsChecking(false)
  }

  const handleCheckManual = async () => {
    if (!isConnected || !manualAddress) return

    // Basic address validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(manualAddress)) {
      setResults(prev => ({
        ...prev,
        manualCheck: { isSupported: false, error: 'Invalid address format' },
      }))
      return
    }

    setIsChecking(true)
    const check = await checkTokenSupport(manualAddress as `0x${string}`, chainId)
    setResults(prev => ({ ...prev, manualCheck: check }))
    setIsChecking(false)
  }

  const network = getNetworkInfo(chainId)
  const currentUSDC = getUSDCAddress(chainId)

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          Connect your wallet to use the token discovery tool
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Search className="w-5 h-5" />
        Token Discovery Tool
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        This tool helps find which USDC ERC-20 token address is actually supported by TokenMessenger for CCTP bridging.
        <br />
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
          Note: On Arc Testnet, USDC is the native currency. The USDC address from Circle docs may serve as both the native currency and ERC-20 token address.
        </span>
      </p>

      <div className="space-y-3 mb-4">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Network</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {network?.chain?.name || `Chain ${chainId}`}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Configured USDC Address</p>
          <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
            {currentUSDC || 'Not configured'}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleCheckCurrent}
          disabled={isChecking || !currentUSDC}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isChecking ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Check Current Address
            </>
          )}
        </button>

        <button
          onClick={handleFindSupported}
          disabled={isChecking}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isChecking ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Find Supported Address
            </>
          )}
        </button>

        <button
          onClick={handleCheckMapping}
          disabled={isChecking}
          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isChecking ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Check Token Mapping
            </>
          )}
        </button>
      </div>

      {/* Manual Address Input */}
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Test Custom Address
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Enter a USDC token address to check if it's supported by TokenMessenger
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            placeholder="0x..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCheckManual}
            disabled={isChecking || !manualAddress}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isChecking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Check
          </button>
        </div>
        {results.manualCheck && (
          <div className="mt-2 flex items-center gap-2">
            {results.manualCheck.isSupported ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-700 dark:text-green-300">✅ Supported!</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-700 dark:text-red-300">
                  ❌ Not Supported {results.manualCheck.error && `(${results.manualCheck.error})`}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {results.currentAddress && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Current Address Status:</p>
          <div className="flex items-center gap-2">
            {results.currentAddress.isSupported ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-700 dark:text-green-300">✅ Supported</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-700 dark:text-red-300">❌ Not Supported</span>
              </>
            )}
          </div>
          {results.currentAddress.error && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{results.currentAddress.error}</p>
          )}
        </div>
      )}

      {results.candidates && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Candidate Addresses:</p>
          {results.candidates.supportedAddress ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm font-mono text-green-700 dark:text-green-300 break-all">
                  {results.candidates.supportedAddress}
                </span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">
                ✅ This address is supported! Update your config with this address.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {Object.entries(results.candidates.results).map(([address, isSupported]) => (
                <div key={address} className="flex items-center gap-2 text-xs">
                  {isSupported ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="font-mono text-gray-700 dark:text-gray-300 break-all">{address}</span>
                  <span className={isSupported ? 'text-green-600' : 'text-red-600'}>
                    {isSupported ? '✅' : '❌'}
                  </span>
                </div>
              ))}
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                ❌ No supported address found. The token may need to be registered by Circle/Arc.
              </p>
            </div>
          )}
        </div>
      )}

      {results.localTokenMapping && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Token Mapping:</p>
          {results.localTokenMapping.localToken ? (
            <div className="space-y-1">
              <p className="text-sm font-mono text-green-700 dark:text-green-300 break-all">
                {results.localTokenMapping.localToken}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                ✅ Found mapped token address
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              No token mapping found. {results.localTokenMapping.error && `Error: ${results.localTokenMapping.error}`}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

