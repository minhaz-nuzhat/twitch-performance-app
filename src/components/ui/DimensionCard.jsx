import clsx from 'clsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { InfoTooltip } from './InfoTooltip'
import { DIMENSION_TOOLTIPS } from '../../data/scienceTooltips'

function scoreColor(score, inverted = false) {
  const s = inverted ? 100 - score : score
  if (s >= 70) return { bar: 'bg-tp-green', text: 'text-tp-green', bg: 'bg-tp-green/10' }
  if (s >= 50) return { bar: 'bg-tp-amber', text: 'text-tp-amber', bg: 'bg-tp-amber/10' }
  return          { bar: 'bg-tp-danger',  text: 'text-tp-danger', bg: 'bg-tp-danger/10' }
}

export default function DimensionCard({ dimension, delay = 0 }) {
  const { label, score, raw, change, icon, inverted = false } = dimension
  const { bar, text, bg } = scoreColor(score, inverted)

  const ChangeIcon = change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus
  const changeColor = change > 0
    ? (inverted ? 'text-tp-danger' : 'text-tp-green')
    : change < 0
      ? (inverted ? 'text-tp-green' : 'text-tp-danger')
      : 'text-tp-muted'

  return (
    <div
      className="card p-4 hover:border-tp-border-bright transition-all duration-200 animate-fade-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{icon}</span>
          <span className="text-tp-soft text-xs font-medium leading-tight">{label}</span>
          <InfoTooltip text={DIMENSION_TOOLTIPS[label]} size={11} />
        </div>
        <div className={clsx('flex items-center gap-0.5 text-xs font-medium', changeColor)}>
          <ChangeIcon size={11} />
          <span>{change !== 0 ? Math.abs(change) : '—'}</span>
        </div>
      </div>

      {/* Score */}
      <div className="flex items-end justify-between mb-2">
        <span className={clsx('font-mono font-bold text-2xl', text)}>{score}</span>
        <span className="text-tp-muted text-xs text-right leading-tight max-w-[80px]">{raw}</span>
      </div>

      {/* Bar */}
      <div className="h-1.5 rounded-full bg-tp-raised overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-700', bar)}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Inverted label */}
      {inverted && (
        <p className="text-tp-muted text-[10px] mt-1.5">Lower = better</p>
      )}
    </div>
  )
}
