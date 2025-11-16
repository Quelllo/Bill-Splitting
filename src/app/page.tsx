import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import Features from '@/components/landing/Features'
import TestnetGuide from '@/components/landing/TestnetGuide'
import TechnicalSection from '@/components/landing/TechnicalSection'

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <HowItWorks />
      <Features />
      <TestnetGuide />
      <TechnicalSection />
    </div>
  )
}

