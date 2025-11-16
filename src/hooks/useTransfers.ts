'use client'

import { useState, useEffect } from 'react'
import { TransferRecord } from '@/types/transfer'
import { loadTransfers, addTransfer as addTransferToStorage } from '@/lib/transferStorage'

/**
 * React hook for managing transfer history
 * Provides reactive state that syncs with localStorage
 */
export function useTransfers() {
  const [transfers, setTransfers] = useState<TransferRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load transfers on mount
  useEffect(() => {
    const loaded = loadTransfers()
    setTransfers(loaded)
    setIsLoading(false)
  }, [])

  // Add a new transfer
  const addTransfer = (transfer: Omit<TransferRecord, 'id' | 'timestamp'>) => {
    const newTransfer = addTransferToStorage(transfer)
    setTransfers((prev) => [newTransfer, ...prev])
    return newTransfer
  }

  // Refresh transfers from localStorage
  const refresh = () => {
    const loaded = loadTransfers()
    setTransfers(loaded)
  }

  return {
    transfers,
    isLoading,
    addTransfer,
    refresh,
  }
}

