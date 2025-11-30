/**
 * ConfidenceBar Component
 * 
 * Visual representation of confidence score.
 */

interface ConfidenceBarProps {
  confidence: number  // 0-1
  showLabel?: boolean
}

export function ConfidenceBar({ confidence, showLabel = true }: ConfidenceBarProps) {
  const percentage = Math.round(confidence * 100)
  
  // Color based on confidence level
  let colorClass = 'bg-gray-400'
  if (percentage >= 80) colorClass = 'bg-green-500'
  else if (percentage >= 60) colorClass = 'bg-yellow-500'
  else if (percentage >= 40) colorClass = 'bg-orange-500'
  else colorClass = 'bg-red-500'
  
  return (
    <div className="flex items-center gap-2 flex-1">
      {showLabel && (
        <span className="text-sm text-gray-500 w-20">Confidence</span>
      )}
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-700 w-12 text-right">
        {percentage}%
      </span>
    </div>
  )
}
