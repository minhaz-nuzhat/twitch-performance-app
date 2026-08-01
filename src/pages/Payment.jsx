import { useSubscription } from '../hooks/useApi'
import { CreditCard, Check, Zap, Lock } from 'lucide-react'
import clsx from 'clsx'

const TIER_COLOR = {
  basic:       'border-tp-border',
  performance: 'border-tp-red/40 bg-tp-red/3',
  elite:       'border-tp-gold/30 bg-tp-gold/3',
}

export default function Payment() {
  const { data: sub, loading } = useSubscription()

  if (loading || !sub) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-40 rounded-xl" />)}</div>
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Current Plan Banner ── */}
      <div className="card p-5 border-tp-red/30 bg-tp-red/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="label block mb-1">Current Plan</span>
            <h2 className="text-tp-white font-bold text-xl">{sub.plan}</h2>
            <p className="text-tp-soft text-sm mt-0.5">
              ₹{sub.monthlyPrice.toLocaleString('en-IN')} / month
            </p>
          </div>
          <div className="text-right">
            <span className="bg-tp-green/15 text-tp-green text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Active
            </span>
            <p className="text-tp-muted text-xs mt-2">
              Renews {new Date(sub.renewsAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        <ul className="mt-4 space-y-1.5">
          {sub.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-tp-soft text-sm">
              <Check size={13} className="text-tp-green flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Payment placeholder notice ── */}
      <div className="card p-4 border-tp-amber/25 bg-tp-amber/5">
        <div className="flex items-start gap-3">
          <Lock size={16} className="text-tp-amber flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-tp-amber font-semibold text-sm">Payment integration coming soon</p>
            <p className="text-tp-soft text-xs mt-1 leading-relaxed">
              The billing system is under development. Your plan is active. No action needed.
              Payment provider (Razorpay / PayU) will be integrated in Phase 1 deployment.
            </p>
          </div>
        </div>
      </div>

      {/* ── Available Plans ── */}
      <div>
        <h3 className="text-tp-white font-semibold mb-3">Available Plans</h3>
        <div className="space-y-3">
          {sub.availablePlans.map((plan) => (
            <div
              key={plan.id}
              className={clsx('card p-5 transition-all', TIER_COLOR[plan.id] ?? 'border-tp-border')}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-tp-white font-bold text-base">{plan.name}</h4>
                    {plan.current && (
                      <span className="bg-tp-red/15 text-tp-red text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Current
                      </span>
                    )}
                    {plan.id === 'elite' && (
                      <span className="bg-tp-gold/15 text-tp-gold text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        ★ Elite
                      </span>
                    )}
                  </div>
                  <p className="text-tp-muted text-xs mt-0.5">Billed monthly</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-tp-white font-mono font-bold text-xl">
                    ₹{plan.price.toLocaleString('en-IN')}
                  </p>
                  <p className="text-tp-muted text-xs">/ month</p>
                </div>
              </div>

              <ul className="space-y-1.5 mb-4">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-tp-soft text-xs">
                    <Check size={11} className="text-tp-green flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                disabled
                className={clsx(
                  'w-full py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2',
                  plan.current
                    ? 'bg-tp-raised text-tp-muted cursor-default border border-tp-border'
                    : 'bg-tp-card text-tp-muted border border-tp-border cursor-not-allowed opacity-60',
                )}
              >
                {plan.current ? (
                  'Current Plan'
                ) : (
                  <>
                    <Lock size={13} />
                    Payment Coming Soon
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Billing history placeholder ── */}
      <div>
        <h3 className="text-tp-white font-semibold mb-3 flex items-center gap-2">
          <CreditCard size={16} className="text-tp-red" />
          Billing History
        </h3>
        <div className="card p-6 text-center">
          <p className="text-tp-muted text-sm">Invoice history will appear here once payment is configured.</p>
        </div>
      </div>
    </div>
  )
}
