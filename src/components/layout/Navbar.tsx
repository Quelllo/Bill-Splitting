'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Waves } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const isAppPage = pathname === '/app'

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Waves className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              USDC Bridge
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Home
            </Link>
            {!isAppPage && (
              <Link 
                href="/app" 
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Launch App
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
