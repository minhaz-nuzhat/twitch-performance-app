import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useRoster, useTrainerAnalytics } from '../../hooks/useTrainerApi'
import { AlertTriangle, ArrowUp, ArrowDown, Minus, ChevronRight, ClipboardList, Plus, BarChart2 } from 'lucide-react'
import clsx from 'clsx'
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

const TIER_COLOR = { bronze: 'text-tp-bronze', silver: 'text-tp-silver', gold: 'text-tp-gold', elite: 'text-tp-elite' }

function MemberRow({ member }) {
  const TrendIcon = member.trend === 'up' ? ArrowUp : member.trend === 'down' ? ArrowDown : Minus
  const trendColor = member.trend === 'up' ? 'text-tp-green' : member.trend === 'down' ? 'text-tp-danger' : 'text-tp-muted'
  const hasAlert   = member.assessmentDue || member.fatigueScore === 'high' || member.trend === 'down'

  return (
    <Link to={`/trainer/roster/${member.id}`}
      className={clsx('card px-4 py-3 flex items-center gap-3 hover:border-tp-border-bright transition-all group',
        hasAlert && 'border-tp-danger/20 bg-tp-danger/3')}
    >
      <div className="w-9 h-9 rounded-full bg-tp-raised border border-tp-border flex items-center justify-center flex-shrink-0">
        <span className="text-tp-soft text-xs font-bold">{member.avatarInitials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-tp-white text-sm font-medium truncate">{member.name}</p>
          {member.assessmentDue && <span className="bg-tp-amber/15 text-tp-amber text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Due</span>}
          {member.fatigueScore === 'high' && <span className="bg-tp-danger/15 text-tp-danger text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">High Load</span>}
        </div>
        <p className="text-tp-muted text-xs">{member.sport} · {member.adherence}% adherence</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right">
          <p className={clsx('font-mono font-bold text-base', TIER_COLOR[member.tier])}>{member.score}</p>
          <div className={clsx('flex items-center gap-0.5 justify-end text-xs', trendColor)}>
            <TrendIcon size={10} />
            <span>{member.trendVal !== 0 ? Math.abs(member.trendVal) : '—'}</span>
          </div>
        </div>
        <ChevronRight size={14} className="text-tp-muted group-hover:text-tp-red transition-colors" />
      </div>
    </Link>
  )
}

const SparkTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-tp-card border border-tp-border-bright rounded px-2 py-1 text-xs text-tp-white">
      {payload[0].payload.label}: <span className="font-mono font-bold">{payload[0].value}</span>
    </div>
  )
}

export default function TrainerDashboard() {
  const { user }            = useAuth()
  const { data: roster }    = useRoster()
  const { data: analytics } = useTrainerAnalytics()

  const alerts  = roster?.filter(m => m.assessmentDue || m.fatigueScore === 'high' || m.trend === 'down') ?? []
  const topPerf = roster ? [...roster].sort((a, b) => b.score - a.score).slice(0, 2) : []

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Greeting ── */}
      <div>
        <h2 className="text-tp-white text-xl font-semibold">
          {(() => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening' })()}, {user?.name?.split(' ').slice(1).join(' ') || user?.name}
        </h2>
        <p className="text-tp-soft text-sm mt-0.5">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* ── Stat pills ── */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Members',      value: analytics.totalMembers,         color: 'text-tp-white' },
            { label: 'Avg Score',          value: analytics.rosterAverageScore,   color: 'text-tp-white' },
            { label: 'Avg Adherence',      value: `${analytics.rosterAverageAdherence}%`, color: 'text-tp-green' },
            { label: 'Need Attention',     value: alerts.length,                  color: alerts.length > 0 ? 'text-tp-danger' : 'text-tp-green' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-4 text-center">
              <p className={clsx('font-mono font-bold text-2xl', color)}>{value}</p>
              <p className="label mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Score trend ── */}
      {analytics && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-tp-white font-semibold text-sm">Roster Average Score</h3>
            <Link to="/trainer/analytics" className="text-tp-red text-xs hover:text-tp-red-bright flex items-center gap-1">
              Full analytics <ChevronRight size={12} />
            </Link>
          </div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.averageScoreHistory} margin={{ top: 4, right: 4, bottom: 0, left: -30 }}>
                <defs>
                  <linearGradient id="trainerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#e63946" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#e63946" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<SparkTip />} />
                <Area type="monotone" dataKey="avg" stroke="#e63946" strokeWidth={2} fill="url(#trainerGrad)"
                  dot={{ r: 3, fill: '#e63946', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Two columns: Alerts + Top performers ── */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Alerts */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-tp-white font-semibold text-sm flex items-center gap-2">
              <AlertTriangle size={14} className="text-tp-danger" />
              Needs Attention
            </h3>
            <Link to="/trainer/roster" className="text-tp-red text-xs">View all</Link>
          </div>
          <div className="space-y-2">
            {alerts.length === 0 && <p className="text-tp-muted text-sm px-1">All members are on track.</p>}
            {alerts.map(m => <MemberRow key={m.id} member={m} />)}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="text-tp-white font-semibold text-sm mb-2">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { to: '/trainer/assessments/new', icon: ClipboardList, label: 'New Assessment',    sub: 'Enter results for a member' },
              { to: '/trainer/programs/new',    icon: Plus,           label: 'Build a Program',   sub: 'Phases, weeks, exercises'   },
              { to: '/trainer/roster',          icon: BarChart2,      label: 'View Full Roster',  sub: `${roster?.length ?? 0} members` },
            ].map(({ to, icon: Icon, label, sub }) => (
              <Link key={to} to={to}
                className="card px-4 py-3 flex items-center gap-3 hover:border-tp-border-bright transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-tp-red/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-tp-red" />
                </div>
                <div className="flex-1">
                  <p className="text-tp-white text-sm font-medium">{label}</p>
                  <p className="text-tp-muted text-xs">{sub}</p>
                </div>
                <ChevronRight size={14} className="text-tp-muted group-hover:text-tp-red transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── All members ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-tp-white font-semibold text-sm">All Members</h3>
          <Link to="/trainer/roster" className="text-tp-red text-xs">Filters & sort</Link>
        </div>
        <div className="space-y-2">
          {roster?.map(m => <MemberRow key={m.id} member={m} />)}
        </div>
      </div>
    </div>
  )
}
