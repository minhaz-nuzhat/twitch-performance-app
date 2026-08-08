import { CheckCircle2, Circle, Clock } from 'lucide-react'
import clsx from 'clsx'
import { useRestTimer } from '../../hooks/useRestTimer'

/**
 * ExerciseRow with completion toggle, logging inputs, and rest timer
 */
export function ExerciseRow({ ex, onToggle, onLogChange }) {
  const timer = useRestTimer(ex.id, ex.rest)

  return (
    <div
      className={clsx(
        'flex flex-col gap-3 px-4 py-3 rounded-xl border transition-all duration-150',
        ex.completed
          ? 'bg-tp-green/5 border-tp-green/20'
          : 'card hover:border-tp-border-bright',
      )}
    >
      {/* Header: Toggle + Name + Order */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(ex.id)}
          className="flex-shrink-0 mt-0.5 hover:scale-110 transition-transform"
        >
          {ex.completed
            ? <CheckCircle2 size={20} className="text-tp-green" />
            : <Circle size={20} className="text-tp-border" />}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={clsx(
              'text-sm font-medium',
              ex.completed
                ? 'text-tp-soft line-through'
                : 'text-tp-white',
            )}
          >
            {ex.name}
          </p>
          <p className="text-tp-muted text-xs mt-0.5">
            {ex.sets} × {ex.reps} · {ex.load} · Rest {ex.rest}
          </p>
          {ex.notes && (
            <p className="text-tp-red text-xs mt-1 italic">{ex.notes}</p>
          )}
        </div>

        <span className="label flex-shrink-0">#{ex.order}</span>
      </div>

      {/* Logging Inputs */}
      <div className="ml-7 grid grid-cols-3 gap-2">
        <input
          type="number"
          placeholder="Sets"
          value={ex.setsLogged ?? ''}
          onChange={(e) => onLogChange(ex.id, { setsLogged: e.target.value })}
          className={clsx(
            'px-2 py-1.5 rounded-lg bg-tp-raised border border-tp-border text-tp-white text-xs',
            'placeholder:text-tp-muted focus:outline-none focus:border-tp-red/50',
            ex.completed && 'opacity-50',
          )}
        />
        <input
          type="number"
          placeholder="Reps"
          value={ex.repsLogged ?? ''}
          onChange={(e) => onLogChange(ex.id, { repsLogged: e.target.value })}
          className={clsx(
            'px-2 py-1.5 rounded-lg bg-tp-raised border border-tp-border text-tp-white text-xs',
            'placeholder:text-tp-muted focus:outline-none focus:border-tp-red/50',
            ex.completed && 'opacity-50',
          )}
        />
        <input
          type="text"
          placeholder="Weight"
          value={ex.weightLogged ?? ''}
          onChange={(e) => onLogChange(ex.id, { weightLogged: e.target.value })}
          className={clsx(
            'px-2 py-1.5 rounded-lg bg-tp-raised border border-tp-border text-tp-white text-xs',
            'placeholder:text-tp-muted focus:outline-none focus:border-tp-red/50',
            ex.completed && 'opacity-50',
          )}
        />
      </div>

      {/* Rest Timer */}
      <button
        onClick={timer.toggleTimer}
        className={clsx(
          'ml-7 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all',
          timer.isActive || timer.remainingSeconds !== null
            ? 'bg-tp-red/10 border-tp-red/30 text-tp-red'
            : 'bg-tp-raised border-tp-border text-tp-muted hover:text-tp-white',
        )}
      >
        <Clock size={10} className="inline mr-1" />
        {timer.displayText}
      </button>
    </div>
  )
}
