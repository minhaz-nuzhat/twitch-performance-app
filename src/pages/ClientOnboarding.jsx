import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Activity, Check, ChevronLeft, ChevronRight, Dumbbell,
  HeartPulse, Plane, ShieldCheck, Sparkles, Trophy, Zap,
} from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../context/AuthContext'

const STEPS = ['Your goal', 'Starting point', 'Training', 'Health', 'Your view', 'Review']

const DIRECTION_OPTIONS = [
  { id: 'everyday-performance', icon: Dumbbell, title: 'Build strength and fitness', description: 'Get measurably stronger, fitter and more resilient for everyday life.' },
  { id: 'sport-performance', icon: Trophy, title: 'Perform better in my sport', description: 'Develop the physical qualities that transfer to competition and match demands.' },
  { id: 'performance-pathway', icon: Zap, title: 'Train toward athletic performance', description: 'Move from general training into structured, test-led athletic development.' },
  { id: 'longevity', icon: HeartPulse, title: 'Build long-term capacity', description: 'Protect strength, movement quality and work capacity across the years.' },
]

const CONTEXT_OPTIONS = [
  ['general-fitness', 'General fitness'],
  ['recreational-sport', 'Recreational sport'],
  ['competitive-amateur', 'Competitive athlete'],
  ['professional', 'Professional / elite'],
  ['returning', 'Returning to training'],
]

const SCHEDULE_OPTIONS = [
  { id: 'coach-led', title: 'Mostly fixed', description: 'I usually follow the days my coach assigns.', icon: Dumbbell },
  { id: 'flexible', title: 'Flexible week', description: 'I need to move prescribed sessions between days.', icon: Activity },
  { id: 'travel', title: 'Studio + travel', description: 'I often complete prescribed workouts at other gyms.', icon: Plane },
]

const HEALTH_FLAGS = [
  ['knee', 'Knee'], ['shoulder', 'Shoulder'], ['back', 'Back'],
  ['hip', 'Hip'], ['ankle', 'Ankle / Achilles'], ['other', 'Other'],
]

function ChoiceCard({ selected, icon: Icon, title, description, onClick }) {
  return (
    <button type="button" onClick={onClick} className={clsx('w-full min-h-28 rounded-lg border p-4 text-left transition-colors flex items-start gap-3', selected ? 'border-tp-red bg-tp-red/10' : 'border-tp-border bg-tp-card hover:border-tp-border-bright')}>
      <span className={clsx('w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0', selected ? 'border-tp-red/40 bg-tp-red/15 text-tp-red' : 'border-tp-border bg-tp-raised text-tp-soft')}><Icon size={17} /></span>
      <span className="min-w-0 flex-1"><span className="text-tp-white text-sm font-semibold block">{title}</span><span className="text-tp-soft text-xs leading-relaxed block mt-1">{description}</span></span>
      <span className={clsx('w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0', selected ? 'border-tp-red bg-tp-red text-white' : 'border-tp-border')}>{selected && <Check size={12} />}</span>
    </button>
  )
}

function ViewExample({ mode, selected, onSelect }) {
  const guided = mode === 'guided'
  return (
    <button type="button" onClick={onSelect} className={clsx('rounded-lg border text-left overflow-hidden transition-colors', selected ? 'border-tp-red shadow-[0_0_20px_rgba(230,57,70,0.12)]' : 'border-tp-border hover:border-tp-border-bright')}>
      <div className={clsx('px-4 py-3 border-b flex items-center justify-between', selected ? 'bg-tp-red/10 border-tp-red/25' : 'bg-tp-card border-tp-border')}>
        <div><p className="text-tp-white text-sm font-bold">{guided ? 'Guided' : 'Advanced'}</p><p className="text-tp-muted text-[11px] mt-0.5">{guided ? 'Meaning and action first' : 'Measurements and protocols first'}</p></div>
        <span className={clsx('w-5 h-5 rounded-full border flex items-center justify-center', selected ? 'bg-tp-red border-tp-red' : 'border-tp-border')}>{selected && <Check size={12} className="text-white" />}</span>
      </div>
      <div className="bg-tp-raised p-4 min-h-64">
        <p className="label">Assessment result</p>
        {guided ? (
          <div className="mt-4 space-y-4">
            <div><p className="text-tp-green text-xs font-semibold">WHAT IMPROVED</p><p className="text-tp-white font-bold mt-1">Your explosive power increased</p><p className="text-tp-soft text-xs leading-relaxed mt-1">You jumped 6 cm higher than at your baseline assessment.</p></div>
            <div className="border-l-2 border-tp-red pl-3"><p className="text-tp-white text-xs font-semibold">What your coach changed</p><p className="text-tp-soft text-xs leading-relaxed mt-1">Continue the current plyometric block and maintain full recovery between efforts.</p></div>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div><p className="text-tp-muted text-[10px]">CMJ HEIGHT</p><p className="text-tp-white font-mono font-bold text-2xl">46 → 52 <span className="text-xs text-tp-muted">cm</span></p><p className="text-tp-green text-xs">+13.0% from baseline</p></div>
            <div className="grid grid-cols-2 gap-2"><div className="bg-tp-card border border-tp-border rounded p-2"><p className="text-tp-muted text-[9px]">PEAK POWER</p><p className="text-tp-white font-mono text-sm mt-1">48.2 W/kg</p></div><div className="bg-tp-card border border-tp-border rounded p-2"><p className="text-tp-muted text-[9px]">REL. FORCE</p><p className="text-tp-white font-mono text-sm mt-1">2.4× BW</p></div></div>
            <p className="text-tp-muted text-[10px] leading-relaxed">Protocol: hands-on-hips CMJ · Force plate verified · Same equipment as baseline</p>
          </div>
        )}
      </div>
    </button>
  )
}

export default function ClientOnboarding() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [welcome, setWelcome] = useState(true)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    primaryGoal: user?.clientProfile?.primaryGoal ?? 'performance-pathway',
    athleteContext: user?.clientProfile?.athleteContext ?? 'general-fitness',
    sport: user?.sport ?? 'Cricket',
    position: user?.position ?? '',
    trainingAge: user?.clientProfile?.trainingAge ?? '1-3 years',
    seasonPhase: user?.clientProfile?.seasonPhase ?? 'General preparation',
    sessionsPerWeek: user?.clientProfile?.sessionsPerWeek ?? 3,
    scheduleStyle: user?.clientProfile?.scheduleStyle ?? 'flexible',
    preferredTime: user?.clientProfile?.preferredTime ?? 'Morning',
    photoCheckIns: user?.preferences?.photoCheckIns ?? true,
    healthFlags: user?.clientProfile?.healthFlags ?? [],
    healthNotes: user?.clientProfile?.healthNotes ?? '',
    insightMode: user?.preferences?.insightMode ?? 'guided',
    coachingConsent: true,
    researchConsent: user?.preferences?.researchConsent ?? false,
  })

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const toggleHealth = (flag) => setField('healthFlags', form.healthFlags.includes(flag) ? form.healthFlags.filter((item) => item !== flag) : [...form.healthFlags, flag])

  const complete = () => {
    updateUser({
      onboardingCompleted: true,
      sport: form.sport,
      position: form.position,
      clientProfile: {
        primaryGoal: form.primaryGoal,
        athleteContext: form.athleteContext,
        trainingAge: form.trainingAge,
        seasonPhase: form.seasonPhase,
        sessionsPerWeek: form.sessionsPerWeek,
        scheduleStyle: form.scheduleStyle,
        preferredTime: form.preferredTime,
        healthFlags: form.healthFlags,
        healthNotes: form.healthNotes,
      },
      preferences: {
        insightMode: form.insightMode,
        photoCheckIns: form.photoCheckIns,
        researchConsent: form.researchConsent,
      },
      consents: {
        coachingData: form.coachingConsent,
        anonymizedResearch: form.researchConsent,
        recordedAt: new Date().toISOString(),
      },
    })
    navigate('/', { replace: true })
  }

  if (welcome) {
    return (
      <main className="min-h-screen bg-tp-black text-tp-white flex flex-col">
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#e63946 1px, transparent 1px), linear-gradient(90deg, #e63946 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Zap size={21} className="text-tp-red fill-tp-red" />
              <span className="font-bold text-lg">Twitch<span className="text-tp-red">.</span></span>
              <span className="text-tp-muted text-xs border-l border-tp-border pl-2">Performance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-tp-red/15 border border-tp-red/25 flex items-center justify-center text-tp-red text-[10px] font-bold">{user?.trainer?.avatarInitials ?? 'C'}</span>
              <span className="hidden sm:block text-tp-soft text-xs">Invited by {user?.trainer?.name ?? 'your coach'}</span>
            </div>
          </header>

          <section className="flex-1 flex flex-col justify-center py-12 sm:py-16">
            <p className="text-tp-red text-xs font-bold uppercase">Welcome to Twitch Performance</p>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight mt-3 max-w-3xl">
              Your training,<br />measured with purpose.
            </h1>
            <p className="text-tp-soft text-sm sm:text-base leading-relaxed mt-5 max-w-2xl">
              Hi {user?.name?.split(' ')[0] ?? 'there'}. Your coach uses your training, assessments and feedback to build a clearer picture of how you perform and what should come next.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-14 max-w-4xl">
              {[
                { number: '01', title: 'Train with direction', text: 'Follow your coach-built program and adapt its schedule when life or travel changes.' },
                { number: '02', title: 'Understand the why', text: 'See what assessments mean for your workouts, in the level of detail you prefer.' },
                { number: '03', title: 'Prove what works', text: 'Connect each training block to milestones, reassessments and visible progress.' },
              ].map((item) => (
                <div key={item.number} className="border-t border-tp-border pt-4">
                  <span className="text-tp-red font-mono text-xs font-bold">{item.number}</span>
                  <h2 className="text-tp-white text-sm font-semibold mt-3">{item.title}</h2>
                  <p className="text-tp-muted text-xs leading-relaxed mt-2">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <footer className="border-t border-tp-border pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div><p className="text-tp-white text-sm font-semibold">First, make the platform yours.</p><p className="text-tp-muted text-xs mt-1">About 3 minutes · You can change these choices later.</p></div>
            <button type="button" onClick={() => setWelcome(false)} className="btn-primary inline-flex items-center justify-center gap-2">
              Set up my experience <ChevronRight size={16} />
            </button>
          </footer>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-tp-black text-tp-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2"><Zap size={20} className="text-tp-red fill-tp-red" /><span className="font-bold">Twitch<span className="text-tp-red">.</span></span><span className="text-tp-muted text-xs border-l border-tp-border pl-2">Your setup</span></div>
          <p className="text-tp-muted text-xs">About 3 minutes</p>
        </header>

        <div className="mt-7">
          <div className="flex items-center gap-1.5">{STEPS.map((label, index) => <div key={label} className="flex-1"><div className={clsx('h-1 rounded-full', index <= step ? 'bg-tp-red' : 'bg-tp-raised')} /><p className={clsx('hidden sm:block text-[10px] mt-2', index === step ? 'text-tp-white' : 'text-tp-muted')}>{label}</p></div>)}</div>
          <p className="sm:hidden text-tp-muted text-xs mt-2">Step {step + 1} of {STEPS.length} · {STEPS[step]}</p>
        </div>

        <section className="mt-9 min-h-[510px]">
          {step === 0 && <div className="animate-fade-in"><p className="text-tp-red text-xs font-semibold">YOUR GOAL</p><h1 className="text-2xl sm:text-3xl font-bold mt-2">What do you want training to help you achieve?</h1><p className="text-tp-soft text-sm mt-2 max-w-2xl">This changes which milestones, testing insights and coaching priorities appear first. It does not limit what you can access.</p><div className="grid sm:grid-cols-2 gap-3 mt-7">{DIRECTION_OPTIONS.map((option) => <ChoiceCard key={option.id} {...option} selected={form.primaryGoal === option.id} onClick={() => setField('primaryGoal', option.id)} />)}</div></div>}

          {step === 1 && <div className="animate-fade-in"><p className="text-tp-red text-xs font-semibold">YOUR STARTING POINT</p><h1 className="text-2xl sm:text-3xl font-bold mt-2">Which description best matches you today?</h1><p className="text-tp-soft text-sm mt-2">Your current level and sport give your coach context. They do not define your potential.</p><div className="mt-7"><p className="label mb-2">My current training context</p><div className="flex flex-wrap gap-2">{CONTEXT_OPTIONS.map(([id, label]) => <button key={id} type="button" onClick={() => setField('athleteContext', id)} className={clsx('px-3 py-2.5 rounded-lg border text-xs font-semibold', form.athleteContext === id ? 'bg-tp-red/15 border-tp-red text-tp-red' : 'bg-tp-card border-tp-border text-tp-soft')}>{label}</button>)}</div></div><div className="grid sm:grid-cols-2 gap-4 mt-6"><label><span className="label block mb-2">Primary sport or activity</span><input className="input" value={form.sport} onChange={(event) => setField('sport', event.target.value)} /></label><label><span className="label block mb-2">Position / discipline <span className="normal-case tracking-normal">(optional)</span></span><input className="input" value={form.position} onChange={(event) => setField('position', event.target.value)} placeholder="e.g. Batter, singles player" /></label><label><span className="label block mb-2">Structured training experience</span><select className="input" value={form.trainingAge} onChange={(event) => setField('trainingAge', event.target.value)}><option>Less than 1 year</option><option>1-3 years</option><option>3-6 years</option><option>6+ years</option></select></label><label><span className="label block mb-2">Current phase</span><select className="input" value={form.seasonPhase} onChange={(event) => setField('seasonPhase', event.target.value)}><option>General preparation</option><option>Pre-season</option><option>In-season</option><option>Off-season</option><option>Return to training</option></select></label></div></div>}

          {step === 2 && <div className="animate-fade-in"><p className="text-tp-red text-xs font-semibold">HOW TRAINING FITS YOUR LIFE</p><h1 className="text-2xl sm:text-3xl font-bold mt-2">How much flexibility do you need?</h1><p className="text-tp-soft text-sm mt-2">Your coach still prescribes the workouts. This controls how the weekly planner supports rescheduling and travel.</p><div className="grid md:grid-cols-3 gap-3 mt-7">{SCHEDULE_OPTIONS.map((option) => <ChoiceCard key={option.id} {...option} selected={form.scheduleStyle === option.id} onClick={() => setField('scheduleStyle', option.id)} />)}</div><div className="grid sm:grid-cols-3 gap-4 mt-6"><label><span className="label block mb-2">Sessions per week</span><select className="input" value={form.sessionsPerWeek} onChange={(event) => setField('sessionsPerWeek', Number(event.target.value))}>{[2,3,4,5,6].map((count) => <option key={count} value={count}>{count} sessions</option>)}</select></label><label><span className="label block mb-2">Preferred time</span><select className="input" value={form.preferredTime} onChange={(event) => setField('preferredTime', event.target.value)}><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Varies</option></select></label><label className="card p-4 flex items-center justify-between gap-3"><span><span className="text-tp-white text-sm font-semibold block">Photo check-ins</span><span className="text-tp-muted text-xs mt-1 block">Optional milestones shared with your assigned coach</span></span><input type="checkbox" checked={form.photoCheckIns} onChange={(event) => setField('photoCheckIns', event.target.checked)} className="w-4 h-4 accent-tp-red" /></label></div></div>}

          {step === 3 && <div className="animate-fade-in"><p className="text-tp-red text-xs font-semibold">HEALTH CONTEXT</p><h1 className="text-2xl sm:text-3xl font-bold mt-2">Anything your coach should account for?</h1><p className="text-tp-soft text-sm mt-2 max-w-2xl">Select areas with current pain, recurring issues or significant injury history. This is coaching context, not a diagnosis.</p><div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-7">{HEALTH_FLAGS.map(([id, label]) => <button key={id} type="button" onClick={() => toggleHealth(id)} className={clsx('min-h-12 rounded-lg border px-3 text-left text-sm flex items-center justify-between', form.healthFlags.includes(id) ? 'border-tp-amber bg-tp-amber/10 text-tp-amber' : 'border-tp-border bg-tp-card text-tp-soft')}>{label}{form.healthFlags.includes(id) && <Check size={14} />}</button>)}</div><label className="block mt-5"><span className="label block mb-2">Notes for your coach <span className="normal-case tracking-normal">(optional)</span></span><textarea className="input min-h-28 resize-none" value={form.healthNotes} onChange={(event) => setField('healthNotes', event.target.value)} placeholder="What happened, when it affects you, and any advice you have received." /></label></div>}

          {step === 4 && <div className="animate-fade-in"><p className="text-tp-red text-xs font-semibold">CHOOSE YOUR DEFAULT VIEW</p><h1 className="text-2xl sm:text-3xl font-bold mt-2">How should we explain your performance?</h1><p className="text-tp-soft text-sm mt-2 max-w-2xl">Both views contain the same science and coach interpretation. Choose what you want to see first.</p><div className="grid md:grid-cols-2 gap-4 mt-7"><ViewExample mode="guided" selected={form.insightMode === 'guided'} onSelect={() => setField('insightMode', 'guided')} /><ViewExample mode="advanced" selected={form.insightMode === 'advanced'} onSelect={() => setField('insightMode', 'advanced')} /></div><p className="text-tp-muted text-xs text-center mt-4">You can switch views anytime from Assessment, Progress or Account Settings.</p></div>}

          {step === 5 && <div className="animate-fade-in"><p className="text-tp-red text-xs font-semibold">REVIEW YOUR SETUP</p><h1 className="text-2xl sm:text-3xl font-bold mt-2">Built around how you train</h1><p className="text-tp-soft text-sm mt-2">Your choices shape the order and explanation of your experience, never the quality of the underlying science.</p><div className="grid md:grid-cols-[1fr_0.9fr] gap-5 mt-7"><div className="card divide-y divide-tp-border">{[['Primary direction', DIRECTION_OPTIONS.find((item) => item.id === form.primaryGoal)?.title], ['Current context', CONTEXT_OPTIONS.find(([id]) => id === form.athleteContext)?.[1]], ['Training schedule', `${form.sessionsPerWeek} sessions · ${SCHEDULE_OPTIONS.find((item) => item.id === form.scheduleStyle)?.title}`], ['Performance view', form.insightMode === 'guided' ? 'Guided · meaning first' : 'Advanced · full data first'], ['Visual milestones', form.photoCheckIns ? 'Included' : 'Not included']].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 px-4 py-3"><span className="text-tp-muted text-xs">{label}</span><span className="text-tp-white text-xs font-semibold text-right">{value}</span></div>)}</div><div className="space-y-3"><label className="card p-4 flex items-start gap-3"><input type="checkbox" checked={form.coachingConsent} onChange={(event) => setField('coachingConsent', event.target.checked)} className="mt-1 accent-tp-red" /><span><span className="text-tp-white text-sm font-semibold block">Personal coaching data <span className="text-tp-red">Required</span></span><span className="text-tp-muted text-xs leading-relaxed block mt-1">Allow your assigned coach to use assessments, session logs and readiness data for your program.</span></span></label><label className="card p-4 flex items-start gap-3"><input type="checkbox" checked={form.researchConsent} onChange={(event) => setField('researchConsent', event.target.checked)} className="mt-1 accent-tp-red" /><span><span className="text-tp-white text-sm font-semibold block">Anonymized research <span className="text-tp-muted font-normal">Optional</span></span><span className="text-tp-muted text-xs leading-relaxed block mt-1">Contribute de-identified results to improve future performance benchmarks.</span></span></label><div className="bg-tp-green/10 border border-tp-green/25 rounded-lg p-3 flex gap-2"><ShieldCheck size={16} className="text-tp-green flex-shrink-0" /><p className="text-tp-soft text-xs leading-relaxed">You can change your view, photo and research preferences later.</p></div></div></div></div>}
        </section>

        <footer className="mt-5 pt-5 border-t border-tp-border flex items-center justify-between gap-3">
          <button type="button" disabled={step === 0} onClick={() => setStep((current) => current - 1)} className={clsx('btn-ghost inline-flex items-center gap-2 px-4 py-2.5', step === 0 && 'invisible')}><ChevronLeft size={15} /> Back</button>
          {step < STEPS.length - 1
            ? <button type="button" onClick={() => setStep((current) => current + 1)} className="btn-primary inline-flex items-center gap-2 px-5 py-2.5">Continue <ChevronRight size={15} /></button>
            : <button type="button" disabled={!form.coachingConsent} onClick={complete} className="btn-primary inline-flex items-center gap-2 px-5 py-2.5"><Sparkles size={15} /> Enter my dashboard</button>}
        </footer>
      </div>
    </main>
  )
}