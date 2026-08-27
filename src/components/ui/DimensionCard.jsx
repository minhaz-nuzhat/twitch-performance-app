import clsx from 'clsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { InfoTooltip } from './InfoTooltip'
import { DIMENSION_TOOLTIPS } from '../../data/scienceTooltips'

// Inverted dimensions (e.g. Injury Risk) are flipped so "high number = bad" reads the same way.
function scoreColor(score, inverted = false) {
  const s = inverted ? 100 - score : score
  if (s >= 70) return { bar: 'bg-tp-green',  text: 'text-tp-green',  bg: 'bg-tp-green/10',  band: 'Strong',    critical: false }
  if (s >= 60) return { bar: 'bg-tp-amber',  text: 'text-tp-amber',  bg: 'bg-tp-amber/10',  band: 'Developing', critical: false }
  if (s >= 45) return { bar: 'bg-tp-danger', text: 'text-tp-danger', bg: 'bg-tp-danger/10', band: 'Needs work', critical: false }
  return          { bar: 'bg-tp-danger', text: 'text-tp-danger', bg: 'bg-tp-danger/15', band: 'Critical',  critical: true }
}

export default function DimensionCard({ dimension, delay = 0 }) {
  const { label, score, raw, change, icon, inverted = false } = dimension
  const { bar, text, bg, band, critical } = scoreColor(score, inverted)

  const ChangeIcon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus
  const changeColor = change > 0
    ? (inverted ? 'text-tp-danger' : 'text-tp-green')
    : change < 0
      ? (inverted ? 'text-tp-green' : 'text-tp-danger')
      : 'text-tp-muted'

  return (
    <div
      className={clsx(
        'card p-4 transition-all duration-200 animate-fade-up opacity-0',
        critical ? 'border-tp-danger/60 shadow-[0_0_16px_rgba(239,68,68,0.18)]' : 'hover:border-tp-border-bright',
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{icon}</span>
          <span className="text-tp-white text-sm font-semibold leading-tight">{label}</span>
          <InfoTooltip text={DIMENSION_TOOLTIPS[label]} size={11} />
        </div>
        <div className={clsx('flex items-center gap-0.5 text-sm font-semibold', changeColor)}>
          <ChangeIcon size={14} />
          <span>{change !== 0 ? Math.abs(change) : '—'}</span>
        </div>
      </div>

      {/* Score */}
      <div className="flex items-end justify-between mb-2">
        <span className={clsx('font-mono font-bold text-3xl', text)}>{score}</span>
        <span className="text-tp-soft text-xs text-right leading-tight max-w-[80px]">{raw}</span>
      </div>

      {/* Bar */}
      <div className="h-1.5 rounded-full bg-tp-raised overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-700', bar)}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Band label */}
      <div className="flex items-center justify-between mt-2">
        <span className={clsx('text-[11px] font-bold px-1.5 py-0.5 rounded', text, bg)}>{band}</span>
        {inverted && <span className="text-tp-soft text-xs font-medium">Lower = better</span>}
      </div>
    </div>
  )
}
