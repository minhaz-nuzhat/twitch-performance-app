// ─────────────────────────────────────────────────────────────
// TRAINER MOCK DATA
// All coach-side data. Backend hook: replace each export with
// the corresponding trainer API call from src/api/client.js
// ─────────────────────────────────────────────────────────────

export const mockTrainer = {
  id: 'tr_001',
  name: 'Coach Ravi',
  email: 'coach@twitchperformance.in',
  avatarInitials: 'CR',
  specialization: 'Cricket Performance & Strength',
  role: 'trainer',
}

// ── Roster ────────────────────────────────────────────────────
export const mockRoster = [
  {
    id: 'mem_001', name: 'Arjun Sharma',  avatarInitials: 'AS',
    sport: 'Cricket',    position: 'Batting', age: 26,
    tier: 'silver', score: 62, adherence: 83,
    lastActive: '2026-08-01', assessmentDue: false, planStatus: 'active',
    trend: 'up',     trendVal: +4, fatigueScore: 'moderate',
    nextAssessment: '2026-08-14',
  },
  {
    id: 'mem_002', name: 'Priya Nair',    avatarInitials: 'PN',
    sport: 'Badminton',  position: 'Singles',  age: 22,
    tier: 'gold',   score: 71, adherence: 91,
    lastActive: '2026-08-02', assessmentDue: false, planStatus: 'active',
    trend: 'up',     trendVal: +6, fatigueScore: 'low',
    nextAssessment: '2026-08-20',
  },
  {
    id: 'mem_003', name: 'Rohit Singh',   avatarInitials: 'RS',
    sport: 'Football',   position: 'Midfielder', age: 19,
    tier: 'bronze', score: 38, adherence: 55,
    lastActive: '2026-07-28', assessmentDue: true, planStatus: 'expiring',
    trend: 'down',   trendVal: -5, fatigueScore: 'high',
    nextAssessment: null,
  },
  {
    id: 'mem_004', name: 'Ananya Patel',  avatarInitials: 'AP',
    sport: 'Swimming',   position: 'Freestyle', age: 24,
    tier: 'silver', score: 55, adherence: 78,
    lastActive: '2026-08-01', assessmentDue: true, planStatus: 'active',
    trend: 'stable', trendVal:  0, fatigueScore: 'low',
    nextAssessment: '2026-08-10',
  },
  {
    id: 'mem_005', name: 'Karan Mehta',   avatarInitials: 'KM',
    sport: 'Athletics',  position: 'Sprint',   age: 21,
    tier: 'gold',   score: 75, adherence: 95,
    lastActive: '2026-08-03', assessmentDue: false, planStatus: 'active',
    trend: 'up',     trendVal: +8, fatigueScore: 'moderate',
    nextAssessment: '2026-08-25',
  },
]

// ── Member detail scores (full dimension data per member) ────
export const mockMemberScores = {
  mem_001: { composite: 62, tier: 'silver', dimensions: { relativeStrength: 68, explosiveScore: 71, powerIndex: 65, cardiovascular: 58, mobilityScore: 55, symmetryScore: 72, injuryRisk: 31, bodyComposition: 69, trainingAdherence: 83, nutritionCompliance: 61, recoveryScore: 74 } },
  mem_002: { composite: 71, tier: 'gold',   dimensions: { relativeStrength: 62, explosiveScore: 80, powerIndex: 74, cardiovascular: 76, mobilityScore: 70, symmetryScore: 68, injuryRisk: 18, bodyComposition: 72, trainingAdherence: 91, nutritionCompliance: 78, recoveryScore: 69 } },
  mem_003: { composite: 38, tier: 'bronze', dimensions: { relativeStrength: 42, explosiveScore: 44, powerIndex: 35, cardiovascular: 40, mobilityScore: 30, symmetryScore: 45, injuryRisk: 62, bodyComposition: 38, trainingAdherence: 55, nutritionCompliance: 40, recoveryScore: 35 } },
  mem_004: { composite: 55, tier: 'silver', dimensions: { relativeStrength: 50, explosiveScore: 52, powerIndex: 48, cardiovascular: 70, mobilityScore: 60, symmetryScore: 58, injuryRisk: 28, bodyComposition: 62, trainingAdherence: 78, nutritionCompliance: 55, recoveryScore: 66 } },
  mem_005: { composite: 75, tier: 'gold',   dimensions: { relativeStrength: 72, explosiveScore: 85, powerIndex: 80, cardiovascular: 72, mobilityScore: 65, symmetryScore: 78, injuryRisk: 20, bodyComposition: 74, trainingAdherence: 95, nutritionCompliance: 70, recoveryScore: 72 } },
}

// ── Assessment template fields ────────────────────────────────
export const mockAssessmentTemplate = {
  id: 'tmpl_001',
  name: 'Full Battery Assessment',
  version: '2.1',
  categories: [
    {
      id: 'cat_strength',
      name: 'Strength',
      fields: [
        { id: 'squat_1rm',   label: 'Back Squat 1RM',    unit: 'kg',  type: 'number', placeholder: 'e.g. 100' },
        { id: 'bench_1rm',   label: 'Bench Press 1RM',   unit: 'kg',  type: 'number', placeholder: 'e.g. 80'  },
        { id: 'deadlift_1rm',label: 'Deadlift 1RM',      unit: 'kg',  type: 'number', placeholder: 'e.g. 140' },
        { id: 'body_weight', label: 'Body Weight',        unit: 'kg',  type: 'number', placeholder: 'e.g. 75'  },
      ],
    },
    {
      id: 'cat_explosive',
      name: 'Explosive Power',
      fields: [
        { id: 'cmj_height',  label: 'CMJ Height',         unit: 'cm',  type: 'number', placeholder: 'e.g. 52'  },
        { id: 'sprint_10m',  label: '10m Sprint',          unit: 's',   type: 'number', placeholder: 'e.g. 1.72', lowerIsBetter: true },
        { id: 'sprint_30m',  label: '30m Sprint',          unit: 's',   type: 'number', placeholder: 'e.g. 4.10', lowerIsBetter: true },
        { id: 'broad_jump',  label: 'Standing Broad Jump', unit: 'cm',  type: 'number', placeholder: 'e.g. 220'  },
      ],
    },
    {
      id: 'cat_cardio',
      name: 'Cardiovascular',
      fields: [
        { id: 'vo2_max',     label: 'VO₂ Max (proxy)',    unit: 'ml/kg/min', type: 'number', placeholder: 'e.g. 48'  },
        { id: 'hr_recovery', label: 'HR Recovery (1 min)', unit: 'bpm',      type: 'number', placeholder: 'e.g. 40'  },
        { id: 'resting_hr',  label: 'Resting Heart Rate',  unit: 'bpm',      type: 'number', placeholder: 'e.g. 58'  },
      ],
    },
    {
      id: 'cat_body',
      name: 'Body Composition',
      fields: [
        { id: 'body_fat',    label: 'Body Fat %',           unit: '%',   type: 'number', placeholder: 'e.g. 14.2' },
        { id: 'lean_mass',   label: 'Lean Mass',            unit: 'kg',  type: 'number', placeholder: 'e.g. 65'   },
      ],
    },
    {
      id: 'cat_mobility',
      name: 'Mobility (FMS)',
      fields: [
        { id: 'fms_squat',    label: 'Deep Squat',          unit: '/3', type: 'score3', options: [0,1,2,3] },
        { id: 'fms_hurdle',   label: 'Hurdle Step',         unit: '/3', type: 'score3', options: [0,1,2,3] },
        { id: 'fms_lunge',    label: 'Inline Lunge',        unit: '/3', type: 'score3', options: [0,1,2,3] },
        { id: 'fms_shoulder', label: 'Shoulder Mobility',   unit: '/3', type: 'score3', options: [0,1,2,3] },
        { id: 'fms_raiseleg', label: 'Active Straight Leg', unit: '/3', type: 'score3', options: [0,1,2,3] },
      ],
    },
    {
      id: 'cat_symmetry',
      name: 'Symmetry',
      fields: [
        { id: 'slp_left',    label: 'Single Leg Press — Left',  unit: 'kg', type: 'number', placeholder: 'e.g. 80' },
        { id: 'slp_right',   label: 'Single Leg Press — Right', unit: 'kg', type: 'number', placeholder: 'e.g. 82' },
        { id: 'sll_left',    label: 'Single Leg Landing — Left (stability score)',  unit: '/10', type: 'score10' },
        { id: 'sll_right',   label: 'Single Leg Landing — Right (stability score)', unit: '/10', type: 'score10' },
      ],
    },
    {
      id: 'cat_notes',
      name: 'Notes',
      fields: [
        { id: 'trainer_notes', label: 'Trainer Notes', unit: '', type: 'textarea', placeholder: 'Observations, context, anything relevant…' },
      ],
    },
  ],
}

// ── Exercise Library ──────────────────────────────────────────
export const mockExerciseLibrary = [
  // Lower Body
  { id: 'el_01', name: 'Back Squat',              category: 'Lower Body',  type: 'Strength',     defaultSets: 4, defaultReps: '5',        defaultLoad: 'Heavy',        defaultRest: '3 min', videoUrl: 'https://www.youtube.com/watch?v=ultWZbUMPL8' },
  { id: 'el_02', name: 'Romanian Deadlift',        category: 'Lower Body',  type: 'Strength',     defaultSets: 3, defaultReps: '8',        defaultLoad: 'Moderate',     defaultRest: '2 min', videoUrl: 'https://www.youtube.com/watch?v=JCXUYuzwNrM' },
  { id: 'el_03', name: 'Bulgarian Split Squat',    category: 'Lower Body',  type: 'Strength',     defaultSets: 3, defaultReps: '10 each',  defaultLoad: 'Moderate',     defaultRest: '90 s',  videoUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE' },
  { id: 'el_04', name: 'Box Jump',                 category: 'Lower Body',  type: 'Explosive',    defaultSets: 4, defaultReps: '5',        defaultLoad: 'BW',           defaultRest: '2 min', videoUrl: 'https://www.youtube.com/watch?v=52r_Ul5k03g' },
  { id: 'el_05', name: 'Nordic Curl',              category: 'Lower Body',  type: 'Strength',     defaultSets: 3, defaultReps: '6',        defaultLoad: 'BW',           defaultRest: '2 min', videoUrl: 'https://www.youtube.com/watch?v=1__g4QHPUss' },
  { id: 'el_06', name: 'Hex Bar Deadlift',         category: 'Lower Body',  type: 'Strength',     defaultSets: 4, defaultReps: '4',        defaultLoad: 'Heavy',        defaultRest: '3 min', videoUrl: '' },
  { id: 'el_07', name: 'Prowler Push',             category: 'Lower Body',  type: 'Conditioning', defaultSets: 5, defaultReps: '20m',      defaultLoad: '60 kg',        defaultRest: '90 s',  videoUrl: '' },
  // Upper Body
  { id: 'el_08', name: 'Bench Press',              category: 'Upper Body',  type: 'Strength',     defaultSets: 4, defaultReps: '5',        defaultLoad: 'Heavy',        defaultRest: '3 min', videoUrl: 'https://www.youtube.com/watch?v=SCVCLChPQSY' },
  { id: 'el_09', name: 'Pull-Up',                  category: 'Upper Body',  type: 'Strength',     defaultSets: 4, defaultReps: '8',        defaultLoad: 'BW',           defaultRest: '2 min', videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g' },
  { id: 'el_10', name: 'Dumbbell Row',             category: 'Upper Body',  type: 'Strength',     defaultSets: 3, defaultReps: '10 each',  defaultLoad: '30 kg',        defaultRest: '90 s',  videoUrl: '' },
  { id: 'el_11', name: 'Overhead Press',           category: 'Upper Body',  type: 'Strength',     defaultSets: 3, defaultReps: '8',        defaultLoad: 'Moderate',     defaultRest: '2 min', videoUrl: 'https://www.youtube.com/watch?v=2yjwXTZQDDI' },
  { id: 'el_12', name: 'Cable Row',                category: 'Upper Body',  type: 'Strength',     defaultSets: 3, defaultReps: '12',       defaultLoad: 'Moderate',     defaultRest: '90 s',  videoUrl: '' },
  // Full Body
  { id: 'el_13', name: 'Power Clean',              category: 'Full Body',   type: 'Explosive',    defaultSets: 4, defaultReps: '4',        defaultLoad: 'Moderate',     defaultRest: '3 min', videoUrl: 'https://www.youtube.com/watch?v=om8TPPrHv3U' },
  { id: 'el_14', name: 'Hang Snatch',              category: 'Full Body',   type: 'Explosive',    defaultSets: 4, defaultReps: '3',        defaultLoad: 'Light',        defaultRest: '3 min', videoUrl: 'https://www.youtube.com/watch?v=9xQp2sldaEY' },
  { id: 'el_15', name: 'Medicine Ball Slam',       category: 'Full Body',   type: 'Explosive',    defaultSets: 4, defaultReps: '8',        defaultLoad: '6 kg',         defaultRest: '90 s',  videoUrl: 'https://www.youtube.com/watch?v=9gHMDnSq1TY' },
  { id: 'el_16', name: 'Burpee',                   category: 'Full Body',   type: 'Conditioning', defaultSets: 4, defaultReps: '10',       defaultLoad: 'BW',           defaultRest: '90 s',  videoUrl: '' },
  // Sprint / Speed
  { id: 'el_17', name: '10m Acceleration Sprint',  category: 'Speed',       type: 'Explosive',    defaultSets: 6, defaultReps: '1',        defaultLoad: 'BW',           defaultRest: '2 min', videoUrl: '' },
  { id: 'el_18', name: '30m Sprint',               category: 'Speed',       type: 'Explosive',    defaultSets: 4, defaultReps: '1',        defaultLoad: 'BW',           defaultRest: '3 min', videoUrl: '' },
  { id: 'el_19', name: 'Sled Drag',                category: 'Speed',       type: 'Conditioning', defaultSets: 5, defaultReps: '20m',      defaultLoad: '40 kg',        defaultRest: '2 min', videoUrl: '' },
  // Mobility
  { id: 'el_20', name: 'Hip 90/90 Stretch',        category: 'Mobility',    type: 'Mobility',     defaultSets: 2, defaultReps: '60s each', defaultLoad: 'BW',           defaultRest: '30 s',  videoUrl: 'https://www.youtube.com/watch?v=sdkPLCSzLMc' },
  { id: 'el_21', name: 'Thoracic Rotation',        category: 'Mobility',    type: 'Mobility',     defaultSets: 2, defaultReps: '10 each',  defaultLoad: 'BW',           defaultRest: '30 s',  videoUrl: '' },
  { id: 'el_22', name: 'Ankle Dorsiflexion',       category: 'Mobility',    type: 'Mobility',     defaultSets: 2, defaultReps: '10 each',  defaultLoad: 'BW',           defaultRest: '30 s',  videoUrl: '' },
  // Core
  { id: 'el_23', name: 'Pallof Press',             category: 'Core',        type: 'Strength',     defaultSets: 3, defaultReps: '10 each',  defaultLoad: 'Light',        defaultRest: '60 s',  videoUrl: '' },
  { id: 'el_24', name: 'Dead Bug',                 category: 'Core',        type: 'Mobility',     defaultSets: 3, defaultReps: '8 each',   defaultLoad: 'BW',           defaultRest: '60 s',  videoUrl: 'https://www.youtube.com/watch?v=4XLEnwUr1d8' },
  { id: 'el_25', name: 'Farmer Carry',             category: 'Core',        type: 'Conditioning', defaultSets: 4, defaultReps: '30m',      defaultLoad: '30 kg each',   defaultRest: '90 s',  videoUrl: '' },
]

// ── Trainer message threads ───────────────────────────────────
export const mockTrainerThreads = {
  mem_001: [
    { id: 'm1', sender: 'trainer', text: 'Great session on Monday! Bar speed on squats is noticeably improved.', time: '2026-07-28T15:42:00', read: true },
    { id: 'm2', sender: 'member',  text: 'Thanks Coach! Felt strong. A bit tight in the left hip though.', time: '2026-07-28T16:05:00', read: true },
    { id: 'm3', sender: 'trainer', text: "Added extra hip work to Friday's warm-up. Let me know if it persists.", time: '2026-07-28T16:22:00', read: true },
    { id: 'm4', sender: 'trainer', text: 'Assessment on Aug 14. Taper from Aug 10 — no max efforts.', time: '2026-07-30T09:15:00', read: true },
    { id: 'm5', sender: 'member',  text: "Will do Coach, see you Thursday.", time: '2026-07-30T10:02:00', read: true },
  ],
  mem_002: [
    { id: 'm1', sender: 'member',  text: 'Coach, feeling a bit flat this week. Legs are heavy.', time: '2026-07-31T08:10:00', read: true },
    { id: 'm2', sender: 'trainer', text: "Let's drop the volume this week. Skip Thursday's session and just do light movement.", time: '2026-07-31T08:45:00', read: true },
  ],
  mem_003: [
    { id: 'm1', sender: 'trainer', text: 'Rohit — you missed 3 sessions this week. Can you let me know what\'s going on?', time: '2026-07-29T14:00:00', read: false },
  ],
  mem_004: [
    { id: 'm1', sender: 'trainer', text: 'Ananya, reminder that your assessment is coming up on Aug 10.', time: '2026-08-01T10:30:00', read: true },
    { id: 'm2', sender: 'member',  text: 'Got it! Should I reduce training volume the week before?', time: '2026-08-01T11:15:00', read: true },
    { id: 'm3', sender: 'trainer', text: 'Yes — normal intensity but cut sessions to 2 that week. Arrive rested.', time: '2026-08-01T11:40:00', read: true },
  ],
  mem_005: [],
}

// ── Analytics aggregate data ──────────────────────────────────
export const mockAnalytics = {
  rosterAverageScore: 60.2,
  rosterAverageAdherence: 80.4,
  totalMembers: 5,
  membersNeedingAttention: 1, // Rohit
  assessmentsDueThisWeek: 2,

  scoreByTier: [
    { tier: 'Bronze', count: 1 },
    { tier: 'Silver', count: 2 },
    { tier: 'Gold',   count: 2 },
    { tier: 'Elite',  count: 0 },
  ],

  averageScoreHistory: [
    { label: 'Jan', avg: 52.4 },
    { label: 'Feb', avg: 53.8 },
    { label: 'Mar', avg: 55.2 },
    { label: 'Apr', avg: 56.0 },
    { label: 'May', avg: 57.4 },
    { label: 'Jun', avg: 58.8 },
    { label: 'Jul', avg: 60.2 },
  ],

  dimensionAverages: [
    { dimension: 'Rel. Strength',  avg: 58.8 },
    { dimension: 'Explosive',      avg: 66.4 },
    { dimension: 'Power Index',    avg: 60.4 },
    { dimension: 'Cardiovascular', avg: 63.2 },
    { dimension: 'Mobility',       avg: 56.0 },
    { dimension: 'Symmetry',       avg: 64.2 },
    { dimension: 'Body Comp',      avg: 63.0 },
    { dimension: 'Recovery',       avg: 63.2 },
  ],

  adherenceByMember: mockRoster => mockRoster?.map(m => ({ name: m.name.split(' ')[0], adherence: m.adherence })) ?? [],
}

// ── Program library (saved programs) ─────────────────────────
export const mockProgramLibrary = [
  {
    id: 'prog_lib_01',
    name: 'Cricket Pre-Season Block',
    sport: 'Cricket',
    goal: 'Power & Speed',
    totalWeeks: 12,
    startDate: '2026-06-16',
    phases: [
      { id: 'ph_1', name: 'Phase 1 — Foundation',  weekCount: 4 },
      { id: 'ph_2', name: 'Phase 2 — Power',        weekCount: 4 },
      { id: 'ph_3', name: 'Phase 3 — Peaking',      weekCount: 4 },
    ],
    assignedTo: ['mem_001'],
    createdAt: '2026-06-01',
  },
  {
    id: 'prog_lib_02',
    name: 'Badminton Speed & Agility',
    sport: 'Badminton',
    goal: 'Explosive Power & Agility',
    totalWeeks: 8,
    startDate: '2026-06-15',
    phases: [
      { id: 'ph_1', name: 'Phase 1 — Conditioning', weekCount: 4 },
      { id: 'ph_2', name: 'Phase 2 — Speed',         weekCount: 4 },
    ],
    assignedTo: ['mem_002'],
    createdAt: '2026-06-15',
  },
]
