import { Link } from 'react-router-dom'
import { useProgramLibrary } from '../../hooks/useTrainerApi'
import { mockRoster } from '../../data/mockTrainerData'
import { Plus, Dumbbell, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

export default function Programs() {
  const { data: library, loading } = useProgramLibrary()

  if (loading) return <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}</div>

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-tp-white font-bold">Program Library</h2>
        <Link to="/trainer/programs/new" className="btn-primary flex items-center gap-1.5 px-4 py-2 text-sm">
          <Plus size={15} /> Build Program
        </Link>
      </div>

      {(!library || library.length === 0) && (
        <div className="card border-dashed py-16 text-center">
          <Dumbbell size={32} className="text-tp-border mx-auto mb-3" />
          <p className="text-tp-muted text-sm">No programs yet.</p>
          <Link to="/trainer/programs/new" className="text-tp-red text-sm hover:text-tp-red-bright mt-2 inline-block">Build your first program →</Link>
        </div>
      )}

      <div className="space-y-3">
        {library?.map(prog => {
          const assignedMembers = mockRoster.filter(m => prog.assignedTo?.includes(m.id))
          return (
            <div key={prog.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-tp-white font-semibold">{prog.name}</h3>
                  <p className="text-tp-muted text-xs mt-0.5">{prog.sport} · {prog.goal}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-tp-soft text-xs">{prog.phases?.length ?? 0} phases</span>
                    <span className="text-tp-soft text-xs">{prog.totalWeeks} weeks</span>
                    {prog.createdAt && <span className="text-tp-muted text-xs">Created {prog.createdAt}</span>}
                  </div>
                </div>
                <Link to={`/trainer/programs/new`} className="text-tp-red text-xs hover:text-tp-red-bright flex items-center gap-0.5 flex-shrink-0">
                  Edit <ChevronRight size={12} />
                </Link>
              </div>
              {assignedMembers.length > 0 && (
                <div className="mt-3 pt-3 border-t border-tp-border">
                  <p className="label mb-1.5">Assigned to</p>
                  <div className="flex gap-2 flex-wrap">
                    {assignedMembers.map(m => (
                      <Link key={m.id} to={`/trainer/roster/${m.id}`}
                        className="flex items-center gap-1.5 bg-tp-raised border border-tp-border hover:border-tp-red/30 text-tp-soft hover:text-tp-white text-xs px-2.5 py-1 rounded-full transition-all"
                      >
                        <span className="w-4 h-4 rounded-full bg-tp-border flex items-center justify-center text-[9px]">{m.avatarInitials[0]}</span>
                        {m.name.split(' ')[0]}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
