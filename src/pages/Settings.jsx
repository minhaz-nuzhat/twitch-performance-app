import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, Bell, Eye, RotateCcw, SlidersHorizontal } from 'lucide-react'
import clsx from 'clsx'

function Toggle({ value, onChange, label = 'Toggle setting' }) {
  return (
    <button
      onClick={() => onChange(!value)}
      aria-label={label}
      aria-pressed={value}
      className="w-11 h-11 relative flex-shrink-0"
    >
      <span className={clsx('absolute left-0.5 right-0.5 top-1/2 -translate-y-1/2 h-[22px] rounded-full border transition-colors', value ? 'bg-tp-red border-tp-red' : 'bg-tp-raised border-tp-border')} />
      <span
        className={clsx(
          'absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow transition-all duration-200',
          value ? 'left-6' : 'left-1',
        )}
      />
    </button>
  )
}

function SettingRow({ label, description, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="flex-1 min-w-0">
        <p className="text-tp-white text-sm font-medium">{label}</p>
        {description && <p className="text-tp-muted text-xs mt-0.5">{description}</p>}
      </div>
      <Toggle value={value} onChange={onChange} label={label} />
    </div>
  )
}

export default function Settings() {
  const { user, updatePreferences } = useAuth()
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    pushNotifications:  true,
    sessionReminders:   true,
    scoreAlerts:        true,
    marketingEmails:    false,
    researchConsent:    user?.preferences?.researchConsent ?? true,
    showAthleteAge:     true,
    darkMode:           true,
  })

  const insightMode = user?.preferences?.insightMode ?? 'guided'
  const photoCheckIns = user?.preferences?.photoCheckIns ?? true

  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }))

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Notifications ── */}
      <div>
        <div className="flex items-center gap-2 px-1 mb-2">
          <Bell size={14} className="text-tp-red" />
          <p className="label">Notifications</p>
        </div>
        <div className="card divide-y divide-tp-border">
          <SettingRow label="Push Notifications"  description="In-app alerts for new plans, messages, score updates" value={settings.pushNotifications} onChange={() => toggle('pushNotifications')} />
          <SettingRow label="Session Reminders"   description="Reminder 1 hour before scheduled sessions"           value={settings.sessionReminders}  onChange={() => toggle('sessionReminders')}  />
          <SettingRow label="Score Drop Alerts"   description="Alert when composite score drops >10 points"         value={settings.scoreAlerts}       onChange={() => toggle('scoreAlerts')}       />
          <SettingRow label="Marketing Emails"    description="Updates, tips, and product news"                     value={settings.marketingEmails}   onChange={() => toggle('marketingEmails')}   />
        </div>
      </div>

      {/* ── Privacy & Data ── */}
      <div>
        <div className="flex items-center gap-2 px-1 mb-2">
          <Shield size={14} className="text-tp-red" />
          <p className="label">Privacy & Data</p>
        </div>
        <div className="card divide-y divide-tp-border">
          <SettingRow
            label="Research Consent"
            description="Allow anonymised performance data to be used in Twitch's performance science research (DPDP Act 2023 compliant)"
            value={settings.researchConsent}
            onChange={(value) => {
              setSettings((current) => ({ ...current, researchConsent: value }))
              updatePreferences({ researchConsent: value })
            }}
          />
          <SettingRow
            label="Show Athletic Age"
            description="Display your Athletic Age on your dashboard"
            value={settings.showAthleteAge}
            onChange={() => toggle('showAthleteAge')}
          />
        </div>

        <div className="card mt-2 p-4">
          <p className="text-tp-muted text-xs leading-relaxed">
            Your data is protected under the <span className="text-tp-white">India DPDP Act 2023</span>.
            You can request full data export or account deletion by contacting support.
            Research data is always anonymised — your name and contact details are never shared.
          </p>
          <button className="mt-2 min-h-11 text-tp-red text-xs font-medium hover:text-tp-red-bright transition-colors">
            Request data export →
          </button>
        </div>
      </div>

      {/* ── Display ── */}
      <div>
        <div className="flex items-center gap-2 px-1 mb-2">
          <SlidersHorizontal size={14} className="text-tp-red" />
          <p className="label">Display & Insights</p>
        </div>
        <div className="card p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-tp-white text-sm font-medium">Performance detail</p>
              <p className="text-tp-muted text-xs mt-0.5">Choose what Assessment and Progress show first. All details remain available.</p>
            </div>
            <div className="flex bg-tp-raised border border-tp-border rounded-lg p-1 flex-shrink-0">
              {['guided', 'advanced'].map((mode) => (
                <button key={mode} type="button" onClick={() => updatePreferences({ insightMode: mode })} className={clsx('min-h-10 px-4 rounded text-xs font-semibold capitalize transition-colors', insightMode === mode ? 'bg-tp-red text-white' : 'text-tp-muted hover:text-tp-white')}>
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-tp-border flex items-center justify-between gap-4">
            <div><p className="text-tp-white text-sm font-medium">Visual progress check-ins</p><p className="text-tp-muted text-xs mt-0.5">Optional photo milestones visible to you and your assigned coach.</p></div>
            <Toggle value={photoCheckIns} onChange={(value) => updatePreferences({ photoCheckIns: value })} label="Visual progress check-ins" />
          </div>
        </div>
        <div className="card divide-y divide-tp-border mt-2">
          <SettingRow
            label="Dark Mode"
            description="Dark theme is required for this app — cannot be disabled"
            value={settings.darkMode}
            onChange={() => {}}
          />
        </div>
      </div>

      {/* ── Demo ── */}
      <div>
        <div className="flex items-center gap-2 px-1 mb-2">
          <RotateCcw size={14} className="text-tp-red" />
          <p className="label">Onboarding</p>
        </div>
        <div className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-tp-white text-sm font-medium">Restart onboarding</p>
            <p className="text-tp-muted text-xs mt-0.5">Preview the setup again with your current choices preselected.</p>
          </div>
          <button type="button" onClick={() => navigate('/onboarding')} className="btn-ghost min-h-11 px-4 text-xs inline-flex items-center justify-center gap-2 flex-shrink-0">
            <RotateCcw size={13} /> Restart
          </button>
        </div>
      </div>

      {/* ── Account Info ── */}
      <div>
        <div className="flex items-center gap-2 px-1 mb-2">
          <Eye size={14} className="text-tp-red" />
          <p className="label">Account</p>
        </div>
        <div className="card divide-y divide-tp-border">
          {[
            { label: 'Name',         value: user?.name       },
            { label: 'Email',        value: user?.email      },
            { label: 'Sport',        value: user?.sport      },
            { label: 'Member since', value: user?.joinedAt   },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-4 py-3 gap-3">
              <p className="text-tp-muted text-xs">{label}</p>
              <p className="text-tp-white text-sm text-right">{value ?? '—'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Version */}
      <p className="text-center text-tp-muted text-xs pb-2">Twitch Performance v0.1 · Frontend Demo</p>
    </div>
  )
}
