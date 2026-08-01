import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

const TIER_CONFIG = {
  bronze: { color: '#cd7f32', glow: 'rgba(205,127,50,0.35)',  track: '#2a1f10' },
  silver: { color: '#c0c0c0', glow: 'rgba(192,192,192,0.25)', track: '#1e1e1e' },
  gold:   { color: '#ffd700', glow: 'rgba(255,215,0,0.35)',   track: '#2a2200' },
  elite:  { color: '#b347ea', glow: 'rgba(179,71,234,0.35)',  track: '#1e0a2a' },
}

/**
 * ScoreRing — animated SVG ring component.
 * Props:
 *   score   : number 0–100
 *   tier    : 'bronze' | 'silver' | 'gold' | 'elite'
 *   size    : number (px, default 200)
 *   stroke  : number (strokeWidth, default 14)
 *   animate : boolean (default true)
 *   label   : string (centre sub-label, default 'SCORE')
 */
export default function ScoreRing({
  score = 0,
  tier  = 'silver',
  size  = 200,
  stroke = 14,
  animate = true,
  label   = 'SCORE',
}) {
  const { color, glow, track } = TIER_CONFIG[tier] ?? TIER_CONFIG.silver

  const cx           = size / 2
  const cy           = size / 2
  const radius       = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius

  // Animate count-up
  const [display, setDisplay]   = useState(animate ? 0 : score)
  const [offset, setOffset]     = useState(circumference)
  const rafRef                  = useRef(null)

  useEffect(() => {
    if (!animate) {
      setDisplay(score)
      setOffset(circumference * (1 - score / 100))
      return
    }

    // Run over ~900ms
    const duration  = 900
    const start     = performance.now()
    const startVal  = 0

    const tick = (now) => {
      const elapsed  = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3)
      const current  = Math.round(startVal + (score - startVal) * eased)
      setDisplay(current)
      setOffset(circumference * (1 - current / 100))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [score, circumference, animate])

  return (
    <div
      className="relative flex-shrink-0"
      style={{
        width: size,
        height: size,
        filter: `drop-shadow(0 0 18px ${glow})`,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background track */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={track}
          strokeWidth={stroke}
        />

        {/* Coloured arc */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: animate ? 'none' : 'stroke-dashoffset 0.8s ease' }}
        />

        {/* Subtle tick marks */}
        {[0, 25, 50, 75].map((pct) => {
          const angle = (pct / 100) * 360 - 90
          const rad   = (angle * Math.PI) / 180
          const r1    = radius + stroke / 2 + 2
          const r2    = radius + stroke / 2 + 7
          return (
            <line
              key={pct}
              x1={cx + r1 * Math.cos(rad)}
              y1={cy + r1 * Math.sin(rad)}
              x2={cx + r2 * Math.cos(rad)}
              y2={cy + r2 * Math.sin(rad)}
              stroke="#333"
              strokeWidth={1.5}
            />
          )
        })}
      </svg>

      {/* Centre text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono font-bold text-tp-white leading-none" style={{ fontSize: size * 0.22 }}>
          {display}
        </span>
        <span
          className="uppercase tracking-[0.18em] text-tp-muted mt-1"
          style={{ fontSize: size * 0.065 }}
        >
          {label}
        </span>
      </div>
    </div>
  )
}
