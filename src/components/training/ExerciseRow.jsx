import { useState } from 'react'
import { CheckCircle2, Circle, Clock, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { useRestTimer } from '../../hooks/useRestTimer'

/**
 * ExerciseRow — compact single-line design.
 * Tap the row to expand logging inputs + rest timer.
 */
export function ExerciseRow({ ex, onToggle, onLogChange }) {
  const timer = useRestTimer(ex.id, ex.rest)
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={clsx(
        'rounded-xl border transition-all duration-150',
        ex.completed
          ? 'bg-tp-green/5 border-tp-green/20'
          : 'card hover:border-tp-border-bright',
      )}
    >
      {/* ── Compact row ── */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* Completion toggle */}
        <button
          onClick={() => onToggle(ex.id)}
          className="flex-shrink-0 hover:scale-110 transition-transform"
        >
          {ex.completed
            ? <CheckCircle2 size={17} className="text-tp-green" />
            : <Circle size={17} className="text-tp-border" />}
        </button>

        {/* Name + specs */}
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex-1 min-w-0 text-left"
        >
          <p className={clsx(
            'text-xs font-medium leading-tight',
            ex.completed ? 'text-tp-soft line-through' : 'text-tp-white',
          )}>
            {ex.name}
          </p>
          <p className="text-tp-muted text-[10px] mt-0.5">
            {ex.sets} × {ex.reps} · {ex.load} · Rest {ex.rest}
          </p>
        </button>

        {/* Order badge + expand chevron */}
        <span className="label flex-shrink-0 text-[9px]">#{ex.order}</span>
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex-shrink-0 text-tp-muted hover:text-tp-white transition-colors"
        >
          <ChevronDown size={13} className={clsx('transition-transform duration-200', expanded && 'rotate-180')} />
        </button>
      </div>

      {/* ── Expanded: coach note + inputs + timer ── */}
      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-tp-border/50 pt-2.5 animate-fade-in">
          {ex.notes && (
            <p className="text-tp-red text-[10px] italic leading-snug">{ex.notes}</p>
          )}

          {/* Logging inputs */}
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { key: 'setsLogged',   ph: 'Sets',   type: 'number' },
              { key: 'repsLogged',   ph: 'Reps',   type: 'number' },
              { key: 'weightLogged', ph: 'Weight', type: 'text'   },
            ].map(({ key, ph, type }) => (
              <input
                key={key}
                type={type}
                placeholder={ph}
                value={ex[key] ?? ''}
                onChange={(e) => onLogChange(ex.id, { [key]: e.target.value })}
                className={clsx(
                  'px-2 py-1 rounded-lg bg-tp-raised border border-tp-border text-tp-white text-[10px]',
                  'placeholder:text-tp-muted focus:outline-none focus:border-tp-red/50',
                  ex.completed && 'opacity-50',
                )}
              />
            ))}
          </div>

          {/* Rest timer */}
          <button
            onClick={timer.toggleTimer}
            className={clsx(
              'flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded-lg border transition-all',
              timer.isActive || timer.remainingSeconds !== null
                ? 'bg-tp-red/10 border-tp-red/30 text-tp-red'
                : 'bg-tp-raised border-tp-border text-tp-muted hover:text-tp-white',
            )}
          >
            <Clock size={9} />
            {timer.displayText}
          </button>
        </div>
      )}
    </div>
  )
}
