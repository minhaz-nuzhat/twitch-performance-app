import { useState, useRef } from 'react'
import { useGoals, useAssessments } from '../hooks/useApi'
import { Trophy, Calendar, TrendingUp, CheckCircle2, Clock, Camera, ChevronLeft, ChevronRight } from 'lucide-react'
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

// ── Visuals / Photo Check-in ─────────────────────────────────

const TIPS = [
  'Use the same lighting each time',
  'Stand the same distance from camera',
  'Take photos at the same time of day',
  'Keep pose and clothing consistent',
]

function PhotoSlot({ label, file, onSelect }) {
  const inputRef = useRef(null)
  const preview = file ? URL.createObjectURL(file) : null

  return (
    <div className="card flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-tp-border">
        <span className="text-tp-white text-xs font-semibold">{label}</span>
        <span className="text-[10px] text-tp-muted font-bold uppercase tracking-wider">Required</span>
      </div>
      <div
        className="flex-1 flex flex-col items-center justify-center min-h-40 cursor-pointer select-none"
        onClick={() => inputRef.current?.click()}
      >
        {preview
          ? <img src={preview} alt={label} className="w-full h-full object-cover" style={{ minHeight: 160 }} />
          : (
            <div className="flex flex-col items-center gap-2 py-10">
              <Camera size={22} className="text-tp-muted" />
              <p className="text-tp-muted text-xs">Upload {label.toLowerCase()} photo</p>
            </div>
          )}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-tp-soft border-t border-tp-border hover:text-tp-white hover:bg-tp-raised transition-colors"
      >
        <Camera size={12} />
        Choose Photo
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
      />
    </div>
  )
}

function VisualsTab() {
  const today = new Date().toISOString().split('T')[0]
  const [checkinDate, setCheckinDate] = useState(today)
  const [front, setFront]   = useState(null)
  const [side, setSide]     = useState(null)
  const [back, setBack]     = useState(null)
  const [savedCheckins, setSavedCheckins] = useState([])
  const [compareIdx, setCompareIdx] = useState(0)

  function handleSave() {
    if (!front || !side || !back) return
    const entry = {
      id: Date.now(),
      date: checkinDate,
      front: URL.createObjectURL(front),
      side:  URL.createObjectURL(side),
      back:  URL.createObjectURL(back),
    }
    setSavedCheckins((prev) => [entry, ...prev])
    setFront(null); setSide(null); setBack(null)
    setCheckinDate(today)
    setCompareIdx(0)
  }

  const canSave = front && side && back

  const prev = savedCheckins[compareIdx + 1] ?? null
  const curr = savedCheckins[compareIdx] ?? null

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div className="card p-4">
        <h3 className="text-tp-white font-bold text-sm mb-1">Progress Photos</h3>
        <p className="text-tp-muted text-xs leading-relaxed mb-3">
          Upload one full check-in with front, side, and back photos so members and coaches can compare body changes over time.
        </p>
        <div className="flex flex-wrap gap-2">
          {TIPS.map((tip) => (
            <span key={tip} className="text-[10px] text-tp-soft bg-tp-raised border border-tp-border px-2.5 py-1 rounded-full">
              {tip}
            </span>
          ))}
        </div>
      </div>

      {/* Upload area */}
      <div className="card p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <label className="label block mb-1">Check-in Date</label>
            <input
              type="date"
              value={checkinDate}
              onChange={(e) => setCheckinDate(e.target.value)}
              className="bg-tp-raised border border-tp-border text-tp-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-tp-red/50"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={clsx(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
              canSave
                ? 'bg-tp-red text-white hover:bg-tp-red/90'
                : 'bg-tp-raised text-tp-muted cursor-not-allowed border border-tp-border',
            )}
          >
            + Save Check-in
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <PhotoSlot label="Front" file={front} onSelect={setFront} />
          <PhotoSlot label="Side"  file={side}  onSelect={setSide}  />
          <PhotoSlot label="Back"  file={back}  onSelect={setBack}  />
        </div>
      </div>

      {/* Latest Comparison */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-tp-white font-semibold text-sm">Latest Comparison</h3>
          {savedCheckins.length > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCompareIdx((i) => Math.min(i + 1, savedCheckins.length - 2))}
                disabled={compareIdx >= savedCheckins.length - 2}
                className="p-1 rounded text-tp-muted hover:text-tp-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-tp-muted text-xs">{compareIdx + 1} / {Math.max(savedCheckins.length - 1, 1)}</span>
              <button
                onClick={() => setCompareIdx((i) => Math.max(i - 1, 0))}
                disabled={compareIdx === 0}
                className="p-1 rounded text-tp-muted hover:text-tp-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
          {savedCheckins.length === 0 && (
            <span className="text-tp-muted text-xs">No saved check-ins yet.</span>
          )}
        </div>

        {curr && prev ? (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {['front', 'side', 'back'].map((view) => (
                <div key={view} className="space-y-1">
                  <p className="text-tp-muted text-[10px] text-center uppercase tracking-wider">{view}</p>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="relative">
                      <img src={prev[view]} alt={`prev ${view}`} className="w-full rounded-lg object-cover aspect-[3/4]" />
                      <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-tp-muted px-1 rounded">
                        {new Date(prev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <div className="relative">
                      <img src={curr[view]} alt={`curr ${view}`} className="w-full rounded-lg object-cover aspect-[3/4]" />
                      <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-tp-white px-1 rounded">
                        {new Date(curr.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : curr ? (
          <p className="text-tp-muted text-xs">Save a second check-in to enable comparison.</p>
        ) : (
          <p className="text-tp-muted text-xs">Save your first front, side, and back set to start comparing changes over time.</p>
        )}
      </div>

      {/* Saved check-ins */}
      <div className="card p-4">
        <h3 className="text-tp-white font-semibold text-sm mb-3">Saved Check-ins</h3>
        {savedCheckins.length === 0 ? (
          <p className="text-tp-muted text-xs">No progress photo check-ins saved yet.</p>
        ) : (
          <div className="space-y-3">
            {savedCheckins.map((ci) => (
              <div key={ci.id} className="flex items-center gap-3 py-2 border-b border-tp-border last:border-0">
                <div className="flex gap-1.5">
                  {['front', 'side', 'back'].map((v) => (
                    <img key={v} src={ci[v]} alt={v} className="w-10 h-12 rounded object-cover" />
                  ))}
                </div>
                <p className="text-tp-white text-xs font-medium">
                  {new Date(ci.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default function Progress() {
  const { data: goalsData, loading: goalsLoading }   = useGoals()
  const { data: assessments, loading: assessLoading } = useAssessments()
  const [topTab, setTopTab]     = useState('goals')
  const [activeTab, setActiveTab] = useState('goals')

  const loading = goalsLoading || assessLoading

  if (loading) {
    return <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
  }

  const earned = goalsData?.achievements?.filter((a) => a.earned) ?? []

  return (
    <div className="space-y-4 animate-fade-in">

      {/* ── Top-level tabs: Goals | Visuals ── */}
      <div className="flex gap-1 bg-tp-surface p-1 rounded-xl border border-tp-border">
        {[{ id: 'goals', label: 'Goals' }, { id: 'visuals', label: 'Visuals' }].map((t) => (
          <button
            key={t.id}
            onClick={() => setTopTab(t.id)}
            className={clsx(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
              topTab === t.id ? 'bg-tp-red text-white' : 'text-tp-muted hover:text-tp-white',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Visuals tab ── */}
      {topTab === 'visuals' && <VisualsTab />}

      {/* ── Goals tab ── */}
      {topTab === 'goals' && (
        <div className="space-y-4">

          {/* Summary Stats */}
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

          {/* Sub-tabs */}
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

          {/* Goals */}
          {activeTab === 'goals' && (
            <div className="space-y-3 animate-fade-in">
              {goalsData?.goals?.map((goal) => <GoalCard key={goal.id} goal={goal} />)}
            </div>
          )}

          {/* Assessments */}
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

          {/* Achievements */}
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
                    {!a.earned && <span className="text-[10px] text-tp-muted">Locked</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  )
}
