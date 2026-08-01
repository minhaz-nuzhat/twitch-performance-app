import { Zap, TrendingUp, AlertTriangle } from 'lucide-react'

const TYPE_CONFIG = {
  improvement: {
    icon:        Zap,
    iconColor:   'text-tp-green',
    iconBg:      'bg-tp-green/10',
    border:      'border-tp-green/20',
    accentBar:   'bg-tp-green',
  },
  warning: {
    icon:        AlertTriangle,
    iconColor:   'text-tp-amber',
    iconBg:      'bg-tp-amber/10',
    border:      'border-tp-amber/25',
    accentBar:   'bg-tp-amber',
  },
  milestone: {
    icon:        TrendingUp,
    iconColor:   'text-tp-red',
    iconBg:      'bg-tp-red/10',
    border:      'border-tp-red/25',
    accentBar:   'bg-tp-red',
  },
}

export default function InsightCard({ insight }) {
  if (!insight) return null

  const cfg    = TYPE_CONFIG[insight.type] ?? TYPE_CONFIG.milestone
  const Icon   = cfg.icon

  return (
    <div className={`card p-4 border ${cfg.border} relative overflow-hidden`}>
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${cfg.accentBar}`} />

      {/* Header */}
      <div className="flex items-start gap-3 pl-2">
        <div className={`p-2 rounded-lg ${cfg.iconBg} flex-shrink-0`}>
          <Icon size={16} className={cfg.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-tp-white text-sm font-semibold leading-tight">{insight.title}</p>
            <span className="label flex-shrink-0">AI Insight</span>
          </div>
          <p className="text-tp-soft text-xs leading-relaxed">{insight.body}</p>
        </div>
      </div>

      {/* Priority callout */}
      {insight.priority && (
        <div className="mt-3 ml-2 pl-3 py-2 border-l-2 border-tp-red/40 bg-tp-red/5 rounded-r-lg">
          <p className="text-tp-red text-xs font-medium">{insight.priority}</p>
        </div>
      )}
    </div>
  )
}
