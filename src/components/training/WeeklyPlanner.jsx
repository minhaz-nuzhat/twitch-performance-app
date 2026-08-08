import clsx from 'clsx'
import { Calendar, ChevronLeft, ChevronRight, Clock, Plus, X } from 'lucide-react'

/**
 * Weekly planner with 7-day calendar grid and drag/drop support
 */
export function WeeklyPlanner({
  weekLabel,
  weekSchedule,
  dragSession,
  selectedDayKey,
  workoutTemplates,
  onDragStartFromTemplate,
  onDragStartFromSlot,
  onDragOver,
  onDrop,
  onSelectDay,
  onToggleCompleted,
  onClearSlot,
  onPrevWeek,
  onNextWeek,
  onThisWeek,
}) {
  return (
    <div className="space-y-4">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <h3 className="text-tp-white font-semibold flex items-center gap-2">
          <Calendar size={16} className="text-tp-red" />
          {weekLabel}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevWeek}
            className="w-8 h-8 rounded-lg bg-tp-raised flex items-center justify-center text-tp-muted hover:text-tp-white transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={onThisWeek}
            className="px-3 h-8 rounded-lg bg-tp-raised text-tp-muted text-xs font-medium hover:text-tp-white transition-colors"
          >
            This Week
          </button>
          <button
            onClick={onNextWeek}
            className="w-8 h-8 rounded-lg bg-tp-raised flex items-center justify-center text-tp-muted hover:text-tp-white transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Workout Template Library (Draggable) */}
      <div>
        <p className="text-tp-muted text-xs font-medium mb-2">Available Workouts</p>
        <div className="flex flex-wrap gap-2">
          {workoutTemplates.map((w) => (
            <button
              key={w.id}
              draggable
              onDragStart={() =>
                onDragStartFromTemplate({
                  sourceDateKey: null,
                  sessionId: w.id,
                  sessionName: w.name,
                  duration: w.duration,
                })
              }
              className="px-3 py-1.5 bg-tp-red/10 border border-tp-red/30 rounded-lg text-tp-red text-xs font-medium hover:bg-tp-red/20 transition-colors cursor-grab active:cursor-grabbing"
            >
              + {w.name}
            </button>
          ))}
        </div>
      </div>

      {/* 7-Day Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekSchedule.map((slot) => (
          <div
            key={slot.dateKey}
            draggable={!!slot.sessionName}
            onDragStart={() =>
              slot.sessionName &&
              onDragStartFromSlot({
                sourceDateKey: slot.dateKey,
                sessionId: slot.sessionId,
                sessionName: slot.sessionName,
                duration: slot.duration,
              })
            }
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(slot.dateKey)}
            onClick={() => onSelectDay(slot.dateKey)}
            className={clsx(
              'min-h-24 p-2.5 rounded-xl border transition-all cursor-pointer group',
              slot.isToday && 'border-tp-red/40 bg-tp-red/5',
              slot.completed && 'border-tp-green/20 bg-tp-green/5',
              !slot.isToday && !slot.completed && 'card',
              selectedDayKey === slot.dateKey && 'ring-2 ring-tp-red',
              slot.sessionName && 'cursor-grab active:cursor-grabbing',
            )}
          >
            {/* Day label */}
            <p className={clsx(
              'text-[10px] font-bold uppercase tracking-wider',
              slot.isToday && 'text-tp-red',
              slot.completed && 'text-tp-green',
              !slot.isToday && !slot.completed && 'text-tp-muted',
            )}>
              {slot.isToday ? '● Today' : slot.day}
            </p>

            {/* Session content */}
            {slot.sessionName ? (
              <div className="mt-1.5 space-y-1">
                <p className="text-tp-white text-xs font-medium line-clamp-2">
                  {slot.sessionName}
                </p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-tp-muted text-[10px]">
                    <Clock size={9} />
                    {slot.duration} min
                  </span>
                  {slot.completed && (
                    <span className="text-tp-green text-[10px] font-medium">✓</span>
                  )}
                </div>

                {/* Toggle Complete + Clear Buttons */}
                <div className="flex gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleCompleted(slot.dateKey)
                    }}
                    className={clsx(
                      'flex-1 px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors',
                      slot.completed
                        ? 'bg-tp-green/20 text-tp-green'
                        : 'bg-tp-amber/20 text-tp-amber hover:bg-tp-amber/30',
                    )}
                  >
                    {slot.completed ? '✓ Done' : 'Mark Done'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onClearSlot(slot.dateKey)
                    }}
                    className="px-1 py-0.5 rounded bg-tp-danger/10 text-tp-danger hover:bg-tp-danger/20 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-tp-muted text-[10px] mt-1.5">Rest day</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
