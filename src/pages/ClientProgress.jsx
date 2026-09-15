import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity, ArrowUpRight, CalendarDays, Camera, Check, ChevronDown,
  ChevronRight, Clock, Dumbbell, Image, MessageCircle, Target, Trophy,
} from 'lucide-react'
import clsx from 'clsx'
import {
  Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { useAssessments, useGoals, usePerformance, useTraining } from '../hooks/useApi'

const CHANGE_METRICS = [
  { label: 'Performance score', baseline: '51', current: '62', delta: '+11 pts', detail: 'Across four completed assessments', to: '/performance' },
  { label: 'CMJ height', baseline: '46 cm', current: '52 cm', delta: '+6 cm', detail: 'Lower-body explosive output', to: '/assessment' },
  { label: 'Relative force', baseline: '2.8× BW', current: '3.2× BW', delta: '+0.4×', detail: 'Force normalized to body weight', to: '/assessment' },
  { label: 'Bilateral symmetry', baseline: '82%', current: '94%', delta: '+12%', detail: 'Measured left-right balance', to: '/assessment' },
]

const MILESTONES = [
  { label: 'Baseline', date: '15 Jan', title: 'Starting profile established', detail: 'Performance score 51 · initial testing complete', status: 'complete', to: '/assessment' },
  { label: 'Foundation', date: '01 Apr', title: 'Movement base completed', detail: 'Adherence improved and strength work progressed', status: 'complete', to: '/training' },
  { label: 'Power block', date: 'Now · Week 6', title: 'Explosive output in progress', detail: 'CMJ and force production are trending upward', status: 'current', to: '/training' },
  { label: 'Reassessment', date: '14 Aug', title: 'Next evidence checkpoint', detail: 'Repeat force, jump, symmetry and aerobic tests', status: 'upcoming', to: '/assessment' },
]

const LOAD_HISTORY = [
  { week: 'W1', load: 1320, rpe: 6.2 }, { week: 'W2', load: 1480, rpe: 6.5 },
  { week: 'W3', load: 1550, rpe: 6.8 }, { week: 'W4', load: 1430, rpe: 6.4 },
  { week: 'W5', load: 1680, rpe: 7.1 }, { week: 'W6', load: 1740, rpe: 7.0 },
]

function GoalCard({ goal }) {
  const status = {
    on_track: ['On track', 'text-tp-green bg-tp-green/10 border-tp-green/25', 'bg-tp-green'],
    needs_attention: ['Coach review', 'text-tp-amber bg-tp-amber/10 border-tp-amber/25', 'bg-tp-amber'],
    achieved: ['Achieved', 'text-tp-red bg-tp-red/10 border-tp-red/25', 'bg-tp-red'],
  }[goal.status] ?? ['Active', 'text-tp-soft bg-tp-raised border-tp-border', 'bg-tp-red']

  return (
    <article className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-tp-white text-sm font-semibold">{goal.title}</p><p className="text-tp-muted text-xs mt-1">{goal.description}</p></div>
        <span className={clsx('border rounded-full px-2 py-1 text-[10px] font-bold whitespace-nowrap', status[1])}>{status[0]}</span>
      </div>
      <div className="flex items-end justify-between gap-3 mt-5"><div><p className="text-tp-muted text-[10px] uppercase">Current</p><p className="text-tp-white font-mono font-bold text-xl">{goal.current} <span className="text-xs font-normal text-tp-muted">{goal.unit}</span></p></div><div className="text-right"><p className="text-tp-muted text-[10px] uppercase">Target</p><p className="text-tp-soft font-mono text-sm">{goal.target} {goal.unit}</p></div></div>
      <div className="h-1.5 bg-tp-raised rounded-full overflow-hidden mt-3"><div className={clsx('h-full rounded-full', status[2])} style={{ width: `${Math.min(goal.progress, 100)}%` }} /></div>
      <div className="flex items-center justify-between mt-3"><span className="text-tp-muted text-[10px]">Evidence: latest assessment</span><Link to="/assessment" className="text-tp-red text-[11px] font-semibold">View result →</Link></div>
    </article>
  )
}

function PhotoSlot({ label, file, onSelect }) {
  const input = useRef(null)
  const preview = file ? URL.createObjectURL(file) : null
  return (
    <div className="border border-tp-border bg-tp-card rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-tp-border flex items-center justify-between"><span className="text-tp-white text-xs font-semibold">{label}</span><span className="text-tp-muted text-[9px] uppercase">Optional</span></div>
      <button type="button" onClick={() => input.current?.click()} className="w-full aspect-[3/4] min-h-40 flex items-center justify-center bg-tp-raised/40 hover:bg-tp-raised transition-colors">
        {preview ? <img src={preview} alt={`${label} preview`} className="w-full h-full object-cover" /> : <span className="flex flex-col items-center gap-2 text-tp-muted text-xs"><Camera size={22} />Choose {label.toLowerCase()} photo</span>}
      </button>
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={(event) => onSelect(event.target.files?.[0] ?? null)} />
    </div>
  )
}

function VisualCheckIns() {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [photos, setPhotos] = useState({ front: null, side: null, back: null })
  const [checkIns, setCheckIns] = useState([])
  const complete = photos.front && photos.side && photos.back

  const save = () => {
    if (!complete) return
    setCheckIns((current) => [{ id: Date.now(), date, photos: Object.fromEntries(Object.entries(photos).map(([key, file]) => [key, URL.createObjectURL(file)])) }, ...current])
    setPhotos({ front: null, side: null, back: null })
  }

  return (
    <section className="card overflow-hidden">
      <button type="button" onClick={() => setOpen((current) => !current)} className="w-full p-5 flex items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-3"><span className="w-9 h-9 rounded-lg bg-tp-red/10 border border-tp-red/25 text-tp-red flex items-center justify-center"><Image size={17} /></span><div><h2 className="text-tp-white font-semibold">Visual progress check-ins</h2><p className="text-tp-muted text-xs mt-1">Private, optional milestone photos · {checkIns.length} saved</p></div></div>
        <ChevronDown size={16} className={clsx('text-tp-muted transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="p-5 pt-0 space-y-5 animate-fade-in">
        <div className="border-t border-tp-border pt-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3"><p className="text-tp-soft text-xs leading-relaxed max-w-xl">Use consistent lighting, distance, clothing and pose. Photos are not analyzed or scored; they complement your performance evidence.</p><span className="text-tp-green text-[10px] font-bold uppercase">Private by default</span></div>
        <div className="flex items-end justify-between gap-3"><label><span className="label block mb-2">Check-in date</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="input py-2" /></label><button type="button" disabled={!complete} onClick={save} className="btn-primary px-4 py-2.5 text-xs">Save check-in</button></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{['front', 'side', 'back'].map((key) => <PhotoSlot key={key} label={key[0].toUpperCase() + key.slice(1)} file={photos[key]} onSelect={(file) => setPhotos((current) => ({ ...current, [key]: file }))} />)}</div>
        {checkIns.length === 0 ? <div className="border border-dashed border-tp-border rounded-lg p-5 text-center"><p className="text-tp-muted text-xs">Your first saved set establishes the visual baseline. A second set unlocks comparison.</p></div> : <div><p className="label mb-3">Saved check-ins</p>{checkIns.map((item) => <div key={item.id} className="flex items-center gap-3 border-t border-tp-border py-3"><div className="flex gap-1">{Object.values(item.photos).map((src, index) => <img key={index} src={src} alt="Saved check-in" className="w-9 h-11 object-cover rounded" />)}</div><p className="text-tp-white text-xs">{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>)}</div>}
      </div>}
    </section>
  )
}

function GuidedProgress({ goals, training }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <section>
        <div className="flex items-end justify-between gap-3 mb-3"><div><h2 className="text-tp-white font-semibold">Since your baseline</h2><p className="text-tp-muted text-xs mt-1">The clearest changes across testing and training.</p></div><Link to="/assessment" className="text-tp-red text-xs font-semibold">Open evidence →</Link></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{CHANGE_METRICS.map((metric) => <Link key={metric.label} to={metric.to} className="group card p-4 hover:border-tp-border-bright transition-colors"><p className="label">{metric.label}</p><div className="flex items-baseline gap-2 mt-3"><span className="text-tp-muted font-mono text-xs">{metric.baseline}</span><span className="text-tp-red">→</span><span className="text-tp-white font-mono font-bold text-lg">{metric.current}</span></div><p className="text-tp-green text-xs font-semibold mt-2">{metric.delta}</p><p className="text-tp-muted text-[10px] leading-relaxed mt-3">{metric.detail}</p></Link>)}</div>
      </section>

      <section className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-tp-border"><p className="label">The Twitch feedback loop</p><h2 className="text-tp-white font-semibold mt-1">Your milestone path</h2></div>
        <div className="divide-y divide-tp-border">{MILESTONES.map((milestone, index) => <Link key={milestone.label} to={milestone.to} className="group grid grid-cols-[28px_1fr_auto] sm:grid-cols-[36px_100px_1fr_auto] gap-3 items-start p-4 sm:px-5 hover:bg-tp-raised/40 transition-colors"><span className={clsx('w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-bold', milestone.status === 'complete' ? 'bg-tp-green/10 border-tp-green/30 text-tp-green' : milestone.status === 'current' ? 'bg-tp-red border-tp-red text-white' : 'bg-tp-raised border-tp-border text-tp-muted')}>{milestone.status === 'complete' ? <Check size={12} /> : index + 1}</span><div className="hidden sm:block"><p className="text-tp-white text-xs font-semibold">{milestone.label}</p><p className="text-tp-muted text-[10px] mt-1">{milestone.date}</p></div><div><p className="sm:hidden text-tp-red text-[10px] font-semibold mb-1">{milestone.label} · {milestone.date}</p><p className="text-tp-white text-sm font-semibold">{milestone.title}</p><p className="text-tp-muted text-xs mt-1">{milestone.detail}</p></div><ChevronRight size={14} className="text-tp-muted group-hover:text-tp-red mt-1" /></Link>)}</div>
      </section>

      <section><div className="flex items-end justify-between gap-3 mb-3"><div><h2 className="text-tp-white font-semibold">Coach-set goals</h2><p className="text-tp-muted text-xs mt-1">Targets connected to measurable evidence.</p></div></div><div className="grid md:grid-cols-2 gap-3">{goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}</div></section>

      <section className="grid md:grid-cols-2 gap-4"><div className="card p-5"><div className="flex items-center gap-2"><Trophy size={16} className="text-tp-gold" /><p className="label">Personal bests</p></div><div className="grid grid-cols-2 gap-3 mt-4"><div><p className="text-tp-white font-mono font-bold text-xl">52 cm</p><p className="text-tp-muted text-xs">CMJ height</p></div><div><p className="text-tp-white font-mono font-bold text-xl">100 kg</p><p className="text-tp-muted text-xs">Back squat · 5 reps</p></div></div><Link to="/assessment" className="text-tp-red text-xs font-semibold inline-flex items-center gap-1 mt-5">View verified results <ArrowUpRight size={13} /></Link></div><div className="card p-5"><div className="flex items-center gap-2"><Dumbbell size={16} className="text-tp-red" /><p className="label">Training consistency</p></div><p className="text-tp-white font-mono font-bold text-2xl mt-4">5 / 6</p><p className="text-tp-soft text-xs mt-1">prescribed sessions completed in the last 30 days</p><p className="text-tp-muted text-xs mt-3">Moved workouts still count when completed on another day or while traveling.</p><Link to="/training" className="text-tp-red text-xs font-semibold inline-flex items-center gap-1 mt-4">Open session history <ArrowUpRight size={13} /></Link></div></section>
    </div>
  )
}

function AdvancedProgress({ perf, assessments, training }) {
  const assessmentData = assessments.filter((item) => item.composite != null).reverse().map((item) => ({ date: new Date(item.date).toLocaleDateString('en-IN', { month: 'short' }), score: item.composite }))
  return (
    <div className="space-y-5 animate-fade-in">
      <section className="grid lg:grid-cols-2 gap-4"><div className="card p-4"><div className="flex items-center justify-between"><div><p className="label">Assessment trend</p><p className="text-tp-muted text-xs mt-1">Composite score across completed tests</p></div><Link to="/assessment" className="text-tp-red text-xs">Full assessments →</Link></div><div className="h-56 mt-4"><ResponsiveContainer width="100%" height="100%"><AreaChart data={assessmentData} margin={{ left: -20, right: 8 }}><defs><linearGradient id="progressScore" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#e63946" stopOpacity={0.35} /><stop offset="95%" stopColor="#e63946" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#1e1e1e" vertical={false} /><XAxis dataKey="date" tick={{ fill: '#777', fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis domain={[45, 70]} tick={{ fill: '#777', fontSize: 10 }} axisLine={false} tickLine={false} /><Tooltip /><Area dataKey="score" stroke="#e63946" fill="url(#progressScore)" strokeWidth={2.5} /></AreaChart></ResponsiveContainer></div></div><div className="card p-4"><p className="label">Training load and effort</p><p className="text-tp-muted text-xs mt-1">Weekly session load with average RPE context</p><div className="h-56 mt-4"><ResponsiveContainer width="100%" height="100%"><LineChart data={LOAD_HISTORY} margin={{ left: -20, right: 8 }}><CartesianGrid stroke="#1e1e1e" vertical={false} /><XAxis dataKey="week" tick={{ fill: '#777', fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis yAxisId="load" tick={{ fill: '#777', fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis yAxisId="rpe" orientation="right" domain={[0, 10]} hide /><Tooltip /><Line yAxisId="load" dataKey="load" name="Session load" stroke="#e63946" strokeWidth={2.5} dot={{ fill: '#e63946' }} /><Line yAxisId="rpe" dataKey="rpe" name="Average RPE" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 3" dot={false} /></LineChart></ResponsiveContainer></div></div></section>
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">{CHANGE_METRICS.map((metric) => <div key={metric.label} className="card p-4"><p className="label">{metric.label}</p><p className="text-tp-white font-mono font-bold text-xl mt-3">{metric.current}</p><p className="text-tp-green text-xs mt-1">{metric.delta} from baseline</p><p className="text-tp-muted text-[10px] mt-3">Protocol-consistent comparison</p></div>)}</section>
      <section className="card p-5"><div className="flex items-center justify-between"><div><p className="label">Execution context</p><h2 className="text-tp-white font-semibold mt-1">Program adherence and session history</h2></div><Link to="/training" className="text-tp-red text-xs">Open history →</Link></div><div className="grid grid-cols-3 gap-3 mt-5"><div><p className="text-tp-white font-mono font-bold text-xl">83%</p><p className="text-tp-muted text-xs">30-day adherence</p></div><div><p className="text-tp-white font-mono font-bold text-xl">7.0</p><p className="text-tp-muted text-xs">Average RPE</p></div><div><p className="text-tp-white font-mono font-bold text-xl">3</p><p className="text-tp-muted text-xs">Sessions this week</p></div></div></section>
    </div>
  )
}

export default function ClientProgress() {
  const { user } = useAuth()
  const { data: goalsData, loading: goalsLoading } = useGoals()
  const { data: assessments, loading: assessmentLoading } = useAssessments()
  const { data: perf, loading: performanceLoading } = usePerformance()
  const { data: training, loading: trainingLoading } = useTraining()
  const [mode, setMode] = useState('guided')

  if (goalsLoading || assessmentLoading || performanceLoading || trainingLoading || !goalsData || !assessments || !perf || !training) return <div className="space-y-4">{[...Array(4)].map((_, index) => <div key={index} className="skeleton h-24 rounded-xl" />)}</div>

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="card border-l-4 border-tp-red p-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5"><div><p className="text-tp-red text-[10px] font-bold uppercase">Your performance journey</p><h1 className="text-tp-white font-bold text-2xl mt-2">{training.phase}</h1><p className="text-tp-soft text-xs mt-1">{user?.name} · Week {training.week} of {training.totalWeeks}</p></div><div className="flex bg-tp-raised border border-tp-border rounded-lg p-1 self-start" aria-label="Progress detail level">{['guided', 'advanced'].map((option) => <button key={option} type="button" onClick={() => setMode(option)} className={clsx('px-4 py-2 rounded text-xs font-semibold capitalize', mode === option ? 'bg-tp-red text-white' : 'text-tp-muted hover:text-tp-white')}>{option}</button>)}</div></div>
        <div className="mt-5 pt-4 border-t border-tp-border grid sm:grid-cols-[1fr_auto] gap-4 items-center"><div><div className="flex items-center justify-between text-xs"><span className="text-tp-soft">Current block</span><span className="text-tp-white font-mono">{training.week}/{training.totalWeeks} weeks</span></div><div className="h-1.5 bg-tp-raised rounded-full overflow-hidden mt-2"><div className="h-full bg-tp-red" style={{ width: `${training.week / training.totalWeeks * 100}%` }} /></div></div><Link to="/messages" className="text-tp-red text-xs font-semibold inline-flex items-center gap-1"><MessageCircle size={13} /> Check in with coach</Link></div>
      </header>

      {mode === 'guided' ? <GuidedProgress goals={goalsData.goals} training={training} /> : <AdvancedProgress perf={perf} assessments={assessments} training={training} />}
      <VisualCheckIns />
    </div>
  )
}