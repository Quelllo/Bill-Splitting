import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6">
            <Zap className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              Powered by Circle Bridge Kit & Arc Network
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Cross-Chain USDC
            <span className="block text-primary-600 dark:text-primary-400 mt-2">
              Made Simple
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Move your USDC seamlessly across multiple blockchains with Circle's Cross-Chain Transfer Protocol 
            and Arc's chain abstraction layer. Fast, secure, and user-friendly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/app"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg group"
            >
              Launch App
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#how-it-works"
              className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-primary-600 dark:hover:border-primary-400 transition-colors font-semibold text-lg"
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">10+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Supported Chains</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">&lt;1min</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Transfer Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">$0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Bridge Fees</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

