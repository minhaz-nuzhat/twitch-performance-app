import { createContext, useContext, useState, useEffect } from 'react'
import { mockMember } from '../data/mockData'
import { mockTrainer } from '../data/mockTrainerData'

// ─────────────────────────────────────────────────────────────
// AuthContext — dummy auth backed by localStorage.
// When the backend is ready, replace the login() body with:
//   const data = await authApi.login(email, password)
//   localStorage.setItem('tp_token', data.token)
//   setUser(data.user)
// ─────────────────────────────────────────────────────────────

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem('tp_session')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { /* corrupt — ignore */ }
    }
    setLoading(false)
  }, [])

  /**
   * Dummy login — accepts any non-empty credentials.
   * Backend hook: replace body with real API call.
   */
  const login = async (email, password) => {
    if (!email || !password) throw new Error('Email and password are required')

    // Simulate network latency
    await new Promise((r) => setTimeout(r, 900))

    const isCoach     = email.toLowerCase().includes('coach') || email.toLowerCase().includes('trainer')
    const sessionUser = isCoach
      ? { ...mockTrainer, email, role: 'trainer' }
      : { ...mockMember,  email, role: 'member'  }

    localStorage.setItem('tp_session', JSON.stringify(sessionUser))
    // Backend hook: localStorage.setItem('tp_token', data.token)
    setUser(sessionUser)
    return sessionUser
  }

  const logout = () => {
    localStorage.removeItem('tp_session')
    localStorage.removeItem('tp_token')
    setUser(null)
  }

  const updateUser = (updates) => {
    setUser((current) => {
      if (!current) return current
      const next = { ...current, ...updates }
      localStorage.setItem('tp_session', JSON.stringify(next))
      return next
    })
  }

  const updatePreferences = (updates) => {
    setUser((current) => {
      if (!current) return current
      const next = {
        ...current,
        preferences: { ...current.preferences, ...updates },
      }
      localStorage.setItem('tp_session', JSON.stringify(next))
      return next
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, updatePreferences, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
