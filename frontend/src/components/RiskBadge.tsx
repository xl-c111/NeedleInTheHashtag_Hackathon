/**
 * RiskBadge Component
 * 
 * Displays risk level with appropriate styling.
 */

import { AlertTriangle, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high' | 'critical'
  showIcon?: boolean
}

const riskConfig = {
  low: {
    label: 'Low Risk',
    className: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  medium: {
    label: 'Medium Risk',
    className: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle,
  },
  high: {
    label: 'High Risk',
    className: 'bg-orange-100 text-orange-800',
    icon: AlertTriangle,
  },
  critical: {
    label: 'Critical',
    className: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
}

export function RiskBadge({ level, showIcon = true }: RiskBadgeProps) {
  const config = riskConfig[level]
  const Icon = config.icon
  
  return (
    <span 
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full 
                  text-sm font-medium ${config.className}`}
    >
      {showIcon && <Icon className="w-4 h-4" />}
      {config.label}
    </span>
  )
}
