import { useState, useRef, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useRoster } from '../../hooks/useTrainerApi'
import clsx from 'clsx'

const LABELS = {
  '/trainer':             'Dashboard',
  '/trainer/roster':      'Roster',
  '/trainer/assessments': 'Assessments',
  '/trainer/assessments/new': 'New Assessment',
  '/trainer/programs':    'Programs',
  '/trainer/programs/new':'Program Builder',
  '/trainer/messages':    'Messages',
  '/trainer/analytics':   'Analytics',
}

export default function TrainerTopBar() {
  const { user, logout }    = useAuth()
  const { pathname }        = useLocation()
  const { data: roster }    = useRoster()
  const navigate            = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef             = useRef(null)

  const title   = Object.entries(LABELS).find(([k]) => pathname.startsWith(k) && (k === pathname || pathname.startsWith(k + '/')))?.[1]
               ?? 'Coach Portal'
  const alerts  = roster?.filter(m => m.assessmentDue || m.fatigueScore === 'high').length ?? 0

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between h-14 px-4 lg:px-6 border-b border-tp-border bg-tp-surface/80 backdrop-blur-sm flex-shrink-0">
      <h1 className="text-tp-white font-semibold text-base">{title}</h1>

      <div className="flex items-center gap-3">
        <Link to="/trainer/roster" className="relative p-2 rounded-lg text-tp-soft hover:text-tp-white hover:bg-tp-raised transition-all">
          <Bell size={18} />
          {alerts > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-tp-danger text-[9px] text-white font-bold flex items-center justify-center">{alerts}</span>
          )}
        </Link>

        {/* Avatar with dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-tp-raised transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-tp-raised border border-tp-border flex items-center justify-center">
              <span className="text-tp-soft text-xs font-bold">{user?.avatarInitials ?? 'CR'}</span>
            </div>
            <ChevronDown size={12} className={clsx('text-tp-muted transition-transform', menuOpen && 'rotate-180')} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-tp-elevated border border-tp-border rounded-xl shadow-2xl py-1 z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-tp-border mb-1">
                <p className="text-tp-white text-xs font-semibold">{user?.name ?? 'Coach'}</p>
                <p className="text-tp-muted text-[10px]">Trainer</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-tp-danger hover:bg-tp-danger/10 transition-all text-sm"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
