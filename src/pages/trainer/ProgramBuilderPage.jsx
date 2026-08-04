import { useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useProgramLibrary, useExerciseLibrary } from '../../hooks/useTrainerApi'
import { mockRoster } from '../../data/mockTrainerData'
import ProgramCalendar from '../../components/trainer/ProgramCalendar'
import {
  Plus, Trash2, ChevronDown, GripVertical,
  CheckCircle2, X, Search, BookOpen, Youtube,
  Upload, ExternalLink, Calendar, Layers,
} from 'lucide-react'
import clsx from 'clsx'

// ── Unique ID helper ──────────────────────────────────────────
let _uid = 0
const uid = () => `id_${++_uid}_${Date.now()}`

const DAYS  = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const SPORTS = ['Cricket', 'Badminton', 'Football', 'Swimming', 'Athletics', 'Basketball', 'Tennis', 'Generic']

// ── YouTube helpers ───────────────────────────────────────────
function getYouTubeId(url = '') {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return m?.[1] ?? null
}
function isYouTubeUrl(url = '') { return !!getYouTubeId(url) }

// ── Exercise row inside a session ────────────────────────────
function ExerciseRow({ ex, onUpdate, onRemove }) {
  const ytId        = getYouTubeId(ex.videoUrl ?? '')
  const thumbUrl    = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null

  return (
    <div className="flex items-start gap-2 p-3 rounded-xl bg-tp-black border border-tp-border group">
      <GripVertical size={14} className="text-tp-border mt-2 flex-shrink-0 cursor-grab" />
      <div className="flex-1 min-w-0 space-y-2">
        <input
          className="w-full bg-transparent text-tp-white text-sm font-medium placeholder-tp-muted focus:outline-none border-b border-tp-border focus:border-tp-red pb-1 transition-colors"
          placeholder="Exercise name…"
          value={ex.name}
          onChange={e => onUpdate('name', e.target.value)}
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { key: 'sets',  label: 'Sets',  placeholder: '4'      },
            { key: 'reps',  label: 'Reps',  placeholder: '5'      },
            { key: 'load',  label: 'Load',  placeholder: '100 kg' },
            { key: 'rest',  label: 'Rest',  placeholder: '3 min'  },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <p className="label mb-0.5">{label}</p>
              <input
                className="w-full bg-tp-raised border border-tp-border text-tp-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-tp-red/50 transition-colors"
                placeholder={placeholder}
                value={ex[key]}
                onChange={e => onUpdate(key, e.target.value)}
              />
            </div>
          ))}
        </div>
        <input
          className="w-full bg-transparent text-tp-muted text-xs placeholder-tp-border focus:outline-none border-b border-transparent focus:border-tp-border pb-0.5 transition-colors"
          placeholder="Notes (optional)…"
          value={ex.notes}
          onChange={e => onUpdate('notes', e.target.value)}
        />

        {/* ── Video URL field ── */}
        <div className="flex items-center gap-2 pt-1">
          <Youtube size={12} className={clsx('flex-shrink-0', ex.videoUrl ? 'text-tp-red' : 'text-tp-border')} />
          <input
            className="flex-1 bg-transparent text-tp-muted text-xs placeholder-tp-border focus:outline-none focus:text-tp-soft transition-colors"
            placeholder="YouTube URL or video link…"
            value={ex.videoUrl ?? ''}
            onChange={e => onUpdate('videoUrl', e.target.value)}
          />
          {/* File upload placeholder */}
          <label
            className="flex items-center gap-1 text-[10px] text-tp-muted border border-tp-border rounded px-1.5 py-0.5 cursor-pointer hover:border-tp-border-bright transition-all"
            title="Video file upload requires backend storage"
          >
            <Upload size={10} />
            <span>Upload</span>
            <input type="file" accept="video/*,image/*" className="hidden" onChange={() => {}} disabled />
          </label>
        </div>

        {/* YouTube thumbnail preview */}
        {thumbUrl && (
          <a href={ex.videoUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 mt-1 p-1.5 rounded-lg bg-tp-raised border border-tp-border hover:border-tp-red/40 transition-all group/yt"
          >
            <img src={thumbUrl} alt="Video preview" className="w-16 h-10 object-cover rounded" />
            <div className="flex-1 min-w-0">
              <p className="text-tp-white text-xs font-medium truncate">{ex.name || 'Watch video'}</p>
              <p className="text-tp-muted text-[10px] flex items-center gap-1 group-hover/yt:text-tp-red transition-colors">
                <ExternalLink size={9} /> Open on YouTube
              </p>
            </div>
          </a>
        )}
      </div>
      <button onClick={onRemove} className="text-tp-border hover:text-tp-danger transition-colors flex-shrink-0 mt-1 p-1 rounded">
        <Trash2 size={13} />
      </button>
    </div>
  )
}

// ── Exercise library modal ────────────────────────────────────
function ExerciseLibraryModal({ exercises, onAdd, onClose }) {
  const [search, setSearch]   = useState('')
  const [catFilter, setCatFilter] = useState('All')

  const categories = ['All', ...new Set(exercises.map(e => e.category))]
  const filtered = exercises.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase())
    const matchCat    = catFilter === 'All' || e.category === catFilter
    return matchSearch && matchCat
  })

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-tp-card border border-tp-border rounded-2xl max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-tp-border">
          <h3 className="text-tp-white font-semibold flex items-center gap-2"><BookOpen size={16} className="text-tp-red" />Exercise Library</h3>
          <button onClick={onClose} className="text-tp-muted hover:text-tp-white p-1"><X size={18} /></button>
        </div>
        {/* Search */}
        <div className="p-3 border-b border-tp-border space-y-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tp-muted" />
            <input className="input pl-8 py-2 text-sm" placeholder="Search exercises…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {categories.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={clsx('px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap border transition-all',
                  catFilter === c ? 'bg-tp-red/10 text-tp-red border-tp-red/25' : 'bg-tp-raised text-tp-muted border-tp-border')}
              >{c}</button>
            ))}
          </div>
        </div>
        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filtered.map(ex => (
            <button key={ex.id} onClick={() => { onAdd(ex); onClose() }}
              className="w-full text-left card px-3 py-2.5 hover:border-tp-red/30 hover:bg-tp-red/3 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-tp-white text-sm font-medium group-hover:text-tp-red transition-colors">{ex.name}</p>
                    {ex.videoUrl && (
                      <span className="flex items-center gap-0.5 bg-tp-red/10 border border-tp-red/20 text-tp-red text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                        <Youtube size={8} /> Video
                      </span>
                    )}
                  </div>
                  <p className="text-tp-muted text-xs">{ex.category} · {ex.type} · {ex.defaultSets}×{ex.defaultReps} · {ex.defaultLoad}</p>
                </div>
                <Plus size={14} className="text-tp-muted group-hover:text-tp-red transition-colors flex-shrink-0 ml-2" />
              </div>
            </button>
          ))}
          {filtered.length === 0 && <p className="text-tp-muted text-xs text-center py-6">No exercises match.</p>}
        </div>
      </div>
    </div>
  )
}

// ── Session detail panel ──────────────────────────────────────
function SessionPanel({ session, phaseId, exercises, onUpdateExercise, onRemoveExercise, onAddExercise, onAddFromLibrary, onUpdateSession }) {
  return (
    <div className="space-y-3">
      {/* Session name */}
      <input
        className="input font-semibold"
        placeholder="Session name (e.g. Lower Body Power)…"
        value={session.name}
        onChange={e => onUpdateSession('name', e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label block mb-1">Week</label>
          <input type="number" min="1" className="input text-sm" value={session.week}
            onChange={e => onUpdateSession('week', parseInt(e.target.value) || 1)} />
        </div>
        <div>
          <label className="label block mb-1">Day</label>
          <select className="input text-sm" value={session.day} onChange={e => onUpdateSession('day', e.target.value)}>
            {DAYS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>
      {/* Warm-up / cooldown */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label block mb-1">Warm-up</label>
          <input className="input text-xs" placeholder="10 min activation…" value={session.warmup ?? ''}
            onChange={e => onUpdateSession('warmup', e.target.value)} />
        </div>
        <div>
          <label className="label block mb-1">Cool-down</label>
          <input className="input text-xs" placeholder="10 min stretch…" value={session.cooldown ?? ''}
            onChange={e => onUpdateSession('cooldown', e.target.value)} />
        </div>
      </div>

      {/* Exercises */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="label">Exercises ({session.exercises.length})</p>
          <div className="flex gap-2">
            <button type="button" onClick={onAddFromLibrary}
              className="flex items-center gap-1 text-xs text-tp-soft hover:text-tp-white border border-tp-border hover:border-tp-red/30 px-2 py-1 rounded-lg transition-all">
              <BookOpen size={12} /> Library
            </button>
            <button type="button" onClick={onAddExercise}
              className="flex items-center gap-1 text-xs bg-tp-red/10 text-tp-red border border-tp-red/20 hover:bg-tp-red/20 px-2 py-1 rounded-lg transition-all">
              <Plus size={12} /> Custom
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {session.exercises.map((ex, i) => (
            <ExerciseRow
              key={ex.id}
              ex={ex}
              onUpdate={(field, val) => onUpdateExercise(ex.id, field, val)}
              onRemove={() => onRemoveExercise(ex.id)}
            />
          ))}
          {session.exercises.length === 0 && (
            <div className="border border-dashed border-tp-border rounded-xl py-6 text-center">
              <p className="text-tp-muted text-xs">Add exercises from the library or create custom ones</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function ProgramBuilderPage() {
  const navigate        = useNavigate()
  const [params]        = useSearchParams()
  const { saveProgram } = useProgramLibrary()
  const { data: exLib } = useExerciseLibrary()

  const [program, setProgram] = useState({
    id: `prog_${Date.now()}`,
    name: '',
    sport: '',
    goal: '',
    description: '',
    phases: [],
    assignedTo: params.get('member') ? [params.get('member')] : [],
  })

  const [selectedPhaseId,   setSelectedPhaseId]   = useState(null)
  const [selectedSessionId, setSelectedSessionId] = useState(null)
  const [showLibrary,       setShowLibrary]        = useState(false)
  const [saved,             setSaved]             = useState(false)
  const [expandedPhases,    setExpandedPhases]    = useState({})
  const [viewMode,          setViewMode]          = useState('build') // 'build' | 'calendar'

  // ── Program helpers ───────────────────────────────────────
  const updateProgram = (field, val) => setProgram(p => ({ ...p, [field]: val }))

  const addPhase = () => {
    const newPhase = { id: uid(), name: `Phase ${program.phases.length + 1} — `, sessions: [] }
    setProgram(p => ({ ...p, phases: [...p.phases, newPhase] }))
    setSelectedPhaseId(newPhase.id)
    setExpandedPhases(e => ({ ...e, [newPhase.id]: true }))
  }

  const updatePhase = (phaseId, field, val) => {
    setProgram(p => ({ ...p, phases: p.phases.map(ph => ph.id === phaseId ? { ...ph, [field]: val } : ph) }))
  }

  const removePhase = (phaseId) => {
    setProgram(p => ({ ...p, phases: p.phases.filter(ph => ph.id !== phaseId) }))
    if (selectedPhaseId === phaseId) { setSelectedPhaseId(null); setSelectedSessionId(null) }
  }

  const addSession = (phaseId) => {
    const phase      = program.phases.find(ph => ph.id === phaseId)
    const maxWeek    = Math.max(0, ...(phase?.sessions.map(s => s.week) ?? []))
    const newSession = {
      id: uid(), name: '', week: maxWeek + 1, day: 'Monday',
      warmup: '', cooldown: '', exercises: [],
    }
    setProgram(p => ({
      ...p,
      phases: p.phases.map(ph =>
        ph.id === phaseId ? { ...ph, sessions: [...ph.sessions, newSession] } : ph,
      ),
    }))
    setSelectedPhaseId(phaseId)
    setSelectedSessionId(newSession.id)
  }

  const removeSession = (phaseId, sessionId) => {
    setProgram(p => ({
      ...p,
      phases: p.phases.map(ph =>
        ph.id === phaseId ? { ...ph, sessions: ph.sessions.filter(s => s.id !== sessionId) } : ph,
      ),
    }))
    if (selectedSessionId === sessionId) setSelectedSessionId(null)
  }

  const updateSession = (phaseId, sessionId, field, val) => {
    setProgram(p => ({
      ...p,
      phases: p.phases.map(ph =>
        ph.id === phaseId
          ? { ...ph, sessions: ph.sessions.map(s => s.id === sessionId ? { ...s, [field]: val } : s) }
          : ph,
      ),
    }))
  }

  const addExerciseToSession = (phaseId, sessionId, preset = null) => {
    const newEx = {
      id: uid(),
      name:  preset?.name  ?? '',
      sets:  String(preset?.defaultSets  ?? 3),
      reps:  preset?.defaultReps  ?? '8',
      load:  preset?.defaultLoad  ?? '',
      rest:  preset?.defaultRest  ?? '2 min',
      notes: '',
    }
    setProgram(p => ({
      ...p,
      phases: p.phases.map(ph =>
        ph.id === phaseId
          ? { ...ph, sessions: ph.sessions.map(s => s.id === sessionId ? { ...s, exercises: [...s.exercises, newEx] } : s) }
          : ph,
      ),
    }))
  }

  const updateExercise = (phaseId, sessionId, exId, field, val) => {
    setProgram(p => ({
      ...p,
      phases: p.phases.map(ph =>
        ph.id === phaseId
          ? { ...ph, sessions: ph.sessions.map(s =>
              s.id === sessionId
                ? { ...s, exercises: s.exercises.map(ex => ex.id === exId ? { ...ex, [field]: val } : ex) }
                : s,
            )}
          : ph,
      ),
    }))
  }

  const removeExercise = (phaseId, sessionId, exId) => {
    setProgram(p => ({
      ...p,
      phases: p.phases.map(ph =>
        ph.id === phaseId
          ? { ...ph, sessions: ph.sessions.map(s =>
              s.id === sessionId
                ? { ...s, exercises: s.exercises.filter(ex => ex.id !== exId) }
                : s,
            )}
          : ph,
      ),
    }))
  }

  // ── Active session lookup ──────────────────────────────────
  const activePhase   = program.phases.find(ph => ph.id === selectedPhaseId)
  const activeSession = activePhase?.sessions.find(s => s.id === selectedSessionId)

  const totalSessions  = program.phases.reduce((a, ph) => a + ph.sessions.length, 0)
  const totalExercises = program.phases.reduce((a, ph) => a + ph.sessions.reduce((b, s) => b + s.exercises.length, 0), 0)

  const handleSave = () => {
    if (!program.name) return
    const saved = {
      ...program,
      totalWeeks: Math.max(0, ...program.phases.flatMap(ph => ph.sessions.map(s => s.week))),
    }
    saveProgram(saved)
    setSaved(true)
  }

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-tp-green/15 border border-tp-green/30 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-tp-green" />
        </div>
        <h2 className="text-tp-white font-bold text-xl">Program Saved</h2>
        <p className="text-tp-soft text-sm">"{program.name}" added to your library.</p>
        <div className="flex gap-3">
          <button onClick={() => navigate('/trainer/programs')} className="btn-ghost">Back to Programs</button>
          <button onClick={() => { setSaved(false); setProgram({ id: `prog_${Date.now()}`, name: '', sport: '', goal: '', description: '', phases: [], assignedTo: [] }) }} className="btn-primary">Build Another</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── Program metadata ── */}
      <div className="card p-5">
        <h2 className="text-tp-white font-bold mb-4">Program Details</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="label block mb-1.5">Program Name *</label>
            <input className="input" placeholder="e.g. Cricket Pre-Season Block" value={program.name} onChange={e => updateProgram('name', e.target.value)} required />
          </div>
          <div>
            <label className="label block mb-1.5">Sport</label>
            <select className="input" value={program.sport} onChange={e => updateProgram('sport', e.target.value)}>
              <option value="">— Select sport —</option>
              {SPORTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label block mb-1.5">Primary Goal</label>
            <input className="input" placeholder="e.g. Power & Speed" value={program.goal} onChange={e => updateProgram('goal', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label block mb-1.5">Assign to Member (optional)</label>
            <select className="input" value={program.assignedTo[0] ?? ''} onChange={e => updateProgram('assignedTo', e.target.value ? [e.target.value] : [])}>
              <option value="">— Save to library only —</option>
              {mockRoster.map(m => <option key={m.id} value={m.id}>{m.name} ({m.sport})</option>)}
            </select>
          </div>
        </div>
        {/* Summary */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-tp-border">
          <div><span className="font-mono font-bold text-tp-white">{program.phases.length}</span> <span className="text-tp-muted text-xs">phases</span></div>
          <div><span className="font-mono font-bold text-tp-white">{totalSessions}</span> <span className="text-tp-muted text-xs">sessions</span></div>
          <div><span className="font-mono font-bold text-tp-white">{totalExercises}</span> <span className="text-tp-muted text-xs">exercises</span></div>
        </div>
      </div>

      {/* ── View mode toggle ── */}
      <div className="flex gap-1 bg-tp-surface p-1 rounded-xl border border-tp-border">
        <button onClick={() => setViewMode('build')}
          className={clsx('flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all',
            viewMode === 'build' ? 'bg-tp-red text-white' : 'text-tp-muted hover:text-tp-white')}
        >
          <Layers size={14} /> Build
        </button>
        <button onClick={() => setViewMode('calendar')}
          className={clsx('flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all',
            viewMode === 'calendar' ? 'bg-tp-red text-white' : 'text-tp-muted hover:text-tp-white')}
        >
          <Calendar size={14} /> Timeline
        </button>
      </div>

      {/* ── Calendar / Timeline view ── */}
      {viewMode === 'calendar' && (
        <div className="card p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-tp-white font-semibold">Program Timeline</h3>
            <span className="text-tp-muted text-xs">Click any session block to jump to its editor</span>
          </div>
          <ProgramCalendar
            phases={program.phases}
            onSelectSession={(phaseId, sessionId) => {
              setSelectedPhaseId(phaseId)
              setSelectedSessionId(sessionId)
              setExpandedPhases(e => ({ ...e, [phaseId]: true }))
              setViewMode('build')
            }}
          />
        </div>
      )}

      {/* ── Builder: two-column on desktop ── */}
      {viewMode === 'build' && <div className="grid lg:grid-cols-5 gap-4">
        {/* Left: Phase / Session tree */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-tp-white font-semibold text-sm">Structure</h3>
            <button onClick={addPhase} className="flex items-center gap-1 text-xs bg-tp-red/10 text-tp-red border border-tp-red/20 hover:bg-tp-red/20 px-2.5 py-1.5 rounded-lg transition-all">
              <Plus size={12} /> Add Phase
            </button>
          </div>

          {program.phases.length === 0 && (
            <div className="border border-dashed border-tp-border rounded-xl py-8 text-center">
              <p className="text-tp-muted text-xs">Click "Add Phase" to start building</p>
            </div>
          )}

          {program.phases.map((phase) => (
            <div key={phase.id} className={clsx('card overflow-hidden transition-all', selectedPhaseId === phase.id && 'border-tp-red/30')}>
              {/* Phase header */}
              <div className="flex items-center gap-2 px-3 py-2.5">
                <button
                  onClick={() => setExpandedPhases(e => ({ ...e, [phase.id]: !e[phase.id] }))}
                  className="text-tp-muted hover:text-tp-white transition-colors"
                >
                  <ChevronDown size={14} className={clsx('transition-transform', expandedPhases[phase.id] && 'rotate-180')} />
                </button>
                <input
                  className="flex-1 bg-transparent text-tp-white text-sm font-semibold placeholder-tp-muted focus:outline-none min-w-0"
                  placeholder="Phase name…"
                  value={phase.name}
                  onClick={() => setSelectedPhaseId(phase.id)}
                  onChange={e => updatePhase(phase.id, 'name', e.target.value)}
                />
                <span className="text-tp-muted text-[10px]">{phase.sessions.length}s</span>
                <button onClick={() => removePhase(phase.id)} className="text-tp-border hover:text-tp-danger transition-colors p-0.5">
                  <Trash2 size={12} />
                </button>
              </div>

              {/* Sessions */}
              {expandedPhases[phase.id] && (
                <div className="border-t border-tp-border">
                  {phase.sessions.map(session => (
                    <button
                      key={session.id}
                      onClick={() => { setSelectedPhaseId(phase.id); setSelectedSessionId(session.id) }}
                      className={clsx(
                        'w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-tp-raised transition-all',
                        selectedSessionId === session.id && 'bg-tp-red/5 border-l-2 border-tp-red',
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-tp-white text-xs font-medium truncate">{session.name || 'Unnamed session'}</p>
                        <p className="text-tp-muted text-[10px]">Wk {session.week} · {session.day} · {session.exercises.length} exercises</p>
                      </div>
                      <button onClick={e => { e.stopPropagation(); removeSession(phase.id, session.id) }} className="text-tp-border hover:text-tp-danger transition-colors p-0.5 flex-shrink-0">
                        <X size={11} />
                      </button>
                    </button>
                  ))}
                  <button
                    onClick={() => addSession(phase.id)}
                    className="w-full flex items-center gap-1.5 px-4 py-2 text-tp-muted hover:text-tp-red hover:bg-tp-red/5 transition-all text-xs border-t border-tp-border"
                  >
                    <Plus size={11} /> Add session
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right: Session editor */}
        <div className="lg:col-span-3">
          {activeSession ? (
            <div className="card p-5">
              <h3 className="text-tp-white font-semibold text-sm mb-4">
                Edit Session — <span className="text-tp-soft font-normal">{activePhase?.name}</span>
              </h3>
              <SessionPanel
                session={activeSession}
                phaseId={selectedPhaseId}
                exercises={exLib ?? []}
                onUpdateSession={(f, v) => updateSession(selectedPhaseId, selectedSessionId, f, v)}
                onAddExercise={() => addExerciseToSession(selectedPhaseId, selectedSessionId)}
                onAddFromLibrary={() => setShowLibrary(true)}
                onUpdateExercise={(exId, f, v) => updateExercise(selectedPhaseId, selectedSessionId, exId, f, v)}
                onRemoveExercise={(exId) => removeExercise(selectedPhaseId, selectedSessionId, exId)}
              />
            </div>
          ) : (
            <div className="card border-dashed h-64 flex items-center justify-center">
              <div className="text-center">
                <Calendar size={24} className="text-tp-border mx-auto mb-2" />
                <p className="text-tp-muted text-sm">Select a session to edit</p>
                <p className="text-tp-muted text-xs mt-1">or switch to Timeline to see the full schedule</p>
              </div>
            </div>
          )}
        </div>
      </div>}

      {/* ── Save bar ── */}
      <div className="flex gap-3 pb-4 sticky bottom-0 bg-tp-black py-3">
        <button onClick={() => navigate('/trainer/programs')} className="btn-ghost">Cancel</button>
        <button
          onClick={handleSave}
          disabled={!program.name || program.phases.length === 0}
          className="btn-primary flex-1 disabled:opacity-40"
        >
          {program.assignedTo.length > 0 ? 'Save & Assign to Member' : 'Save to Program Library'}
        </button>
      </div>

      {/* ── Exercise library modal ── */}
      {showLibrary && exLib && (
        <ExerciseLibraryModal
          exercises={exLib}
          onAdd={(ex) => addExerciseToSession(selectedPhaseId, selectedSessionId, ex)}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  )
}
