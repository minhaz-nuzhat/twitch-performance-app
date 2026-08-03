import { useState, useEffect, useCallback } from 'react'
import {
  mockRoster, mockMemberScores, mockAssessmentTemplate,
  mockTrainerThreads, mockAnalytics, mockProgramLibrary,
  mockExerciseLibrary,
} from '../data/mockTrainerData'

function useMock(resolver, deps = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 250))
      setData(typeof resolver === 'function' ? resolver() : resolver)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { fetch() }, [fetch])
  return { data, loading, error, refetch: fetch }
}

// ── Roster ────────────────────────────────────────────────────
export function useRoster() {
  return useMock(() => mockRoster)
}

// ── Single member (by id) ─────────────────────────────────────
export function useMemberDetail(memberId) {
  return useMock(
    () => {
      const member = mockRoster.find(m => m.id === memberId)
      const scores = mockMemberScores[memberId] ?? null
      return member ? { ...member, scores } : null
    },
    [memberId],
  )
}

// ── Assessment template ───────────────────────────────────────
export function useAssessmentTemplate() {
  return useMock(() => mockAssessmentTemplate)
}

// ── Trainer messages ──────────────────────────────────────────
export function useTrainerMessages(memberId) {
  const [threads, setThreads] = useState(null)
  const hook = useMock(() => mockTrainerThreads, [])

  useEffect(() => {
    if (hook.data) setThreads({ ...hook.data })
  }, [hook.data])

  const sendMessage = useCallback((toMemberId, text) => {
    setThreads(prev => {
      const existing = prev?.[toMemberId] ?? []
      return {
        ...prev,
        [toMemberId]: [...existing, {
          id: `m${Date.now()}`, sender: 'trainer', text,
          time: new Date().toISOString(), read: true,
        }],
      }
    })
  }, [])

  const threadForMember = memberId ? threads?.[memberId] ?? [] : null

  return { ...hook, data: threads, threadForMember, sendMessage }
}

// ── Analytics ─────────────────────────────────────────────────
export function useTrainerAnalytics() {
  return useMock(() => ({
    ...mockAnalytics,
    adherenceByMember: mockRoster.map(m => ({ name: m.name.split(' ')[0], adherence: m.adherence })),
  }))
}

// ── Program library ───────────────────────────────────────────
export function useProgramLibrary() {
  const [library, setLibrary] = useState(null)
  const hook = useMock(() => mockProgramLibrary)

  useEffect(() => { if (hook.data) setLibrary([...hook.data]) }, [hook.data])

  const saveProgram = useCallback((program) => {
    setLibrary(prev => {
      const exists = prev?.find(p => p.id === program.id)
      if (exists) return prev.map(p => p.id === program.id ? program : p)
      return [...(prev ?? []), { ...program, id: `prog_${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) }]
    })
  }, [])

  return { ...hook, data: library, saveProgram }
}

// ── Exercise library ──────────────────────────────────────────
export function useExerciseLibrary() {
  return useMock(() => mockExerciseLibrary)
}
