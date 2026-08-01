import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Shield, Bell, Eye, Moon, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={clsx(
        'w-10 h-5.5 rounded-full transition-all duration-200 relative flex-shrink-0',
        value ? 'bg-tp-red' : 'bg-tp-raised border border-tp-border',
      )}
      style={{ height: '22px', width: '40px' }}
    >
      <span
        className={clsx(
          'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200',
          value ? 'left-5' : 'left-0.5',
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
      <Toggle value={value} onChange={onChange} />
    </div>
  )
}

export default function Settings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState({
    pushNotifications:  true,
    sessionReminders:   true,
    scoreAlerts:        true,
    marketingEmails:    false,
    researchConsent:    true,
    showAthleteAge:     true,
    darkMode:           true,
  })

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
            onChange={() => toggle('researchConsent')}
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
          <button className="mt-3 text-tp-red text-xs font-medium hover:text-tp-red-bright transition-colors">
            Request data export →
          </button>
        </div>
      </div>

      {/* ── Display ── */}
      <div>
        <div className="flex items-center gap-2 px-1 mb-2">
          <Moon size={14} className="text-tp-red" />
          <p className="label">Display</p>
        </div>
        <div className="card divide-y divide-tp-border">
          <SettingRow
            label="Dark Mode"
            description="Dark theme is required for this app — cannot be disabled"
            value={settings.darkMode}
            onChange={() => {}}
          />
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
