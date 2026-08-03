import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRoster } from '../../hooks/useTrainerApi'
import { ArrowUp, ArrowDown, Minus, ChevronRight, Search } from 'lucide-react'
import clsx from 'clsx'

const TIER_COLOR = { bronze: 'text-tp-bronze', silver: 'text-tp-silver', gold: 'text-tp-gold', elite: 'text-tp-elite' }
const TIER_BG    = { bronze: 'bg-tp-bronze/10', silver: 'bg-tp-silver/10', gold: 'bg-tp-gold/10', elite: 'bg-tp-elite/10' }

const FATIGUE_CONFIG = {
  low:      { color: 'text-tp-green',  label: 'Low'      },
  moderate: { color: 'text-tp-amber',  label: 'Moderate' },
  high:     { color: 'text-tp-danger', label: 'High'     },
}

export default function Roster() {
  const { data: roster, loading } = useRoster()
  const [search, setSearch]       = useState('')
  const [filter, setFilter]       = useState('all')  // all | alerts | gold | silver | bronze
  const [sort,   setSort]         = useState('score') // score | adherence | name | lastActive

  if (loading) return <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>

  const filtered = (roster ?? [])
    .filter(m => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                          m.sport.toLowerCase().includes(search.toLowerCase())
      const matchFilter =
        filter === 'all'    ? true :
        filter === 'alerts' ? (m.assessmentDue || m.fatigueScore === 'high' || m.trend === 'down') :
        m.tier === filter
      return matchSearch && matchFilter
    })
    .sort((a, b) => {
      if (sort === 'score')      return b.score - a.score
      if (sort === 'adherence')  return b.adherence - a.adherence
      if (sort === 'name')       return a.name.localeCompare(b.name)
      if (sort === 'lastActive') return new Date(b.lastActive) - new Date(a.lastActive)
      return 0
    })

  const alertCount = roster?.filter(m => m.assessmentDue || m.fatigueScore === 'high' || m.trend === 'down').length ?? 0

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── Search & filters ── */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-tp-muted" />
          <input
            className="input pl-9"
            placeholder="Search by name or sport…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'all',    label: 'All',    count: roster?.length },
            { id: 'alerts', label: 'Alerts', count: alertCount, danger: true },
            { id: 'gold',   label: 'Gold'   },
            { id: 'silver', label: 'Silver' },
            { id: 'bronze', label: 'Bronze' },
          ].map(({ id, label, count, danger }) => (
            <button key={id} onClick={() => setFilter(id)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                filter === id
                  ? (danger ? 'bg-tp-danger/15 text-tp-danger border-tp-danger/30' : 'bg-tp-red/10 text-tp-red border-tp-red/25')
                  : 'bg-tp-card text-tp-muted border-tp-border hover:text-tp-white',
              )}
            >
              {label}{count != null && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-tp-muted text-xs">Sort:</span>
          {[
            { id: 'score', label: 'Score' }, { id: 'adherence', label: 'Adherence' },
            { id: 'name',  label: 'Name'  }, { id: 'lastActive', label: 'Last Active' },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => setSort(id)}
              className={clsx('px-2 py-1 rounded text-xs transition-all',
                sort === id ? 'text-tp-white font-medium' : 'text-tp-muted hover:text-tp-soft')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Member cards ── */}
      <div className="space-y-2">
        {filtered.length === 0 && <p className="text-tp-muted text-sm text-center py-8">No members match your filters.</p>}
        {filtered.map((m, i) => {
          const TrendIcon  = m.trend === 'up' ? ArrowUp : m.trend === 'down' ? ArrowDown : Minus
          const trendColor = m.trend === 'up' ? 'text-tp-green' : m.trend === 'down' ? 'text-tp-danger' : 'text-tp-muted'
          const fat        = FATIGUE_CONFIG[m.fatigueScore] ?? FATIGUE_CONFIG.low
          const hasAlert   = m.assessmentDue || m.fatigueScore === 'high' || m.trend === 'down'

          return (
            <Link to={`/trainer/roster/${m.id}`} key={m.id}
              className={clsx(
                'card px-4 py-4 flex items-center gap-4 hover:border-tp-border-bright transition-all group animate-fade-up opacity-0',
                hasAlert && 'border-tp-danger/20 bg-tp-danger/3',
              )}
              style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'forwards' }}
            >
              {/* Avatar */}
              <div className={clsx('w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0', TIER_BG[m.tier], 'border-tp-border')}>
                <span className={clsx('text-xs font-bold', TIER_COLOR[m.tier])}>{m.avatarInitials}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-tp-white text-sm font-semibold">{m.name}</p>
                  {m.assessmentDue && <span className="bg-tp-amber/15 text-tp-amber text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Assessment Due</span>}
                  {m.planStatus === 'expiring' && <span className="bg-tp-danger/15 text-tp-danger text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Plan Expiring</span>}
                </div>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="text-tp-muted text-xs">{m.sport} · Age {m.age}</span>
                  <span className={clsx('text-xs font-medium', fat.color)}>Fatigue: {fat.label}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="text-center hidden sm:block">
                  <p className="text-tp-muted text-[10px] uppercase tracking-wider mb-0.5">Adherence</p>
                  <p className={clsx('font-mono font-bold text-sm', m.adherence >= 80 ? 'text-tp-green' : m.adherence >= 60 ? 'text-tp-amber' : 'text-tp-danger')}>
                    {m.adherence}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-tp-muted text-[10px] uppercase tracking-wider mb-0.5">Score</p>
                  <p className={clsx('font-mono font-bold text-lg', TIER_COLOR[m.tier])}>{m.score}</p>
                  <div className={clsx('flex items-center justify-center gap-0.5 text-[10px]', trendColor)}>
                    <TrendIcon size={9} />
                    <span>{m.trendVal !== 0 ? Math.abs(m.trendVal) : '—'}</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-tp-muted group-hover:text-tp-red transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
