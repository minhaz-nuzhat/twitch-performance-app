import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { mockRoster } from '../../data/mockTrainerData'
import { CheckCircle2, Plus, Trash2 } from 'lucide-react'
import clsx from 'clsx'

const PLAN_TEMPLATES = [
  { id: 'lean_perf', name: 'Lean Performance',   calories: 2800, protein: 165, carbs: 340, fat: 75,  description: 'High protein, moderate carbs. Ideal for pre-season.' },
  { id: 'bulk',      name: 'Muscle Building',     calories: 3400, protein: 190, carbs: 420, fat: 90,  description: 'Caloric surplus, high protein for hypertrophy.' },
  { id: 'cut',       name: 'Competition Cut',     calories: 2200, protein: 180, carbs: 200, fat: 65,  description: 'Caloric deficit, maximum protein retention.' },
  { id: 'maintain',  name: 'Maintenance',         calories: 2500, protein: 155, carbs: 290, fat: 72,  description: 'Balanced macros for off-season maintenance.' },
  { id: 'custom',    name: 'Custom',              calories: 0,    protein: 0,   carbs: 0,   fat: 0,   description: 'Set your own targets.' },
]

const DEFAULT_MEALS = [
  { id: 'm1', name: 'Breakfast',     time: '07:30', items: '' },
  { id: 'm2', name: 'Pre-Training',  time: '11:30', items: '' },
  { id: 'm3', name: 'Post-Training', time: '14:30', items: '' },
  { id: 'm4', name: 'Dinner',        time: '19:30', items: '' },
]

export default function NutritionBuilderPage() {
  const navigate       = useNavigate()
  const [params]       = useSearchParams()

  const [memberId, setMemberId]   = useState(params.get('member') ?? '')
  const [template, setTemplate]   = useState('lean_perf')
  const [targets, setTargets]     = useState({ calories: 2800, protein: 165, carbs: 340, fat: 75 })
  const [meals, setMeals]         = useState(DEFAULT_MEALS.map(m => ({ ...m })))
  const [trainerNote, setNote]    = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))
  const [saved, setSaved]         = useState(false)

  const applyTemplate = (id) => {
    setTemplate(id)
    const t = PLAN_TEMPLATES.find(p => p.id === id)
    if (t && id !== 'custom') setTargets({ calories: t.calories, protein: t.protein, carbs: t.carbs, fat: t.fat })
  }

  const updateMeal = (id, field, val) => setMeals(prev => prev.map(m => m.id === id ? { ...m, [field]: val } : m))
  const addMeal    = () => setMeals(prev => [...prev, { id: `m${Date.now()}`, name: 'Snack', time: '16:00', items: '' }])
  const removeMeal = (id) => setMeals(prev => prev.filter(m => m.id !== id))

  const totalMacroCalories = targets.protein * 4 + targets.carbs * 4 + targets.fat * 9

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-tp-green/15 border border-tp-green/30 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-tp-green" />
        </div>
        <h2 className="text-tp-white font-bold text-xl">Plan Assigned</h2>
        <p className="text-tp-soft text-sm text-center">
          Nutrition plan assigned to {mockRoster.find(m => m.id === memberId)?.name ?? 'member'} from {startDate}.
        </p>
        <div className="flex gap-3">
          <button onClick={() => navigate('/trainer/roster')} className="btn-ghost">Back to Roster</button>
          <button onClick={() => { setSaved(false); setMemberId('') }} className="btn-primary">Create Another</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── Member + date ── */}
      <div className="card p-5">
        <h2 className="text-tp-white font-bold mb-4">Nutrition Plan Builder</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label block mb-1.5">Assign to Member *</label>
            <select className="input" value={memberId} onChange={e => setMemberId(e.target.value)} required>
              <option value="">— Select member —</option>
              {mockRoster.map(m => <option key={m.id} value={m.id}>{m.name} ({m.sport})</option>)}
            </select>
          </div>
          <div>
            <label className="label block mb-1.5">Start Date</label>
            <input type="date" className="input" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
        </div>
      </div>

      {/* ── Template picker ── */}
      <div className="card p-5">
        <h3 className="text-tp-white font-semibold mb-3">Plan Template</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {PLAN_TEMPLATES.map(t => (
            <button key={t.id} onClick={() => applyTemplate(t.id)}
              className={clsx(
                'text-left p-3 rounded-xl border transition-all',
                template === t.id ? 'border-tp-red/40 bg-tp-red/5' : 'border-tp-border bg-tp-raised hover:border-tp-border-bright',
              )}
            >
              <p className={clsx('text-sm font-semibold', template === t.id ? 'text-tp-red' : 'text-tp-white')}>{t.name}</p>
              <p className="text-tp-muted text-[11px] mt-0.5 leading-tight">{t.description}</p>
              {t.id !== 'custom' && <p className="text-tp-soft text-xs mt-1 font-mono">{t.calories} kcal</p>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Macro targets ── */}
      <div className="card p-5">
        <h3 className="text-tp-white font-semibold mb-3">Daily Targets</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {[
            { key: 'calories', label: 'Calories', unit: 'kcal', color: 'text-tp-white' },
            { key: 'protein',  label: 'Protein',  unit: 'g',    color: 'text-tp-red'   },
            { key: 'carbs',    label: 'Carbs',    unit: 'g',    color: 'text-tp-amber' },
            { key: 'fat',      label: 'Fat',      unit: 'g',    color: 'text-tp-green' },
          ].map(({ key, label, unit, color }) => (
            <div key={key}>
              <label className="label block mb-1.5">{label} ({unit})</label>
              <input type="number" className="input text-center font-mono" min="0"
                value={targets[key]} onChange={e => setTargets(t => ({ ...t, [key]: parseInt(e.target.value) || 0 }))} />
              {key !== 'calories' && (
                <p className={clsx('text-xs text-center mt-1', color)}>
                  {key === 'protein' ? targets.protein * 4 :
                   key === 'carbs'   ? targets.carbs   * 4 :
                                       targets.fat     * 9} kcal
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="h-1.5 rounded-full bg-tp-raised overflow-hidden">
          <div className="h-full flex">
            <div className="bg-tp-red h-full transition-all" style={{ width: `${(targets.protein * 4 / totalMacroCalories) * 100}%` }} />
            <div className="bg-tp-amber h-full transition-all" style={{ width: `${(targets.carbs * 4 / totalMacroCalories) * 100}%` }} />
            <div className="bg-tp-green h-full transition-all" style={{ width: `${(targets.fat * 9 / totalMacroCalories) * 100}%` }} />
          </div>
        </div>
        <div className="flex gap-4 mt-2 text-[10px] text-tp-muted">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tp-red" />Protein</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tp-amber" />Carbs</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tp-green" />Fat</span>
        </div>
      </div>

      {/* ── Meal plan ── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-tp-white font-semibold">Meal Plan</h3>
          <button onClick={addMeal} className="flex items-center gap-1 text-xs bg-tp-red/10 text-tp-red border border-tp-red/20 px-2.5 py-1.5 rounded-lg transition-all hover:bg-tp-red/20">
            <Plus size={12} /> Add Meal
          </button>
        </div>
        <div className="space-y-3">
          {meals.map(meal => (
            <div key={meal.id} className="p-3 rounded-xl bg-tp-black border border-tp-border space-y-2">
              <div className="flex items-center gap-2">
                <input className="flex-1 bg-transparent text-tp-white text-sm font-medium placeholder-tp-muted focus:outline-none border-b border-tp-border focus:border-tp-red pb-1 transition-colors"
                  placeholder="Meal name…" value={meal.name} onChange={e => updateMeal(meal.id, 'name', e.target.value)} />
                <input type="time" className="bg-tp-raised border border-tp-border text-tp-soft text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-tp-red/50"
                  value={meal.time} onChange={e => updateMeal(meal.id, 'time', e.target.value)} />
                <button onClick={() => removeMeal(meal.id)} className="text-tp-border hover:text-tp-danger transition-colors p-1">
                  <Trash2 size={13} />
                </button>
              </div>
              <input className="w-full bg-transparent text-tp-muted text-xs placeholder-tp-border focus:outline-none border-b border-transparent focus:border-tp-border pb-0.5 transition-colors"
                placeholder="Food items (e.g. Oats, 3 eggs, banana)…" value={meal.items}
                onChange={e => updateMeal(meal.id, 'items', e.target.value)} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Trainer note ── */}
      <div className="card p-5">
        <label className="label block mb-1.5">Trainer Note (visible to member)</label>
        <textarea rows={3} className="input resize-none" placeholder="Increase carbs on training days…"
          value={trainerNote} onChange={e => setNote(e.target.value)} />
      </div>

      {/* ── Save ── */}
      <div className="flex gap-3 pb-4">
        <button onClick={() => navigate(-1)} className="btn-ghost">Cancel</button>
        <button onClick={() => { if (memberId) setSaved(true) }} disabled={!memberId} className="btn-primary flex-1 disabled:opacity-40">
          Assign Plan to Member
        </button>
      </div>
    </div>
  )
}
