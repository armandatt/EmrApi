"use client"

import type React from "react"
import { useTransition } from "./TransitionProvider"

interface TransitionLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function TransitionLink({ href, children, className }: TransitionLinkProps) {
  const { playTransition } = useTransition()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    playTransition(href)
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
