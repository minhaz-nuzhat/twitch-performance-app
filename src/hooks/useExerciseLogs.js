import { useState, useCallback, useEffect } from 'react'

/**
 * Manages exercise completion and logging data
 * Handles: completion toggle, set/rep/weight logging per exercise
 */
export function useExerciseLogs(initialExercises = []) {
  const [exercises, setExercises] = useState([])

  // Transform exercises with defaults
  const transformExercises = (exs) => {
    if (!exs || !Array.isArray(exs)) return []
    return exs.map((ex) => ({
      ...ex,
      completed: ex.completed ?? false,
      setsLogged: ex.setsLogged ?? null,
      repsLogged: ex.repsLogged ?? null,
      weightLogged: ex.weightLogged ?? null,
    }))
  }

  // Update state whenever initialExercises changes
  useEffect(() => {
    const transformed = transformExercises(initialExercises)
    setExercises(transformed)
  }, [initialExercises])

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
