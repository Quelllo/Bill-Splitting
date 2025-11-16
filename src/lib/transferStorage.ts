/**
 * Transfer Storage - localStorage management for transfer history
 * 
 * Simple localStorage wrapper with no backend dependencies.
 * Stores transfer records locally in the browser.
 */

import { TransferRecord, TransferStore } from '@/types/transfer'

const STORAGE_KEY = 'usdc_bridge_transfers'
const MAX_TRANSFERS = 50 // Keep last 50 transfers to avoid localStorage limits

/**
 * Load all transfers from localStorage
 */
export function loadTransfers(): TransferRecord[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const data: TransferStore = JSON.parse(stored)
    return data.transfers || []
  } catch (error) {
    console.error('Failed to load transfers from localStorage:', error)
    return []
  }
}

/**
 * Save transfers to localStorage
 */
function saveTransfers(transfers: TransferRecord[]): void {
  if (typeof window === 'undefined') return
  
  try {
    // Keep only the most recent transfers to avoid localStorage size limits
    const recentTransfers = transfers.slice(0, MAX_TRANSFERS)
    
    const data: TransferStore = {
      transfers: recentTransfers,
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save transfers to localStorage:', error)
  }
}

/**
 * Add a new transfer record
 * Automatically sorts by timestamp (newest first)
 */
export function addTransfer(transfer: Omit<TransferRecord, 'id' | 'timestamp'>): TransferRecord {
  const newTransfer: TransferRecord = {
    ...transfer,
    id: `transfer-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: Date.now(),
  }
  
  const transfers = loadTransfers()
  const updatedTransfers = [newTransfer, ...transfers]
  saveTransfers(updatedTransfers)
  
  return newTransfer
}

/**
 * Update an existing transfer record
 * Useful for updating status or adding transaction details
 */
export function updateTransfer(id: string, updates: Partial<TransferRecord>): TransferRecord | null {
  const transfers = loadTransfers()
  const index = transfers.findIndex(t => t.id === id)
  
  if (index === -1) {
    console.warn(`Transfer with id ${id} not found`)
    return null
  }
  
  const updatedTransfer = {
    ...transfers[index],
    ...updates,
  }
  
  transfers[index] = updatedTransfer
  saveTransfers(transfers)
  
  return updatedTransfer
}

/**
 * Delete a transfer record
 */
export function deleteTransfer(id: string): boolean {
  const transfers = loadTransfers()
  const filteredTransfers = transfers.filter(t => t.id !== id)
  
  if (filteredTransfers.length === transfers.length) {
    return false // Transfer not found
  }
  
  saveTransfers(filteredTransfers)
  return true
}

/**
 * Clear all transfers
 */
export function clearAllTransfers(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear transfers:', error)
  }
}

/**
 * Get transfer by ID
 */
export function getTransferById(id: string): TransferRecord | null {
  const transfers = loadTransfers()
  return transfers.find(t => t.id === id) || null
}

/**
 * Get transfers sorted by timestamp (newest first)
 */
export function getRecentTransfers(limit?: number): TransferRecord[] {
  const transfers = loadTransfers()
  
  // Already sorted by timestamp when added, but sort again to be safe
  const sorted = transfers.sort((a, b) => b.timestamp - a.timestamp)
  
  if (limit) {
    return sorted.slice(0, limit)
  }
  
  return sorted
}

/**
 * Format relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (seconds < 60) {
    return 'Just now'
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  } else if (days < 30) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  } else {
    return new Date(timestamp).toLocaleDateString()
  }
}

