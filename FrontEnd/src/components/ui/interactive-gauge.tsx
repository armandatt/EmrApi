'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface InteractiveGaugeProps {
  value: number
  size?: number
  strokeWidth?: number
  showPulse?: boolean
}

export function InteractiveGauge({ value, size = 200, strokeWidth = 8, showPulse = true }: InteractiveGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value)
    }, 500)
    return () => clearTimeout(timer)
  }, [value])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference

  const getColor = (score: number) => {
    if (score <= 30) return '#10b981' // green-500
    if (score <= 70) return '#f59e0b' // amber-500
    return '#ef4444' // red-500
  }

  // const getRiskLevel = (score: number) => {
  //   if (score <= 30) return 'Low'
  //   if (score <= 70) return 'Medium'
  //   return 'High'
  // }

  return (
    <div 
      className="relative flex items-center justify-center cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pulse effect */}
      {showPulse && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${getColor(animatedValue)}15 0%, transparent 70%)`
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      <motion.svg
        width={size}
        height={size}
        className="transform -rotate-90"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#374151"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(animatedValue)}
          strokeWidth={isHovered ? strokeWidth + 1 : strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset + circumference * 0.25}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference + circumference * 0.25 }}
          animate={{ strokeDashoffset: strokeDashoffset + circumference * 0.25 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </motion.svg>
      
      {/* Center content */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-4xl font-bold text-white mb-1">
          {Math.round(animatedValue)}%
        </div>
        <div className="text-sm text-gray-400">
          Based on code similarity detection
        </div>
      </motion.div>
    </div>
  )
}
