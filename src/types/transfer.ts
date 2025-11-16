/**
 * Transfer Record Types
 * Used for storing transfer history in localStorage
 */

export type TransferStatus = 'pending' | 'in_transit' | 'completed' | 'failed'

export interface TransferRecord {
  id: string // Unique identifier (timestamp-based)
  fromChainId: number
  fromChainName: string
  toChainId: number
  toChainName: string
  amount: string // e.g., "10.00"
  recipient: string // 0x address
  timestamp: number // Unix timestamp
  status: TransferStatus
  txHash?: string // Transaction hash from source chain
  explorerUrl?: string // Full URL to block explorer
}

export interface TransferStore {
  transfers: TransferRecord[]
}

