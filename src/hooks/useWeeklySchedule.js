import { useState, useMemo } from 'react'

/**
 * Manages weekly schedule state for drag/drop planner
 * Handles: week navigation, day selection, drag state, and session assignment
 */
export function useWeeklySchedule(initialWeek = 0) {
  const [weekOffset, setWeekOffset] = useState(initialWeek)
  const [selectedDayKey, setSelectedDayKey] = useState('')
  const [dragSession, setDragSession] = useState(null)
  const [weekSchedule, setWeekSchedule] = useState([])

  // Generate 7 empty slots for the week
  const generateWeekSlots = (offset) => {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay() + offset * 7)

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart)
      date.setDate(date.getDate() + i)
      const dateKey = date.toISOString().split('T')[0]
      const day = date.toLocaleDateString('en-IN', { weekday: 'short' })
      const dayNum = date.getDate()

      return {
        dateKey,
        day: `${day} ${dayNum}`,
        date,
        isToday: dateKey === new Date().toISOString().split('T')[0],
        sessionId: null,
        sessionName: null,
        duration: null,
        completed: false,
        assignedBy: 'Coach Ravi',
      }
    })
  }

  // Initialize week schedule
  if (weekSchedule.length === 0) {
    setWeekSchedule(generateWeekSlots(weekOffset))
  }

  const weekLabel = useMemo(() => {
    if (weekOffset === 0) return 'This Week'
    if (weekOffset === 1) return 'Next Week'
    if (weekOffset === -1) return 'Last Week'
    return `Week ${weekOffset > 0 ? '+' : ''}${weekOffset}`
  }, [weekOffset])

  const handleDragStart = (source) => {
    setDragSession(source)
  }

  const handleDrop = (targetDateKey) => {
    if (!dragSession) return

    setWeekSchedule((prev) =>
      prev.map((slot) => {
        // Target slot: assign session
        if (slot.dateKey === targetDateKey) {
          return {
            ...slot,
            sessionId: dragSession.sessionId,
            sessionName: dragSession.sessionName,
            duration: dragSession.duration,
            completed: false,
          }
        }

        // Source slot: clear if not same as target (move, not copy)
        if (
          dragSession.sourceDateKey &&
          slot.dateKey === dragSession.sourceDateKey &&
          dragSession.sourceDateKey !== targetDateKey
        ) {
          return {
            ...slot,
            sessionId: null,
            sessionName: null,
            duration: null,
            completed: false,
          }
        }

        return slot
      }),
    )

    setSelectedDayKey(targetDateKey)
    setDragSession(null)
  }

  const toggleSlotCompleted = (dateKey) => {
    setWeekSchedule((prev) =>
      prev.map((slot) =>
        slot.dateKey === dateKey && slot.sessionName
          ? { ...slot, completed: !slot.completed }
          : slot,
      ),
    )
  }

  const clearSlot = (dateKey) => {
    setWeekSchedule((prev) =>
      prev.map((slot) =>
        slot.dateKey === dateKey
          ? {
              ...slot,
              sessionId: null,
              sessionName: null,
              duration: null,
              completed: false,
            }
          : slot,
      ),
    )
  }

  const goToThisWeek = () => {
    setWeekOffset(0)
    setWeekSchedule(generateWeekSlots(0))
  }

  return {
    weekOffset,
    setWeekOffset,
    weekLabel,
    weekSchedule,
    setWeekSchedule,
    selectedDayKey,
    setSelectedDayKey,
    dragSession,
    handleDragStart,
    handleDrop,
    setDragSession,
    toggleSlotCompleted,
    clearSlot,
    goToThisWeek,
  }
}
