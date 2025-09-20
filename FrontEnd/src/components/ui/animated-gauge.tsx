'use client'

import { useEffect, useState } from 'react'

interface AnimatedGaugeProps {
  value: number
  size?: number
  strokeWidth?: number
}

export function AnimatedGauge({ value, size = 200, strokeWidth = 8 }: AnimatedGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  
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
    if (score <= 30) return '#10b981' // green
    if (score <= 70) return '#f59e0b' // yellow
    return '#ef4444' // red
  }

  const getRiskLevel = (score: number) => {
    if (score <= 30) return 'Low Risk'
    if (score <= 70) return 'Medium Risk'
    return 'High Risk'
  }

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
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
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(animatedValue)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset + circumference * 0.25}
          strokeLinecap="round"
          className="transition-all duration-2000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${getColor(animatedValue)}40)`
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-3xl font-bold text-white mb-1">
          {Math.round(animatedValue)}%
        </div>
        <div className={`text-sm font-medium ${
          animatedValue <= 30 ? 'text-green-400' : 
          animatedValue <= 70 ? 'text-yellow-400' : 'text-red-400'
        }`}>
          {getRiskLevel(animatedValue)}
        </div>
      </div>
    </div>
  )
}

