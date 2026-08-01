import { useState, useEffect, useCallback } from 'react'
import {
  mockPerformanceScore,
  mockTrainingProgram,
  mockNutritionPlan,
  mockGoals,
  mockAchievements,
  mockAssessments,
  mockMessages,
  mockNotifications,
  mockSubscription,
} from '../data/mockData'

// ─────────────────────────────────────────────────────────────
// Generic hook factory — wraps mock data in loading/error state.
// When backend is live, swap `resolver` from mock to API call.
// ─────────────────────────────────────────────────────────────
function useMockFetch(resolver, deps = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Simulate ~300ms API latency so loading states are visible
      await new Promise((r) => setTimeout(r, 300))
      const result = typeof resolver === 'function' ? resolver() : resolver
      setData(result)
    } catch (err) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { fetch() }, [fetch])

  return { data, loading, error, refetch: fetch }
}

// ── Performance ───────────────────────────────────────────────
export function usePerformance() {
  // Backend: replace () => mockPerformanceScore with performanceApi.getScore
  return useMockFetch(() => mockPerformanceScore)
}

// ── Training ──────────────────────────────────────────────────
export function useTraining() {
  const hook = useMockFetch(() => mockTrainingProgram)

  // Optimistic session exercise toggle — backend: call trainingApi.completeSession
  const toggleExercise = useCallback((exerciseId) => {
    hook.data && hook.data.todaySession.exercises.forEach((ex) => {
      if (ex.id === exerciseId) ex.completed = !ex.completed
    })
    // Force re-render with spread copy
    // When backend is live this will be replaced by an API call + refetch
  }, [hook.data])

  return { ...hook, toggleExercise }
}

// ── Nutrition ─────────────────────────────────────────────────
export function useNutrition() {
  return useMockFetch(() => mockNutritionPlan)
}

// ── Goals & Achievements ──────────────────────────────────────
export function useGoals() {
  return useMockFetch(() => ({ goals: mockGoals, achievements: mockAchievements }))
}

// ── Assessments ───────────────────────────────────────────────
export function useAssessments() {
  return useMockFetch(() => mockAssessments)
}

// ── Messages ──────────────────────────────────────────────────
export function useMessages() {
  const hook     = useMockFetch(() => mockMessages)
  const [msgs, setMsgs] = useState(null)

  useEffect(() => {
    if (hook.data) setMsgs(hook.data)
  }, [hook.data])

  // Optimistic send — backend: replace with messagesApi.send(trainerId, text)
  const sendMessage = useCallback((text) => {
    const newMsg = {
      id: `m${Date.now()}`,
      sender: 'member',
      text,
      time: new Date().toISOString(),
      read: true,
    }
    setMsgs((prev) => [...(prev || []), newMsg])
  }, [])

  return { ...hook, data: msgs, sendMessage }
}

// ── Notifications ─────────────────────────────────────────────
export function useNotifications() {
  return useMockFetch(() => mockNotifications)
}

// ── Subscription ──────────────────────────────────────────────
export function useSubscription() {
  return useMockFetch(() => mockSubscription)
}
