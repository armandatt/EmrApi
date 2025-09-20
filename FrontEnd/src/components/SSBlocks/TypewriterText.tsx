"use client"

import { useState, useEffect, useCallback } from "react"

type AnimationState = "typing" | "pausing" | "deleting" | "waiting"

interface TypewriterTextProps {
  text: string
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  waitDuration?: number
  className?: string
}

export default function TypewriterText({
  text,
  typingSpeed = 80,
  deletingSpeed = 50,
  pauseDuration = 4000,
  waitDuration = 1000,
  className = "",
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [animationState, setAnimationState] = useState<AnimationState>("typing")
  const [showCursor, setShowCursor] = useState(true)

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  // Animation state machine
  const runAnimation = useCallback(() => {
    switch (animationState) {
      case "typing":
        if (displayText.length < text.length) {
          setDisplayText(text.substring(0, displayText.length + 1))
        } else {
          setAnimationState("pausing")
        }
        break

      case "pausing":
        // Do nothing, just wait for the timeout
        break

      case "deleting":
        if (displayText.length > 0) {
          setDisplayText(displayText.substring(0, displayText.length - 1))
        } else {
          setAnimationState("waiting")
        }
        break

      case "waiting":
        // Do nothing, just wait for the timeout
        break
    }
  }, [animationState, displayText, text])

  // Main animation loop
  useEffect(() => {
    let timeout: NodeJS.Timeout

    // Handle different states
    if (animationState === "typing") {
      timeout = setTimeout(runAnimation, typingSpeed)
    } else if (animationState === "pausing") {
      timeout = setTimeout(() => setAnimationState("deleting"), pauseDuration)
    } else if (animationState === "deleting") {
      timeout = setTimeout(runAnimation, deletingSpeed)
    } else if (animationState === "waiting") {
      timeout = setTimeout(() => setAnimationState("typing"), waitDuration)
    }

    return () => clearTimeout(timeout)
  }, [animationState, displayText, runAnimation, typingSpeed, deletingSpeed, pauseDuration, waitDuration])

  return (
    <span className={className}>
      {displayText}
      <span className={`${showCursor ? "opacity-100" : "opacity-0"} text-primary`}>|</span>
    </span>
  )
}



