import { useTrainerAnalytics } from '../../hooks/useTrainerApi'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, Cell } from 'recharts'
import clsx from 'clsx'

const CustomTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-tp-card border border-tp-border-bright rounded-lg px-3 py-2 text-xs shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
      <p className="text-tp-soft mb-0.5">{label ?? payload[0].payload.dimension ?? payload[0].payload.name}</p>
      <p className="text-tp-white font-mono font-bold">{payload[0].value}</p>
    </div>
  )
}

const TIER_COLORS = { Bronze: '#cd7f32', Silver: '#c0c0c0', Gold: '#ffd700', Elite: '#b347ea' }

export default function TrainerAnalytics() {
  const { data, loading } = useTrainerAnalytics()

  if (loading || !data) return <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-48 rounded-xl" />)}</div>

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Roster Avg Score',    value: data.rosterAverageScore,    color: 'text-tp-white' },
          { label: 'Avg Adherence',       value: `${data.rosterAverageAdherence}%`, color: 'text-tp-green' },
          { label: 'Assessments Due',     value: data.assessmentsDueThisWeek, color: data.assessmentsDueThisWeek > 0 ? 'text-tp-amber' : 'text-tp-green' },
          { label: 'Needs Attention',     value: data.membersNeedingAttention, color: data.membersNeedingAttention > 0 ? 'text-tp-danger' : 'text-tp-green' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <p className={clsx('font-mono font-bold text-2xl', color)}>{value}</p>
            <p className="label mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Score trend ── */}
      <div className="card p-5">
        <h3 className="text-tp-white font-semibold mb-4">Roster Average Score — 7-Month Trend</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.averageScoreHistory} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#e63946" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e63946" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e1e1e" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[48, 68]} tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTip />} />
              <Area type="monotone" dataKey="avg" stroke="#e63946" strokeWidth={2.5} fill="url(#analyticsGrad)"
                dot={{ r: 4, fill: '#e63946', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#e63946' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Two cols: tier dist + adherence ── */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Tier distribution */}
        <div className="card p-5">
          <h3 className="text-tp-white font-semibold mb-4">Score Tier Distribution</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.scoreByTier} margin={{ top: 4, right: 4, bottom: 0, left: -25 }}>
                <CartesianGrid stroke="#1e1e1e" vertical={false} />
                <XAxis dataKey="tier" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.scoreByTier.map(entry => (
                    <Cell key={entry.tier} fill={TIER_COLORS[entry.tier] ?? '#555'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Adherence per member */}
        <div className="card p-5">
          <h3 className="text-tp-white font-semibold mb-4">Adherence by Member</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.adherenceByMember} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={50} tick={{ fill: '#a0a0a0', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTip />} />
                <Bar dataKey="adherence" radius={[0, 4, 4, 0]}>
                  {data.adherenceByMember.map(entry => (
                    <Cell key={entry.name} fill={entry.adherence >= 80 ? '#22c55e' : entry.adherence >= 60 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Dimension averages ── */}
      <div className="card p-5">
        <h3 className="text-tp-white font-semibold mb-1">Average Score by Dimension (Roster)</h3>
        <p className="text-tp-muted text-xs mb-4">Lowest dimensions = biggest programming opportunities</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.dimensionAverages} margin={{ top: 4, right: 4, bottom: 20, left: -20 }}>
              <CartesianGrid stroke="#1e1e1e" vertical={false} />
              <XAxis dataKey="dimension" tick={{ fill: '#555', fontSize: 9 }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" />
              <YAxis domain={[0, 100]} tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTip />} />
              <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                {data.dimensionAverages.map(entry => (
                  <Cell key={entry.dimension} fill={entry.avg >= 70 ? '#22c55e' : entry.avg >= 50 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Weakest flag */}
        {(() => {
          const weakest = [...data.dimensionAverages].sort((a, b) => a.avg - b.avg)[0]
          return weakest ? (
            <div className="mt-3 p-3 rounded-lg bg-tp-amber/10 border border-tp-amber/20">
              <p className="text-tp-amber text-xs font-medium">
                ⚠ Roster-wide weak point: <span className="font-bold">{weakest.dimension}</span> (avg {weakest.avg}) — consider programming this dimension more across all plans.
              </p>
            </div>
          ) : null
        })()}
      </div>
    </div>
  )
}
