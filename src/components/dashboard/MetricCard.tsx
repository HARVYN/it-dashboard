'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    label: string
    direction: 'up' | 'down' | 'neutral'
  }
  icon?: React.ComponentType<{ className?: string }>
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo' | 'orange'
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  color = 'blue'
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return { icon: 'text-blue-600', bg: 'bg-blue-100' }
      case 'green':
        return { icon: 'text-green-600', bg: 'bg-green-100' }
      case 'red':
        return { icon: 'text-red-600', bg: 'bg-red-100' }
      case 'yellow':
        return { icon: 'text-yellow-600', bg: 'bg-yellow-100' }
      case 'purple':
        return { icon: 'text-purple-600', bg: 'bg-purple-100' }
      case 'indigo':
        return { icon: 'text-indigo-600', bg: 'bg-indigo-100' }
      case 'orange':
        return { icon: 'text-orange-600', bg: 'bg-orange-100' }
      default:
        return { icon: 'text-gray-600', bg: 'bg-gray-100' }
    }
  }

  const getTrendIcon = () => {
    switch (trend?.direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />
      case 'down':
        return <TrendingDown className="h-4 w-4" />
      case 'neutral':
        return <Minus className="h-4 w-4" />
      default:
        return null
    }
  }

  const getTrendColor = () => {
    switch (trend?.direction) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      case 'neutral':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  const colors = getColorClasses()

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center space-x-1 mt-2 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="text-sm font-medium">
                  {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div className={`flex-shrink-0 p-3 rounded-lg ${colors.bg}`}>
              <Icon className={`h-6 w-6 ${colors.icon}`} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default MetricCard

