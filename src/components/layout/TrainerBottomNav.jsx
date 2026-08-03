import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, ClipboardList, Dumbbell, MessageCircle } from 'lucide-react'
import clsx from 'clsx'

const TABS = [
  { to: '/trainer',             label: 'Home',        icon: LayoutDashboard, end: true },
  { to: '/trainer/roster',      label: 'Roster',      icon: Users           },
  { to: '/trainer/assessments', label: 'Assess',      icon: ClipboardList   },
  { to: '/trainer/programs',    label: 'Programs',    icon: Dumbbell        },
  { to: '/trainer/messages',    label: 'Messages',    icon: MessageCircle   },
]

export default function TrainerBottomNav() {
  return (
    <div className="flex items-stretch h-16 px-2">
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end}
          className={({ isActive }) => clsx(
            'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-all',
            isActive ? 'text-tp-red' : 'text-tp-muted',
          )}
        >
          {({ isActive }) => (
            <>
              <Icon size={20} className={clsx('transition-all', isActive && 'drop-shadow-[0_0_6px_rgba(230,57,70,0.7)]')} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}
