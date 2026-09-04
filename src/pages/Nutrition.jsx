import { useState } from 'react'
import { useNutrition } from '../hooks/useApi'
import MacroRing from '../components/ui/MacroRing'
import { CheckCircle2, Circle, Info, Upload, FileText, Trash2, Check, ChevronDown, Lightbulb, Droplets } from 'lucide-react'
import clsx from 'clsx'

const MEAL_LOG_KEY = 'tp-nutrition-meal-log'

export default function Nutrition() {
  const { data: plan, loading } = useNutrition()
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [loggedMeals, setLoggedMeals] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(MEAL_LOG_KEY) || '{}')
    } catch {
      return {}
    }
  })
  const [uploadError, setUploadError] = useState('')
  const [selectedDayType, setSelectedDayType] = useState(plan?.selectedDayType ?? 'heavy')
  const [openAlternatives, setOpenAlternatives] = useState(null)
  const [coachNoteOpen, setCoachNoteOpen] = useState(false)

  if (loading || !plan) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
  }

  const { targets, todayLog, meals, trainerNote } = plan
  const dayPlan = plan.dayTypes?.[selectedDayType]
  const activeTargets = dayPlan ?? targets

  const mealState = meals.map(meal => ({
    ...meal,
    ...(meal.dayTypeAdjustments?.[selectedDayType] ?? {}),
    logged: loggedMeals[meal.id] ?? meal.logged,
  }))

  const calPct      = Math.min(Math.round((todayLog.calories / activeTargets.calories) * 100), 100)
  const remaining   = activeTargets.calories - todayLog.calories
  const loggedCount  = mealState.filter((m) => m.logged).length

  const toggleMeal = (mealId) => {
    setLoggedMeals(prev => {
      const next = { ...prev, [mealId]: !(prev[mealId] ?? meals.find(m => m.id === mealId)?.logged) }
      localStorage.setItem(MEAL_LOG_KEY, JSON.stringify(next))
      return next
    })
  }

  const handleFileUpload = (e) => {
    setUploadError('')
    const files = Array.from(e.target.files)
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`${file.name} is larger than the 10 MB limit.`)
        return
      }
      const newFile = {
        id: `file_${Date.now()}_${Math.random()}`,
        name: file.name,
        size: (file.size / 1024).toFixed(1),
        uploadedAt: new Date().toLocaleDateString('en-IN'),
      }
      setUploadedFiles(prev => [...prev, newFile])
    })
  }

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Plan Header ── */}
      <div className="card p-5 border-red-glow">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="label block mb-1">Active Plan</span>
            <h2 className="text-tp-white font-bold text-base">{plan.name}</h2>
            <p className="text-tp-muted text-xs mt-0.5">Assigned by {plan.assignedBy}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-tp-white font-mono font-bold text-2xl">{loggedCount}/{meals.length}</p>
            <p className="text-tp-muted text-xs">meals logged</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">

      <div className="space-y-6 lg:col-start-1">

      {/* ── Day type ── */}
      {plan.dayTypes && (
        <div className="card p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="text-tp-white font-semibold">Today’s fuel target</h3>
              <p className="text-tp-soft text-xs mt-1">Your coach sets different targets for different training demands.</p>
            </div>
            <span className="text-tp-red text-xs font-semibold whitespace-nowrap">Coach prescribed</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {Object.entries(plan.dayTypes).map(([key, day]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDayType(key)}
                className={clsx(
                  'rounded-lg border px-2 py-3 text-left transition-colors',
                  selectedDayType === key ? 'border-tp-red bg-tp-red/10' : 'border-tp-border bg-tp-raised hover:border-tp-border-bright',
                )}
              >
                <p className={clsx('text-xs font-semibold', selectedDayType === key ? 'text-tp-red' : 'text-tp-white')}>{day.label}</p>
                <p className="text-tp-soft text-[11px] mt-1 font-mono">{day.calories.toLocaleString()} kcal</p>
              </button>
            ))}
          </div>
          {dayPlan && <p className="text-tp-soft text-xs leading-relaxed">{dayPlan.description}</p>}
        </div>
      )}

      {/* ── Calories + Macros ── */}
      <div className="card p-5">
        <h3 className="text-tp-white font-semibold mb-4">Today's Intake</h3>

        {/* Calorie bar */}
        <div className="mb-5">
          <div className="flex justify-between items-baseline mb-2">
            <div>
              <span className="font-mono font-bold text-3xl text-tp-white">{todayLog.calories}</span>
              <span className="text-tp-soft text-sm ml-1">/ {activeTargets.calories} kcal</span>
            </div>
            <span className={clsx(
              'text-sm font-semibold',
              remaining > 0 ? 'text-tp-soft' : 'text-tp-danger',
            )}>
              {remaining > 0 ? `${remaining} remaining` : `${Math.abs(remaining)} over`}
            </span>
          </div>
          <div className="h-3 rounded-full bg-tp-raised overflow-hidden">
            <div
              className={clsx(
                'h-full rounded-full transition-all duration-700',
                calPct >= 100 ? 'bg-tp-danger' : 'bg-tp-red',
              )}
              style={{ width: `${calPct}%` }}
            />
          </div>
            <p className="text-tp-soft text-xs mt-1">{calPct}% of daily target consumed</p>
        </div>

        {/* Macro rings */}
        <div className="flex justify-around">
          <MacroRing
            value={todayLog.protein} target={activeTargets.protein}
            label="Protein" color="#e63946" size={90}
          />
          <MacroRing
            value={todayLog.carbs} target={activeTargets.carbs}
            label="Carbs" color="#f59e0b" size={90}
          />
          <MacroRing
            value={todayLog.fat} target={activeTargets.fat}
            label="Fat" color="#22c55e" size={90}
          />
        </div>
      </div>

      </div>

      <div className="space-y-6 lg:col-start-2 lg:row-start-1">

      {/* ── Trainer Note ── */}
      {trainerNote && (
        <div className="card border-tp-amber/25 bg-tp-amber/5 overflow-hidden">
          <button
            type="button"
            onClick={() => setCoachNoteOpen(value => !value)}
            aria-expanded={coachNoteOpen}
            className="w-full flex items-center gap-2 p-4 text-left hover:bg-tp-amber/5 transition-colors"
          >
            <Info size={15} className="text-tp-amber flex-shrink-0" />
            <span className="text-tp-amber text-sm font-semibold flex-1">Coach's Note</span>
            <ChevronDown size={15} className={clsx('text-tp-amber transition-transform', coachNoteOpen && 'rotate-180')} />
          </button>
          {coachNoteOpen && <p className="px-4 pb-4 text-tp-soft text-sm leading-relaxed animate-fade-in">{trainerNote}</p>}
        </div>
      )}

      {/* ── Coach reasoning ── */}
      {(plan.planReasoning?.length > 0 || plan.suggestions?.length > 0 || plan.hydration?.length > 0) && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={16} className="text-tp-amber" />
            <h3 className="text-tp-white font-semibold">Coach’s reasoning & suggestions</h3>
          </div>
          <div className="space-y-3">
            {plan.planReasoning?.map(item => (
              <div key={item.title} className="border-l-2 border-tp-red/60 pl-3">
                <p className="text-tp-white text-sm font-semibold">{item.title}</p>
                <p className="text-tp-soft text-xs leading-relaxed mt-1">{item.text}</p>
              </div>
            ))}
          </div>
          {plan.suggestions?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-tp-border">
              <p className="label mb-2">Practical suggestions</p>
              <ul className="space-y-2">
                {plan.suggestions.map(suggestion => <li key={suggestion} className="text-tp-soft text-xs leading-relaxed flex gap-2"><span className="text-tp-red">•</span>{suggestion}</li>)}
              </ul>
            </div>
          )}
          {plan.hydration?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-tp-border">
              <div className="flex items-center gap-2 mb-2"><Droplets size={14} className="text-tp-green" /><p className="label">Hydration & electrolytes</p></div>
              <ul className="space-y-2">
                {plan.hydration.map(item => <li key={item} className="text-tp-soft text-xs leading-relaxed flex gap-2"><span className="text-tp-green">•</span>{item}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── Blood Tests & Medical Reports ── */}
      <div>
        <h3 className="text-tp-white font-semibold mb-3">Nutrition Diagnostics</h3>
        <div className="card p-5 border-tp-border">
          <div className="flex items-start gap-3 mb-4">
            <FileText size={16} className="text-tp-red flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-tp-white font-medium text-sm mb-0.5">Blood Tests & Medical Reports</p>
              <p className="text-tp-muted text-xs">Upload blood work, metabolic panels, or medical reports to help your coach understand nutritional deficiencies and optimize your plan.</p>
            </div>
          </div>

          {/* Upload Area */}
          <div className="mb-4">
            <label className="relative block">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-tp-border-bright rounded-lg p-6 hover:border-tp-red/50 hover:bg-tp-red/3 transition-all cursor-pointer text-center">
                <Upload size={24} className="mx-auto mb-2 text-tp-muted" />
                <p className="text-tp-white text-sm font-medium">Click to upload files</p>
                <p className="text-tp-muted text-xs mt-1">PDF, images, or documents (Max 10 MB)</p>
              </div>
            </label>
          </div>

          {uploadError && (
            <p className="text-tp-danger text-xs mb-3" role="alert">{uploadError}</p>
          )}

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-tp-soft text-xs font-semibold mb-2">Uploaded Files ({uploadedFiles.length})</p>
              {uploadedFiles.map(file => (
                <div key={file.id} className="flex items-center justify-between bg-tp-raised p-3 rounded-lg border border-tp-border/50">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText size={14} className="text-tp-red flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-tp-white text-xs font-medium truncate">{file.name}</p>
                      <p className="text-tp-muted text-[10px]">{file.size} KB • {file.uploadedAt}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="flex-shrink-0 text-tp-muted hover:text-tp-danger transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      </div>

      {/* ── Meal Plan ── */}
      <div className="lg:col-start-1">
        <h3 className="text-tp-white font-semibold mb-3">Meal Plan</h3>
        <div className="space-y-3">
          {mealState.map((meal) => (
            <div
              key={meal.id}
              className={clsx(
                'card p-4 transition-all',
                meal.logged ? 'border-tp-green/20 bg-tp-green/3' : '',
              )}
            >
              <div className="flex items-start gap-3">
                {/* Log indicator */}
                <button
                  type="button"
                  onClick={() => toggleMeal(meal.id)}
                  aria-label={`${meal.logged ? 'Unlog' : 'Log'} ${meal.name}`}
                  className="flex-shrink-0 mt-0.5 w-11 h-11 flex items-center justify-center rounded-lg hover:bg-tp-raised transition-colors"
                >
                  {meal.logged
                    ? <CheckCircle2 size={20} className="text-tp-green" />
                    : <Circle       size={20} className="text-tp-soft" />}
                </button>

                {/* Meal info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-tp-white font-semibold text-sm">{meal.name}</h4>
                    <span className="text-tp-soft text-xs flex-shrink-0">{meal.time}</span>
                  </div>

                  {meal.purpose && <p className="text-tp-soft text-xs mt-1">{meal.purpose}</p>}

                  {/* Macros row */}
                  <div className="flex gap-3 mt-1.5">
                    {meal.calories > 0 && <span className="text-tp-soft text-xs font-mono">{meal.calories} kcal</span>}
                    {meal.protein > 0 && <span className="text-tp-red text-xs">P: {meal.protein}g</span>}
                    {meal.carbs > 0 && <span className="text-tp-amber text-xs">C: {meal.carbs}g</span>}
                    {meal.fat > 0 && <span className="text-tp-green text-xs">F: {meal.fat}g</span>}
                  </div>

                  {/* Items */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {meal.items.map((item, i) => (
                      <span
                        key={i}
                        className="bg-tp-raised text-tp-soft text-[10px] px-2 py-0.5 rounded-full border border-tp-border"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {meal.calories === 0 && <p className="text-tp-muted text-xs italic mt-2">No meal scheduled for this day type.</p>}

                  {meal.alternatives?.length > 0 && meal.calories > 0 && (
                    <div className="mt-3 border-t border-tp-border pt-2">
                      <button
                        type="button"
                        onClick={() => setOpenAlternatives(openAlternatives === meal.id ? null : meal.id)}
                        className="flex items-center gap-1.5 text-tp-red text-xs font-semibold py-1"
                        aria-expanded={openAlternatives === meal.id}
                      >
                        <ChevronDown size={13} className={clsx('transition-transform', openAlternatives === meal.id && 'rotate-180')} />
                        See coach-approved alternatives
                      </button>
                      {openAlternatives === meal.id && (
                        <div className="mt-2 space-y-1.5">
                          {meal.alternatives.map((alternative, index) => (
                            <div key={alternative} className="flex gap-2 bg-tp-raised rounded-lg px-3 py-2 text-xs text-tp-soft">
                              <span className="text-tp-red font-bold">{String.fromCharCode(65 + index)}</span>
                              <span>{alternative}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleMeal(meal.id)}
                    className={clsx(
                      'mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
                      meal.logged
                        ? 'bg-tp-green/10 text-tp-green border border-tp-green/30'
                        : 'bg-tp-raised text-tp-white border border-tp-border hover:border-tp-red/50',
                    )}
                  >
                    {meal.logged ? <Check size={13} /> : <Circle size={13} />}
                    {meal.logged ? 'Meal logged' : 'Log this meal'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}
