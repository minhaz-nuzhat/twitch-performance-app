import clsx from 'clsx'

const TIER = {
  bronze: { label: 'Bronze', bg: 'bg-tp-bronze/15', text: 'text-tp-bronze', border: 'border-tp-bronze/30' },
  silver: { label: 'Silver', bg: 'bg-tp-silver/10', text: 'text-tp-silver', border: 'border-tp-silver/25' },
  gold:   { label: 'Gold',   bg: 'bg-tp-gold/15',   text: 'text-tp-gold',   border: 'border-tp-gold/35'   },
  elite:  { label: 'Elite',  bg: 'bg-tp-elite/15',  text: 'text-tp-elite',  border: 'border-tp-elite/35'  },
}

const TIER_RANGES = {
  bronze: '0 – 39',
  silver: '40 – 64',
  gold:   '65 – 84',
  elite:  '85 – 100',
}

export default function TierBadge({ tier = 'silver', showRange = false, size = 'md' }) {
  const cfg = TIER[tier] ?? TIER.silver

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  }[size]

  return (
    <div className="inline-flex flex-col items-center gap-0.5">
      <span
        className={clsx(
          'inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-widest',
          cfg.bg, cfg.text, cfg.border, sizeClasses,
        )}
      >
        {tier === 'elite' && <span>★</span>}
        {cfg.label}
      </span>
      {showRange && (
        <span className="text-tp-muted text-[10px]">{TIER_RANGES[tier]}</span>
      )}
    </div>
  )
}
