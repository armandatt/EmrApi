"use client"

import { useEffect, useRef } from "react"
import { Brain, Cloud, Shield, Zap } from "lucide-react"

const features = [
  {
    name: "AI-Powered Content Detection",
    description:
      "Leverage advanced machine learning algorithms to identify AI-generated content, ensuring authenticity in documents and communications.",
    icon: Brain,
  },
  {
    name: "Robust Verification Architecture",
    description:
      "Built on scalable, resilient cloud-native infrastructure to provide reliable and seamless verification services anytime, anywhere.",
    icon: Cloud,
  },
  {
    name: "Enterprise-Grade Security",
    description:
      "Implement state-of-the-art security protocols designed to safeguard sensitive data and protect your organization's integrity.",
    icon: Shield,
  },
  {
    name: "High-Performance Analysis",
    description:
      "Optimized for rapid and accurate verification, SecureSight delivers trusted results with unmatched speed and efficiency.",
    icon: Zap,
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
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Cutting-Edge Solutions</h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Discover how SecureSight empowers institutions with advanced AI tools to ensure authenticity, trust, and
          security in a digital world.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {features.map((feature, index) => (
          <div
            key={feature.name}
            className="feature-card relative overflow-hidden rounded-lg border bg-background p-8 transition-all duration-700 ease-out hover:shadow-lg hover:-translate-y-1"
            style={{
              opacity: 0,
              transform: index % 2 === 0 ? "translateX(-100px)" : "translateX(100px)",
              transitionDelay: `${index * 150}ms`,
            }}
          >
            <div className="flex items-center gap-4">
              <feature.icon className="h-8 w-8 transition-transform duration-300 hover:scale-110" />
              <h3 className="font-bold">{feature.name}</h3>
            </div>
            <p className="mt-2 text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

