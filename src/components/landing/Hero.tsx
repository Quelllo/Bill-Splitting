import Link from 'next/link'
import { ArrowRight, Zap, Shield } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200 dark:bg-primary-900 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-primary-200 dark:border-primary-700 rounded-full mb-6 shadow-sm">
            <Shield className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Built with Circle Bridge Kit & Arc Network
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Move USDC across chains
            <span className="block bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400 bg-clip-text text-transparent mt-2">
              in one clean flow
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            A seamless cross-chain bridge powered by Circle's official CCTP protocol 
            and Arc's chain abstraction. No wrapped tokens, no liquidity pools—just 
            native USDC everywhere.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/app"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 group"
            >
              <Zap className="w-5 h-5 mr-2" />
              Open App
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#how-it-works"
              className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 rounded-xl hover:border-primary-600 dark:hover:border-primary-400 transition-colors font-semibold text-lg"
            >
              Learn How It Works
            </a>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                5+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Supported Testnets
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                ~15min
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Average Transfer Time
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                $0
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Bridge Protocol Fees
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
