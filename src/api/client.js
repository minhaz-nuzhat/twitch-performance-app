// ─────────────────────────────────────────────────────────────
// API CLIENT — Backend connectivity layer
//
// Currently returns mock data. When the Node.js backend is ready:
// 1. Set VITE_API_URL in .env
// 2. Uncomment the fetch calls in each function
// 3. Remove the mock import lines
//
// All response shapes match the PRD API contract.
// ─────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * Core fetch wrapper — adds auth token, handles errors consistently.
 * Replace mockFetch with this once backend is live.
 */
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('tp_token')

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 401) {
    // Token expired — clear session and redirect to login
    localStorage.removeItem('tp_token')
    localStorage.removeItem('tp_session')
    window.location.href = '/login'
    return
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || 'API error')
  }

  return res.json()
}

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  login: (email, password) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch('/auth/logout', { method: 'POST' }),

  me: () =>
    apiFetch('/auth/me'),
}

// ── Member / Profile ──────────────────────────────────────────
export const memberApi = {
  getProfile: () =>
    apiFetch('/member/profile'),

  updateProfile: (data) =>
    apiFetch('/member/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
}

// ── Performance / Scores ──────────────────────────────────────
export const performanceApi = {
  getScore: () =>
    apiFetch('/performance/score'),

  getScoreHistory: () =>
    apiFetch('/performance/score/history'),

  getDimensions: () =>
    apiFetch('/performance/dimensions'),
}

// ── Training ──────────────────────────────────────────────────
export const trainingApi = {
  getActiveProgram: () =>
    apiFetch('/training/program/active'),

  getTodaySession: () =>
    apiFetch('/training/session/today'),

  completeSession: (sessionId, data) =>
    apiFetch(`/training/session/${sessionId}/complete`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getSessionHistory: () =>
    apiFetch('/training/sessions'),
}

// ── Nutrition ─────────────────────────────────────────────────
export const nutritionApi = {
  getActivePlan: () =>
    apiFetch('/nutrition/plan/active'),

  logMeal: (mealId, data) =>
    apiFetch(`/nutrition/log/${mealId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// ── Assessments ───────────────────────────────────────────────
export const assessmentApi = {
  getAll: () =>
    apiFetch('/assessments'),

  getById: (id) =>
    apiFetch(`/assessments/${id}`),
}

// ── Goals ─────────────────────────────────────────────────────
export const goalsApi = {
  getAll: () =>
    apiFetch('/goals'),
}

// ── Messages ──────────────────────────────────────────────────
export const messagesApi = {
  getThread: (trainerId) =>
    apiFetch(`/messages/${trainerId}`),

  send: (trainerId, text) =>
    apiFetch(`/messages/${trainerId}`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),
}

// ── Notifications ─────────────────────────────────────────────
export const notificationsApi = {
  getAll: () =>
    apiFetch('/notifications'),

  markRead: (id) =>
    apiFetch(`/notifications/${id}/read`, { method: 'PATCH' }),
}

// ── Payments ──────────────────────────────────────────────────
export const paymentsApi = {
  getSubscription: () =>
    apiFetch('/payments/subscription'),

  getPlans: () =>
    apiFetch('/payments/plans'),
}
