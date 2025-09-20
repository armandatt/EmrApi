"use client"

import { useEffect, useRef } from "react"
import { Brain, Cloud, Shield, Zap } from "lucide-react"

const features = [
  {
    name: "AI-Powered Content Detection",
    description:
      "Leverage advanced machine learning algorithms to identify AI-generated content, ensuring authenticity in documents and communications.",
    icon: Brain,
    color: "from-blue-500 to-cyan-400",
  },
  {
    name: "Robust Verification Architecture",
    description:
      "Built on scalable, resilient cloud-native infrastructure to provide reliable and seamless verification services anytime, anywhere.",
    icon: Cloud,
    color: "from-purple-500 to-indigo-400",
  },
  {
    name: "Enterprise-Grade Security",
    description:
      "Implement state-of-the-art security protocols designed to safeguard sensitive data and protect your organization's integrity.",
    icon: Shield,
    color: "from-green-500 to-emerald-400",
  },
  {
    name: "High-Performance Analysis",
    description:
      "Optimized for rapid and accurate verification, SecureSight delivers trusted results with unmatched speed and efficiency.",
    icon: Zap,
    color: "from-amber-500 to-yellow-400",
  },
]

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement
            element.style.opacity = "1"
            element.style.transform = "translateX(0)"
          }
        })
      },
      { threshold: 0.2 },
    )

    const cards = sectionRef.current?.querySelectorAll(".feature-card")
    cards?.forEach((card) => observer.observe(card))

    return () => {
      cards?.forEach((card) => observer.unobserve(card))
    }
  }, [])

  return (
    <section ref={sectionRef} className="container space-y-16 py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl text-white">Cutting-Edge Solutions</h2>
        <p className="mt-4 text-gray-400 sm:text-lg">
          Discover how SecureSight empowers institutions with advanced AI tools to ensure authenticity, trust, and
          security in a digital world.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {features.map((feature, index) => (
          <div
            key={feature.name}
            className="feature-card group relative overflow-hidden rounded-xl border border-gray-800/50 bg-[#0f1119]/90 backdrop-blur-sm p-8 transition-all duration-1000 ease-out hover:border-gray-700/50 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-2"
            style={{
              opacity: 0,
              transform: index % 2 === 0 ? "translateX(-100px)" : "translateX(100px)",
              transitionDelay: `${index * 300}ms`,
            }}
          >
            {/* Animated gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>

            {/* Animated border glow */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"></div>

            <div className="flex items-center gap-4 mb-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} p-2 shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
              >
                <feature.icon className="h-6 w-6 text-white animate-pulse-slow" />
              </div>
              <h3 className="font-bold text-xl text-white group-hover:text-blue-400 transition-colors duration-300">
                {feature.name}
              </h3>
            </div>
            <p className="mt-2 text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
              {feature.description}
            </p>

            {/* Animated corner accent */}
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tl-3xl"></div>

            {/* Floating particles effect */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping"></div>
            <div className="absolute bottom-8 left-6 w-1 h-1 bg-purple-400/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
          </div>
        ))}
      </div>
    </section>
  )
}







