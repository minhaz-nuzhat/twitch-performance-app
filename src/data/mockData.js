// ─────────────────────────────────────────────────────────────
// MOCK DATA — Twitch Performance Frontend
// Replace individual sections with real API responses as backend
// routes become available. Shape is kept intentionally identical
// to the expected API contract defined in the PRD.
// ─────────────────────────────────────────────────────────────

export const mockMember = {
  id: 'mem_001',
  name: 'Arjun Sharma',
  email: 'arjun@twitchperformance.in',
  age: 26,
  sport: 'Cricket',
  position: 'Batting',
  fitnessLevel: 'Intermediate',
  joinedAt: '2025-10-01',
  avatarInitials: 'AS',
  trainer: {
    id: 'tr_001',
    name: 'Coach Ravi',
    specialization: 'Cricket Performance & Strength',
    avatarInitials: 'CR',
  },
}

export const mockPerformanceScore = {
  composite: 62,
  tier: 'silver',           // bronze | silver | gold | elite
  lastUpdated: '2026-07-28',
  trend: 'up',              // up | down | stable
  trendValue: +4,
  nextTierTarget: 65,       // score needed for Gold
  nextTierName: 'Gold',

  dimensions: {
    forceIndex:         { score: 68, label: 'Force Index',          raw: '3.2× BW IMTP',    change: +3,  icon: '💪' },
    explosiveScore:     { score: 71, label: 'Explosive Score',      raw: '52 cm CMJ',        change: +6,  icon: '⚡' },
    powerIndex:         { score: 65, label: 'Power Index',          raw: '14.2 W/kg',        change: +2,  icon: '🔋' },
    cardiovascular:     { score: 58, label: 'Cardiovascular',       raw: 'VO₂ 48.2 ml/kg',  change: -2,  icon: '❤️' },
    mobilityScore:      { score: 55, label: 'Mobility Score',       raw: 'FMS 16/21',        change: +1,  icon: '🤸' },
    symmetryScore:      { score: 72, label: 'Symmetry Score',       raw: '94% bilateral',    change: +4,  icon: '⚖️' },
    injuryRisk:         { score: 31, label: 'Injury Risk',          raw: 'Low',              change: -8,  icon: '🛡️', inverted: true },
    bodyComposition:    { score: 69, label: 'Body Composition',     raw: '14.2% BF',         change: +2,  icon: '📊' },
    trainingAdherence:  { score: 83, label: 'Training Adherence',   raw: '15/18 sessions',   change: +5,  icon: '📅' },
    nutritionCompliance:{ score: 61, label: 'Nutrition Compliance', raw: 'Self-reported',    change:  0,  icon: '🥗' },
    recoveryScore:      { score: 74, label: 'Recovery Score',       raw: 'HRV 68 ms',        change: +3,  icon: '🌙' },
  },

  derived: {
    athleticAge:  23,
    fatigueScore: 'moderate',  // low | moderate | high | critical
    fatigueRatio: 1.18,        // Acute:Chronic workload ratio
    streak:       11,          // consecutive sessions completed
  },

  // Radar uses 8 primary dimensions (UI choice — cleaner chart)
  radarData: [
    { dimension: 'Force',      current: 68, previous: 65 },
    { dimension: 'Explosive',  current: 71, previous: 65 },
    { dimension: 'Power',      current: 65, previous: 63 },
    { dimension: 'Cardio',     current: 58, previous: 60 },
    { dimension: 'Mobility',   current: 55, previous: 54 },
    { dimension: 'Symmetry',   current: 72, previous: 68 },
    { dimension: 'Body Comp',  current: 69, previous: 67 },
    { dimension: 'Recovery',   current: 74, previous: 71 },
  ],

  history: [
    { date: '2026-01-15', composite: 51, label: 'Jan' },
    { date: '2026-02-20', composite: 53, label: 'Feb' },
    { date: '2026-03-18', composite: 56, label: 'Mar' },
    { date: '2026-04-22', composite: 58, label: 'Apr' },
    { date: '2026-05-14', composite: 60, label: 'May' },
    { date: '2026-06-03', composite: 62, label: 'Jun' },
    { date: '2026-07-28', composite: 65, label: 'Jul' },
  ],

  // 7-day daily trend for hero card sparkline
  last7Days: [
    { day: 'Mon', v: 60 }, { day: 'Tue', v: 61 }, { day: 'Wed', v: 62 },
    { day: 'Thu', v: 62 }, { day: 'Fri', v: 63 }, { day: 'Sat', v: 64 },
    { day: 'Sun', v: 65 },
  ],

  insightCard: {
    type: 'improvement',
    title: 'Explosive Score up 6 points',
    body: 'CMJ height improved from 46 cm to 52 cm — a strong result from the plyometric block. Cardiovascular score dipped slightly; this is expected during high-intensity phases and will recover in the taper week.',
    priority: 'Biggest gain available: Cardiovascular Fitness. A 7-point improvement would push you to Elite tier.',
    generatedAt: '2026-07-28',
  },

  // ── New dashboard card data ──────────────────────────────
  readinessRecommendation: {
    label: 'Train with Control',
    color: 'amber',
    description: 'Readiness is acceptable. Keep intensity but control total volume.',
    ptsToNextTier: 20,
  },

  strengthIndex: {
    score: 68,
    description: 'Based on latest force, power, and speed markers.',
    change: +7,
  },

  leaderboard: {
    rank: 2,
    total: 5,
  },

  priorityFocus: {
    dimension: 'Mobility',
    score: 55,
    urgency: 'Red',
    description: 'Top priority. Make this the first focus in your week and protect quality over volume.',
    coachSource: '27 Jul',
  },

  recoveryRisk: {
    label: 'Moderate',
    acwr: 1.18,
    description: 'Readiness is acceptable. Keep intensity but control total volume.',
    advisory: 'Keep recovery work, sleep, and session quality aligned with this readiness status.',
  },

  adherenceWindows: {
    last14d: { pct: 100, sessions: '1/1' },
    last30d: { pct: 83,  sessions: '5/6' },
    targetText: 'Target: sustain 85%+ adherence with quality execution.',
  },
}

export const mockTrainingProgram = {
  id: 'prog_001',
  name: 'Cricket Pre-Season Block',
  phase: 'Phase 2 — Power',
  phaseNumber: 2,
  totalPhases: 3,
  week: 6,
  totalWeeks: 12,
  startDate: '2026-06-16',
  endDate: '2026-09-08',
  sessionsPerWeek: 3,
  assignedBy: 'Coach Ravi',

  // Workout templates available for assignment
  workoutTemplates: [
    { id: 'wkt_1', name: 'Upper Body Strength', duration: 60 },
    { id: 'wkt_2', name: 'Lower Body Power',    duration: 65 },
    { id: 'wkt_3', name: 'Full Body Speed',     duration: 55 },
    { id: 'wkt_4', name: 'Mobility & Recovery', duration: 45 },
  ],

  todaySession: {
    id: 'sess_042',
    name: 'Lower Body Power',
    phase: 'Phase 2 — Power',
    week: 6,
    date: '2026-08-08',
    estimatedDuration: 65,
    completed: false,
    warmup: '10 min activation — hip circles, leg swings, jump rope',
    cooldown: '10 min — static stretch, hip flexor focus',
    exercises: [
      { id: 'ex_1', order: 1, name: 'Back Squat',             sets: 4, reps: '5',          load: '100 kg', rest: '3 min',   notes: 'Focus on bar speed out of the hole',       completed: false, setsLogged: null, repsLogged: null, weightLogged: null },
      { id: 'ex_2', order: 2, name: 'Romanian Deadlift',      sets: 3, reps: '8',          load: '80 kg',  rest: '2 min',   notes: '',                                         completed: false, setsLogged: null, repsLogged: null, weightLogged: null },
      { id: 'ex_3', order: 3, name: 'Box Jump',               sets: 4, reps: '5',          load: 'BW',     rest: '90 sec',  notes: 'Max height each rep — full reset',        completed: false, setsLogged: null, repsLogged: null, weightLogged: null },
      { id: 'ex_4', order: 4, name: 'Bulgarian Split Squat',  sets: 3, reps: '10 each',    load: '40 kg',  rest: '90 s',   notes: 'Control eccentric phase',                  completed: false, setsLogged: null, repsLogged: null, weightLogged: null },
      { id: 'ex_5', order: 5, name: 'Nordic Curl',            sets: 3, reps: '6',          load: 'BW',     rest: '2 min',   notes: 'Eccentric focus — control descent',       completed: false, setsLogged: null, repsLogged: null, weightLogged: null },
    ],
  },

  weekView: [
    { day: 'Mon', name: 'Upper Body Strength', status: 'completed', date: '2026-08-04', duration: 60 },
    { day: 'Wed', name: 'Lower Body Power',    status: 'today',     date: '2026-08-08', duration: 65 },
    { day: 'Fri', name: 'Full Body Speed',     status: 'upcoming',  date: '2026-08-10', duration: 55 },
  ],

  recentSessions: [
    { date: '2026-08-04', name: 'Upper Body Strength', completed: true,  rpe: 7,    notes: '' },
    { date: '2026-08-01', name: 'Full Body Speed',     completed: true,  rpe: 8,    notes: 'Felt strong' },
    { date: '2026-07-30', name: 'Lower Body Power',    completed: true,  rpe: 7,    notes: '' },
    { date: '2026-07-27', name: 'Upper Body Strength', completed: false, rpe: null, notes: 'Missed — travel' },
    { date: '2026-07-23', name: 'Full Body Speed',     completed: true,  rpe: 6,    notes: '' },
    { date: '2026-07-20', name: 'Lower Body Power',    completed: true,  rpe: 8,    notes: 'New squat PB' },
  ],
}

export const mockNutritionPlan = {
  id: 'nutr_001',
  name: 'Cricket Pre-Season — Lean Performance',
  assignedBy: 'Coach Ravi',
  effectiveFrom: '2026-07-01',
  targets: { calories: 2800, protein: 165, carbs: 340, fat: 75 },
  todayLog:  { calories: 1940, protein: 118, carbs: 230, fat: 52 },
  trainerNote: 'Increase carbs by 50 g on training days around session window. Recovery days drop to 2500 kcal. Prioritise protein within 30 min post-session.',
  meals: [
    { id: 'meal_1', name: 'Breakfast',       time: '07:30', calories: 650, protein: 40, carbs: 75, fat: 18, logged: true,  items: ['Oats with whey protein', 'Banana', '3 whole eggs'] },
    { id: 'meal_2', name: 'Pre-Training',    time: '11:30', calories: 320, protein: 15, carbs: 55, fat:  5, logged: true,  items: ['Rice cakes', 'Peanut butter (1 tbsp)', 'Apple'] },
    { id: 'meal_3', name: 'Post-Training',   time: '14:30', calories: 520, protein: 42, carbs: 65, fat:  8, logged: true,  items: ['Whey protein shake', 'White rice 150 g', 'Chicken breast 150 g'] },
    { id: 'meal_4', name: 'Dinner',          time: '19:30', calories: 680, protein: 45, carbs: 75, fat: 18, logged: false, items: ['Salmon 180 g', 'Sweet potato', 'Mixed salad'] },
    { id: 'meal_5', name: 'Evening Snack',   time: '21:30', calories: 250, protein: 22, carbs: 15, fat: 10, logged: false, items: ['Greek yogurt 200 g', 'Mixed nuts 20 g'] },
  ],
}

export const mockGoals = [
  {
    id: 'goal_1',
    title: 'Reach Gold Tier',
    description: 'Composite performance score ≥ 65',
    icon: '🥇',
    current: 62, target: 65, unit: 'pts',
    deadline: '2026-09-30',
    progress: 73,
    status: 'on_track',
  },
  {
    id: 'goal_2',
    title: 'CMJ 55 cm',
    description: 'Counter-movement jump height target',
    icon: '⚡',
    current: 52, target: 55, unit: 'cm',
    deadline: '2026-09-30',
    progress: 60,
    status: 'on_track',
  },
  {
    id: 'goal_3',
    title: 'VO₂ Max 52',
    description: 'Aerobic capacity improvement',
    icon: '❤️',
    current: 48.2, target: 52, unit: 'ml/kg',
    deadline: '2026-09-30',
    progress: 28,
    status: 'needs_attention',
  },
  {
    id: 'goal_4',
    title: '90% Adherence',
    description: 'Session completion rate over 30 days',
    icon: '📅',
    current: 83, target: 90, unit: '%',
    deadline: '2026-08-31',
    progress: 47,
    status: 'on_track',
  },
]

export const mockAchievements = [
  { id: 'ach_1', title: 'First Assessment',   icon: '📋', earned: true,  date: '2025-10-15', description: 'Completed baseline assessment' },
  { id: 'ach_2', title: 'Silver Tier',         icon: '🥈', earned: true,  date: '2026-03-18', description: 'Reached Silver performance tier' },
  { id: 'ach_3', title: '10-Session Streak',   icon: '🔥', earned: true,  date: '2026-05-02', description: 'Completed 10 sessions in a row' },
  { id: 'ach_4', title: 'Symmetry Champion',   icon: '⚖️', earned: true,  date: '2026-06-19', description: 'Symmetry score above 70' },
  { id: 'ach_5', title: 'Gold Tier',           icon: '🥇', earned: false, date: null,         description: 'Reach Gold performance tier' },
  { id: 'ach_6', title: '20-Session Streak',   icon: '💫', earned: false, date: null,         description: 'Complete 20 sessions in a row' },
  { id: 'ach_7', title: 'Elite Power',         icon: '⚡', earned: false, date: null,         description: 'Explosive score above 80' },
  { id: 'ach_8', title: 'Full Compliance',     icon: '✅', earned: false, date: null,         description: '100% nutrition compliance for 2 weeks' },
]

export const mockAssessments = [
  {
    id: 'assess_5',
    date: '2026-08-14',
    type: 'Full Battery',
    composite: null,
    trainer: 'Coach Ravi',
    status: 'scheduled',
    notes: 'Taper the week prior. Arrive rested.',
  },
  {
    id: 'assess_4',
    date: '2026-07-28',
    type: 'Full Battery',
    composite: 62,
    trainer: 'Coach Ravi',
    status: 'completed',
    highlights: ['CMJ +6 pts', 'Symmetry +4 pts', 'Cardio -2 pts'],
  },
  {
    id: 'assess_3',
    date: '2026-06-03',
    type: 'Full Battery',
    composite: 58,
    trainer: 'Coach Ravi',
    status: 'completed',
    highlights: ['Strength +3 pts', 'Body Comp +2 pts'],
  },
  {
    id: 'assess_2',
    date: '2026-04-01',
    type: 'Full Battery',
    composite: 54,
    trainer: 'Coach Ravi',
    status: 'completed',
    highlights: ['Adherence +8 pts'],
  },
  {
    id: 'assess_1',
    date: '2026-01-15',
    type: 'Baseline',
    composite: 51,
    trainer: 'Coach Ravi',
    status: 'completed',
    highlights: ['Baseline established'],
  },
]

export const mockMessages = [
  { id: 'm1', sender: 'trainer', text: 'Great session on Monday! Bar speed on squats is noticeably improved. Keep that intent through the Power phase.', time: '2026-07-28T15:42:00', read: true },
  { id: 'm2', sender: 'member', text: 'Thanks Coach! Felt really strong. Getting a bit tight in the left hip flexor though after the split squats.', time: '2026-07-28T16:05:00', read: true },
  { id: 'm3', sender: 'trainer', text: "I've added some extra hip flexor and thoracic work to Friday's warm-up. Let me know if it persists — we may need to pull back split squat volume.", time: '2026-07-28T16:22:00', read: true },
  { id: 'm4', sender: 'trainer', text: 'Assessment scheduled for Aug 14. Make sure you taper the full week before — no max efforts from Aug 10 onwards.', time: '2026-07-30T09:15:00', read: false },
]

export const mockNotifications = [
  { id: 'n1', type: 'assessment', title: 'Assessment Scheduled', body: 'Full battery assessment on Aug 14 with Coach Ravi.', time: '2 days ago', read: false },
  { id: 'n2', type: 'score',      title: 'Score Updated',        body: 'Your performance score updated to 62 — up 4 points!', time: '3 days ago', read: true },
  { id: 'n3', type: 'message',    title: 'New Message',          body: 'Coach Ravi sent you a message about your assessment.', time: '3 days ago', read: false },
  { id: 'n4', type: 'program',    title: 'Week 6 Unlocked',      body: 'Phase 2 Week 6 is now active. Lower Body Power today.', time: '5 days ago', read: true },
]

export const mockSubscription = {
  plan: 'Performance',
  status: 'active',
  renewsAt: '2026-08-31',
  monthlyPrice: 2999,   // INR
  currency: 'INR',
  features: [
    '4 assessments / month',
    'Full program & nutrition plans',
    'Direct trainer messaging',
    'AI performance insights',
    'Wearable sync (Phase 2)',
  ],
  availablePlans: [
    {
      id: 'basic',
      name: 'Basic',
      price: 999,
      currency: 'INR',
      features: ['1 assessment / month', 'View-only dashboard', 'Email support'],
      current: false,
    },
    {
      id: 'performance',
      name: 'Performance',
      price: 2999,
      currency: 'INR',
      features: ['4 assessments / month', 'Full program & nutrition plans', 'Trainer messaging', 'AI insights'],
      current: true,
    },
    {
      id: 'elite',
      name: 'Elite',
      price: 5999,
      currency: 'INR',
      features: ['Unlimited assessments', 'Priority trainer access', 'Wearable sync', 'Video analysis', 'Research dataset contribution badge'],
      current: false,
    },
  ],
}

export const mockClientProfile = {
  // ── Bio ───────────────────────────────────────────────────
  name:          'Arjun Sharma',
  age:           '26',
  height:        '178',
  weight:        '74.2',
  bodyFat:       '',
  email:         'arjun@twitchperformance.in',
  phone:         '+91 98xxxxxx21',
  prefTiming:    '7:00 AM - 9:00 AM',
  medicalHistory:'Previous left ankle sprain (fully rehabbed).',

  // ── 43 Profiling Questions (partially filled — realistic new member state) ──
  q01: 'Cricket',
  q02: 'Batting',
  q03: '5',
  q04: 'No major injury',
  q05: 'Improve acceleration and repeat sprint ability',
  q06: '',
  q07: '2026-11-10',
  q08: 'Right',
  q09: 'Right',
  q10: '',
  q11: '',
  q12: '',
  q13: '',
  q14: '',
  q15: '',
  q16: '',
  q17: '',
  q18: '',
  q19: '',
  q20: '',
  q21: '',
  q22: '',
  q23: '',
  q24: '',
  q25: '',
  q26: '',
  q27: '',
  q28: '',
  q29: '',
  q30: '',
  q31: '5',
  q32: '60-75 minutes',
  q33: '',
  q34: '',
  q35: '',
  q36: '',
  q37: '',
  q38: '',
  q39: '',
  q40: '',
  q41: '',
  q42: '',
  q43: '',
}

export const mockAssessmentReport = {
  member: {
    name: 'Lavanya C',
    id: 'ATH0017',
    sport: 'Cricket',
    position: 'Right Hand Bat / Right Arm Medium Pace',
    testNo: 1,
    assessmentDate: '27–28 March 2026',
    bodyWeight: 60,
    coach: 'Snehit Rai',
  },

  kpis: [
    { label: 'IMTP Peak Force',     value: '1516',  unit: 'N',          target: '1998 N',     status: 'below',  statusLabel: 'Below Target'     },
    { label: 'CMJ Jump Height',     value: '11.02', unit: 'in',         target: '16 in',      status: 'below',  statusLabel: 'Below Target'     },
    { label: 'VO2 Max',             value: '31.84', unit: 'ml/kg/min',  target: '>28',        status: 'pass',   statusLabel: 'Meets Standard'   },
    { label: 'Grip Strength R',     value: '38',    unit: 'kg',         target: '>30.5 kg',   status: 'pass',   statusLabel: 'Meets Standard'   },
    { label: 'IMTP Asymmetry',      value: '14.9%', unit: '',           target: '<10%',       status: 'fail',   statusLabel: 'High Asymmetry'   },
    { label: 'React. Strength Idx', value: '0.68',  unit: '',           target: '1.5–2.5',    status: 'fail',   statusLabel: 'Well Below'       },
    { label: 'Dyn. Strength Index', value: '1.15',  unit: '',           target: '0.6–0.8',    status: 'warn',   statusLabel: 'Strength Deficit' },
    { label: 'Drop Jump mRSI',      value: '1.19',  unit: '',           target: '0.35–0.50',  status: 'above',  statusLabel: 'Above Range'      },
  ],

  sections: {
    bess: {
      chart: {
        title: 'BESS — Sway Lengths vs. Normative (Lower = Better)',
        data: [
          { name: 'L ML Sway',  value: 88,  norm: 90  },
          { name: 'R ML Sway',  value: 111, norm: 90  },
          { name: 'L AP Sway',  value: 89,  norm: 90  },
          { name: 'R AP Sway',  value: 113, norm: 90  },
          { name: 'L Total',    value: 152, norm: 150 },
          { name: 'R Total',    value: 191, norm: 150 },
        ],
        refLines: [
          { value: 90,  label: '90 cm norm',  color: '#06b6d4' },
          { value: 150, label: '150 cm norm', color: '#f59e0b' },
        ],
      },
      alert: { level: 'critical', text: 'RIGHT LEG POSTURAL CONTROL DEFICIT — Right leg sway exceeds norms in all directions. Priority: single-leg balance & proprioception training.' },
      table: [
        { factor: 'Left Leg Medial-Lateral Sway',    result: '88',  norm: '<90',  status: 'pass',       statusLabel: 'Pass'         },
        { factor: 'Right Leg Medial-Lateral Sway',   result: '111', norm: '<90',  status: 'fail',       statusLabel: 'Fail'         },
        { factor: 'Left Leg Anterior-Posterior Sway',result: '89',  norm: '<90',  status: 'borderline', statusLabel: '~ Borderline' },
        { factor: 'Right Leg Anterior-Posterior Sway',result: '113',norm: '<90',  status: 'fail',       statusLabel: 'Fail'         },
        { factor: 'Left Leg Total Sway',             result: '152', norm: '<150', status: 'borderline', statusLabel: '~ Borderline' },
        { factor: 'Right Leg Total Sway',            result: '191', norm: '<150', status: 'fail',       statusLabel: 'Fail'         },
      ],
    },

    imtp: {
      chart: {
        title: 'Rate of Force Development Across Time Windows',
        data: [
          { time: '0–100 ms', rfd: 2230 },
          { time: '0–150 ms', rfd: 2100 },
          { time: '0–200 ms', rfd: 1805 },
          { time: '0–250 ms', rfd: 1552 },
        ],
      },
      donut: { value: 14.9 },
      summary: [
        { label: 'IMTP Peak Force',       value: '1516 N', color: 'red'  },
        { label: 'Target (BW × 33.3)',    value: '1998 N', color: ''     },
        { label: '% of Target',           value: '75.9%',  color: ''     },
        { label: 'L Asymmetry',           value: '871 N',  color: 'cyan' },
        { label: 'R Asymmetry',           value: '645 N',  color: 'cyan' },
      ],
      table: [
        { factor: 'Peak Force (N)',              result: '1516', norm: '1998 N (BW × 33.3)', status: 'below',    statusLabel: 'Below Target' },
        { factor: 'L–R Peak Force Asymmetry (%)',result: '14.91',norm: '<10%',               status: 'fail',     statusLabel: 'Fail'         },
        { factor: 'Left Peak Force (N)',          result: '871',  norm: 'Baseline',           status: 'baseline', statusLabel: 'Baseline'     },
        { factor: 'Right Peak Force (N)',         result: '645',  norm: 'Baseline',           status: 'baseline', statusLabel: 'Baseline'     },
        { factor: 'RFD 0–100 ms (N/s)',          result: '2230', norm: 'Baseline',           status: 'baseline', statusLabel: 'Baseline'     },
        { factor: 'RFD 0–150 ms (N/s)',          result: '2100', norm: 'Baseline',           status: 'baseline', statusLabel: 'Baseline'     },
        { factor: 'RFD 0–200 ms (N/s)',          result: '1805', norm: 'Baseline',           status: 'baseline', statusLabel: 'Baseline'     },
        { factor: 'RFD 0–250 ms (N/s)',          result: '1552', norm: 'Baseline',           status: 'baseline', statusLabel: 'Baseline'     },
      ],
    },

    lowerBody: {
      kneeData: [
        { name: 'Knee Extension', left: 40.1, right: 35.3 },
        { name: 'Knee Curl',      left: 14.2, right: 12.3 },
      ],
      hqData: [
        { name: 'L H:Q Ratio', actual: 35.4, target: 75 },
        { name: 'R H:Q Ratio', actual: 34.8, target: 75 },
      ],
      alert: { level: 'critical', text: 'CRITICAL — H:Q ratio is ~35% (target ≥75%). Significant hamstring strain injury risk. Immediate hamstring-focused loading required.' },
      hipData: [
        { name: 'Hip Ext',  left: 13.2, right: 10.6 },
        { name: 'Hip Flex', left: 12.1, right: 11.3 },
        { name: 'Hip Abd',  left: 12.8, right: 12.1 },
        { name: 'Hip Add',  left: 9.5,  right: 9.2  },
      ],
      asymmetryData: [
        { name: 'Knee Ext 11.9%',  value: 11.9 },
        { name: 'Knee Curl 13.7%', value: 13.7 },
        { name: 'Hip Ext 19.8%',   value: 19.8 },
        { name: 'Hip Flex 6.7%',   value: 6.7  },
        { name: 'Hip Abd 3.4%',    value: 3.4  },
        { name: 'Hip Add 2.6%',    value: 2.6  },
      ],
      table: [
        { factor: 'Knee Extension — Left',         result: '40.1',  norm: 'Baseline',  status: 'baseline', statusLabel: 'Baseline'         },
        { factor: 'Knee Extension — Right',        result: '35.3',  norm: 'Baseline',  status: 'baseline', statusLabel: 'Baseline'         },
        { factor: 'Knee Extension Asymmetry',      result: '11.9%', norm: '<10%',      status: 'fail',     statusLabel: 'Fail'             },
        { factor: 'Knee Curl — Left (H:Q 35.4%)', result: '14.2',  norm: '≥75% Ext',  status: 'fail',     statusLabel: 'Critical Deficit' },
        { factor: 'Knee Curl — Right (H:Q 34.8%)',result: '12.3',  norm: '≥75% Ext',  status: 'fail',     statusLabel: 'Critical Deficit' },
        { factor: 'Knee Curl Asymmetry',           result: '13.7%', norm: '<10%',      status: 'fail',     statusLabel: 'Fail'             },
        { factor: 'Hip Extension — Left',          result: '13.2',  norm: 'Baseline',  status: 'baseline', statusLabel: 'Baseline'         },
        { factor: 'Hip Extension — Right',         result: '10.6',  norm: 'Baseline',  status: 'baseline', statusLabel: 'Baseline'         },
        { factor: 'Hip Extension Asymmetry',       result: '19.8%', norm: '<10%',      status: 'fail',     statusLabel: 'Fail'             },
        { factor: 'Hip Flexion Asymmetry',         result: '6.7%',  norm: '<10%',      status: 'pass',     statusLabel: 'Pass'             },
        { factor: 'Hip Abduction Asymmetry',       result: '3.4%',  norm: '<10%',      status: 'pass',     statusLabel: 'Pass'             },
        { factor: 'Hip Adduction Asymmetry',       result: '2.6%',  norm: '<10%',      status: 'pass',     statusLabel: 'Pass'             },
      ],
    },

    upperBody: {
      shoulderData: [
        { name: 'Int. Rotation', right: 15.3, left: 14.8 },
        { name: 'Ext. Rotation', right: 10.4, left: 11.7 },
      ],
      asymmetryData: [
        { name: 'Shoulder IR 3.3%',   value: 3.3  },
        { name: 'Shoulder ER 11.2%',  value: 11.2 },
        { name: 'Act Str Leg 20.3%',  value: 20.3 },
        { name: 'Trunk Rot 19.5%',    value: 19.5 },
      ],
      trunkData: [
        { name: 'Trunk Rotation', right: 13.8, left: 11.1 },
        { name: 'Act. Str. Leg',  right: 6.4,  left: 7.8  },
      ],
      gripData: [
        { name: 'Right Grip', value: 38   },
        { name: 'Left Grip',  value: 40.9 },
        { name: 'Threshold',  value: 30.5 },
      ],
      table: [
        { factor: 'Shoulder Int. Rotation — Right',  result: '15.3 kg', norm: 'Baseline', status: 'baseline', statusLabel: 'Baseline' },
        { factor: 'Shoulder Int. Rotation — Left',   result: '14.8 kg', norm: 'Baseline', status: 'baseline', statusLabel: 'Baseline' },
        { factor: 'Shoulder Int. Rotation Asymmetry',result: '3.3%',    norm: '<10%',     status: 'pass',     statusLabel: 'Pass'     },
        { factor: 'Shoulder Ext. Rotation — Right',  result: '10.4 kg', norm: 'Baseline', status: 'baseline', statusLabel: 'Baseline' },
        { factor: 'Shoulder Ext. Rotation — Left',   result: '11.7 kg', norm: 'Baseline', status: 'baseline', statusLabel: 'Baseline' },
        { factor: 'Shoulder Ext. Rotation Asymmetry',result: '11.2%',   norm: '<10%',     status: 'fail',     statusLabel: 'Fail'     },
        { factor: 'Active Straight Leg Asymmetry',   result: '20.3%',   norm: '<10%',     status: 'fail',     statusLabel: 'Fail'     },
        { factor: 'Trunk Rotation — Right',          result: '13.8 kg', norm: 'Baseline', status: 'baseline', statusLabel: 'Baseline' },
        { factor: 'Trunk Rotation — Left',           result: '11.1 kg', norm: 'Baseline', status: 'baseline', statusLabel: 'Baseline' },
        { factor: 'Trunk Rotation Asymmetry',        result: '19.5%',   norm: '<10%',     status: 'fail',     statusLabel: 'Fail'     },
        { factor: 'Hand Grip — Right',               result: '38 kg',   norm: '>30.5 kg', status: 'pass',     statusLabel: 'Pass'     },
        { factor: 'Hand Grip — Left',                result: '40.9 kg', norm: '>30.5 kg', status: 'pass',     statusLabel: 'Pass'     },
      ],
    },

    jump: {
      cmjPhases: [
        { name: 'Peak Braking',    value: 1120 },
        { name: 'Peak Propulsive', value: 1650 },
        { name: 'Peak Landing',    value: 2600 },
      ],
      cmjLR: [
        { name: 'Braking',    left: 750, right: 620  },
        { name: 'Propulsive', left: 780, right: 640  },
        { name: 'Landing',    left: 635, right: 2019 },
      ],
      alert: { level: 'critical', text: 'CMJ LANDING ASYMMETRY 52.15% — Left 635 N vs Right 2019 N. This is a critical ACL-risk marker. Landing mechanics correction urgently required.' },
      cmjTable: [
        { factor: 'Jump Height (inches)',    result: '11.02', norm: '16 in',   status: 'below',      statusLabel: '68.9% of Target' },
        { factor: 'Flight Time (s)',         result: '0.46',  norm: 'Baseline',status: 'baseline',   statusLabel: 'Baseline'        },
        { factor: 'Take-off Velocity (m/s)', result: '2.33',  norm: 'Baseline',status: 'baseline',   statusLabel: 'Baseline'        },
        { factor: 'Braking Asymmetry (%)',   result: '10.0',  norm: 'Baseline',status: 'borderline', statusLabel: '~ Borderline'    },
        { factor: 'Propulsive Asymmetry (%)',result: '–0.4',  norm: 'Baseline',status: 'pass',       statusLabel: 'Good'            },
        { factor: 'Landing Asymmetry (%)',   result: '52.15', norm: '—',       status: 'fail',       statusLabel: 'Critical Risk'   },
      ],
      dropJumpTable: [
        { factor: 'RSI',             result: '0.68',    norm: '1.5–2.5',    status: 'fail',       statusLabel: 'Well Below'   },
        { factor: 'Modified RSI',    result: '1.19',    norm: '0.35–0.50',  status: 'above',      statusLabel: '~ Above Range'},
        { factor: 'Contact Time (s)',result: '0.40',    norm: 'Lower better',status: 'baseline',  statusLabel: 'Baseline'     },
        { factor: 'Stiffness',       result: 'Negative',norm: 'Positive',   status: 'fail',       statusLabel: 'Fail'         },
      ],
      dropJumpChart: [
        { name: 'RSI Actual',    value: 0.68 },
        { name: 'RSI Min Target',value: 1.50 },
        { name: 'RSI Max Target',value: 2.50 },
      ],
    },

    medBall: {
      throwData: [
        { name: 'Rot.Throw Avg',  left: 4.1, right: 4.5 },
        { name: 'Rot.Throw Peak', left: 4.6, right: 5.0 },
        { name: 'Chest Pass Avg', left: 3.9, right: 4.0 },
        { name: 'Chest Pass Peak',left: 4.0, right: 4.2 },
      ],
      slamData: [
        { name: 'Avg Peak', value: 6.60 },
        { name: 'Peak',     value: 7.09 },
      ],
    },

    aerobic: {
      vo2: 31.84,
      dsiData: [
        { name: 'DSI',          value: 1.15 },
        { name: 'Vel Def Max',  value: 0.60 },
        { name: 'Neutral',      value: 0.80 },
        { name: 'Str Def Min',  value: 0.80 },
      ],
      alert: { level: 'pass', text: 'VO2 MAX & GRIP STRENGTH — Both meet normative standards. Continue current aerobic conditioning. DSI of 1.15 indicates strength deficit; prioritise max strength development before speed-strength work.' },
      table: [
        { factor: 'VO2 Max — Cooper Test (ml/kg/min)',result: '31.84',norm: '>28',      status: 'pass', statusLabel: 'Pass'             },
        { factor: 'Right Hand Grip (kg)',              result: '38',   norm: '>30.5 kg', status: 'pass', statusLabel: 'Pass'             },
        { factor: 'Left Hand Grip (kg)',               result: '40.9', norm: '>30.5 kg', status: 'pass', statusLabel: 'Pass'             },
        { factor: 'Dynamic Strength Index (DSI)',      result: '1.15', norm: '0.6–0.8',  status: 'warn', statusLabel: 'Strength Deficit' },
      ],
    },
  },

  fullResultsSummary: [
    { assessment: 'Modified BESS',  factor: 'Left ML Sway (cm)',        result: '88',    norm: '<90',       status: 'pass',       statusLabel: 'Pass'             },
    { assessment: 'Modified BESS',  factor: 'Right ML Sway (cm)',       result: '111',   norm: '<90',       status: 'fail',       statusLabel: 'Fail'             },
    { assessment: 'Modified BESS',  factor: 'Left AP Sway (cm)',        result: '89',    norm: '<90',       status: 'borderline', statusLabel: '~ Borderline'     },
    { assessment: 'Modified BESS',  factor: 'Right AP Sway (cm)',       result: '113',   norm: '<90',       status: 'fail',       statusLabel: 'Fail'             },
    { assessment: 'Modified BESS',  factor: 'Left Total Sway (cm)',     result: '152',   norm: '<150',      status: 'borderline', statusLabel: '~ Borderline'     },
    { assessment: 'Modified BESS',  factor: 'Right Total Sway (cm)',    result: '191',   norm: '<150',      status: 'fail',       statusLabel: 'Fail'             },
    { assessment: 'IMTP',           factor: 'Peak Force (N)',           result: '1516',  norm: '1998 N',    status: 'below',      statusLabel: 'Below Target'     },
    { assessment: 'IMTP',           factor: 'L–R Asymmetry (%)',        result: '14.91', norm: '<10%',      status: 'fail',       statusLabel: 'Fail'             },
    { assessment: 'Knee Extension', factor: 'Asymmetry (%)',            result: '11.9',  norm: '<10%',      status: 'fail',       statusLabel: 'Fail'             },
    { assessment: 'Knee Curl',      factor: 'Right H:Q Ratio',          result: '34.8%', norm: '≥75%',      status: 'fail',       statusLabel: 'Critical'         },
    { assessment: 'Knee Curl',      factor: 'Left H:Q Ratio',           result: '35.4%', norm: '≥75%',      status: 'fail',       statusLabel: 'Critical'         },
    { assessment: 'Knee Curl',      factor: 'Asymmetry (%)',            result: '13.7',  norm: '<10%',      status: 'fail',       statusLabel: 'Fail'             },
    { assessment: 'Hip Extension',  factor: 'Asymmetry (%)',            result: '19.8',  norm: '<10%',      status: 'fail',       statusLabel: 'Fail'             },
    { assessment: 'Hip Flexion',    factor: 'Asymmetry (%)',            result: '6.7',   norm: '<10%',      status: 'pass',       statusLabel: 'Pass'             },
    { assessment: 'Hip Abduction',  factor: 'Asymmetry (%)',            result: '3.4',   norm: '<10%',      status: 'pass',       statusLabel: 'Pass'             },
    { assessment: 'Hip Adduction',  factor: 'Asymmetry (%)',            result: '2.6',   norm: '<10%',      status: 'pass',       statusLabel: 'Pass'             },
    { assessment: 'Shoulder IR',    factor: 'Asymmetry (%)',            result: '3.3',   norm: '<10%',      status: 'pass',       statusLabel: 'Pass'             },
    { assessment: 'Shoulder ER',    factor: 'Asymmetry (%)',            result: '11.2',  norm: '<10%',      status: 'fail',       statusLabel: 'Fail'             },
    { assessment: 'Active Str. Leg',factor: 'Asymmetry (%)',            result: '20.3',  norm: '<10%',      status: 'fail',       statusLabel: 'Fail'             },
    { assessment: 'Trunk Rotation', factor: 'Asymmetry (%)',            result: '19.5',  norm: '<10%',      status: 'fail',       statusLabel: 'Fail'             },
    { assessment: 'CMJ',            factor: 'Jump Height (in)',         result: '11.02', norm: '16 in',     status: 'below',      statusLabel: 'Below Target'     },
    { assessment: 'CMJ',            factor: 'Landing Asymmetry (%)',    result: '52.15', norm: '—',         status: 'fail',       statusLabel: 'Critical Risk'    },
    { assessment: 'Drop Jump',      factor: 'RSI',                      result: '0.68',  norm: '1.5–2.5',   status: 'fail',       statusLabel: 'Well Below'       },
    { assessment: 'Drop Jump',      factor: 'Modified RSI',             result: '1.19',  norm: '0.35–0.50', status: 'above',      statusLabel: '~ Above Range'    },
    { assessment: 'Hand Grip',      factor: 'Right (kg)',               result: '38',    norm: '>30.5 kg',  status: 'pass',       statusLabel: 'Pass'             },
    { assessment: 'Hand Grip',      factor: 'Left (kg)',                result: '40.9',  norm: '>30.5 kg',  status: 'pass',       statusLabel: 'Pass'             },
    { assessment: 'Cooper Test',    factor: 'VO2 Max (ml/kg/min)',      result: '31.84', norm: '>28',       status: 'pass',       statusLabel: 'Pass'             },
    { assessment: 'Dyn. Str. Index',factor: 'DSI',                      result: '1.15',  norm: '0.6–0.8',   status: 'warn',       statusLabel: 'Strength Deficit' },
  ],

  priorities: [
    { id: 1, priority: 'Priority 1', level: 'critical', title: 'Hamstring Strengthening — Critical',         description: 'H:Q ratio ~35% (target ≥75%). Urgent hamstring-focused loading required. High hamstring strain injury risk.' },
    { id: 2, priority: 'Priority 2', level: 'critical', title: 'Right Leg Balance & Postural Control',       description: 'Right leg sway exceeds norms in all BESS directions. Single-leg stability, proprioception and balance training required immediately.' },
    { id: 3, priority: 'Priority 3', level: 'critical', title: 'Landing Mechanics — CMJ Asymmetry 52%',      description: 'Severe landing asymmetry is a major ACL-risk marker. Bilateral landing technique correction and single-leg absorbing drills urgently needed.' },
    { id: 4, priority: 'Priority 4', level: 'warn',     title: 'Overall Force Production (IMTP & DSI)',      description: 'IMTP at 75.9% of target; DSI of 1.15 indicates strength deficit. Focus on max strength development before speed-strength emphasis.' },
    { id: 5, priority: 'Priority 5', level: 'warn',     title: 'Trunk & Hip Extension Symmetry',             description: 'Trunk rotation (19.5%) and hip extension (19.8%) asymmetries above threshold. Core rotational symmetry work recommended for bowling performance.' },
    { id: 'm', priority: 'Maintain', level: 'pass',     title: 'Aerobic Fitness & Grip Strength',            description: 'VO2 max (31.84) and grip strength both meet normative standards. Continue current conditioning without major changes.' },
  ],
}


export const mockLeaderboard = {
  description: 'Compare your strength index trend with other members in similar programs.',
  yourRank: 2,
  members: [
    { rank: 1, name: 'Priya Mehta',   program: 'Elite Speed Cycle',        score: 79, trend: '+2' },
    { rank: 2, name: 'Arjun Sharma',  program: 'Power & Strength Block',   score: 72, trend: '+1', isCurrentUser: true },
    { rank: 3, name: 'Rahul Singh',   program: 'Force Build Phase',        score: 69, trend: '+3' },
    { rank: 4, name: 'Nisha Patel',   program: 'Speed & Recovery',         score: 66, trend: '-1' },
    { rank: 5, name: 'Vikram Shah',   program: 'Explosive Kickstart',      score: 63, trend: '+0' },
  ],
}
