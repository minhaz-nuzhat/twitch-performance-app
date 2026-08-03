import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTrainerMessages } from '../../hooks/useTrainerApi'
import { mockRoster } from '../../data/mockTrainerData'
import { Send } from 'lucide-react'
import clsx from 'clsx'

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export default function TrainerMessages() {
  const { data: threads, sendMessage, loading } = useTrainerMessages()
  const [activeMemberId, setActiveMemberId]      = useState(mockRoster[0]?.id ?? null)
  const [input, setInput]                         = useState('')
  const bottomRef                                 = useRef(null)

  const activeThread = threads?.[activeMemberId] ?? []
  const activeMember = mockRoster.find(m => m.id === activeMemberId)

  // Count unread per member
  const unreadCounts = Object.fromEntries(
    mockRoster.map(m => [m.id, (threads?.[m.id] ?? []).filter(msg => msg.sender === 'member' && !msg.read).length])
  )

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [activeThread.length])

  const handleSend = () => {
    const text = input.trim()
    if (!text || !activeMemberId) return
    sendMessage(activeMemberId, text)
    setInput('')
  }

  if (loading) return <div className="skeleton h-96 rounded-xl" />

  return (
    <div className="flex h-[calc(100vh-120px)] gap-0 card overflow-hidden animate-fade-in">
      {/* ── Member list ── */}
      <div className="w-56 flex-shrink-0 border-r border-tp-border flex flex-col">
        <div className="px-3 py-3 border-b border-tp-border">
          <p className="label">Conversations</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockRoster.map(member => {
            const lastMsg     = (threads?.[member.id] ?? []).slice(-1)[0]
            const unread      = unreadCounts[member.id] ?? 0
            const isActive    = member.id === activeMemberId

            return (
              <button
                key={member.id}
                onClick={() => setActiveMemberId(member.id)}
                className={clsx(
                  'w-full flex items-center gap-2.5 px-3 py-3 transition-all border-l-2 text-left',
                  isActive ? 'bg-tp-red/5 border-tp-red' : 'border-transparent hover:bg-tp-raised',
                )}
              >
                <div className="w-8 h-8 rounded-full bg-tp-raised border border-tp-border flex items-center justify-center flex-shrink-0">
                  <span className="text-tp-soft text-[10px] font-bold">{member.avatarInitials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-tp-white text-xs font-medium truncate">{member.name.split(' ')[0]}</p>
                    {unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-tp-red text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">{unread}</span>
                    )}
                  </div>
                  <p className="text-tp-muted text-[10px] truncate">{lastMsg?.text ?? 'No messages yet'}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Chat panel ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        {activeMember && (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-tp-border flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-tp-raised border border-tp-border flex items-center justify-center flex-shrink-0">
              <span className="text-tp-soft text-[10px] font-bold">{activeMember.avatarInitials}</span>
            </div>
            <div>
              <p className="text-tp-white text-sm font-semibold">{activeMember.name}</p>
              <p className="text-tp-muted text-xs">{activeMember.sport}</p>
            </div>
            <Link to={`/trainer/roster/${activeMember.id}`} className="ml-auto text-tp-red text-xs hover:text-tp-red-bright transition-colors">
              View Profile →
            </Link>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeThread.map((msg) => {
            const isTrainer = msg.sender === 'trainer'
            return (
              <div key={msg.id} className={clsx('flex', isTrainer ? 'justify-end' : 'justify-start')}>
                {!isTrainer && (
                  <div className="w-6 h-6 rounded-full bg-tp-raised border border-tp-border flex items-center justify-center text-[9px] font-bold text-tp-soft flex-shrink-0 mr-1.5 mt-1">
                    {activeMember?.avatarInitials?.[0]}
                  </div>
                )}
                <div className={clsx('max-w-[78%] rounded-2xl px-3.5 py-2.5',
                  isTrainer ? 'bg-tp-red text-white rounded-tr-sm' : 'bg-tp-raised border border-tp-border text-tp-white rounded-tl-sm'
                )}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={clsx('text-[10px] mt-0.5', isTrainer ? 'text-white/60' : 'text-tp-muted')}>
                    {formatTime(msg.time)}
                  </p>
                </div>
              </div>
            )
          })}
          {activeThread.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-tp-muted text-sm">No messages yet. Start the conversation.</p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-tp-border flex-shrink-0">
          <div className="flex gap-2 bg-tp-surface border border-tp-border rounded-xl p-1.5">
            <input
              className="flex-1 bg-transparent text-tp-white text-sm placeholder-tp-muted px-2 py-1.5 focus:outline-none"
              placeholder={`Message ${activeMember?.name?.split(' ')[0] ?? 'member'}…`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} disabled={!input.trim()}
              className={clsx('w-9 h-9 rounded-lg flex items-center justify-center transition-all flex-shrink-0',
                input.trim() ? 'bg-tp-red text-white hover:bg-tp-red-bright' : 'bg-tp-raised text-tp-muted cursor-not-allowed')}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
