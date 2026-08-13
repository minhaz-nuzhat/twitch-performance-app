import { useState, useCallback } from 'react'

/**
 * Hook to manage agent interactions (coach training or member query mode)
 * Handles message sending, scenario retrieval, and conversation state
 */
export function useAgent(mode = 'member-query', entityId = null) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendMessage = useCallback(
    async (message, conversationHistory = []) => {
      setIsLoading(true)
      setError(null)

      try {
        const endpoint =
          mode === 'coach-train'
            ? '/api/agent/coach-train'
            : '/api/agent/member-query'

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            message,
            context: conversationHistory,
            [mode === 'coach-train' ? 'coachId' : 'memberId']: entityId
          })
        })

        if (!response.ok) {
          throw new Error(`Agent error: ${response.statusText}`)
        }

        const data = await response.json()

        return {
          response: data.response,
          scenarios: data.scenarios || [],
          confidence: data.confidenceScore || null,
          toolCalls: data.toolCalls || []
        }
      } catch (err) {
        setError(err.message)
        return {
          response: 'Sorry, I encountered an error. Please try again.',
          scenarios: [],
          confidence: null,
          toolCalls: []
        }
      } finally {
        setIsLoading(false)
      }
    },
    [mode, entityId]
  )

  const retrieveScenarios = useCallback(
    async (memberId, trainerId) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `/api/scenarios?member_id=${memberId}&trainer_id=${trainerId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )

        if (!response.ok) {
          throw new Error('Failed to retrieve scenarios')
        }

        const data = await response.json()
        return data.scenarios || []
      } catch (err) {
        setError(err.message)
        return []
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const applyScenario = useCallback(async (scenarioId, memberId) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/scenarios/${scenarioId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ memberId })
      })

      if (!response.ok) {
        throw new Error('Failed to apply scenario')
      }

      return await response.json()
    } catch (err) {
      setError(err.message)
      return { success: false }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    sendMessage,
    retrieveScenarios,
    applyScenario,
    isLoading,
    error,
    clearError: () => setError(null)
  }
}
