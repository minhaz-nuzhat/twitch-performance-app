/**
 * Science-backed explanations for every metric and data point surfaced in the app.
 * All text should be ≤3 sentences: what it measures, why it matters, any key threshold.
 */

// ── Performance Dimensions (11 + 2 derived) ───────────────────
export const DIMENSION_TOOLTIPS = {
  'Force Index':
    'Peak isometric force production (IMTP) normalised to body weight. The foundational predictor of speed, power, and injury resilience in team sports. Benchmark for athletes: ≥33.3× BW. Raw force underlies all other athletic qualities.',

  'Explosive Score':
    'Rate of Force Development (RFD) and reactive strength from jump/sprint tests. Measures how quickly you generate force — essential for match-winning first-step acceleration and repeat-sprint ability in cricket.',

  'Power Index':
    'Force × velocity product (includes explosive power components). Integrates Explosive Score with movement velocity to identify whether athletes are strength-limited, power-limited, or velocity-limited — critical for programming emphasis. Distinguishes which quality needs development.',

  'Cardiovascular Fitness':
    'VO₂ max proxy from submaximal testing. Aerobic capacity determines how well you recover between high-intensity efforts and sustains consistent performance across a full training session or match.',

  'Mobility Score':
    'Joint range of motion assessed via FMS-based protocols. Movement restrictions directly predict injury risk and limit the ability to express strength and power in sport-specific positions.',

  'Symmetry Score':
    'Left-right and anterior-posterior force balance across all bilateral tests. Research consistently shows >10–15% asymmetry significantly elevates ACL, hamstring, and knee overuse injury risk.',

  'Injury Risk Index':
    'Composite flag derived from asymmetry data, mobility deficits, and training load spikes — lower is better. This is an informational risk indicator only. Trainers make all clinical decisions. Never interpreted in isolation.',

  'Body Composition':
    'Body fat % relative to sport-specific norms. Excess fat reduces power-to-weight ratio; being under-fat increases hormonal disruption and bone stress injury risk. Both extremes are detrimental.',

  'Training Adherence':
    'Sessions completed vs. sessions prescribed in a rolling 30-day window. Consistency is more strongly correlated with long-term improvement than training intensity — the most under-rated performance variable.',

  'Nutrition Compliance':
    'Self-reported adherence to the assigned nutrition plan. Directly impacts recovery quality, body composition, and training adaptation rate. Note: self-reporting carries known accuracy limitations.',

  'Recovery Score':
    'Composite of sleep quality, HRV (heart rate variability), and subjective readiness. Recovery quality determines how well training adaptations consolidate between sessions.',
}

// ── Derived contextual metrics ─────────────────────────────────
export const DERIVED_TOOLTIPS = {
  athleticAge:
    'Functional training age derived from your performance profile — benchmarks you against peers with the same performance characteristics regardless of biological age. Phase 1 uses published norms (NSCA/ACSM). Will use Twitch\'s own growing dataset from Phase 3 onwards.',

  fatigueScore:
    'Acute:Chronic Workload Ratio — compares training load over the last 7 days vs. your 4-week rolling baseline. Ratios above 1.3 ("spike zone") are strongly associated with soft tissue injury in published sports science literature. Target range: 0.8–1.3.',
}

// ── Assessment KPI tiles ───────────────────────────────────────
export const KPI_TOOLTIPS = {
  'IMTP Peak Force':
    'Isometric Mid-Thigh Pull — a maximal force production test. Target is 33.3× body weight for female cricketers. Below-target peak force predicts reduced sprint speed and elevated injury risk.',

  'CMJ Jump Height':
    'Counter-Movement Jump height measures explosive lower-limb power. Target: 16 inches for female cricketers. One of the most validated predictors of sprint acceleration and on-field power output.',

  'VO2 Max':
    'Maximal aerobic capacity estimated via Cooper 12-minute run test. Minimum standard for cricket: >28 ml/kg/min. Strong predictor of repeat-sprint ability and match endurance.',

  'Grip Strength R':
    'Right-hand grip strength — a reliable proxy for overall neuromuscular health and total body strength. Normative threshold: >30.5 kg. Consistently associated with injury resilience across athlete populations.',

  'IMTP Asymmetry':
    'Left-right force asymmetry in peak IMTP output. Norm: <10%. At 14.9%, this indicates significant muscular imbalance — a primary contributing factor to ACL and hamstring injury risk.',

  'React. Strength Idx':
    'Reactive Strength Index from drop jump — measures ability to rapidly switch from landing (eccentric) to take-off (concentric). Reflects tendon stiffness and plyometric capacity. Target for cricket: 1.5–2.5.',

  'Dyn. Strength Index':
    'Dynamic Strength Index = CMJ peak force ÷ IMTP peak force. Values >0.8 indicate the athlete is strength-limited relative to their explosive output. DSI of 1.15 means max strength development should be the current priority.',

  'Drop Jump mRSI':
    'Modified Reactive Strength Index from drop jump. Measures reactive strength across a longer ground contact phase. Normal range: 0.35–0.50. Above range (1.19) may indicate difficulty using elastic energy efficiently on landing.',
}

// ── Dashboard metric cards ─────────────────────────────────────
export const DASHBOARD_TOOLTIPS = {
  performanceScore:
    'Composite score (0–100) weighted across 11 performance dimensions (Force Index, Explosive Score, Power Index, Cardiovascular, Mobility, Symmetry, Injury Risk, Body Composition, Training Adherence, Nutrition Compliance, Recovery), normalised to sport and age benchmarks from published standards (NSCA, ACSM, EXOS). Tiers: Bronze <50 · Silver 50–64 · Gold 65–79 · Elite ≥80.',

  strengthIndex:
    'Your primary force production metric trended between assessments. Strength is the foundational prerequisite for all athletic performance qualities — power, speed, and injury resistance all require a sufficient strength base.',

  priorityFocus:
    'The dimension where targeted improvement would generate the largest composite score gain, given current performance gaps vs. sport-specific benchmarks. Verified by your coach before surfacing.',

  recoveryRisk:
    'Calculated from your Acute:Chronic Workload Ratio (ACWR). Managing training load is one of the most evidence-supported injury prevention strategies in sports science. Safe target range: 0.8–1.3.',

  sessionAdherence:
    'Sessions completed vs. assigned in a rolling 30-day window. The most consistent predictor of long-term performance improvement — more so than any individual training quality variable.',

  compositeScore:
    'A single number summarising your performance profile across 11 scientifically validated dimensions (Force Index, Explosive Score, Power Index, Cardiovascular, Mobility, Symmetry, Injury Risk, Body Composition, Training Adherence, Nutrition Compliance, Recovery), each normalised to age, sex, and sport-specific benchmarks. Updated automatically after each assessment or logged session.'
}
