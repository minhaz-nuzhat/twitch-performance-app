import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useMemberDetail, useTrainerMessages } from '../../hooks/useTrainerApi'
import { ClipboardList, Dumbbell, Utensils, MessageCircle, ArrowLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import RadarChartWidget from '../../components/ui/RadarChartWidget'
import ScoreRing from '../../components/ui/ScoreRing'
import TierBadge from '../../components/ui/TierBadge'

const TIER_COLOR = { bronze: 'text-tp-bronze', silver: 'text-tp-silver', gold: 'text-tp-gold', elite: 'text-tp-elite' }

function scoreColor(s) {
  if (s >= 70) return 'text-tp-green'
  if (s >= 50) return 'text-tp-amber'
  return 'text-tp-danger'
}

export default function MemberDetail() {
  const { id }                           = useParams()
  const { data: member, loading }        = useMemberDetail(id)
  const { threadForMember, sendMessage } = useTrainerMessages(id)
  const [tab, setTab]                    = useState('overview')
  const [msgInput, setMsgInput]          = useState('')

  if (loading || !member) return <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>

  const dims   = member.scores?.dimensions ?? {}
  const radarData = [
    { dimension: 'Strength',  current: dims.relativeStrength  ?? 0, previous: Math.max(0, (dims.relativeStrength  ?? 0) - 3) },
    { dimension: 'Explosive', current: dims.explosiveScore    ?? 0, previous: Math.max(0, (dims.explosiveScore    ?? 0) - 5) },
    { dimension: 'Power',     current: dims.powerIndex        ?? 0, previous: Math.max(0, (dims.powerIndex        ?? 0) - 2) },
    { dimension: 'Cardio',    current: dims.cardiovascular    ?? 0, previous: Math.max(0, (dims.cardiovascular    ?? 0) + 2) },
    { dimension: 'Mobility',  current: dims.mobilityScore     ?? 0, previous: Math.max(0, (dims.mobilityScore     ?? 0) - 1) },
    { dimension: 'Symmetry',  current: dims.symmetryScore     ?? 0, previous: Math.max(0, (dims.symmetryScore     ?? 0) - 4) },
    { dimension: 'Body Comp', current: dims.bodyComposition   ?? 0, previous: Math.max(0, (dims.bodyComposition   ?? 0) - 2) },
    { dimension: 'Recovery',  current: dims.recoveryScore     ?? 0, previous: Math.max(0, (dims.recoveryScore     ?? 0) - 3) },
  ]

  const handleSend = () => {
    if (!msgInput.trim()) return
    sendMessage(id, msgInput.trim())
    setMsgInput('')
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── Back ── */}
      <Link to="/trainer/roster" className="flex items-center gap-1 text-tp-muted hover:text-tp-white transition-colors text-sm">
        <ArrowLeft size={14} /> Back to Roster
      </Link>

      {/* ── Member header ── */}
      <div className="card p-5 border-red-glow">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <ScoreRing score={member.scores?.composite ?? 0} tier={member.scores?.tier ?? 'bronze'} size={130} />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start mb-1">
              <h2 className="text-tp-white font-bold text-xl">{member.name}</h2>
              <TierBadge tier={member.scores?.tier ?? 'bronze'} />
            </div>
            <p className="text-tp-soft text-sm">{member.sport} · {member.position} · Age {member.age}</p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div><p className="font-mono font-bold text-tp-white text-lg">{member.adherence}%</p><p className="label">Adherence</p></div>
              <div><p className={clsx('font-mono font-bold text-lg', TIER_COLOR[member.tier])}>{member.score}</p><p className="label">Score</p></div>
              <div><p className={clsx('font-bold text-sm capitalize', member.fatigueScore === 'high' ? 'text-tp-danger' : member.fatigueScore === 'moderate' ? 'text-tp-amber' : 'text-tp-green')}>{member.fatigueScore}</p><p className="label">Fatigue</p></div>
            </div>
          </div>
        </div>
        {/* Quick actions */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {[
            { to: `/trainer/assessments/new?member=${id}`, icon: ClipboardList, label: 'New Assessment' },
            { to: `/trainer/programs/new?member=${id}`,    icon: Dumbbell,      label: 'Build Program'  },
            { to: `/trainer/nutrition/new?member=${id}`,   icon: Utensils,      label: 'Nutrition Plan' },
          ].map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} className="flex items-center gap-1.5 bg-tp-raised border border-tp-border hover:border-tp-red/40 text-tp-soft hover:text-tp-white text-xs px-3 py-1.5 rounded-lg transition-all">
              <Icon size={12} />{label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-tp-surface p-1 rounded-xl border border-tp-border">
        {['overview', 'dimensions', 'messages'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={clsx('flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all',
              tab === t ? 'bg-tp-red text-white' : 'text-tp-muted hover:text-tp-white')}
          >{t}</button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab === 'overview' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card p-4">
            <h3 className="text-tp-white font-semibold text-sm mb-3">Performance Radar</h3>
            <RadarChartWidget data={radarData} />
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-tp-white font-semibold text-sm">Status Flags</h3>
            </div>
            <div className="space-y-2">
              {member.assessmentDue && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-tp-amber/10 border border-tp-amber/20">
                  <span className="text-tp-amber text-xs font-medium">⚠ Assessment overdue — schedule one soon</span>
                </div>
              )}
              {member.fatigueScore === 'high' && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-tp-danger/10 border border-tp-danger/20">
                  <span className="text-tp-danger text-xs font-medium">🔴 High fatigue load — consider reducing volume</span>
                </div>
              )}
              {member.trend === 'down' && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-tp-danger/10 border border-tp-danger/20">
                  <span className="text-tp-danger text-xs font-medium">↓ Score declining — review training stimulus</span>
                </div>
              )}
              {!member.assessmentDue && member.fatigueScore !== 'high' && member.trend !== 'down' && (
                <p className="text-tp-green text-xs">✓ No active flags for this member</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Dimensions grid ── */}
      {tab === 'dimensions' && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(dims).map(([key, val]) => {
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
              return (
                <div key={key} className="card p-3">
                  <p className="text-tp-muted text-xs mb-1 leading-tight">{label}</p>
                  <p className={clsx('font-mono font-bold text-xl', scoreColor(val))}>{val}</p>
                  <div className="h-1 rounded-full bg-tp-raised mt-2 overflow-hidden">
                    <div className={clsx('h-full rounded-full', val >= 70 ? 'bg-tp-green' : val >= 50 ? 'bg-tp-amber' : 'bg-tp-danger')}
                      style={{ width: `${val}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Messages ── */}
      {tab === 'messages' && (
        <div className="animate-fade-in space-y-3">
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {(threadForMember ?? []).map(msg => (
              <div key={msg.id} className={clsx('flex', msg.sender === 'trainer' ? 'justify-end' : 'justify-start')}>
                <div className={clsx('max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                  msg.sender === 'trainer'
                    ? 'bg-tp-red text-white rounded-tr-sm'
                    : 'bg-tp-raised border border-tp-border text-tp-white rounded-tl-sm'
                )}>
                  {msg.text}
                </div>
              </div>
            ))}
            {(threadForMember ?? []).length === 0 && <p className="text-tp-muted text-xs text-center py-4">No messages yet.</p>}
          </div>
          <div className="flex gap-2">
            <input
              className="input flex-1 py-2 text-sm"
              placeholder={`Message ${member.name.split(' ')[0]}…`}
              value={msgInput}
              onChange={e => setMsgInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} disabled={!msgInput.trim()} className="btn-primary px-4 py-2 text-sm disabled:opacity-40">Send</button>
          </div>
        </div>
      )}
    </div>
  )
}
