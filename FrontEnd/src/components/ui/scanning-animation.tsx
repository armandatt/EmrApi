'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ScanningAnimationProps {
  isScanning: boolean
  progress: number
}

export function ScanningAnimation({ isScanning, progress }: ScanningAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  
  const steps = [
    { text: "Cloning repository...", icon: "📥" },
    { text: "Analyzing code structure...", icon: "🔍" },
    { text: "Comparing with databases...", icon: "🗄️" },
    { text: "Processing README content...", icon: "📄" },
    { text: "Calculating similarity scores...", icon: "🧮" },
    { text: "Generating AI insights...", icon: "🤖" },
    { text: "Finalizing report...", icon: "✨" }
  ]

  useEffect(() => {
    if (isScanning) {
      const stepIndex = Math.floor((progress / 100) * steps.length)
      setCurrentStep(Math.min(stepIndex, steps.length - 1))
    }
  }, [progress, isScanning])

  if (!isScanning) return null

  return (
    <div className="mt-6 space-y-4">
      <div className="relative overflow-hidden rounded-lg bg-[#1e293b] border border-gray-700 p-6">
        {/* Scanning beam effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-2xl"
              >
                {steps[currentStep]?.icon}
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {steps[currentStep]?.text}
                </h3>
                <p className="text-sm text-gray-400">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-400">{progress}%</div>
              <div className="text-xs text-gray-400">Complete</div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
