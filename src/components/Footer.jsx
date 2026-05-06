import React, { useState } from 'react'
import { Link } from 'react-router-dom'

/* ── ScriptureHub Footer ────────────────────────────────────────────
   Three-column layout:
     Left   — Brand & mission
     Centre — Navigation & resources
     Right  — Contact & newsletter
   Bottom bar — Copyright · Legal · System status
──────────────────────────────────────────────────────────────────── */
export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e) {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer style={styles.footer}>

      {/* ── Three-column grid ──────────────────────────────────────── */}
      <div style={styles.grid}>

        {/* LEFT — Brand & Mission */}
        <div style={styles.col}>
          <p style={styles.brandName}>✝ ScriptureHub</p>
          <p style={styles.tagline}>"Deepening your walk through knowledge and insight."</p>
          <p style={styles.bio}>
            ScriptureHub uses AI to bridge the gap between ancient Scripture
            and modern learning — making rigorous Bible study accessible to everyone.
          </p>
        </div>

        {/* CENTRE — Navigation & Resources */}
        <div style={styles.col}>
          <p style={styles.colHeading}>Explore</p>

          <p style={styles.subHeading}>Quick Links</p>
          <ul style={styles.linkList}>
            <li><Link to='/read'      style={styles.link}>📜 Read Scripture</Link></li>
            <li><Link to='/quizzes'   style={styles.link}>🏆 Quizzes</Link></li>
            <li><Link to='/ai-guide'  style={styles.link}>🤖 AI Guide</Link></li>
            <li><Link to='/dashboard' style={styles.link}>📊 Dashboard</Link></li>
          </ul>

          <p style={{ ...styles.subHeading, marginTop: '1rem' }}>Resources</p>
          <ul style={styles.linkList}>
            {/* These pages will be built in later tasks */}
            <li><Link to='/methodology' style={styles.link}>📚 Our Methodology</Link></li>
            <li><Link to='/offline-guide' style={styles.link}>📶 Offline Study Guide</Link></li>
          </ul>
        </div>

        {/* RIGHT — Contact & Newsletter */}
        <div style={styles.col}>
          <p style={styles.colHeading}>Connect</p>

          <ul style={styles.linkList}>
            <li>
              <a
                href='mailto:silasclergy697@gmail.com'
                style={styles.link}
              >
                ✉ silasclergy697@gmail.com
              </a>
            </li>
            <li>
              <a href='mailto:silasclergy697@gmail.com?subject=ScriptureHub Feedback' style={styles.link}>
                🚩 Report an Error
              </a>
            </li>
          </ul>

          {/* Daily Insight newsletter signup */}
          <p style={{ ...styles.subHeading, marginTop: '1.25rem' }}>Daily Insight Newsletter</p>
          {subscribed ? (
            <p style={styles.successMsg}>✅ You're subscribed! Check your inbox.</p>
          ) : (
            <form onSubmit={handleSubscribe} style={styles.form}>
              <input
                type='email'
                placeholder='Your email address'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={styles.input}
                aria-label='Email address for Daily Insight newsletter'
              />
              <button type='submit' style={styles.button}>Subscribe</button>
            </form>
          )}
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────────── */}
      <div style={styles.bottomBar}>
        <span>© 2026 ScriptureHub. All rights reserved.</span>

        <span style={styles.legalLinks}>
          <Link to='/privacy' style={styles.legalLink}>Privacy Policy</Link>
          <span style={styles.divider}>|</span>
          <Link to='/terms'   style={styles.legalLink}>Terms of Service</Link>
        </span>

        {/* System status indicator */}
        <span style={styles.status}>
          <span style={styles.statusDot} aria-hidden='true'>●</span>
          Database: Offline Ready
        </span>
      </div>

    </footer>
  )
}

// ── Styles ────────────────────────────────────────────────────────
const styles = {
  footer: {
    background: '#111827',          /* slightly darker than --navy for contrast */
    color: 'rgba(240,230,210,0.75)', /* dimmed parchment — readable, not glaring */
    fontFamily: 'Georgia, serif',
    padding: '3rem 1.5rem 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '2rem',
    maxWidth: '1100px',
    margin: '0 auto',
    paddingBottom: '2.5rem',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },

  // Left column
  brandName: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: 'var(--gold)',
    margin: '0 0 0.3rem',
    letterSpacing: '0.04em',
  },
  tagline: {
    fontStyle: 'italic',
    fontSize: '0.88rem',
    color: 'rgba(240,230,210,0.9)',
    margin: '0 0 0.5rem',
  },
  bio: {
    fontSize: '0.85rem',
    lineHeight: '1.6',
    margin: 0,
  },

  // Centre & right headings
  colHeading: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--gold)',
    margin: '0 0 0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  subHeading: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'rgba(240,230,210,0.55)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    margin: '0.4rem 0 0.25rem',
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  link: {
    color: 'rgba(240,230,210,0.8)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s',
  },

  // Newsletter form
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '0.25rem',
  },
  input: {
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    border: '1px solid rgba(240,230,210,0.25)',
    background: 'rgba(255,255,255,0.07)',
    color: 'var(--parchment)',
    fontSize: '0.875rem',
    fontFamily: 'Georgia, serif',
  },
  button: {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none',
    background: 'var(--gold)',
    color: '#1A2238',
    fontWeight: '700',
    fontSize: '0.875rem',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    alignSelf: 'flex-start',
  },
  successMsg: {
    fontSize: '0.875rem',
    color: '#6ee7b7',
    margin: '0.25rem 0 0',
  },

  // Bottom bar
  bottomBar: {
    borderTop: '1px solid rgba(240,230,210,0.12)',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '1rem 0 1.25rem',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
    fontSize: '0.8rem',
    color: 'rgba(240,230,210,0.5)',
  },
  legalLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  legalLink: {
    color: 'rgba(240,230,210,0.6)',
    textDecoration: 'none',
    fontSize: '0.8rem',
  },
  divider: {
    color: 'rgba(240,230,210,0.25)',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.78rem',
  },
  statusDot: {
    color: '#6ee7b7',   /* soft green — signals all-clear */
    fontSize: '0.65rem',
  },
}
