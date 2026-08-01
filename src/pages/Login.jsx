import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function Login() {
  const { login }                       = useAuth()
  const navigate                        = useNavigate()
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-tp-black flex flex-col">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#e63946 1px, transparent 1px), linear-gradient(90deg, #e63946 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* Red glow top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-tp-red/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-tp-red/20 border border-tp-red/40 flex items-center justify-center glow-red-sm">
              <Zap size={20} className="text-tp-red fill-tp-red" />
            </div>
            <div>
              <h1 className="text-tp-white font-bold text-2xl tracking-tight leading-none">
                Twitch<span className="text-tp-red">.</span>
              </h1>
              <p className="text-tp-muted text-xs uppercase tracking-[0.2em] mt-0.5">Performance</p>
            </div>
          </div>
          <p className="text-tp-soft text-sm mt-2">Your performance. Measured.</p>
        </div>

        {/* Card */}
        <div className="w-full max-w-sm">
          <div className="card p-8">
            <h2 className="text-tp-white font-semibold text-lg mb-1">Sign in</h2>
            <p className="text-tp-muted text-sm mb-6">Access your personalised dashboard</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="label block mb-2">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <label className="label block mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input pr-11"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-tp-muted hover:text-tp-soft transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-tp-danger/10 border border-tp-danger/25 rounded-lg px-3 py-2">
                  <AlertCircle size={14} className="text-tp-danger flex-shrink-0" />
                  <p className="text-tp-danger text-xs">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          {/* Demo hint */}
          <div className="mt-4 text-center">
            <p className="text-tp-muted text-xs">
              Demo mode — any email & password will work
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center relative z-10">
        <p className="text-tp-muted text-xs">© 2026 Twitch Performance · India</p>
      </footer>
    </div>
  )
}
