import { useState, useMemo, useEffect } from 'react'

function generateWeekSlots(offset) {
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay() + offset * 7)

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + index)
    const dateKey = date.toISOString().split('T')[0]

    return {
      dateKey,
      day: `${date.toLocaleDateString('en-IN', { weekday: 'short' })} ${date.getDate()}`,
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

/**
 * Manages weekly schedule state for drag/drop planner
 * Handles: week navigation, day selection, drag state, and session assignment
 */
export function useWeeklySchedule(initialWeek = 0) {
  const [weekOffset, setWeekOffset] = useState(initialWeek)
  const [selectedDayKey, setSelectedDayKey] = useState('')
  const [dragSession, setDragSession] = useState(null)
  const [schedules, setSchedules] = useState(() => ({ [initialWeek]: generateWeekSlots(initialWeek) }))
  const weekSchedule = schedules[weekOffset] ?? []

  useEffect(() => {
    setSchedules((current) => current[weekOffset]
      ? current
      : { ...current, [weekOffset]: generateWeekSlots(weekOffset) })
    setSelectedDayKey('')
    setDragSession(null)
  }, [weekOffset])

  const setWeekSchedule = (updater) => {
    setSchedules((current) => ({
      ...current,
      [weekOffset]: typeof updater === 'function' ? updater(current[weekOffset] ?? []) : updater,
    }))
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
