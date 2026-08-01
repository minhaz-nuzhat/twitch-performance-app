/**
 * MacroRing — small SVG donut ring for macro tracking.
 * Props:
 *   value   : number (consumed)
 *   target  : number (goal)
 *   label   : string
 *   color   : hex string
 *   size    : number (px, default 80)
 */
export default function MacroRing({ value = 0, target = 1, label = '', color = '#e63946', size = 80 }) {
  const stroke       = 7
  const radius       = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct           = Math.min(value / target, 1)
  const offset        = circumference * (1 - pct)
  const cx            = size / 2
  const cy            = size / 2

  const overTarget = value > target

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#1e1e1e" strokeWidth={stroke} />
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={overTarget ? '#ef4444' : color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: 'stroke-dashoffset 0.7s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono font-bold leading-none"
            style={{ fontSize: size * 0.2, color: overTarget ? '#ef4444' : '#f0f0f0' }}
          >
            {value}
          </span>
          <span className="text-tp-muted" style={{ fontSize: size * 0.1 }}>g</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-tp-white text-xs font-medium">{label}</p>
        <p className="text-tp-muted text-[10px]">of {target}g</p>
      </div>
    </div>
  )
}
