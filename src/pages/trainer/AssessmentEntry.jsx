import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAssessmentTemplate } from '../../hooks/useTrainerApi'
import { mockRoster } from '../../data/mockTrainerData'
import { CheckCircle2, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

function ScoreButtons({ options, value, onChange }) {
  return (
    <div className="flex gap-1">
      {options.map(o => (
        <button key={o} onClick={() => onChange(String(o))}
          className={clsx(
            'w-9 h-9 rounded-lg text-sm font-mono font-bold border transition-all',
            value === String(o)
              ? 'bg-tp-red text-white border-tp-red'
              : 'bg-tp-raised text-tp-soft border-tp-border hover:border-tp-red/40',
          )}
        >{o}</button>
      ))}
    </div>
  )
}

export default function AssessmentEntry() {
  const [params]          = useSearchParams()
  const navigate          = useNavigate()
  const { data: template, loading } = useAssessmentTemplate()

  const [memberId, setMemberId] = useState(params.get('member') ?? '')
  const [values, setValues]     = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)

  const setVal = (fieldId, val) => setValues(v => ({ ...v, [fieldId]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // Backend hook: assessmentApi.create({ memberId, templateId: template.id, values })
    setSubmitted(true)
  }

  const filledCount = Object.values(values).filter(v => v !== '' && v !== undefined).length
  const totalFields = template?.categories.reduce((acc, c) => acc + c.fields.length, 0) ?? 0

  if (loading) return <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-tp-green/15 border border-tp-green/30 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-tp-green" />
        </div>
        <h2 className="text-tp-white font-bold text-xl">Assessment Saved</h2>
        <p className="text-tp-soft text-sm text-center">
          Score calculated and dashboard updated for {mockRoster.find(m => m.id === memberId)?.name ?? 'member'}.
        </p>
        <div className="flex gap-3">
          <button onClick={() => { setSubmitted(false); setValues({}) }} className="btn-ghost">New Assessment</button>
          <button onClick={() => navigate(memberId ? `/trainer/roster/${memberId}` : '/trainer/roster')} className="btn-primary">View Member</button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
      {/* ── Header ── */}
      <div className="card p-4">
        <h2 className="text-tp-white font-bold text-base mb-3">New Assessment Entry</h2>
        <div>
          <label className="label block mb-1.5">Member</label>
          <select
            className="input"
            value={memberId}
            onChange={e => setMemberId(e.target.value)}
            required
          >
            <option value="">— Select member —</option>
            {mockRoster.map(m => <option key={m.id} value={m.id}>{m.name} ({m.sport})</option>)}
          </select>
        </div>
        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-tp-muted">Fields completed</span>
            <span className="text-tp-white font-mono">{filledCount} / {totalFields}</span>
          </div>
          <div className="h-1.5 rounded-full bg-tp-raised overflow-hidden">
            <div className="h-full rounded-full bg-tp-red transition-all duration-500"
              style={{ width: totalFields > 0 ? `${(filledCount / totalFields) * 100}%` : '0%' }} />
          </div>
        </div>
      </div>

      {/* ── Category accordions ── */}
      {template?.categories.map((cat) => {
        const isOpen = activeCategory === cat.id || activeCategory === null
        const filled = cat.fields.filter(f => values[f.id] !== undefined && values[f.id] !== '').length

        return (
          <div key={cat.id} className="card overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-tp-raised/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-tp-white font-semibold text-sm">{cat.name}</span>
                {filled > 0 && (
                  <span className="bg-tp-green/15 text-tp-green text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {filled}/{cat.fields.length}
                  </span>
                )}
              </div>
              <ChevronDown size={16} className={clsx('text-tp-muted transition-transform', activeCategory === cat.id && 'rotate-180')} />
            </button>

            {(activeCategory === cat.id || activeCategory === null) && (
              <div className="px-5 pb-5 space-y-4 border-t border-tp-border">
                {cat.fields.map(field => (
                  <div key={field.id} className="mt-4">
                    <label className="flex items-center justify-between mb-1.5">
                      <span className="label">{field.label}</span>
                      {field.unit && <span className="text-tp-muted text-[10px]">{field.unit}</span>}
                    </label>

                    {field.type === 'number' && (
                      <input
                        type="number"
                        className="input"
                        placeholder={field.placeholder ?? ''}
                        value={values[field.id] ?? ''}
                        onChange={e => setVal(field.id, e.target.value)}
                        step="0.1"
                        min="0"
                      />
                    )}

                    {field.type === 'score3' && (
                      <ScoreButtons options={field.options} value={values[field.id] ?? ''} onChange={v => setVal(field.id, v)} />
                    )}

                    {field.type === 'score10' && (
                      <ScoreButtons options={[1,2,3,4,5,6,7,8,9,10]} value={values[field.id] ?? ''} onChange={v => setVal(field.id, v)} />
                    )}

                    {field.type === 'textarea' && (
                      <textarea
                        rows={3}
                        className="input resize-none"
                        placeholder={field.placeholder ?? ''}
                        value={values[field.id] ?? ''}
                        onChange={e => setVal(field.id, e.target.value)}
                      />
                    )}

                    {field.lowerIsBetter && (
                      <p className="text-tp-muted text-[10px] mt-1">Lower is better</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* ── Submit ── */}
      <div className="flex gap-3 pb-4">
        <button type="button" onClick={() => navigate(-1)} className="btn-ghost flex-1">Cancel</button>
        <button
          type="submit"
          disabled={!memberId}
          className="btn-primary flex-1 disabled:opacity-40"
        >
          Save & Calculate Score
        </button>
      </div>
    </form>
  )
}
