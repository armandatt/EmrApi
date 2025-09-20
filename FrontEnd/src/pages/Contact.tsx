"use client"

import { Suspense, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Card } from "../components/ui/card"
import { GlowScene } from "../components/GlowScene"

gsap.registerPlugin(ScrollTrigger)

export default function ContactPage() {
  const containerRef = useRef(null)

  useGSAP(
    () => {
      const formElements = gsap.utils.toArray(".form-element")
      const infoCards = gsap.utils.toArray(".info-card")

      gsap.fromTo(
        ".contact-title",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
        },
      )

      gsap.fromTo(
        formElements,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.8,
        },
      )

      gsap.fromTo(
        infoCards,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          delay: 1,
        },
      )
    },
    { scope: containerRef },
  )

  return (
    <div ref={containerRef} className="min-h-screen relative">
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Suspense fallback={null}>
            <GlowScene />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="contact-title text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Let's Create Something Amazing
              </h1>
              <p className="contact-title text-xl text-gray-300 max-w-2xl mx-auto">
                Ready to bring your vision to life? Get in touch and let's discuss your next project.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="form-element p-8 bg-black/50 backdrop-blur-sm border-neutral-800">
                <h2 className="text-2xl font-bold mb-6 text-white">Send a Message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Your Name"
                      className="form-element bg-neutral-900/50 border-neutral-700 text-white"
                    />
                    <Input
                      placeholder="Your Email"
                      type="email"
                      className="form-element bg-neutral-900/50 border-neutral-700 text-white"
                    />
                  </div>
                  <Input
                    placeholder="Subject"
                    className="form-element bg-neutral-900/50 border-neutral-700 text-white"
                  />
                  <Textarea
                    placeholder="Your Message"
                    rows={6}
                    className="form-element bg-neutral-900/50 border-neutral-700 text-white"
                  />
                  <Button className="form-element w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Send Message
                  </Button>
                </form>
              </Card>

              <div className="space-y-8">
                <Card className="info-card p-6 bg-black/50 backdrop-blur-sm border-neutral-800">
                  <h3 className="text-xl font-semibold mb-4 text-white">Get in Touch</h3>
                  <div className="space-y-4 text-gray-300">
                    <p>📧 hello@creativestudio.com</p>
                    <p>📱 +1 (555) 123-4567</p>
                    <p>📍 San Francisco, CA</p>
                  </div>
                </Card>

                <Card className="info-card p-6 bg-black/50 backdrop-blur-sm border-neutral-800">
                  <h3 className="text-xl font-semibold mb-4 text-white">Office Hours</h3>
                  <div className="space-y-2 text-gray-300">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
