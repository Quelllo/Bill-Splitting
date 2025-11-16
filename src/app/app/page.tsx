import WalletConnect from '@/components/bridge/WalletConnect'
import NetworkStatus from '@/components/bridge/NetworkStatus'
import BalanceDisplay from '@/components/bridge/BalanceDisplay'
import BridgeForm from '@/components/bridge/BridgeForm'
import TransferHistory from '@/components/bridge/TransferHistory'

export default function AppPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            USDC Bridge Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Move USDC seamlessly across multiple chains
          </p>
        </div>
        <WalletConnect />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Network Status & Balances */}
        <div className="lg:col-span-1 space-y-6">
          <NetworkStatus />
          <BalanceDisplay />
        </div>

        {/* Right Column - Bridge & History */}
        <div className="lg:col-span-2 space-y-6">
          <BridgeForm />
          <TransferHistory />
        </div>
      </div>
    </div>
  )
}

