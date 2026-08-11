import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Legend, Tooltip,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-tp-card border border-tp-border-bright rounded-lg px-3 py-2 text-xs shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
      <p className="text-tp-soft font-medium mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-tp-soft">{p.name}:</span>
          <span className="text-tp-white font-mono font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function RadarChartWidget({ data = [] }) {
  if (!data.length) return null

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="#252525" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#a0a0a0', fontSize: 11, fontFamily: 'Inter' }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Previous assessment — ghost */}
          <Radar
            name="Previous"
            dataKey="previous"
            stroke="#444444"
            fill="#444444"
            fillOpacity={0.15}
            strokeWidth={1.5}
            dot={false}
          />

          {/* Current — red */}
          <Radar
            name="Current"
            dataKey="current"
            stroke="#e63946"
            fill="#e63946"
            fillOpacity={0.25}
            strokeWidth={2}
            dot={{ r: 3, fill: '#e63946', strokeWidth: 0 }}
          />

          <Legend
            wrapperStyle={{ fontSize: 11, color: '#a0a0a0', paddingTop: 8 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
