import { useState } from 'react'
import { useTraining } from '../hooks/useApi'
import { useWeeklySchedule } from '../hooks/useWeeklySchedule'
import { useExerciseLogs } from '../hooks/useExerciseLogs'
import { CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'

import { WeeklyPlanner } from '../components/training/WeeklyPlanner'
import { SessionHeader } from '../components/training/SessionHeader'
import { ExerciseList } from '../components/training/ExerciseList'

export default function Training() {
  const { data: training, loading } = useTraining()
  const [activeTab, setActiveTab] = useState('today')

  // State management via custom hooks
  const weekly = useWeeklySchedule(0)
  const exercises = useExerciseLogs(training?.todaySession?.exercises ?? [])

  if (loading || !training) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-20 rounded-xl" />
        ))}
      </div>
    )
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

          <ExerciseList
            exercises={exercises.exercises}
            onToggle={exercises.toggleExercise}
            onLogChange={exercises.updateExerciseLog}
          />

          {exercises.completionStats.percentage === 100 && (
            <div className="card p-4 border-tp-green/30 bg-tp-green/5 text-center">
              <p className="text-tp-green font-semibold text-sm">
                🎉 Session Complete!
              </p>
              <p className="text-tp-muted text-xs mt-1">
                Nice work. Your adherence score has been updated.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── History Tab ── */}
      {activeTab === 'history' && (
        <div className="space-y-2 animate-fade-in">
          {training.recentSessions.map((s, i) => (
            <div
              key={i}
              className={clsx(
                'card p-4 flex items-center gap-3',
                !s.completed && 'opacity-50',
              )}
            >
              <div
                className={clsx(
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                  s.completed
                    ? 'bg-tp-green/15'
                    : 'bg-tp-danger/10',
                )}
              >
                {s.completed
                  ? (
                      <CheckCircle2
                        size={16}
                        className="text-tp-green"
                      />
                    )
                  : (
                      <div className="w-1.5 h-1.5 rounded-full bg-tp-danger" />
                    )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-tp-white text-sm font-medium">{s.name}</p>
                <p className="text-tp-muted text-xs">
                  {new Date(s.date).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                  {s.notes && ` · ${s.notes}`}
                </p>
              </div>
              {s.rpe != null && (
                <div className="flex-shrink-0 text-right">
                  <span className="label block">RPE</span>
                  <span className="font-mono font-bold text-tp-white text-sm">
                    {s.rpe}
                    /10
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
