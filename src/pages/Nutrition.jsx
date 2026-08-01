import { useNutrition } from '../hooks/useApi'
import MacroRing from '../components/ui/MacroRing'
import { CheckCircle2, Circle, Info } from 'lucide-react'
import clsx from 'clsx'

export default function Nutrition() {
  const { data: plan, loading } = useNutrition()

  if (loading || !plan) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
  }

  const { targets, todayLog, meals, trainerNote } = plan

  const calPct      = Math.min(Math.round((todayLog.calories / targets.calories) * 100), 100)
  const remaining   = targets.calories - todayLog.calories
  const loggedMeals = meals.filter((m) => m.logged).length

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
            <p className="text-tp-white font-mono font-bold text-2xl">{loggedMeals}/{meals.length}</p>
            <p className="text-tp-muted text-xs">meals logged</p>
          </div>
        </div>
      </div>

      {/* ── Calories + Macros ── */}
      <div className="card p-5">
        <h3 className="text-tp-white font-semibold mb-4">Today's Intake</h3>

        {/* Calorie bar */}
        <div className="mb-5">
          <div className="flex justify-between items-baseline mb-2">
            <div>
              <span className="font-mono font-bold text-3xl text-tp-white">{todayLog.calories}</span>
              <span className="text-tp-muted text-sm ml-1">/ {targets.calories} kcal</span>
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
          <p className="text-tp-muted text-xs mt-1">{calPct}% of daily target consumed</p>
        </div>

        {/* Macro rings */}
        <div className="flex justify-around">
          <MacroRing
            value={todayLog.protein} target={targets.protein}
            label="Protein" color="#e63946" size={90}
          />
          <MacroRing
            value={todayLog.carbs} target={targets.carbs}
            label="Carbs" color="#f59e0b" size={90}
          />
          <MacroRing
            value={todayLog.fat} target={targets.fat}
            label="Fat" color="#22c55e" size={90}
          />
        </div>
      </div>

      {/* ── Trainer Note ── */}
      {trainerNote && (
        <div className="card p-4 border-tp-amber/25 bg-tp-amber/5">
          <div className="flex items-start gap-2">
            <Info size={14} className="text-tp-amber flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-tp-amber text-xs font-semibold mb-0.5">Coach's Note</p>
              <p className="text-tp-soft text-xs leading-relaxed">{trainerNote}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Meal Plan ── */}
      <div>
        <h3 className="text-tp-white font-semibold mb-3">Meal Plan</h3>
        <div className="space-y-3">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className={clsx(
                'card p-4 transition-all',
                meal.logged ? 'border-tp-green/20 bg-tp-green/3' : '',
              )}
            >
              <div className="flex items-start gap-3">
                {/* Log indicator */}
                <div className="flex-shrink-0 mt-0.5">
                  {meal.logged
                    ? <CheckCircle2 size={18} className="text-tp-green" />
                    : <Circle       size={18} className="text-tp-border" />}
                </div>

                {/* Meal info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-tp-white font-medium text-sm">{meal.name}</h4>
                    <span className="text-tp-muted text-xs flex-shrink-0">{meal.time}</span>
                  </div>

                  {/* Macros row */}
                  <div className="flex gap-3 mt-1.5">
                    <span className="text-tp-soft text-xs font-mono">{meal.calories} kcal</span>
                    <span className="text-tp-red text-xs">P: {meal.protein}g</span>
                    <span className="text-tp-amber text-xs">C: {meal.carbs}g</span>
                    <span className="text-tp-green text-xs">F: {meal.fat}g</span>
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
