import { ArrowDown } from 'lucide-react'

export default function BridgeForm() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Move USDC
      </h2>

      {/* From Section */}
      <div className="space-y-2 mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          From
        </label>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <input
              type="text"
              placeholder="0.00"
              className="bg-transparent text-2xl font-semibold text-gray-900 dark:text-white outline-none w-full"
              disabled
            />
            <span className="text-gray-500 dark:text-gray-400 font-medium">USDC</span>
          </div>
          <select 
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
            disabled
          >
            <option>Select source chain</option>
            <option>Ethereum Sepolia</option>
            <option>Avalanche Fuji</option>
            <option>Arbitrum Sepolia</option>
            <option>Base Sepolia</option>
          </select>
        </div>
      </div>

      {/* Swap Arrow */}
      <div className="flex justify-center -my-2 relative z-10">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2">
          <ArrowDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </div>
      </div>

      {/* To Section */}
      <div className="space-y-2 mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          To
        </label>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="text-2xl font-semibold text-gray-400">0.00</div>
            <span className="text-gray-500 dark:text-gray-400 font-medium">USDC</span>
          </div>
          <select 
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
            disabled
          >
            <option>Select destination chain</option>
            <option>Ethereum Sepolia</option>
            <option>Avalanche Fuji</option>
            <option>Arbitrum Sepolia</option>
            <option>Base Sepolia</option>
          </select>
        </div>
      </div>

      {/* Bridge Info */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Transfer time</span>
          <span className="font-medium text-gray-900 dark:text-white">~30-60 seconds</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Bridge fee</span>
          <span className="font-medium text-gray-900 dark:text-white">$0 (gas only)</span>
        </div>
      </div>

      {/* Bridge Button */}
      <button 
        className="w-full py-4 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg font-semibold cursor-not-allowed"
        disabled
      >
        Connect wallet to bridge
      </button>
    </div>
  )
}

