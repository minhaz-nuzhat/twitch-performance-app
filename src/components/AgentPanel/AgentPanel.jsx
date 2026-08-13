import { useState, useRef, useEffect } from 'react'
import { Send, X, Loader, Copy, ExternalLink } from 'lucide-react'
import { useAgent } from '../../hooks/useAgent'
import clsx from 'clsx'

export default function AgentPanel({ isOpen, onClose, userRole = 'member', entityId = null }) {
  const mode = userRole === 'coach' ? 'coach-assist' : 'member-query'
  const { sendMessage, applyScenario, isLoading, error, clearError } = useAgent(mode, entityId)

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        userRole === 'coach'
          ? "Hey Coach! Ask me anything—training programs, nutrition plans, member analysis, injury protocols, performance trends. I'm here to amplify your coaching."
          : "Hey! Ask me anything about your performance, training plans, nutrition, recovery, goals, or how to improve. I'm here to help you level up.",
      timestamp: new Date(),
      type: 'greeting'
    }
  ])
  const [input, setInput] = useState('')
  const [scenarios, setScenarios] = useState([])
  const [selectedScenario, setSelectedScenario] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMsg = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    try {
      // Send to agent
      const { response, scenarios: retrievedScenarios } = await sendMessage(
        input,
        messages.slice(-6) // Last 6 messages for context
      )

      // Add agent response
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
          content: `✓ Scenario "${scenario.name}" has been applied! Your coach can now track outcomes and refine it based on your progress.`,
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
      <div className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-tp-card border-l border-tp-border shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="p-4 border-b border-tp-border flex items-center justify-between flex-shrink-0">
          <div className="flex-1">
            <h2 className="text-tp-white font-semibold text-sm flex items-center gap-2">
              <span className="text-lg">🤖</span>
              {userRole === 'coach' ? 'Coach Assistant' : 'Performance Assistant'}
            </h2>
            <p className="text-tp-muted text-xs mt-1">
              AI-powered assistant by Foundry
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-tp-muted hover:text-tp-white transition-colors p-1.5 hover:bg-tp-raised rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={clsx('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-tp-red/20 border border-tp-red/30 flex items-center justify-center text-sm">
                  🤖
                </div>
              )}

              <div
                className={clsx(
                  'max-w-xs px-4 py-2.5 rounded-lg text-xs leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-tp-red text-tp-white rounded-br-none'
                    : msg.type === 'success'
                      ? 'bg-tp-green/10 text-tp-green border border-tp-green/20 rounded-bl-none'
                      : 'bg-tp-raised text-tp-soft rounded-bl-none'
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
            <div className="space-y-2 mt-4 pt-4 border-t border-tp-border/30">
              <p className="text-tp-muted text-xs font-semibold px-2">Matching Scenarios:</p>
              {scenarios.map((scenario) => (
                <div
                  key={scenario.scenario_id}
                  className="bg-tp-black border border-tp-border/50 rounded-lg p-3 hover:border-tp-red/30 transition-all cursor-pointer hover:shadow-lg"
                  onClick={() => setSelectedScenario(scenario)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-tp-white font-medium text-xs truncate">{scenario.name}</p>
                      <p className="text-tp-muted text-[10px] mt-0.5">
                        By <span className="text-tp-red">{scenario.author_coach}</span> • Match:{' '}
                        <span className="font-semibold">{(scenario.confidence_score * 100).toFixed(0)}%</span>
                      </p>
                    </div>
                    <span className="text-[10px] bg-tp-red/10 text-tp-red px-1.5 py-0.5 rounded flex-shrink-0">
                      v{scenario.version}
                    </span>
                  </div>

                  <p className="text-tp-soft text-[10px] mb-2.5 line-clamp-2">{scenario.description}</p>

                  <div className="flex gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedScenario(scenario)
                      }}
                      className="flex-1 text-[10px] bg-tp-red/10 text-tp-red border border-tp-red/20 rounded px-2 py-1.5 hover:bg-tp-red/20 transition-colors font-medium"
                    >
                      View Full
                    </button>
                    {userRole === 'member' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleApplyScenario(scenario)
                        }}
                        className="flex-1 text-[10px] bg-tp-green/10 text-tp-green border border-tp-green/20 rounded px-2 py-1.5 hover:bg-tp-green/20 transition-colors font-medium"
                      >
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
            <div className="flex gap-2 justify-start items-center">
              <Loader size={14} className="text-tp-red animate-spin" />
              <p className="text-tp-muted text-xs">Agent thinking...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-tp-danger/10 border border-tp-danger/20 text-tp-danger text-xs rounded-lg p-2.5">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Scenario Modal */}
        {selectedScenario && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 lg:p-0">
            <div className="bg-tp-card border border-tp-border rounded-lg max-w-md w-full max-h-96 overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-tp-card border-b border-tp-border p-4 flex items-center justify-between">
                <h3 className="text-tp-white font-semibold text-sm">{selectedScenario.name}</h3>
                <button
                  onClick={() => setSelectedScenario(null)}
                  className="text-tp-muted hover:text-tp-white p-1"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <p className="text-tp-muted text-xs font-semibold mb-1">Author</p>
                  <p className="text-tp-white text-sm">{selectedScenario.author_coach}</p>
                </div>

                <div>
                  <p className="text-tp-muted text-xs font-semibold mb-1">Confidence Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-tp-raised rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-tp-red to-tp-red transition-all"
                        style={{ width: `${selectedScenario.confidence_score * 100}%` }}
                      />
                    </div>
                    <span className="text-tp-white font-mono text-xs">
                      {(selectedScenario.confidence_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-tp-muted text-xs font-semibold mb-1">Description</p>
                  <p className="text-tp-soft text-xs leading-relaxed">{selectedScenario.description}</p>
                </div>

                {selectedScenario.recommendations && (
                  <div>
                    <p className="text-tp-muted text-xs font-semibold mb-1">Recommendations</p>
                    <div className="bg-tp-black rounded p-2.5 text-[10px] text-tp-soft space-y-1 font-mono">
                      <div>
                        <span className="text-tp-red">Program:</span> {selectedScenario.recommendations.program}
                      </div>
                      <div>
                        <span className="text-tp-red">Nutrition:</span> {selectedScenario.recommendations.nutrition}
                      </div>
                      <div>
                        <span className="text-tp-red">Duration:</span> {selectedScenario.recommendations.duration}
                      </div>
                    </div>
                  </div>
                )}

                {selectedScenario.success_rate && (
                  <div>
                    <p className="text-tp-muted text-xs font-semibold mb-1">Success Rate</p>
                    <p className="text-tp-green text-sm font-semibold">
                      {(selectedScenario.success_rate * 100).toFixed(0)}% (
                      {selectedScenario.success_count}/{selectedScenario.applications_count} athletes)
                    </p>
                  </div>
                )}

                {userRole === 'member' && (
                  <div className="pt-2 border-t border-tp-border flex gap-2">
                    <button
                      onClick={() => setSelectedScenario(null)}
                      className="flex-1 text-xs bg-tp-raised text-tp-white border border-tp-border rounded px-3 py-2 hover:bg-tp-border transition-colors font-medium"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => handleApplyScenario(selectedScenario)}
                      className="flex-1 text-xs bg-tp-green text-tp-black rounded px-3 py-2 hover:bg-tp-green/80 transition-colors font-semibold flex items-center justify-center gap-1"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader size={12} className="animate-spin" />
                          Applying...
                        </>
                      ) : (
                        <>
                          <ExternalLink size={12} />
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

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-tp-border flex gap-2 flex-shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              userRole === 'coach'
                ? 'Ask about training, nutrition, protocols, members...'
                : 'Ask about your performance, training, nutrition, goals...'
            }
            className="flex-1 bg-tp-raised border border-tp-border text-tp-white text-xs rounded-lg px-3 py-2.5 placeholder-tp-muted focus:outline-none focus:border-tp-red/50 focus:ring-1 focus:ring-tp-red/20 transition-all"
            disabled={isLoading}
            maxLength={500}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-tp-red text-tp-white p-2.5 rounded-lg hover:bg-tp-danger disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </>
  )
}
