import { useState } from 'react'
import { Trophy, Users, Zap, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'
import { mockAssessmentReport as data } from '../data/mockData'

// ── Tab config ────────────────────────────────────────────────
const TABS = [
  { id: 'summary', label: 'Summary'         },
  { id: 'testing', label: 'Testing Markers' },
  { id: 'action',  label: 'Action Plan'     },
]

const TIER_BADGE = {
  bronze: 'bg-tp-bronze/15 text-tp-bronze border-tp-bronze/30',
  silver: 'bg-tp-silver/15 text-tp-silver border-tp-silver/30',
  gold:   'bg-tp-gold/15   text-tp-gold   border-tp-gold/30',
  elite:  'bg-tp-elite/15  text-tp-elite  border-tp-elite/30',
}

// ── Shared header (shown on every tab) ───────────────────────
function Header() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {/* Performance snapshot */}
      <div className="card p-5 border-l-4 border-tp-red">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={15} className="text-tp-red" />
          <p className="text-tp-white text-sm font-semibold">Performance snapshot</p>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono font-bold text-4xl text-tp-white">{data.score}</span>
          <span className={clsx('text-xs font-bold px-2 py-0.5 rounded border', TIER_BADGE[data.tier])}>
            {data.tier.charAt(0).toUpperCase() + data.tier.slice(1)} Tier
          </span>
        </div>
        <p className="text-tp-muted text-xs leading-relaxed mb-1">
          Coach-uploaded testing is translated into training-ready insights for your current block.
        </p>
        <p className="text-tp-soft text-xs">{data.pointsToNext} points to {data.nextTierLabel} benchmark.</p>
      </div>

      {/* Coach delivery model */}
      <div className="card p-5 border-l-4 border-tp-red/40">
        <div className="flex items-center gap-2 mb-3">
          <Users size={15} className="text-tp-red/70" />
          <p className="text-tp-white text-sm font-semibold">Coach delivery model</p>
        </div>
        <p className="text-tp-muted text-xs leading-relaxed">
          Actions are prescribed by your coach. This page interprets test outputs into clear priorities while keeping the evidence context visible.
        </p>
      </div>
    </div>
  )
}

// ── TAB 1: Summary ────────────────────────────────────────────
function SummaryTab() {
  const { evidenceNote, trafficLight } = data

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Evidence note */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} className="text-tp-amber" />
          <p className="text-tp-white text-sm font-semibold">Evidence note</p>
        </div>
        <p className="text-tp-soft text-sm leading-relaxed">{evidenceNote}</p>
      </div>

      {/* Traffic Light Signal Map */}
      <div className="card p-5">
        <h3 className="text-tp-white font-semibold text-sm mb-4">Traffic Light Signal Map</h3>
        <div className="grid grid-cols-3 gap-3">
          {/* RED */}
          <div className="space-y-2">
            <p className="text-tp-danger text-xs font-bold uppercase tracking-wider">RED: FOCUS NOW</p>
            {trafficLight.red.map(item => (
              <div key={item.name} className="bg-tp-raised border border-tp-danger/20 rounded-xl p-3">
                <p className="text-tp-white text-xs font-bold mb-1">{item.name} ({item.score})</p>
                <p className="text-tp-soft text-[11px] leading-relaxed mb-2">Interpretation: {item.interpretation}</p>
                <p className="text-tp-muted text-[10px]">Monitor: {item.monitor}</p>
              </div>
            ))}
          </div>

          {/* ORANGE */}
          <div className="space-y-2">
            <p className="text-tp-amber text-xs font-bold uppercase tracking-wider">ORANGE: IMPORTANT</p>
            {trafficLight.orange.map(item => (
              <div key={item.name} className="bg-tp-raised border border-tp-amber/20 rounded-xl p-3">
                <p className="text-tp-white text-xs font-bold mb-1">{item.name} ({item.score})</p>
                <p className="text-tp-soft text-[11px] leading-relaxed mb-2">Interpretation: {item.interpretation}</p>
                <p className="text-tp-muted text-[10px]">Monitor: {item.monitor}</p>
              </div>
            ))}
          </div>

          {/* GREEN */}
          <div className="space-y-2">
            <p className="text-tp-green text-xs font-bold uppercase tracking-wider">GREEN: MAINTAIN</p>
            {trafficLight.green.map(item => (
              <div key={item.name} className="bg-tp-raised border border-tp-green/20 rounded-xl p-3">
                <p className="text-tp-white text-xs font-bold mb-1">{item.name} ({item.score})</p>
                <p className="text-tp-soft text-[11px] leading-relaxed mb-2">Interpretation: {item.interpretation}</p>
                <p className="text-tp-muted text-[10px]">Monitor: {item.monitor}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── TAB 2: Testing Markers ────────────────────────────────────
function TestingMarkersTab() {
  const { powerProfiling, forceProfiling, speedProfiling } = data

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h3 className="text-tp-white font-semibold text-sm">Profiling results</h3>
        <span className="text-tp-muted text-xs">Latest completed test: {data.latestTestDate}</span>
      </div>

      {/* Power Profiling */}
      <div className="card p-5">
        <h4 className="text-tp-white font-semibold text-sm mb-4">Power Profiling (Check List)</h4>

        {/* Checklist */}
        <div className="flex flex-wrap gap-2 mb-4">
          {powerProfiling.checklist.map(item => (
            <div key={item} className="flex items-center gap-1.5 bg-tp-raised border border-tp-green/30 rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-tp-green flex-shrink-0" />
              <span className="text-tp-white text-xs font-medium">{item}</span>
            </div>
          ))}
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {powerProfiling.values.map(({ label, value }) => (
            <div key={label} className="bg-tp-raised border border-tp-border rounded-xl p-3">
              <p className="text-tp-muted text-[10px] mb-1">{label}</p>
              <p className="text-tp-white font-mono font-bold text-base">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Force Profiling */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-tp-border">
          <h4 className="text-tp-white font-semibold text-sm">Force Profiling</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-tp-border">
                {['Test no', 'Assessment', 'R-peak(kg)', 'R-avg(kg)', 'L-peak(kg)', 'L-avg(kg)', 'ND'].map(h => (
                  <th key={h} className="text-tp-muted font-medium text-left px-4 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {forceProfiling.rows.map(row => (
                <tr key={row.no} className="border-b border-tp-border/50 hover:bg-tp-raised/50 transition-colors">
                  <td className="px-4 py-2.5 text-tp-muted">{row.no}</td>
                  <td className="px-4 py-2.5 text-tp-white font-medium whitespace-nowrap">{row.assessment}</td>
                  <td className="px-4 py-2.5 text-tp-soft font-mono">{row.rPeak}</td>
                  <td className="px-4 py-2.5 text-tp-soft font-mono">{row.rAvg}</td>
                  <td className="px-4 py-2.5 text-tp-soft font-mono">{row.lPeak}</td>
                  <td className="px-4 py-2.5 text-tp-soft font-mono">{row.lAvg}</td>
                  <td className={clsx('px-4 py-2.5 font-mono font-medium', row.nd === '--' ? 'text-tp-muted' : parseFloat(row.nd) >= 4 ? 'text-tp-danger' : 'text-tp-soft')}>{row.nd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* VO2 Max */}
        <div className="px-5 py-4 border-t border-tp-border">
          <p className="label mb-1.5">VO₂ MAX (ML/KG/MIN)</p>
          <div className="inline-block bg-tp-raised border border-tp-border rounded-lg px-4 py-2">
            <span className="text-tp-white font-mono font-bold">{forceProfiling.vo2max}</span>
          </div>
        </div>
      </div>

      {/* Speed Profiling */}
      <div className="card p-5">
        <h4 className="text-tp-white font-semibold text-sm mb-4">Speed Profiling</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {speedProfiling.map(({ label, value }) => (
            <div key={label} className="bg-tp-raised border border-tp-border rounded-xl p-3">
              <p className="text-tp-muted text-[10px] mb-1">{label}</p>
              <p className="text-tp-white font-mono font-bold text-base">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── TAB 3: Action Plan ────────────────────────────────────────
function ActionPlanTab() {
  const { focusBlocks, reviewCadence } = data

  const BLOCK_ROWS = [
    { key: 'thisWeek',     label: 'THIS WEEK PLAN'        },
    { key: 'nextFewWeeks', label: 'NEXT FEW WEEKS'        },
    { key: 'howWeKnow',    label: 'HOW WE KNOW IT IS WORKING' },
    { key: 'whenAdjust',   label: 'WHEN COACH WILL ADJUST' },
    { key: 'whyMatters',   label: 'Why this matters',      muted: true },
  ]

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="card p-5">
        <h3 className="text-tp-white font-bold text-sm mb-1">Coach Prescribed Action Plan</h3>
        <p className="text-tp-muted text-xs leading-relaxed">
          This is your exact training plan from coach interpretation. It tells you what to do now, what changes over the next few weeks, and how progress is checked.
        </p>
      </div>

      {/* Focus blocks */}
      <div className="grid sm:grid-cols-2 gap-4">
        {focusBlocks.map(block => (
          <div key={block.id} className="card p-5 space-y-3">
            <div>
              <p className="text-tp-red text-[10px] font-bold uppercase tracking-widest mb-0.5">{block.label}</p>
              <p className="text-tp-white font-bold text-base">{block.title}</p>
            </div>
            {BLOCK_ROWS.map(({ key, label, muted }) => (
              <div key={key}>
                <p className="text-tp-muted text-[10px] font-medium uppercase tracking-wider mb-0.5">{label}</p>
                <p className={clsx('text-xs leading-relaxed', muted ? 'text-tp-muted' : 'text-tp-soft')}>{block[key]}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Review & Accountability */}
      <div className="card p-5">
        <p className="text-tp-amber text-[10px] font-bold uppercase tracking-widest mb-1">REVIEW AND ACCOUNTABILITY</p>
        <p className="text-tp-white font-bold text-sm mb-3">Coach Review Cadence</p>
        <p className="text-tp-soft text-xs leading-relaxed mb-1">{reviewCadence.description}</p>
        <p className="text-tp-soft text-xs leading-relaxed mb-2">
          Planned review date: <span className="text-tp-white">{reviewCadence.reviewDate}</span>. If results do not improve for 2 weeks, coach updates your plan.
        </p>
        <p className="text-tp-muted text-xs">Goal: {reviewCadence.goal}</p>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function Assessment() {
  const [tab, setTab] = useState('summary')

  return (
    <div className="space-y-4 animate-fade-in">
      <Header />

      {/* Tab switcher */}
      <div className="grid grid-cols-3 gap-1 bg-tp-surface p-1 rounded-xl border border-tp-border">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              'py-2.5 rounded-lg text-sm font-medium transition-all',
              tab === t.id ? 'bg-tp-red text-white' : 'text-tp-muted hover:text-tp-white',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'summary' && <SummaryTab />}
      {tab === 'testing' && <TestingMarkersTab />}
      {tab === 'action'  && <ActionPlanTab />}
    </div>
  )
}
