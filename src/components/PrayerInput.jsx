import React, { useState } from 'react'

export default function PrayerInput({ onSubmit, isLoading }) {
  const [prayerText,        setPrayerText]        = useState('')
  const [selectedCategory,  setSelectedCategory]  = useState('strength')

  const categories = [
    { id: 'strength',    emoji: '💪', label: 'Strength',    desc: 'For courage & resilience' },
    { id: 'peace',       emoji: '☮️', label: 'Peace',       desc: 'For calm & serenity'      },
    { id: 'wisdom',      emoji: '🧠', label: 'Wisdom',      desc: 'For guidance & clarity'   },
    { id: 'forgiveness', emoji: '🕊️', label: 'Forgiveness', desc: 'For healing & grace'      },
    { id: 'grace',       emoji: '✨', label: 'Grace',       desc: "For God's mercy"           },
    { id: 'gods-will',   emoji: '🙏', label: "God's Will",  desc: 'For alignment & purpose'  },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!prayerText.trim()) {
      alert("Please share what's on your heart.")
      return
    }
    onSubmit({
      intention:  prayerText.trim(),
      category:   selectedCategory,
      timestamp:  new Date().toISOString(),
    })
  }

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .prayer-fade { animation: fadeIn 0.4s ease; }
      `}</style>

      <div style={styles.wrapper} className="prayer-fade">

        {/* ── Header ── */}
        <div style={styles.header}>
          <h1 style={styles.title}>🙏 Let's Pray Together</h1>
          <p style={styles.subtitle}>
            Share what's on your heart. Dr. Silas will guide you through a meaningful prayer.
          </p>
        </div>

        {/* ── Category Selector ── */}
        <div style={styles.section}>
          <label style={styles.label}>What would you like to pray about?</label>
          <div style={styles.categoryGrid}>
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                style={{
                  ...styles.categoryBtn,
                  ...(selectedCategory === cat.id ? styles.categoryBtnActive : {}),
                }}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <div style={styles.catEmoji}>{cat.emoji}</div>
                <div style={styles.catName}>{cat.label}</div>
                <div style={styles.catDesc}>{cat.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.section}>
            <label style={styles.label}>Tell me more (optional)</label>
            <textarea
              value={prayerText}
              onChange={e => setPrayerText(e.target.value)}
              placeholder="What's weighing on your heart? What do you need prayer for? Share as much or as little as you'd like…"
              style={styles.textarea}
              rows={6}
              disabled={isLoading}
            />
            <div style={styles.charCount}>{prayerText.length} characters</div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !prayerText.trim()}
            style={{
              ...styles.submitBtn,
              opacity: isLoading || !prayerText.trim() ? 0.5 : 1,
              cursor:  isLoading || !prayerText.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? '⏳ Connecting to Dr. Silas…' : '🙏 Begin Prayer with Dr. Silas'}
          </button>
        </form>

        {/* ── Info Box ── */}
        <div style={styles.infoBox}>
          <div style={styles.infoTitle}>💡 How This Works</div>
          <ul style={styles.infoList}>
            <li>Share your prayer intention or what's on your heart</li>
            <li>Dr. Silas will offer spiritual guidance and Scripture</li>
            <li>You'll have a meaningful conversation to deepen your prayer</li>
            <li>Your prayers are private and never stored</li>
          </ul>
        </div>

      </div>
    </div>
  )
}

const styles = {
  container: {
    background:  '#120a05',
    minHeight:   '100vh',
    padding:     '2rem 1rem',
    fontFamily:  "'Crimson Text', serif",
  },
  wrapper: {
    maxWidth: '700px',
    margin:   '0 auto',
  },
  header: {
    textAlign:    'center',
    marginBottom: '3rem',
  },
  title: {
    color:      '#f0c040',
    fontSize:   '2.2rem',
    fontWeight: '700',
    margin:     '0 0 0.75rem',
  },
  subtitle: {
    color:      '#c8a96e',
    fontSize:   '1rem',
    lineHeight: '1.7',
    margin:     0,
    fontStyle:  'italic',
  },
  section: {
    marginBottom: '2rem',
  },
  label: {
    display:      'block',
    color:        '#f0c040',
    fontSize:     '1rem',
    fontWeight:   '700',
    marginBottom: '1rem',
  },
  categoryGrid: {
    display:               'grid',
    gridTemplateColumns:   'repeat(auto-fit, minmax(110px, 1fr))',
    gap:                   '12px',
  },
  categoryBtn: {
    padding:    '1rem 0.75rem',
    background: 'rgba(255,255,255,0.04)',
    border:     '1px solid rgba(240,192,64,0.25)',
    borderRadius:'12px',
    color:      '#c8a96e',
    cursor:     'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
    textAlign:  'center',
  },
  categoryBtnActive: {
    background: 'rgba(240,192,64,0.15)',
    border:     '2px solid #f0c040',
    color:      '#f0c040',
  },
  catEmoji: { fontSize:'1.8rem', marginBottom:'0.5rem' },
  catName:  { fontSize:'0.9rem', fontWeight:'600', marginBottom:'0.25rem' },
  catDesc:  { fontSize:'0.7rem', opacity:0.8 },
  form: {
    marginBottom: '2rem',
  },
  textarea: {
    width:        '100%',
    padding:      '1rem',
    background:   '#1a0d04',
    border:       '1px solid rgba(240,192,64,0.3)',
    borderRadius: '10px',
    color:        '#f0e6d2',
    fontFamily:   "'Crimson Text', serif",
    fontSize:     '1rem',
    lineHeight:   '1.7',
    resize:       'vertical',
    boxSizing:    'border-box',
    outline:      'none',
  },
  charCount: {
    fontSize:  '0.8rem',
    color:     '#7a6040',
    marginTop: '0.5rem',
    textAlign: 'right',
  },
  submitBtn: {
    width:        '100%',
    padding:      '1rem 2rem',
    background:   'linear-gradient(135deg, #f0c040, #c8860a)',
    border:       'none',
    borderRadius: '25px',
    color:        '#1a0a00',
    fontSize:     '1rem',
    fontWeight:   '700',
    fontFamily:   'inherit',
    transition:   'opacity 0.2s',
  },
  infoBox: {
    background:   'rgba(240,192,64,0.08)',
    border:       '1px solid rgba(240,192,64,0.2)',
    borderRadius: '12px',
    padding:      '1.5rem',
    marginTop:    '1rem',
  },
  infoTitle: {
    color:        '#f0c040',
    fontSize:     '0.95rem',
    fontWeight:   '700',
    marginBottom: '0.75rem',
  },
  infoList: {
    color:       '#c8a96e',
    fontSize:    '0.9rem',
    lineHeight:  '1.8',
    margin:      0,
    paddingLeft: '1.5rem',
  },
}