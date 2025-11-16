import { Wallet, RefreshCw, CheckCircle } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: Wallet,
      title: 'Connect Your Wallet',
      description: 'Connect your Web3 wallet to get started. We support MetaMask, WalletConnect, and more.',
    },
    {
      icon: RefreshCw,
      title: 'Select Chains & Amount',
      description: 'Choose your source and destination chains, then enter the amount of USDC you want to transfer.',
    },
    {
      icon: CheckCircle,
      title: 'Confirm & Bridge',
      description: 'Review the details and confirm. Your USDC will arrive on the destination chain in minutes.',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Three simple steps to move your USDC across chains
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gray-200 dark:bg-gray-700" />
                )}
                
                <div className="relative bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-4 mt-2">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

