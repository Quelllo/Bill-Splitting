import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import Features from '@/components/landing/Features'
import TestnetGuide from '@/components/landing/TestnetGuide'

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <HowItWorks />
      <Features />
      <TestnetGuide />
    </div>
  )
}

