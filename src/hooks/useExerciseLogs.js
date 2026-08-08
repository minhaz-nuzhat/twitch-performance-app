import { useState, useCallback } from 'react'

/**
 * Manages exercise completion and logging data
 * Handles: completion toggle, set/rep/weight logging per exercise
 */
export function useExerciseLogs(initialExercises = []) {
  const [exercises, setExercises] = useState(
    initialExercises.map((ex) => ({
      ...ex,
      completed: false,
      setsLogged: null,
      repsLogged: null,
      weightLogged: null,
    })),
  )

  const toggleExercise = useCallback((id) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === id ? { ...ex, completed: !ex.completed } : ex,
      ),
    )
  }, [])

  const updateExerciseLog = useCallback((id, updates) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === id ? { ...ex, ...updates } : ex,
      ),
    )
  }, [])

  const completionStats = {
    completed: exercises.filter((e) => e.completed).length,
    total: exercises.length,
    percentage: exercises.length > 0
      ? Math.round((exercises.filter((e) => e.completed).length / exercises.length) * 100)
      : 0,
  }

  return {
    exercises,
    setExercises,
    toggleExercise,
    updateExerciseLog,
    completionStats,
  }
}
