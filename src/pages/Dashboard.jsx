import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePerformance, useTraining } from '../hooks/useApi'
import ScoreRing from '../components/ui/ScoreRing'
import { ChevronRight, Trophy, AlertTriangle, Clock, Dumbbell, TrendingUp } from 'lucide-react'
import clsx from 'clsx'
import {
  LineChart, Line, ResponsiveContainer, Tooltip as ReTooltip,
} from 'recharts'

// ── Helpers ───────────────────────────────────────────────────

function greeting(name) {
  const h = new Date().getHours()
  const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  return `${g}, ${name?.split(' ')[0]}`
}

const TIER_BORDER = {
  bronze: 'border-tp-bronze/40',
  silver: 'border-tp-silver/30',
  gold:   'border-tp-gold/40',
  elite:  'border-tp-elite/40',
}

const TIER_TEXT = {
  bronze: 'text-tp-bronze',
  silver: 'text-tp-silver',
  gold:   'text-tp-gold',
  elite:  'text-tp-elite',
}

const SparkTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-tp-elevated border border-tp-border rounded px-2 py-1 text-xs text-tp-white">
      {payload[0].payload.day}: <span className="font-mono font-bold">{payload[0].value}</span>
    </div>
  )
}

// ── Sub-cards ─────────────────────────────────────────────────

function ReadinessHero({ perf }) {
  const { readinessRecommendation: rec, tier, composite, trendValue, last7Days, nextTierName, nextTierTarget } = perf
  const ptsAway = nextTierTarget - composite

  return (
    <div className={clsx('card p-5 border-2', TIER_BORDER[tier])}
      style={{ boxShadow: tier === 'gold' ? '0 0 40px rgba(255,215,0,0.20), inset 0 0 40px rgba(255,215,0,0.04)' : tier === 'elite' ? '0 0 40px rgba(179,71,234,0.20)' : tier === 'silver' ? '0 0 20px rgba(192,192,192,0.12)' : undefined }}>
      <div className="flex flex-col sm:flex-row items-start gap-5">
        {/* Score ring */}
        <div className="flex-shrink-0">
          <ScoreRing score={composite} tier={tier} size={130} stroke={12} />
        </div>

        {/* Centre info */}
        <div className="flex-1 min-w-0">
          <p className="label mb-2">Readiness Score</p>
          <p className={clsx('font-mono font-bold text-4xl mb-2', TIER_TEXT[tier])}>{composite}</p>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-tp-amber/15 border border-tp-amber/40 text-tp-amber text-xs font-semibold px-3 py-1 rounded-full">
              ↑ {rec.label}
            </span>
            <span className="text-tp-green text-xs font-medium flex items-center gap-1">
              <TrendingUp size={12} />
              +{trendValue} vs last assessment
            </span>
          </div>
          <p className="text-tp-soft text-xs leading-relaxed mb-1">{rec.description}</p>
          <p className="text-tp-muted text-xs">{ptsAway} points to {nextTierName} tier.</p>
        </div>

        {/* 7-day sparkline */}
        {last7Days && (
          <div className="flex-shrink-0 w-full sm:w-44">
            <p className="label mb-2">7-Day Score Trend</p>
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last7Days}>
                  <ReTooltip content={<SparkTip />} />
                  <Line type="monotone" dataKey="v" stroke="#e63946" strokeWidth={2}
                    dot={false} activeDot={{ r: 3, fill: '#e63946' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StrengthIndexCard({ perf }) {
  const { strengthIndex: s } = perf
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="label">Strength Index</p>
        <Link to="/performance" className="text-tp-muted text-xs hover:text-tp-red transition-colors">View testing</Link>
      </div>
      <p className="font-mono font-bold text-4xl text-tp-white mb-1">{s.score}</p>
      <p className="text-tp-soft text-xs leading-relaxed mb-2">{s.description}</p>
      <p className={clsx('text-xs font-medium flex items-center gap-1', s.change >= 0 ? 'text-tp-green' : 'text-tp-danger')}>
        {s.change >= 0 ? '+' : ''}{s.change} vs last assessment
      </p>
    </div>
  )
}

function LeaderboardCard({ perf }) {
  const { leaderboard: lb } = perf
  return (
    <Link to="/progress" className="card p-4 flex flex-col hover:border-tp-border-bright transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy size={14} className="text-tp-gold" />
          <p className="label">Leaderboard</p>
        </div>
        <ChevronRight size={14} className="text-tp-muted group-hover:text-tp-red transition-colors" />
      </div>
      <p className="font-mono font-bold text-4xl text-tp-white mb-1">#{lb.rank}</p>
      <p className="text-tp-soft text-xs">Out of {lb.total} members</p>
    </Link>
  )
}

function PriorityFocusCard({ perf }) {
  const { priorityFocus: pf } = perf
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="label">Priority Focus</p>
        <span className="bg-tp-danger/15 text-tp-danger border border-tp-danger/30 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
          {pf.urgency}
        </span>
      </div>
      <p className="text-tp-white font-bold text-lg mb-1">{pf.dimension}</p>
      <p className="text-tp-soft text-xs leading-relaxed mb-3">{pf.description}</p>
      <p className="text-tp-muted text-[10px]">Coach source: {pf.coachSource}</p>
    </div>
  )
}

function RecoveryRiskCard({ perf }) {
  const { recoveryRisk: rr } = perf
  const riskConfig = {
    Low:      { color: 'text-tp-green',  bg: 'bg-tp-green/15',  border: 'border-tp-green/30'  },
    Moderate: { color: 'text-tp-amber',  bg: 'bg-tp-amber/15',  border: 'border-tp-amber/30'  },
    High:     { color: 'text-tp-danger', bg: 'bg-tp-danger/15', border: 'border-tp-danger/30' },
  }[rr.label] ?? {}

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="label">Recovery Risk</p>
        <span className={clsx('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border', riskConfig.color, riskConfig.bg, riskConfig.border)}>
          {rr.label}
        </span>
      </div>
      <p className="font-mono font-bold text-xl text-tp-white mb-1">ACWR {rr.acwr}</p>
      <p className="text-tp-soft text-xs leading-relaxed mb-3">{rr.description}</p>
      <div className="flex items-start gap-1.5 bg-tp-raised rounded-lg px-2 py-1.5">
        <AlertTriangle size={11} className="text-tp-amber flex-shrink-0 mt-0.5" />
        <p className="text-tp-soft text-[11px] leading-relaxed">{rr.advisory}</p>
      </div>
    </div>
  )
}

function SessionAdherenceCard({ perf }) {
  const { adherenceWindows: aw } = perf
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="label">Session Adherence</p>
        <span className="text-tp-muted text-xs">14d / 30d</span>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {[
          { label: 'Last 14 days', data: aw.last14d },
          { label: 'Last 30 days', data: aw.last30d },
        ].map(({ label, data }) => (
          <div key={label} className="bg-tp-raised border border-tp-border rounded-xl p-3">
            <p className="text-tp-muted text-[10px] mb-1">{label}</p>
            <p className={clsx('font-mono font-bold text-2xl', data.pct >= 85 ? 'text-tp-green' : data.pct >= 70 ? 'text-tp-amber' : 'text-tp-danger')}>
              {data.pct}%
            </p>
            <p className="text-tp-muted text-[10px] mt-0.5">{data.sessions} sessions</p>
          </div>
        ))}
      </div>
      <p className="text-tp-muted text-[11px] leading-relaxed">{aw.targetText}</p>
    </div>
  )
}

function TodaysAssignmentCard({ training }) {
  if (!training) return null
  const { todaySession: s, phase, week } = training
  const completedCount = s.exercises.filter(e => e.completed).length
  const pct            = Math.round((completedCount / s.exercises.length) * 100)

  return (
    <Link to="/training" className="card p-4 flex flex-col hover:border-tp-border-bright transition-all group">
      <div className="flex items-center justify-between mb-3">
        <p className="label">Today's Assignment</p>
        <ChevronRight size={14} className="text-tp-muted group-hover:text-tp-red transition-colors" />
      </div>
      <p className="text-tp-white font-bold text-lg mb-0.5">{s.name}</p>
      <p className="text-tp-soft text-xs mb-3">{phase} · Week {week}</p>
      <div className="flex items-center gap-4 mb-3">
        <span className="flex items-center gap-1 text-tp-muted text-xs"><Clock size={12} /> {s.estimatedDuration} min</span>
        <span className="flex items-center gap-1 text-tp-muted text-xs"><Dumbbell size={12} /> {s.exercises.length} exercises</span>
      </div>
      <div className="mt-auto">
        <p className="text-tp-muted text-[10px] mb-1">{pct}% completed</p>
        <div className="h-1.5 rounded-full bg-tp-raised overflow-hidden">
          <div className={clsx('h-full rounded-full transition-all', pct === 100 ? 'bg-tp-green' : 'bg-tp-red')}
            style={{ width: `${pct || 0}%` }} />
        </div>
      </div>
    </Link>
  )
}

// ── Main page ─────────────────────────────────────────────────

export default function Dashboard() {
  const { user }           = useAuth()
  const { data: perf }     = usePerformance()
  const { data: training } = useTraining()

  if (!perf) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Greeting */}
      <div>
        <h2 className="text-tp-white text-xl font-semibold">{greeting(user?.name)}</h2>
        <p className="text-tp-soft text-sm mt-0.5">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Hero */}
      <ReadinessHero perf={perf} />

      {/* Strength Index + Leaderboard */}
      <div className="grid grid-cols-2 gap-4">
        <StrengthIndexCard perf={perf} />
        <LeaderboardCard perf={perf} />
      </div>

      {/* Priority Focus + Recovery Risk */}
      <div className="grid grid-cols-2 gap-4">
        <PriorityFocusCard perf={perf} />
        <RecoveryRiskCard perf={perf} />
      </div>

      {/* Session Adherence + Today's Assignment */}
      <div className="grid grid-cols-2 gap-4">
        <SessionAdherenceCard perf={perf} />
        <TodaysAssignmentCard training={training} />
      </div>
    </div>
  )
}
