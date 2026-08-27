import { useState } from 'react'
import { X, Moon, Smile, Zap, Wind, Activity } from 'lucide-react'
import clsx from 'clsx'

// Mirrors the Hooper Index wellness battery — all scales run low = bad, high = good
// so the average can be read directly as a readiness figure.
export const READINESS_METRICS = [
  {
    key: 'sleep',
    label: 'Sleep',
    icon: Moon,
    question: 'How well did you sleep?',
    scale: ['Barely slept', 'Poor', 'Okay', 'Good', 'Well rested'],
  },
  {
    key: 'mood',
    label: 'Mood',
    icon: Smile,
    question: 'How is your mood today?',
    scale: ['Very low', 'Low', 'Neutral', 'Good', 'Amazing'],
  },
  {
    key: 'energy',
    label: 'Energy',
    icon: Zap,
    question: 'How are your energy levels?',
    scale: ['Drained', 'Low', 'Moderate', 'High', 'Supercharged'],
  },
  {
    key: 'stress',
    label: 'Stress',
    icon: Wind,
    question: 'How stressed are you feeling?',
    scale: ['Overwhelmed', 'Stressed', 'Manageable', 'Calm', 'Relaxed'],
  },
  {
    key: 'soreness',
    label: 'Soreness',
    icon: Activity,
    question: 'How sore is your body?',
    scale: ['Very sore', 'Sore', 'Some tightness', 'Slight', 'No soreness'],
  },
]

const RATING_COLOR = {
  1: { active: 'bg-tp-danger text-white border-tp-danger', text: 'text-tp-danger' },
  2: { active: 'bg-tp-danger text-white border-tp-danger', text: 'text-tp-danger' },
  3: { active: 'bg-tp-amber text-tp-black border-tp-amber', text: 'text-tp-amber' },
  4: { active: 'bg-tp-green text-tp-black border-tp-green', text: 'text-tp-green' },
  5: { active: 'bg-tp-green text-tp-black border-tp-green', text: 'text-tp-green' },
}

function readinessVerdict(avg) {
  if (avg >= 4.2) return { label: 'Primed', color: 'text-tp-green', advice: 'You are ready to push. Attack the prescribed loads.' }
  if (avg >= 3.4) return { label: 'Ready', color: 'text-tp-green', advice: 'Good to train as prescribed. Stay honest with technique.' }
  if (avg >= 2.6) return { label: 'Train with Control', color: 'text-tp-amber', advice: 'Keep the intensity but trim total volume. Quality over quantity today.' }
  return { label: 'Compromised', color: 'text-tp-danger', advice: 'Consider reducing load 10–20% and skipping accessory work. Your coach will be notified.' }
}

export function ReadinessSurveyModal({ isOpen, onClose, onSubmit, sessionName }) {
  const [ratings, setRatings] = useState({})

  if (!isOpen) return null

  const answered = READINESS_METRICS.filter(m => ratings[m.key]).length
  const allAnswered = answered === READINESS_METRICS.length
  const average = allAnswered
    ? READINESS_METRICS.reduce((sum, m) => sum + ratings[m.key], 0) / READINESS_METRICS.length
    : 0
  const verdict = allAnswered ? readinessVerdict(average) : null

  const handleSubmit = () => {
    onSubmit({ ...ratings, average: Number(average.toFixed(1)), recordedAt: new Date().toISOString() })
    setRatings({})
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-tp-card border border-tp-border rounded-2xl shadow-2xl animate-fade-up max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-tp-border flex-shrink-0">
          <div>
            <h2 className="text-tp-white font-bold text-base">Session Readiness Check</h2>
            <p className="text-tp-soft text-xs mt-0.5">{sessionName} · takes 30 seconds</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close readiness survey"
            className="w-8 h-8 rounded-lg bg-tp-raised flex items-center justify-center text-tp-soft hover:text-tp-white transition-colors flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-3 flex-shrink-0">
          <div className="h-1 rounded-full bg-tp-raised overflow-hidden">
            <div
              className="h-full rounded-full bg-tp-red transition-all duration-300"
              style={{ width: `${(answered / READINESS_METRICS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {READINESS_METRICS.map(({ key, label, icon: Icon, question, scale }) => {
            const value = ratings[key]
            return (
              <div key={key}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} className="text-tp-red flex-shrink-0" />
                  <span className="text-tp-white text-sm font-semibold">{label}</span>
                  <span className="text-tp-soft text-xs">— {question}</span>
                </div>

                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setRatings(r => ({ ...r, [key]: n }))}
                      aria-label={`${label}: ${n} — ${scale[n - 1]}`}
                      className={clsx(
                        'flex-1 h-11 rounded-lg border text-sm font-bold transition-all',
                        value === n
                          ? RATING_COLOR[n].active
                          : 'bg-tp-raised border-tp-border text-tp-soft hover:border-tp-border-bright hover:text-tp-white',
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <p className={clsx(
                  'text-xs mt-1.5 font-medium h-4',
                  value ? RATING_COLOR[value].text : 'text-tp-muted',
                )}>
                  {value ? scale[value - 1] : `1 = ${scale[0]} · 5 = ${scale[4]}`}
                </p>
              </div>
            )
          })}
        </div>

        {/* Verdict + submit */}
        <div className="px-6 py-4 border-t border-tp-border flex-shrink-0 space-y-3">
          {verdict && (
            <div className="bg-tp-raised border border-tp-border rounded-xl p-3 animate-fade-in">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="label">Readiness</span>
                <span className={clsx('font-bold text-sm', verdict.color)}>{verdict.label}</span>
                <span className="text-tp-soft text-xs font-mono ml-auto">{average.toFixed(1)} / 5.0</span>
              </div>
              <p className="text-tp-soft text-xs leading-relaxed">{verdict.advice}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="w-full btn-primary py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {allAnswered ? 'Start Session' : `Rate all 5 to continue (${answered}/5)`}
          </button>

          <p className="text-tp-muted text-xs text-center leading-relaxed">
            Logged against this session so your coach — and future AI suggestions — can spot load and recovery patterns over time.
          </p>
        </div>

      </div>
    </div>
  )
}
