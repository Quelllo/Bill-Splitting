import { Flame, FileCheck, Coins, CheckCircle } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: Flame,
      number: '01',
      title: 'Burn on Source Chain',
      description: 'Your USDC is burned on the source chain using Circle\'s TokenMessenger contract. This removes it from circulation on that network.',
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: FileCheck,
      number: '02',
      title: 'Circle Attestation',
      description: 'Circle\'s attestation service cryptographically signs proof that your USDC was burned. This typically takes 10-15 minutes on testnet.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Coins,
      number: '03',
      title: 'Mint on Destination',
      description: 'Using Circle\'s attestation, native USDC is minted on your destination chain. It\'s the same USDC—not wrapped or bridged tokens.',
      color: 'from-green-500 to-emerald-500',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Circle's Cross-Chain Transfer Protocol (CCTP) uses a simple burn-and-mint 
              process to move native USDC between blockchains.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-8 mb-12">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                {/* Connector Line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute left-16 top-full w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600" />
                )}
                
                <div className="flex flex-col lg:flex-row items-start gap-6">
                  {/* Icon & Number */}
                  <div className="flex-shrink-0">
                    <div className={`relative w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-10 h-10 text-white" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Key Benefits */}
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-primary-200 dark:border-primary-800">
            <div className="flex items-start gap-4 mb-4">
              <CheckCircle className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                  Why This Matters
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Unlike traditional bridges that use wrapped tokens or liquidity pools, 
                  CCTP ensures you always receive <strong>native, official USDC</strong> on 
                  the destination chain. This means better security, no slippage, and 
                  seamless integration with any protocol that accepts USDC.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-primary-200 dark:border-primary-700">
              <p className="text-sm text-primary-800 dark:text-primary-300">
                <strong>Built on Circle's infrastructure:</strong> This app uses Circle's 
                official smart contracts and attestation service. All security is handled 
                by Circle—one of the most trusted names in stablecoins.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
