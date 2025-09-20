import { Hero } from "../components/Hero"
import { Portfolio } from "../components/Portfolio"
import { BlogSection } from "../components/BlogSection"
import { CTASection } from "../components/CTASection"
import { Header } from "../components/Header"
import { Footer } from "@/components/Footer"

export default function HomePage() {
  return (
    <>
    <Header />
      <Hero />
      <Portfolio />
      <BlogSection />
      <CTASection />
      <Footer />
    </>
  )
}
