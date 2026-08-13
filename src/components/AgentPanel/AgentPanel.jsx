import { useState, useRef, useEffect } from 'react'
import { Send, X, Loader, Copy, ExternalLink, Zap, Shield, User } from 'lucide-react'
import { useAgent } from '../../hooks/useAgent'
import clsx from 'clsx'

export default function AgentPanel({ isOpen, onClose, userRole = 'member', entityId = null }) {
  const mode = userRole === 'coach' ? 'coach-assist' : 'member-query'
  const { sendMessage, applyScenario, isLoading, error, clearError } = useAgent(mode, entityId)

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [scenarios, setScenarios] = useState([])
  const [selectedScenario, setSelectedScenario] = useState(null)
  const messagesEndRef = useRef(null)

  // Mock user data for demo (replace with actual from context)
  const mockUserData = userRole === 'coach' ? {
    name: 'Coach Sarah',
    credential: 'Certified Strength Coach',
    icon: '🏋️'
  } : {
    name: 'Your Profile',
    score: 78,
    tier: 'Gold',
    trend: '+12 pts / 30 days',
    icon: '⭐'
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    try {
      const { response, scenarios: retrievedScenarios } = await sendMessage(
        input,
        messages.slice(-6)
      )

      const agentMsg = {
        role: 'assistant',
        content: response,
        scenarios: retrievedScenarios,
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, agentMsg])

      if (retrievedScenarios && retrievedScenarios.length > 0) {
        setScenarios(retrievedScenarios)
      }
    } catch (err) {
      console.error('Agent error:', err)
    }

    clearError()
  }

  const handleApplyScenario = async (scenario) => {
    const result = await applyScenario(scenario.scenario_id, entityId)
    if (result.success) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `✓ Protocol applied! Now tracking outcomes. Your coach can refine based on your progress.`,
          timestamp: new Date(),
          type: 'success'
        }
      ])
      setSelectedScenario(null)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-gradient-to-b from-tp-card to-tp-black border-l border-tp-red/20 shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Premium Header */}
        <div className="p-4 border-b border-tp-red/10 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <div className="text-2xl">{mockUserData.icon}</div>
                <div>
                  <h2 className="text-tp-white font-bold text-sm tracking-tight">
                    {userRole === 'coach' ? 'Foundry Coach Assistant' : 'Foundry Performance AI'}
                  </h2>
                  <p className="text-tp-red text-xs font-semibold">
                    {userRole === 'coach' ? 'Real-time coaching amplifier' : 'Your AI coaching co-pilot'}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-tp-muted hover:text-tp-red transition-colors p-1.5 hover:bg-tp-red/10 rounded"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-3">🤖</div>
              <p className="text-tp-white font-semibold text-sm mb-1">
                {userRole === 'coach' ? 'Ready to amplify your coaching' : 'Ready to level up'}
              </p>
              <p className="text-tp-muted text-xs leading-relaxed">
                {userRole === 'coach'
                  ? 'Ask about programs, nutrition, member analysis, or injury protocols. Powered by Foundry.'
                  : 'Ask about your performance, training, nutrition, recovery, or goals. Trained on real coaching outcomes.'}
              </p>
              <div className="mt-4 flex gap-1 flex-wrap justify-center">
                <span className="text-[10px] bg-tp-red/10 text-tp-red px-2 py-1 rounded border border-tp-red/20">
                  {userRole === 'coach' ? 'Coach-trained' : 'Evidence-based'}
                </span>
                <span className="text-[10px] bg-tp-green/10 text-tp-green px-2 py-1 rounded border border-tp-green/20">
                  Outcome-tracked
                </span>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={clsx('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-tp-red to-tp-red/60 border border-tp-red/30 flex items-center justify-center text-sm font-bold">
                  ⚡
                </div>
              )}

              <div
                className={clsx(
                  'max-w-xs px-4 py-2.5 rounded-lg text-xs leading-relaxed font-medium',
                  msg.role === 'user'
                    ? 'bg-tp-red text-tp-white rounded-br-none shadow-lg'
                    : msg.type === 'success'
                      ? 'bg-tp-green/10 text-tp-green border border-tp-green/30 rounded-bl-none'
                      : 'bg-tp-raised text-tp-white border border-tp-border/50 rounded-bl-none'
                )}
              >
                <p>{msg.content}</p>
                <p className="text-[10px] mt-1.5 opacity-50">
                  {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-tp-border flex items-center justify-center text-[11px]">
                  👤
                </div>
              )}
            </div>
          ))}

          {/* Scenarios List */}
          {scenarios.length > 0 && (
            <div className="space-y-2 mt-6 pt-4 border-t border-tp-red/10">
              <p className="text-tp-red text-xs font-bold px-2 flex items-center gap-1">
                <Shield size={12} /> RECOMMENDED SCENARIOS
              </p>
              {scenarios.map((scenario) => (
                <div
                  key={scenario.scenario_id}
                  className="bg-gradient-to-r from-tp-raised to-tp-card border border-tp-red/20 rounded-lg p-3 hover:border-tp-red/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-tp-red/10"
                  onClick={() => setSelectedScenario(scenario)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-tp-white font-bold text-xs truncate">{scenario.name}</p>
                      <p className="text-tp-muted text-[10px] mt-0.5">
                        By <span className="text-tp-red font-semibold">{scenario.author_coach}</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-[10px] bg-tp-red/20 text-tp-red px-1.5 py-0.5 rounded font-bold">
                        {(scenario.confidence_score * 100).toFixed(0)}%
                      </span>
                      <span className="text-[10px] text-tp-green font-semibold">
                        {scenario.success_count} applied
                      </span>
                    </div>
                  </div>

                  <p className="text-tp-soft text-[10px] mb-2.5 line-clamp-2">{scenario.description}</p>

                  <div className="flex gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedScenario(scenario)
                      }}
                      className="flex-1 text-[10px] bg-tp-red/10 text-tp-red border border-tp-red/30 rounded px-2 py-1.5 hover:bg-tp-red/20 transition-colors font-bold"
                    >
                      Review
                    </button>
                    {userRole === 'member' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleApplyScenario(scenario)
                        }}
                        className="flex-1 text-[10px] bg-tp-green text-tp-black rounded px-2 py-1.5 hover:bg-tp-green/80 transition-colors font-bold flex items-center justify-center gap-1"
                        disabled={isLoading}
                      >
                        <Zap size={10} />
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-2 justify-start items-center px-2">
              <Loader size={14} className="text-tp-red animate-spin" />
              <p className="text-tp-muted text-xs font-semibold">Foundry is thinking...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-tp-danger/10 border border-tp-danger/30 text-tp-danger text-xs rounded-lg p-2.5 font-medium">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Scenario Modal */}
        {selectedScenario && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 lg:p-0">
            <div className="bg-gradient-to-b from-tp-card to-tp-black border border-tp-red/20 rounded-lg max-w-md w-full max-h-96 overflow-y-auto shadow-2xl shadow-tp-red/20">
              <div className="sticky top-0 bg-gradient-to-r from-tp-card to-tp-raised border-b border-tp-red/20 p-4 flex items-center justify-between backdrop-blur-sm">
                <h3 className="text-tp-white font-bold text-sm">{selectedScenario.name}</h3>
                <button
                  onClick={() => setSelectedScenario(null)}
                  className="text-tp-muted hover:text-tp-red p-1 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div className="bg-tp-red/10 border border-tp-red/20 rounded-lg p-2.5">
                  <p className="text-tp-muted text-[10px] font-bold mb-1">SUCCESS RATE</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-tp-raised rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-tp-green to-tp-green"
                        style={{ width: `${selectedScenario.success_rate * 100}%` }}
                      />
                    </div>
                    <span className="text-tp-green font-bold text-xs">{(selectedScenario.success_rate * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-tp-soft text-[10px] mt-1.5">{selectedScenario.success_count} out of {selectedScenario.applications_count} applications</p>
                </div>

                <div>
                  <p className="text-tp-muted text-[10px] font-bold mb-1">COACH</p>
                  <p className="text-tp-white text-sm font-semibold">{selectedScenario.author_coach}</p>
                </div>

                <div>
                  <p className="text-tp-muted text-[10px] font-bold mb-1">PROTOCOL</p>
                  <p className="text-tp-soft text-xs leading-relaxed">{selectedScenario.description}</p>
                </div>

                {selectedScenario.recommendations && (
                  <div className="bg-tp-black border border-tp-border/30 rounded-lg p-2.5">
                    <p className="text-tp-muted text-[10px] font-bold mb-2">RECOMMENDATIONS</p>
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <span className="text-tp-red text-[10px] font-bold flex-shrink-0">Program:</span>
                        <span className="text-tp-soft text-[10px]">{selectedScenario.recommendations.program}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-tp-red text-[10px] font-bold flex-shrink-0">Nutrition:</span>
                        <span className="text-tp-soft text-[10px]">{selectedScenario.recommendations.nutrition}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-tp-red text-[10px] font-bold flex-shrink-0">Duration:</span>
                        <span className="text-tp-soft text-[10px]">{selectedScenario.recommendations.duration}</span>
                      </div>
                    </div>
                  </div>
                )}

                {userRole === 'member' && (
                  <div className="pt-2 border-t border-tp-border/30 flex gap-2">
                    <button
                      onClick={() => setSelectedScenario(null)}
                      className="flex-1 text-xs bg-tp-raised text-tp-white border border-tp-border rounded px-3 py-2 hover:bg-tp-border transition-colors font-bold"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => handleApplyScenario(selectedScenario)}
                      className="flex-1 text-xs bg-gradient-to-r from-tp-green to-tp-green text-tp-black rounded px-3 py-2 hover:from-tp-green/80 hover:to-tp-green/80 transition-all font-bold flex items-center justify-center gap-1 shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader size={12} className="animate-spin" />
                          Applying...
                        </>
                      ) : (
                        <>
                          <Zap size={12} />
                          Apply Protocol
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Premium Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-tp-red/10 flex gap-2 flex-shrink-0 bg-gradient-to-t from-tp-black to-transparent">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              userRole === 'coach'
                ? 'Ask about training, nutrition, members...'
                : 'Ask about your performance, goals...'
            }
            className="flex-1 bg-tp-raised border border-tp-red/20 text-tp-white text-xs rounded-lg px-3 py-2.5 placeholder-tp-muted focus:outline-none focus:border-tp-red/50 focus:ring-1 focus:ring-tp-red/20 transition-all font-medium"
            disabled={isLoading}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-br from-tp-red to-tp-red/80 text-tp-white p-2.5 rounded-lg hover:from-tp-red/80 hover:to-tp-red/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg font-bold"
            title="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </>
  )
}
