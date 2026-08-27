import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'tp_session_state_v1'

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

/**
 * Tracks whether today's session has been started (gated behind the readiness
 * survey) and archives completed sessions with their logged exercise values.
 */
export function useSessionState(sessionId) {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const active = state[sessionId] ?? null

  const startSession = useCallback((readiness) => {
    setState(prev => ({
      ...prev,
      [sessionId]: { readiness, startedAt: new Date().toISOString(), finishedAt: null },
    }))
  }, [sessionId])

  const finishSession = useCallback((exercises) => {
    const loggedExercises = exercises
      .filter(ex => ex.completed || ex.setsLogged || ex.repsLogged || ex.weightLogged)
      .map(ex => ({
        name: ex.name,
        setsLogged: ex.setsLogged || ex.sets,
        repsLogged: ex.repsLogged || ex.reps,
        weightLogged: ex.weightLogged || ex.load,
      }))

    setState(prev => ({
      ...prev,
      [sessionId]: { ...prev[sessionId], finishedAt: new Date().toISOString(), loggedExercises },
    }))
  }, [sessionId])

  const resetSession = useCallback(() => {
    setState(prev => {
      const next = { ...prev }
      delete next[sessionId]
      return next
    })
  }, [sessionId])

  return {
    started: !!active,
    readiness: active?.readiness ?? null,
    finishedAt: active?.finishedAt ?? null,
    loggedExercises: active?.loggedExercises ?? [],
    startSession,
    finishSession,
    resetSession,
  }
}
