import { Link } from 'react-router-dom'
import { Zap, ArrowDown, ArrowRight, ArrowLeft } from 'lucide-react'

// ── Flow data ─────────────────────────────────────────────────

const MEMBER = [
  {
    step: 1, icon: '🔐', page: 'Login', route: '/#/login',
    desc: 'Any email + password authenticates. Email without "coach/trainer" → member portal.',
    actions: ['Enter credentials', 'Click demo card to auto-fill', 'Redirected to Dashboard'],
  },
  {
    step: 2, icon: '🏠', page: 'Dashboard', route: '/#/',
    desc: 'Daily home base. Score ring animates on load. AI insight card. 3 quick-access cards.',
    actions: ['View composite score + tier badge', 'Read AI insight + priority callout', 'Access session, nutrition, alerts'],
  },
  {
    step: 3, icon: '📈', page: 'Performance', route: '/#/performance',
    desc: 'Full score breakdown. Radar chart vs previous assessment. All 11 dimension cards.',
    actions: ['Tap score ring → full breakdown', 'Review radar vs previous assessment', 'Check Athletic Age & Fatigue Score'],
  },
  {
    step: 4, icon: '🏋️', page: 'Training', route: '/#/training',
    desc: 'Active program with phase + week progress. Today\'s session checklist. Session history.',
    actions: ['See week view (completed / today / upcoming)', 'Tap exercise to mark complete', 'View session history + RPE'],
  },
  {
    step: 5, icon: '🥗', page: 'Nutrition', route: '/#/nutrition',
    desc: 'Daily intake vs targets. Three macro donut rings. Full meal plan with logged state.',
    actions: ['Track calories + macros vs targets', 'Reference meal plan items', 'Read trainer coaching note'],
  },
  {
    step: 6, icon: '🎯', page: 'Progress', route: '/#/progress',
    desc: 'Goals with live progress bars. Assessment timeline. Achievement badge grid.',
    actions: ['Monitor goal completion %', 'Review past assessment scores', 'Track earned + locked achievements'],
  },
  {
    step: 7, icon: '💬', page: 'Messages', route: '/#/messages',
    desc: 'Direct thread with assigned trainer. Send + receive in real time.',
    actions: ['Read messages from trainer', 'Reply inline', 'Conversation date separators'],
  },
  {
    step: 8, icon: '👤', page: 'Profile', route: '/#/profile',
    desc: 'Account overview, notifications, links to Settings and Subscription.',
    actions: ['View score + tier summary', 'Access Settings & Billing', 'Sign out'],
  },
]

const TRAINER = [
  {
    step: 1, icon: '🔐', page: 'Login as Coach', route: '/#/login',
    desc: 'Email containing "coach" or "trainer" → Trainer Portal. Completely separate shell.',
    actions: ['Enter coach credentials', 'Click coach demo card', 'Redirected to Trainer Dashboard'],
  },
  {
    step: 2, icon: '📊', page: 'Trainer Dashboard', route: '/#/trainer',
    desc: 'Roster KPI pills. Score trend chart. Alerts list. Quick action cards.',
    actions: ['View roster avg score + adherence', 'See members needing attention', 'Quick actions: assess / build / roster'],
  },
  {
    step: 3, icon: '👥', page: 'Roster', route: '/#/trainer/roster',
    desc: 'All members with search, filter (tier/alerts), and sort (score/adherence/name).',
    actions: ['Filter by Gold / Silver / Bronze / Alerts', 'Sort by score or adherence', 'Tap member to open detail'],
  },
  {
    step: 4, icon: '👁️', page: 'Member Detail', route: '/#/trainer/roster/:id',
    desc: 'Score ring, radar vs previous, all 11 dimensions, status flags, inline messaging.',
    actions: ['Review score + dimension breakdown', 'Check status flags (fatigue, assessment due)', 'Message member inline'],
  },
  {
    step: 5, icon: '📋', page: 'Assessment Entry', route: '/#/trainer/assessments/new',
    desc: '7 accordion categories. FMS score buttons. Auto-calculates composite score on save.',
    actions: ['Select member', 'Fill 34 fields across 7 categories', 'Save → score calculated + member dashboard updates'],
  },
  {
    step: 6, icon: '🏗️', page: 'Program Builder', route: '/#/trainer/programs/new',
    desc: 'Phase tree + session editor + exercise library (25 exercises, video links) + timeline calendar.',
    actions: ['Build phases → sessions → exercises', 'Link YouTube videos to exercises', 'Toggle to Timeline for calendar view', 'Assign to member'],
  },
  {
    step: 7, icon: '🥦', page: 'Nutrition Builder', route: '/#/trainer/nutrition/new',
    desc: 'Template picker (5 presets). Live macro ratio bar. Meal plan editor. Trainer note.',
    actions: ['Pick template or set custom macros', 'Add / edit meals with times + food items', 'Write coaching note for member', 'Assign with start date'],
  },
  {
    step: 8, icon: '💬', page: 'Trainer Messages', route: '/#/trainer/messages',
    desc: 'Multi-member inbox. One thread per member. Unread badges. View Profile shortcut.',
    actions: ['Select member thread from left panel', 'Send message to any member', 'Jump to member profile from thread'],
  },
  {
    step: 9, icon: '📉', page: 'Analytics', route: '/#/trainer/analytics',
    desc: 'Score trend, tier distribution, adherence per member, dimension averages. Weak-point callout.',
    actions: ['Track roster avg score over 7 months', 'Identify lowest adherence members', 'See roster-wide weakest dimension'],
  },
]

// Cross-persona interactions shown between the two columns
// rowAfter = 0-indexed row number in the combined flow display
const BRIDGES = [
  {
    id: 'b1',
    label: 'Assessment submitted',
    sublabel: 'Score & AI insight update on member dashboard',
    direction: 'right-to-left', // trainer → member
    memberStep: 2, // aligns near Dashboard
    trainerStep: 5, // aligns near Assessment Entry
  },
  {
    id: 'b2',
    label: 'Program assigned',
    sublabel: 'Appears in member Training page with full session plan',
    direction: 'right-to-left',
    memberStep: 4,
    trainerStep: 6,
  },
  {
    id: 'b3',
    label: 'Nutrition plan assigned',
    sublabel: 'Appears in member Nutrition page with macro targets + meal plan',
    direction: 'right-to-left',
    memberStep: 5,
    trainerStep: 7,
  },
  {
    id: 'b4',
    label: 'Messages',
    sublabel: 'Bidirectional — member ↔ trainer direct thread',
    direction: 'bidirectional',
    memberStep: 7,
    trainerStep: 8,
  },
  {
    id: 'b5',
    label: 'Session adherence logged',
    sublabel: 'Member checks off sessions → adherence % updates in trainer roster',
    direction: 'left-to-right', // member → trainer
    memberStep: 4,
    trainerStep: 3,
  },
]

// ── Sub-components ────────────────────────────────────────────

function StepNode({ data, color }) {
  const borderColor  = color === 'member'  ? 'border-l-[#e63946]'  : 'border-l-[#f59e0b]'
  const stepBg       = color === 'member'  ? 'bg-[#e63946]'         : 'bg-[#f59e0b]'
  const routeColor   = color === 'member'  ? 'text-[#e63946]'       : 'text-[#f59e0b]'

  return (
    <div className={`relative rounded-xl border border-[#252525] border-l-4 ${borderColor} bg-[#111111] p-4 w-full`}>
      {/* Step badge */}
      <div className={`absolute -top-3 -left-3 w-6 h-6 rounded-full ${stepBg} flex items-center justify-center text-[10px] font-bold text-black shadow-lg`}>
        {data.step}
      </div>

      {/* Header */}
      <div className="flex items-start gap-2.5 mb-2">
        <span className="text-xl leading-none mt-0.5">{data.icon}</span>
        <div className="min-w-0">
          <p className="text-white font-bold text-sm leading-tight">{data.page}</p>
          <code className={`text-[10px] ${routeColor} font-mono`}>{data.route}</code>
        </div>
      </div>

      {/* Description */}
      <p className="text-[#a0a0a0] text-xs leading-relaxed mb-2.5">{data.desc}</p>

      {/* Actions */}
      <ul className="space-y-1">
        {data.actions.map((a, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[11px] text-[#666]">
            <span className={`mt-0.5 w-1 h-1 rounded-full flex-shrink-0 ${stepBg}`} />
            {a}
          </li>
        ))}
      </ul>
    </div>
  )
}

function VerticalConnector({ color }) {
  const lineColor = color === 'member' ? 'border-[#e63946]/30' : 'border-[#f59e0b]/30'
  return (
    <div className={`flex justify-center py-1`}>
      <div className={`flex flex-col items-center gap-0.5`}>
        <div className={`w-px h-5 border-l-2 border-dashed ${lineColor}`} />
        <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: color === 'member' ? '6px solid rgba(230,57,70,0.4)' : '6px solid rgba(245,158,11,0.4)' }} />
      </div>
    </div>
  )
}

function BridgeRow({ bridge }) {
  const isRTL   = bridge.direction === 'right-to-left'
  const isLTR   = bridge.direction === 'left-to-right'
  const isBi    = bridge.direction === 'bidirectional'

  return (
    <div className="flex items-center gap-2 my-2 px-2 py-3 rounded-xl bg-[#0d0d0d] border border-dashed border-[#2a2a2a]">
      {/* Arrow left indicator */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {(isRTL || isBi) && <ArrowLeft size={12} className="text-[#555]" />}
      </div>

      {/* Label */}
      <div className="flex-1 text-center">
        <p className="text-white text-xs font-semibold">{bridge.label}</p>
        <p className="text-[#555] text-[10px] mt-0.5">{bridge.sublabel}</p>
      </div>

      {/* Arrow right indicator */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {(isLTR || isBi) && <ArrowRight size={12} className="text-[#555]" />}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────

export default function UserFlow() {
  // Build combined row sequence, interleaving bridges
  // Strategy: render steps in rows, insert bridge rows at natural transition points

  return (
    <div className="min-h-screen bg-[#080808] py-10 px-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Header ── */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#e63946]/20 border border-[#e63946]/40 flex items-center justify-center">
            <Zap size={18} className="text-[#e63946]" style={{ fill: '#e63946' }} />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight">Twitch Performance</h1>
            <p className="text-[#555] text-xs uppercase tracking-widest">End-to-End User Journey</p>
          </div>
          <Link to="/" className="ml-auto text-[#e63946] text-xs hover:text-[#ff4757] transition-colors border border-[#e63946]/30 px-3 py-1.5 rounded-lg">
            ← Back to App
          </Link>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-5 p-4 rounded-xl bg-[#111] border border-[#222]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#e63946]" />
            <span className="text-[#a0a0a0] text-xs">Member journey</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <span className="text-[#a0a0a0] text-xs">Trainer journey</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 border-t-2 border-dashed border-[#444]" style={{width: '24px'}} />
            <span className="text-[#a0a0a0] text-xs">Cross-persona interaction</span>
          </div>
          <div className="ml-auto text-[#444] text-xs hidden sm:block">Step numbers indicate click depth from login</div>
        </div>
      </div>

      {/* ── Two-column flow ── */}
      <div className="max-w-6xl mx-auto">
        {/* Column headers */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 bg-[#e63946]/10 border border-[#e63946]/25 text-[#e63946] text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              👤 Member
            </span>
            <p className="text-[#555] text-xs mt-1">Gym attendant / Athlete</p>
          </div>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 bg-[#f59e0b]/10 border border-[#f59e0b]/25 text-[#f59e0b] text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              🏋️ Trainer / Coach
            </span>
            <p className="text-[#555] text-xs mt-1">Creates plans & prescriptions</p>
          </div>
        </div>

        {/* Steps 1–2: Login + Dashboard (parallel start) */}
        <div className="grid grid-cols-2 gap-6">
          <StepNode data={MEMBER[0]} color="member" />
          <StepNode data={TRAINER[0]} color="trainer" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <VerticalConnector color="member" />
          <VerticalConnector color="trainer" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <StepNode data={MEMBER[1]} color="member" />
          <StepNode data={TRAINER[1]} color="trainer" />
        </div>

        {/* Bridge: Assessment → Score Update */}
        <div className="my-2">
          <div className="grid grid-cols-2 gap-6">
            <VerticalConnector color="member" />
            <VerticalConnector color="trainer" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <StepNode data={MEMBER[2]} color="member" />
            <StepNode data={TRAINER[2]} color="trainer" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <VerticalConnector color="member" />
            <VerticalConnector color="trainer" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div /> {/* spacer */}
            <StepNode data={TRAINER[3]} color="trainer" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div />
            <VerticalConnector color="trainer" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div />
            <StepNode data={TRAINER[4]} color="trainer" />
          </div>
          <BridgeRow bridge={{ label: 'Assessment submitted', sublabel: 'Score recalculated → AI insight card + radar chart update on member dashboard', direction: 'right-to-left' }} />
        </div>

        {/* Training + Program Builder */}
        <div className="grid grid-cols-2 gap-6">
          <VerticalConnector color="member" />
          <VerticalConnector color="trainer" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <StepNode data={TRAINER[5]} color="trainer" style={{gridColumn: 2}} />
          <div style={{order: -1}} />
        </div>
        <BridgeRow bridge={{ label: 'Program assigned to member', sublabel: 'Full phase/session/exercise plan appears in member\'s Training page', direction: 'right-to-left' }} />
        <div className="grid grid-cols-2 gap-6">
          <StepNode data={MEMBER[3]} color="member" />
          <div />
        </div>

        {/* Nutrition */}
        <div className="grid grid-cols-2 gap-6">
          <VerticalConnector color="member" />
          <VerticalConnector color="trainer" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div />
          <StepNode data={TRAINER[6]} color="trainer" />
        </div>
        <BridgeRow bridge={{ label: 'Nutrition plan assigned to member', sublabel: 'Macro targets + meal plan + coach note appear in member\'s Nutrition page', direction: 'right-to-left' }} />
        <div className="grid grid-cols-2 gap-6">
          <StepNode data={MEMBER[4]} color="member" />
          <div />
        </div>

        {/* Adherence loop back */}
        <div className="grid grid-cols-2 gap-6">
          <VerticalConnector color="member" />
          <div />
        </div>
        <BridgeRow bridge={{ label: 'Session adherence tracked', sublabel: 'Member checks off exercises → adherence % updates in trainer\'s Roster & Analytics', direction: 'left-to-right' }} />

        {/* Progress + Roster */}
        <div className="grid grid-cols-2 gap-6">
          <StepNode data={MEMBER[5]} color="member" />
          <StepNode data={TRAINER[7]} color="trainer" />
        </div>

        {/* Messages (bidirectional) */}
        <div className="grid grid-cols-2 gap-6">
          <VerticalConnector color="member" />
          <VerticalConnector color="trainer" />
        </div>
        <BridgeRow bridge={{ label: 'Direct messaging', sublabel: 'Member ↔ Trainer — bidirectional thread. Member sees in /messages, Trainer sees in multi-member inbox', direction: 'bidirectional' }} />
        <div className="grid grid-cols-2 gap-6">
          <StepNode data={MEMBER[6]} color="member" />
          <StepNode data={TRAINER[8]} color="trainer" />
        </div>

        {/* Profile + Analytics */}
        <div className="grid grid-cols-2 gap-6">
          <VerticalConnector color="member" />
          <VerticalConnector color="trainer" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <StepNode data={MEMBER[7]} color="member" />
          <div className="rounded-xl border border-[#252525] border-l-4 border-l-[#f59e0b] bg-[#111111] p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📉</span>
              <div>
                <p className="text-white font-bold text-sm">Analytics</p>
                <code className="text-[10px] text-[#f59e0b] font-mono">/#/trainer/analytics</code>
              </div>
            </div>
            <p className="text-[#a0a0a0] text-xs leading-relaxed mb-2.5">Score trend, tier distribution, adherence per member, dimension averages. Auto-flags weakest roster dimension.</p>
            <ul className="space-y-1">
              {['Review 7-month roster avg trend', 'Identify low-adherence members', 'Find weakest dimension across cohort'].map((a, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] text-[#666]">
                  <span className="mt-0.5 w-1 h-1 rounded-full flex-shrink-0 bg-[#f59e0b]" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Loop back */}
        <div className="mt-8 p-5 rounded-2xl border border-dashed border-[#333] bg-[#0d0d0d]">
          <p className="text-[#555] text-xs text-center uppercase tracking-widest mb-3">The Loop</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {[
              'Assessment Entry',
              '→',
              'Score Updates',
              '→',
              'Trainer Reviews',
              '→',
              'Program Built',
              '→',
              'Member Trains',
              '→',
              'Adherence Logged',
              '→',
              'Next Assessment',
            ].map((step, i) => (
              step === '→'
                ? <ArrowRight key={i} size={14} className="text-[#333]" />
                : <span key={i} className={`text-xs font-medium px-2.5 py-1 rounded-full border ${i === 0 || i === 12 ? 'border-[#e63946]/40 text-[#e63946] bg-[#e63946]/10' : 'border-[#333] text-[#666]'}`}>{step}</span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-[#333] text-xs">Twitch Performance · Frontend v0.1 · All flows are mock data backed · Backend integration ready</p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <Link to="/" className="text-[#e63946] text-xs hover:text-[#ff4757] transition-colors">Member Demo →</Link>
            <Link to="/login" className="text-[#f59e0b] text-xs hover:opacity-80 transition-opacity">Trainer Demo →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
