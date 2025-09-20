"use client"

import { Suspense, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { motion } from "framer-motion"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { TorusScene } from "./TorusScene"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
// import { Footer } from "./Footer"

export function Hero() {
  const container = useRef(null)

  useGSAP(
    () => {
      const tl = gsap.timeline()
      tl.fromTo(
        ".hero-title span",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: "power3.out" },
      )
        .fromTo(
          ".hero-subtitle",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6",
        )
        .fromTo(
          ".hero-button",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" },
          "-=0.5",
        )
    },
    { scope: container },
  )

  const titleLines = [
    "Simplifying Healthcare,",
    "Empowering Doctors"
  ]

  const splitTitle = titleLines.map((line, i) => (
    <div key={i} className="block whitespace-nowrap">
      {line.split(" ").map((word, j) => (
        <span key={j} className="inline-block overflow-visible align-baseline">
          <span className="inline-block">{word}&nbsp;</span>
        </span>
      ))}
    </div>
  ))

  // const scrollToPortfolio = () => {
  //   const portfolioSection = document.getElementById("portfolio")
  //   if (portfolioSection) {
  //     portfolioSection.scrollIntoView({ behavior: "smooth" })
  //   }
  // }
  
  const navigate = useNavigate();

  const isAuthenticated =
    !!localStorage.getItem("token") && localStorage.getItem("token") !== "null";

  const RedirectToDashBoard = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <div ref={container} className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="w-[500px] h-[500px] lg:w-[650px] lg:h-[650px]">
          <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
            <Suspense fallback={null}>
              <TorusScene />
            </Suspense>
          </Canvas>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="hero-title font-bold text-5xl md:text-7xl lg:text-8xl mb-10 relative z-20 leading-normal tracking-tight max-w-5xl mx-auto pb-2">
          {splitTitle}
        </h1>
        <motion.p
          className="hero-subtitle text-lg md:text-xl lg:text-2xl max-w-3xl mb-14 text-neutral-300 leading-relaxed mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          Medi-Link helps doctors manage patient records, generate AI-powered medical codes (ICD-11 & Namaste), and streamline hospital workflows.
        </motion.p>
        <motion.button
          onClick={RedirectToDashBoard}
          className="hero-button flex items-center gap-3 bg-white text-black font-semibold py-3 px-6 rounded-full transition-transform duration-300 text-base md:text-lg"
          whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 300 } }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started with Medi-Link <ArrowRight size={22} />
        </motion.button>
      </div>
      {/* <Footer></Footer> */}
    </div>
  )
}
