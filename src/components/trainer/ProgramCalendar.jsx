import { useMemo } from 'react'
import { Play, Clock } from 'lucide-react'
import clsx from 'clsx'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAY_SHORT = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat' }

// One color per phase index
const PHASE_STYLES = [
  { bg: 'bg-tp-red/20',     border: 'border-tp-red/40',     text: 'text-tp-red',    dot: 'bg-tp-red'    },
  { bg: 'bg-tp-amber/20',   border: 'border-tp-amber/40',   text: 'text-tp-amber',  dot: 'bg-tp-amber'  },
  { bg: 'bg-tp-green/20',   border: 'border-tp-green/40',   text: 'text-tp-green',  dot: 'bg-tp-green'  },
  { bg: 'bg-blue-500/20',   border: 'border-blue-500/40',   text: 'text-blue-400',  dot: 'bg-blue-400'  },
  { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400',dot: 'bg-purple-400'},
]

/**
 * ProgramCalendar
 * Props:
 *   phases         : program.phases array
 *   onSelectSession: (phaseId, sessionId) => void  — jump to build view for that session
 */
export default function ProgramCalendar({ phases = [], onSelectSession }) {
  // Flatten all sessions with phase metadata
  const allSessions = useMemo(() =>
    phases.flatMap((phase, phaseIdx) =>
      phase.sessions.map(s => ({ ...s, phaseId: phase.id, phaseName: phase.name, phaseIdx }))
    ),
    [phases],
  )

  const maxWeek = Math.max(1, ...allSessions.map(s => s.week))
  const weeks   = Array.from({ length: maxWeek }, (_, i) => i + 1)

  // Lookup: week+day → session
  const sessionMap = useMemo(() => {
    const map = {}
    allSessions.forEach(s => { map[`${s.week}_${s.day}`] = s })
    return map
  }, [allSessions])

  // Calculate phase week ranges for the legend / phase header rows
  const phaseRanges = useMemo(() =>
    phases.map((phase, idx) => {
      const sessionWeeks = phase.sessions.map(s => s.week)
      return {
        ...phase,
        phaseIdx: idx,
        minWeek: sessionWeeks.length ? Math.min(...sessionWeeks) : null,
        maxWeek: sessionWeeks.length ? Math.max(...sessionWeeks) : null,
      }
    }),
    [phases],
  )

  if (phases.length === 0) {
    return (
      <div className="card border-dashed py-16 text-center">
        <p className="text-tp-muted text-sm">Add phases and sessions to see the calendar</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* ── Phase legend ── */}
      <div className="flex flex-wrap gap-2">
        {phaseRanges.map((phase, i) => {
          const style = PHASE_STYLES[i % PHASE_STYLES.length]
          return (
            <div key={phase.id} className={clsx('flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs', style.bg, style.border)}>
              <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', style.dot)} />
              <span className={clsx('font-medium', style.text)}>{phase.name}</span>
              {phase.minWeek && <span className="text-tp-muted">Wk {phase.minWeek}–{phase.maxWeek}</span>}
            </div>
          )
        })}
      </div>

      {/* ── Calendar grid — scrollable horizontally on mobile ── */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1.5 mb-1.5">
            <div className="text-tp-muted text-xs font-medium px-2 py-1" />
            {DAYS.map(day => (
              <div key={day} className="text-tp-muted text-xs font-medium text-center py-1 uppercase tracking-wider">
                {DAY_SHORT[day]}
              </div>
            ))}
          </div>

          {/* Week rows */}
          <div className="space-y-1.5">
            {weeks.map(week => {
              // Which phases are active this week?
              const weekPhases = [...new Set(allSessions.filter(s => s.week === week).map(s => s.phaseIdx))]

              return (
                <div key={week} className="grid grid-cols-7 gap-1.5 items-stretch">
                  {/* Week label */}
                  <div className="flex flex-col items-center justify-center bg-tp-card border border-tp-border rounded-lg px-1 py-2">
                    <span className="text-tp-white text-xs font-mono font-bold">Wk{week}</span>
                    {weekPhases.length > 0 && (
                      <div className="flex gap-0.5 mt-1">
                        {weekPhases.map(idx => (
                          <div key={idx} className={clsx('w-1.5 h-1.5 rounded-full', PHASE_STYLES[idx % PHASE_STYLES.length].dot)} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Day cells */}
                  {DAYS.map(day => {
                    const session = sessionMap[`${week}_${day}`]
                    const style   = session ? PHASE_STYLES[session.phaseIdx % PHASE_STYLES.length] : null

                    return (
                      <div key={day}>
                        {session ? (
                          <button
                            onClick={() => onSelectSession?.(session.phaseId, session.id)}
                            className={clsx(
                              'w-full h-full min-h-[3.5rem] rounded-lg border p-2 text-left transition-all hover:opacity-80 active:scale-95',
                              style.bg, style.border,
                            )}
                            title={`${session.name || 'Session'} — Click to edit`}
                          >
                            <p className={clsx('text-[11px] font-semibold leading-tight truncate', style.text)}>
                              {session.name || 'Session'}
                            </p>
                            {session.exercises?.length > 0 && (
                              <p className="text-tp-muted text-[10px] mt-0.5 flex items-center gap-0.5">
                                <Clock size={8} />
                                {session.exercises.length} ex
                              </p>
                            )}
                          </button>
                        ) : (
                          <div className="w-full h-full min-h-[3.5rem] rounded-lg border border-dashed border-tp-border/40 bg-tp-black/30" />
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Summary stats ── */}
      <div className="flex gap-4 pt-2 border-t border-tp-border text-xs text-tp-muted">
        <span><span className="text-tp-white font-mono">{maxWeek}</span> weeks</span>
        <span><span className="text-tp-white font-mono">{allSessions.length}</span> sessions</span>
        <span><span className="text-tp-white font-mono">{allSessions.reduce((a, s) => a + (s.exercises?.length ?? 0), 0)}</span> exercises total</span>
        <span className="ml-auto">Click any session block to edit it</span>
      </div>
    </div>
  )
}
