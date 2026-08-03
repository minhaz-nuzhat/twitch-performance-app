import { useLocation, Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut } from 'lucide-react'
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
  const { user, logout }  = useAuth()
  const { pathname }      = useLocation()
  const { data: roster }  = useRoster()
  const navigate          = useNavigate()

  const title   = Object.entries(LABELS).find(([k]) => pathname.startsWith(k) && (k === pathname || pathname.startsWith(k + '/')))?.[1]
               ?? 'Coach Portal'
  const alerts  = roster?.filter(m => m.assessmentDue || m.fatigueScore === 'high').length ?? 0

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
        <div className="w-8 h-8 rounded-full bg-tp-raised border border-tp-border flex items-center justify-center">
          <span className="text-tp-soft text-xs font-bold">{user?.avatarInitials ?? 'CR'}</span>
        </div>
      </div>
    </header>
  )
}
