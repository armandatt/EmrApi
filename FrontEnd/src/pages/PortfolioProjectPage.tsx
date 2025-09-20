"use client"

import { Suspense, useRef } from "react"
import { useParams } from "react-router-dom"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { CyberscapeScene } from "../Project/CyberscapeScene"
import { EtherealScene } from "../Project/EtherealScene"
import { QuantumScene } from "../Project/QuantumScene"

gsap.registerPlugin(ScrollTrigger)

const projectData = {
  "project-cyberscape": {
    title: "Project Cyberscape",
    description:
      "An immersive journey into a procedurally generated digital world. Experience a reality constructed from pure data, where light and geometry intertwine.",
    image: "/futuristic-digital-cyberscape.jpg",
    scene: "cyberscape",
    features: [
      {
        title: "Procedural Generation",
        description: "A dynamic, ever-changing digital landscape generated in real-time using custom GLSL shaders.",
      },
      {
        title: "Interactive Glitch Effects",
        description: "Mouse movements trigger visual distortions, simulating a fluctuating data stream.",
      },
      {
        title: "Optimized Performance",
        description: "High-performance rendering achieved by offloading complex calculations to the GPU.",
      },
    ],
  },
  "ethereal-threads": {
    title: "Ethereal Threads",
    description:
      "An interactive artwork that weaves light, color, and motion into a mesmerizing digital tapestry. Guide the flow and watch as new patterns emerge.",
    image: "/ethereal-threads-abstract-art.jpg",
    scene: "ethereal",
    features: [
      {
        title: "Fluid Dynamics",
        description: "A real-time simulation of flowing, smoke-like threads using multi-layered noise algorithms.",
      },
      {
        title: "Generative Color",
        description:
          "Colors are blended and shifted procedurally, creating an endless palette of unique visual compositions.",
      },
      {
        title: "Interactive Flow",
        description:
          "Influence the direction and intensity of the threads with your cursor, becoming part of the artwork.",
      },
    ],
  },
  "quantum-leap": {
    title: "Quantum Leap",
    description:
      "An interactive simulation of a quantum field. Disturb the fabric of spacetime with your cursor and witness the chaotic beauty of particle physics.",
    image: "/quantum-leap-space-time.jpg",
    scene: "quantum",
    features: [
      {
        title: "Particle Physics",
        description:
          "A GPU-accelerated particle system simulating quantum foam, with millions of points rendered in real-time.",
      },
      {
        title: "Interactive Field",
        description:
          "Your cursor acts as a gravitational force, warping the particle field and creating dynamic visual effects.",
      },
      {
        title: "Endless Possibilities",
        description:
          "The simulation is non-deterministic, ensuring that every interaction creates a unique and unrepeatable pattern.",
      },
    ],
  },
}

export default function PortfolioProjectPage() {
  const { slug } = useParams()
  const containerRef = useRef(null)

  const project = projectData[slug as keyof typeof projectData] || projectData["quantum-leap"]

  useGSAP(
    () => {
      const features = gsap.utils.toArray(".feature-card")

      gsap.fromTo(
        ".project-header",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.5,
        },
      )

      gsap.fromTo(
        features,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 80%",
          },
        },
      )
    },
    { scope: containerRef },
  )

  const renderScene = () => {
    switch (project.scene) {
      case "cyberscape":
        return <CyberscapeScene />
      case "ethereal":
        return <EtherealScene />
      case "quantum":
        return <QuantumScene />
      default:
        return <QuantumScene />
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen">
      <div className="relative h-screen">
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>{renderScene()}</Suspense>
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="project-header text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{project.title}</h1>
            <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">{project.description}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button className="bg-white text-black font-semibold hover:bg-neutral-200">Visit Live Site</Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black bg-transparent"
              >
                View Case Study
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {project.features.map((feature, index) => (
              <Card
                key={feature.title}
                className="feature-card bg-neutral-900/50 backdrop-blur-sm border-neutral-800 p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-neutral-300 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
