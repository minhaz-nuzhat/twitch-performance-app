import { useState, useEffect, useRef } from 'react'
import { useMessages } from '../hooks/useApi'
import { useAuth } from '../context/AuthContext'
import { Send, MessageCircle } from 'lucide-react'
import clsx from 'clsx'
import { mockMember } from '../data/mockData'

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function Messages() {
  const { user }                = useAuth()
  const { data: msgs, sendMessage, loading } = useMessages()
  const [input, setInput]       = useState('')
  const bottomRef               = useRef(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    sendMessage(text)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (loading || !msgs) {
    return <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] animate-fade-in">

      {/* ── Trainer Header ── */}
      <div className="card px-4 py-3 mb-4 flex items-center gap-3 flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-tp-surface border border-tp-border flex items-center justify-center flex-shrink-0">
          <span className="text-tp-soft text-xs font-bold">{mockMember.trainer.avatarInitials}</span>
        </div>
        <div>
          <p className="text-tp-white font-semibold text-sm">{mockMember.trainer.name}</p>
          <p className="text-tp-muted text-xs">{mockMember.trainer.specialization}</p>
        </div>
        <div className="ml-auto">
          <div className="w-2 h-2 rounded-full bg-tp-green" title="Online" />
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-2 pr-1">
        {msgs.map((msg, i) => {
          const isMe = msg.sender === 'member'
          const showDate = i === 0 || formatDate(msgs[i - 1]?.time) !== formatDate(msg.time)

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="text-center my-3">
                  <span className="text-tp-muted text-[10px] bg-tp-surface px-3 py-1 rounded-full">
                    {formatDate(msg.time)}
                  </span>
                </div>
              )}

              <div className={clsx('flex', isMe ? 'justify-end' : 'justify-start')}>
                {!isMe && (
                  <div className="w-7 h-7 rounded-full bg-tp-surface border border-tp-border flex items-center justify-center text-[10px] font-bold text-tp-soft flex-shrink-0 mr-2 mt-1">
                    {mockMember.trainer.avatarInitials}
                  </div>
                )}

                <div className={clsx(
                  'max-w-[78%] rounded-2xl px-4 py-2.5',
                  isMe
                    ? 'bg-tp-red text-white rounded-tr-sm'
                    : 'bg-tp-raised border border-tp-border text-tp-white rounded-tl-sm',
                )}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={clsx('text-[10px] mt-1', isMe ? 'text-white/60' : 'text-tp-muted')}>
                    {formatTime(msg.time)}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className="pt-3 flex-shrink-0">
        <div className="flex gap-2 bg-tp-surface border border-tp-border rounded-xl p-1.5">
          <textarea
            rows={1}
            className="flex-1 bg-transparent text-tp-white text-sm placeholder-tp-muted resize-none px-2 py-2 focus:outline-none leading-relaxed"
            placeholder="Message Coach Ravi…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={clsx(
              'w-10 h-10 rounded-lg flex items-center justify-center transition-all flex-shrink-0',
              input.trim()
                ? 'bg-tp-red text-white hover:bg-tp-red-bright'
                : 'bg-tp-raised text-tp-muted cursor-not-allowed',
            )}
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-tp-muted text-[10px] text-center mt-2">Press Enter to send</p>
      </div>
    </div>
  )
}
