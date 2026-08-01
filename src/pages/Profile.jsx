import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePerformance, useNotifications } from '../hooks/useApi'
import TierBadge from '../components/ui/TierBadge'
import {
  CreditCard, Settings, MessageCircle, LogOut,
  Bell, ChevronRight, User,
} from 'lucide-react'
import clsx from 'clsx'

function ProfileLink({ to, icon: Icon, label, badge, danger = false }) {
  return (
    <Link
      to={to}
      className={clsx(
        'card px-4 py-3.5 flex items-center gap-3 hover:border-tp-border-bright transition-all group',
        danger && 'hover:border-tp-danger/30',
      )}
    >
      <div className={clsx(
        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
        danger ? 'bg-tp-danger/10' : 'bg-tp-raised',
      )}>
        <Icon size={16} className={danger ? 'text-tp-danger' : 'text-tp-soft group-hover:text-tp-white'} />
      </div>
      <span className={clsx('flex-1 text-sm font-medium', danger ? 'text-tp-danger' : 'text-tp-white')}>
        {label}
      </span>
      {badge != null && (
        <span className="bg-tp-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
      )}
      <ChevronRight size={14} className="text-tp-muted" />
    </Link>
  )
}

export default function Profile() {
  const { user, logout }    = useAuth()
  const { data: perf }      = usePerformance()
  const { data: notifs }    = useNotifications()
  const navigate            = useNavigate()

  const unread = notifs?.filter((n) => !n.read).length ?? 0

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Member Card ── */}
      <div className="card p-6 border-red-glow">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-tp-red/20 border-2 border-tp-red/40 flex items-center justify-center flex-shrink-0 glow-red-sm">
            <span className="text-tp-red font-bold text-xl">{user?.avatarInitials ?? '?'}</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-tp-white font-bold text-lg truncate">{user?.name}</h2>
            <p className="text-tp-soft text-sm">{user?.sport} · {user?.position}</p>
            <p className="text-tp-muted text-xs mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* Stats row */}
        {perf && (
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="font-mono font-bold text-tp-white text-xl">{perf.composite}</p>
              <p className="label">Score</p>
            </div>
            <div className="text-center border-x border-tp-border">
              <div className="flex justify-center">
                <TierBadge tier={perf.tier} size="sm" />
              </div>
              <p className="label mt-1">Tier</p>
            </div>
            <div className="text-center">
              <p className="font-mono font-bold text-tp-white text-xl">{perf.derived.athleticAge}</p>
              <p className="label">Athletic Age</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Trainer ── */}
      <div>
        <p className="label mb-2 px-1">Your Trainer</p>
        <div className="card px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-tp-surface border border-tp-border flex items-center justify-center flex-shrink-0">
            <span className="text-tp-soft text-xs font-bold">CR</span>
          </div>
          <div className="flex-1">
            <p className="text-tp-white text-sm font-medium">{user?.trainer?.name ?? 'Coach Ravi'}</p>
            <p className="text-tp-muted text-xs">Cricket Performance & Strength</p>
          </div>
          <Link
            to="/messages"
            className="flex items-center gap-1 text-tp-red text-xs font-medium hover:text-tp-red-bright transition-colors"
          >
            <MessageCircle size={14} />
            Message
          </Link>
        </div>
      </div>

      {/* ── Links ── */}
      <div>
        <p className="label mb-2 px-1">Account</p>
        <div className="space-y-2">
          <ProfileLink to="/messages" icon={MessageCircle} label="Messages" badge={unread > 0 ? unread : undefined} />
          <ProfileLink to="/payment"  icon={CreditCard}    label="Subscription & Billing" />
          <ProfileLink to="/settings" icon={Settings}      label="Settings" />
        </div>
      </div>

      {/* ── Notifications ── */}
      {notifs?.length > 0 && (
        <div>
          <p className="label mb-2 px-1">Recent Notifications</p>
          <div className="card divide-y divide-tp-border">
            {notifs.slice(0, 4).map((n) => (
              <div key={n.id} className="flex items-start gap-3 px-4 py-3">
                <div className={clsx('w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0',
                  !n.read ? 'bg-tp-red' : 'bg-tp-border')} />
                <div className="flex-1 min-w-0">
                  <p className="text-tp-white text-xs font-medium">{n.title}</p>
                  <p className="text-tp-muted text-[10px]">{n.body}</p>
                  <p className="text-tp-muted text-[10px] mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Logout ── */}
      <div className="pb-4">
        <button
          onClick={handleLogout}
          className="w-full card px-4 py-3.5 flex items-center gap-3 hover:border-tp-danger/30 transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-tp-danger/10 flex items-center justify-center flex-shrink-0">
            <LogOut size={16} className="text-tp-danger" />
          </div>
          <span className="text-tp-danger text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
