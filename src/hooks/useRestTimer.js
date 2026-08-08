import { useState, useEffect } from 'react'

/**
 * Flexible rest period parser
 * Accepts formats: "2 min", "30 sec", "2:30", "120" (seconds)
 */
function parseRestToSeconds(restText) {
  if (!restText) return 0
  const raw = String(restText).trim().toLowerCase()

  // Try minutes format: "2 min", "2.5 mins", etc.
  const minMatch = raw.match(/(\d+(?:\.\d+)?)\s*(min|mins|minute|minutes|m)\b/)
  if (minMatch) return Math.round(Number(minMatch[1]) * 60)

  // Try seconds format: "30 sec", "45s", etc.
  const secMatch = raw.match(/(\d+(?:\.\d+)?)\s*(sec|secs|second|seconds|s)\b/)
  if (secMatch) return Math.round(Number(secMatch[1]))

  // Try clock format: "2:30" (MM:SS)
  const clockMatch = raw.match(/^(\d{1,2}):(\d{2})$/)
  if (clockMatch) return Number(clockMatch[1]) * 60 + Number(clockMatch[2])

  // Try numeric seconds
  const numeric = Number(raw)
  return Number.isFinite(numeric) ? Math.round(numeric) : 0
}

function formatCountdown(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

/**
 * Manages rest period timer for individual exercises
 * Automatically starts/stops based on exercise context
 */
export function useRestTimer(exerciseId, restPeriod) {
  const [remainingSeconds, setRemainingSeconds] = useState(null)
  const [isActive, setIsActive] = useState(false)

  const totalSeconds = parseRestToSeconds(restPeriod)

  // Reset when exercise changes
  useEffect(() => {
    setRemainingSeconds(null)
    setIsActive(false)
  }, [exerciseId, restPeriod])

  // Timer interval
  useEffect(() => {
    if (!isActive || remainingSeconds == null) return
    if (remainingSeconds <= 0) {
      setIsActive(false)
      return
    }

    const timerId = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev == null) return prev
        return Math.max(0, prev - 1)
      })
    }, 1000)

    return () => clearInterval(timerId)
  }, [isActive, remainingSeconds])

  const toggleTimer = () => {
    if (remainingSeconds == null) {
      // Start fresh
      setRemainingSeconds(totalSeconds)
      setIsActive(true)
    } else if (isActive) {
      // Pause
      setIsActive(false)
    } else if (remainingSeconds === 0) {
      // Reset and start
      setRemainingSeconds(totalSeconds)
      setIsActive(true)
    } else {
      // Resume
      setIsActive(true)
    }
  }

  let displayText = ''
  if (remainingSeconds == null) {
    displayText = `${formatCountdown(totalSeconds)} · Click to start`
  } else if (remainingSeconds === 0) {
    displayText = 'Rest complete · Click to restart'
  } else if (isActive) {
    displayText = `${formatCountdown(remainingSeconds)} remaining`
  } else {
    displayText = `${formatCountdown(remainingSeconds)} paused`
  }

  return {
    remainingSeconds,
    isActive,
    totalSeconds,
    displayText,
    toggleTimer,
    formatCountdown,
  }
}
