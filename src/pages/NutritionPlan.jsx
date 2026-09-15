import { useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Download, Droplets, Info, Lightbulb } from 'lucide-react'
import clsx from 'clsx'
import { useNutrition } from '../hooks/useApi'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const WEEK_CONFIGS = [
  { phase: 'Foundation', focus: 'Establish meal rhythm and training-day fuel', schedule: ['heavy', 'skill', 'rest', 'heavy', 'skill', 'rest', 'rest'] },
  { phase: 'Foundation', focus: 'Build consistent pre-session carbohydrate intake', schedule: ['skill', 'heavy', 'rest', 'skill', 'heavy', 'rest', 'rest'] },
  { phase: 'Foundation', focus: 'Support higher strength volume', schedule: ['heavy', 'rest', 'heavy', 'skill', 'heavy', 'rest', 'skill'] },
  { phase: 'Foundation', focus: 'Consolidate recovery habits', schedule: ['skill', 'heavy', 'rest', 'heavy', 'skill', 'rest', 'rest'] },
  { phase: 'Build', focus: 'Increase fuel around power sessions', schedule: ['heavy', 'skill', 'heavy', 'rest', 'heavy', 'skill', 'rest'] },
  { phase: 'Build', focus: 'Match nutrition to the highest training volume', schedule: ['heavy', 'heavy', 'rest', 'skill', 'heavy', 'skill', 'rest'] },
  { phase: 'Build', focus: 'Maintain protein while cycling carbohydrate', schedule: ['skill', 'heavy', 'rest', 'heavy', 'heavy', 'rest', 'skill'] },
  { phase: 'Build', focus: 'Recover from accumulated training load', schedule: ['heavy', 'rest', 'skill', 'heavy', 'skill', 'rest', 'rest'] },
  { phase: 'Performance', focus: 'Fuel speed and high-quality power output', schedule: ['heavy', 'skill', 'heavy', 'rest', 'skill', 'heavy', 'rest'] },
  { phase: 'Performance', focus: 'Practice competition-day fueling', schedule: ['skill', 'heavy', 'rest', 'skill', 'heavy', 'rest', 'rest'] },
  { phase: 'Peak', focus: 'Maintain output while training volume tapers', schedule: ['heavy', 'rest', 'skill', 'rest', 'heavy', 'rest', 'skill'] },
  { phase: 'Peak', focus: 'Arrive at reassessment recovered and well fueled', schedule: ['skill', 'rest', 'heavy', 'rest', 'skill', 'rest', 'rest'] },
]

function mealForDay(meal, dayType) {
  return { ...meal, ...(meal.dayTypeAdjustments?.[dayType] ?? {}) }
}

export default function NutritionPlan() {
  const { data: plan, loading } = useNutrition()
  const [weekIndex, setWeekIndex] = useState(5)
  const [dayIndex, setDayIndex] = useState(0)
  const [openMeal, setOpenMeal] = useState(null)
  const [weekPickerOpen, setWeekPickerOpen] = useState(false)

  if (loading || !plan) {
    return <div className="space-y-4">{[...Array(4)].map((_, index) => <div key={index} className="skeleton h-24 rounded-xl" />)}</div>
  }

  const week = WEEK_CONFIGS[weekIndex]
  const dayType = week.schedule[dayIndex]
  const dayPlan = plan.dayTypes[dayType]
  const meals = plan.meals.map((meal) => mealForDay(meal, dayType)).filter((meal) => meal.calories > 0)

  const changeWeek = (nextIndex) => {
    setWeekIndex(Math.max(0, Math.min(WEEK_CONFIGS.length - 1, nextIndex)))
    setDayIndex(0)
    setOpenMeal(null)
  }

  return (
    <div className="space-y-6 animate-fade-in nutrition-print-area">
      <section className="card p-5 border-red-glow">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="label block mb-1">Coach-Prescribed Nutrition</span>
            <h2 className="text-tp-white font-bold text-lg">{plan.name}</h2>
            <p className="text-tp-soft text-xs mt-1">12-week plan · Assigned by {plan.assignedBy}</p>
          </div>
          <button type="button" onClick={() => window.print()} className="w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 rounded-lg border border-tp-border text-tp-soft hover:text-tp-white hover:border-tp-border-bright inline-flex items-center justify-center gap-2 print:hidden" aria-label="Download selected week as PDF">
            <Download size={15} />
            <span className="hidden sm:inline text-xs font-semibold">Download PDF</span>
          </button>
        </div>
      </section>

      <section className="card p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <button type="button" disabled={weekIndex === 0} onClick={() => changeWeek(weekIndex - 1)} className="w-9 h-9 rounded-lg bg-tp-raised text-tp-soft disabled:opacity-30 flex items-center justify-center print:hidden" aria-label="Previous week">
            <ChevronLeft size={16} />
          </button>
          <div className="text-center">
            <p className="text-tp-white font-bold">Week {weekIndex + 1} of 12</p>
            <p className="text-tp-red text-xs font-semibold mt-0.5">{week.phase} · {week.focus}</p>
          </div>
          <button type="button" disabled={weekIndex === 11} onClick={() => changeWeek(weekIndex + 1)} className="w-9 h-9 rounded-lg bg-tp-raised text-tp-soft disabled:opacity-30 flex items-center justify-center print:hidden" aria-label="Next week">
            <ChevronRight size={16} />
          </button>
        </div>

        <button type="button" onClick={() => setWeekPickerOpen(true)} className="sm:hidden w-full min-h-11 rounded-lg border border-tp-border bg-tp-raised text-tp-white text-xs font-semibold flex items-center justify-center gap-2 print:hidden">
          Choose another week <ChevronDown size={14} />
        </button>

        <div className="hidden sm:grid sm:grid-cols-12 gap-1.5 print:hidden" aria-label="Nutrition plan weeks">
          {WEEK_CONFIGS.map((item, index) => (
            <button key={index} type="button" onClick={() => changeWeek(index)} title={`${item.phase}: ${item.focus}`} className={clsx('h-9 rounded-lg border text-xs font-mono font-bold transition-colors', index === weekIndex ? 'border-tp-red bg-tp-red text-white' : 'border-tp-border bg-tp-raised text-tp-muted hover:text-tp-white')}>
              {index + 1}
            </button>
          ))}
        </div>
      </section>

      {weekPickerOpen && (
        <div className="sm:hidden fixed inset-0 z-[70] bg-black/75 flex items-end print:hidden" onClick={(event) => event.target === event.currentTarget && setWeekPickerOpen(false)}>
          <section className="w-full bg-tp-surface border-t border-tp-border rounded-t-xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between mb-4"><div><h2 className="text-tp-white font-semibold">Choose plan week</h2><p className="text-tp-muted text-xs mt-1">Your coach's 12-week nutrition progression</p></div><button type="button" onClick={() => setWeekPickerOpen(false)} className="text-tp-red text-xs font-semibold">Done</button></div>
            <div className="grid grid-cols-4 gap-2">{WEEK_CONFIGS.map((item, index) => <button key={index} type="button" onClick={() => { changeWeek(index); setWeekPickerOpen(false) }} className={clsx('min-h-14 rounded-lg border text-left px-3', index === weekIndex ? 'border-tp-red bg-tp-red/10' : 'border-tp-border bg-tp-raised')}><span className={clsx('font-mono text-sm font-bold', index === weekIndex ? 'text-tp-red' : 'text-tp-white')}>W{index + 1}</span><span className="block text-tp-muted text-[9px] mt-1">{item.phase}</span></button>)}</div>
          </section>
        </div>
      )}

      <section>
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <h3 className="text-tp-white font-semibold">Weekly schedule</h3>
            <p className="text-tp-soft text-xs mt-1">Select a day to see its full meal schedule.</p>
          </div>
          <span className="text-tp-muted text-xs">Read only</span>
        </div>
        <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-2 overflow-x-auto pb-2 snap-x">
          {week.schedule.map((type, index) => (
            <button key={`${DAYS[index]}-${type}`} type="button" onClick={() => { setDayIndex(index); setOpenMeal(null) }} className={clsx('min-w-[112px] sm:min-w-0 min-h-20 sm:min-h-24 rounded-lg border p-3 text-left transition-colors snap-start', dayIndex === index ? 'border-tp-red bg-tp-red/10' : 'border-tp-border bg-tp-card hover:border-tp-border-bright')}>
              <span className={clsx('text-xs font-bold', dayIndex === index ? 'text-tp-red' : 'text-tp-white')}>{DAYS[index]}</span>
              <p className="text-tp-soft text-[11px] leading-tight mt-2">{plan.dayTypes[type].label}</p>
              <p className="text-tp-muted text-[10px] font-mono mt-1">{plan.dayTypes[type].calories.toLocaleString()} kcal</p>
            </button>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <span className="label block mb-1">{DAYS[dayIndex]} · Week {weekIndex + 1}</span>
                <h3 className="text-tp-white font-bold text-lg">{dayPlan.label}</h3>
                <p className="text-tp-soft text-xs leading-relaxed mt-1">{dayPlan.description}</p>
              </div>
              <div className="grid grid-cols-4 gap-3 text-center flex-shrink-0">
                {[['kcal', dayPlan.calories], ['P', `${dayPlan.protein}g`], ['C', `${dayPlan.carbs}g`], ['F', `${dayPlan.fat}g`]].map(([label, value]) => (
                  <div key={label}><p className="text-tp-white font-mono font-bold text-sm">{value}</p><p className="text-tp-muted text-[10px]">{label}</p></div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {meals.map((meal) => (
              <article key={meal.id} className="card p-4 break-inside-avoid">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2"><h4 className="text-tp-white font-semibold text-sm">{meal.name}</h4><span className="text-tp-muted text-xs">{meal.time}</span></div>
                    <p className="text-tp-soft text-xs mt-1">{meal.purpose}</p>
                  </div>
                  <p className="text-tp-white text-xs font-mono flex-shrink-0">{meal.calories} kcal · P {meal.protein}g · C {meal.carbs}g · F {meal.fat}g</p>
                </div>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {meal.items.map((item) => <li key={item} className="bg-tp-raised border border-tp-border rounded px-2 py-1 text-tp-soft text-xs">{item}</li>)}
                </ul>
                {meal.alternatives?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-tp-border">
                    <button type="button" onClick={() => setOpenMeal(openMeal === meal.id ? null : meal.id)} className="flex items-center gap-1.5 text-tp-red text-xs font-semibold print:hidden">
                      <ChevronDown size={13} className={clsx('transition-transform', openMeal === meal.id && 'rotate-180')} /> Coach-approved alternatives
                    </button>
                    <div className={clsx('mt-2 space-y-1.5', openMeal !== meal.id && 'hidden print:block')}>
                      {meal.alternatives.map((alternative) => <p key={alternative} className="text-tp-soft text-xs">· {alternative}</p>)}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card p-4 border-tp-amber/30">
            <div className="flex items-center gap-2 mb-2"><Info size={14} className="text-tp-amber" /><h3 className="text-tp-amber font-semibold text-sm">Coach's note</h3></div>
            <p className="text-tp-soft text-xs leading-relaxed">{plan.trainerNote}</p>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3"><Lightbulb size={14} className="text-tp-red" /><h3 className="text-tp-white font-semibold text-sm">Why this plan</h3></div>
            <div className="space-y-3">{plan.planReasoning.map((item) => <div key={item.title}><p className="text-tp-white text-xs font-semibold">{item.title}</p><p className="text-tp-soft text-xs leading-relaxed mt-1">{item.text}</p></div>)}</div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3"><Droplets size={14} className="text-tp-green" /><h3 className="text-tp-white font-semibold text-sm">Hydration</h3></div>
            <ul className="space-y-2">{plan.hydration.map((item) => <li key={item} className="text-tp-soft text-xs leading-relaxed">· {item}</li>)}</ul>
          </div>
        </aside>
      </section>
    </div>
  )
}