import { useState, useEffect } from 'react'
import { useClientProfile } from '../hooks/useApi'
import { CheckCircle2, Save } from 'lucide-react'

// ── 43 profiling questions ────────────────────────────────────
const QUESTIONS = [
  { key: 'q01', label: 'Primary sport' },
  { key: 'q02', label: 'Playing role' },
  { key: 'q03', label: 'Training age (years)' },
  { key: 'q04', label: 'Injury in last 12 months' },
  { key: 'q05', label: 'Current goal', long: true },
  { key: 'q06', label: 'Secondary goal', long: true },
  { key: 'q07', label: 'Target competition date', type: 'date' },
  { key: 'q08', label: 'Dominant hand' },
  { key: 'q09', label: 'Dominant leg' },
  { key: 'q10', label: 'Years in competitive sport' },
  { key: 'q11', label: 'Previous surgeries' },
  { key: 'q12', label: 'Current pain score (0-10)' },
  { key: 'q13', label: 'Most common pain location', long: true },
  { key: 'q14', label: 'Any medications currently used' },
  { key: 'q15', label: 'Any allergies' },
  { key: 'q16', label: 'Warm-up compliance' },
  { key: 'q17', label: 'Cool-down compliance' },
  { key: 'q18', label: 'Mobility routine frequency' },
  { key: 'q19', label: 'Average sleep duration' },
  { key: 'q20', label: 'Sleep quality (1-10)' },
  { key: 'q21', label: 'Typical bedtime' },
  { key: 'q22', label: 'Typical wake-up time' },
  { key: 'q23', label: 'Hydration (liters/day)' },
  { key: 'q24', label: 'Caffeine intake/day' },
  { key: 'q25', label: 'Vegetarian / Non-vegetarian' },
  { key: 'q26', label: 'Protein intake/day' },
  { key: 'q27', label: 'Supplements used', long: true },
  { key: 'q28', label: 'Meal timing consistency' },
  { key: 'q29', label: 'Resting heart rate' },
  { key: 'q30', label: 'Blood pressure' },
  { key: 'q31', label: 'Training days available/week' },
  { key: 'q32', label: 'Session duration preference' },
  { key: 'q33', label: 'Preferred training environment' },
  { key: 'q34', label: 'Equipment access', long: true },
  { key: 'q35', label: 'Travel frequency affecting training' },
  { key: 'q36', label: 'Work/study stress level (1-10)' },
  { key: 'q37', label: 'Motivation level (1-10)' },
  { key: 'q38', label: 'Adherence confidence (1-10)' },
  { key: 'q39', label: 'Preferred coach communication', long: true },
  { key: 'q40', label: 'Check-in frequency preferred' },
  { key: 'q41', label: 'Preferred feedback format', long: true },
  { key: 'q42', label: 'Biggest performance limiter', long: true },
  { key: 'q43', label: 'What success looks like in 12 weeks', long: true },
]

// ── Reusable field components ─────────────────────────────────

function BioField({ label, value, onChange, placeholder = '', type = 'text', className = '' }) {
  return (
    <div className={className}>
      <p className="text-tp-muted text-[10px] uppercase tracking-widest font-medium mb-1.5">{label}</p>
      <input
        type={type}
        className="w-full bg-tp-raised border border-tp-border rounded-lg px-3 py-2.5 text-tp-white text-sm placeholder-tp-muted focus:outline-none focus:border-tp-red/40 transition-colors"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

function QItem({ num, label, value, onChange, long = false, type = 'text' }) {
  const baseInput = "w-full bg-transparent text-tp-white text-sm placeholder-tp-muted focus:outline-none transition-colors"
  return (
    <div className="px-4 py-3.5 border-b border-tp-border last:border-0">
      <p className="text-tp-muted text-[11px] mb-1.5">Q{String(num).padStart(2, '0')}. {label}</p>
      {long ? (
        <textarea
          rows={2}
          className={`${baseInput} resize-none leading-relaxed`}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Enter answer…"
        />
      ) : (
        <input
          type={type}
          className={baseInput}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Enter answer…"
        />
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────

export default function ClientProfiling() {
  const { data: saved, loading } = useClientProfile()
  const [form, setForm]          = useState(null)
  const [saved_ok, setSavedOk]   = useState(false)

  useEffect(() => {
    if (saved && !form) setForm({ ...saved })
  }, [saved, form])

  const set     = (field, val) => setForm(f => ({ ...f, [field]: val }))
  const setQ    = (key, val)   => setForm(f => ({ ...f, [key]: val }))

  const handleSave = () => {
    // Backend hook: memberApi.updateClientProfile(form)
    setSavedOk(true)
    setTimeout(() => setSavedOk(false), 3000)
  }

  if (loading || !form) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}</div>
  }

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Bio section ── */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-tp-border">
          <h2 className="text-tp-white font-bold text-base">Client Profiling</h2>
          <p className="text-tp-muted text-xs mt-0.5">Member bio and baseline details shared with the coaching team.</p>
        </div>

        <div className="p-5 space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <BioField label="Name"   value={form.name}   onChange={v => set('name', v)}   />
            <BioField label="Age"    value={form.age}    onChange={v => set('age', v)}    type="number" />
            <BioField label="Ht (cm)" value={form.height} onChange={v => set('height', v)} type="number" />
            <BioField label="Wt (kg)" value={form.weight} onChange={v => set('weight', v)} type="number" />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <BioField label="Body Fat (%)"  value={form.bodyFat} onChange={v => set('bodyFat', v)} placeholder="Enter body fat %" type="number" />
            <BioField label="Email ID"      value={form.email}   onChange={v => set('email', v)}   type="email" />
            <BioField label="Ph No"         value={form.phone}   onChange={v => set('phone', v)}   />
          </div>

          {/* Pref Timing */}
          <BioField label="Pref Timing" value={form.prefTiming} onChange={v => set('prefTiming', v)} placeholder="e.g. 7:00 AM – 9:00 AM" />

          {/* Medical history */}
          <div>
            <p className="text-tp-muted text-[10px] uppercase tracking-widest font-medium mb-1.5">Medical Condition / Injury History</p>
            <textarea
              rows={3}
              className="w-full bg-tp-raised border border-tp-border rounded-lg px-3 py-2.5 text-tp-white text-sm placeholder-tp-muted focus:outline-none focus:border-tp-red/40 transition-colors resize-none"
              value={form.medicalHistory}
              onChange={e => set('medicalHistory', e.target.value)}
              placeholder="List any injuries, surgeries, or relevant medical history…"
            />
          </div>
        </div>
      </div>

      {/* ── 43 Questions ── */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-tp-border">
          <h2 className="text-tp-white font-bold text-base">Client Profiling Questions</h2>
          <p className="text-tp-muted text-xs mt-0.5">Fill in all 43 fields and tap Save. Your coach sees this when building your programme.</p>
        </div>

        <div>
          {QUESTIONS.map(({ key, label, long, type }, i) => (
            <QItem
              key={key}
              num={i + 1}
              label={label}
              value={form[key] ?? ''}
              onChange={v => setQ(key, v)}
              long={long}
              type={type ?? 'text'}
            />
          ))}
        </div>
      </div>

      {/* ── Save bar ── */}
      <div className="sticky bottom-4 px-1">
        <button
          onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${
            saved_ok
              ? 'bg-tp-green text-white'
              : 'bg-tp-red text-white hover:bg-tp-red-bright active:bg-tp-red-dim'
          }`}
        >
          {saved_ok
            ? <><CheckCircle2 size={16} /> Saved</>
            : <><Save size={16} /> Save Profile</>}
        </button>
      </div>
    </div>
  )
}
