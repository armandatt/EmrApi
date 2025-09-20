'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { GitFork, MessageSquare, Shuffle, Eye } from 'lucide-react'

interface FloatingStatsProps {
  stats: {
    isFork: boolean
    hasHumanComments: boolean
    hasRandomVariableNames: boolean
    hasHighStructuralMatch: boolean
    stars?: number
    contributors?: number
    lastUpdated?: string
  }
}

export function FloatingStats({ stats }: FloatingStatsProps) {
  const statItems = [
    {
      icon: GitFork,
      label: 'Fork Status',
      value: stats.isFork ? 'Is Fork' : 'Original',
      color: stats.isFork ? 'destructive' : 'secondary',
      bgColor: stats.isFork ? 'from-red-500/10 to-red-600/10 border-red-500/20' : 'from-green-500/10 to-green-600/10 border-green-500/20'
    },
    {
      icon: MessageSquare,
      label: 'Comments',
      value: stats.hasHumanComments ? 'Human-like' : 'Generated',
      color: stats.hasHumanComments ? 'secondary' : 'destructive',
      bgColor: stats.hasHumanComments ? 'from-green-500/10 to-green-600/10 border-green-500/20' : 'from-red-500/10 to-red-600/10 border-red-500/20'
    },
    {
      icon: Shuffle,
      label: 'Variables',
      value: stats.hasRandomVariableNames ? 'Randomized' : 'Meaningful',
      color: stats.hasRandomVariableNames ? 'destructive' : 'secondary',
      bgColor: stats.hasRandomVariableNames ? 'from-red-500/10 to-red-600/10 border-red-500/20' : 'from-purple-500/10 to-purple-600/10 border-purple-500/20'
    },
    {
      icon: Eye,
      label: 'Structure',
      value: stats.hasHighStructuralMatch ? 'High Match' : 'Unique',
      color: stats.hasHighStructuralMatch ? 'destructive' : 'secondary',
      bgColor: stats.hasHighStructuralMatch ? 'from-red-500/10 to-red-600/10 border-red-500/20' : 'from-blue-500/10 to-blue-600/10 border-blue-500/20'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ 
            scale: 1.05,
            rotateY: 5,
            z: 10
          }}
          className={`bg-gradient-to-br ${item.bgColor} p-4 rounded-lg border backdrop-blur-sm cursor-pointer group`}
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <item.icon className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
            </motion.div>
            <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
              {item.label}
            </span>
          </div>
          <Badge 
            variant={item.color as any}
            className="group-hover:scale-105 transition-transform"
          >
            {item.value}
          </Badge>
        </motion.div>
      ))}
    </div>
  )
}
