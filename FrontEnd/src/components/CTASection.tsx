"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TransitionLink } from "@/components/TransitionLink"

gsap.registerPlugin(ScrollTrigger)

export function CTASection() {
  const container = useRef(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      })

      tl.fromTo(".cta-title", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
        .fromTo(
          ".cta-subtitle",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6",
        )
        .fromTo(
          ".cta-button",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" },
          "-=0.4",
        )
    },
    { scope: container },
  )

  return (
    <section ref={container} className="py-32 px-4 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="cta-title text-4xl md:text-6xl font-bold text-white mb-6">Have a project in mind?</h2>
        <p className="cta-subtitle text-xl md:text-2xl text-neutral-300 mb-12">
          Let’s embed Medi-Link’s API into your system and simplify healthcare workflows..
        </p>
        <motion.div className="cta-button">
          <TransitionLink
            href="/contact"
            className="inline-flex items-center gap-3 bg-white text-black font-semibold py-4 px-8 rounded-full text-lg transition-transform duration-300 hover:scale-105"
          >
            Let's Talk
          </TransitionLink>
        </motion.div>
      </div>
    </section>
  )
}
