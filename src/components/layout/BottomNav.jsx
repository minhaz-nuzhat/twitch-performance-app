import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Dumbbell, Utensils, TrendingUp, MessageCircle, Activity, MoreHorizontal, User, Settings, CreditCard, LogOut, X } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../../context/AuthContext'

const TABS = [
  { to: '/',           label: 'Home',       icon: LayoutDashboard, end: true },
  { to: '/training',   label: 'Training',   icon: Dumbbell                   },
  { to: '/nutrition',  label: 'Nutrition',  icon: Utensils                   },
  { to: '/progress',   label: 'Progress',   icon: TrendingUp                 },
]

const MORE_LINKS = [
  { to: '/assessment', label: 'Assessment', detail: 'Performance testing and physio ROM', icon: Activity },
  { to: '/messages', label: 'Messages', detail: 'Talk with your coach', icon: MessageCircle },
  { to: '/profile', label: 'Account', detail: 'Profile and membership', icon: User },
  { to: '/settings', label: 'Settings', detail: 'Preferences and consent', icon: Settings },
  { to: '/payment', label: 'Subscription', detail: 'Plan and billing', icon: CreditCard },
]

export default function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const moreActive = MORE_LINKS.some(({ to }) => pathname === to)

  const signOut = () => {
    logout()
    setMoreOpen(false)
    navigate('/login')
  }

  return (
    <>
      {moreOpen && (
        <div className="fixed inset-0 z-[60] bg-black/75 flex items-end" onClick={(event) => event.target === event.currentTarget && setMoreOpen(false)}>
          <section className="w-full bg-tp-surface border-t border-tp-border rounded-t-xl px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] animate-fade-up" aria-label="More navigation">
            <div className="flex items-center justify-between mb-3"><div><h2 className="text-tp-white font-semibold">More</h2><p className="text-tp-muted text-xs mt-0.5">Your insights, coach, and account</p></div><button type="button" onClick={() => setMoreOpen(false)} className="w-10 h-10 rounded-lg bg-tp-raised text-tp-soft flex items-center justify-center" aria-label="Close more menu"><X size={17} /></button></div>
            <div className="divide-y divide-tp-border border-y border-tp-border">
              {MORE_LINKS.map(({ to, label, detail, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setMoreOpen(false)} className="min-h-16 flex items-center gap-3 py-3"><span className="w-9 h-9 rounded-lg bg-tp-raised text-tp-red flex items-center justify-center"><Icon size={17} /></span><span className="flex-1"><span className="text-tp-white text-sm font-semibold block">{label}</span><span className="text-tp-muted text-xs block mt-0.5">{detail}</span></span></NavLink>)}
            </div>
            <button type="button" onClick={signOut} className="w-full min-h-12 mt-3 flex items-center gap-3 text-tp-danger text-sm font-semibold"><LogOut size={17} />Sign out</button>
          </section>
        </div>
      )}
      <div className="grid grid-cols-5 h-[68px] px-1 pb-[env(safe-area-inset-bottom)]">
        {TABS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            clsx(
              'flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all duration-150 min-w-0',
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
        <button type="button" onClick={() => setMoreOpen(true)} className={clsx('flex flex-col items-center justify-center gap-1 text-[10px] font-medium', moreActive || moreOpen ? 'text-tp-red' : 'text-tp-muted')} aria-label="Open more navigation"><MoreHorizontal size={20} /><span>More</span></button>
      </div>
    </>
  )
}
