import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

/* ═══════════════════════════════════════════════════════════════
   ConnectPage — The Interaction Hub
   Job: Give believers a professional, structured way to reach
   out to the team or contribute content to the database.
═══════════════════════════════════════════════════════════════ */

export default function ConnectPage() {

  /* ── Local state for the submission form feedback ── */
  const [submitted, setSubmitted] = useState(false)
  const [factText, setFactText]   = useState('')
  const [name, setName]           = useState('')

  /* Simulate a form submission (no database — static site) */
  function handleFactSubmit(e) {
    e.preventDefault()
    if (factText.trim() && name.trim()) {
      setSubmitted(true)
    }
  }

  function handleReset() {
    setSubmitted(false)
    setFactText('')
    setName('')
  }

  return (
    <>
      <Navbar />

      <main className="connect-page">

        {/* ── HERO BANNER ─────────────────────────────────── */}
        <section className="connect-hero">
          <div className="connect-hero__inner">
            <span className="connect-hero__eyebrow">Community &amp; Contribution</span>
            <h1 className="connect-hero__title">Connect &amp; Contribute</h1>
            <p className="connect-hero__subtitle">
              Your voice is an essential part of the ScriptureHub journey.
              Whether you have a theological question, need technical support,
              or want to submit a hidden gem from your own studies — we are listening.
            </p>
          </div>
        </section>

        {/* ── MAIN TWO-COLUMN LAYOUT ───────────────────────── */}
        <div className="connect-body">

          {/* ══ LEFT COLUMN — Reach Out ══ */}
          <section className="connect-card reach-out-card">

            {/* Card header */}
            <div className="connect-card__header">
              <span className="connect-card__icon" aria-hidden="true">✉️</span>
              <h2 className="connect-card__title">Join the Conversation</h2>
            </div>

            <p className="connect-card__body">
              Have a theological question for our council? Need help with Offline Mode?
              Want to suggest a <em>"Did You Know"</em> secret? Reach out and a member
              of our team will personally respond.
            </p>

            {/* ── Pastor / Ministry contact ── */}
            <div className="contact-block">
              <h3 className="contact-block__name">Reach Out to Silas Clergy</h3>
              <p className="contact-block__role">
                Pastoral inquiries · Ministry platform guidance · Academic questions
              </p>

              <a
                href="mailto:silasclergy697@gmail.com"
                className="contact-block__email"
                aria-label="Send an email to Silas Clergy"
              >
                ✉ silasclergy697@gmail.com
              </a>

              <div className="contact-block__response">
                <span className="response-badge">⏱ Response Time</span>
                <span className="response-text">
                  We strive to reply to all spiritual and academic inquiries
                  within <strong>48 hours</strong>.
                </span>
              </div>
            </div>

            {/* ── Quick reason chips ── */}
            <div className="reason-chips">
              {[
                '📖 Theological Question',
                '🛠 Technical Support',
                '🤝 Ministry Partnership',
                '💡 Feature Suggestion',
              ].map((reason) => (
                <span key={reason} className="reason-chip">{reason}</span>
              ))}
            </div>

          </section>

          {/* ══ RIGHT COLUMN — Submit a Bible Secret ══ */}
          <section className="connect-card submit-card">

            <div className="connect-card__header">
              <span className="connect-card__icon" aria-hidden="true">📜</span>
              <h2 className="connect-card__title">Submit a Bible Secret</h2>
            </div>

            <p className="connect-card__body">
              Have you uncovered a fascinating historical or cultural fact in your
              own studies? Submit it to our <strong>Content Council</strong> for
              verification. If approved, your secret will be featured in our
              <em> Daily Discoveries</em> — with a credit to your profile.
            </p>

            {/* ── Verification process steps ── */}
            <ol className="verification-steps">
              <li>
                <span className="step-num">1</span>
                <span>You submit your discovery below.</span>
              </li>
              <li>
                <span className="step-num">2</span>
                <span>Our Content Council verifies the scholarship.</span>
              </li>
              <li>
                <span className="step-num">3</span>
                <span>Approved secrets go live in Daily Discoveries.</span>
              </li>
              <li>
                <span className="step-num">4</span>
                <span>Your profile receives a contributor credit. 🏆</span>
              </li>
            </ol>

            {/* ── Submission form (static — simulated) ── */}
            {submitted ? (
              <div className="submit-success" role="alert">
                <span className="submit-success__icon">🎉</span>
                <h3>Thank You, {name}!</h3>
                <p>
                  Your discovery has been received by the Content Council.
                  We will review it and notify you within 5–7 business days.
                </p>
                <button
                  className="btn btn--secondary"
                  onClick={handleReset}
                >
                  Submit Another Secret
                </button>
              </div>
            ) : (
              <form
                className="fact-form"
                onSubmit={handleFactSubmit}
                aria-label="Submit a Bible Secret form"
              >
                <label className="fact-form__label" htmlFor="contributor-name">
                  Your Name / Profile Handle
                </label>
                <input
                  id="contributor-name"
                  className="fact-form__input"
                  type="text"
                  placeholder="e.g. Grace Walker"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <label className="fact-form__label" htmlFor="fact-text">
                  Your Bible Discovery
                </label>
                <textarea
                  id="fact-text"
                  className="fact-form__textarea"
                  rows={5}
                  placeholder="Share the fascinating historical, cultural, or linguistic fact you discovered — and include any Scripture reference."
                  value={factText}
                  onChange={(e) => setFactText(e.target.value)}
                  required
                />

                <p className="fact-form__disclaimer">
                  By submitting, you agree that ScriptureHub may publish this
                  content (with your credit) after editorial verification.
                </p>

                <button type="submit" className="btn btn--primary">
                  Submit for Verification →
                </button>
              </form>
            )}

          </section>

        </div>{/* end connect-body */}

        {/* ── BOTTOM CTA STRIP ────────────────────────────── */}
        <section className="connect-cta">
          <p className="connect-cta__text">
            Ready to see what is coming next for ScriptureHub?
          </p>
          <Link to="/roadmap" className="btn btn--outline-light">
            View the 2026 Roadmap →
          </Link>
        </section>

      </main>

      <Footer />

      {/* ── PAGE-SCOPED STYLES ─────────────────────────────── */}
      <style>{`

        /* ── Page wrapper ── */
        .connect-page {
          background: var(--color-bg, #0d1117);
          color: var(--color-text, #e6edf3);
          min-height: 100vh;
          font-family: var(--font-body, 'Georgia', serif);
        }

        /* ── Hero ── */
        .connect-hero {
          background: linear-gradient(135deg, #1a2332 0%, #0d1117 60%, #1a2d1a 100%);
          padding: 5rem 1.5rem 4rem;
          text-align: center;
          border-bottom: 1px solid rgba(101,163,13,0.2);
        }
        .connect-hero__inner {
          max-width: 720px;
          margin: 0 auto;
        }
        .connect-hero__eyebrow {
          display: inline-block;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #65a30d;
          margin-bottom: 0.75rem;
        }
        .connect-hero__title {
          font-family: var(--font-heading, 'Georgia', serif);
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 700;
          color: #f0e6c8;
          margin: 0 0 1rem;
          line-height: 1.15;
        }
        .connect-hero__subtitle {
          font-size: 1.05rem;
          color: #8b9ab0;
          line-height: 1.75;
          max-width: 580px;
          margin: 0 auto;
        }

        /* ── Two-column body ── */
        .connect-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          max-width: 1100px;
          margin: 3rem auto;
          padding: 0 1.5rem;
        }
        @media (max-width: 768px) {
          .connect-body {
            grid-template-columns: 1fr;
          }
        }

        /* ── Card base ── */
        .connect-card {
          background: #161b22;
          border: 1px solid rgba(101,163,13,0.18);
          border-radius: 14px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .connect-card__header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .connect-card__icon {
          font-size: 1.8rem;
          line-height: 1;
        }
        .connect-card__title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #f0e6c8;
          margin: 0;
        }
        .connect-card__body {
          font-size: 0.97rem;
          color: #8b9ab0;
          line-height: 1.7;
          margin: 0;
        }
        .connect-card__body em,
        .connect-card__body strong {
          color: #d4b896;
        }

        /* ── Contact block ── */
        .contact-block {
          background: #0d1117;
          border: 1px solid rgba(101,163,13,0.25);
          border-radius: 10px;
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .contact-block__name {
          font-size: 1.05rem;
          font-weight: 700;
          color: #f0e6c8;
          margin: 0;
        }
        .contact-block__role {
          font-size: 0.82rem;
          color: #65a30d;
          letter-spacing: 0.04em;
          margin: 0;
        }
        .contact-block__email {
          display: inline-block;
          margin-top: 0.25rem;
          color: #58a6ff;
          font-size: 0.97rem;
          font-weight: 600;
          text-decoration: none;
          word-break: break-all;
        }
        .contact-block__email:hover {
          text-decoration: underline;
          color: #79c0ff;
        }
        .contact-block__response {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }
        .response-badge {
          background: rgba(101,163,13,0.15);
          color: #65a30d;
          border: 1px solid rgba(101,163,13,0.35);
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.2rem 0.65rem;
          white-space: nowrap;
        }
        .response-text {
          font-size: 0.85rem;
          color: #8b9ab0;
          line-height: 1.55;
        }
        .response-text strong {
          color: #d4b896;
        }

        /* ── Reason chips ── */
        .reason-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }
        .reason-chip {
          background: rgba(88,166,255,0.08);
          border: 1px solid rgba(88,166,255,0.2);
          color: #58a6ff;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 500;
          padding: 0.3rem 0.8rem;
        }

        /* ── Verification steps ── */
        .verification-steps {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .verification-steps li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.9rem;
          color: #8b9ab0;
          line-height: 1.5;
        }
        .step-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 1.6rem;
          height: 1.6rem;
          border-radius: 50%;
          background: rgba(101,163,13,0.15);
          border: 1px solid rgba(101,163,13,0.4);
          color: #65a30d;
          font-size: 0.75rem;
          font-weight: 700;
        }

        /* ── Submission form ── */
        .fact-form {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .fact-form__label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #d4b896;
          margin-bottom: -0.4rem;
        }
        .fact-form__input,
        .fact-form__textarea {
          background: #0d1117;
          border: 1px solid rgba(101,163,13,0.3);
          border-radius: 8px;
          color: #e6edf3;
          font-size: 0.93rem;
          padding: 0.65rem 0.9rem;
          font-family: inherit;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s;
        }
        .fact-form__input:focus,
        .fact-form__textarea:focus {
          border-color: #65a30d;
        }
        .fact-form__textarea {
          min-height: 110px;
        }
        .fact-form__disclaimer {
          font-size: 0.78rem;
          color: #555f6e;
          line-height: 1.5;
          margin: 0;
        }

        /* ── Buttons ── */
        .btn {
          display: inline-block;
          border-radius: 8px;
          font-size: 0.92rem;
          font-weight: 600;
          padding: 0.7rem 1.4rem;
          cursor: pointer;
          text-decoration: none;
          text-align: center;
          transition: opacity 0.2s, background 0.2s;
          border: none;
          font-family: inherit;
        }
        .btn--primary {
          background: #65a30d;
          color: #fff;
        }
        .btn--primary:hover { opacity: 0.88; }
        .btn--secondary {
          background: rgba(101,163,13,0.15);
          border: 1px solid rgba(101,163,13,0.4);
          color: #65a30d;
        }
        .btn--secondary:hover { background: rgba(101,163,13,0.25); }
        .btn--outline-light {
          background: transparent;
          border: 2px solid #f0e6c8;
          color: #f0e6c8;
          padding: 0.75rem 1.75rem;
        }
        .btn--outline-light:hover {
          background: rgba(240,230,200,0.1);
        }

        /* ── Success state ── */
        .submit-success {
          background: rgba(101,163,13,0.08);
          border: 1px solid rgba(101,163,13,0.3);
          border-radius: 10px;
          padding: 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .submit-success__icon {
          font-size: 2.5rem;
        }
        .submit-success h3 {
          color: #f0e6c8;
          margin: 0;
          font-size: 1.15rem;
        }
        .submit-success p {
          color: #8b9ab0;
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0;
          max-width: 340px;
        }

        /* ── Bottom CTA strip ── */
        .connect-cta {
          background: linear-gradient(135deg, #1a2d1a 0%, #1a2332 100%);
          border-top: 1px solid rgba(101,163,13,0.2);
          text-align: center;
          padding: 3.5rem 1.5rem;
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }
        .connect-cta__text {
          font-size: 1.05rem;
          color: #8b9ab0;
          margin: 0;
        }

      `}</style>
    </>
  )
}
