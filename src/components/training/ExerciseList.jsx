import { ExerciseRow } from './ExerciseRow'

/**
 * ExerciseList container component
 */
export function ExerciseList({ exercises, onToggle, onLogChange }) {
  return (
    <div className="space-y-2">
      {exercises.map((ex) => (
        <ExerciseRow
          key={ex.id}
          ex={ex}
          onToggle={onToggle}
          onLogChange={onLogChange}
        />
      ))}
    </div>
  )
}
