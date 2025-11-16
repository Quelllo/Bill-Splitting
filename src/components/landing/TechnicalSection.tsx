import { Code2, Github, BookOpen, Rocket } from 'lucide-react'

export default function TechnicalSection() {
  const techStack = [
    { name: 'React 18', description: 'Modern UI framework' },
    { name: 'Next.js 14', description: 'App router & SSR' },
    { name: 'TypeScript', description: 'Type safety' },
    { name: 'Wagmi v2', description: 'Wallet connections' },
    { name: 'Viem', description: 'Ethereum interactions' },
    { name: 'Circle CCTP', description: 'Cross-chain protocol' },
    { name: 'Arc Network', description: 'Chain abstraction' },
    { name: 'Tailwind CSS', description: 'Styling' },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4 border border-white/20">
              <Code2 className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-gray-200">
                For Judges & Developers
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Technical Overview
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Built as a hackathon project to showcase the power of Circle's Bridge Kit 
              and Arc Network's chain abstraction capabilities.
            </p>
          </div>

          {/* Architecture */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Rocket className="w-6 h-6 text-primary-400" />
              Architecture
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              This application demonstrates a production-ready approach to cross-chain USDC 
              transfers using modern Web3 technologies. The frontend is built with React and 
              Next.js for optimal performance and SEO, while Wagmi and Viem provide type-safe 
              Ethereum interactions.
            </p>
            <div className="bg-black/30 rounded-xl p-6 border border-white/10 mb-6">
              <h4 className="font-mono text-sm text-gray-400 mb-3">Key Components:</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-primary-400">→</span>
                  <span>
                    <strong className="text-white">Frontend:</strong> Next.js App Router with 
                    server and client components for optimal rendering
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400">→</span>
                  <span>
                    <strong className="text-white">Web3 Stack:</strong> Wagmi v2 + Viem for 
                    wallet connections and blockchain interactions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400">→</span>
                  <span>
                    <strong className="text-white">Bridge Logic:</strong> Direct integration 
                    with Circle's CCTP smart contracts (TokenMessenger, MessageTransmitter)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400">→</span>
                  <span>
                    <strong className="text-white">Storage:</strong> Browser localStorage for 
                    transfer history (no backend required)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400">→</span>
                  <span>
                    <strong className="text-white">Arc Integration:</strong> Configured for 
                    Arc testnet with USDC-as-gas support
                  </span>
                </li>
              </ul>
            </div>

            {/* Tech Stack Grid */}
            <h4 className="font-semibold text-white mb-4">Tech Stack</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {techStack.map((tech, index) => (
                <div 
                  key={index}
                  className="bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="font-semibold text-white text-sm">{tech.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{tech.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Implemented */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              Features Implemented
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div>
                  <div className="text-white font-medium">Multi-chain wallet connection</div>
                  <div className="text-sm text-gray-400">RainbowKit integration with 5+ testnets</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div>
                  <div className="text-white font-medium">Real-time USDC balance tracking</div>
                  <div className="text-sm text-gray-400">Parallel fetching across all chains</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div>
                  <div className="text-white font-medium">CCTP bridge integration</div>
                  <div className="text-sm text-gray-400">Burn-and-mint with Circle contracts</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div>
                  <div className="text-white font-medium">Transfer history</div>
                  <div className="text-sm text-gray-400">localStorage persistence</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div>
                  <div className="text-white font-medium">Status tracking</div>
                  <div className="text-sm text-gray-400">Visual state machine with progress</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div>
                  <div className="text-white font-medium">Responsive design</div>
                  <div className="text-sm text-gray-400">Mobile, tablet, desktop support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="https://github.com/yourusername/usdc-bridge-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Github className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold mb-1">View Source Code</div>
                <div className="text-sm text-gray-400">
                  Full implementation on GitHub
                </div>
              </div>
            </a>

            <a
              href="https://docs.arc.network"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold mb-1">Arc Documentation</div>
                <div className="text-sm text-gray-400">
                  Learn more about Arc Network
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

