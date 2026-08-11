import { useState } from 'react'
import { Info } from 'lucide-react'
import clsx from 'clsx'

/**
 * InfoTooltip — small ⓘ icon that shows a science/context bubble on hover.
 *
 * Props:
 *   text     — the explanation text
 *   size     — icon size (default 12)
 *   align    — 'left' | 'center' | 'right' (default 'left') — which side the bubble opens toward
 *   position — 'above' | 'below' (default 'above')
 */
export function InfoTooltip({ text, size = 12, align = 'left', position = 'above', className }) {
  const [show, setShow] = useState(false)

  if (!text) return null

  const vertClass = position === 'above'
    ? 'bottom-full mb-1.5'
    : 'top-full mt-1.5'

  const horizClass = align === 'center'
    ? 'left-1/2 -translate-x-1/2'
    : align === 'right'
      ? 'right-0'
      : 'left-0'

  return (
    <span
      className={clsx('relative inline-flex items-center flex-shrink-0', className)}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      <button
        type="button"
        className="text-tp-muted hover:text-tp-soft transition-colors focus:outline-none p-0.5 leading-none"
        tabIndex={0}
        aria-label="More information"
      >
        <Info size={size} />
      </button>

      {show && (
        <div
          className={clsx(
            'absolute z-50 w-64 bg-tp-elevated border border-tp-border rounded-xl p-3 shadow-2xl pointer-events-none',
            vertClass,
            horizClass,
          )}
          role="tooltip"
        >
          <p className="text-tp-soft text-[11px] leading-relaxed">{text}</p>
        </div>
      )}
    </span>
  )
}
