import { useState } from 'react'
import { useGoals, useAssessments } from '../hooks/useApi'
import { Trophy, Calendar, TrendingUp, CheckCircle2, Clock } from 'lucide-react'
import clsx from 'clsx'

function GoalCard({ goal }) {
  const statusConfig = {
    on_track:       { color: 'text-tp-green',  bg: 'bg-tp-green/10',  bar: 'bg-tp-green',  label: 'On track'    },
    needs_attention:{ color: 'text-tp-amber',  bg: 'bg-tp-amber/10',  bar: 'bg-tp-amber',  label: 'Attention'   },
    achieved:       { color: 'text-tp-red',    bg: 'bg-tp-red/10',    bar: 'bg-tp-red',    label: 'Achieved'    },
  }[goal.status] ?? {}

  const daysLeft = Math.ceil(
    (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24),
  )

  return (
    <div className="card p-4 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{goal.icon}</span>
          <div>
            <p className="text-tp-white font-semibold text-sm">{goal.title}</p>
            <p className="text-tp-muted text-xs">{goal.description}</p>
          </div>
        </div>
        <span className={clsx('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full', statusConfig.bg, statusConfig.color)}>
          {statusConfig.label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-tp-soft font-mono">
            {goal.current} <span className="text-tp-muted">{goal.unit}</span>
          </span>
          <span className="text-tp-muted font-mono">
            {goal.target} {goal.unit}
          </span>
        </div>
        <div className="h-2 rounded-full bg-tp-raised overflow-hidden">
          <div
            className={clsx('h-full rounded-full transition-all duration-700', statusConfig.bar)}
            style={{ width: `${goal.progress}%` }}
          />
        </div>
        <p className="text-tp-muted text-xs mt-1">{goal.progress}% complete</p>
      </div>

      <div className="flex items-center gap-1 text-tp-muted text-xs mt-2">
        <Clock size={10} />
        <span>{daysLeft > 0 ? `${daysLeft} days remaining` : 'Deadline passed'}</span>
      </div>
    </div>
  )
}

export default function Progress() {
  const { data: goalsData, loading: goalsLoading }   = useGoals()
  const { data: assessments, loading: assessLoading } = useAssessments()
  const [activeTab, setActiveTab] = useState('goals')

  const loading = goalsLoading || assessLoading

  if (loading) {
    return <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
  }

  const earned = goalsData?.achievements?.filter((a) => a.earned) ?? []

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <p className="font-mono font-bold text-2xl text-tp-white">{goalsData?.goals?.length ?? 0}</p>
          <p className="label mt-1">Active Goals</p>
        </div>
        <div className="card p-4 text-center">
          <p className="font-mono font-bold text-2xl text-tp-white">{earned.length}</p>
          <p className="label mt-1">Achievements</p>
        </div>
        <div className="card p-4 text-center">
          <p className="font-mono font-bold text-2xl text-tp-white">
            {assessments?.filter((a) => a.status === 'completed').length ?? 0}
          </p>
          <p className="label mt-1">Assessments</p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-tp-surface p-1 rounded-xl border border-tp-border">
        {[
          { id: 'goals',        label: 'Goals'        },
          { id: 'assessments',  label: 'Assessments'  },
          { id: 'achievements', label: 'Achievements' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'flex-1 py-2 rounded-lg text-xs font-medium transition-all',
              activeTab === tab.id ? 'bg-tp-red text-white' : 'text-tp-muted hover:text-tp-white',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Goals ── */}
      {activeTab === 'goals' && (
        <div className="space-y-3 animate-fade-in">
          {goalsData?.goals?.map((goal) => <GoalCard key={goal.id} goal={goal} />)}
        </div>
      )}

      {/* ── Assessments ── */}
      {activeTab === 'assessments' && (
        <div className="space-y-3 animate-fade-in">
          {assessments?.map((a) => (
            <div key={a.id} className={clsx(
              'card p-4',
              a.status === 'scheduled' && 'border-tp-amber/25 bg-tp-amber/5',
            )}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={clsx(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                    a.status === 'completed' ? 'bg-tp-red/15' : 'bg-tp-amber/15',
                  )}>
                    {a.status === 'completed'
                      ? <CheckCircle2 size={16} className="text-tp-red" />
                      : <Calendar     size={16} className="text-tp-amber" />}
                  </div>
                  <div>
                    <p className="text-tp-white font-medium text-sm">{a.type}</p>
                    <p className="text-tp-muted text-xs">
                      {new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {' · '}{a.trainer}
                    </p>
                    {a.highlights && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {a.highlights.map((h, i) => (
                          <span key={i} className="text-[10px] bg-tp-raised border border-tp-border text-tp-soft px-2 py-0.5 rounded-full">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                    {a.notes && <p className="text-tp-muted text-xs mt-1 italic">{a.notes}</p>}
                  </div>
                </div>
                {a.composite != null && (
                  <div className="text-right flex-shrink-0">
                    <p className="font-mono font-bold text-tp-white text-xl">{a.composite}</p>
                    <p className="text-tp-muted text-[10px]">score</p>
                  </div>
                )}
                {a.status === 'scheduled' && (
                  <span className="text-tp-amber text-xs font-bold flex-shrink-0">Scheduled</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Achievements ── */}
      {activeTab === 'achievements' && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {goalsData?.achievements?.map((a) => (
              <div
                key={a.id}
                className={clsx(
                  'card p-4 flex flex-col items-center text-center gap-2 transition-all',
                  a.earned ? 'border-tp-border-bright' : 'opacity-40 grayscale',
                )}
              >
                <span className={clsx('text-3xl', !a.earned && 'filter grayscale')}>{a.icon}</span>
                <p className="text-tp-white text-xs font-semibold">{a.title}</p>
                <p className="text-tp-muted text-[10px] leading-tight">{a.description}</p>
                {a.earned && a.date && (
                  <span className="text-[10px] text-tp-green">
                    {new Date(a.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </span>
                )}
                {!a.earned && (
                  <span className="text-[10px] text-tp-muted">Locked</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
