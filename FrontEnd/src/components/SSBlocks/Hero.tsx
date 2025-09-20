"use client"

import { Button } from "../ui/button"
import { ArrowRight, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"
import TypewriterText from "./TypewriterText"

export default function Hero() {
  const navigate = useNavigate()

  async function redirectToDashboard() {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/sign-in")
      return
    }else if (token && token !== "null") {
      navigate("/dashboard")
      return
    }
  }

  function redirectToSolutions() {
    navigate("/solutions")
  }

  return (
    <section className="container flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
      <div className="flex items-center justify-center mb-6">
        <Shield className="h-16 w-16 text-primary" />
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight min-h-[1.2em]">
          <TypewriterText
            text="Verify Smarter with SecureSight"
            typingSpeed={80}
            deletingSpeed={50}
            pauseDuration={4000}
            waitDuration={1000}
            className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-transparent"
          />
        </h1>
        <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          SecureSight provides advanced verification tools to detect plagiarism, identify phishing attempts, verify
          documents, and detect AI-generated content with industry-leading accuracy.
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={redirectToSolutions} size="lg">
          Explore Solutions
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button onClick={redirectToDashboard} variant="outline" size="lg">
          Go to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}
