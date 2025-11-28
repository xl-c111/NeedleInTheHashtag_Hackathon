/**
 * CategoryBadge Component
 * 
 * Displays a category with appropriate styling based on risk level.
 */

interface CategoryBadgeProps {
  category: string
  size?: 'sm' | 'md' | 'lg'
}

const categoryConfig: Record<string, { label: string; className: string }> = {
  normal: {
    label: 'Normal',
    className: 'bg-green-100 text-green-800',
  },
  linkedin_lunatic: {
    label: 'LinkedIn Lunatic',
    className: 'bg-blue-100 text-blue-800',
  },
  body_dysmorphia: {
    label: 'Body Dysmorphia',
    className: 'bg-orange-100 text-orange-800',
  },
  incel: {
    label: 'Incel',
    className: 'bg-red-100 text-red-800',
  },
  toxic: {
    label: 'Toxic',
    className: 'bg-red-100 text-red-800',
  },
  unknown: {
    label: 'Unknown',
    className: 'bg-gray-100 text-gray-800',
  },
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

export function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const config = categoryConfig[category] || categoryConfig.unknown
  
  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium 
                  ${config.className} ${sizeClasses[size]}`}
    >
      {config.label}
    </span>
  )
}
