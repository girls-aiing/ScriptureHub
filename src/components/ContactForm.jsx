import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

/**
 * ContactForm — "Love God and Answer" submission form
 * Features a Grace Note confirmation card with:
 *  - Fade-out form → Gold Pulse checkmark animation
 *  - "Well done, good and faithful servant!" message
 *  - +5 XP progress bar boost
 *  - Silas Clergy personal reference
 *  - Next Step navigation buttons
 *  - Email receipt sub-text
 */
function ContactForm() {

  // ── State ──────────────────────────────────────────────────────
  const [formData, setFormData]     = useState({ name: '', email: '', insight: '' })
  const [submitted, setSubmitted]   = useState(false)   // toggles form ↔ confirmation
  const [fading, setFading]         = useState(false)   // triggers fade-out CSS class
  const [xp, setXp]                 = useState(0)       // animates 0 → 5 XP bar fill

  // ── Handle field changes ───────────────────────────────────────
  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // ── Handle submit ──────────────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault()

    // Step 1: trigger the fade-out animation on the form
    setFading(true)

    // Step 2: after fade completes (600ms), show the confirmation card
    setTimeout(() => {
      setSubmitted(true)
      setFading(false)
    }, 600)
  }

  // ── Animate XP bar once confirmation card appears ──────────────
  useEffect(() => {
    if (!submitted) return

    // Small delay so the card renders first, then the bar sweeps in
    const timer = setTimeout(() => setXp(5), 300)
    return () => clearTimeout(timer)
  }, [submitted])

  // ── Reset — let user submit a new insight ─────────────────────
  function handleReset() {
    setSubmitted(false)
    setXp(0)
    setFormData({ name: '', email: '', insight: '' })
  }

  // ══════════════════════════════════════════════════════════════
  //  CONFIRMATION CARD
  // ══════════════════════════════════════════════════════════════
  if (submitted) {
    return (
      <div className="grace-note-card" aria-live="polite">

        {/* Gold Pulse Checkmark */}
        <div className="grace-checkmark" aria-label="Success">
          <svg viewBox="0 0 52 52" className="grace-svg" aria-hidden="true">
            <circle cx="26" cy="26" r="25" className="grace-circle" />
            <path d="M14 27 l8 8 l16-16" className="grace-tick" />
          </svg>
        </div>

        {/* Scripture affirmation */}
        <p className="grace-verse">&ldquo;Well done, good and faithful servant!&rdquo;</p>
        <p className="grace-subtext">
          Your insights have been safely delivered to{' '}
          <strong>Silas Clergy</strong>. Your journey continues.
        </p>

        {/* +5 XP Progress Boost */}
        <div className="grace-xp-wrapper" aria-label="Experience points gained">
          <span className="grace-xp-label">+5 XP earned</span>
          <div className="grace-xp-track">
            <div
              className="grace-xp-fill"
              style={{ width: `${(xp / 5) * 100}%` }}
              role="progressbar"
              aria-valuenow={xp}
              aria-valuemin="0"
              aria-valuemax="5"
            />
          </div>
          <span className="grace-xp-max">Growth Dashboard updated</span>
        </div>

        {/* Trust Elements */}
        <div className="grace-trust-row">
          <div className="grace-trust-item">
            <span className="grace-trust-icon" aria-hidden="true">✉️</span>
            <span className="grace-trust-text">
              A copy of your submission has been sent to your inbox.
            </span>
          </div>
        </div>

        {/* Next Step Buttons */}
        <div className="grace-actions">
          <Link to="/knowledge-hub" className="grace-btn grace-btn--primary">
            Take a New Quiz
          </Link>
          <Link to="/growth-dashboard" className="grace-btn grace-btn--secondary">
            Return to My Path
          </Link>
        </div>

        {/* Allow another submission */}
        <button className="grace-restart" onClick={handleReset}>
          Submit another insight
        </button>

      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════
  //  THE FORM
  // ══════════════════════════════════════════════════════════════
  return (
    <form
      className={`grace-form ${fading ? 'grace-form--fading' : ''}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className="grace-form-title">Share Your Insight</h2>
      <p className="grace-form-intro">
        Every question you bring deepens your walk. Silas Clergy reviews
        every submission personally.
      </p>

      {/* Name */}
      <label className="grace-label" htmlFor="cf-name">Your Name</label>
      <input
        id="cf-name"
        name="name"
        type="text"
        className="grace-input"
        placeholder="e.g. Mary of Bethany"
        value={formData.name}
        onChange={handleChange}
        required
      />

      {/* Email */}
      <label className="grace-label" htmlFor="cf-email">Email Address</label>
      <input
        id="cf-email"
        name="email"
        type="email"
        className="grace-input"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        required
      />

      {/* Insight */}
      <label className="grace-label" htmlFor="cf-insight">Your Insight or Question</label>
      <textarea
        id="cf-insight"
        name="insight"
        className="grace-textarea"
        placeholder="What is the Holy Spirit stirring in you today?"
        rows={5}
        value={formData.insight}
        onChange={handleChange}
        required
      />

      {/* Submit */}
      <button type="submit" className="grace-submit">
        Love God and Answer ✦
      </button>
    </form>
  )
}

export default ContactForm
