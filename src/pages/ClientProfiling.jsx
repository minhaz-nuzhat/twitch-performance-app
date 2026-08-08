import { useState, useEffect } from 'react'
import { useClientProfile } from '../hooks/useApi'
import { CheckCircle2, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

// ── Section definitions (8 sections, 43 questions total) ─────
const SECTIONS = [
  {
    id: 'sport', icon: '🏏', label: 'Sport & Role',
    questions: [
      { key: 'q01', label: 'Primary sport' },
      { key: 'q02', label: 'Playing role' },
      { key: 'q03', label: 'Training age (years)' },
    ],
  },
  {
    id: 'health', icon: '❤️', label: 'Health & Vitals',
    questions: [
      { key: 'q04', label: 'Injury in last 12 months' },
      { key: 'q11', label: 'Previous surgeries' },
      { key: 'q12', label: 'Current pain score (0–10)' },
      { key: 'q13', label: 'Most common pain location', long: true },
      { key: 'q14', label: 'Any medications currently used' },
      { key: 'q15', label: 'Any allergies' },
      { key: 'q29', label: 'Resting heart rate' },
      { key: 'q30', label: 'Blood pressure' },
    ],
  },
  {
    id: 'goals', icon: '🎯', label: 'Goals & Competition',
    questions: [
      { key: 'q05', label: 'Current goal', long: true },
      { key: 'q06', label: 'Secondary goal', long: true },
      { key: 'q07', label: 'Target competition date', type: 'date' },
    ],
  },
  {
    id: 'physical', icon: '⚡', label: 'Physical Profile',
    questions: [
      { key: 'q08', label: 'Dominant hand' },
      { key: 'q09', label: 'Dominant leg' },
      { key: 'q10', label: 'Years in competitive sport' },
    ],
  },
  {
    id: 'recovery', icon: '😴', label: 'Recovery & Sleep',
    questions: [
      { key: 'q16', label: 'Warm-up compliance' },
      { key: 'q17', label: 'Cool-down compliance' },
      { key: 'q18', label: 'Mobility routine frequency' },
      { key: 'q19', label: 'Average sleep duration' },
      { key: 'q20', label: 'Sleep quality (1–10)' },
      { key: 'q21', label: 'Typical bedtime' },
      { key: 'q22', label: 'Typical wake-up time' },
    ],
  },
  {
    id: 'nutrition', icon: '🥗', label: 'Nutrition',
    questions: [
      { key: 'q23', label: 'Hydration (litres/day)' },
      { key: 'q24', label: 'Caffeine intake/day' },
      { key: 'q25', label: 'Vegetarian / Non-vegetarian' },
      { key: 'q26', label: 'Protein intake/day' },
      { key: 'q27', label: 'Supplements used', long: true },
      { key: 'q28', label: 'Meal timing consistency' },
    ],
  },
  {
    id: 'training', icon: '🏋️', label: 'Training Setup',
    questions: [
      { key: 'q31', label: 'Training days available/week' },
      { key: 'q32', label: 'Session duration preference' },
      { key: 'q33', label: 'Preferred training environment' },
      { key: 'q34', label: 'Equipment access', long: true },
      { key: 'q35', label: 'Travel frequency affecting training' },
    ],
  },
  {
    id: 'mindset', icon: '🧠', label: 'Mindset & Coaching',
    questions: [
      { key: 'q36', label: 'Work/study stress level (1–10)' },
      { key: 'q37', label: 'Motivation level (1–10)' },
      { key: 'q38', label: 'Adherence confidence (1–10)' },
      { key: 'q39', label: 'Preferred coach communication', long: true },
      { key: 'q40', label: 'Check-in frequency preferred' },
      { key: 'q41', label: 'Preferred feedback format', long: true },
      { key: 'q42', label: 'Biggest performance limiter', long: true },
      { key: 'q43', label: 'What success looks like in 12 weeks', long: true },
    ],
  },
]

const TOTAL_Q = SECTIONS.reduce((a, s) => a + s.questions.length, 0)

// ── Helpers ───────────────────────────────────────────────────
function answered(form, keys) {
  return keys.filter(k => String(form[k] ?? '').trim().length > 0).length
}

function sectionStatus(section, form) {
  const done  = answered(form, section.questions.map(q => q.key))
  const total = section.questions.length
  if (done === total) return 'complete'
  if (done > 0)       return 'partial'
  return 'empty'
}

// ── Completion ring ───────────────────────────────────────────
function CompletionRing({ pct }) {
  const size  = 140
  const stroke = 12
  const r      = (size - stroke) / 2
  const circ   = 2 * Math.PI * r
  const offset = circ * (1 - pct / 100)
  const color  = pct === 100 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#e63946'
  const glow   = pct === 100 ? 'rgba(34,197,94,0.25)' : pct >= 50 ? 'rgba(245,158,11,0.25)' : 'rgba(230,57,70,0.25)'

  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ filter: `drop-shadow(0 0 16px ${glow})` }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e1e1e" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset}
            transform={`rotate(-90 ${size/2} ${size/2})`}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ position: 'absolute', top: 0, left: 0, width: size, height: size }}>
          <span className="font-mono font-bold text-2xl text-tp-white">{pct}%</span>
          <span className="text-tp-muted text-[10px] uppercase tracking-wider">complete</span>
        </div>
      </div>
    </div>
  )
}

// ── Expandable section card (replaces modal) ─────────────────
function SectionCard({ section, form, isOpen, onToggle, onUpdate }) {
  const status = sectionStatus(section, form)
  const done   = answered(form, section.questions.map(q => q.key))
  const total  = section.questions.length
  const pct    = Math.round((done / total) * 100)

  const borderClass = isOpen
    ? 'border-tp-red/40'
    : status === 'complete' ? 'border-tp-green/30'
    : status === 'partial'  ? 'border-tp-amber/30'
    : 'border-tp-border'

  const barClass   = status === 'complete' ? 'bg-tp-green' : status === 'partial' ? 'bg-tp-amber' : 'bg-tp-raised'
  const countClass = status === 'complete'
    ? 'bg-tp-green/15 text-tp-green border-tp-green/25'
    : status === 'partial'
    ? 'bg-tp-amber/15 text-tp-amber border-tp-amber/25'
    : 'bg-tp-raised text-tp-muted border-tp-border'

  return (
    <div className={clsx('card overflow-hidden transition-all duration-200', borderClass)}>
      {/* ── Clickable header ── */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-tp-raised/50 transition-colors"
      >
        <span className="text-xl leading-none flex-shrink-0">{section.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-tp-white text-sm font-semibold">{section.label}</p>
          <p className="text-tp-muted text-[10px] mt-0.5">
            {status === 'complete' ? '✓ Complete' : status === 'partial' ? `${done}/${total} answered` : 'Not started'}
          </p>
        </div>
        <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0', countClass)}>
          {done}/{total}
        </span>
        <ChevronDown
          size={15}
          className={clsx('text-tp-muted flex-shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      {/* Mini progress bar — only when collapsed */}
      {!isOpen && (
        <div className="h-0.5 bg-tp-raised overflow-hidden">
          <div className={clsx('h-full transition-all duration-500', barClass)} style={{ width: `${pct}%` }} />
        </div>
      )}

      {/* ── Expandable questions ── */}
      {isOpen && (
        <div className="border-t border-tp-border animate-fade-in">
          {section.questions.map(({ key, label, long, type }) => (
            <div key={key} className="px-4 py-3.5 border-b border-tp-border last:border-0">
              <p className="text-tp-muted text-[11px] mb-1.5">{label}</p>
              {long ? (
                <textarea
                  rows={2}
                  className="w-full bg-transparent text-tp-white text-sm placeholder-tp-muted focus:outline-none resize-none leading-relaxed"
                  value={form[key] ?? ''}
                  onChange={e => onUpdate(key, e.target.value)}
                  placeholder="Enter answer…"
                />
              ) : (
                <input
                  type={type ?? 'text'}
                  className="w-full bg-transparent text-tp-white text-sm placeholder-tp-muted focus:outline-none"
                  value={form[key] ?? ''}
                  onChange={e => onUpdate(key, e.target.value)}
                  placeholder="Enter answer…"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function ClientProfiling() {
  const { data: saved, loading } = useClientProfile()
  const [form, setForm]          = useState(null)
  const [openId, setOpenId]      = useState(null)
  const [savedOk, setSavedOk]    = useState(false)

  useEffect(() => {
    if (saved && !form) setForm({ ...saved })
  }, [saved, form])

  const setBio = (field, val) => setForm(f => ({ ...f, [field]: val }))
  const setQ   = (key, val)   => setForm(f => ({ ...f, [key]: val }))

  const handleSaveAll = () => {
    // Backend hook: memberApi.updateClientProfile(form)
    setSavedOk(true)
    setTimeout(() => setSavedOk(false), 3000)
  }

  if (loading || !form) {
    return <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
  }

  const totalDone = SECTIONS.reduce((a, s) => a + answered(form, s.questions.map(q => q.key)), 0)
  const pct       = Math.round((totalDone / TOTAL_Q) * 100)

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Overall completion ring ── */}
      <div className="card p-6 flex flex-col items-center gap-3">
        <div className="relative" style={{ width: 140, height: 140 }}>
          <CompletionRing pct={pct} />
        </div>
        <div className="text-center">
          <p className="text-tp-white font-bold text-sm">{totalDone} of {TOTAL_Q} questions answered</p>
          <p className="text-tp-muted text-xs mt-0.5">
            {pct === 100
              ? '✓ Profile complete — shared with your coach'
              : 'Tap any section below to fill it in'}
          </p>
        </div>
      </div>

      {/* ── Bio card ── */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-tp-border">
          <h2 className="text-tp-white font-bold text-sm">Client Profiling</h2>
          <p className="text-tp-muted text-xs mt-0.5">Bio and baseline details shared with your coaching team.</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Name',    field: 'name',   type: 'text'   },
              { label: 'Age',     field: 'age',    type: 'number' },
              { label: 'Ht (cm)', field: 'height', type: 'number' },
              { label: 'Wt (kg)', field: 'weight', type: 'number' },
            ].map(({ label, field, type }) => (
              <div key={field}>
                <p className="text-tp-muted text-[10px] uppercase tracking-widest font-medium mb-1.5">{label}</p>
                <input type={type} className="w-full bg-tp-raised border border-tp-border rounded-lg px-3 py-2.5 text-tp-white text-sm placeholder-tp-muted focus:outline-none focus:border-tp-red/40 transition-colors"
                  value={form[field] ?? ''} onChange={e => setBio(field, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Body Fat (%)', field: 'bodyFat', type: 'number', placeholder: 'e.g. 14.2' },
              { label: 'Email',        field: 'email',   type: 'email',  placeholder: '' },
              { label: 'Phone',        field: 'phone',   type: 'text',   placeholder: '' },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field}>
                <p className="text-tp-muted text-[10px] uppercase tracking-widest font-medium mb-1.5">{label}</p>
                <input type={type} className="w-full bg-tp-raised border border-tp-border rounded-lg px-3 py-2.5 text-tp-white text-sm placeholder-tp-muted focus:outline-none focus:border-tp-red/40 transition-colors"
                  value={form[field] ?? ''} onChange={e => setBio(field, e.target.value)} placeholder={placeholder} />
              </div>
            ))}
          </div>
          <div>
            <p className="text-tp-muted text-[10px] uppercase tracking-widest font-medium mb-1.5">Preferred Training Time</p>
            <input className="w-full bg-tp-raised border border-tp-border rounded-lg px-3 py-2.5 text-tp-white text-sm placeholder-tp-muted focus:outline-none focus:border-tp-red/40 transition-colors"
              value={form.prefTiming ?? ''} onChange={e => setBio('prefTiming', e.target.value)} placeholder="e.g. 7:00 AM – 9:00 AM" />
          </div>
          <div>
            <p className="text-tp-muted text-[10px] uppercase tracking-widest font-medium mb-1.5">Medical Condition / Injury History</p>
            <textarea rows={3}
              className="w-full bg-tp-raised border border-tp-border rounded-lg px-3 py-2.5 text-tp-white text-sm placeholder-tp-muted focus:outline-none focus:border-tp-red/40 transition-colors resize-none"
              value={form.medicalHistory ?? ''} onChange={e => setBio('medicalHistory', e.target.value)}
              placeholder="List any injuries, surgeries, or relevant medical history…" />
          </div>
        </div>
      </div>

      {/* ── Section grid — open card spans full width ── */}
      <div>
        <p className="label px-1 mb-3">Profiling Questions — tap a section to expand</p>
        <div className="grid grid-cols-2 gap-3">
          {SECTIONS.map(section => (
            <div
              key={section.id}
              className={clsx('transition-all', openId === section.id ? 'col-span-2' : 'col-span-1')}
            >
              <SectionCard
                section={section}
                form={form}
                isOpen={openId === section.id}
                onToggle={() => setOpenId(openId === section.id ? null : section.id)}
                onUpdate={setQ}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Save all ── */}
      <div className="sticky bottom-4 px-1 pb-2">
        <button
          onClick={handleSaveAll}
          className={clsx(
            'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all',
            savedOk ? 'bg-tp-green text-white' : 'bg-tp-red text-white hover:bg-tp-red-bright',
          )}
        >
          {savedOk ? <><CheckCircle2 size={16} /> Saved</> : 'Save Profile'}
        </button>
      </div>
    </div>
  )
}

