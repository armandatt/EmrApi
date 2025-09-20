import type React from "react"
import { useRef, createContext, useContext } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

interface TransitionContextType {
  playTransition: (href: string) => void
}

const TransitionContext = createContext<TransitionContextType | null>(null)

export const useTransition = () => {
  const context = useContext(TransitionContext)
  if (!context) {
    throw new Error("useTransition must be used within TransitionProvider")
  }
  return context
}

interface TransitionProviderProps {
  children: React.ReactNode
}

export function TransitionProvider({ children }: TransitionProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const playTransition = (href: string) => {
    const currentPath = window.location.pathname
    const targetPath = href.split("#")[0]

    if (href === currentPath || (targetPath === currentPath && href.includes("#"))) {
      return
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        window.location.href = href
      },
    })
    timeline.to(containerRef.current, {
      opacity: 0,    
      y: -20,
      duration: 0.4,
      ease: "power3.in",
    })
  }

  useGSAP(
    () => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          onComplete: () => {
            const hash = window.location.hash
            if (hash) {
              const targetElement = document.querySelector(hash)
              if (targetElement) {
                gsap.to(window, {
                  duration: 1,
                  scrollTo: { y: targetElement, autoKill: false },
                  ease: "power2.inOut",
                  delay: 0.1,
                })
              }
            } else {
              window.scrollTo(0, 0)
            }
          },
        },
      )
    },
    { dependencies: [] },
  )

  return (
    <TransitionContext.Provider value={{ playTransition }}>
      <div ref={containerRef}>{children}</div>
    </TransitionContext.Provider>
  )
}