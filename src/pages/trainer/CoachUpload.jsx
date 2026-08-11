import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle2, AlertCircle, X, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

// ── Device types the pipeline supports ───────────────────────
const DEVICE_TYPES = [
  { id: 'vald',     label: 'Vald ForceDecks / NordBord', description: 'Force plate, asymmetry, jump metrics' },
  { id: 'hawkin',   label: 'Hawkin Dynamics',             description: 'Force plate, CMJ, RSI exports'       },
  { id: 'inbody',   label: 'InBody (570 / 770)',          description: 'Body composition, lean mass, BF%'    },
  { id: 'microgate',label: 'Microgate / Brower Timing',   description: 'Sprint splits, 10m, 40m gates'       },
  { id: 'generic',  label: 'Generic CSV',                 description: 'Any custom assessment export'        },
]

// ── Mock member roster ────────────────────────────────────────
const MEMBERS = [
  { id: 'mem_001', name: 'Arjun Sharma',  sport: 'Cricket'    },
  { id: 'mem_002', name: 'Lavanya C',     sport: 'Cricket'    },
  { id: 'mem_003', name: 'Rohan Mehta',   sport: 'Football'   },
  { id: 'mem_004', name: 'Priya Venkat',  sport: 'Athletics'  },
  { id: 'mem_005', name: 'Karan Bose',    sport: 'Basketball' },
]

// ── Mock upload history ───────────────────────────────────────
const INITIAL_HISTORY = [
  { id: 1, member: 'Lavanya C',    device: 'Vald ForceDecks',      file: 'lavanya_imtp_mar26.csv',  uploadedAt: '28 Mar 2026 · 14:22', status: 'processed' },
  { id: 2, member: 'Arjun Sharma', device: 'InBody 770',           file: 'arjun_inbody_feb26.csv',  uploadedAt: '15 Feb 2026 · 11:05', status: 'processed' },
  { id: 3, member: 'Rohan Mehta',  device: 'Hawkin Dynamics',      file: 'rohan_cmj_jan26.csv',     uploadedAt: '20 Jan 2026 · 09:30', status: 'processed' },
]

// Pipeline steps description
const PIPELINE_STEPS = [
  'CSV received and uploaded to secure ingest container',
  'Parser auto-detects device format and field layout',
  'Fields normalised to internal schema, units standardised',
  'Assessment scores recalculated and pushed to member dashboard',
]

export default function CoachUpload() {
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [selectedMember, setSelectedMember] = useState('')
  const [file, setFile]                     = useState(null)
  const [dragOver, setDragOver]             = useState(false)
  const [uploadState, setUploadState]       = useState('idle') // idle|uploading|processing|done|error
  const [history, setHistory]               = useState(INITIAL_HISTORY)
  const inputRef = useRef(null)

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) setFile(f)
  }

  function handleFileSelect(e) {
    const f = e.target.files?.[0]
    if (f) setFile(f)
    e.target.value = ''
  }

  function handleUpload() {
    if (!selectedDevice || !selectedMember || !file) return
    setUploadState('uploading')

    // Simulate pipeline: uploading → processing → done
    setTimeout(() => setUploadState('processing'), 1400)
    setTimeout(() => {
      setUploadState('done')
      const deviceLabel = DEVICE_TYPES.find(d => d.id === selectedDevice)?.label ?? selectedDevice
      const memberName  = MEMBERS.find(m => m.id === selectedMember)?.name ?? selectedMember
      const now = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      setHistory(prev => [
        { id: Date.now(), member: memberName, device: deviceLabel, file: file.name, uploadedAt: now, status: 'processed' },
        ...prev,
      ])
    }, 3000)
  }

  function reset() {
    setFile(null)
    setSelectedDevice(null)
    setSelectedMember('')
    setUploadState('idle')
  }

  const canUpload = selectedDevice && selectedMember && file && uploadState === 'idle'

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Page header ── */}
      <div>
        <h2 className="text-tp-white font-bold text-lg">Upload Assessment Data</h2>
        <p className="text-tp-muted text-sm mt-0.5 leading-relaxed">
          Upload CSV exports from forceplates and assessment devices. Data is automatically
          parsed, normalised, and assigned to the selected member — no manual entry required.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">

        {/* ── Left: Upload form ── */}
        <div className="space-y-4">

          {/* Step 1: Device type */}
          <div className="card p-4">
            <p className="label mb-3">1. Select device type</p>
            <div className="space-y-2">
              {DEVICE_TYPES.map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDevice(d.id)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all',
                    selectedDevice === d.id
                      ? 'bg-tp-red/10 border-tp-red/40'
                      : 'bg-tp-raised border-tp-border hover:border-tp-border-bright',
                  )}
                >
                  <FileText size={14} className={clsx('flex-shrink-0', selectedDevice === d.id ? 'text-tp-red' : 'text-tp-muted')} />
                  <div className="flex-1 min-w-0">
                    <p className={clsx('text-xs font-semibold', selectedDevice === d.id ? 'text-tp-red' : 'text-tp-white')}>{d.label}</p>
                    <p className="text-[10px] text-tp-muted">{d.description}</p>
                  </div>
                  {selectedDevice === d.id && <CheckCircle2 size={14} className="text-tp-red flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Member */}
          <div className="card p-4">
            <p className="label mb-3">2. Assign to member</p>
            <div className="relative">
              <select
                value={selectedMember}
                onChange={e => setSelectedMember(e.target.value)}
                className="w-full appearance-none bg-tp-raised border border-tp-border text-tp-white text-sm rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:border-tp-red/50 transition-colors"
              >
                <option value="" className="bg-tp-card text-tp-muted">Select a member...</option>
                {MEMBERS.map(m => (
                  <option key={m.id} value={m.id} className="bg-tp-card">
                    {m.name} — {m.sport}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-tp-muted pointer-events-none" />
            </div>
          </div>

          {/* Step 3: File drop */}
          <div className="card p-4">
            <p className="label mb-3">3. Upload CSV file</p>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !file && inputRef.current?.click()}
              className={clsx(
                'border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 transition-all',
                file
                  ? 'border-tp-green/40 bg-tp-green/5 cursor-default'
                  : dragOver
                    ? 'border-tp-red/60 bg-tp-red/5 cursor-copy'
                    : 'border-tp-border hover:border-tp-border-bright hover:bg-tp-raised/30 cursor-pointer',
              )}
            >
              {file ? (
                <>
                  <FileText size={24} className="text-tp-green" />
                  <p className="text-tp-white text-xs font-medium text-center break-all">{file.name}</p>
                  <p className="text-tp-muted text-[10px]">{(file.size / 1024).toFixed(1)} KB</p>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setFile(null) }}
                    className="flex items-center gap-1 text-tp-danger text-[10px] mt-1 hover:underline"
                  >
                    <X size={10} /> Remove
                  </button>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-tp-muted" />
                  <p className="text-tp-soft text-xs text-center">Drag & drop your CSV here</p>
                  <p className="text-tp-muted text-[10px]">or click to browse</p>
                </>
              )}
              <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
            </div>
          </div>

          {/* Upload button + status */}
          {uploadState === 'idle' && (
            <button
              onClick={handleUpload}
              disabled={!canUpload}
              className={clsx(
                'w-full py-3 rounded-xl text-sm font-bold transition-all',
                canUpload
                  ? 'bg-tp-red text-white hover:bg-tp-red/90'
                  : 'bg-tp-raised border border-tp-border text-tp-muted cursor-not-allowed',
              )}
            >
              Upload & Process
            </button>
          )}

          {(uploadState === 'uploading' || uploadState === 'processing') && (
            <div className="card p-4 border-tp-amber/30 bg-tp-amber/5">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-tp-amber border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <div>
                  <p className="text-tp-amber text-sm font-semibold">
                    {uploadState === 'uploading' ? 'Uploading...' : 'Processing...'}
                  </p>
                  <p className="text-tp-muted text-xs">
                    {uploadState === 'uploading'
                      ? 'Sending file to ingest pipeline'
                      : 'Parsing fields, normalising units, recalculating scores'}
                  </p>
                </div>
              </div>
              {/* Progress dots */}
              <div className="flex gap-1.5 mt-3 ml-7">
                {PIPELINE_STEPS.map((step, i) => (
                  <div key={i} className={clsx(
                    'h-1.5 flex-1 rounded-full transition-all',
                    (uploadState === 'uploading' && i === 0) || (uploadState === 'processing' && i <= 2)
                      ? 'bg-tp-amber'
                      : 'bg-tp-border',
                  )} />
                ))}
              </div>
            </div>
          )}

          {uploadState === 'done' && (
            <div className="card p-4 border-tp-green/30 bg-tp-green/5">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-tp-green flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-tp-green text-sm font-semibold">Upload complete</p>
                  <p className="text-tp-muted text-xs mt-0.5">
                    Data parsed and assigned. Member's assessment and score have been updated.
                  </p>
                  <button onClick={reset} className="text-tp-red text-xs mt-2 hover:underline">
                    Upload another file
                  </button>
                </div>
              </div>
            </div>
          )}

          {uploadState === 'error' && (
            <div className="card p-4 border-tp-danger/30 bg-tp-danger/5">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-tp-danger flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-tp-danger text-sm font-semibold">Upload failed</p>
                  <p className="text-tp-muted text-xs">Check file format matches the selected device type and try again.</p>
                  <button onClick={reset} className="text-tp-red text-xs mt-2 hover:underline">Try again</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: History + pipeline info ── */}
        <div className="space-y-4">

          <div className="card p-4">
            <p className="label mb-3">Recent uploads</p>
            {history.length === 0 ? (
              <p className="text-tp-muted text-xs">No uploads yet.</p>
            ) : (
              <div className="space-y-3">
                {history.map(h => (
                  <div key={h.id} className="flex items-start gap-3 py-2 border-b border-tp-border/50 last:border-0">
                    <div className="w-7 h-7 rounded-lg bg-tp-green/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={13} className="text-tp-green" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-tp-white text-xs font-medium">{h.member}</p>
                      <p className="text-tp-muted text-[10px]">{h.device}</p>
                      <p className="text-tp-muted text-[10px] truncate">{h.file}</p>
                      <p className="text-tp-muted text-[10px]">{h.uploadedAt}</p>
                    </div>
                    <span className="text-tp-green text-[10px] font-bold flex-shrink-0 mt-0.5">Processed</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-4">
            <p className="label mb-3">How the pipeline works</p>
            <div className="space-y-3">
              {PIPELINE_STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-tp-red/15 text-tp-red text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-tp-muted text-[11px] leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-tp-border">
              <p className="text-tp-muted text-[10px] leading-relaxed">
                Raw files are retained for 3 years for audit purposes. No data is modified after ingestion — the original CSV is always preserved.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
