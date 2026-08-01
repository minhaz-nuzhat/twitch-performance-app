import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import AppShell      from './components/layout/AppShell'
import Login         from './pages/Login'
import Dashboard     from './pages/Dashboard'
import Performance   from './pages/Performance'
import Training      from './pages/Training'
import Nutrition     from './pages/Nutrition'
import Progress      from './pages/Progress'
import Messages      from './pages/Messages'
import Profile       from './pages/Profile'
import Payment       from './pages/Payment'
import Settings      from './pages/Settings'

// ── Protected route wrapper ──────────────────────────────────
function RequireAuth() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-tp-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-tp-border border-t-tp-red rounded-full animate-spin" />
          <p className="text-tp-muted text-xs">Loading…</p>
        </div>
      </div>
    )
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected — wrapped in AppShell */}
          <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              <Route path="/"            element={<Dashboard   />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/training"    element={<Training    />} />
              <Route path="/nutrition"   element={<Nutrition   />} />
              <Route path="/progress"    element={<Progress    />} />
              <Route path="/messages"    element={<Messages    />} />
              <Route path="/profile"     element={<Profile     />} />
              <Route path="/payment"     element={<Payment     />} />
              <Route path="/settings"    element={<Settings    />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
