import { useState } from 'react'
import { useTraining } from '../hooks/useApi'
import { useWeeklySchedule } from '../hooks/useWeeklySchedule'
import { useExerciseLogs } from '../hooks/useExerciseLogs'
import { useSessionState } from '../hooks/useSessionState'
import { CheckCircle2, Play, ChevronDown, ClipboardCheck } from 'lucide-react'
import clsx from 'clsx'

import { WeeklyPlanner } from '../components/training/WeeklyPlanner'
import { SessionHeader } from '../components/training/SessionHeader'
import { ExerciseList } from '../components/training/ExerciseList'
import { ReadinessSurveyModal, READINESS_METRICS } from '../components/training/ReadinessSurveyModal'

function ReadinessChips({ readiness }) {
  if (!readiness) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {READINESS_METRICS.map(({ key, label }) => {
        const v = readiness[key]
        if (v == null) return null
        const color = v >= 4 ? 'text-tp-green bg-tp-green/10 border-tp-green/30'
          : v === 3 ? 'text-tp-amber bg-tp-amber/10 border-tp-amber/30'
            : 'text-tp-danger bg-tp-danger/10 border-tp-danger/30'
        return (
          <span key={key} className={clsx('text-[11px] font-semibold px-2 py-0.5 rounded-full border', color)}>
            {label} {v}/5
          </span>
        )
      })}
    </div>
  )
}

function HistoryRow({ session }) {
  const [open, setOpen] = useState(false)
  const hasDetail = session.loggedExercises?.length > 0

  return (
    <div className={clsx('card overflow-hidden', !session.completed && 'opacity-60')}>
      <button
        onClick={() => hasDetail && setOpen(v => !v)}
        className={clsx('w-full p-4 flex items-center gap-3 text-left', hasDetail && 'hover:bg-tp-raised/50 transition-colors')}
      >
        <div className={clsx(
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
          session.completed ? 'bg-tp-green/15' : 'bg-tp-danger/10',
        )}>
          {session.completed
            ? <CheckCircle2 size={16} className="text-tp-green" />
            : <div className="w-1.5 h-1.5 rounded-full bg-tp-danger" />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-tp-white text-sm font-semibold">{session.name}</p>
          <p className="text-tp-soft text-xs">
            {new Date(session.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            {session.notes && ` · ${session.notes}`}
            {hasDetail && ` · ${session.loggedExercises.length} lifts logged`}
          </p>
        </div>

        {session.readiness && (
          <div className="flex-shrink-0 text-right">
            <span className="label block">Readiness</span>
            <span className={clsx(
              'font-mono font-bold text-sm',
              session.readiness.average >= 3.4 ? 'text-tp-green'
                : session.readiness.average >= 2.6 ? 'text-tp-amber' : 'text-tp-danger',
            )}>
              {session.readiness.average}
            </span>
          </div>
        )}

        {session.rpe != null && (
          <div className="flex-shrink-0 text-right">
            <span className="label block">RPE</span>
            <span className="font-mono font-bold text-tp-white text-sm">{session.rpe}/10</span>
          </div>
        )}

        {hasDetail && (
          <ChevronDown size={14} className={clsx('text-tp-soft transition-transform flex-shrink-0', open && 'rotate-180')} />
        )}
      </button>

      {open && hasDetail && (
        <div className="px-4 pb-4 pt-3 border-t border-tp-border space-y-3 animate-fade-in">
          {session.readiness && (
            <div>
              <p className="label mb-1.5">Pre-session readiness</p>
              <ReadinessChips readiness={session.readiness} />
            </div>
          )}

          <div>
            <p className="label mb-1.5">Logged work</p>
            <div className="space-y-1">
              {session.loggedExercises.map((ex, i) => (
                <div key={i} className="flex items-center gap-2 bg-tp-raised border border-tp-border rounded-lg px-3 py-2">
                  <span className="text-tp-white text-xs font-medium flex-1 min-w-0 truncate">{ex.name}</span>
                  <span className="font-mono text-tp-soft text-xs flex-shrink-0">
                    {ex.setsLogged} × {ex.repsLogged}
                  </span>
                  <span className="font-mono text-tp-white text-xs font-bold flex-shrink-0 w-20 text-right">
                    {ex.weightLogged}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Training() {
  const { data: training, loading } = useTraining()
  const [activeTab, setActiveTab] = useState('today')
  const [surveyOpen, setSurveyOpen] = useState(false)

  // State management via custom hooks
  const weekly = useWeeklySchedule(0)
  const exercises = useExerciseLogs(training?.todaySession?.exercises ?? [])
  const session = useSessionState(training?.todaySession?.id ?? 'pending')

  if (loading || !training) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-20 rounded-xl" />
        ))}
      </div>
    )
  }

  const handleStart = (readiness) => {
    session.startSession(readiness)
    setSurveyOpen(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Program Header ── */}
      <div className="card p-5 border-red-glow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="label block mb-1">Active Program</span>
            <h2 className="text-tp-white font-bold text-lg">{training.name}</h2>
            <p className="text-tp-soft text-sm mt-0.5">{training.phase}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-tp-white font-mono font-bold text-2xl">
              {training.week}
              <span className="text-tp-muted text-base">/{training.totalWeeks}</span>
            </p>
            <p className="text-tp-muted text-xs">weeks completed</p>
          </div>
        </div>
        {/* Week progress bar */}
        <div className="mt-4">
          <div className="h-1.5 rounded-full bg-tp-raised overflow-hidden">
            <div
              className="h-full rounded-full bg-tp-red transition-all duration-700"
              style={{
                width: `${(training.week / training.totalWeeks) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-tp-muted">
            <span>Phase {training.phaseNumber}/{training.totalPhases}</span>
            <span>Assigned by {training.assignedBy}</span>
          </div>
        </div>
      </div>

      {/* ── Weekly Planner ── */}
      <WeeklyPlanner
        weekLabel={weekly.weekLabel}
        weekSchedule={weekly.weekSchedule}
        dragSession={weekly.dragSession}
        selectedDayKey={weekly.selectedDayKey}
        workoutTemplates={training.workoutTemplates || []}
        onDragStartFromTemplate={(source) => weekly.handleDragStart(source)}
        onDragStartFromSlot={(source) => weekly.handleDragStart(source)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={weekly.handleDrop}
        onSelectDay={weekly.setSelectedDayKey}
        onToggleCompleted={weekly.toggleSlotCompleted}
        onClearSlot={weekly.clearSlot}
        onPrevWeek={() => weekly.setWeekOffset((prev) => prev - 1)}
        onNextWeek={() => weekly.setWeekOffset((prev) => prev + 1)}
        onThisWeek={weekly.goToThisWeek}
      />

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-tp-surface p-1 rounded-xl border border-tp-border">
        {[
          { id: 'today', label: "Today's Session" },
          { id: 'history', label: 'History' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-tp-red text-white'
                : 'text-tp-muted hover:text-tp-white',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Today's Session Tab ── */}
      {activeTab === 'today' && (
        <div className="space-y-4 animate-fade-in">
          <SessionHeader
            session={training.todaySession}
            completionStats={exercises.completionStats}
          />

          {!session.started
            ? (
                <div className="card p-6 text-center border-2 border-tp-red/30">
                  <div className="w-12 h-12 rounded-xl bg-tp-red/15 border border-tp-red/30 flex items-center justify-center mx-auto mb-3">
                    <ClipboardCheck size={22} className="text-tp-red" />
                  </div>
                  <h3 className="text-tp-white font-bold text-base mb-1">Ready to train?</h3>
                  <p className="text-tp-soft text-sm leading-relaxed mb-1 max-w-sm mx-auto">
                    Before you start, tell us how you're feeling. Five quick ratings — sleep, mood, energy, stress, and soreness.
                  </p>
                  <p className="text-tp-muted text-xs leading-relaxed mb-4 max-w-sm mx-auto">
                    This builds the recovery picture your coach uses to adjust your load, and trains the assistant to flag when a session should be dialled back.
                  </p>
                  <button onClick={() => setSurveyOpen(true)} className="btn-primary inline-flex items-center gap-2">
                    <Play size={15} />
                    Start Today's Session
                  </button>
                </div>
              )
            : (
                <>
                  {/* Readiness recorded for this session */}
                  <div className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ClipboardCheck size={14} className="text-tp-red" />
                        <p className="label">Today's Readiness</p>
                      </div>
                      <span className={clsx(
                        'font-mono font-bold text-sm',
                        session.readiness.average >= 3.4 ? 'text-tp-green'
                          : session.readiness.average >= 2.6 ? 'text-tp-amber' : 'text-tp-danger',
                      )}>
                        {session.readiness.average} / 5.0
                      </span>
                    </div>
                    <ReadinessChips readiness={session.readiness} />
                  </div>

                  <ExerciseList
                    exercises={exercises.exercises}
                    onToggle={exercises.toggleExercise}
                    onLogChange={exercises.updateExerciseLog}
                  />

                  {exercises.completionStats.percentage === 100 && !session.finishedAt && (
                    <button
                      onClick={() => session.finishSession(exercises.exercises)}
                      className="w-full btn-primary py-3 text-sm"
                    >
                      Save Session to History
                    </button>
                  )}

                  {session.finishedAt && (
                    <div className="card p-4 border-tp-green/30 bg-tp-green/5 text-center">
                      <p className="text-tp-green font-semibold text-sm">🎉 Session Complete</p>
                      <p className="text-tp-soft text-xs mt-1">
                        {session.loggedExercises.length} lifts saved to History. Your adherence score has been updated.
                      </p>
                    </div>
                  )}
                </>
              )}
        </div>
      )}

      {/* ── History Tab ── */}
      {activeTab === 'history' && (
        <div className="space-y-2 animate-fade-in">
          {session.finishedAt && (
            <HistoryRow session={{
              date: training.todaySession.date,
              name: training.todaySession.name,
              completed: true,
              rpe: null,
              notes: 'Today',
              readiness: session.readiness,
              loggedExercises: session.loggedExercises,
            }} />
          )}
          {training.recentSessions.map((s, i) => (
            <HistoryRow key={i} session={s} />
          ))}
        </div>
      )}

      <ReadinessSurveyModal
        isOpen={surveyOpen}
        onClose={() => setSurveyOpen(false)}
        onSubmit={handleStart}
        sessionName={training.todaySession.name}
      />
    </div>
  )
}
