import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, ClipboardList, Dumbbell, MessageCircle, BarChart2, LogOut, Zap, GitBranch, Upload } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useRoster } from '../../hooks/useTrainerApi'
import clsx from 'clsx'

const NAV = [
  { to: '/trainer',              label: 'Dashboard',    icon: LayoutDashboard, end: true },
  { to: '/trainer/roster',       label: 'Roster',       icon: Users           },
  { to: '/trainer/assessments',  label: 'Assessments',  icon: ClipboardList   },
  { to: '/trainer/programs',     label: 'Programs',     icon: Dumbbell        },
  { to: '/trainer/upload',       label: 'Upload Data',  icon: Upload          },
  { to: '/trainer/messages',     label: 'Messages',     icon: MessageCircle   },
  { to: '/trainer/analytics',    label: 'Analytics',    icon: BarChart2       },
  { to: '/userflow',             label: 'User Journey', icon: GitBranch, external: true },
]

export default function TrainerSidebar() {
  const { user, logout } = useAuth()
  const { data: roster } = useRoster()
  const navigate         = useNavigate()

  const alerts = roster?.filter(m => m.assessmentDue || m.fatigueScore === 'high' || m.trend === 'down').length ?? 0

  return (
    <div className="flex flex-col h-full bg-tp-surface py-6">
      {/* Brand */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-2">
          <Zap size={22} className="text-tp-red fill-tp-red" />
          <span className="text-tp-white font-bold tracking-tight text-lg">Twitch<span className="text-tp-red">.</span></span>
        </div>
        <p className="text-tp-muted text-xs mt-0.5 tracking-widest uppercase">Coach Portal</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end, external }) => (
          external ? (
            <a
              key={to}
              href={`#${to}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-tp-soft hover:text-tp-white hover:bg-tp-raised"
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              <span className="text-tp-muted text-[9px] border border-tp-border px-1.5 py-0.5 rounded uppercase tracking-wider">Preview</span>
            </a>
          ) : (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-tp-red/10 text-tp-red border border-tp-red/20'
                  : 'text-tp-soft hover:text-tp-white hover:bg-tp-raised',
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-tp-red' : ''} />
                  <span className="flex-1">{label}</span>
                  {label === 'Roster' && alerts > 0 && (
                    <span className="bg-tp-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{alerts}</span>
                  )}
                </>
              )}
            </NavLink>
          )
        ))}
      </nav>

      {/* Roster summary */}
      {roster && (
        <div className="mx-3 mb-4 p-3 rounded-xl border border-tp-border bg-tp-card">
          <p className="label mb-2">Roster</p>
          <div className="grid grid-cols-3 gap-1 text-center">
            {[
              { val: roster.length, lbl: 'Members' },
              { val: roster.filter(m => m.adherence >= 80).length, lbl: 'On Track' },
              { val: alerts, lbl: 'Alerts', color: alerts > 0 ? 'text-tp-danger' : 'text-tp-green' },
            ].map(({ val, lbl, color }) => (
              <div key={lbl}>
                <p className={clsx('font-mono font-bold text-base', color ?? 'text-tp-white')}>{val}</p>
                <p className="text-tp-muted text-[10px]">{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User */}
      <div className="px-3 pt-3 border-t border-tp-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-tp-raised border border-tp-border flex items-center justify-center flex-shrink-0">
            <span className="text-tp-soft text-xs font-bold">{user?.avatarInitials ?? 'CR'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-tp-white text-sm font-medium truncate">{user?.name ?? 'Coach'}</p>
            <p className="text-tp-muted text-xs">Trainer</p>
          </div>
          <button onClick={() => { logout(); navigate('/login') }} className="text-tp-muted hover:text-tp-red transition-colors p-1" title="Sign out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
