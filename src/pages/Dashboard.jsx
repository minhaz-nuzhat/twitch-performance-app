import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePerformance, useTraining, useNutrition, useNotifications } from '../hooks/useApi'
import ScoreRing from '../components/ui/ScoreRing'
import TierBadge from '../components/ui/TierBadge'
import InsightCard from '../components/ui/InsightCard'
import { ChevronRight, Flame, Clock, CheckCircle2, ArrowUp, ArrowDown } from 'lucide-react'
import clsx from 'clsx'
import {
  LineChart, Line, ResponsiveContainer, Tooltip as ReTooltip,
} from 'recharts'

function greeting(name) {
  const h = new Date().getHours()
  const salutation = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  return `${salutation}, ${name?.split(' ')[0]}`
}

function StatPill({ label, value, sub, color = 'text-tp-white' }) {
  return (
    <div className="card px-4 py-3 flex flex-col gap-0.5">
      <span className="label">{label}</span>
      <span className={clsx('font-mono font-bold text-xl leading-none', color)}>{value}</span>
      {sub && <span className="text-tp-muted text-[10px]">{sub}</span>}
    </div>
  )
}

const SparkTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-tp-elevated border border-tp-border rounded px-2 py-1 text-xs text-tp-white">
      {payload[0].payload.label}: <span className="font-mono font-bold">{payload[0].value}</span>
    </div>
  )
}

export default function Dashboard() {
  const { user }            = useAuth()
  const { data: perf }      = usePerformance()
  const { data: training }  = useTraining()
  const { data: nutrition } = useNutrition()
  const { data: notifs }    = useNotifications()

  const unread = notifs?.filter((n) => !n.read) ?? []

  if (!perf) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  const fatigueColor = {
    low:      'text-tp-green',
    moderate: 'text-tp-amber',
    high:     'text-tp-danger',
    critical: 'text-tp-danger',
  }[perf.derived.fatigueScore] ?? 'text-tp-soft'

  const trendUp = perf.trend === 'up'

  // Nutrition summary
  const calPercent = nutrition
    ? Math.round((nutrition.todayLog.calories / nutrition.targets.calories) * 100)
    : 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Greeting ── */}
      <div>
        <h2 className="text-tp-white text-xl font-semibold">{greeting(user?.name)}</h2>
        <p className="text-tp-soft text-sm mt-0.5">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* ── Hero: Score + Stats ── */}
      <div className="card p-6 border-red-glow">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Score ring */}
          <Link to="/performance" className="flex flex-col items-center gap-3 group">
            <ScoreRing score={perf.composite} tier={perf.tier} size={160} />
            <TierBadge tier={perf.tier} />
            <span className="text-tp-muted text-xs group-hover:text-tp-red transition-colors flex items-center gap-1">
              View breakdown <ChevronRight size={12} />
            </span>
          </Link>

          {/* Right stats */}
          <div className="flex-1 w-full space-y-4">
            {/* Trend */}
            <div className="flex items-center gap-2">
              {trendUp
                ? <ArrowUp size={16} className="text-tp-green" />
                : <ArrowDown size={16} className="text-tp-danger" />}
              <span className={clsx('text-sm font-medium', trendUp ? 'text-tp-green' : 'text-tp-danger')}>
                {trendUp ? '+' : ''}{perf.trendValue} pts since last assessment
              </span>
            </div>

            {/* Progress to next tier */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="label">To {perf.nextTierName}</span>
                <span className="text-tp-muted text-xs">{perf.nextTierTarget - perf.composite} pts away</span>
              </div>
              <div className="h-2 rounded-full bg-tp-raised overflow-hidden">
                <div
                  className="h-full rounded-full bg-tp-red transition-all duration-700"
                  style={{ width: `${(perf.composite / perf.nextTierTarget) * 100}%` }}
                />
              </div>
            </div>

            {/* Score sparkline */}
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={perf.history}>
                  <ReTooltip content={<SparkTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="composite"
                    stroke="#e63946"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#e63946' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Pills ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatPill
          label="Athletic Age"
          value={perf.derived.athleticAge}
          sub={`Bio age: ${user?.age ?? '—'}`}
          color="text-tp-white"
        />
        <StatPill
          label="Fatigue"
          value={perf.derived.fatigueScore.charAt(0).toUpperCase() + perf.derived.fatigueScore.slice(1)}
          sub={`ACWR ${perf.derived.fatigueRatio}`}
          color={fatigueColor}
        />
        <StatPill
          label="Streak"
          value={`${perf.derived.streak}🔥`}
          sub="consecutive sessions"
          color="text-tp-amber"
        />
        <StatPill
          label="Last Assessment"
          value={new Date(perf.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          sub={`${perf.composite} pts scored`}
          color="text-tp-soft"
        />
      </div>

      {/* ── AI Insight ── */}
      <InsightCard insight={perf.insightCard} />

      {/* ── Cards row: Today's Session + Nutrition + Top Goal ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Today's Session */}
        {training && (
          <Link to="/training" className="card p-4 hover:border-tp-border-bright transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="label">Today's Session</span>
              <ChevronRight size={14} className="text-tp-muted group-hover:text-tp-red transition-colors" />
            </div>
            <p className="text-tp-white font-semibold text-sm">{training.todaySession.name}</p>
            <p className="text-tp-soft text-xs mt-0.5">{training.phase} · Week {training.week}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="flex items-center gap-1 text-tp-muted text-xs">
                <Clock size={11} />
                {training.todaySession.estimatedDuration} min
              </span>
              <span className="flex items-center gap-1 text-tp-muted text-xs">
                <CheckCircle2 size={11} />
                {training.todaySession.exercises.length} exercises
              </span>
            </div>
            {/* Exercise progress mini */}
            <div className="mt-3 space-y-1">
              {training.todaySession.exercises.slice(0, 3).map((ex) => (
                <div key={ex.id} className="flex items-center gap-2">
                  <div className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0',
                    ex.completed ? 'bg-tp-green' : 'bg-tp-border')} />
                  <span className="text-tp-soft text-xs truncate">{ex.name}</span>
                </div>
              ))}
              {training.todaySession.exercises.length > 3 && (
                <p className="text-tp-muted text-xs pl-3.5">
                  +{training.todaySession.exercises.length - 3} more
                </p>
              )}
            </div>
          </Link>
        )}

        {/* Nutrition Snapshot */}
        {nutrition && (
          <Link to="/nutrition" className="card p-4 hover:border-tp-border-bright transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="label">Nutrition Today</span>
              <ChevronRight size={14} className="text-tp-muted group-hover:text-tp-red transition-colors" />
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="font-mono font-bold text-2xl text-tp-white">{nutrition.todayLog.calories}</span>
              <span className="text-tp-muted text-xs mb-1">/ {nutrition.targets.calories} kcal</span>
            </div>
            <div className="h-1.5 rounded-full bg-tp-raised overflow-hidden mb-3">
              <div
                className={clsx('h-full rounded-full transition-all', calPercent > 100 ? 'bg-tp-danger' : 'bg-tp-red')}
                style={{ width: `${Math.min(calPercent, 100)}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Protein', val: nutrition.todayLog.protein, target: nutrition.targets.protein, color: '#e63946' },
                { label: 'Carbs',   val: nutrition.todayLog.carbs,   target: nutrition.targets.carbs,   color: '#f59e0b' },
                { label: 'Fat',     val: nutrition.todayLog.fat,     target: nutrition.targets.fat,     color: '#22c55e' },
              ].map(({ label, val, target, color }) => (
                <div key={label} className="text-center">
                  <p className="font-mono text-xs font-bold text-tp-white">{val}g</p>
                  <p className="text-tp-muted text-[10px]">{label}</p>
                  <div className="h-0.5 rounded-full bg-tp-raised mt-1 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min((val/target)*100, 100)}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </Link>
        )}

        {/* Notifications / Recent alerts */}
        <Link to="/profile" className="card p-4 hover:border-tp-border-bright transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="label">Alerts</span>
            {unread.length > 0 && (
              <span className="bg-tp-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unread.length}
              </span>
            )}
          </div>
          <div className="space-y-2">
            {(unread.length ? unread : notifs ?? []).slice(0, 3).map((n) => (
              <div key={n.id} className="flex items-start gap-2">
                <div className={clsx('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0',
                  !n.read ? 'bg-tp-red' : 'bg-tp-border')} />
                <div>
                  <p className="text-tp-white text-xs font-medium leading-tight">{n.title}</p>
                  <p className="text-tp-muted text-[10px]">{n.time}</p>
                </div>
              </div>
            ))}
            {!notifs?.length && (
              <p className="text-tp-muted text-xs">All caught up</p>
            )}
          </div>
        </Link>
      </div>
    </div>
  )
}
