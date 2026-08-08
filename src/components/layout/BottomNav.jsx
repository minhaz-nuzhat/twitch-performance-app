import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Dumbbell, Utensils, TrendingUp, MessageCircle, Activity } from 'lucide-react'
import clsx from 'clsx'

const TABS = [
  { to: '/',           label: 'Home',       icon: LayoutDashboard, end: true },
  { to: '/training',   label: 'Training',   icon: Dumbbell                   },
  { to: '/nutrition',  label: 'Eat',        icon: Utensils                   },
  { to: '/assessment', label: 'Assessment', icon: Activity                   },
  { to: '/progress',   label: 'Progress',   icon: TrendingUp                 },
  { to: '/messages',   label: 'Messages',   icon: MessageCircle              },
]

export default function BottomNav() {
  return (
    <div className="flex items-stretch h-16 px-2">
      {TABS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            clsx(
              'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-all duration-150',
              isActive ? 'text-tp-red' : 'text-tp-muted',
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                size={20}
                className={clsx('transition-all', isActive && 'drop-shadow-[0_0_6px_rgba(230,57,70,0.7)]')}
              />
              <span className={isActive ? 'text-tp-red' : ''}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}
