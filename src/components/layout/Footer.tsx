import { Github, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
              USDC Bridge
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Cross-chain USDC transfers powered by Circle's Bridge Kit and Arc Network.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://docs.arc.network" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Arc Documentation
                </a>
              </li>
              <li>
                <a 
                  href="https://developers.circle.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Circle Developers
                </a>
              </li>
              <li>
                <a 
                  href="https://faucet.circle.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Testnet Faucet
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
              Connect
            </h4>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} USDC Bridge Demo. Built for hackathon purposes.</p>
        </div>
      </div>
    </footer>
  )
}

