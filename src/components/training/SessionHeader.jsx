import { Clock, Dumbbell } from 'lucide-react'

/**
 * Session header card with summary info and progress bar
 */
export function SessionHeader({ session, completionStats }) {
  const { percentage } = completionStats

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-tp-white font-bold text-base">{session.name}</h3>
          <p className="text-tp-soft text-xs mt-0.5">{session.phase} · Week {session.week}</p>

          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-tp-muted text-xs">
              <Clock size={12} />
              {session.estimatedDuration} min
            </span>
            <span className="flex items-center gap-1 text-tp-muted text-xs">
              <Dumbbell size={12} />
              {completionStats.total} exercises
            </span>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="flex flex-col items-center">
          <span className="font-mono font-bold text-tp-white text-2xl">{percentage}%</span>
          <span className="text-tp-muted text-[10px]">done</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-1.5 rounded-full bg-tp-raised overflow-hidden">
        <div
          className="h-full rounded-full bg-tp-green transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
