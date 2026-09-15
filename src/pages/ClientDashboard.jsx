import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity, AlertTriangle, ArrowUpRight, CalendarDays, ChevronRight,
  ClipboardCheck, Clock, Dumbbell, MessageCircle, Target, Trophy,
  Utensils, X, Zap,
} from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../context/AuthContext'
import { usePerformance, useTraining } from '../hooks/useApi'
import { mockLeaderboard } from '../data/mockData'
import ScoreRing from '../components/ui/ScoreRing'

function greeting(name) {
  const hour = new Date().getHours()
  const salutation = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  return `${salutation}, ${name?.split(' ')[0]}`
}

const DESTINATIONS = [
  { to: '/training', label: 'Training', detail: 'Plan, schedule and session log', icon: Dumbbell, accent: 'text-tp-red bg-tp-red/10 border-tp-red/25' },
  { to: '/nutrition', label: 'Nutrition', detail: 'Your 12-week fueling schedule', icon: Utensils, accent: 'text-tp-amber bg-tp-amber/10 border-tp-amber/25' },
  { to: '/progress', label: 'Progress', detail: 'Goals, milestones and photos', icon: Target, accent: 'text-tp-green bg-tp-green/10 border-tp-green/25' },
  { to: '/assessment', label: 'Assessments', detail: 'Testing results and comparisons', icon: ClipboardCheck, accent: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25' },
  { to: '/messages', label: 'Coach', detail: 'Messages and feedback', icon: MessageCircle, accent: 'text-tp-white bg-white/5 border-white/15' },
]

function PlatformLink({ item }) {
  const Icon = item.icon
  return (
    <Link
      to={item.to}
      className="group min-w-0 border border-tp-border bg-tp-card rounded-lg p-3.5 hover:border-tp-border-bright hover:bg-tp-raised transition-colors focus:outline-none focus:ring-2 focus:ring-tp-red/60"
      aria-label={`Open ${item.label}: ${item.detail}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={clsx('w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0', item.accent)}>
          <Icon size={17} />
        </span>
        <ArrowUpRight size={14} className="text-tp-muted group-hover:text-tp-red transition-colors" />
      </div>
      <p className="text-tp-white text-sm font-semibold mt-3">{item.label}</p>
      <p className="text-tp-muted text-[11px] leading-snug mt-1">{item.detail}</p>
    </Link>
  )
}

function TodaySession({ training }) {
  if (!training) return <div className="skeleton min-h-64 rounded-xl" />

  const session = training.todaySession
  const completed = session.exercises.filter((exercise) => exercise.completed).length
  const completion = Math.round((completed / session.exercises.length) * 100)

  return (
    <section className="border border-tp-red/35 bg-tp-card rounded-xl overflow-hidden shadow-[0_0_24px_rgba(230,57,70,0.08)]">
      <div className="h-1 bg-tp-red" />
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-tp-red/15 border border-tp-red/25 text-tp-red flex items-center justify-center">
              <Zap size={16} />
            </span>
            <div>
              <p className="label">Your next action</p>
              <p className="text-tp-soft text-xs mt-0.5">Coach-prescribed session</p>
            </div>
          </div>
          <span className="text-tp-muted text-xs font-mono">Week {training.week}/{training.totalWeeks}</span>
        </div>

        <div className="mt-6">
          <p className="text-tp-red text-xs font-semibold">{training.phase}</p>
          <h2 className="text-tp-white text-2xl font-bold mt-1">{session.name}</h2>
          <div className="flex flex-wrap items-center gap-4 text-tp-soft text-xs mt-3">
            <span className="flex items-center gap-1.5"><Clock size={13} />{session.estimatedDuration} min</span>
            <span className="flex items-center gap-1.5"><Dumbbell size={13} />{session.exercises.length} exercises</span>
            <span className="flex items-center gap-1.5"><CalendarDays size={13} />Flexible weekly schedule</span>
          </div>
          <p className="text-tp-soft text-sm leading-relaxed mt-4 max-w-2xl">
            {session.exercises[0]?.notes || 'Follow the prescribed load and record your completed work for your coach.'}
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <Link to="/training" className="btn-primary inline-flex items-center justify-center gap-2">
            <Dumbbell size={16} /> Open session
          </Link>
          <Link to="/training" className="btn-ghost inline-flex items-center justify-center gap-2">
            <CalendarDays size={16} /> Adjust this week
          </Link>
          <div className="sm:ml-auto min-w-32">
            <div className="flex justify-between text-[10px] text-tp-muted mb-1"><span>Session progress</span><span>{completion}%</span></div>
            <div className="h-1.5 bg-tp-raised rounded-full overflow-hidden"><div className="h-full bg-tp-red" style={{ width: `${completion}%` }} /></div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CoachDirection({ perf, trainer }) {
  const focus = perf.priorityFocus
  return (
    <section className="border border-tp-border bg-tp-card rounded-xl p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-tp-red/15 border border-tp-red/25 flex items-center justify-center text-tp-red text-xs font-bold">
            {trainer?.avatarInitials ?? 'C'}
          </span>
          <div><p className="label">Coach direction</p><p className="text-tp-soft text-xs mt-0.5">From {trainer?.name ?? 'your coach'}</p></div>
        </div>
        <Link to="/messages" className="text-tp-muted hover:text-tp-red transition-colors" aria-label="Message your coach"><ArrowUpRight size={16} /></Link>
      </div>
      <p className="text-tp-white font-bold text-lg mt-5">Prioritize {focus.dimension}</p>
      <p className="text-tp-soft text-xs leading-relaxed mt-2">{focus.description}</p>
      <div className="mt-4 pt-4 border-t border-tp-border flex items-center justify-between gap-3">
        <span className="text-tp-muted text-[11px]">Reviewed {focus.coachSource}</span>
        <Link to="/messages" className="text-tp-red text-xs font-semibold inline-flex items-center gap-1">Ask coach <ChevronRight size={13} /></Link>
      </div>
    </section>
  )
}

function RecoveryContext({ perf }) {
  const recovery = perf.recoveryRisk
  const config = {
    Low: 'text-tp-green bg-tp-green/10 border-tp-green/25',
    Moderate: 'text-tp-amber bg-tp-amber/10 border-tp-amber/25',
    High: 'text-tp-danger bg-tp-danger/10 border-tp-danger/25',
  }[recovery.label]

  return (
    <Link to="/performance" className="group border border-tp-border bg-tp-card rounded-xl p-5 hover:border-tp-border-bright transition-colors">
      <div className="flex items-center justify-between gap-3">
        <p className="label">Training load context</p>
        <ArrowUpRight size={15} className="text-tp-muted group-hover:text-tp-red" />
      </div>
      <div className="flex items-end justify-between gap-3 mt-4">
        <div><p className="text-tp-white font-mono font-bold text-2xl">{recovery.acwr}</p><p className="text-tp-muted text-[10px] mt-1">Recent load / baseline</p></div>
        <span className={clsx('border rounded-full px-2.5 py-1 text-[10px] uppercase font-bold', config)}>{recovery.label}</span>
      </div>
      <div className="mt-4 flex items-start gap-2 bg-tp-raised rounded-lg p-3">
        <AlertTriangle size={13} className="text-tp-amber flex-shrink-0 mt-0.5" />
        <p className="text-tp-soft text-xs leading-relaxed">{recovery.description}</p>
      </div>
      <p className="text-tp-red text-xs font-semibold mt-4">See recovery context <ChevronRight size={13} className="inline" /></p>
    </Link>
  )
}

function PerformanceSnapshot({ perf }) {
  const adherence = perf.adherenceWindows.last30d
  return (
    <section className="border border-tp-border bg-tp-card rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-tp-border flex items-center justify-between gap-3">
        <div><h2 className="text-tp-white font-semibold">Performance snapshot</h2><p className="text-tp-muted text-xs mt-1">A simple view of what changed and where to explore.</p></div>
        <Link to="/performance" className="text-tp-red text-xs font-semibold inline-flex items-center gap-1">Full profile <ChevronRight size={14} /></Link>
      </div>
      <div className="grid md:grid-cols-[260px_1fr]">
        <Link to="/performance" className="group p-5 flex items-center gap-4 border-b md:border-b-0 md:border-r border-tp-border hover:bg-tp-raised/40 transition-colors">
          <ScoreRing score={perf.composite} tier={perf.tier} size={82} stroke={8} />
          <div><p className="label">Performance score</p><p className="text-tp-white font-mono font-bold text-2xl mt-1">{perf.composite}</p><p className="text-tp-green text-xs mt-1">+{perf.trendValue} since assessment</p><p className="text-tp-red text-xs font-semibold mt-3">View dimensions <ChevronRight size={12} className="inline" /></p></div>
        </Link>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          <Link to="/assessment" className="group p-4 border-b border-r border-tp-border hover:bg-tp-raised/40 transition-colors">
            <p className="label">Athletic ability</p><p className="text-tp-white font-mono text-2xl font-bold mt-3">{perf.strengthIndex.score}</p><p className="text-tp-green text-xs mt-1">+{perf.strengthIndex.change} latest test</p><p className="text-tp-muted group-hover:text-tp-red text-[11px] mt-4">Open assessment →</p>
          </Link>
          <Link to="/progress" className="group p-4 border-b lg:border-r border-tp-border hover:bg-tp-raised/40 transition-colors">
            <p className="label">Next milestone</p><p className="text-tp-white font-mono text-2xl font-bold mt-3">{perf.nextTierTarget - perf.composite}</p><p className="text-tp-soft text-xs mt-1">points to {perf.nextTierName}</p><p className="text-tp-muted group-hover:text-tp-red text-[11px] mt-4">Goals and photos →</p>
          </Link>
          <Link to="/training" className="group p-4 border-r border-tp-border hover:bg-tp-raised/40 transition-colors">
            <p className="label">Adherence · 30d</p><p className="text-tp-white font-mono text-2xl font-bold mt-3">{adherence.pct}%</p><p className="text-tp-soft text-xs mt-1">{adherence.sessions} sessions</p><p className="text-tp-muted group-hover:text-tp-red text-[11px] mt-4">Open history →</p>
          </Link>
          <Link to="/nutrition" className="group p-4 hover:bg-tp-raised/40 transition-colors">
            <p className="label">Fueling plan</p><p className="text-tp-white font-mono text-2xl font-bold mt-3">W6</p><p className="text-tp-soft text-xs mt-1">of 12 prescribed weeks</p><p className="text-tp-muted group-hover:text-tp-red text-[11px] mt-4">View this week →</p>
          </Link>
        </div>
      </div>
    </section>
  )
}

function LeaderboardModal({ isOpen, onClose }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="w-full max-w-lg bg-tp-card border border-tp-border rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-tp-border">
          <div className="flex items-center gap-2"><Trophy size={16} className="text-tp-gold" /><h2 className="text-tp-white font-bold">Top 5 studio leaderboard</h2></div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg bg-tp-raised text-tp-muted hover:text-tp-white flex items-center justify-center" aria-label="Close leaderboard"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-2">
          <p className="text-tp-muted text-xs leading-relaxed mb-4">{mockLeaderboard.description}</p>
          {mockLeaderboard.members.slice(0, 5).map((member) => (
            <div key={member.rank} className={clsx('flex items-center justify-between p-3 rounded-lg border', member.isCurrentUser ? 'bg-tp-red/10 border-tp-red/30' : 'bg-tp-raised border-tp-border')}>
              <div><p className="text-tp-white text-sm font-semibold"><span className="text-tp-amber mr-2">#{member.rank}</span>{member.name}</p><p className="text-tp-muted text-xs mt-0.5">{member.program}</p></div>
              <div className="text-right"><p className="text-tp-white font-mono font-bold">{member.score}</p><p className="text-tp-green text-xs">{member.trend}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TopFiveCard({ perf, onOpen }) {
  if (!perf.leaderboard || perf.leaderboard.rank > 5) return null
  return (
    <button type="button" onClick={onOpen} className="group w-full border border-tp-gold/25 bg-tp-card rounded-xl p-5 text-left hover:border-tp-gold/50 transition-colors">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Trophy size={16} className="text-tp-gold" /><p className="label">Top 5 studio</p></div><ArrowUpRight size={15} className="text-tp-muted group-hover:text-tp-gold" /></div>
      <div className="flex items-end justify-between mt-4"><div><p className="text-tp-white font-mono font-bold text-3xl">#{perf.leaderboard.rank}</p><p className="text-tp-soft text-xs mt-1">Current studio rank</p></div><span className="text-tp-gold text-xs font-semibold">View top five</span></div>
    </button>
  )
}

export default function ClientDashboard() {
  const { user } = useAuth()
  const { data: perf } = usePerformance()
  const { data: training } = useTraining()
  const [leaderboardOpen, setLeaderboardOpen] = useState(false)

  if (!perf) return <div className="space-y-4">{[...Array(4)].map((_, index) => <div key={index} className="skeleton h-28 rounded-xl" />)}</div>

  return (
    <div className="space-y-7 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div><p className="text-tp-red text-xs font-semibold">{user?.sport} · {user?.position}</p><h1 className="text-tp-white text-2xl font-bold mt-1">{greeting(user?.name)}</h1><p className="text-tp-soft text-sm mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p></div>
        <Link to="/messages" className="inline-flex items-center gap-2 text-tp-soft hover:text-tp-white text-xs"><MessageCircle size={14} className="text-tp-red" /> Message {user?.trainer?.name ?? 'your coach'} <ChevronRight size={13} /></Link>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(280px,0.75fr)] gap-4 items-start">
        <div className="lg:col-span-2"><TodaySession training={training} /></div>
        <CoachDirection perf={perf} trainer={user?.trainer} />
        <section className="lg:col-span-2">
          <div className="flex items-end justify-between gap-3 mb-3"><div><h2 className="text-tp-white font-semibold">Where do you want to go?</h2><p className="text-tp-muted text-xs mt-1">Every part of your program, one step away.</p></div></div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">{DESTINATIONS.map((item) => <PlatformLink key={item.to} item={item} />)}</div>
        </section>
        <RecoveryContext perf={perf} />
      </div>

      <PerformanceSnapshot perf={perf} />

      <div className="grid md:grid-cols-[1fr_1fr] gap-4">
        <Link to="/performance" className="group border border-tp-border bg-tp-card rounded-xl p-5 hover:border-tp-red/40 transition-colors">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Activity size={16} className="text-tp-red" /><p className="label">Science insight</p></div><ArrowUpRight size={15} className="text-tp-muted group-hover:text-tp-red" /></div>
          <h3 className="text-tp-white font-bold mt-4">{perf.insightCard.title}</h3><p className="text-tp-soft text-xs leading-relaxed mt-2">{perf.insightCard.body}</p><p className="text-tp-red text-xs font-semibold mt-4">Explore the data behind this <ChevronRight size={13} className="inline" /></p>
        </Link>
        <TopFiveCard perf={perf} onOpen={() => setLeaderboardOpen(true)} />
      </div>

      <LeaderboardModal isOpen={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />
    </div>
  )
}