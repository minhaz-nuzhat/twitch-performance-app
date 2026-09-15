import { useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import {
  Activity, ArrowUpRight, CheckCircle2, ChevronDown, Download,
  Dumbbell, Gauge, MessageCircle, Ruler, ShieldCheck, Target,
} from 'lucide-react'
import { mockAssessmentReport as data, mockPhysioRomAssessment as romData } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import { InfoTooltip } from '../components/ui/InfoTooltip'
import { KPI_TOOLTIPS } from '../data/scienceTooltips'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, LineChart, Line,
  PieChart, Pie, Cell,
} from 'recharts'

// ── Shared style constants ────────────────────────────────────
const AXIS  = { fill: '#555', fontSize: 10 }
const GRID  = '#1e1e1e'
const LEFT  = '#3b82f6'
const RIGHT = '#06b6d4'

// ── Status config ─────────────────────────────────────────────
const STATUS_CFG = {
  pass:             { color: 'text-tp-green',  dot: '#22c55e' },
  baseline:         { color: 'text-tp-green',  dot: '#22c55e' },
  good:             { color: 'text-tp-green',  dot: '#22c55e' },
  fail:             { color: 'text-tp-danger', dot: '#e63946' },
  below:            { color: 'text-tp-danger', dot: '#e63946' },
  critical:         { color: 'text-tp-danger', dot: '#e63946' },
  borderline:       { color: 'text-tp-amber',  dot: '#f59e0b' },
  warn:             { color: 'text-tp-amber',  dot: '#f59e0b' },
  above:            { color: 'text-tp-amber',  dot: '#f59e0b' },
}

function StatusBadge({ status, label }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.pass
  return (
    <span className={clsx('flex items-center gap-1 text-[10px] font-bold whitespace-nowrap', cfg.color)}>
      <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: cfg.dot }} />
      {label}
    </span>
  )
}

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="pointer-events-none max-w-56 bg-tp-card border border-tp-border-bright rounded-lg px-3 py-2 text-xs shadow-[0_8px_32px_rgba(0,0,0,0.85)]">
      {label && <p className="text-tp-white font-semibold mb-1.5">{label}</p>}
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-tp-soft"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color ?? p.fill }} />{p.name ?? p.dataKey}</span>
          <span className="text-tp-white font-mono font-bold whitespace-nowrap">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

function DataTable({ cols, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-tp-border">
            {cols.map(c => (
              <th key={c} className="text-tp-muted font-medium text-left px-3 py-2 whitespace-nowrap">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-tp-border/40 hover:bg-tp-raised/40 transition-colors">
              <td className="px-3 py-2 text-tp-soft leading-tight">{row.factor}</td>
              <td className="px-3 py-2 text-tp-white font-mono font-medium">{row.result}</td>
              {row.norm !== undefined && <td className="px-3 py-2 text-tp-muted">{row.norm}</td>}
              <td className="px-3 py-2"><StatusBadge status={row.status} label={row.statusLabel} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AlertBanner({ alert }) {
  if (!alert) return null
  const isGreen = alert.level === 'pass'
  const isRed   = alert.level === 'critical' || alert.level === 'fail'
  return (
    <div className={clsx(
      'flex items-start gap-2 p-3 rounded-lg border text-xs leading-relaxed',
      isGreen ? 'bg-tp-green/10 border-tp-green/30 text-tp-green'
               : isRed ? 'bg-tp-danger/10 border-tp-danger/40 text-tp-danger'
               : 'bg-tp-amber/10 border-tp-amber/40 text-tp-amber',
    )}>
      <span className="w-2 h-2 rounded-sm flex-shrink-0 mt-0.5"
        style={{ background: isGreen ? '#22c55e' : isRed ? '#e63946' : '#f59e0b' }}
      />
      {alert.text}
    </div>
  )
}

function Section({ number, title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-tp-raised/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-tp-red text-[9px] font-bold uppercase tracking-widest flex-shrink-0">Section {number}</span>
          <span className="text-tp-white font-bold text-sm">{title}</span>
        </div>
        <ChevronDown size={16} className={clsx('text-tp-muted transition-transform duration-300 flex-shrink-0', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-tp-border animate-fade-in">
          {children}
        </div>
      )}
    </div>
  )
}

function BessSection() {
  const { bess } = data.sections
  return (
    <Section number={1} title="Modified BESS — Balance Assessment" defaultOpen>
      <div className="mt-4">
        <p className="text-tp-muted text-[10px] mb-2">{bess.chart.title}</p>
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={bess.chart.data} margin={{ top: 4, right: 8, bottom: 0, left: -15 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="name" tick={AXIS} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTip />} />
            {bess.chart.refLines.map(r => (
              <ReferenceLine key={r.value} y={r.value} stroke={r.color} strokeDasharray="4 2"
                label={{ value: r.label, fill: r.color, fontSize: 9, position: 'insideTopRight' }}
              />
            ))}
            <Bar dataKey="value" name="Sway (cm)" radius={[3, 3, 0, 0]}>
              {bess.chart.data.map((d, i) => (
                <Cell key={i} fill={d.value > d.norm ? '#e63946' : '#22c55e'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <AlertBanner alert={bess.alert} />
      <DataTable cols={['Assessed Factor', 'Result (cm)', 'Norm', 'Status']} rows={bess.table} />
    </Section>
  )
}

function ImtpSection() {
  const { imtp } = data.sections
  const donutData = [{ value: imtp.donut.value }, { value: 100 - imtp.donut.value }]
  return (
    <Section number={2} title="Isometric Mid-Thigh Pull (IMTP)">
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-tp-muted text-[10px] mb-2">{imtp.chart.title}</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={imtp.chart.data} margin={{ top: 4, right: 8, bottom: 0, left: -15 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="time" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Line type="monotone" dataKey="rfd" name="RFD (N/s)" stroke="#06b6d4" strokeWidth={2.5}
                dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#06b6d4' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-tp-muted text-[10px]">L–R Asymmetry</p>
          <div className="relative w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={42} outerRadius={60}
                  dataKey="value" startAngle={90} endAngle={-270}>
                  <Cell fill="#e63946" strokeWidth={0} />
                  <Cell fill="#3b82f6" strokeWidth={0} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-tp-danger font-mono font-bold text-xl leading-none">{imtp.donut.value}%</span>
              <span className="text-tp-muted text-[9px]">asymmetry</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {imtp.summary.map(s => (
          <div key={s.label} className="bg-tp-raised border border-tp-border rounded-lg p-2 text-center">
            <p className="text-tp-muted text-[9px] mb-0.5 leading-tight">{s.label}</p>
            <p className={clsx('font-mono font-bold text-sm', s.color === 'red' ? 'text-tp-danger' : s.color === 'cyan' ? 'text-cyan-400' : 'text-tp-white')}>{s.value}</p>
          </div>
        ))}
      </div>
      <DataTable cols={['Measured Factor', 'Result', 'Normative', 'Status']} rows={imtp.table} />
    </Section>
  )
}

function LowerBodySection() {
  const { lowerBody } = data.sections
  return (
    <Section number={3} title="Lower Body Isometric Strength">
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-tp-muted text-[10px] mb-2">Knee Extension & Curl — Left vs Right</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={lowerBody.kneeData} margin={{ top: 4, right: 8, bottom: 0, left: -15 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="left" name="Left" fill={LEFT} radius={[3,3,0,0]} />
              <Bar dataKey="right" name="Right" fill={RIGHT} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-tp-muted text-[10px] mb-2">Hamstring:Quad Ratio vs Target</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={lowerBody.hqData} margin={{ top: 4, right: 8, bottom: 0, left: -15 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="actual" name="Actual" fill="#e63946" radius={[3,3,0,0]} />
              <Bar dataKey="target" name="Target" fill="#22c55e" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <AlertBanner alert={lowerBody.alert} />
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-tp-muted text-[10px] mb-2">Hip Strength — Left vs Right (kg)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={lowerBody.hipData} margin={{ top: 4, right: 8, bottom: 0, left: -15 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={{ ...AXIS, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="left" name="Left" fill={LEFT} radius={[3,3,0,0]} />
              <Bar dataKey="right" name="Right" fill={RIGHT} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-tp-muted text-[10px] mb-2">Lower Body Asymmetry (%) — Norm &lt;10%</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={lowerBody.asymmetryData} layout="vertical" margin={{ top: 4, right: 20, bottom: 0, left: 8 }}>
              <CartesianGrid stroke={GRID} horizontal={false} />
              <XAxis type="number" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ ...AXIS, fontSize: 8 }} axisLine={false} tickLine={false} width={85} />
              <Tooltip content={<ChartTip />} />
              <ReferenceLine x={10} stroke="#f59e0b" strokeDasharray="4 2" />
              <Bar dataKey="value" name="Asymmetry %" radius={[0,3,3,0]}>
                {lowerBody.asymmetryData.map((d, i) => (
                  <Cell key={i} fill={d.value > 10 ? '#e63946' : '#22c55e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <DataTable cols={['Measured Factor', 'Result (kg)', 'Normative', 'Status']} rows={lowerBody.table} />
    </Section>
  )
}

function UpperBodySection() {
  const { upperBody } = data.sections
  return (
    <Section number={4} title="Upper Body & Trunk Strength">
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-tp-muted text-[10px] mb-2">Shoulder Rotation — Right vs Left (kg)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={upperBody.shoulderData} margin={{ top: 4, right: 8, bottom: 0, left: -15 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="right" name="Right" fill={RIGHT} radius={[3,3,0,0]} />
              <Bar dataKey="left" name="Left" fill={LEFT} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-tp-muted text-[10px] mb-2">Upper Body Asymmetry (%) — Norm &lt;10%</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={upperBody.asymmetryData} layout="vertical" margin={{ top: 4, right: 20, bottom: 0, left: 8 }}>
              <CartesianGrid stroke={GRID} horizontal={false} />
              <XAxis type="number" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ ...AXIS, fontSize: 8 }} axisLine={false} tickLine={false} width={95} />
              <Tooltip content={<ChartTip />} />
              <ReferenceLine x={10} stroke="#f59e0b" strokeDasharray="4 2" />
              <Bar dataKey="value" name="Asymmetry %" radius={[0,3,3,0]}>
                {upperBody.asymmetryData.map((d, i) => (
                  <Cell key={i} fill={d.value > 10 ? '#e63946' : '#22c55e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-tp-muted text-[10px] mb-2">Trunk Rotation & Active Straight Leg (kg)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={upperBody.trunkData} margin={{ top: 4, right: 8, bottom: 0, left: -15 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="right" name="Right" fill={RIGHT} radius={[3,3,0,0]} />
              <Bar dataKey="left" name="Left" fill={LEFT} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-tp-muted text-[10px] mb-2">Hand Grip Strength (kg)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={upperBody.gripData} margin={{ top: 4, right: 8, bottom: 0, left: -15 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <ReferenceLine y={30.5} stroke="#f59e0b" strokeDasharray="4 2"
                label={{ value: '30.5 kg norm', fill: '#f59e0b', fontSize: 9, position: 'insideTopRight' }}
              />
              <Bar dataKey="value" name="kg" radius={[3,3,0,0]}>
                {upperBody.gripData.map((d, i) => (
                  <Cell key={i} fill={d.name === 'Threshold' ? '#444' : '#22c55e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <DataTable cols={['Measured Factor', 'Result', 'Normative', 'Status']} rows={upperBody.table} />
    </Section>
  )
}

function JumpSection() {
  const { jump } = data.sections
  const PHASE_COLORS = ['#f59e0b', '#3b82f6', '#e63946']
  const RSI_COLORS   = ['#e63946', '#22c55e', '#22c55e']
  return (
    <Section number={5} title="Jump Performance — CMJ & Drop Jump">
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-tp-muted text-[10px] mb-2">CMJ — Force Phase Summary (N)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={jump.cmjPhases} margin={{ top: 4, right: 8, bottom: 0, left: -15 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={{ ...AXIS, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="value" name="Force (N)" radius={[3,3,0,0]}>
                {jump.cmjPhases.map((_, i) => <Cell key={i} fill={PHASE_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-tp-muted text-[10px] mb-2">CMJ — Left vs Right Force Breakdown (N)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={jump.cmjLR} margin={{ top: 4, right: 8, bottom: 0, left: -15 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="left" name="Left" fill={LEFT} radius={[3,3,0,0]} />
              <Bar dataKey="right" name="Right" fill="#e63946" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <AlertBanner alert={jump.alert} />
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="label mb-2">CMJ Metrics</p>
          <DataTable cols={['CMJ Metric', 'Result', 'Target', 'Status']} rows={jump.cmjTable} />
        </div>
        <div>
          <p className="label mb-2">Drop Jump Metrics</p>
          <DataTable cols={['Drop Jump Metric', 'Result', 'Target', 'Status']} rows={jump.dropJumpTable} />
        </div>
      </div>
      <div>
        <p className="text-tp-muted text-[10px] mb-2">Drop Jump RSI vs Target Range</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={jump.dropJumpChart} margin={{ top: 4, right: 8, bottom: 0, left: -15 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="name" tick={{ ...AXIS, fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTip />} />
            <Bar dataKey="value" name="RSI" radius={[3,3,0,0]}>
              {jump.dropJumpChart.map((_, i) => <Cell key={i} fill={RSI_COLORS[i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Section>
  )
}

function MedBallSection() {
  const { medBall } = data.sections
  return (
    <Section number={6} title="Med Ball Power">
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-tp-muted text-[10px] mb-2">Med Ball Throw Velocities — Left vs Right (m/s)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={medBall.throwData} margin={{ top: 4, right: 8, bottom: 0, left: -15 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={{ ...AXIS, fontSize: 8 }} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="left" name="Left (m/s)" fill={LEFT} radius={[3,3,0,0]} />
              <Bar dataKey="right" name="Right (m/s)" fill={RIGHT} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-tp-muted text-[10px] mb-2">Downward Slam (m/s)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={medBall.slamData} margin={{ top: 4, right: 8, bottom: 0, left: -15 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="value" name="m/s" fill="#22c55e" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Section>
  )
}

function AerobicSection() {
  const { aerobic } = data.sections
  const DSI_COLORS = ['#f59e0b', '#3b82f6', '#22c55e', '#22c55e']
  const vo2Display  = [{ value: aerobic.vo2 }, { value: Math.max(0, 60 - aerobic.vo2) }]
  return (
    <Section number={7} title="Aerobic Capacity, Grip & Dynamic Strength Index">
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-tp-muted text-[10px]">VO₂ Max (ml/kg/min)</p>
          <div className="relative w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={vo2Display} cx="50%" cy="50%" innerRadius={42} outerRadius={60}
                  dataKey="value" startAngle={90} endAngle={-270}>
                  <Cell fill="#22c55e" strokeWidth={0} />
                  <Cell fill="#1a2e1a" strokeWidth={0} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-tp-danger font-mono font-bold text-xl leading-none">{aerobic.vo2}</span>
              <span className="text-tp-muted text-[9px]">ml/kg/min</span>
            </div>
          </div>
        </div>
        <div>
          <p className="text-tp-muted text-[10px] mb-2">Dynamic Strength Index (DSI)</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={aerobic.dsiData} margin={{ top: 4, right: 8, bottom: 0, left: -15 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="name" tick={{ ...AXIS, fontSize: 8 }} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="value" name="DSI" radius={[3,3,0,0]}>
                {aerobic.dsiData.map((_, i) => <Cell key={i} fill={DSI_COLORS[i] ?? '#666'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <AlertBanner alert={aerobic.alert} />
      <DataTable cols={['Metric', 'Result', 'Target', 'Status']} rows={aerobic.table} />
    </Section>
  )
}

function OverviewTab() {
  return (
    <div className="card overflow-hidden animate-fade-in">
      <div className="px-5 py-4 border-b border-tp-border">
        <h3 className="text-tp-white font-bold text-sm">Full Results Summary — Traffic Light Status</h3>
        <p className="text-tp-muted text-xs mt-0.5">All measured factors across all assessments in this test</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-tp-border bg-tp-raised/50">
              {['Assessment', 'Factor', 'Result', 'Norm', 'Status'].map(h => (
                <th key={h} className="text-tp-muted font-medium text-left px-4 py-2.5 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.fullResultsSummary.map((row, i) => (
              <tr key={i} className="border-b border-tp-border/40 hover:bg-tp-raised/40 transition-colors">
                <td className="px-4 py-2 text-tp-muted text-[10px]">{row.assessment}</td>
                <td className="px-4 py-2 text-tp-soft">{row.factor}</td>
                <td className="px-4 py-2 text-tp-white font-mono font-medium">{row.result}</td>
                <td className="px-4 py-2 text-tp-muted">{row.norm}</td>
                <td className="px-4 py-2"><StatusBadge status={row.status} label={row.statusLabel} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PrioritiesTab() {
  return (
    <div className="space-y-3 animate-fade-in">
      {data.priorities.map(p => (
        <div key={p.id} className={clsx(
          'card p-4 border-l-4',
          p.level === 'critical' ? 'border-tp-danger' : p.level === 'warn' ? 'border-tp-amber' : 'border-tp-green',
        )}>
          <div className="flex items-start gap-3">
            <span className={clsx(
              'flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest',
              p.level === 'critical' ? 'bg-tp-danger/15 text-tp-danger' : p.level === 'warn' ? 'bg-tp-amber/15 text-tp-amber' : 'bg-tp-green/15 text-tp-green',
            )}>
              {p.priority}
            </span>
            <div>
              <p className="text-tp-white font-bold text-sm mb-1">{p.title}</p>
              <p className="text-tp-soft text-xs leading-relaxed">{p.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const KPI_STATUS_CFG = {
  pass:  { color: 'text-tp-green',  dot: '#22c55e' },
  below: { color: 'text-tp-danger', dot: '#e63946' },
  fail:  { color: 'text-tp-danger', dot: '#e63946' },
  warn:  { color: 'text-tp-amber',  dot: '#f59e0b' },
  above: { color: 'text-tp-amber',  dot: '#f59e0b' },
}

function GuidedView() {
  return (
    <div className="space-y-5 animate-fade-in">
      <section className="grid md:grid-cols-3 gap-3">
        <div className="card p-4 border-tp-green/25">
          <div className="flex items-center gap-2 text-tp-green"><CheckCircle2 size={15} /><p className="text-[10px] font-bold uppercase">Baseline established</p></div>
          <h3 className="text-tp-white font-bold mt-3">Your starting profile is recorded</h3>
          <p className="text-tp-soft text-xs leading-relaxed mt-2">This assessment gives your coach a repeatable reference for the next training block and reassessment.</p>
        </div>
        <div className="card p-4 border-tp-green/25">
          <div className="flex items-center gap-2 text-tp-green"><Gauge size={15} /><p className="text-[10px] font-bold uppercase">Current strengths</p></div>
          <h3 className="text-tp-white font-bold mt-3">Aerobic fitness and grip meet the reference</h3>
          <p className="text-tp-soft text-xs leading-relaxed mt-2">These qualities can be maintained while your next block focuses on force production and movement control.</p>
        </div>
        <div className="card p-4 border-tp-amber/30">
          <div className="flex items-center gap-2 text-tp-amber"><Target size={15} /><p className="text-[10px] font-bold uppercase">Primary focus</p></div>
          <h3 className="text-tp-white font-bold mt-3">Build lower-body strength and control</h3>
          <p className="text-tp-soft text-xs leading-relaxed mt-2">Your coach is prioritizing hamstring capacity, right-leg control and more balanced landing mechanics.</p>
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-tp-border">
          <p className="label">What this changes in your program</p>
          <h2 className="text-tp-white font-bold text-lg mt-1">Assessment → coaching action</h2>
        </div>
        <div className="divide-y divide-tp-border">
          {[
            { number: '01', title: 'Hamstring capacity', finding: 'Current hamstring-to-quadriceps force balance needs development.', action: 'Progressive hamstring loading and controlled eccentric work.', color: 'text-tp-red' },
            { number: '02', title: 'Single-leg control', finding: 'Right-leg balance differs from the left under the test protocol.', action: 'Single-leg stability and proprioception work added to preparation.', color: 'text-tp-amber' },
            { number: '03', title: 'Landing mechanics', finding: 'Landing force was distributed unevenly in the jump assessment.', action: 'Landing technique and force-absorption drills before higher plyometric demand.', color: 'text-tp-amber' },
          ].map((item) => (
            <div key={item.number} className="grid sm:grid-cols-[44px_1fr_1fr] gap-3 sm:gap-5 p-4 sm:p-5">
              <span className={clsx('font-mono text-xs font-bold', item.color)}>{item.number}</span>
              <div><p className="text-tp-white text-sm font-semibold">{item.title}</p><p className="text-tp-muted text-xs leading-relaxed mt-1">{item.finding}</p></div>
              <div className="sm:border-l sm:border-tp-border sm:pl-5"><p className="text-tp-red text-[10px] font-bold uppercase">Coach response</p><p className="text-tp-soft text-xs leading-relaxed mt-1">{item.action}</p></div>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 bg-tp-raised/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-tp-muted text-xs">These are coaching signals from this assessment, not medical diagnoses.</p>
          <Link to="/training" className="text-tp-red text-xs font-semibold inline-flex items-center gap-1">View program <ArrowUpRight size={13} /></Link>
        </div>
      </section>

      <section className="grid md:grid-cols-[1fr_0.8fr] gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-tp-red" /><p className="label">Coach interpretation</p></div>
          <h2 className="text-tp-white font-bold text-lg mt-4">Build the force base, then express it faster</h2>
          <p className="text-tp-soft text-sm leading-relaxed mt-2">The current block should develop maximal lower-body strength while improving control on the right side. Aerobic capacity can be maintained rather than becoming the main training priority.</p>
          <p className="text-tp-muted text-xs mt-4">Reviewed by Coach Ravi · Baseline assessment</p>
          <Link to="/messages" className="btn-ghost mt-5 px-4 py-2.5 text-xs inline-flex items-center gap-2"><MessageCircle size={14} /> Ask Coach Ravi</Link>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2"><Activity size={16} className="text-tp-red" /><p className="label">Next checkpoint</p></div>
          <p className="text-tp-white font-mono font-bold text-2xl mt-4">6 weeks</p>
          <p className="text-tp-soft text-xs leading-relaxed mt-2">Repeat key force, jump and symmetry tests after the current training block.</p>
          <Link to="/progress" className="text-tp-red text-xs font-semibold inline-flex items-center gap-1 mt-5">See milestone timeline <ArrowUpRight size={13} /></Link>
        </div>
      </section>
    </div>
  )
}

function GuidedRomView() {
  const reviewJoints = romData.joints.filter((joint) => joint.status === 'review')

  return (
    <div className="space-y-5 animate-fade-in">
      <section className="grid md:grid-cols-3 gap-3">
        <div className="card p-4 border-tp-green/25">
          <div className="flex items-center gap-2 text-tp-green"><CheckCircle2 size={15} /><p className="text-[10px] font-bold uppercase">Movement baseline</p></div>
          <p className="text-tp-white font-mono font-bold text-3xl mt-3">{romData.summary.withinReference}<span className="text-tp-muted text-sm font-normal"> / 26</span></p>
          <p className="text-tp-soft text-xs leading-relaxed mt-2">Movements are within the selected reference range.</p>
        </div>
        <div className="card p-4 border-tp-amber/30">
          <div className="flex items-center gap-2 text-tp-amber"><Target size={15} /><p className="text-[10px] font-bold uppercase">Physio review</p></div>
          <p className="text-tp-white font-mono font-bold text-3xl mt-3">{romData.summary.review}</p>
          <p className="text-tp-soft text-xs leading-relaxed mt-2">Movement findings are being monitored in the current block.</p>
        </div>
        <div className="card p-4 border-tp-red/25">
          <div className="flex items-center gap-2 text-tp-red"><Ruler size={15} /><p className="text-[10px] font-bold uppercase">Primary finding</p></div>
          <h3 className="text-tp-white font-bold mt-3">Ankle and shoulder mobility</h3>
          <p className="text-tp-soft text-xs leading-relaxed mt-2">Left ankle dorsiflexion and right shoulder external rotation are the main follow-up areas.</p>
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-tp-border"><p className="label">Physio findings → training response</p><h2 className="text-tp-white font-bold text-lg mt-1">What your team is accounting for</h2></div>
        <div className="divide-y divide-tp-border">
          {reviewJoints.map((joint) => {
            const flagged = joint.movements.filter((movement) => movement.status === 'review')
            const response = joint.id === 'ankle'
              ? 'Ankle preparation before squatting, jumping and landing work.'
              : joint.id === 'shoulder'
                ? 'Shoulder-control work and monitoring around throwing volume.'
                : 'Hip-extension preparation within warm-ups and strength sessions.'
            return (
              <div key={joint.id} className="grid sm:grid-cols-[130px_1fr_1fr] gap-3 sm:gap-5 p-4 sm:p-5">
                <div><p className="text-tp-amber text-[10px] font-bold uppercase">{joint.label}</p><p className="text-tp-white font-mono text-xs mt-1">{flagged.map((movement) => movement.movement).join(', ')}</p></div>
                <p className="text-tp-soft text-xs leading-relaxed">{joint.summary}</p>
                <div className="sm:border-l sm:border-tp-border sm:pl-5"><p className="text-tp-red text-[10px] font-bold uppercase">Program response</p><p className="text-tp-soft text-xs leading-relaxed mt-1">{response}</p></div>
              </div>
            )
          })}
        </div>
        <div className="px-5 py-4 bg-tp-raised/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><p className="text-tp-muted text-xs">Range-of-motion findings provide coaching context and are not a diagnosis.</p><Link to="/training" className="text-tp-red text-xs font-semibold inline-flex items-center gap-1">View program <ArrowUpRight size={13} /></Link></div>
      </section>

      <section className="grid md:grid-cols-[1fr_0.8fr] gap-4">
        <div className="card p-5"><div className="flex items-center gap-2"><ShieldCheck size={16} className="text-tp-red" /><p className="label">Physio summary</p></div><h2 className="text-tp-white font-bold text-lg mt-4">Most movement ranges support the current training plan</h2><p className="text-tp-soft text-sm leading-relaxed mt-2">{romData.summary.primaryFinding} {romData.summary.programResponse}</p><p className="text-tp-muted text-xs mt-4">Assessed by {romData.assessor} · Reviewed with {romData.reviewedBy}</p></div>
        <div className="card p-5"><div className="flex items-center gap-2"><Activity size={16} className="text-tp-red" /><p className="label">Follow-up</p></div><p className="text-tp-white font-mono font-bold text-2xl mt-4">6 weeks</p><p className="text-tp-soft text-xs leading-relaxed mt-2">Recheck selected ankle, shoulder and hip movements alongside the next performance assessment.</p><Link to="/progress" className="text-tp-red text-xs font-semibold inline-flex items-center gap-1 mt-5">See checkpoint <ArrowUpRight size={13} /></Link></div>
      </section>
    </div>
  )
}

function AdvancedRomView() {
  return (
    <div className="space-y-4 animate-fade-in">
      <section className="card p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[['Assessment', romData.measurementType], ['Protocol', romData.protocol], ['Assessor', romData.assessor], ['Unit', romData.unit]].map(([label, value]) => <div key={label}><p className="label">{label}</p><p className="text-tp-white text-xs font-semibold mt-2">{value}</p></div>)}
        </div>
        <p className="text-tp-muted text-xs leading-relaxed mt-4 pt-4 border-t border-tp-border">Reference ranges depend on the stated protocol and provide context for physio review; they are not universal pass/fail standards.</p>
      </section>

      <div className="space-y-3">
        {romData.joints.map((joint) => (
          <details key={joint.id} className="card overflow-hidden group" open={joint.status === 'review'}>
            <summary className="list-none cursor-pointer px-5 py-4 flex items-center justify-between gap-3 hover:bg-tp-raised/40">
              <div><div className="flex items-center gap-2"><h2 className="text-tp-white text-sm font-bold">{joint.label}</h2><span className={clsx('rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase', joint.status === 'review' ? 'text-tp-amber border-tp-amber/30 bg-tp-amber/10' : 'text-tp-green border-tp-green/30 bg-tp-green/10')}>{joint.status === 'review' ? 'Review' : 'Within range'}</span></div><p className="text-tp-muted text-xs mt-1">{joint.summary}</p></div>
              <ChevronDown size={15} className="text-tp-muted transition-transform group-open:rotate-180 flex-shrink-0" />
            </summary>
            <p className="sm:hidden px-5 pb-3 text-tp-muted text-[10px]">Swipe table horizontally for all measurements.</p>
            <div className="border-t border-tp-border overflow-x-auto">
              <table className="w-full min-w-[580px] text-xs">
                <thead><tr className="bg-tp-raised/50">{['Movement', 'Right', 'Left', 'Difference', 'Reference range', 'Status'].map((heading) => <th key={heading} className="text-tp-muted font-medium text-left px-4 py-2.5 whitespace-nowrap">{heading}</th>)}</tr></thead>
                <tbody>{joint.movements.map((movement) => <tr key={movement.movement} className="border-t border-tp-border/50"><td className="px-4 py-2.5 text-tp-white font-medium">{movement.movement}</td><td className="px-4 py-2.5 text-tp-white font-mono">{movement.right}°</td><td className="px-4 py-2.5 text-tp-white font-mono">{movement.left}°</td><td className="px-4 py-2.5 text-tp-soft font-mono">{Math.abs(movement.right - movement.left)}°</td><td className="px-4 py-2.5 text-tp-muted font-mono">{movement.reference}°</td><td className="px-4 py-2.5"><span className={clsx('font-semibold', movement.status === 'review' ? 'text-tp-amber' : 'text-tp-green')}>{movement.status === 'review' ? 'Physio review' : 'Within reference'}</span></td></tr>)}</tbody>
              </table>
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}

function PrintReport({ member }) {
  return (
    <div className="assessment-print-only hidden">
      <h1>Twitch Performance Assessment</h1>
      <p>{member.name} · {member.sport} · {member.position}</p>
      <p>{member.assessmentDate} · Baseline assessment · Reviewed by {member.coach}</p>
      <h2>Coach priorities</h2>
      {data.priorities.map((priority) => <div key={priority.id}><h3>{priority.priority}: {priority.title}</h3><p>{priority.description}</p></div>)}
      <h2>Key performance indicators</h2>
      <table><thead><tr><th>Metric</th><th>Result</th><th>Reference</th><th>Status</th></tr></thead><tbody>{data.kpis.map((kpi) => <tr key={kpi.label}><td>{kpi.label}</td><td>{kpi.value} {kpi.unit}</td><td>{kpi.target}</td><td>{kpi.statusLabel}</td></tr>)}</tbody></table>
      <h2>Complete results</h2>
      <table><thead><tr><th>Assessment</th><th>Factor</th><th>Result</th><th>Reference</th><th>Status</th></tr></thead><tbody>{data.fullResultsSummary.map((row, index) => <tr key={index}><td>{row.assessment}</td><td>{row.factor}</td><td>{row.result}</td><td>{row.norm}</td><td>{row.statusLabel}</td></tr>)}</tbody></table>
      <h2>Physio range-of-motion screen</h2>
      <p>{romData.measurementType} · {romData.protocol} · Assessed by {romData.assessor}</p>
      <table><thead><tr><th>Joint</th><th>Movement</th><th>Right</th><th>Left</th><th>Difference</th><th>Reference</th><th>Status</th></tr></thead><tbody>{romData.joints.flatMap((joint) => joint.movements.map((movement) => <tr key={`${joint.id}-${movement.movement}`}><td>{joint.label}</td><td>{movement.movement}</td><td>{movement.right}°</td><td>{movement.left}°</td><td>{Math.abs(movement.right - movement.left)}°</td><td>{movement.reference}°</td><td>{movement.status === 'review' ? 'Physio review' : 'Within reference'}</td></tr>))}</tbody></table>
      <p className="assessment-print-note">Assessment findings are coaching information and are not a medical diagnosis.</p>
    </div>
  )
}

export default function Assessment() {
  const [tab, setTab] = useState('overview')
  const [mode, setMode] = useState('guided')
  const [reportType, setReportType] = useState('performance')
  const { user } = useAuth()
  const { kpis } = data
  const member = {
    ...data.member,
    name: user?.name ?? data.member.name,
    id: user?.id ?? data.member.id,
    sport: user?.sport ?? data.member.sport,
    position: user?.position ?? data.member.position,
    coach: user?.trainer?.name ?? data.member.coach,
  }

  return (
    <div className="space-y-5 animate-fade-in assessment-screen">
      <PrintReport member={member} />

      <header className="card p-5 border-l-4 border-tp-red">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          <div>
            <p className="text-tp-red text-[10px] font-bold uppercase">{reportType === 'performance' ? 'Baseline performance assessment' : 'Physio movement assessment'}</p>
            <h1 className="text-tp-white font-bold text-2xl mt-2">{member.name}</h1>
            <p className="text-tp-soft text-xs mt-1">{member.sport} · {member.position}</p>
            <p className="text-tp-muted text-xs mt-3">{reportType === 'performance' ? `Assessed ${member.assessmentDate} · Reviewed by ${member.coach}` : `Assessed ${romData.assessmentDate} by ${romData.assessor} · Reviewed with ${romData.reviewedBy}`}</p>
          </div>
          <div className="flex flex-row items-center gap-2 print:hidden">
            <div className="flex flex-1 bg-tp-raised border border-tp-border rounded-lg p-1" aria-label="Assessment detail level">
              {['guided', 'advanced'].map((option) => <button key={option} type="button" onClick={() => setMode(option)} className={clsx('flex-1 min-w-0 min-h-10 px-2 sm:px-4 rounded text-xs font-semibold capitalize', mode === option ? 'bg-tp-red text-white' : 'text-tp-muted hover:text-tp-white')}>{option}</button>)}
            </div>
            <button type="button" onClick={() => window.print()} className="w-10 h-10 sm:w-auto sm:px-4 rounded-lg border border-tp-border text-tp-soft hover:text-tp-white inline-flex items-center justify-center gap-2 text-xs flex-shrink-0" aria-label="Export assessment PDF"><Download size={14} /><span className="hidden sm:inline">Export PDF</span></button>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-tp-border flex items-center justify-between gap-3">
          <p className="text-tp-soft text-xs">{mode === 'guided' ? 'Meaning and coaching action first. Full test data remains available in Advanced.' : 'Full measurements, reference values and test-domain detail.'}</p>
          <span className="hidden sm:inline-flex text-tp-green text-[10px] font-bold uppercase items-center gap-1"><CheckCircle2 size={12} /> Coach reviewed</span>
        </div>
      </header>

      <nav className="sticky top-0 z-20 grid grid-cols-2 gap-1 bg-tp-surface/95 backdrop-blur-sm border border-tp-border rounded-xl p-1 print:hidden" aria-label="Assessment report type">
        {[
          { id: 'performance', label: 'Performance testing', mobileLabel: 'Performance', icon: Activity },
          { id: 'rom', label: 'Physio ROM screen', mobileLabel: 'Physio ROM', icon: Ruler },
        ].map(({ id, label, mobileLabel, icon: Icon }) => (
          <button key={id} type="button" onClick={() => setReportType(id)} className={clsx('min-h-11 rounded-lg px-3 flex items-center justify-center gap-2 text-xs font-semibold transition-colors', reportType === id ? 'bg-tp-red text-white' : 'text-tp-muted hover:text-tp-white hover:bg-tp-raised')}>
            <Icon size={14} className="flex-shrink-0" /><span className="sm:hidden whitespace-nowrap">{mobileLabel}</span><span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </nav>

      {mode === 'guided' && (reportType === 'performance' ? <GuidedView /> : <GuidedRomView />)}

      {mode === 'advanced' && reportType === 'rom' && <AdvancedRomView />}

      {mode === 'advanced' && reportType === 'performance' && <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map(kpi => {
          const cfg = KPI_STATUS_CFG[kpi.status] ?? KPI_STATUS_CFG.pass
          return (
            <div key={kpi.label} className="card p-3">
              <div className="flex items-center gap-1 mb-1">
                <p className="text-tp-muted text-[9px] leading-tight">{kpi.label}</p>
                <InfoTooltip text={KPI_TOOLTIPS[kpi.label]} size={10} position="below" />
              </div>
              <p className="font-mono font-bold text-tp-white text-xl leading-none mb-0.5">{kpi.value}{kpi.unit && <span className="text-tp-muted text-[10px] ml-1 font-normal">{kpi.unit}</span>}</p>
              <p className="text-tp-muted text-[9px] mb-1">Reference: {kpi.target}</p>
              <span className={clsx('flex items-center gap-1 text-[10px] font-bold', cfg.color)}><span className="w-2 h-2 rounded-sm" style={{ background: cfg.dot }} />{kpi.statusLabel}</span>
            </div>
          )
        })}
      </div>

      <div className="flex gap-1 bg-tp-surface p-1 rounded-xl border border-tp-border">
        {[
          { id: 'overview', label: 'All results' },
          { id: 'sections', label: 'Test domains' },
          { id: 'priorities', label: 'Coach priorities' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={clsx('flex-1 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t.id ? 'bg-tp-red text-white' : 'text-tp-muted hover:text-tp-white',
            )}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab />}
      {tab === 'sections' && (
        <div className="space-y-3 animate-fade-in">
          <BessSection />
          <ImtpSection />
          <LowerBodySection />
          <UpperBodySection />
          <JumpSection />
          <MedBallSection />
          <AerobicSection />
        </div>
      )}
      {tab === 'priorities' && <PrioritiesTab />}
      </div>}
    </div>
  )
}
