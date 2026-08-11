import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePerformance, useTraining } from '../hooks/useApi'
import { mockLeaderboard } from '../data/mockData'
import ScoreRing from '../components/ui/ScoreRing'
import TierBadge from '../components/ui/TierBadge'
import DimensionCard from '../components/ui/DimensionCard'
import RadarChartWidget from '../components/ui/RadarChartWidget'
import InsightCard from '../components/ui/InsightCard'
import { InfoTooltip } from '../components/ui/InfoTooltip'
import { DASHBOARD_TOOLTIPS } from '../data/scienceTooltips'
import { ChevronRight, ChevronDown, Trophy, AlertTriangle, Clock, Dumbbell, TrendingUp, X, Brain, Activity, Zap } from 'lucide-react'
import clsx from 'clsx'
import { useState } from 'react'
import {
  LineChart, Line, ResponsiveContainer, Tooltip as ReTooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts'

// ── Leaderboard Modal ────────────────────────────────────────
function LeaderboardModal({ isOpen, onClose }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg bg-tp-card border border-tp-border rounded-2xl shadow-2xl animate-fade-up max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-tp-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-tp-gold" />
            <h2 className="text-tp-white font-bold text-base">Member Leaderboard</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-tp-raised flex items-center justify-center text-tp-muted hover:text-tp-white transition-colors">
            <X size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          <p className="text-tp-muted text-xs leading-relaxed">{mockLeaderboard.description}</p>
          <p className="text-tp-soft text-sm font-medium">Your current rank: <span className="text-tp-red font-bold">#{mockLeaderboard.yourRank}</span></p>
          <div className="space-y-2 mt-4">
            {mockLeaderboard.members.map(member => (
              <div key={member.rank} className={clsx('flex items-center justify-between p-4 rounded-xl transition-all', member.isCurrentUser ? 'bg-tp-red/10 border border-tp-red/30' : 'bg-tp-raised border border-tp-border')}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={clsx('text-sm font-bold', member.rank === 1 ? 'text-tp-gold' : 'text-tp-amber')}>#{member.rank}</span>
                    <p className={clsx('font-semibold text-sm', member.isCurrentUser ? 'text-tp-red' : 'text-tp-white')}>{member.name}</p>
                  </div>
                  <p className="text-tp-muted text-xs">{member.program}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-tp-white text-sm">{member.score}</p>
                  <p className={clsx('text-xs font-medium', member.trend.startsWith('+') ? 'text-tp-green' : member.trend === '+0' ? 'text-tp-muted' : 'text-tp-danger')}>{member.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

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
          <div className="flex items-center gap-1.5 mb-2">
            <p className="label">Readiness Score</p>
            <InfoTooltip text={DASHBOARD_TOOLTIPS.compositeScore} position="below" /></div>
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
        <div className="flex items-center gap-1.5">
          <p className="label">Strength Index</p>
          <InfoTooltip text={DASHBOARD_TOOLTIPS.strengthIndex} />
        </div>
        <Link to="/assessment" className="text-tp-muted text-xs hover:text-tp-red transition-colors">View testing</Link>
      </div>
      <p className="font-mono font-bold text-4xl text-tp-white mb-1">{s.score}</p>
      <p className="text-tp-soft text-xs leading-relaxed mb-2">{s.description}</p>
      <p className={clsx('text-xs font-medium flex items-center gap-1', s.change >= 0 ? 'text-tp-green' : 'text-tp-danger')}>
        {s.change >= 0 ? '+' : ''}{s.change} vs last assessment
      </p>
    </div>
  )
}

function LeaderboardCard({ perf, onOpen }) {
  const { leaderboard: lb } = perf
  return (
    <button onClick={onOpen} className="card p-4 flex flex-col hover:border-tp-border-bright transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy size={14} className="text-tp-gold" />
          <p className="label">Leaderboard</p>
        </div>
        <ChevronRight size={14} className="text-tp-muted group-hover:text-tp-red transition-colors" />
      </div>
      <p className="font-mono font-bold text-4xl text-tp-white mb-1">#{lb.rank}</p>
      <p className="text-tp-soft text-xs">Out of {lb.total} members</p>
    </button>
  )
}

function PriorityFocusCard({ perf }) {
  const { priorityFocus: pf } = perf
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <p className="label">Priority Focus</p>
          <InfoTooltip text={DASHBOARD_TOOLTIPS.priorityFocus} />
        </div>
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
        <div className="flex items-center gap-1.5">
          <p className="label">Recovery Risk</p>
          <InfoTooltip text={DASHBOARD_TOOLTIPS.recoveryRisk} />
        </div>
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
        <div className="flex items-center gap-1.5">
          <p className="label">Session Adherence</p>
          <InfoTooltip text={DASHBOARD_TOOLTIPS.sessionAdherence} />
        </div>
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

const HistoryTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-tp-elevated border border-tp-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-tp-soft mb-0.5">{label}</p>
      <p className="text-tp-white font-mono font-bold">{payload[0].value} pts</p>
    </div>
  )
}

function ScienceAccordion({ perf }) {
  const [open, setOpen] = useState(false)
  const dims = Object.values(perf.dimensions)

  const fatigueConfig = {
    low:      { label: 'Low',      color: 'text-tp-green',  bg: 'bg-tp-green/10',  border: 'border-tp-green/20'  },
    moderate: { label: 'Moderate', color: 'text-tp-amber',  bg: 'bg-tp-amber/10',  border: 'border-tp-amber/20'  },
    high:     { label: 'High',     color: 'text-tp-danger', bg: 'bg-tp-danger/10', border: 'border-tp-danger/20' },
    critical: { label: 'Critical', color: 'text-tp-danger', bg: 'bg-tp-danger/10', border: 'border-tp-danger/20' },
  }[perf.derived.fatigueScore] ?? {}

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-tp-raised/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Brain size={15} className="text-tp-red" />
          <span className="text-tp-white font-semibold text-sm">Science, Data &amp; Insights</span>
        </div>
        <ChevronDown
          size={16}
          className={clsx('text-tp-muted transition-transform duration-300', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="px-5 pb-6 space-y-6 border-t border-tp-border pt-5 animate-fade-in">

          {/* Score + Radar */}
          <div className="card p-5 border-red-glow">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <ScoreRing score={perf.composite} tier={perf.tier} size={140} stroke={12} />
                <TierBadge tier={perf.tier} showRange />
                <p className="text-tp-muted text-[10px] text-center">
                  Updated {new Date(perf.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-tp-white font-semibold text-sm">Performance Radar</h3>
                  <span className="text-tp-muted text-xs">vs. previous assessment</span>
                </div>
                <RadarChartWidget data={perf.radarData} />
              </div>
            </div>
          </div>

          {/* Contextual Metrics */}
          <div>
            <h3 className="text-tp-white font-semibold mb-3 flex items-center gap-2 text-sm">
              <Brain size={14} className="text-tp-red" />
              Contextual Metrics
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-4">
                <span className="label block mb-1">Athletic Age</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono font-bold text-3xl text-tp-white">{perf.derived.athleticAge}</span>
                  <span className="text-tp-soft text-xs">yrs</span>
                </div>
                <p className="text-tp-muted text-[10px] mt-1.5 leading-relaxed">
                  Performance profile matches a {perf.derived.athleticAge}-yr-old athlete's benchmark population.
                </p>
              </div>
              <div className={clsx('card p-4 border', fatigueConfig.border)}>
                <span className="label block mb-1">Fatigue Score</span>
                <span className={clsx('font-bold text-xl', fatigueConfig.color)}>{fatigueConfig.label}</span>
                <p className="text-tp-muted text-[10px] mt-1">
                  ACWR: <span className="text-tp-white font-mono">{perf.derived.fatigueRatio}</span>
                </p>
                <p className="text-tp-muted text-[10px] leading-relaxed mt-1">
                  {perf.derived.fatigueRatio < 1.3 ? 'Training load is within safe range.' : 'Load is elevated — prioritise recovery.'}
                </p>
              </div>
            </div>
          </div>

          {/* AI Insight */}
          <div>
            <h3 className="text-tp-white font-semibold mb-3 flex items-center gap-2 text-sm">
              <Zap size={14} className="text-tp-red" />
              AI Insight
            </h3>
            <InsightCard insight={perf.insightCard} />
          </div>

          {/* All Dimensions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-tp-white font-semibold flex items-center gap-2 text-sm">
                <Activity size={14} className="text-tp-red" />
                All Dimensions
              </h3>
              <span className="text-tp-muted text-xs">Tap any card for detail</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {dims.map((dim, i) => (
                <DimensionCard key={dim.label} dimension={dim} delay={i * 40} />
              ))}
            </div>
          </div>

          {/* Score History */}
          <div>
            <h3 className="text-tp-white font-semibold mb-3 text-sm">Score History</h3>
            <div className="card p-4">
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={perf.history} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="sciGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#e63946" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#e63946" stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1e1e1e" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: '#555555', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[45, 75]} tick={{ fill: '#555555', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <ReTooltip content={<HistoryTooltip />} />
                    <Area type="monotone" dataKey="composite" stroke="#e63946" strokeWidth={2.5}
                      fill="url(#sciGrad)"
                      dot={{ r: 3, fill: '#e63946', strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: '#e63946', stroke: '#ff4757', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { user }           = useAuth()
  const { data: perf }     = usePerformance()
  const { data: training } = useTraining()
  const [showLeaderboard, setShowLeaderboard] = useState(false)

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
        <LeaderboardCard perf={perf} onOpen={() => setShowLeaderboard(true)} />
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

      {/* Science, Data & Insights Accordion */}
      <ScienceAccordion perf={perf} />

      {/* Leaderboard Modal */}
      <LeaderboardModal isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
    </div>
  )
}
