import { ExternalLink, Droplet, AlertCircle, Gift } from 'lucide-react'

export default function TestnetGuide() {
  const faucets = [
    {
      name: 'Circle Testnet Faucet',
      description: 'Get testnet USDC for Ethereum Sepolia, Base Sepolia, Avalanche Fuji, and Arbitrum Sepolia',
      url: 'https://faucet.circle.com',
      recommended: true,
      icon: '💵',
    },
    {
      name: 'Ethereum Sepolia Faucet',
      description: 'Get testnet ETH for gas fees on Ethereum Sepolia',
      url: 'https://sepoliafaucet.com',
      icon: '⟠',
    },
    {
      name: 'Avalanche Fuji Faucet',
      description: 'Get testnet AVAX for gas fees on Avalanche Fuji',
      url: 'https://core.app/tools/testnet-faucet',
      icon: '🔺',
    },
    {
      name: 'Arbitrum Sepolia Faucet',
      description: 'Get testnet ETH for gas fees on Arbitrum Sepolia',
      url: 'https://arbitrum.faucet.dev',
      icon: '🔷',
    },
    {
      name: 'Base Sepolia Faucet',
      description: 'Get testnet ETH for gas fees on Base Sepolia',
      url: 'https://portal.cdp.coinbase.com/products/faucet',
      icon: '🔵',
    },
    {
      name: 'Arc Testnet Resources',
      description: 'Documentation and faucet information for Arc testnet',
      url: 'https://docs.arc.network',
      icon: '🌐',
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <Droplet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Testnet Resources
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Get Testnet Funds
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              To use this app, you'll need testnet USDC and gas tokens. These are completely 
              free and have no real-world value—they're just for testing and development.
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 mb-12 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 text-lg mb-2">
                  Important: Testnet Tokens Only
                </h3>
                <p className="text-amber-800 dark:text-amber-200 mb-3">
                  All tokens used in this app are <strong>testnet tokens</strong>. They have 
                  <strong> no real value</strong> and cannot be exchanged for real cryptocurrency. 
                  This is a demonstration environment for testing blockchain applications safely.
                </p>
                <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-3 text-sm text-amber-700 dark:text-amber-300">
                  <strong>What you need:</strong> Testnet USDC (to transfer) + Gas tokens 
                  (ETH, AVAX, etc. to pay transaction fees)
                </div>
              </div>
            </div>
          </div>

          {/* Faucet Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {faucets.map((faucet, index) => (
              <a
                key={index}
                href={faucet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-lg transition-all group"
              >
                {faucet.recommended && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full mb-3">
                    <Gift className="w-3 h-3" />
                    Start Here
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{faucet.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {faucet.name}
                    </h3>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-shrink-0" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {faucet.description}
                </p>
              </a>
            ))}
          </div>

          {/* Quick Start Guide */}
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-primary-200 dark:border-primary-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Droplet className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              Quick Start Guide
            </h3>
            <ol className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <span>
                  <strong>Get USDC first:</strong> Visit the Circle Testnet Faucet and 
                  request USDC for your wallet address on any supported testnet.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <span>
                  <strong>Get gas tokens:</strong> Use the network-specific faucets above 
                  to get ETH, AVAX, etc. for paying transaction fees.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <span>
                  <strong>Start bridging:</strong> Once you have both USDC and gas tokens, 
                  head to the app and start moving USDC across chains!
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
