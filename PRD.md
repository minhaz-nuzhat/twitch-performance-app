# Twitch Performance — Product Requirements Document
**Version:** 0.1 — Brainstorm Draft  
**Date:** 2026-07-31  
**Status:** In Review

---

## 1. Vision & Problem Statement

Twitch Performance currently operates with PowerBI dashboards fed by manually entered data per member. This process is slow, error-prone, non-scalable, and disconnected from the actual training loop.

The goal is to build a **fully automated, end-to-end performance platform** where:
- Data is collected once and flows everywhere it needs to go
- Trainers prescribe, members execute, the system measures and loops back
- Every user sees a personalized, living dashboard — not a static report
- Over 5+ years, the standardized dataset becomes a proprietary performance science asset

---

## 2. Company & Strategic Context

| Item | Detail |
|------|--------|
| Company | Twitch Performance (sports fitness) |
| Initial user scale | Up to 200 users (Phase 1) |
| Long-term ambition | Thousands of users, proprietary dataset across ages/sports/fitness levels |
| Data strategy | Informed consent, strong privacy, linked to real training outcomes |
| Current state | PowerBI + manual entry per member |
| Target state | Automated tracking → calculation → visualization → prescription → loop |

---

## 3. Personas

### 3.1 Member (Gym Attendant / Athlete)
- Attends training sessions at Twitch facilities 
- Wants to see their own performance data, progress, and assigned plans
- Motivated by visible improvement, scores, and clarity on what to do next
- May range from recreational to competitive athlete
- Has varying digital literacy — the interface must be simple

### 3.2 Trainer / Coach
- Creates and manages personalized training and nutrition programs per member
- Reviews member assessments and performance data
- Prescribes plans, adjusts based on progress, flags underperformers
- Needs a clear operational view: who is on track, who needs attention
- May manage 20–100+ members simultaneously

### 3.3 Admin (Implicit Third Persona)
- Manages user accounts, billing, system configuration
- Can access aggregate analytics across all members
- Controls what data fields exist, what assessment templates look like
- Not a primary end-user of the dashboard UX

---

## 4. Core Feature Modules

---

### 4.1 Authentication & Onboarding

**Members:**
- Sign up via email or invite link from trainer
- Onboarding wizard: collect baseline info (age, sport, fitness history, goals, health conditions)
- Informed consent flow — explicit opt-in for data use in performance research
- Profile photo upload
- Role-based access control: member, trainer, admin

**Trainers:**
- Accounts created by admin only (no self-signup)
- Can manage a roster of assigned members
- Trainer profile: credentials, specializations, bio visible to members

**Requirements:**
- Multi-factor authentication (MFA) support
- Password reset via email
- Session management with configurable timeout
- GDPR/POPIA-style data consent logged with timestamp and version

---

### 4.2 Member Dashboard (The Core Experience)

The member's personal dashboard is the primary product surface. It must be **visual, scannable, and motivating** — not a data dump.

#### 4.2.1 Performance Score (Trust Score / Performance Index)

A single composite score (0–100 or banded: Bronze/Silver/Gold/Elite) calculated from a set of sub-scores, each normalized to age/sex/sport benchmarks:

**Primary Performance Dimensions:**

| Dimension | Weight (configurable) | Description | Source |
|-----------|----------------------|-------------|--------|
| Relative Strength | ~15% | Strength output normalized to bodyweight (e.g. 1RM / BW ratio per lift) | Assessment results |
| Explosive Score | ~12% | Peak power output from jump/sprint tests (CMJ height, RSI, 10m split) | Assessment results |
| Power Index | ~12% | Combined measure of force × velocity; differentiates strength from power | Force plate / sprint data |
| Cardiovascular Fitness | ~12% | VO2 max proxy, aerobic threshold, heart rate recovery | Cardio assessment |
| Mobility Score | ~10% | Joint range of motion across key movement patterns (FMS-based) | Movement screen |
| Symmetry Score | ~10% | Left/right and anterior/posterior balance across strength and movement tests | Bilateral assessment data |
| Injury Risk Index | ~10% | Composite flag derived from asymmetries, mobility deficits, and training load spikes — lower is better | Calculated from above |
| Body Composition | ~8% | Body fat %, lean mass relative to sport-specific norms | DEXA / skinfold / BIA |
| Training Adherence | ~6% | Sessions completed vs. sessions assigned in rolling 30-day window | Session logs |
| Nutrition Compliance | ~3% | Self-reported or trainer-assessed plan adherence | Member logs / trainer input |
| Recovery Score | ~2% | Sleep quality, HRV, subjective readiness (if captured) | Self-report / wearable |

**Derived Contextual Metrics (displayed separately, not weighted into composite):**

| Metric | Description |
|--------|-------------|
| Athletic Age | Functional training age derived from performance profile — may differ significantly from chronological age. Benchmarks member against peers at the same athletic age rather than biological age |
| Fatigue Score | Short-term load vs. chronic load ratio (Acute:Chronic Workload Ratio proxy); flags overtraining risk |

> **Note on Injury Risk:** This is an informational flag surfaced to both trainer and member with clear language ("elevated risk indicators" not "you will get injured"). It triggers a trainer notification when above threshold. It is never used in isolation — trainers make the final clinical judgment.

> **Note on Athletic Age:** Stored and versioned at each assessment. A 35-year-old member may have an Athletic Age of 28 if their performance profile aligns with that cohort — or 45 if deconditioned. This metric is central to the long-term research dataset value.

- Score updates after each new assessment or logged session
- Trend line: is the score going up or down over 30/60/90 days?
- Each dimension drillable — member can tap to see what went into that sub-score
- Visible to both member and their assigned trainer

#### 4.2.2 Active Program Panel
- Currently assigned training program (name, phase, week number)
- Today's session: exercises, sets, reps, load — viewable in a clean card layout
- Mark session as complete (drives adherence score)
- Session history log

#### 4.2.3 Nutrition Plan Panel
- Currently assigned nutrition plan (daily calorie target, macros)
- Meal-by-meal breakdown if trainer provides it
- Basic self-reported meal logging (optional)
- Trainer notes / adjustments visible inline

#### 4.2.4 Assessment History
- Timeline of all completed assessments
- Each assessment shows scores per category with visual comparison to previous
- Radar/spider chart: current vs. last assessment vs. population average (anonymized)

#### 4.2.5 Goals & Milestones
- Trainer-set goals with target dates
- Member-visible progress toward each goal
- Milestone badges when goals are hit (lightweight gamification)

#### 4.2.6 Notifications & Messages
- In-app notifications: new plan assigned, assessment due, goal reached
- Direct message thread between member and their trainer (not group)
- No email-only communication; everything surfaced in-app

---

### 4.3 Trainer Portal

The trainer's working environment. Functional-first, not decorative.

#### 4.3.1 Member Roster
- List of all assigned members with at-a-glance status:
  - Last active date
  - Current performance score
  - Session adherence (last 30 days %)
  - Assessment due flag (red/amber/green)
  - Plan status (active / expiring / none)
- Filters: by sport, fitness level, score band, adherence status
- Quick-action: message, assign plan, schedule assessment

#### 4.3.2 Assessment Builder & Entry
- Configurable assessment templates (admin creates, trainers use)
- Standard battery included: FMS screen, strength metrics, cardio tests, body comp
- Trainer enters results per field after conducting in-person session
- System auto-calculates composite score upon save
- Assessment locked after 24 hours (cannot be edited without admin override)

#### 4.3.3 Program Builder
- Build training programs from scratch or clone from a library
- Structure: Program → Phases → Weeks → Sessions → Exercises
- Exercise library with video link support and notes
- Assign program to one member or broadcast to a cohort
- Program scheduling: start date, session frequency, duration
- Version control: see what was assigned when, and swap without losing history

#### 4.3.4 Nutrition Plan Builder
- Plan templates (cutting, maintenance, bulking, sport-specific)
- Macro targets: calories, protein, carbs, fat per day or per meal
- Assign directly to a member with effective start date
- Optional: attach PDF meal plan as supplementary document

#### 4.3.5 Trainer Analytics View
- Aggregate view across their full roster:
  - Average score by cohort
  - Adherence trends
  - Common weak dimensions across members (flags where programming may need adjustment)
- Not a BI tool — opinionated, pre-built charts, not drag-and-drop

---

### 4.4 Trust / Performance Scoring Engine

This is the system's backbone and most differentiating feature.

#### 4.4.1 Score Calculation
- Triggered automatically whenever a new assessment, session log, or nutrition log is saved
- Each raw metric normalized to a 0–100 scale using age/sex/sport-specific benchmarks
- Composite score = weighted sum of normalized dimension scores (weights admin-configurable per sport)
- Score version tracked: formula version stored alongside every score snapshot so historical scores remain valid if formula changes
- Derived metrics calculated in dependency order: raw inputs → sub-scores → composite score → contextual flags

**Calculation dependency map:**
```
Raw assessment inputs
    ├── 1RM values + bodyweight          → Relative Strength (0–100)
    ├── Jump height + sprint splits      → Explosive Score (0–100)
    ├── Force × velocity curve           → Power Index (0–100)
    ├── VO2 proxy + HR recovery          → Cardiovascular Fitness (0–100)
    ├── ROM measurements (FMS fields)    → Mobility Score (0–100)
    ├── Left/right bilateral deltas      → Symmetry Score (0–100)
    ├── Mobility + Symmetry + load spike → Injury Risk Index (0–100, inverted)
    ├── DEXA / skinfold values           → Body Composition (0–100)
    ├── Session logs                     → Training Adherence (0–100)
    ├── Nutrition logs                   → Nutrition Compliance (0–100)
    └── HRV / self-report                → Recovery Score (0–100)
                  │
                  ▼
         Composite Performance Score (0–100)
                  │
         ┌────────┴────────┐
    Athletic Age          Fatigue Score
   (derived context)    (load ratio flag)
```

#### 4.4.2 Benchmark Tables
- Initial benchmarks seeded from published fitness standards (NSCA, ACSM, EXOS, etc.) per dimension
- Athletic Age benchmarks built from Twitch's own dataset as it matures — not available at launch
- As Twitch's own dataset grows, internal benchmarks can be activated per cohort
- Benchmarks configurable per: age bracket, sex, sport category
- Injury Risk thresholds peer-reviewed by Twitch's training staff before activation — not algorithmically autonomous

#### 4.4.3 Score Transparency
- Member can tap any dimension on their score to see what contributed and why
- "What would improve my score the most?" — system highlights lowest-weighted dimension relative to potential

#### 4.4.4 Score as Trust Signal
- Used by trainers to prioritize check-ins
- Used by system to flag members at risk (score dropping >10 pts in 30 days)
- Intended future use: research dataset, partner integrations, performance prediction models

---

### 4.5 Data Collection & Standardization

This is the long-term strategic asset.

#### 4.5.1 Standardized Assessment Schema
- Every assessment field has: name, unit, data type, sport applicability, age range validity, source standard
- Fields are versioned — no field is deleted, only deprecated
- All assessments tagged with: member age, sport, fitness level at time of assessment, trainer ID, date

#### 4.5.2 Consent Management
- Every member has a consent record: what they've agreed to, when, which version
- Data used for internal scoring vs. anonymized research dataset governed separately
- Members can withdraw research consent without losing their account
- Consent audit log is immutable

#### 4.5.3 Data Export & Research Access
- Admin can export anonymized dataset (no PII) in CSV/JSON
- Future: API access for approved research partners with rate limiting

---

### 4.6 Payment Gateway

#### 4.6.1 Subscription Plans
- Admin defines plan tiers (e.g., Basic, Performance, Elite)
- Each tier maps to: number of assessments per month, program types available, messaging limits
- Member subscribes on signup or after trial period
- Trainer capacity not billed separately (internal user)

#### 4.6.2 Payment Processing
- Integration with **Stripe** (primary recommendation) or **PayFast** (if South Africa-focused)
- Recurring monthly or annual billing
- Payment status visible in member profile and admin view
- Grace period configurable (e.g., 7 days before access restricted on failed payment)
- Invoice PDF generated and emailed on each charge

#### 4.6.3 Admin Billing Dashboard
- MRR (Monthly Recurring Revenue)
- Churn, active subscriptions, failed payments
- Per-member payment history

---

### 4.7 Notifications & Communication

- In-app notification center (bell icon, unread count)
- Push notifications via browser (PWA) — no native app required in Phase 1
- Notification triggers:
  - New program/nutrition plan assigned
  - Assessment results ready
  - Session reminder (configurable by trainer or member)
  - Goal milestone reached
  - Payment due or failed
  - Score drop alert (>10 pts in 30 days, trainer-visible only)
- Direct 1:1 messaging: member ↔ trainer only
- No group chats, forums, or social features in Phase 1

---

### 4.8 Admin Panel

- User management: create/deactivate trainers, members, and admins
- Assessment template management: create, version, deprecate fields
- System configuration: score weights, benchmark tables, notification thresholds
- Subscription plan management
- Aggregate analytics: total active users, assessments completed, revenue
- Data export (anonymized)
- Audit log: all admin actions logged

---

## 5. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Dashboard loads < 2 seconds for 200 concurrent users |
| Availability | 99.5% uptime target (Phase 1) |
| Scalability | Architecture must support 10x growth without redesign |
| Security | Data encrypted at rest and in transit (TLS 1.2+, AES-256) |
| Privacy | India DPDP Act 2023-aligned consent management, right to erasure supported |
| Auditability | All data writes logged with user, timestamp, and before/after values |
| Accessibility | WCAG 2.1 AA compliance target |
| Mobile | Responsive web first; PWA installable on mobile in Phase 1 |
| Browser support | Chrome, Safari, Firefox, Edge (last 2 major versions) |
| Data retention | Assessment data retained indefinitely (with consent); session logs 3 years |

---

## 6. Out of Scope — Phase 1

- Native iOS / Android app (Phase 3 only — required for Apple HealthKit)
- Wearable integrations (Garmin, Whoop, Polar, Oura) — architecture defined in Section 12, implementation in Phase 2
- Real-time GPS/continuous streaming (Catapult, STATSports) — Phase 3
- AI-generated program recommendations (data collection first)
- Video coaching / live sessions
- Public-facing marketing site
- Multi-language / i18n
- White-label / multi-tenant (other gyms)

---

## 7. Success Metrics

| Metric | Phase 1 Target (6 months) |
|--------|--------------------------|
| Active members on platform | 150+ |
| Assessments completed digitally | 90%+ (vs. manual) |
| Trainer-assigned programs | 80%+ of active members |
| Member dashboard weekly active | 60%+ |
| Manual PowerBI usage | 0% |
| Data entry time per assessment | < 5 min (was 20+ min) |
| Payment collection automation | 100% |

---

## 8. Suggested Azure Architecture — Phase 1 (≤200 Users)

### Design Principles
- Minimize fixed cost; prefer consumption-based where possible
- All services in a single Azure region: **Central India (Pune)** — lowest latency for Indian users
- No over-engineering: no Kubernetes, no microservices, no event mesh in Phase 1
- Infrastructure-as-Code from day one (Bicep or Terraform)

---

### 8.1 Architecture Overview

```
[Browser / PWA]
       │
       ▼
[Azure Static Web Apps] ──── [Azure CDN]
       │ API calls
       ▼
[Azure App Service — B2 tier]    ← Backend API (Node.js / .NET / Python)
       │
       ├──── [Azure Database for PostgreSQL — Flexible Server, Burstable B1ms]
       │
       ├──── [Azure Blob Storage]           ← Profile photos, PDFs, exports
       │
       ├──── [Azure Cache for Redis — Basic C0]  ← Session cache, score cache
       │
       └──── [Azure Key Vault]              ← Secrets, connection strings

[Azure Functions — Consumption Plan]
       ├── Score recalculation trigger (on assessment save)
       ├── Notification dispatch
       └── Scheduled jobs (payment retries, reminders)

[Azure Communication Services]             ← Email (invoices, notifications)
[Stripe Webhooks] ──► App Service API
[Azure Application Insights]               ← Monitoring, performance, errors
[Azure AD B2C]                             ← Authentication (Free tier: 50k MAU)
```

---

### 8.2 Service-by-Service Breakdown

| Service | Tier | Monthly Est. Cost | Purpose |
|---------|------|-------------------|---------|
| Azure Static Web Apps | Free | $0 | React/Next.js frontend hosting + CI/CD |
| Azure App Service | B2 (2 core, 3.5 GB) | ~$60 | Backend API server |
| Azure PostgreSQL Flexible | Burstable B1ms, 32 GB storage | ~$25 | Primary database |
| Azure Blob Storage | LRS, ~50 GB | ~$2 | Files, exports, attachments |
| Azure Redis Cache | Basic C0 (250 MB) | ~$16 | Session + score caching |
| Azure Functions | Consumption | ~$0–3 | Async jobs, score engine, notifications |
| Azure Key Vault | Standard | ~$5 | Secrets management |
| Azure AD B2C | Free (≤50k MAU) | $0 | Auth + MFA |
| Azure Application Insights | Pay-per-use | ~$5 | Monitoring (minimal at 200 users) |
| Azure Communication Services | Pay-per-use | ~$2–5 | Transactional email |
| **Total Estimated** | | **~$115–120/month** | |

> Scale checkpoint: When you hit 500+ users or add wearable integrations, upgrade App Service to P1v3 and PostgreSQL to General Purpose 2 vCores. Redis can stay C0 until 1000+ concurrent users.

---

### 8.3 Database Schema — High-Level Entity Map

```
users
  ├── user_id, email, role (member/trainer/admin), created_at
  ├── consent_records (consent_id, user_id, version, accepted_at, withdrawn_at)
  └── subscriptions (subscription_id, user_id, stripe_customer_id, plan, status)

profiles
  └── profile_id, user_id, full_name, dob, sex, sport, fitness_level, photo_url

trainer_member_assignments
  └── trainer_id → member_id (many-to-many with primary trainer flag)

assessments
  ├── assessment_id, member_id, trainer_id, template_id, conducted_at, locked_at
  └── assessment_results (result_id, assessment_id, field_id, value, unit)

assessment_templates
  └── template_id, name, version, sport_applicability
      └── template_fields (field_id, name, unit, data_type, benchmark_table_ref)

performance_scores
  └── score_id, member_id, composite_score, dimension_scores (JSONB), formula_version, calculated_at

programs
  ├── program_id, created_by (trainer), name, sport, phase count
  └── program_assignments (assignment_id, program_id, member_id, start_date, status)
      └── sessions → exercises (normalized)

nutrition_plans
  └── plan_id, created_by, name, calorie_target, macros (JSONB)
      └── nutrition_assignments (member_id, plan_id, start_date)

session_logs
  └── log_id, member_id, program_session_id, completed_at, notes

messages
  └── message_id, sender_id, recipient_id, body, sent_at, read_at

notifications
  └── notification_id, user_id, type, payload (JSONB), created_at, read_at

payments
  └── payment_id, user_id, stripe_invoice_id, amount, status, paid_at
```

---

### 8.4 Security Architecture

- **Auth**: Azure AD B2C with JWT tokens; short-lived access tokens (15 min) + refresh tokens
- **Authorization**: Role-based (RBAC) enforced server-side on every API route — never trust client role claims
- **Data isolation**: Every DB query scoped by authenticated user_id; trainers can only query their assigned members
- **Secrets**: Zero hardcoded credentials; all secrets in Azure Key Vault, fetched via Managed Identity
- **Encryption**: PostgreSQL TDE enabled; Blob Storage encrypted at rest; TLS 1.2+ enforced
- **Input validation**: Server-side validation on all assessment fields; parameterized queries (no raw SQL)
- **Audit log**: Immutable write log table for all data modifications (user, timestamp, table, old/new value)
- **Consent enforcement**: Research data export pipeline checks consent record before including any row
- **Payment security**: Stripe handles card data; backend only stores Stripe Customer ID (no card numbers ever)

---

### 8.5 CI/CD Pipeline (GitHub Actions → Azure)

```
main branch push
       │
       ├── Frontend: GitHub Actions → Azure Static Web Apps (auto-deploy)
       └── Backend: GitHub Actions → Build → Azure App Service (deployment slot swap)

Pull Request:
       └── Preview environment via Static Web Apps PR environments
```

---

## 9. Phase Roadmap

### Phase 1 — Foundation (Months 1–4)
- Auth, onboarding, member + trainer profiles
- Assessment entry and score calculation engine
- Member dashboard (score, active program, nutrition plan)
- Trainer roster + program builder (basic)
- Payment integration (provider TBD — Razorpay / PayU, basic plans)
- Replace PowerBI entirely

### Phase 2 — Depth (Months 5–8)
- Full program builder (phases, weeks, exercise library with video)
- Nutrition plan builder with macro tracking
- In-app messaging
- Push notifications (PWA)
- Benchmark tables from Twitch's own growing dataset
- Admin analytics dashboard

### Phase 3 — Intelligence (Months 9–18)
- Wearable data ingestion hooks (Garmin, Apple Health, Whoop)
- Score trend prediction ("at this trajectory, you reach Gold by X")
- Azure OpenAI: program draft generator, nutrition macro calculator, member Q&A
- Trainer AI assist: flag underperforming members, AI-drafted program suggestions
- Research dataset export API (anonymized, partner access)

### Phase 4 — Scale (Year 2+)
- Multi-location support
- White-label option for other performance facilities
- Performance prediction models (trained on Twitch's proprietary dataset)
- Native mobile apps

---

## 10. Open Questions — Decision Log

| # | Question | Status | Answer |
|---|----------|--------|--------|
| 1 | Geography / region | ✅ Resolved | **India** — Azure region: Central India (Pune). Privacy law: India DPDP Act 2023. |
| 2 | Backend tech stack | ✅ Resolved | **Node.js** (Express or Fastify) + React frontend. AI layer via Azure OpenAI — see Section 11. |
| 3 | Score formula / weights | ✅ Resolved | Owned by **Twitch's performance scientists** — system exposes admin-configurable weights; we do not define defaults beyond placeholders. |
| 4 | Payment gateway | ✅ Resolved | **TBD by Twitch team.** Likely Razorpay or PayU for India. System built with an adapter pattern so swapping providers is low-effort. |
| 5 | Assessment battery | 🔲 Open | Does Twitch have an existing standardized battery, or do we define it together? |
| 6 | Existing PowerBI data | 🔲 Open | Do historical member records need migrating into the new system? |
| 7 | Research dataset timeline | 🔲 Open | When does Twitch want to activate the anonymized research export feature? |

---

## 11. AI Differentiator — Design Direction

This is what separates Twitch Performance from every generic gym app. The AI layer sits on top of the scoring engine and turns numbers into **actionable intelligence**. It does not replace the trainer — it makes the trainer look sharper and the member feel seen.

### 11.1 Phase 1 — Rule-Based Intelligence (at launch)

Not ML yet, but smart deterministic logic that reads like AI to the end user:

- **Score Insight Generator**: After each assessment, auto-generates a plain-English summary card. *"Your Explosive Score dropped 8 points. Sprint splits are consistent but CMJ height declined — this often follows high-volume lower body weeks. Your trainer has been notified."* Templated logic, no LLM cost.
- **Priority Dimension Callout**: Identifies the single dimension where improvement would produce the largest composite score gain. Surfaced as a prominent card on the member dashboard.
- **Injury Risk Narrative**: Translates the Injury Risk Index into plain language with the specific contributing factors listed — not just a number.
- **Fatigue Alert**: Fires when Acute:Chronic load ratio exceeds threshold. Proactive, not reactive. Visible to trainer before the member feels it.

### 11.2 Phase 2 — Azure OpenAI Integration (months 5–8)

Once 6+ months of session and assessment data exists per member:

| Feature | How it works | Who approves |
|---------|-------------|--------------|
| **Program Draft Generator** | Trainer inputs member goal + score profile → GPT-4o returns a structured program draft | Trainer reviews, edits, approves — never auto-assigned |
| **Nutrition Macro Calculator** | Member inputs goal + current body comp + training load → AI calculates macro targets with reasoning | Trainer can override before member sees it |
| **Progress Prediction** | *"At your current trajectory you reach Gold tier in ~11 weeks."* Extrapolation from score trend history | Displayed as estimate with confidence range |
| **Member Q&A** | Member asks *"Why is my Power Index lower than last month?"* → contextual answer from their actual data | No human gate needed — informational only |

> **Non-negotiable guardrail**: All AI outputs that affect training or nutrition prescription are gated behind trainer review and approval before reaching the member. AI drafts, human signs off. This is a liability and trust requirement, not a suggestion.

### 11.3 Phase 3 — Proprietary Model (Year 2+, Twitch's dataset advantage)

Once thousands of assessments exist across ages and sports:
- Internal benchmarks replace published norms (NSCA/ACSM) for Twitch's specific population
- Athletic Age model trained on Twitch's own cohort data
- Predictive injury risk model trained on longitudinal outcomes
- Fine-tuned performance prediction per sport category

### 11.4 Azure AI Services

| Service | Use Case | Cost at 200 users |
|---------|----------|-------------------|
| Azure OpenAI (GPT-4o) | Program drafts, nutrition calc, Q&A | ~$5–15/month (token-based, minimal at this scale) |
| Azure AI Language | Insight text generation for Phase 1 templates | Free tier covers Phase 1 volume |
| Azure Machine Learning | Phase 3 model training | Not needed until Year 2+ |

---

## 12. Data Pipeline Architecture

How data gets from trackers and devices into the platform automatically — eliminating manual entry entirely over time.

There are two distinct categories of data source, each with a different pipeline pattern.

---

### 12.1 Category 1: Assessment Equipment (Force Plates, Body Composition, Timing Systems)

These devices operate locally and do not stream to the cloud natively. The pipeline uses file-based ingestion:

```
Device (local software / CSV / proprietary export)
        │
        ▼
Azure Blob Storage — "raw-ingest" container (file drop zone)
        │  (Blob upload trigger fires instantly)
        ▼
Azure Function: Parser + Validator
        │  → detect file format (Vald, InBody, Hawkin, generic CSV)
        │  → validate field types, units, physiological range checks
        │  → reject and alert on anomalous values
        ▼
Azure Function: Transformer
        │  → map device field names → internal schema field names
        │  → apply unit conversions (kg, watts, m/s, bpm, cm)
        │  → tag row with: source device, trainer_id, member_id, assessment_id
        ▼
PostgreSQL — assessment_results table
        │
        ▼
Score recalculation triggered automatically
```

**Supported devices and integration method:**

| Device / Platform | Data Captured | Integration Method |
|-------------------|--------------|-------------------|
| Vald Performance (ForceDecks, NordBord) | Force, asymmetry, jump metrics | REST API (direct pull) |
| Hawkin Dynamics | Force plate, CMJ, RSI | REST API (direct pull) |
| InBody (570 / 770) | Body fat %, lean mass, segmental | CSV export → Blob upload |
| Microgate / Brower timing gates | Sprint splits, 10m, 40m | CSV export → Blob upload |
| Generic assessment CSV | Any trainer-defined fields | In-app CSV upload button → Blob trigger |

**For devices with REST APIs (Vald, Hawkin):** An Azure Function runs on schedule (every 15 min during training hours) and pulls new records, running them through the same transformer pipeline.

**For CSV-based devices:** Trainer uploads the exported file via a simple in-app button. No manual field entry — one file upload replaces 20+ minutes of data entry.

---

### 12.2 Category 2: Wearables (Continuous Passive Data)

Wearables use OAuth 2.0 + webhooks or polling APIs. The member connects their device once; data flows automatically thereafter.

```
Member completes one-time OAuth authorization in app
        │
        ▼
Wearable platform → sends webhook to Azure Function endpoint
   OR Azure Function polls platform API on schedule (every 6 hours)
        │
        ▼
Azure Service Bus — "wearable-ingest" queue
        │  (buffers events; guarantees delivery even if DB is temporarily busy)
        ▼
Azure Function: Wearable Transformer
        │  → normalize to internal schema
        │  → map: heart rate → cardiovascular dimension input
        │          HRV      → recovery score input
        │          sleep    → recovery score input
        │          strain   → fatigue score input (Acute load)
        │          activity → training adherence supplement
        │  → tag with source platform and member_id
        ▼
PostgreSQL — wearable_data table (raw) + triggers score recalc if threshold crossed
```

**Supported wearable platforms:**

| Platform | Key Data | Integration Type | Notes |
|----------|----------|-----------------|-------|
| Garmin Connect | HR, HRV, VO2 proxy, sleep, training load | Webhook push | Best for athletes |
| Whoop | Recovery %, HRV, strain, sleep stages | Webhook push | Best recovery signal |
| Polar | HR zones, training load, HRV | Webhook push | Strong for cardio athletes |
| Oura Ring | Sleep, readiness, HRV | REST polling (hourly) | Best sleep data |
| Google Fit | Steps, HR, basic activity | REST polling | Android fallback |
| Apple HealthKit | Everything | Requires native iOS app | Phase 3 only |

---

### 12.3 The Transformer / Normalizer — Core Design Principle

Regardless of source, **raw device data is never written directly to the database**. Every input passes through a normalization layer:

```
Raw input (any format, any device)
        │
        ▼
Transformer Function
        ├── 1. Validate: types, units, physiological plausibility ranges
        ├── 2. Map: device field names → internal canonical field names
        ├── 3. Convert: standardize units (all distances in cm, weights in kg, etc.)
        ├── 4. Tag: source = "garmin_connect" | "inbody_csv" | "vald_api" | "manual_entry"
        └── 5. Flag anomalies: values outside 3σ of population range → quarantine + trainer alert
        │
        ▼
Normalized record → DB
```

This is what makes the long-term dataset scientifically valuable. Every data point is tagged with its source, normalized to consistent units, and traceable — regardless of which device or trainer entered it. A future researcher querying the dataset gets clean, comparable records across all years and cohorts.

---

### 12.4 Phased Rollout

| Phase | What Gets Automated | New Azure Services |
|-------|--------------------|--------------------|
| **Phase 1** | CSV upload → auto-parse for InBody and generic assessments; Vald + Hawkin API pull | Azure Blob Storage (trigger), Azure Functions |
| **Phase 2** | Garmin, Whoop, Polar, Oura OAuth + webhook/polling pipelines | Azure Service Bus (reliable delivery queue) |
| **Phase 3** | Real-time streaming from GPS vests (Catapult, STATSports), continuous HR monitors | Azure Event Hubs, Azure Stream Analytics |

**Cost impact of Phase 2 additions at 200 users:**
- Azure Service Bus (Basic): ~$0.05/million operations — negligible
- Additional Azure Function executions: still within free tier monthly limit
- Net additional cost: **< $2/month**

---

### 12.5 Data Lineage & Audit

Every record in the database carries:
- `source_type`: manual_entry | csv_upload | api_pull | webhook
- `source_platform`: vald | inbody | garmin | whoop | polar | manual | etc.
- `ingested_at`: timestamp of pipeline processing
- `raw_payload_ref`: pointer to the original raw file/payload stored in Blob (immutable, retained 3 years)

This means any score can be traced back to the exact raw data that produced it — critical for both trainer trust and future research integrity.
