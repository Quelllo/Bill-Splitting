import { Clock } from 'lucide-react'

export default function TransferHistory() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Transfer History
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
          Your transfer history will appear here
        </p>
      </div>
    </div>
  )
}

