import React, { useState } from 'react'
import { Link } from 'react-router-dom'

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

      {/* ── Three-column grid ── */}
      <div style={styles.grid}>

        {/* LEFT — Brand & Mission */}
        <div style={styles.col}>
          <span style={styles.brand}>✝ ScriptureHub</span>
          <span style={styles.tagline}>
            "Deepening your walk through knowledge and insight."
          </span>
          <p style={styles.bio}>
            ScriptureHub is a faith-driven platform built to make deep,
            scholarly Bible study accessible to everyone — from new believers
            to seasoned theologians. We combine the timeless truth of Scripture
            with modern AI technology to help you study smarter, grow faster,
            and walk closer with God every single day.
          </p>
          <p style={styles.bio}>
            Whether you are exploring the Bible for the first time, preparing
            a sermon, or searching for answers to life's hardest questions —
            ScriptureHub is your trusted companion for the journey.
          </p>
          <p style={styles.bio}>
            Every feature on this platform was designed with one goal in mind:
            to bring you closer to the Word of God. We believe that knowledge
            of Scripture transforms lives, strengthens faith, and builds
            communities that reflect the love of Christ. 🙏
          </p>
        </div>

        {/* CENTRE — Quick Links & Scripture of the Day */}
        <div style={styles.col}>
          <p style={styles.colHeading}>Explore</p>

          <p style={styles.subHeading}>Quick Links</p>
          <ul style={styles.linkList}>
            <li><Link to='/bible'        style={styles.link}>📖 Bible Reader</Link></li>
            <li><Link to='/quizzes'      style={styles.link}>🏆 Knowledge Hub</Link></li>
            <li><Link to='/did-you-know' style={styles.link}>🔍 Daily Secrets</Link></li>
            <li><Link to='/ai'           style={styles.link}>🤖 AI Theological Assistant</Link></li>
            <li><Link to='/dashboard'    style={styles.link}>📈 Growth Dashboard</Link></li>
          </ul>

          <p style={{ ...styles.subHeading, marginTop: '1.25rem' }}>
            Scripture of the Day
          </p>
          <div style={styles.verseBox}>
            <p style={styles.verseText}>
              "Your word is a lamp for my feet, a light on my path."
            </p>
            <p style={styles.verseRef}>— Psalm 119:105</p>
          </div>

          <p style={{ ...styles.subHeading, marginTop: '1.25rem' }}>
            Our Promise
          </p>
          <p style={styles.promise}>
            We are committed to accuracy, reverence, and accessibility.
            Every quiz, every insight, and every AI response is grounded
            in Scripture and reviewed for theological integrity.
          </p>
        </div>

        {/* RIGHT — Contact & Newsletter */}
        <div style={styles.col}>
          <p style={styles.colHeading}>Connect</p>

          <p style={styles.subHeading}>Contact Us</p>
          <ul style={styles.linkList}>
            <li>
              <a href='mailto:silasclergy697@gmail.com' style={styles.link}>
                ✉ silasclergy697@gmail.com
              </a>
            </li>
            <li>
              <a
                href='mailto:silasclergy697@gmail.com?subject=ScriptureHub Feedback'
                style={styles.link}
              >
                🚩 Report an Error
              </a>
            </li>
            <li>
              <a
                href='mailto:silasclergy697@gmail.com?subject=ScriptureHub Partnership'
                style={styles.link}
              >
                🤝 Partner With Us
              </a>
            </li>
          </ul>

          <p style={{ ...styles.subHeading, marginTop: '1.25rem' }}>
            Daily Insight Newsletter
          </p>
          <p style={styles.newsletterDesc}>
            Get a daily biblical insight, a featured quiz, and a verse of
            encouragement delivered straight to your inbox every morning.
          </p>
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
                aria-label='Email for Daily Insight newsletter'
              />
              <button type='submit' style={styles.button}>Subscribe</button>
            </form>
          )}

          <p style={{ ...styles.subHeading, marginTop: '1.25rem' }}>
            Built With Faith
          </p>
          <p style={styles.promise}>
            ScriptureHub was created by Silas Clergy with a heart for the
            Church and a passion for making God's Word the most accessible
            book on earth. Thank you for being part of this mission. ✝
          </p>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div style={styles.bottomBar}>
        <span>© 2026 ScriptureHub · All rights reserved. · Created by Silas Clergy</span>

        <span style={styles.legalLinks}>
          <Link to='/privacy' style={styles.legalLink}>Privacy Policy</Link>
          <span style={styles.divider}>|</span>
          <Link to='/terms' style={styles.legalLink}>Terms of Service</Link>
        </span>

        <span style={styles.status}>
          <span style={styles.statusDot}>●</span>
          Database: Offline Ready
        </span>
      </div>

    </footer>
  )
}

const styles = {
  footer: {
    background: '#111827',
    color: 'rgba(240,230,210,0.75)',
    fontFamily: 'Georgia, serif',
    padding: '3rem 1.5rem 0',
    borderTop: '3px solid #c9a84c',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
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
  brand: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#c9a84c',
    letterSpacing: '0.04em',
    marginBottom: '0.2rem',
  },
  tagline: {
    fontStyle: 'italic',
    fontSize: '0.88rem',
    color: 'rgba(240,230,210,0.9)',
    marginBottom: '0.5rem',
  },
  bio: {
    fontSize: '0.83rem',
    lineHeight: '1.75',
    color: 'rgba(240,230,210,0.65)',
    margin: '0.2rem 0 0',
  },
  colHeading: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#c9a84c',
    margin: '0 0 0.4rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  subHeading: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: 'rgba(240,230,210,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    margin: '0.3rem 0 0.2rem',
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
  },
  link: {
    color: 'rgba(240,230,210,0.8)',
    textDecoration: 'none',
    fontSize: '0.88rem',
    transition: 'color 0.2s',
  },
  verseBox: {
    background: 'rgba(201,168,76,0.08)',
    border: '1px solid rgba(201,168,76,0.25)',
    borderLeft: '3px solid #c9a84c',
    borderRadius: '0 8px 8px 0',
    padding: '0.75rem 1rem',
    marginTop: '0.25rem',
  },
  verseText: {
    fontSize: '0.85rem',
    fontStyle: 'italic',
    color: 'rgba(240,230,210,0.85)',
    lineHeight: '1.65',
    margin: '0 0 0.3rem',
  },
  verseRef: {
    fontSize: '0.78rem',
    color: '#c9a84c',
    fontWeight: '700',
    margin: 0,
  },
  promise: {
    fontSize: '0.82rem',
    lineHeight: '1.7',
    color: 'rgba(240,230,210,0.6)',
    margin: '0.2rem 0 0',
  },
  newsletterDesc: {
    fontSize: '0.82rem',
    lineHeight: '1.65',
    color: 'rgba(240,230,210,0.6)',
    margin: '0.2rem 0 0.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '0.25rem',
  },
  input: {
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid rgba(240,230,210,0.2)',
    background: 'rgba(255,255,255,0.06)',
    color: '#f0e6d2',
    fontSize: '0.85rem',
    fontFamily: 'Georgia, serif',
  },
  button: {
    padding: '0.5rem 1.2rem',
    borderRadius: '6px',
    border: 'none',
    background: '#c9a84c',
    color: '#111827',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    alignSelf: 'flex-start',
    transition: 'background 0.2s',
  },
  successMsg: {
    fontSize: '0.85rem',
    color: '#6ee7b7',
    margin: '0.25rem 0 0',
  },
  bottomBar: {
    borderTop: '1px solid rgba(240,230,210,0.1)',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '1rem 0 1.25rem',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem',
    fontSize: '0.75rem',
    color: 'rgba(240,230,210,0.45)',
  },
  legalLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  legalLink: {
    color: 'rgba(240,230,210,0.5)',
    textDecoration: 'none',
    fontSize: '0.75rem',
  },
  divider: {
    color: 'rgba(240,230,210,0.2)',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.75rem',
  },
  statusDot: {
    color: '#6ee7b7',
    fontSize: '0.6rem',
  },
}
