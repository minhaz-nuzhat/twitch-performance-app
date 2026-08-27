import { useState } from 'react'
import { CheckCircle2, Circle, Clock, ChevronDown, Youtube, PlayCircle } from 'lucide-react'
import clsx from 'clsx'
import { useRestTimer } from '../../hooks/useRestTimer'

function getYouTubeId(url = '') {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return m ? m[1] : null
}

/**
 * ExerciseRow — compact single-line design.
 * Tap the row to expand logging inputs + rest timer.
 */
export function ExerciseRow({ ex, onToggle, onLogChange }) {
  const timer = useRestTimer(ex.id, ex.rest)
  const [expanded, setExpanded] = useState(false)
  const ytId = getYouTubeId(ex.videoUrl ?? '')
  const thumbUrl = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null

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
        {ex.videoUrl && (
          <a
            href={ex.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            title="Watch coach demo"
            aria-label={`Watch coach demo for ${ex.name}`}
            className="flex-shrink-0 text-tp-red hover:text-tp-red-bright transition-colors"
          >
            <Youtube size={15} />
          </a>
        )}
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

          {/* Coach demo video */}
          {ex.videoUrl
            ? (
                <a
                  href={ex.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-tp-raised border border-tp-border rounded-lg p-2 hover:border-tp-red/50 transition-colors group"
                >
                  {thumbUrl
                    ? <img src={thumbUrl} alt="" className="w-16 h-10 object-cover rounded flex-shrink-0" />
                    : (
                        <div className="w-16 h-10 rounded bg-tp-black flex items-center justify-center flex-shrink-0">
                          <PlayCircle size={16} className="text-tp-red" />
                        </div>
                      )}
                  <div className="min-w-0 flex-1">
                    <p className="text-tp-white text-xs font-semibold">Watch coach demo</p>
                    <p className="text-tp-soft text-[10px] truncate">Technique reference for {ex.name}</p>
                  </div>
                  <PlayCircle size={16} className="text-tp-soft group-hover:text-tp-red transition-colors flex-shrink-0" />
                </a>
              )
            : (
                <p className="text-tp-muted text-[10px] italic">No demo video attached by your coach yet.</p>
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
