import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  CreditCard, Settings, MessageCircle, LogOut,
  ChevronRight, User, ClipboardList,
} from 'lucide-react'

function NavCard({ to, icon: Icon, label, description, accent = false }) {
  return (
    <Link
      to={to}
      className={`card px-4 py-4 flex items-center gap-4 hover:border-tp-border-bright transition-all group ${accent ? 'border-tp-red/20 bg-tp-red/3' : ''}`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${accent ? 'bg-tp-red/15' : 'bg-tp-raised'}`}>
        <Icon size={17} className={accent ? 'text-tp-red' : 'text-tp-soft group-hover:text-tp-white'} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${accent ? 'text-tp-red' : 'text-tp-white'}`}>{label}</p>
        {description && <p className="text-tp-muted text-xs mt-0.5">{description}</p>}
      </div>
      <ChevronRight size={14} className="text-tp-muted group-hover:text-tp-red transition-colors flex-shrink-0" />
    </Link>
  )
}

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Account header ── */}
      <div className="card p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-tp-red/15 border border-tp-red/30 flex items-center justify-center flex-shrink-0">
          <span className="text-tp-red font-bold text-lg">{user?.avatarInitials ?? '?'}</span>
        </div>
        <div>
          <p className="text-tp-white font-bold text-base">{user?.name}</p>
          <p className="text-tp-soft text-sm">{user?.sport} · {user?.position}</p>
          <p className="text-tp-muted text-xs mt-0.5">{user?.email}</p>
        </div>
      </div>

      {/* ── Trainer ── */}
      <div>
        <p className="label mb-2 px-1">Your Trainer</p>
        <div className="card px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-tp-raised border border-tp-border flex items-center justify-center flex-shrink-0">
            <span className="text-tp-soft text-xs font-bold">CR</span>
          </div>
          <div className="flex-1">
            <p className="text-tp-white text-sm font-medium">{user?.trainer?.name ?? 'Coach Ravi'}</p>
            <p className="text-tp-muted text-xs">Cricket Performance & Strength</p>
          </div>
          <Link to="/messages" className="flex items-center gap-1 text-tp-red text-xs font-medium hover:text-tp-red-bright transition-colors">
            <MessageCircle size={13} /> Message
          </Link>
        </div>
      </div>

      {/* ── Account links ── */}
      <div className="space-y-2">
        <NavCard to="/profiling"  icon={ClipboardList} label="Client Profiling"      description="Your bio, goals, lifestyle and coaching preferences" accent />
        <NavCard to="/messages"   icon={MessageCircle} label="Messages"              description="Direct thread with Coach Ravi" />
        <NavCard to="/payment"    icon={CreditCard}    label="Subscription & Billing" description="Manage your plan and payment details" />
        <NavCard to="/settings"   icon={Settings}      label="Settings"              description="Notifications, privacy, data consent" />
      </div>

      {/* ── Sign out ── */}
      <button
        onClick={handleLogout}
        className="w-full card px-4 py-3.5 flex items-center gap-3 hover:border-tp-danger/30 transition-all"
      >
        <div className="w-9 h-9 rounded-xl bg-tp-danger/10 flex items-center justify-center flex-shrink-0">
          <LogOut size={16} className="text-tp-danger" />
        </div>
        <span className="text-tp-danger text-sm font-semibold">Sign Out</span>
      </button>
    </div>
  )
}

