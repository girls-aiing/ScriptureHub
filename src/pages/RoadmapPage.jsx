import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

/* ═══════════════════════════════════════════════════════════════
   RoadmapPage — The Path Ahead
   Job: Build excitement and show ScriptureHub is a living,
   growing platform with a clear, trustworthy future.
═══════════════════════════════════════════════════════════════ */

/* ── Milestone data — easy to update later ── */
const MILESTONES = [
  {
    quarter:     'Q3 2026',
    label:       'Community Study Groups',
    icon:        '👥',
    status:      'In Development',
    statusColor: '#f59e0b',
    body:
      'We are building a "Group Challenge" mode where Sunday School classes and small groups can compete in real-time quizzes and share their monthly progress reports. Faith grows stronger in community.',
    highlights: [
      'Real-time multiplayer quiz battles',
      'Shared Monthly Report for your group',
      'Sunday School & small group leaderboards',
    ],
  },
  {
    quarter:     'Q4 2026',
    label:       'Multi-Lingual Expansion',
    icon:        '🌍',
    status:      'Planned',
    statusColor: '#65a30d',
    body:
      'To serve the global church, we are translating our 1,000+ quizzes and AI training sets into Spanish, French, and Portuguese — making ScriptureHub a truly international sanctuary.',
    highlights: [
      'Spanish translation — full quiz library',
      'French & Portuguese AI training sets',
      'Localised Daily Discoveries content',
    ],
  },
  {
    quarter:     'Project 2027',
    label:       'Audio Insights — Secret Spotlights',
    icon:        '🎧',
    status:      'Visionary',
    statusColor: '#8b5cf6',
    body:
      'AI-generated "Secret Spotlights" — 30-second audio nuggets explaining the daily Bible secret. Designed for your morning commute and fully compatible with Offline Mode.',
    highlights: [
      '30-second AI-narrated audio episodes',
      'Syncs with Daily Discoveries feed',
      'Fully available in Offline Mode',
    ],
  },
]

export default function RoadmapPage() {
  return (
    <>
      <Navbar />

      <main className="roadmap-page">

        {/* ── HERO ────────────────────────────────────────── */}
        <section className="roadmap-hero">
          <div className="roadmap-hero__inner">
            <span className="roadmap-hero__eyebrow">The Path Ahead</span>
            <h1 className="roadmap-hero__title">Our Future: The 2026 Roadmap</h1>
            <p className="roadmap-hero__subtitle">
              ScriptureHub is just the beginning of a larger movement to make
              the Word of God the most engaging part of a believer&#39;s day.
              We are constantly innovating to ensure your path remains bright.
            </p>
          </div>
        </section>

        {/* ── PROGRESS TRACK ──────────────────────────────── */}
        <section className="roadmap-track-section">
          <div className="roadmap-track-inner">

            {/* Vertical timeline line */}
            <div className="roadmap-line" aria-hidden="true" />

            {MILESTONES.map((milestone, index) => (
              <article
                key={milestone.quarter}
                className="milestone-card"
                style={{ '--accent': milestone.statusColor }}
              >

                {/* Timeline dot */}
                <div
                  className="milestone-dot"
                  aria-hidden="true"
                  style={{ background: milestone.statusColor }}
                />

                {/* Card content */}
                <div className="milestone-content">

                  {/* Header row */}
                  <div className="milestone-header">
                    <span className="milestone-icon" aria-hidden="true">
                      {milestone.icon}
                    </span>
                    <div>
                      <div className="milestone-meta">
                        <span
                          className="milestone-quarter"
                          style={{ color: milestone.statusColor }}
                        >
                          {milestone.quarter}
                        </span>
                        <span
                          className="milestone-status"
                          style={{
                            background: `${milestone.statusColor}1a`,
                            color:      milestone.statusColor,
                            border:     `1px solid ${milestone.statusColor}55`,
                          }}
                        >
                          {milestone.status}
                        </span>
                      </div>
                      <h2 className="milestone-title">{milestone.label}</h2>
                    </div>
                  </div>

                  {/* Body */}
                  <p className="milestone-body">{milestone.body}</p>

                  {/* Highlights */}
                  <ul className="milestone-highlights">
                    {milestone.highlights.map((point) => (
                      <li key={point} className="milestone-highlight-item">
                        <span
                          className="milestone-bullet"
                          style={{ background: milestone.statusColor }}
                          aria-hidden="true"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>

                </div>
              </article>
            ))}

          </div>
        </section>

        {/* ── BE PART OF THE FUTURE ───────────────────────── */}
        <section className="roadmap-vision">
          <div className="roadmap-vision__inner">
            <h2 className="roadmap-vision__title">Be Part of the Future</h2>
            <p className="roadmap-vision__body">
              We invite you to grow with us. By using ScriptureHub daily and
              sharing your results, you help us refine our AI models and expand
              our Scripture library. Together, we are building the world&#39;s
              most advanced digital sanctuary — one discovery at a time.
            </p>

            {/* Stats row */}
            <div className="roadmap-stats">
              {[
                { value: '1,000+', label: 'Quizzes in Library'   },
                { value: '3',      label: 'Languages Coming 2026' },
                { value: '48 hrs', label: 'Average Response Time' },
                { value: '∞',      label: 'Your Potential Growth' },
              ].map((stat) => (
                <div key={stat.label} className="roadmap-stat">
                  <span className="roadmap-stat__value">{stat.value}</span>
                  <span className="roadmap-stat__label">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="roadmap-ctas">
              <Link to="/knowledge-hub" className="btn btn--primary">
                Start Your Quiz Journey →
              </Link>
              <Link to="/connect" className="btn btn--outline-gold">
                Submit a Bible Secret
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* ── PAGE-SCOPED STYLES ─────────────────────────────── */}
      <style>{`

        /* ── Page wrapper ── */
        .roadmap-page {
          background: var(--color-bg, #0d1117);
          color: var(--color-text, #e6edf3);
          min-height: 100vh;
          font-family: var(--font-body, 'Georgia', serif);
        }

        /* ── Hero ── */
        .roadmap-hero {
          background: linear-gradient(135deg, #1a2332 0%, #0d1117 50%, #1a2d1a 100%);
          padding: 5rem 1.5rem 4rem;
          text-align: center;
          border-bottom: 1px solid rgba(101,163,13,0.2);
        }
        .roadmap-hero__inner {
          max-width: 700px;
          margin: 0 auto;
        }
        .roadmap-hero__eyebrow {
          display: inline-block;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #65a30d;
          margin-bottom: 0.75rem;
        }
        .roadmap-hero__title {
          font-family: var(--font-heading, 'Georgia', serif);
          font-size: clamp(1.9rem, 5vw, 3rem);
          font-weight: 700;
          color: #f0e6c8;
          margin: 0 0 1rem;
          line-height: 1.2;
        }
        .roadmap-hero__subtitle {
          font-size: 1.05rem;
          color: #8b9ab0;
          line-height: 1.75;
          max-width: 580px;
          margin: 0 auto;
        }

        /* ── Timeline track section ── */
        .roadmap-track-section {
          max-width: 860px;
          margin: 4rem auto;
          padding: 0 1.5rem;
        }
        .roadmap-track-inner {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        /* Vertical line running through all milestones */
        .roadmap-line {
          position: absolute;
          left: 1.4rem;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(
            to bottom,
            #f59e0b 0%,
            #65a30d 45%,
            #8b5cf6 100%
          );
          opacity: 0.35;
          border-radius: 2px;
        }

        /* ── Individual milestone card ── */
        .milestone-card {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          position: relative;
          padding-left: 0.5rem;
        }

        /* Timeline dot */
        .milestone-dot {
          min-width: 1.9rem;
          height: 1.9rem;
          border-radius: 50%;
          border: 3px solid #0d1117;
          box-shadow: 0 0 0 2px currentColor;
          margin-top: 0.35rem;
          z-index: 1;
          flex-shrink: 0;
        }

        /* Card content box */
        .milestone-content {
          background: #161b22;
          border: 1px solid rgba(255,255,255,0.06);
          border-left: 3px solid var(--accent, #65a30d);
          border-radius: 12px;
          padding: 1.75rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: border-color 0.2s;
        }
        .milestone-content:hover {
          border-color: var(--accent, #65a30d);
          background: #1a2030;
        }

        /* Header row inside card */
        .milestone-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        .milestone-icon {
          font-size: 2rem;
          line-height: 1;
          margin-top: 0.1rem;
        }
        .milestone-meta {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
          margin-bottom: 0.3rem;
        }
        .milestone-quarter {
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .milestone-status {
          font-size: 0.72rem;
          font-weight: 600;
          border-radius: 20px;
          padding: 0.18rem 0.65rem;
          letter-spacing: 0.04em;
        }
        .milestone-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #f0e6c8;
          margin: 0;
          line-height: 1.3;
        }

        /* Body text */
        .milestone-body {
          font-size: 0.95rem;
          color: #8b9ab0;
          line-height: 1.7;
          margin: 0;
        }

        /* Highlights list */
        .milestone-highlights {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .milestone-highlight-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.88rem;
          color: #c9d1d9;
        }
        .milestone-bullet {
          display: inline-block;
          width: 0.45rem;
          height: 0.45rem;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* ── Vision section ── */
        .roadmap-vision {
          background: linear-gradient(135deg, #1a2d1a 0%, #1a2332 100%);
          border-top: 1px solid rgba(101,163,13,0.2);
          padding: 5rem 1.5rem;
          text-align: center;
          margin-top: 2rem;
        }
        .roadmap-vision__inner {
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }
        .roadmap-vision__title {
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          font-weight: 700;
          color: #f0e6c8;
          margin: 0;
        }
        .roadmap-vision__body {
          font-size: 1rem;
          color: #8b9ab0;
          line-height: 1.8;
          max-width: 600px;
          margin: 0;
        }

        /* Stats row */
        .roadmap-stats {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1.5rem 2.5rem;
          width: 100%;
        }
        .roadmap-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }
        .roadmap-stat__value {
          font-size: 2rem;
          font-weight: 800;
          color: #65a30d;
          line-height: 1;
        }
        .roadmap-stat__label {
          font-size: 0.78rem;
          color: #8b9ab0;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* CTA row */
        .roadmap-ctas {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
        }

        /* ── Shared button styles ── */
        .btn {
          display: inline-block;
          border-radius: 8px;
          font-size: 0.92rem;
          font-weight: 600;
          padding: 0.75rem 1.6rem;
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
        .btn--outline-gold {
          background: transparent;
          border: 2px solid #d4b896;
          color: #d4b896;
        }
        .btn--outline-gold:hover {
          background: rgba(212,184,150,0.1);
        }

        /* ── Responsive tweaks ── */
        @media (max-width: 600px) {
          .roadmap-line { left: 0.9rem; }
          .milestone-card { padding-left: 0; }
          .milestone-dot { min-width: 1.5rem; height: 1.5rem; }
          .milestone-content { padding: 1.25rem; }
        }

      `}</style>
    </>
  )
}
