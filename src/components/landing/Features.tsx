import { Shield, Zap, Globe, Lock } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: 'Circle Bridge Kit',
      description: 'Built on Circle\'s Cross-Chain Transfer Protocol (CCTP), ensuring native USDC transfers without wrapped tokens or liquidity pools.',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: Globe,
      title: 'Arc Network',
      description: 'Leverage Arc\'s chain abstraction to interact with multiple blockchains seamlessly, without manually switching networks.',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Transfers typically complete in under a minute. No more waiting hours for cross-chain bridges to process.',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      icon: Lock,
      title: 'Secure & Audited',
      description: 'Circle\'s CCTP is battle-tested and audited. Your funds are secured by industry-leading smart contracts.',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Bridge?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Combining the best of Circle's infrastructure and Arc's chain abstraction 
              for an unparalleled cross-chain experience
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className={`w-14 h-14 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

