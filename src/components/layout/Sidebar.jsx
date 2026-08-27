import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Dumbbell, Utensils, TrendingUp,
  MessageCircle, User, LogOut, Zap, ClipboardList, Activity,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { usePerformance } from '../../hooks/useApi'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/',            label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/training',    label: 'Training',     icon: Dumbbell        },
  { to: '/nutrition',   label: 'Nutrition',    icon: Utensils        },
  { to: '/progress',    label: 'Performance Score', icon: TrendingUp },
  { to: '/assessment',  label: 'Assessment',   icon: Activity        },
  { to: '/messages',    label: 'Messages',     icon: MessageCircle   },
  { to: '/profiling',   label: 'My Profile',   icon: ClipboardList   },
  { to: '/profile',     label: 'Account',      icon: User            },
]

export default function Sidebar() {
  const { user, logout }         = useAuth()
  const { data: perf }           = usePerformance()
  const navigate                 = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const tierColor = {
    bronze: 'text-tp-bronze', silver: 'text-tp-silver',
    gold:   'text-tp-gold',   elite:  'text-tp-elite',
  }[perf?.tier ?? 'silver']

  return (
    <div className="flex flex-col h-full bg-tp-surface py-6">
      {/* Brand */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-2">
          <Zap size={22} className="text-tp-red fill-tp-red" />
          <span className="text-tp-white font-bold tracking-tight text-lg">
            Twitch<span className="text-tp-red">.</span>
          </span>
        </div>
        <p className="text-tp-muted text-xs mt-1 tracking-widest uppercase">Performance</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-tp-red/10 text-tp-red border border-tp-red/20'
                  : 'text-tp-soft hover:text-tp-white hover:bg-tp-raised',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-tp-red' : ''} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Score badge */}
      {perf && (
        <div className="mx-3 mb-4 p-3 rounded-xl border border-tp-border bg-tp-card">
          <div className="flex items-center justify-between mb-2">
            <span className="label">Your Score</span>
            <span className={clsx('text-xs font-bold uppercase tracking-wider', tierColor)}>
              {perf.tier}
            </span>
          </div>
          {/* Mini progress bar */}
          <div className="h-1.5 rounded-full bg-tp-raised overflow-hidden">
            <div
              className="h-full rounded-full bg-tp-red transition-all duration-700"
              style={{ width: `${perf.composite}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="font-mono font-bold text-tp-white text-lg">{perf.composite}</span>
            <span className="text-tp-muted text-xs">/ 100</span>
          </div>
        </div>
      )}

      {/* User + logout */}
      <div className="px-3 pt-3 border-t border-tp-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-tp-red/20 border border-tp-red/30 flex items-center justify-center flex-shrink-0">
            <span className="text-tp-red text-xs font-bold">{user?.avatarInitials ?? '?'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-tp-white text-sm font-medium truncate">{user?.name ?? 'Member'}</p>
            <p className="text-tp-muted text-xs truncate">{user?.email ?? ''}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-tp-muted hover:text-tp-red transition-colors p-1"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
