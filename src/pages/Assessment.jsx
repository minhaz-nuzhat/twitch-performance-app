import { useState } from 'react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import { mockAssessmentReport as data } from '../data/mockData'
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
    <div className="bg-tp-elevated border border-tp-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-tp-soft mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="font-mono font-bold" style={{ color: p.color ?? p.fill }}>
          {p.name ?? p.dataKey}: {p.value}
        </p>
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

export default function Assessment() {
  const [tab, setTab] = useState('overview')
  const { member, kpis } = data

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="card p-4 border-l-4 border-tp-red">
        <p className="text-tp-red text-[9px] font-bold uppercase tracking-widest mb-1">Performance Assessment Report</p>
        <h2 className="text-tp-white font-bold text-xl mb-1">{member.name}</h2>
        <p className="text-tp-soft text-xs">{member.id} · {member.sport} · {member.position} · Test No. {member.testNo}</p>
        <p className="text-tp-soft text-xs mt-0.5">Assessment Date: {member.assessmentDate} | Body Weight: {member.bodyWeight} kg | Baseline Assessment</p>
        <p className="text-tp-muted text-xs italic mt-0.5">Report by Lead Performance Coach: {member.coach}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map(kpi => {
          const cfg = KPI_STATUS_CFG[kpi.status] ?? KPI_STATUS_CFG.pass
          return (
            <div key={kpi.label} className="card p-3">
              <div className="flex items-center gap-1 mb-1">
                <p className="text-tp-muted text-[9px] leading-tight">{kpi.label}</p>
                <InfoTooltip text={KPI_TOOLTIPS[kpi.label]} size={10} position="below" />
              </div>
              <p className="font-mono font-bold text-tp-white text-xl leading-none mb-0.5">
                {kpi.value}
                {kpi.unit && <span className="text-tp-muted text-[10px] ml-1 font-normal">{kpi.unit}</span>}
              </p>
              <p className="text-tp-muted text-[9px] mb-1">Target: {kpi.target}</p>
              <span className={clsx('flex items-center gap-1 text-[10px] font-bold', cfg.color)}>
                <span className="w-2 h-2 rounded-sm" style={{ background: cfg.dot }} />
                {kpi.statusLabel}
              </span>
            </div>
          )
        })}
      </div>

      <div className="flex gap-1 bg-tp-surface p-1 rounded-xl border border-tp-border">
        {[
          { id: 'overview',   label: 'Overview'   },
          { id: 'sections',   label: 'Sections'   },
          { id: 'priorities', label: 'Priorities' },
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
    </div>
  )
}
