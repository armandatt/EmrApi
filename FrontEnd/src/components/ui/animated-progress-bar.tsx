'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface AnimatedProgressBarProps {
  value: number
  label: string
  className?: string
}

export function AnimatedProgressBar({ value, label, className = '' }: AnimatedProgressBarProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value)
    }, 300)
    return () => clearTimeout(timer)
  }, [value])

  const getColor = (score: number) => {
    if (score <= 30) return '#10b981' // green-500
    if (score <= 70) return '#f59e0b' // amber-500
    return '#ef4444' // red-500
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-white">{label}</h4>
        <div className="text-lg font-bold" style={{ color: getColor(animatedValue) }}>
          {Math.round(animatedValue)}%
        </div>
      </div>
      
      <div className="relative">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full transition-all duration-2000 ease-out"
            style={{ 
              backgroundColor: getColor(animatedValue),
              width: `${animatedValue}%`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${animatedValue}%` }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  )
}

