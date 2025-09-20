import {Header} from "../components/Header"
import Hero from "../components/SSBlocks/Hero"
import Features from "../components/SSBlocks/Features"
import CTA from "../components/SSBlocks/CTA"
import {Footer} from "../components/Footer"


export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#080a12] via-[#0a0c15] to-[#0f1119]">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/8 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/8 blur-[100px]" />
        <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <Header />
        <Hero />
        <Features />
        <CTA />
        <Footer />
      </div>
    </div>
  )
}


