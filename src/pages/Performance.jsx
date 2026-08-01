import { usePerformance } from '../hooks/useApi'
import ScoreRing from '../components/ui/ScoreRing'
import TierBadge from '../components/ui/TierBadge'
import DimensionCard from '../components/ui/DimensionCard'
import RadarChartWidget from '../components/ui/RadarChartWidget'
import InsightCard from '../components/ui/InsightCard'
import { Brain, Activity, Zap } from 'lucide-react'
import clsx from 'clsx'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'

const HistoryTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-tp-elevated border border-tp-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-tp-soft mb-0.5">{label}</p>
      <p className="text-tp-white font-mono font-bold">{payload[0].value} pts</p>
    </div>
  )
}

export default function Performance() {
  const { data: perf, loading } = usePerformance()

  if (loading || !perf) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
      </div>
    )
  }

  const dims = Object.values(perf.dimensions)

  const fatigueConfig = {
    low:      { label: 'Low',      color: 'text-tp-green',  bg: 'bg-tp-green/10',  border: 'border-tp-green/20'  },
    moderate: { label: 'Moderate', color: 'text-tp-amber',  bg: 'bg-tp-amber/10',  border: 'border-tp-amber/20'  },
    high:     { label: 'High',     color: 'text-tp-danger', bg: 'bg-tp-danger/10', border: 'border-tp-danger/20' },
    critical: { label: 'Critical', color: 'text-tp-danger', bg: 'bg-tp-danger/10', border: 'border-tp-danger/20' },
  }[perf.derived.fatigueScore] ?? {}

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Header: Score + Radar ── */}
      <div className="card p-6 border-red-glow">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Score */}
          <div className="flex flex-col items-center gap-4 flex-shrink-0">
            <ScoreRing score={perf.composite} tier={perf.tier} size={180} />
            <TierBadge tier={perf.tier} showRange />
            <div className="text-center">
              <p className="text-tp-soft text-xs">Last updated</p>
              <p className="text-tp-white text-sm font-medium">
                {new Date(perf.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Radar */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-tp-white font-semibold text-sm">Performance Radar</h3>
              <span className="text-tp-muted text-xs">vs. previous assessment</span>
            </div>
            <RadarChartWidget data={perf.radarData} />
          </div>
        </div>
      </div>

      {/* ── Derived Contextual Metrics ── */}
      <div>
        <h3 className="text-tp-white font-semibold mb-3 flex items-center gap-2">
          <Brain size={16} className="text-tp-red" />
          Contextual Metrics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Athletic Age */}
          <div className="card p-5">
            <span className="label block mb-2">Athletic Age</span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono font-bold text-4xl text-tp-white">{perf.derived.athleticAge}</span>
              <span className="text-tp-soft text-sm">yrs</span>
            </div>
            <p className="text-tp-muted text-xs mt-2 leading-relaxed">
              Your performance profile matches a {perf.derived.athleticAge}-year-old athlete's benchmark population — regardless of biological age.
            </p>
          </div>

          {/* Fatigue Score */}
          <div className={clsx('card p-5 border', fatigueConfig.border)}>
            <span className="label block mb-2">Fatigue Score</span>
            <div className="flex items-baseline gap-2">
              <span className={clsx('font-bold text-2xl', fatigueConfig.color)}>
                {fatigueConfig.label}
              </span>
            </div>
            <p className="text-tp-muted text-xs mt-2">
              ACWR: <span className="text-tp-white font-mono">{perf.derived.fatigueRatio}</span>
            </p>
            <p className="text-tp-muted text-xs leading-relaxed mt-1">
              {perf.derived.fatigueRatio < 1.3
                ? 'Training load is within safe range.'
                : 'Load is elevated — prioritise recovery this week.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── AI Insight ── */}
      <div>
        <h3 className="text-tp-white font-semibold mb-3 flex items-center gap-2">
          <Zap size={16} className="text-tp-red" />
          AI Insight
        </h3>
        <InsightCard insight={perf.insightCard} />
      </div>

      {/* ── All Dimensions ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-tp-white font-semibold flex items-center gap-2">
            <Activity size={16} className="text-tp-red" />
            All Dimensions
          </h3>
          <span className="text-tp-muted text-xs">Tap any card for detail</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {dims.map((dim, i) => (
            <DimensionCard key={dim.label} dimension={dim} delay={i * 40} />
          ))}
        </div>
      </div>

      {/* ── Score History ── */}
      <div>
        <h3 className="text-tp-white font-semibold mb-4">Score History</h3>
        <div className="card p-4">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={perf.history} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#e63946" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e63946" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e1e1e" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#555555', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[45, 75]}
                  tick={{ fill: '#555555', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<HistoryTooltip />} />
                <Area
                  type="monotone"
                  dataKey="composite"
                  stroke="#e63946"
                  strokeWidth={2.5}
                  fill="url(#scoreGrad)"
                  dot={{ r: 4, fill: '#e63946', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#e63946', stroke: '#ff4757', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
