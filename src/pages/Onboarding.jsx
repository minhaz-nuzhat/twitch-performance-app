import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Activity, Heart, Trophy, ShieldCheck, CheckCircle2, ChevronRight, ChevronLeft, Dumbbell, Calendar } from 'lucide-react'
import clsx from 'clsx'

export default function Onboarding() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  // Form State
  const [focusAxis, setFocusAxis] = useState('athletic') // athletic | longevity | hybrid
  const [primarySport, setPrimarySport] = useState('Cricket')
  const [trainingAge, setTrainingAge] = useState('2-4 years')
  const [seasonPhase, setSeasonPhase] = useState('In-season')
  const [injuryFlags, setInjuryFlags] = useState({
    knee: false,
    shoulder: false,
    lowerBack: false,
    ankle: false,
    none: true,
  })
  const [injuryNotes, setInjuryNotes] = useState('')
  const [daysPerWeek, setDaysPerWeek] = useState('3 days')
  const [preferredTime, setPreferredTime] = useState('Morning')
  const [consentPersonal, setConsentPersonal] = useState(true)
  const [consentResearch, setConsentResearch] = useState(true)

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    } else {
      // Save onboarding completed in localStorage session
      const stored = localStorage.getItem('tp_session')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          parsed.onboarded = true
          parsed.focusAxis = focusAxis
          localStorage.setItem('tp_session', JSON.stringify(parsed))
        } catch { /* ignore */ }
      }
      navigate('/')
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-tp-black text-tp-white flex flex-col justify-between p-4 sm:p-8 max-w-2xl mx-auto">
      {/* Top Brand & Step Counter */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Zap size={22} className="text-tp-red fill-tp-red" />
            <span className="text-tp-white font-bold tracking-tight text-lg">
              Twitch<span className="text-tp-red">.</span>
            </span>
            <span className="text-xs uppercase tracking-widest text-tp-muted border-l border-tp-border pl-2 ml-1">
              Onboarding
            </span>
          </div>
          <span className="text-tp-muted text-xs font-mono font-semibold">
            Step {step} of 5
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-tp-raised rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-tp-red transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* ── STEP 1: Focus Orientation ── */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold text-tp-white mb-2">
                What is your primary performance goal?
              </h1>
              <p className="text-tp-soft text-sm">
                Twitch Studio tailors force plate diagnostics and exercise prescriptions around your primary drive.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'athletic',
                  title: 'Athletic Performance & Power',
                  desc: 'Focus on peak force, speed, Rate of Force Development (RFD), and match readiness.',
                  icon: Trophy,
                  accent: 'border-tp-red/40 bg-tp-red/5 text-tp-red',
                },
                {
                  id: 'longevity',
                  title: 'Structural Longevity & Resilience',
                  desc: 'Focus on joint health, bilateral symmetry, mobility, and long-term functional capacity.',
                  icon: Heart,
                  accent: 'border-tp-amber/40 bg-tp-amber/5 text-tp-amber',
                },
                {
                  id: 'hybrid',
                  title: 'Hybrid Athlete (All-Round)',
                  desc: 'Balanced development across strength output, aerobic capacity, and structural balance.',
                  icon: Activity,
                  accent: 'border-tp-green/40 bg-tp-green/5 text-tp-green',
                },
              ].map((opt) => {
                const Icon = opt.icon
                const isSelected = focusAxis === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => setFocusAxis(opt.id)}
                    className={clsx(
                      'w-full text-left p-5 rounded-2xl border transition-all flex items-start gap-4',
                      isSelected
                        ? 'bg-tp-card border-tp-red shadow-lg shadow-tp-red/10'
                        : 'bg-tp-raised/40 border-tp-border hover:border-tp-border-bright',
                    )}
                  >
                    <div className={clsx('p-3 rounded-xl border flex-shrink-0', opt.accent)}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-tp-white font-semibold text-base mb-1">{opt.title}</h3>
                      <p className="text-tp-soft text-xs leading-relaxed">{opt.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── STEP 2: Athletic Context & Lifting History ── */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold text-tp-white mb-2">
                Your Athletic Background
              </h1>
              <p className="text-tp-soft text-sm">
                Helps your coach establish baseline loading models and benchmark expectations.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label block mb-2">Primary Sport / Discipline</label>
                <select
                  value={primarySport}
                  onChange={(e) => setPrimarySport(e.target.value)}
                  className="input cursor-pointer"
                >
                  <option value="Cricket">Cricket</option>
                  <option value="Football/Soccer">Football / Soccer</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Tennis / Badminton">Tennis / Badminton</option>
                  <option value="Running / Endurance">Running / Endurance</option>
                  <option value="General Athletic Fitness">General Athletic Fitness</option>
                </select>
              </div>

              <div>
                <label className="label block mb-2">Structured Training Age (Lifting History)</label>
                <div className="grid grid-cols-3 gap-2">
                  {['< 1 year', '1-3 years', '3+ years'].map((age) => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => setTrainingAge(age)}
                      className={clsx(
                        'py-3 rounded-xl border text-xs font-semibold transition-all',
                        trainingAge === age
                          ? 'bg-tp-red/15 border-tp-red text-tp-red'
                          : 'bg-tp-raised border-tp-border text-tp-soft hover:text-tp-white',
                      )}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label block mb-2">Current Training Phase</label>
                <div className="grid grid-cols-3 gap-2">
                  {['In-season', 'Off-season', 'General Prep'].map((phase) => (
                    <button
                      key={phase}
                      type="button"
                      onClick={() => setSeasonPhase(phase)}
                      className={clsx(
                        'py-3 rounded-xl border text-xs font-semibold transition-all',
                        seasonPhase === phase
                          ? 'bg-tp-red/15 border-tp-red text-tp-red'
                          : 'bg-tp-raised border-tp-border text-tp-soft hover:text-tp-white',
                      )}
                    >
                      {phase}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Biomechanical & Injury Flags ── */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold text-tp-white mb-2">
                Biomechanical &amp; Safety Flags
              </h1>
              <p className="text-tp-soft text-sm">
                Inform your coach of any current soreness or past injuries for safe exercise modifications.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label block mb-2">Do you have active pain or injury history in:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'knee', label: 'Knee / Patellar' },
                    { id: 'shoulder', label: 'Shoulder / Rotator Cuff' },
                    { id: 'lowerBack', label: 'Lower Back / Spine' },
                    { id: 'ankle', label: 'Ankle / Achilles' },
                  ].map((flag) => (
                    <button
                      key={flag.id}
                      type="button"
                      onClick={() =>
                        setInjuryFlags((prev) => ({
                          ...prev,
                          [flag.id]: !prev[flag.id],
                          none: false,
                        }))
                      }
                      className={clsx(
                        'p-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all',
                        injuryFlags[flag.id]
                          ? 'bg-tp-amber/15 border-tp-amber text-tp-amber font-semibold'
                          : 'bg-tp-raised border-tp-border text-tp-soft',
                      )}
                    >
                      {flag.label}
                      {injuryFlags[flag.id] && <CheckCircle2 size={14} className="text-tp-amber" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label block mb-2">Additional Notes for Your Coach (Optional)</label>
                <textarea
                  value={injuryNotes}
                  onChange={(e) => setInjuryNotes(e.target.value)}
                  placeholder="e.g. Right knee tweaks slightly on deep squatting..."
                  className="input min-h-24 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Studio Schedule Setup ── */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold text-tp-white mb-2">
                Studio Training Schedule
              </h1>
              <p className="text-tp-soft text-sm">
                Set your baseline availability so your coach can assign your weekly training blocks.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label block mb-2">Sessions Per Week at Twitch Studio</label>
                <div className="grid grid-cols-3 gap-2">
                  {['2 days', '3 days', '4+ days'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDaysPerWeek(d)}
                      className={clsx(
                        'py-3 rounded-xl border text-xs font-semibold transition-all',
                        daysPerWeek === d
                          ? 'bg-tp-red/15 border-tp-red text-tp-red'
                          : 'bg-tp-raised border-tp-border text-tp-soft hover:text-tp-white',
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label block mb-2">Preferred Training Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Morning', 'Afternoon', 'Evening'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPreferredTime(t)}
                      className={clsx(
                        'py-3 rounded-xl border text-xs font-semibold transition-all',
                        preferredTime === t
                          ? 'bg-tp-red/15 border-tp-red text-tp-red'
                          : 'bg-tp-raised border-tp-border text-tp-soft hover:text-tp-white',
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: Informed Consent ── */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold text-tp-white mb-2">
                Data Protection &amp; Research Consent
              </h1>
              <p className="text-tp-soft text-sm">
                Twitch Performance collects sports science data to optimize your program and build anonymized performance benchmarks.
              </p>
            </div>

            <div className="space-y-3">
              <label className="card p-4 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentPersonal}
                  onChange={(e) => setConsentPersonal(e.target.checked)}
                  className="mt-1 accent-tp-red"
                />
                <div>
                  <h4 className="text-tp-white text-sm font-semibold">Personal Coaching Data</h4>
                  <p className="text-tp-soft text-xs leading-relaxed mt-0.5">
                    Allow your assigned Twitch Studio coach to view force testing, session logs, and readiness scores for programming.
                  </p>
                </div>
              </label>

              <label className="card p-4 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentResearch}
                  onChange={(e) => setConsentResearch(e.target.checked)}
                  className="mt-1 accent-tp-red"
                />
                <div>
                  <h4 className="text-tp-white text-sm font-semibold">Anonymized Performance Research</h4>
                  <p className="text-tp-soft text-xs leading-relaxed mt-0.5">
                    Opt-in to include your anonymized baseline scores in Twitch’s sports science dataset to improve cohort benchmarking.
                  </p>
                </div>
              </label>
            </div>

            <div className="p-4 rounded-xl bg-tp-red/10 border border-tp-red/30 flex items-center gap-3">
              <ShieldCheck size={20} className="text-tp-red flex-shrink-0" />
              <p className="text-tp-soft text-xs">
                You are ready! Completing onboarding will set up your first 6-week milestone cycle on your dashboard.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-tp-border mt-8">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className={clsx(
            'flex items-center gap-1 text-xs font-semibold px-4 py-2.5 rounded-xl border transition-all',
            step === 1
              ? 'opacity-0 pointer-events-none'
              : 'border-tp-border text-tp-soft hover:text-tp-white hover:bg-tp-raised',
          )}
        >
          <ChevronLeft size={16} /> Back
        </button>

        <button
          onClick={handleNext}
          className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold"
        >
          {step === 5 ? 'Complete Onboarding' : 'Continue'}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}