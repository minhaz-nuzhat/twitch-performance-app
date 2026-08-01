import { useState } from 'react'
import { useTraining } from '../hooks/useApi'
import { CheckCircle2, Circle, Clock, ChevronRight, Dumbbell, Calendar } from 'lucide-react'
import clsx from 'clsx'

function ExerciseRow({ ex, onToggle }) {
  return (
    <div
      className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150 cursor-pointer',
        ex.completed
          ? 'bg-tp-green/5 border-tp-green/20'
          : 'card hover:border-tp-border-bright',
      )}
      onClick={() => onToggle(ex.id)}
    >
      {ex.completed
        ? <CheckCircle2 size={20} className="text-tp-green flex-shrink-0" />
        : <Circle size={20} className="text-tp-border flex-shrink-0" />}

      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm font-medium', ex.completed ? 'text-tp-soft line-through' : 'text-tp-white')}>
          {ex.name}
        </p>
        <p className="text-tp-muted text-xs mt-0.5">
          {ex.sets} × {ex.reps} · {ex.load} · Rest {ex.rest}
        </p>
        {ex.notes && (
          <p className="text-tp-red text-xs mt-0.5 italic">{ex.notes}</p>
        )}
      </div>

      <span className="label flex-shrink-0">#{ex.order}</span>
    </div>
  )
}

export default function Training() {
  const { data: training, loading } = useTraining()
  const [exercises, setExercises]   = useState(null)
  const [activeTab, setActiveTab]   = useState('today')

  // Initialise exercise state from training data
  if (training && !exercises) {
    setExercises(training.todaySession.exercises.map((ex) => ({ ...ex })))
  }

  const toggleExercise = (id) => {
    setExercises((prev) =>
      prev.map((ex) => ex.id === id ? { ...ex, completed: !ex.completed } : ex),
    )
  }

  if (loading || !training) {
    return <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
  }

  const completed = exercises?.filter((e) => e.completed).length ?? 0
  const total     = exercises?.length ?? 0
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0

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
          {/* Phase progress */}
          <div className="sm:text-right">
            <p className="text-tp-white font-mono font-bold text-2xl">
              {training.week}<span className="text-tp-muted text-base">/{training.totalWeeks}</span>
            </p>
            <p className="text-tp-muted text-xs">weeks completed</p>
          </div>
        </div>
        {/* Week bar */}
        <div className="mt-4">
          <div className="h-1.5 rounded-full bg-tp-raised overflow-hidden">
            <div
              className="h-full rounded-full bg-tp-red transition-all duration-700"
              style={{ width: `${(training.week / training.totalWeeks) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-tp-muted">
            <span>Phase {training.phaseNumber}/{training.totalPhases}</span>
            <span>Assigned by {training.assignedBy}</span>
          </div>
        </div>
      </div>

      {/* ── Week View ── */}
      <div>
        <h3 className="text-tp-white font-semibold mb-3 flex items-center gap-2">
          <Calendar size={16} className="text-tp-red" />
          This Week
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {training.weekView.map((day) => (
            <div
              key={day.day}
              className={clsx(
                'card p-3 text-center transition-all',
                day.status === 'today'     && 'border-tp-red/40 bg-tp-red/5',
                day.status === 'completed' && 'border-tp-green/20 bg-tp-green/5',
                day.status === 'upcoming'  && 'opacity-60',
              )}
            >
              <p className={clsx(
                'text-xs font-bold uppercase tracking-wider',
                day.status === 'today'     && 'text-tp-red',
                day.status === 'completed' && 'text-tp-green',
                day.status === 'upcoming'  && 'text-tp-muted',
              )}>
                {day.status === 'today' ? '● Today' : day.day}
              </p>
              <p className="text-tp-white text-xs font-medium mt-1 leading-tight">{day.name}</p>
              <p className="text-tp-muted text-[10px] mt-1">
                <Clock size={9} className="inline mr-0.5" />{day.duration} min
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-tp-surface p-1 rounded-xl border border-tp-border">
        {[
          { id: 'today',   label: "Today's Session" },
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

      {/* ── Today's Session ── */}
      {activeTab === 'today' && exercises && (
        <div className="space-y-4 animate-fade-in">
          {/* Session header */}
          <div className="card p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-tp-white font-bold text-base">{training.todaySession.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-tp-muted text-xs">
                    <Clock size={11} /> {training.todaySession.estimatedDuration} min
                  </span>
                  <span className="flex items-center gap-1 text-tp-muted text-xs">
                    <Dumbbell size={11} /> {total} exercises
                  </span>
                </div>
              </div>
              {/* Progress ring mini */}
              <div className="flex flex-col items-center">
                <span className="font-mono font-bold text-tp-white text-xl">{pct}%</span>
                <span className="text-tp-muted text-[10px]">done</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-1.5 rounded-full bg-tp-raised overflow-hidden">
              <div
                className="h-full rounded-full bg-tp-green transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Warmup / Cooldown */}
            <div className="mt-3 space-y-1.5">
              <p className="text-[10px] text-tp-muted">
                <span className="text-tp-amber font-medium">Warm-up:</span>{' '}
                {training.todaySession.warmup}
              </p>
              <p className="text-[10px] text-tp-muted">
                <span className="text-tp-amber font-medium">Cool-down:</span>{' '}
                {training.todaySession.cooldown}
              </p>
            </div>
          </div>

          {/* Exercise list */}
          <div className="space-y-2">
            {exercises.map((ex) => (
              <ExerciseRow key={ex.id} ex={ex} onToggle={toggleExercise} />
            ))}
          </div>

          {pct === 100 && (
            <div className="card p-4 border-tp-green/30 bg-tp-green/5 text-center">
              <p className="text-tp-green font-semibold text-sm">🎉 Session Complete!</p>
              <p className="text-tp-muted text-xs mt-1">Nice work. Your adherence score has been updated.</p>
            </div>
          )}
        </div>
      )}

      {/* ── History ── */}
      {activeTab === 'history' && (
        <div className="space-y-2 animate-fade-in">
          {training.recentSessions.map((s, i) => (
            <div key={i} className={clsx(
              'card p-4 flex items-center gap-3',
              !s.completed && 'opacity-50',
            )}>
              <div className={clsx(
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                s.completed ? 'bg-tp-green/15' : 'bg-tp-danger/10',
              )}>
                {s.completed
                  ? <CheckCircle2 size={16} className="text-tp-green" />
                  : <Circle       size={16} className="text-tp-danger" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-tp-white text-sm font-medium">{s.name}</p>
                <p className="text-tp-muted text-xs">
                  {new Date(s.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                  {s.notes && ` · ${s.notes}`}
                </p>
              </div>
              {s.rpe != null && (
                <div className="flex-shrink-0 text-right">
                  <span className="label block">RPE</span>
                  <span className="font-mono font-bold text-tp-white text-sm">{s.rpe}/10</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
