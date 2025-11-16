'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { getUSDCBalances, calculateTotalUSDC } from '@/lib/usdc'
import { getAllChains } from '@/config/chains'

interface BalanceState {
  balances: Record<number, string | null>
  total: string
  isLoading: boolean
  error: string | null
}

/**
 * Hook to fetch USDC balances across all supported networks
 * Automatically refetches when wallet address changes
 */
export function useUSDCBalances() {
  const { address, isConnected } = useAccount()
  const [state, setState] = useState<BalanceState>({
    balances: {},
    total: '0.00',
    isLoading: false,
    error: null,
  })

  useEffect(() => {
    // Don't fetch if wallet isn't connected
    if (!isConnected || !address) {
      setState({
        balances: {},
        total: '0.00',
        isLoading: false,
        error: null,
      })
      return
    }

    // Fetch balances
    async function fetchBalances() {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const chains = getAllChains()
        const balances = await getUSDCBalances(address, chains)
        const total = calculateTotalUSDC(balances)

        setState({
          balances,
          total,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        console.error('Error fetching USDC balances:', error)
        setState({
          balances: {},
          total: '0.00',
          isLoading: false,
          error: 'Failed to load balances. Please try again.',
        })
      }
    }

    fetchBalances()
  }, [address, isConnected])

  return state
}

