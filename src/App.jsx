import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import AppShell      from './components/layout/AppShell'
import TrainerShell  from './components/layout/TrainerShell'
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

import TrainerDashboard     from './pages/trainer/TrainerDashboard'
import Roster               from './pages/trainer/Roster'
import MemberDetail         from './pages/trainer/MemberDetail'
import AssessmentEntry      from './pages/trainer/AssessmentEntry'
import Programs             from './pages/trainer/Programs'
import ProgramBuilderPage   from './pages/trainer/ProgramBuilderPage'
import NutritionBuilderPage from './pages/trainer/NutritionBuilderPage'
import TrainerMessages      from './pages/trainer/TrainerMessages'
import TrainerAnalytics     from './pages/trainer/TrainerAnalytics'
import UserFlow             from './pages/UserFlow'

// ── Auth guards ───────────────────────────────────────────────
function RequireAuth() {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-tp-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-tp-border border-t-tp-red rounded-full animate-spin" />
        <p className="text-tp-muted text-xs">Loading…</p>
      </div>
    </div>
  )
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

function RequireMember() {
  const { user } = useAuth()
  if (user?.role === 'trainer') return <Navigate to="/trainer" replace />
  return <Outlet />
}

function RequireTrainer() {
  const { user } = useAuth()
  if (user?.role !== 'trainer') return <Navigate to="/" replace />
  return <Outlet />
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/userflow" element={<UserFlow />} />

          {/* Protected */}
          <Route element={<RequireAuth />}>
            {/* ── Member routes ── */}
            <Route element={<RequireMember />}>
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

            {/* ── Trainer routes ── */}
            <Route element={<RequireTrainer />}>
              <Route element={<TrainerShell />}>
                <Route path="/trainer"                      element={<TrainerDashboard     />} />
                <Route path="/trainer/roster"               element={<Roster               />} />
                <Route path="/trainer/roster/:id"           element={<MemberDetail         />} />
                <Route path="/trainer/assessments"          element={<AssessmentEntry      />} />
                <Route path="/trainer/assessments/new"      element={<AssessmentEntry      />} />
                <Route path="/trainer/programs"             element={<Programs             />} />
                <Route path="/trainer/programs/new"         element={<ProgramBuilderPage   />} />
                <Route path="/trainer/nutrition/new"        element={<NutritionBuilderPage />} />
                <Route path="/trainer/messages"             element={<TrainerMessages      />} />
                <Route path="/trainer/analytics"            element={<TrainerAnalytics     />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
