// ─── Storage Keys ─────────────────────────────────────────────────────────────
const KEYS = {
    SECRETS:         'progress_secrets',
    QUIZZES:         'progress_quizzes',
    CHAPTERS:        'progress_chapters',
    QUIZ_HISTORY:    'progress_quiz_history',
    SECRET_HISTORY:  'progress_secret_history',
    CHAPTER_HISTORY: 'progress_chapter_history',
    STREAK:          'progress_streak',
    LAST_ACTIVE:     'progress_last_active',
    TOTAL_SCORE:     'progress_total_score',
    TIER_PROGRESS:   'progress_tier_progress',
  }
  
  // ─── Internal helpers ─────────────────────────────────────────────────────────
  const get = (key, fallback) => {
    try {
      const val = localStorage.getItem(key)
      return val !== null ? JSON.parse(val) : fallback
    } catch {
      return fallback
    }
  }
  
  const set = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }
  
  // ─── Streak tracker ───────────────────────────────────────────────────────────
  const updateStreak = () => {
    const today      = new Date().toDateString()
    const lastActive = get(KEYS.LAST_ACTIVE, null)
    let   streak     = get(KEYS.STREAK, 0)
  
    if (lastActive === today) return streak
  
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    streak = lastActive === yesterday ? streak + 1 : 1
  
    set(KEYS.LAST_ACTIVE, today)
    set(KEYS.STREAK, streak)
    return streak
  }
  
  // ─── Record a question asked to Dr. Clergy ────────────────────────────────────
  export const recordSecret = (question) => {
    const history = get(KEYS.SECRET_HISTORY, [])
    const entry   = { question, date: new Date().toISOString() }
    set(KEYS.SECRET_HISTORY, [entry, ...history].slice(0, 200))
    set(KEYS.SECRETS, get(KEYS.SECRETS, 0) + 1)
    updateStreak()
  }
  
  // ─── Record a quiz answer ─────────────────────────────────────────────────────
  export const recordQuiz = ({ question, answer, correct, tier }) => {
    const history = get(KEYS.QUIZ_HISTORY, [])
    const entry   = { question, answer, correct, tier, date: new Date().toISOString() }
    set(KEYS.QUIZ_HISTORY, [entry, ...history].slice(0, 500))
  
    if (correct) {
      set(KEYS.QUIZZES,     get(KEYS.QUIZZES, 0) + 1)
      set(KEYS.TOTAL_SCORE, get(KEYS.TOTAL_SCORE, 0) + 10)
    }
  
    const tierProg = get(KEYS.TIER_PROGRESS, {})
    if (!tierProg[tier]) tierProg[tier] = { correct: 0, total: 0 }
    tierProg[tier].total   += 1
    tierProg[tier].correct += correct ? 1 : 0
    set(KEYS.TIER_PROGRESS, tierProg)
  
    updateStreak()
  }
  
  // ─── Record a Bible chapter read ──────────────────────────────────────────────
  export const recordChapter = (book, chapter) => {
    const key     = `${book}_${chapter}`
    const history = get(KEYS.CHAPTER_HISTORY, [])
    if (history.find(h => h.key === key)) return // don't double-count
  
    const entry = { key, book, chapter, date: new Date().toISOString() }
    set(KEYS.CHAPTER_HISTORY, [entry, ...history])
    set(KEYS.CHAPTERS, get(KEYS.CHAPTERS, 0) + 1)
    updateStreak()
  }
  
  // ─── Get all progress data ────────────────────────────────────────────────────
  export const getProgress = () => ({
    secrets:        get(KEYS.SECRETS,         0),
    quizzes:        get(KEYS.QUIZZES,         0),
    chapters:       get(KEYS.CHAPTERS,        0),
    streak:         get(KEYS.STREAK,          0),
    totalScore:     get(KEYS.TOTAL_SCORE,     0),
    tierProgress:   get(KEYS.TIER_PROGRESS,   {}),
    quizHistory:    get(KEYS.QUIZ_HISTORY,    []).slice(0, 50),
    secretHistory:  get(KEYS.SECRET_HISTORY,  []).slice(0, 50),
    chapterHistory: get(KEYS.CHAPTER_HISTORY, []).slice(0, 50),
    lastActive:     get(KEYS.LAST_ACTIVE,     null),
  })
  
  // ─── Reset everything ─────────────────────────────────────────────────────────
  export const resetProgress = () => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k))
  }
  