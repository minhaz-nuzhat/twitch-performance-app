import { useState } from 'react'
import { useNutrition } from '../hooks/useApi'
import MacroRing from '../components/ui/MacroRing'
import { CheckCircle2, Circle, Info, Upload, FileText, Trash2 } from 'lucide-react'
import clsx from 'clsx'

export default function Nutrition() {
  const { data: plan, loading } = useNutrition()
  const [uploadedFiles, setUploadedFiles] = useState([])

  if (loading || !plan) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>
  }

  const { targets, todayLog, meals, trainerNote } = plan

  const calPct      = Math.min(Math.round((todayLog.calories / targets.calories) * 100), 100)
  const remaining   = targets.calories - todayLog.calories
  const loggedMeals = meals.filter((m) => m.logged).length

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
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
