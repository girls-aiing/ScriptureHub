import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'

// ══════════════════════════════════════════════════════════════════
// STORAGE HELPERS
// ══════════════════════════════════════════════════════════════════
const STORAGE_KEY = 'scripturehub_prayers'

const LS = {
  get: () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
    catch { return [] }
  },
  set: (data) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }
    catch {}
  },
}

// ══════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════
function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function daysBetween(isoA, isoB) {
  const a = new Date(isoA)
  const b = new Date(isoB || new Date())
  return Math.floor(Math.abs(b - a) / (1000 * 60 * 60 * 24))
}

const CATEGORIES = [
  { id: 'personal',    label: 'Personal',      icon: '🙏', color: '#f0c040' },
  { id: 'family',      label: 'Family',         icon: '👨‍👩‍👧', color: '#4caf50' },
  { id: 'health',      label: 'Health',         icon: '💊', color: '#e91e63' },
  { id: 'provision',   label: 'Provision',      icon: '💰', color: '#ff9800' },
  { id: 'guidance',    label: 'Guidance',       icon: '🧭', color: '#9c27b0' },
  { id: 'community',   label: 'Community',      icon: '🏘️', color: '#2196f3' },
  { id: 'thanksgiving',label: 'Thanksgiving',   icon: '🌟', color: '#00bcd4' },
  { id: 'intercession',label: 'Intercession',   icon: '⚔️', color: '#ff5722' },
]

const INSPIRATIONS = [
  { text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.', ref: 'Philippians 4:6' },
  { text: 'The prayer of a righteous person is powerful and effective.', ref: 'James 5:16' },
  { text: 'Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.', ref: 'Matthew 7:7' },
  { text: 'Call to me and I will answer you and tell you great and unsearchable things you do not know.', ref: 'Jeremiah 33:3' },
  { text: 'This is the confidence we have in approaching God: that if we ask anything according to his will, he hears us.', ref: '1 John 5:14' },
  { text: 'Be joyful in hope, patient in affliction, faithful in prayer.', ref: 'Romans 12:12' },
  { text: 'Evening, morning and noon I cry out in distress, and he hears my voice.', ref: 'Psalm 55:17' },
  { text: 'The Lord is near to all who call on him, to all who call on him in truth.', ref: 'Psalm 145:18' },
]

// ══════════════════════════════════════════════════════════════════
// FONT & ANIMATIONS
// ══════════════════════════════════════════════════════════════════
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap');`
const ANIM = `
  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes glow     { 0%,100%{box-shadow:0 0 12px rgba(240,192,64,0.15)} 50%{box-shadow:0 0 28px rgba(240,192,64,0.4)} }
  @keyframes answered { 0%{transform:scale(1)} 50%{transform:scale(1.04)} 100%{transform:scale(1)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  .prayer-card { animation: fadeUp 0.35s ease both; }
  .prayer-card:hover { transform: translateY(-2px); transition: transform 0.2s; }
  .answered-flash { animation: answered 0.5s ease; }
`

// ══════════════════════════════════════════════════════════════════
// PRAYER CARD COMPONENT
// ══════════════════════════════════════════════════════════════════
function PrayerCard({ prayer, onMarkAnswered, onDelete, onEdit, onAddNote, index }) {
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [noteDraft,     setNoteDraft]     = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const cat   = CATEGORIES.find(c => c.id === prayer.category) || CATEGORIES[0]
  const days  = daysBetween(prayer.createdAt, prayer.answeredAt || new Date())
  const isNew = daysBetween(prayer.createdAt, new Date()) < 1

  return (
    <div
      className={`prayer-card${prayer.answered ? ' answered-flash' : ''}`}
      style={{
        ...pc.card,
        borderColor:     prayer.answered ? '#4caf5066' : cat.color + '33',
        background:      prayer.answered
          ? 'linear-gradient(135deg, rgba(76,175,80,0.08), rgba(255,255,255,0.03))'
          : 'rgba(255,255,255,0.04)',
        animationDelay:  `${index * 0.05}s`,
      }}
    >
      {/* ── Top bar ── */}
      <div style={pc.topBar}>
        <div style={pc.topLeft}>
          {/* Category badge */}
          <span style={{ ...pc.catBadge, background: cat.color + '20', color: cat.color, borderColor: cat.color + '44' }}>
            {cat.icon} {cat.label}
          </span>
          {/* New badge */}
          {isNew && !prayer.answered && (
            <span style={pc.newBadge}>✨ New</span>
          )}
          {/* Answered badge */}
          {prayer.answered && (
            <span style={pc.answeredBadge}>✅ Answered!</span>
          )}
        </div>
        <div style={pc.topRight}>
          <span style={pc.dateText}>{formatDate(prayer.createdAt)}</span>
          <span style={pc.timeText}>{formatTime(prayer.createdAt)}</span>
        </div>
      </div>

      {/* ── Prayer title ── */}
      {prayer.title && (
        <div style={pc.title}>{prayer.title}</div>
      )}

      {/* ── Prayer text ── */}
      <p style={pc.body}>{prayer.text}</p>

      {/* ── Scripture tag ── */}
      {prayer.scripture && (
        <div style={{ ...pc.scriptureTag, borderLeftColor: cat.color }}>
          <span style={{ color: cat.color, fontSize: '0.78rem', fontWeight: '700' }}>📖</span>
          <span style={{ color: '#c8a96e', fontSize: '0.88rem', fontStyle: 'italic' }}>{prayer.scripture}</span>
        </div>
      )}

      {/* ── Notes ── */}
      {prayer.notes && prayer.notes.length > 0 && (
        <div style={pc.notesWrap}>
          <div style={pc.notesLabel}>📝 Updates</div>
          {prayer.notes.map((n, i) => (
            <div key={i} style={pc.noteItem}>
              <span style={pc.noteDot}>•</span>
              <div>
                <span style={pc.noteText}>{n.text}</span>
                <span style={pc.noteDate}> — {formatDate(n.date)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Answered note ── */}
      {prayer.answered && prayer.answeredNote && (
        <div style={pc.answeredNote}>
          <span style={{ fontSize: '1rem' }}>🙌</span>
          <span style={{ color: '#4caf50', fontSize: '0.95rem', fontStyle: 'italic' }}>
            {prayer.answeredNote}
          </span>
        </div>
      )}

      {/* ── Days counter ── */}
      <div style={pc.daysRow}>
        <span style={{ ...pc.daysText, color: prayer.answered ? '#4caf50' : '#c8a96e' }}>
          {prayer.answered
            ? `✅ Answered after ${daysBetween(prayer.createdAt, prayer.answeredAt)} day${daysBetween(prayer.createdAt, prayer.answeredAt) !== 1 ? 's' : ''}`
            : `🕐 Praying for ${days} day${days !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* ── Add note input ── */}
      {showNoteInput && (
        <div style={pc.noteInputWrap}>
          <textarea
            style={pc.noteInput}
            placeholder="Add an update to this prayer…"
            value={noteDraft}
            onChange={e => setNoteDraft(e.target.value)}
            rows={2}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <button style={pc.saveNoteBtn}
              onClick={() => {
                if (noteDraft.trim()) {
                  onAddNote(prayer.id, noteDraft.trim())
                  setNoteDraft('')
                  setShowNoteInput(false)
                }
              }}>
              💾 Save Update
            </button>
            <button style={pc.cancelBtn} onClick={() => { setShowNoteInput(false); setNoteDraft('') }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Action buttons ── */}
      <div style={pc.actions}>
        {!prayer.answered && (
          <button style={pc.answeredBtn}
            onClick={() => onMarkAnswered(prayer.id)}>
            ✅ {t('markAnswered')}
          </button>
        )}
        <button style={pc.noteBtn}
          onClick={() => setShowNoteInput(p => !p)}>
          📝 Add Update
        </button>
        <button style={pc.editBtn} onClick={() => onEdit(prayer)}>
          ✏️ Edit
        </button>
        {!confirmDelete ? (
          <button style={pc.deleteBtn} onClick={() => setConfirmDelete(true)}>
            🗑
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ color: '#e74c3c', fontSize: '0.8rem' }}>Delete?</span>
            <button style={{ ...pc.deleteBtn, background: 'rgba(231,76,60,0.2)', borderColor: '#e74c3c' }}
              onClick={() => { onDelete(prayer.id); setConfirmDelete(false) }}>
              Yes
            </button>
            <button style={pc.cancelBtn} onClick={() => setConfirmDelete(false)}>No</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// ANSWERED MODAL
// ══════════════════════════════════════════════════════════════════
function AnsweredModal({ onConfirm, onCancel }) {
  const [note, setNote] = useState('')
  return (
    <div style={m.overlay} onClick={onCancel}>
      <div style={m.modal} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '0.75rem' }}>🙌</div>
        <h3 style={m.title}>Prayer Answered!</h3>
        <p style={m.sub}>
          Praise God! Would you like to add a note about how He answered this prayer?
          This becomes part of your testimony.
        </p>
        <textarea
          style={m.textarea}
          placeholder="How did God answer this prayer? (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
          autoFocus
        />
        <div style={m.btnRow}>
          <button style={m.confirmBtn} onClick={() => onConfirm(note.trim())}>
            ✅ Mark as Answered
          </button>
          <button style={m.cancelBtn} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// ADD / EDIT PRAYER FORM
// ══════════════════════════════════════════════════════════════════
function PrayerForm({ initial, onSave, onCancel }) {
  const [title,     setTitle]     = useState(initial?.title     || '')
  const [text,      setText]      = useState(initial?.text      || '')
  const [category,  setCategory]  = useState(initial?.category  || 'personal')
  const [scripture, setScripture] = useState(initial?.scripture || '')
  const textRef = useRef(null)

  useEffect(() => {
    if (textRef.current) textRef.current.focus()
  }, [])

  const isValid = text.trim().length > 0

  return (
    <div style={f.wrap}>
      <h3 style={f.heading}>
        {initial ? '✏️ Edit Prayer' : '🙏 New Prayer Request'}
      </h3>

      {/* Title */}
      <label style={f.label}>Title <span style={f.optional}>(optional)</span></label>
      <input
        style={f.input}
        type="text"
        placeholder="e.g. Healing for my mother…"
        value={title}
        onChange={e => setTitle(e.target.value)}
        maxLength={80}
      />

      {/* Category */}
      <label style={f.label}>Category</label>
      <div style={f.catGrid}>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            style={{
              ...f.catBtn,
              borderColor:  category === c.id ? c.color : 'rgba(255,255,255,0.12)',
              background:   category === c.id ? c.color + '20' : 'transparent',
              color:        category === c.id ? c.color : '#c8a96e',
            }}
            onClick={() => setCategory(c.id)}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Prayer text */}
      <label style={f.label}>Your Prayer <span style={{ color: '#e74c3c' }}>*</span></label>
      <textarea
        ref={textRef}
        style={f.textarea}
        placeholder="Write your prayer here. Be honest, be specific. God hears every word…"
        value={text}
        onChange={e => setText(e.target.value)}
        rows={5}
      />
      <div style={f.charCount}>{text.length} characters</div>

      {/* Scripture */}
      <label style={f.label}>
        Anchor Scripture <span style={f.optional}>(optional)</span>
      </label>
      <input
        style={f.input}
        type="text"
        placeholder="e.g. Philippians 4:6 — Do not be anxious…"
        value={scripture}
        onChange={e => setScripture(e.target.value)}
      />

      {/* Buttons */}
      <div style={f.btnRow}>
        <button
          style={{ ...f.saveBtn, opacity: isValid ? 1 : 0.45, cursor: isValid ? 'pointer' : 'not-allowed' }}
          disabled={!isValid}
          onClick={() => isValid && onSave({ title, text, category, scripture })}
        >
          {initial ? '💾 Save Changes' : '🙏 Add Prayer'}
        </button>
        <button style={f.cancelBtn} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// STATS PANEL
// ══════════════════════════════════════════════════════════════════
function StatsPanel({ prayers }) {
  const total    = prayers.length
  const answered = prayers.filter(p => p.answered).length
  const active   = prayers.filter(p => !p.answered).length
  const rate     = total === 0 ? 0 : Math.round((answered / total) * 100)

  const byCat = CATEGORIES.map(c => ({
    ...c,
    count: prayers.filter(p => p.category === c.id).length,
  })).filter(c => c.count > 0).sort((a, b) => b.count - a.count)

  const avgDays = answered === 0 ? null : Math.round(
    prayers
      .filter(p => p.answered && p.answeredAt)
      .reduce((sum, p) => sum + daysBetween(p.createdAt, p.answeredAt), 0) / answered
  )

  return (
    <div style={st.wrap}>
      <h3 style={st.heading}>📊 Your Prayer Journey</h3>
      <div style={st.grid}>
        <div style={st.statBox}>
          <div style={{ ...st.statNum, color: '#f0c040' }}>{total}</div>
          <div style={st.statLabel}>Total Prayers</div>
        </div>
        <div style={st.statBox}>
          <div style={{ ...st.statNum, color: '#4caf50' }}>{answered}</div>
          <div style={st.statLabel}>Answered</div>
        </div>
        <div style={st.statBox}>
          <div style={{ ...st.statNum, color: '#2196f3' }}>{active}</div>
          <div style={st.statLabel}>Active</div>
        </div>
        <div style={st.statBox}>
          <div style={{ ...st.statNum, color: '#ff9800' }}>{rate}%</div>
          <div style={st.statLabel}>Answer Rate</div>
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div style={st.progressWrap}>
          <div style={st.progressBar}>
            <div style={{ ...st.progressFill, width: `${rate}%` }} />
          </div>
          <span style={st.progressLabel}>{rate}% of prayers answered</span>
        </div>
      )}

      {/* Average days */}
      {avgDays !== null && (
        <div style={st.avgDays}>
          ⏱ Average answer time: <strong style={{ color: '#f0c040' }}>{avgDays} day{avgDays !== 1 ? 's' : ''}</strong>
        </div>
      )}

      {/* Category breakdown */}
      {byCat.length > 0 && (
        <div style={st.catBreakdown}>
          <div style={st.catBreakdownLabel}>Prayers by category</div>
          {byCat.map(c => (
            <div key={c.id} style={st.catRow}>
              <span style={{ color: c.color, minWidth: '90px', fontSize: '0.85rem' }}>
                {c.icon} {c.label}
              </span>
              <div style={st.catBarWrap}>
                <div style={{
                  ...st.catBar,
                  width:      `${Math.round((c.count / total) * 100)}%`,
                  background: c.color,
                }} />
              </div>
              <span style={{ color: '#c8a96e', fontSize: '0.82rem', minWidth: '24px', textAlign: 'right' }}>
                {c.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════
export default function PrayerJournalPage() {
  const { t } = useLanguage()
  const [prayers,       setPrayers]       = useState(() => LS.get())
  const [view,          setView]          = useState('active')   // 'active' | 'answered' | 'all' | 'stats'
  const [showForm,      setShowForm]      = useState(false)
  const [editPrayer,    setEditPrayer]    = useState(null)
  const [answering,     setAnswering]     = useState(null)       // prayer id being marked answered
  const [filterCat,     setFilterCat]     = useState('all')
  const [search,        setSearch]        = useState('')
  const [sortBy,        setSortBy]        = useState('newest')   // 'newest' | 'oldest' | 'category'
  const [toast,         setToast]         = useState(null)
  const [showStats,     setShowStats]     = useState(false)
  const [inspoIdx,      setInspoIdx]      = useState(() => Math.floor(Math.random() * INSPIRATIONS.length))

  // Persist on every change
  useEffect(() => { LS.set(prayers) }, [prayers])

  const showToast = msg => {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }

  // ── Rotate inspiration verse every 8 seconds ──────────────────
  useEffect(() => {
    const t = setInterval(() => {
      setInspoIdx(i => (i + 1) % INSPIRATIONS.length)
    }, 8000)
    return () => clearInterval(t)
  }, [])

  // ── Add prayer ────────────────────────────────────────────────
  const addPrayer = ({ title, text, category, scripture }) => {
    const p = {
      id:         newId(),
      title:      title.trim(),
      text:       text.trim(),
      category,
      scripture:  scripture.trim(),
      createdAt:  new Date().toISOString(),
      answered:   false,
      answeredAt: null,
      answeredNote: '',
      notes:      [],
    }
    setPrayers(prev => [p, ...prev])
    setShowForm(false)
    showToast('Prayer added 🙏')
  }

  // ── Edit prayer ───────────────────────────────────────────────
  const saveEdit = ({ title, text, category, scripture }) => {
    setPrayers(prev => prev.map(p =>
      p.id === editPrayer.id
        ? { ...p, title, text, category, scripture }
        : p
    ))
    setEditPrayer(null)
    showToast('Prayer updated ✏️')
  }

  // ── Mark answered ─────────────────────────────────────────────
  const markAnswered = (id, note) => {
    setPrayers(prev => prev.map(p =>
      p.id === id
        ? { ...p, answered: true, answeredAt: new Date().toISOString(), answeredNote: note }
        : p
    ))
    setAnswering(null)
    showToast('Praise God! Prayer marked as answered 🙌')
  }

  // ── Delete prayer ─────────────────────────────────────────────
  const deletePrayer = id => {
    setPrayers(prev => prev.filter(p => p.id !== id))
    showToast('Prayer removed 🗑')
  }

  // ── Add note ──────────────────────────────────────────────────
  const addNote = (id, text) => {
    setPrayers(prev => prev.map(p =>
      p.id === id
        ? { ...p, notes: [...(p.notes || []), { text, date: new Date().toISOString() }] }
        : p
    ))
    showToast('Update saved 📝')
  }

  // ── Filter & sort ─────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = prayers

    // View filter
    if (view === 'active')   list = list.filter(p => !p.answered)
    if (view === 'answered') list = list.filter(p =>  p.answered)

    // Category filter
    if (filterCat !== 'all') list = list.filter(p => p.category === filterCat)

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.text.toLowerCase().includes(q) ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.scripture && p.scripture.toLowerCase().includes(q))
      )
    }

    // Sort
    return [...list].sort((a, b) => {
      if (sortBy === 'oldest')   return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortBy === 'category') return a.category.localeCompare(b.category)
      return new Date(b.createdAt) - new Date(a.createdAt) // newest
    })
  }, [prayers, view, filterCat, search, sortBy])

  const activeCount   = prayers.filter(p => !p.answered).length
  const answeredCount = prayers.filter(p =>  p.answered).length
  const inspo         = INSPIRATIONS[inspoIdx]

  // ── RENDER ────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <style>{FONT + ANIM}</style>

      {/* Toast */}
      {toast && <div style={s.toast}>{toast}</div>}

      {/* Answered modal */}
      {answering && (
        <AnsweredModal
          onConfirm={note => markAnswered(answering, note)}
          onCancel={() => setAnswering(null)}
        />
      )}

      {/* Edit modal */}
      {editPrayer && (
        <div style={m.overlay} onClick={() => setEditPrayer(null)}>
          <div style={{ ...m.modal, maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <PrayerForm
              initial={editPrayer}
              onSave={saveEdit}
              onCancel={() => setEditPrayer(null)}
            />
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <div style={s.hero}>
        <div style={s.heroIcon}>🙏</div>
              <h1 style={s.heroTitle}>{t('prayerJournal')}</h1>
        <p style={s.heroSub}>
          A private space between you and God.
          <br />
          Record your prayers. Watch Him answer them.
        </p>

        {/* Inspiration verse */}
        <div style={s.inspoBox}>
          <p style={s.inspoText}>"{inspo.text}"</p>
          <p style={s.inspoRef}>— {inspo.ref}</p>
        </div>

        {/* Stats row */}
        <div style={s.heroStats}>
          <div style={s.heroStat}>
            <span style={{ ...s.heroStatNum, color: '#f0c040' }}>{prayers.length}</span>
            <span style={s.heroStatLabel}>Total</span>
          </div>
          <div style={s.heroStatDiv} />
          <div style={s.heroStat}>
            <span style={{ ...s.heroStatNum, color: '#2196f3' }}>{activeCount}</span>
            <span style={s.heroStatLabel}>Active</span>
          </div>
          <div style={s.heroStatDiv} />
          <div style={s.heroStat}>
            <span style={{ ...s.heroStatNum, color: '#4caf50' }}>{answeredCount}</span>
            <span style={s.heroStatLabel}>Answered</span>
          </div>
        </div>

        {/* Privacy note */}
        <div style={s.privacyNote}>
          🔒 Your prayers are stored privately on this device only. No one else can read them.
        </div>
      </div>

      {/* ── Add prayer button ── */}
      {!showForm && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button style={s.addBtn} onClick={() => setShowForm(true)}>
            + {t('newPrayer')}
          </button>
          <button
            style={{ ...s.addBtn, background: 'transparent', border: '1px solid rgba(240,192,64,0.3)', marginLeft: '12px' }}
            onClick={() => setShowStats(p => !p)}
          >
            📊 {showStats ? 'Hide' : 'View'} Stats
          </button>
        </div>
      )}

      {/* ── Add prayer form ── */}
      {showForm && (
        <div style={s.formWrap}>
          <PrayerForm
            onSave={addPrayer}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* ── Stats panel ── */}
      {showStats && !showForm && (
        <div style={{ maxWidth: '760px', margin: '0 auto 2rem' }}>
          <StatsPanel prayers={prayers} />
        </div>
      )}

      {/* ── View tabs ── */}
      <div style={s.tabRow}>
        {[
          { id: 'active',   label: `🙏 ${t('activePrayers')} (${activeCount})` },
          { id: 'answered', label: `✅ ${t('answeredPrayers')} (${answeredCount})` },
          { id: 'all',      label: `📋 ${t('viewAll')} (${prayers.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            style={{ ...s.tab, ...(view === tab.id ? s.tabOn : {}) }}
            onClick={() => setView(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Search ── */}
      <div style={s.searchWrap}>
        <span style={s.searchIcon}>🔍</span>
        <input
          style={s.searchInput}
          type="text"
          placeholder="Search your prayers…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button style={s.searchClear} onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* ── Category filter ── */}
      <div style={s.catRow}>
        <button
          style={{ ...s.catPill, ...(filterCat === 'all' ? s.catPillOn : {}) }}
          onClick={() => setFilterCat('all')}
        >
          🌟 All
        </button>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            style={{
              ...s.catPill,
              ...(filterCat === c.id ? {
                background:  c.color + '20',
                borderColor: c.color,
                color:       c.color,
                fontWeight:  '700',
              } : {}),
            }}
            onClick={() => setFilterCat(c.id)}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* ── Controls row ── */}
      <div style={s.ctrlRow}>
        <span style={s.resultCount}>
          {filtered.length} prayer{filtered.length !== 1 ? 's' : ''}
        </span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ color: '#c8a96e', fontSize: '0.85rem' }}>Sort:</span>
          {[['newest', 'Newest'], ['oldest', 'Oldest'], ['category', 'Category']].map(([val, label]) => (
            <button key={val}
              style={{
                ...s.sortBtn,
                ...(sortBy === val ? s.sortBtnOn : {}),
              }}
              onClick={() => setSortBy(val)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Empty states ── */}
      {filtered.length === 0 && (
        <div style={s.empty}>
          {view === 'active' && prayers.length === 0 && (
            <>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🙏</div>
              <div style={s.emptyTitle}>Your prayer journal is empty</div>
              <p style={s.emptySub}>
                Start by adding your first prayer request.
                <br />
                God is listening.
              </p>
              <button style={s.addBtn} onClick={() => setShowForm(true)}>
                + Add Your First Prayer
              </button>
            </>
          )}
          {view === 'active' && prayers.length > 0 && (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <div style={s.emptyTitle}>All prayers answered!</div>
              <p style={s.emptySub}>What a testimony. Keep praying!</p>
            </>
          )}
          {view === 'answered' && (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
              <div style={s.emptyTitle}>No answered prayers yet</div>
              <p style={s.emptySub}>
                Keep praying. God's timing is perfect.
                <br />
                When He answers, mark it here and build your testimony.
              </p>
            </>
          )}
          {view === 'all' && search && (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <div style={s.emptyTitle}>No prayers match your search</div>
              <button style={s.clearBtn} onClick={() => setSearch('')}>Clear search</button>
            </>
          )}
        </div>
      )}

      {/* ── Answered prayers testimony banner ── */}
      {view === 'answered' && answeredCount > 0 && (
        <div style={s.testimonyBanner}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
          <p style={s.testimonyText}>
            God has answered <strong style={{ color: '#4caf50' }}>{answeredCount}</strong> of your prayers.
            This is your testimony. Never forget what He has done.
          </p>
          <p style={{ ...s.testimonyText, fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8 }}>
            "They triumphed over him by the blood of the Lamb and by the word of their testimony." — Revelation 12:11
          </p>
        </div>
      )}

      {/* ── Prayer cards ── */}
      <div style={s.cardList}>
        {filtered.map((prayer, i) => (
          <PrayerCard
            key={prayer.id}
            prayer={prayer}
            index={i}
            onMarkAnswered={id => setAnswering(id)}
            onDelete={deletePrayer}
            onEdit={p => setEditPrayer(p)}
            onAddNote={addNote}
          />
        ))}
      </div>

      {/* ── Bottom note ── */}
      {prayers.length > 0 && (
        <div style={s.bottomNote}>
          <p style={{ color: '#7a6040', fontSize: '0.85rem', textAlign: 'center', fontStyle: 'italic', margin: 0 }}>
            🔒 All prayers are stored privately on your device. Clear your browser data to erase them.
          </p>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// PRAYER CARD STYLES
// ══════════════════════════════════════════════════════════════════
const pc = {
  card:         { border:'1px solid', borderRadius:'16px', padding:'1.4rem 1.5rem',
                  marginBottom:'0', transition:'transform 0.2s, box-shadow 0.2s',
                  position:'relative' },
  topBar:       { display:'flex', justifyContent:'space-between', alignItems:'flex-start',
                  flexWrap:'wrap', gap:'8px', marginBottom:'0.75rem' },
  topLeft:      { display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap' },
  topRight:     { display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'2px' },
  catBadge:     { padding:'3px 10px', borderRadius:'12px', border:'1px solid',
                  fontSize:'0.72rem', fontWeight:'700', textTransform:'uppercase',
                  letterSpacing:'0.06em' },
  newBadge:     { background:'rgba(240,192,64,0.15)', color:'#f0c040',
                  border:'1px solid rgba(240,192,64,0.4)', borderRadius:'10px',
                  padding:'2px 8px', fontSize:'0.7rem', fontWeight:'700' },
  answeredBadge:{ background:'rgba(76,175,80,0.15)', color:'#4caf50',
                  border:'1px solid rgba(76,175,80,0.4)', borderRadius:'10px',
                  padding:'2px 8px', fontSize:'0.7rem', fontWeight:'700' },
  dateText:     { color:'#c8a96e', fontSize:'0.78rem' },
  timeText:     { color:'#7a6040', fontSize:'0.7rem' },
  title:        { color:'#f0c040', fontSize:'1.15rem', fontWeight:'700',
                  marginBottom:'0.5rem', lineHeight:'1.3' },
  body:         { color:'#f0e6d2', fontSize:'1.05rem', lineHeight:'1.75',
                  margin:'0 0 0.75rem', whiteSpace:'pre-wrap' },
  scriptureTag: { display:'flex', gap:'8px', alignItems:'flex-start',
                  borderLeft:'3px solid', paddingLeft:'10px',
                  marginBottom:'0.75rem', background:'rgba(255,255,255,0.03)',
                  borderRadius:'0 6px 6px 0', padding:'6px 10px' },
  notesWrap:    { background:'rgba(255,255,255,0.03)', borderRadius:'8px',
                  padding:'10px 12px', marginBottom:'0.75rem',
                  border:'1px solid rgba(255,255,255,0.07)' },
  notesLabel:   { color:'#c8a96e', fontSize:'0.75rem', fontWeight:'700',
                  textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' },
  noteItem:     { display:'flex', gap:'8px', marginBottom:'4px' },
  noteDot:      { color:'#f0c040', flexShrink:0 },
  noteText:     { color:'#f0e6d2', fontSize:'0.9rem' },
  noteDate:     { color:'#7a6040', fontSize:'0.78rem' },
  answeredNote: { display:'flex', gap:'10px', alignItems:'flex-start',
                  background:'rgba(76,175,80,0.08)', borderRadius:'8px',
                  padding:'10px 12px', marginBottom:'0.75rem',
                  border:'1px solid rgba(76,175,80,0.2)' },
  daysRow:      { marginBottom:'0.75rem' },
  daysText:     { fontSize:'0.82rem', fontStyle:'italic' },
  noteInputWrap:{ marginBottom:'0.75rem' },
  noteInput:    { width:'100%', background:'#120a05', border:'1px solid rgba(240,192,64,0.3)',
                  color:'#f0e6d2', borderRadius:'8px', padding:'10px',
                  fontFamily:'inherit', fontSize:'0.95rem', resize:'vertical',
                  boxSizing:'border-box' },
  saveNoteBtn:  { padding:'6px 16px', borderRadius:'14px', border:'none',
                  background:'#f0c040', color:'#1a0a00', cursor:'pointer',
                  fontFamily:'inherit', fontSize:'0.82rem', fontWeight:'700' },
  actions:      { display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center',
                  paddingTop:'0.75rem', borderTop:'1px solid rgba(255,255,255,0.07)' },
  answeredBtn:  { padding:'7px 16px', borderRadius:'20px', border:'none',
                  background:'linear-gradient(135deg, #4caf50, #2e7d32)',
                  color:'#fff', cursor:'pointer', fontFamily:'inherit',
                  fontSize:'0.85rem', fontWeight:'700' },
  noteBtn:      { padding:'6px 14px', borderRadius:'14px',
                  border:'1px solid rgba(240,192,64,0.3)',
                  background:'transparent', color:'#c8a96e',
                  cursor:'pointer', fontFamily:'inherit', fontSize:'0.82rem' },
  editBtn:      { padding:'6px 14px', borderRadius:'14px',
                  border:'1px solid rgba(255,255,255,0.15)',
                  background:'transparent', color:'#c8a96e',
                  cursor:'pointer', fontFamily:'inherit', fontSize:'0.82rem' },
  deleteBtn:    { padding:'6px 12px', borderRadius:'14px',
                  border:'1px solid rgba(231,76,60,0.3)',
                  background:'transparent', color:'#e74c3c',
                  cursor:'pointer', fontFamily:'inherit', fontSize:'0.82rem' },
  cancelBtn:    { padding:'6px 12px', borderRadius:'14px',
                  border:'1px solid rgba(255,255,255,0.15)',
                  background:'transparent', color:'#888',
                  cursor:'pointer', fontFamily:'inherit', fontSize:'0.82rem' },
}

// ══════════════════════════════════════════════════════════════════
// MODAL STYLES
// ══════════════════════════════════════════════════════════════════
const m = {
  overlay:    { position:'fixed', inset:0, background:'rgba(0,0,0,0.82)',
                zIndex:500, display:'flex', alignItems:'center',
                justifyContent:'center', padding:'1rem', animation:'fadeIn 0.2s ease' },
  modal:      { background:'#1e1005', border:'1px solid rgba(240,192,64,0.35)',
                borderRadius:'16px', padding:'2rem', width:'100%',
                maxWidth:'480px', animation:'fadeUp 0.25s ease' },
  title:      { color:'#f0c040', fontSize:'1.4rem', fontWeight:'700',
                textAlign:'center', margin:'0 0 0.5rem' },
  sub:        { color:'#c8a96e', fontSize:'0.95rem', lineHeight:'1.7',
                textAlign:'center', margin:'0 0 1.25rem', fontStyle:'italic' },
  textarea:   { width:'100%', background:'#120a05',
                border:'1px solid rgba(240,192,64,0.3)', color:'#f0e6d2',
                borderRadius:'8px', padding:'12px', fontFamily:'inherit',
                fontSize:'1rem', lineHeight:'1.6', resize:'vertical',
                boxSizing:'border-box', marginBottom:'1rem' },
  btnRow:     { display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' },
  confirmBtn: { padding:'10px 28px', borderRadius:'25px', border:'none',
                background:'linear-gradient(135deg, #4caf50, #2e7d32)',
                color:'#fff', cursor:'pointer', fontFamily:'inherit',
                fontSize:'1rem', fontWeight:'700' },
  cancelBtn:  { padding:'10px 22px', borderRadius:'25px',
                border:'1px solid rgba(255,255,255,0.2)',
                background:'transparent', color:'#888',
                cursor:'pointer', fontFamily:'inherit', fontSize:'1rem' },
}

// ══════════════════════════════════════════════════════════════════
// FORM STYLES
// ══════════════════════════════════════════════════════════════════
const f = {
  wrap:      { fontFamily:"'Crimson Text',serif" },
  heading:   { color:'#f0c040', fontSize:'1.4rem', fontWeight:'700', margin:'0 0 1.5rem' },
  label:     { display:'block', color:'#c8a96e', fontSize:'0.85rem', fontWeight:'700',
               textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px', marginTop:'1rem' },
  optional:  { color:'#7a6040', fontWeight:'400', textTransform:'none', letterSpacing:0 },
  input:     { width:'100%', background:'#120a05', border:'1px solid rgba(240,192,64,0.3)',
               color:'#f0e6d2', borderRadius:'8px', padding:'10px 14px',
               fontFamily:'inherit', fontSize:'1rem', outline:'none',
               boxSizing:'border-box' },
  catGrid:   { display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'0.5rem' },
  catBtn:    { padding:'6px 14px', borderRadius:'16px', border:'1px solid',
               cursor:'pointer', fontFamily:'inherit', fontSize:'0.85rem',
               transition:'all 0.15s' },
  textarea:  { width:'100%', background:'#120a05', border:'1px solid rgba(240,192,64,0.3)',
               color:'#f0e6d2', borderRadius:'8px', padding:'12px 14px',
               fontFamily:'inherit', fontSize:'1.05rem', lineHeight:'1.7',
               resize:'vertical', outline:'none', boxSizing:'border-box',
               marginTop:'4px' },
  charCount: { color:'#7a6040', fontSize:'0.75rem', textAlign:'right', marginTop:'4px' },
  btnRow:    { display:'flex', gap:'10px', marginTop:'1.5rem', flexWrap:'wrap' },
  saveBtn:   { padding:'11px 28px', borderRadius:'25px', border:'none',
               background:'#f0c040', color:'#1a0a00', fontFamily:'inherit',
               fontSize:'1rem', fontWeight:'700' },
  cancelBtn: { padding:'11px 22px', borderRadius:'25px',
               border:'1px solid rgba(255,255,255,0.2)',
               background:'transparent', color:'#888',
               cursor:'pointer', fontFamily:'inherit', fontSize:'1rem' },
}

// ══════════════════════════════════════════════════════════════════
// STATS STYLES
// ══════════════════════════════════════════════════════════════════
const st = {
  wrap:              { background:'rgba(255,255,255,0.03)', border:'1px solid rgba(240,192,64,0.2)',
                       borderRadius:'16px', padding:'1.5rem' },
  heading:           { color:'#f0c040', fontSize:'1.2rem', fontWeight:'700', margin:'0 0 1.25rem' },
  grid:              { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'1.25rem' },
  statBox:           { textAlign:'center', background:'rgba(255,255,255,0.04)',
                       borderRadius:'10px', padding:'0.75rem 0.5rem' },
  statNum:           { fontSize:'1.8rem', fontWeight:'700', lineHeight:'1', display:'block' },
  statLabel:         { color:'#c8a96e', fontSize:'0.72rem', textTransform:'uppercase',
                       letterSpacing:'0.06em', marginTop:'4px', display:'block' },
  progressWrap:      { marginBottom:'1rem' },
  progressBar:       { height:'6px', background:'rgba(255,255,255,0.08)',
                       borderRadius:'3px', overflow:'hidden', marginBottom:'6px' },
  progressFill:      { height:'100%', background:'linear-gradient(90deg,#f0c040,#4caf50)',
                       borderRadius:'3px', transition:'width 0.5s ease' },
  progressLabel:     { color:'#c8a96e', fontSize:'0.82rem', fontStyle:'italic' },
  avgDays:           { color:'#c8a96e', fontSize:'0.9rem', marginBottom:'1rem', fontStyle:'italic' },
  catBreakdown:      { marginTop:'1rem' },
  catBreakdownLabel: { color:'#c8a96e', fontSize:'0.75rem', fontWeight:'700',
                       textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'10px' },
  catRow:            { display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' },
  catBarWrap:        { flex:1, height:'6px', background:'rgba(255,255,255,0.08)',
                       borderRadius:'3px', overflow:'hidden' },
  catBar:            { height:'100%', borderRadius:'3px', transition:'width 0.5s ease' },
}

// ══════════════════════════════════════════════════════════════════
// MAIN PAGE STYLES
// ══════════════════════════════════════════════════════════════════
const s = {
  page:           { background:'#0d0800', minHeight:'100vh', color:'#f0e6d2',
                    padding:'2rem 1rem', fontFamily:"'Crimson Text',serif" },
  hero:           { textAlign:'center', maxWidth:'680px', margin:'0 auto 2.5rem',
                    padding:'2.5rem 1.5rem', borderRadius:'20px',
                    background:'linear-gradient(135deg,rgba(240,192,64,0.07),rgba(76,175,80,0.05))',
                    border:'1px solid rgba(240,192,64,0.2)',
                    animation:'glow 4s ease-in-out infinite' },
  heroIcon:       { fontSize:'4rem', marginBottom:'0.75rem' },
  heroTitle:      { color:'#f0c040', fontSize:'2.8rem', fontWeight:'700',
                    margin:'0 0 0.75rem', lineHeight:'1.2' },
  heroSub:        { color:'#c8a96e', fontSize:'1.05rem', lineHeight:'1.8',
                    margin:'0 0 1.5rem', fontStyle:'italic' },
  inspoBox:       { background:'rgba(255,255,255,0.04)', borderRadius:'12px',
                    padding:'1rem 1.25rem', marginBottom:'1.5rem',
                    border:'1px solid rgba(240,192,64,0.15)',
                    animation:'fadeIn 0.6s ease' },
  inspoText:      { color:'#f0e6d2', fontSize:'0.95rem', lineHeight:'1.7',
                    fontStyle:'italic', margin:'0 0 0.4rem' },
  inspoRef:       { color:'#f0c040', fontSize:'0.82rem', fontWeight:'700', margin:0 },
  heroStats:      { display:'flex', justifyContent:'center', alignItems:'center',
                    gap:'1.5rem', flexWrap:'wrap', marginBottom:'1.25rem' },
  heroStat:       { display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' },
  heroStatNum:    { fontSize:'2rem', fontWeight:'700', lineHeight:'1' },
  heroStatLabel:  { color:'#c8a96e', fontSize:'0.75rem', textTransform:'uppercase',
                    letterSpacing:'0.08em' },
  heroStatDiv:    { width:'1px', height:'36px', background:'rgba(240,192,64,0.25)' },
  privacyNote:    { background:'rgba(33,150,243,0.08)', border:'1px solid rgba(33,150,243,0.25)',
                    borderRadius:'10px', padding:'8px 14px',
                    color:'#90caf9', fontSize:'0.82rem' },
  addBtn:         { padding:'12px 32px', borderRadius:'30px', border:'none',
                    background:'linear-gradient(135deg,#f0c040,#e0a800)',
                    color:'#1a0a00', cursor:'pointer', fontFamily:'inherit',
                    fontSize:'1.05rem', fontWeight:'700',
                    boxShadow:'0 4px 20px rgba(240,192,64,0.3)' },
  formWrap:       { maxWidth:'640px', margin:'0 auto 2rem',
                    background:'rgba(255,255,255,0.04)',
                    border:'1px solid rgba(240,192,64,0.25)',
                    borderRadius:'16px', padding:'1.75rem' },
  tabRow:         { display:'flex', gap:'10px', justifyContent:'center',
                    marginBottom:'1.5rem', flexWrap:'wrap' },
  tab:            { padding:'9px 22px', borderRadius:'22px',
                    border:'1px solid rgba(240,192,64,0.25)',
                    background:'transparent', color:'#c8a96e',
                    cursor:'pointer', fontFamily:'inherit', fontSize:'0.95rem',
                    transition:'all 0.2s' },
  tabOn:          { background:'rgba(240,192,64,0.15)', border:'1px solid #f0c040',
                    color:'#f0c040', fontWeight:'700' },
  searchWrap:     { position:'relative', maxWidth:'520px', margin:'0 auto 1.25rem',
                    display:'flex', alignItems:'center' },
  searchIcon:     { position:'absolute', left:'14px', fontSize:'1rem', pointerEvents:'none' },
  searchInput:    { width:'100%', padding:'11px 40px 11px 42px', borderRadius:'28px',
                    border:'1px solid rgba(240,192,64,0.35)',
                    background:'rgba(255,255,255,0.05)', color:'#f0e6d2',
                    fontFamily:"'Crimson Text',serif", fontSize:'1rem',
                    outline:'none', boxSizing:'border-box' },
  searchClear:    { position:'absolute', right:'14px', background:'none', border:'none',
                    color:'#c8a96e', cursor:'pointer', fontSize:'1rem' },
  catRow:         { display:'flex', flexWrap:'wrap', gap:'8px',
                    justifyContent:'center', marginBottom:'1.25rem' },
  catPill:        { padding:'5px 14px', borderRadius:'18px',
                    border:'1px solid rgba(240,192,64,0.25)',
                    background:'transparent', color:'#c8a96e',
                    cursor:'pointer', fontFamily:'inherit', fontSize:'0.82rem',
                    transition:'all 0.15s' },
  catPillOn:      { background:'rgba(240,192,64,0.15)', borderColor:'#f0c040',
                    color:'#f0c040', fontWeight:'700' },
  ctrlRow:        { display:'flex', justifyContent:'space-between', alignItems:'center',
                    maxWidth:'760px', margin:'0 auto 1.25rem',
                    flexWrap:'wrap', gap:'0.5rem', padding:'0 0.5rem' },
  resultCount:    { color:'#c8a96e', fontStyle:'italic', fontSize:'0.9rem' },
  sortBtn:        { padding:'4px 12px', borderRadius:'13px',
                    border:'1px solid rgba(240,192,64,0.25)',
                    background:'transparent', color:'#c8a96e',
                    cursor:'pointer', fontFamily:'inherit', fontSize:'0.8rem' },
  sortBtnOn:      { borderColor:'#f0c040', color:'#f0c040',
                    background:'rgba(240,192,64,0.1)' },
  cardList:       { display:'flex', flexDirection:'column', gap:'16px',
                    maxWidth:'760px', margin:'0 auto 2rem' },
  empty:          { textAlign:'center', color:'#c8a96e', padding:'4rem 1rem',
                    maxWidth:'480px', margin:'0 auto' },
  emptyTitle:     { color:'#f0e6d2', fontSize:'1.3rem', fontWeight:'700', marginBottom:'0.75rem' },
  emptySub:       { fontSize:'1rem', lineHeight:'1.7', marginBottom:'1.5rem' },
  clearBtn:       { background:'transparent', border:'none', color:'#f0c040',
                    cursor:'pointer', fontSize:'1rem', fontFamily:'inherit',
                    textDecoration:'underline' },
  testimonyBanner:{ maxWidth:'760px', margin:'0 auto 1.5rem', textAlign:'center',
                    padding:'1.25rem 1.5rem', borderRadius:'14px',
                    background:'rgba(76,175,80,0.08)',
                    border:'1px solid rgba(76,175,80,0.25)' },
  testimonyText:  { color:'#c8a96e', fontSize:'0.95rem', lineHeight:'1.7', margin:0 },
  bottomNote:     { maxWidth:'600px', margin:'0 auto 2rem', padding:'0 1rem' },
  toast:          { position:'fixed', bottom:'28px', left:'50%',
                    transform:'translateX(-50%)', background:'#2a1a08',
                    border:'1px solid #f0c040', color:'#f0e6d2',
                    padding:'12px 26px', borderRadius:'25px', zIndex:999,
                    fontSize:'1rem', whiteSpace:'nowrap',
                    animation:'fadeUp 0.2s ease',
                    boxShadow:'0 4px 20px rgba(0,0,0,0.5)' },
}