"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
// import { ArrowRight } from "lucide-react"
// import { TransitionLink } from "@/components/TransitionLink"

gsap.registerPlugin(ScrollTrigger)

const blogPosts = [
  {
    title: "The Future of Digital Healthcare",
    description: "Exploring how technology is reshaping patient care, hospital systems, and healthcare delivery worldwide.",
    slug: "future-digital-healthcare",
  },
  {
    title: "Optimizing Patient Records with Medi-Link",
    description: "A deep dive into how Medi-Link ensures secure, centralized, and efficient medical data management.",
    slug: "optimizing-patient-records",
  },
  {
    title: "AI in Healthcare: Opportunities & Challenges",
    description: "Understanding the role of artificial intelligence in diagnosis, treatment, and personalized patient care.",
    slug: "ai-in-healthcare",
  },
]

export function BlogSection() {
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

      tl.fromTo(".blog-title", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }).fromTo(
        ".blog-card",
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, duration: 0.8, ease: "power3.out" },
        "-=0.5",
      )
    },
    { scope: container },
  )

  return (
    <section ref={container} className="py-32 px-4 bg-[#0a0a0a]" id="blog">
      <div className="max-w-7xl mx-auto">
        <h2 className="blog-title text-4xl md:text-6xl font-bold text-white text-center mb-16">Insights from Medi-Link</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <motion.div
              key={post.slug}
              className="blog-card bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 hover:border-neutral-700 transition-all duration-300"
              whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">{post.title}</h3>
              <p className="text-neutral-400 mb-6 leading-relaxed">{post.description}</p>
              {/* <TransitionLink
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all duration-300"
              >
                Read More <ArrowRight size={16} />
              </TransitionLink> */}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
