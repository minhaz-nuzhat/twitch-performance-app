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
    relativeStrength:   { score: 68, label: 'Relative Strength',   raw: '1.4× BW Squat',   change: +3,  icon: '💪' },
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
    { dimension: 'Strength',   current: 68, previous: 65 },
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

  todaySession: {
    id: 'sess_042',
    name: 'Lower Body Power',
    date: '2026-08-01',
    estimatedDuration: 65,
    completed: false,
    warmup: '10 min activation — hip circles, leg swings, jump rope',
    cooldown: '10 min — static stretch, hip flexor focus',
    exercises: [
      { id: 'ex_1', order: 1, name: 'Back Squat',        sets: 4, reps: '5',       load: '100 kg', rest: '3 min', notes: 'Focus on bar speed out of the hole', completed: false },
      { id: 'ex_2', order: 2, name: 'Romanian Deadlift', sets: 3, reps: '8',       load: '80 kg',  rest: '2 min', notes: '',                                  completed: false },
      { id: 'ex_3', order: 3, name: 'Box Jump',          sets: 4, reps: '5',       load: 'BW',     rest: '2 min', notes: 'Max height each rep — full reset',   completed: false },
      { id: 'ex_4', order: 4, name: 'Bulgarian Split Squat', sets: 3, reps: '10 each', load: '40 kg', rest: '90 s', notes: '',                               completed: false },
      { id: 'ex_5', order: 5, name: 'Nordic Curl',       sets: 3, reps: '6',       load: 'BW',     rest: '2 min', notes: 'Eccentric focus — control descent',  completed: false },
    ],
  },

  weekView: [
    { day: 'Mon', name: 'Upper Body Strength', status: 'completed', date: '2026-07-28', duration: 60 },
    { day: 'Wed', name: 'Lower Body Power',    status: 'today',     date: '2026-08-01', duration: 65 },
    { day: 'Fri', name: 'Full Body Speed',     status: 'upcoming',  date: '2026-08-03', duration: 55 },
  ],

  recentSessions: [
    { date: '2026-07-28', name: 'Upper Body Strength', completed: true,  rpe: 7,    notes: '' },
    { date: '2026-07-25', name: 'Full Body Speed',      completed: true,  rpe: 8,    notes: 'Felt strong' },
    { date: '2026-07-23', name: 'Lower Body Power',     completed: true,  rpe: 7,    notes: '' },
    { date: '2026-07-21', name: 'Upper Body Strength',  completed: false, rpe: null, notes: 'Missed — travel' },
    { date: '2026-07-18', name: 'Full Body Speed',      completed: true,  rpe: 6,    notes: '' },
    { date: '2026-07-16', name: 'Lower Body Power',     completed: true,  rpe: 8,    notes: 'New squat PB' },
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
