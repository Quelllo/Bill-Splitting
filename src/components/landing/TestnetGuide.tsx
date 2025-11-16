import { ExternalLink, Droplet } from 'lucide-react'

export default function TestnetGuide() {
  const faucets = [
    {
      name: 'Circle Testnet Faucet',
      description: 'Get testnet USDC for Ethereum Sepolia, Avalanche Fuji, and more',
      url: 'https://faucet.circle.com',
      recommended: true,
    },
    {
      name: 'Ethereum Sepolia',
      description: 'Get testnet ETH for gas fees on Ethereum Sepolia',
      url: 'https://sepoliafaucet.com',
    },
    {
      name: 'Avalanche Fuji',
      description: 'Get testnet AVAX for gas fees on Avalanche Fuji',
      url: 'https://core.app/tools/testnet-faucet',
    },
    {
      name: 'Arbitrum Sepolia',
      description: 'Get testnet ETH for gas fees on Arbitrum Sepolia',
      url: 'https://arbitrum.faucet.dev',
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
              <Droplet className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                Testnet Resources
              </span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get Started with Testnet Tokens
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              You'll need testnet USDC and gas tokens to try out the bridge. 
              Use these faucets to get free testnet tokens.
            </p>
          </div>

          {/* Faucet Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faucets.map((faucet, index) => (
              <a
                key={index}
                href={faucet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 transition-colors group"
              >
                {faucet.recommended && (
                  <div className="inline-block px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full mb-3">
                    Recommended
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {faucet.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {faucet.description}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors ml-4 flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              💡 Quick Tip
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Start with the Circle Testnet Faucet to get USDC on multiple chains. 
              Then use the network-specific faucets to get gas tokens (ETH, AVAX, etc.) 
              needed to pay for transactions on each chain.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

