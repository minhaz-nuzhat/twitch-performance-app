import { useLocation, Link } from 'react-router-dom'
import { Bell, User, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications, usePerformance } from '../../hooks/useApi'
import clsx from 'clsx'

const ROUTE_LABELS = {
  '/':           'Dashboard',
  '/training':   'Training',
  '/nutrition':  'Nutrition',
  '/progress':   'Progress',
  '/performance':'Performance',
  '/messages':   'Messages',
  '/profile':    'Profile',
  '/settings':   'Settings',
  '/payment':    'Subscription',
}

export default function TopBar() {
  const { user }               = useAuth()
  const { pathname }           = useLocation()
  const { data: notifs }       = useNotifications()
  const { data: perf }         = usePerformance()

  const pageTitle = ROUTE_LABELS[pathname] ?? 'Twitch Performance'
  const unread    = notifs?.filter((n) => !n.read).length ?? 0

  const tierColor = {
    bronze: 'text-tp-bronze', silver: 'text-tp-silver',
    gold:   'text-tp-gold',   elite:  'text-tp-elite',
  }[perf?.tier ?? 'silver']

  return (
    <header className="flex items-center justify-between h-14 px-4 lg:px-6 border-b border-tp-border bg-tp-surface/80 backdrop-blur-sm flex-shrink-0">
      {/* Page title */}
      <div className="flex items-center gap-2">
        <h1 className="text-tp-white font-semibold text-base">{pageTitle}</h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Compact score chip — always visible */}
        {perf && (
          <Link
            to="/performance"
            className={clsx(
              'hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold transition-all',
              'bg-tp-card border-tp-border hover:border-tp-red/40',
              tierColor,
            )}
          >
            <span className="text-tp-white font-mono">{perf.composite}</span>
            <span className="uppercase tracking-wider">{perf.tier}</span>
          </Link>
        )}

        {/* Notifications */}
        <Link
          to="/profile"
          className="relative p-2 rounded-lg text-tp-soft hover:text-tp-white hover:bg-tp-raised transition-all"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-tp-red text-[9px] text-white font-bold flex items-center justify-center">
              {unread}
            </span>
          )}
        </Link>

        {/* Avatar */}
        <Link
          to="/profile"
          className="w-8 h-8 rounded-full bg-tp-red/20 border border-tp-red/30 flex items-center justify-center hover:border-tp-red/60 transition-colors"
        >
          <span className="text-tp-red text-xs font-bold">{user?.avatarInitials ?? '?'}</span>
        </Link>
      </div>
    </header>
  )
}
