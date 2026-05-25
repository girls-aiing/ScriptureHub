import React from 'react'
import { Link } from 'react-router-dom'

/* ═══════════════════════════════════════════════════════════════
   AboutPage — The Clergy & Council + The Impact Report
   Two-section page:
     1. Meet the team who oversee the AI and quizzes
     2. Show measurable proof that the platform creates growth
═══════════════════════════════════════════════════════════════ */

// ── Team member data — easy to update without touching JSX ──
const councilMembers = [
  {
    id: 1,
    name: 'Silas Clergy',
    role: 'Founder & Lead Visionary',
    icon: '✝️',
    bio: 'With over 15 years of pastoral experience, Silas ensures the platform remains a "Digital Sanctuary" where the joy of the Lord meets the rigors of study. He reviews every major feature before it goes live.',
  },
  {
    id: 2,
    name: 'The Content Curators',
    role: 'Biblical Research Team',
    icon: '📖',
    bio: 'A team of three dedicated biblical researchers who manually verify each of the 1,000+ quizzes for historical accuracy and scriptural alignment — because truth is not a first draft.',
  },
  {
    id: 3,
    name: 'The AI Ethics Board',
    role: 'Technology & Theology Oversight',
    icon: '⚖️',
    bio: 'Two software engineers and a professor of theology who calibrate our Scholarly AI to ensure it provides non-judgmental, source-backed answers rooted in all 66 books of the Bible.',
  },
]

// ── Impact statistics — the numbers that prove results ──
const impactStats = [
  {
    id: 1,
    stat: '42%',
    label: 'Knowledge Retention Increase',
    detail:
      'Users who engage with at least 3 quizzes per week show a 42% increase in their ability to recall historical context compared to traditional reading alone.',
    icon: '📈',
  },
  {
    id: 2,
    stat: '78%',
    label: 'Offline Study Consistency',
    detail:
      '78% of our active users utilise Offline Mode to maintain their daily study habits during commutes or in low-connectivity areas.',
    icon: '📡',
  },
  {
    id: 3,
    stat: '12,000+',
    label: 'Monthly AI Theological Inquiries',
    detail:
      'Our AI resolves over 12,000 theological inquiries every month, with a user-reported Clarity Rating of 4.9 out of 5 stars.',
    icon: '🤖',
  },
]

// ── What users see inside their personal Growth Dashboard ──
const dashboardFeatures = [
  {
    id: 1,
    title: 'Scriptural Breadth Heat Map',
    description:
      'A visual map showing which books of the Bible you have mastered and where new territory awaits.',
    icon: '🗺️',
  },
  {
    id: 2,
    title: 'Accuracy Trend Graph',
    description:
      'A 30-day graph tracking how your quiz scores improve over time — progress you can actually see.',
    icon: '📊',
  },
  {
    id: 3,
    title: 'Discovery Milestones',
    description:
      'A running tally of every "Did You Know" secret you have unlocked — your growing library of biblical insight.',
    icon: '🏆',
  },
]

export default function AboutPage({ isPublicView = false }) {
  return (
    <div className="about-page">
      <main>
        {/* ── HERO BANNER ─────────────────────────────────── */}
        <section className="about-hero">
          <div className="about-hero__inner container">
            <span className="about-hero__eyebrow">People & Proof</span>
            <h1 className="about-hero__title">
              The Minds &amp; Metrics<br />Behind ScriptureHub
            </h1>
            <p className="about-hero__subtitle">
              Meet the scholars who guide our AI — and see the real numbers
              that prove spiritual growth is measurable.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            SECTION 1 — THE CLERGY & COUNCIL (The Team)
        ══════════════════════════════════════════════════ */}
        <section className="council-section" id="our-team">
          <div className="container">

            {/* Section header */}
            <div className="section-header">
              <h2 className="section-header__title">The Wisdom Behind the Tech</h2>
              <p className="section-header__body">
                At ScriptureHub, we believe technology should be the servant of
                truth. While our platform uses cutting-edge AI, every algorithm
                is guided by the{' '}
                <strong>ScriptureHub Oversight Council</strong> — a group of
                theologians and educators dedicated to biblical integrity.
              </p>
            </div>

            {/* Council member cards */}
            <div className="council-grid">
              {councilMembers.map((member) => (
                <article key={member.id} className="council-card">
                  <div className="council-card__icon" aria-hidden="true">
                    {member.icon}
                  </div>
                  <h3 className="council-card__name">{member.name}</h3>
                  <p className="council-card__role">{member.role}</p>
                  <p className="council-card__bio">{member.bio}</p>
                </article>
              ))}
            </div>

            {/* Team quote */}
            <blockquote className="team-quote">
              <p className="team-quote__text">
                &ldquo;We don&rsquo;t just build code; we build pathways for
                believers to encounter the Word without distraction.&rdquo;
              </p>
              <footer className="team-quote__attribution">
                — The ScriptureHub Team
              </footer>
            </blockquote>

          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            SECTION 2 — THE IMPACT REPORT (Evidence of Results)
        ══════════════════════════════════════════════════ */}
        <section className="impact-section" id="impact-report">
          <div className="container">

            {/* Section header */}
            <div className="section-header">
              <h2 className="section-header__title">Your Progress, Visualised</h2>
              <p className="section-header__body">
                We don&rsquo;t just hope you learn — we prove it. The
                ScriptureHub Impact Report gives every user a data-driven look
                at their spiritual literacy journey. Here is the evidence of
                how our community grows.
              </p>
            </div>

            {/* Sub-heading */}
            <h3 className="impact-section__subheading">
              Real Results for Real Believers
            </h3>

            {/* Impact stat cards */}
            <div className="impact-grid">
              {impactStats.map((item) => (
                <article key={item.id} className="impact-card">
                  <div className="impact-card__icon" aria-hidden="true">
                    {item.icon}
                  </div>
                  <p className="impact-card__stat">{item.stat}</p>
                  <h4 className="impact-card__label">{item.label}</h4>
                  <p className="impact-card__detail">{item.detail}</p>
                </article>
              ))}
            </div>

            {/* ── Chart placeholder ── */}
            <div className="chart-placeholder">
              <div className="chart-placeholder__inner">
                <span className="chart-placeholder__icon">📊</span>
                <p className="chart-placeholder__label">
                  Interactive Growth Chart — Coming Soon
                </p>
                <p className="chart-placeholder__note">
                  Your live 30-day accuracy trend will animate here inside your
                  personal Growth Dashboard.
                </p>
              </div>
            </div>

            {/* ── Personal Monthly Stats ── */}
            <div className="dashboard-preview">
              <h3 className="dashboard-preview__title">
                Your Personal Monthly Stats
              </h3>
              <p className="dashboard-preview__intro">
                When you open your Growth Dashboard, you will find three
                powerful tracking tools waiting for you:
              </p>

              <div className="dashboard-features">
                {dashboardFeatures.map((feature) => (
                  <div key={feature.id} className="dashboard-feature">
                    <span
                      className="dashboard-feature__icon"
                      aria-hidden="true"
                    >
                      {feature.icon}
                    </span>
                    <div className="dashboard-feature__text">
                      <h4 className="dashboard-feature__title">
                        {feature.title}
                      </h4>
                      <p className="dashboard-feature__desc">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA — updated to safely use the configured /progress endpoint */}
              <div className="dashboard-preview__cta">
                <Link
                  to={isPublicView ? '/' : '/progress'}
                  state={isPublicView ? { showAuth: true } : undefined}
                  className="btn btn--primary"
                >
                  {isPublicView ? 'Sign In to Open Your Dashboard' : 'Open My Growth Dashboard'}
                </Link>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* ── Page-scoped styles ─────────────────────────────────── */}
      <style>{`
        /* ── Page wrapper ── */
        .about-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--color-bg, #0d1117);
          color: var(--color-text, #e6edf3);
        }
        .about-page main {
          flex: 1;
        }

        /* ── Shared container ── */
        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* ── Shared section header ── */
        .section-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 3rem auto;
        }
        .section-header__title {
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 700;
          color: var(--color-accent, #f5c842);
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .section-header__body {
          font-size: 1.05rem;
          line-height: 1.75;
          color: var(--color-text-muted, #8b949e);
        }

        /* ── HERO ── */
        .about-hero {
          background: linear-gradient(
            160deg,
            var(--color-surface, #161b22) 0%,
            var(--color-bg, #0d1117) 100%
          );
          padding: 5rem 1.5rem 4rem;
          text-align: center;
          border-bottom: 1px solid var(--color-border, #21262d);
        }
        .about-hero__eyebrow {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-accent, #f5c842);
          background: rgba(245, 200, 66, 0.1);
          border: 1px solid rgba(245, 200, 66, 0.25);
          border-radius: 999px;
          padding: 0.3rem 1rem;
          margin-bottom: 1.25rem;
        }
        .about-hero__title {
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800;
          line-height: 1.2;
          color: var(--color-heading, #ffffff);
          margin-bottom: 1.25rem;
        }
        .about-hero__subtitle {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--color-text-muted, #8b949e);
          max-width: 620px;
          margin: 0 auto;
        }

        /* ══ SECTION 1 — COUNCIL ══ */
        .council-section {
          padding: 5rem 0 4rem;
          border-bottom: 1px solid var(--color-border, #21262d);
        }

        /* Council member grid — 3 columns on wide screens */
        .council-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.75rem;
          margin-bottom: 3.5rem;
        }

        /* Individual council card */
        .council-card {
          background: var(--color-surface, #161b22);
          border: 1px solid var(--color-border, #21262d);
          border-radius: 12px;
          padding: 2rem 1.75rem;
          transition: border-color 0.25s ease, transform 0.25s ease;
        }
        .council-card:hover {
          border-color: var(--color-accent, #f5c842);
          transform: translateY(-4px);
        }
        .council-card__icon {
          font-size: 2.4rem;
          margin-bottom: 1rem;
          display: block;
        }
        .council-card__name {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-heading, #ffffff);
          margin-bottom: 0.3rem;
        }
        .council-card__role {
          font-size: 0.82rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-accent, #f5c842);
          margin-bottom: 0.9rem;
        }
        .council-card__bio {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--color-text-muted, #8b949e);
        }

        /* Team blockquote */
        .team-quote {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          padding: 2rem 2.5rem;
          border-left: 4px solid var(--color-accent, #f5c842);
          background: rgba(245, 200, 66, 0.05);
          border-radius: 0 10px 10px 0;
        }
        .team-quote__text {
          font-size: 1.1rem;
          font-style: italic;
          line-height: 1.75;
          color: var(--color-text, #e6edf3);
          margin-bottom: 0.75rem;
        }
        .team-quote__attribution {
          font-size: 0.9rem;
          color: var(--color-accent, #f5c842);
          font-weight: 600;
        }

        /* ══ SECTION 2 — IMPACT REPORT ══ */
        .impact-section {
          padding: 5rem 0 5rem;
        }
        .impact-section__subheading {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--color-heading, #ffffff);
          text-align: center;
          margin-bottom: 2rem;
        }

        /* Impact stat grid — 3 columns on wide screens */
        .impact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3.5rem;
        }

        /* Individual impact card */
        .impact-card {
          background: var(--color-surface, #161b22);
          border: 1px solid var(--color-border, #21262d);
          border-radius: 12px;
          padding: 2rem 1.75rem;
          text-align: center;
          transition: border-color 0.25s ease, transform 0.25s ease;
        }
        .impact-card:hover {
          border-color: var(--color-accent, #f5c842);
          transform: translateY(-4px);
        }
        .impact-card__icon {
          font-size: 2.2rem;
          margin-bottom: 0.75rem;
          display: block;
        }
        .impact-card__stat {
          font-size: 2.6rem;
          font-weight: 800;
          color: var(--color-accent, #f5c842);
          line-height: 1;
          margin-bottom: 0.4rem;
        }
        .impact-card__label {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-heading, #ffffff);
          margin-bottom: 0.75rem;
        }
        .impact-card__detail {
          font-size: 0.9rem;
          line-height: 1.65;
          color: var(--color-text-muted, #8b949e);
        }

        /* Chart placeholder box */
        .chart-placeholder {
          border: 2px dashed var(--color-border, #21262d);
          border-radius: 14px;
          padding: 3rem 2rem;
          text-align: center;
          margin-bottom: 4rem;
          background: var(--color-surface, #161b22);
        }
        .chart-placeholder__icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 0.75rem;
        }
        .chart-placeholder__label {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-heading, #ffffff);
          margin-bottom: 0.5rem;
        }
        .chart-placeholder__note {
          font-size: 0.9rem;
          color: var(--color-text-muted, #8b949e);
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* ── Dashboard preview block ── */
        .dashboard-preview {
          background: var(--color-surface, #161b22);
          border: 1px solid var(--color-border, #21262d);
          border-radius: 14px;
          padding: 2.5rem 2rem;
        }
        .dashboard-preview__title {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--color-heading, #ffffff);
          margin-bottom: 0.6rem;
        }
        .dashboard-preview__intro {
          font-size: 0.97rem;
          color: var(--color-text-muted, #8b949e);
          line-height: 1.65;
          margin-bottom: 1.75rem;
        }

        /* Feature rows inside the dashboard preview */
        .dashboard-features {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .dashboard-feature {
          display: flex;
          align-items: flex-start;
          gap: 1.1rem;
          padding: 1.25rem;
          background: var(--color-bg, #0d1117);
          border: 1px solid var(--color-border, #21262d);
          border-radius: 10px;
        }
        .dashboard-feature__icon {
          font-size: 1.8rem;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }
        .dashboard-feature__title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-heading, #ffffff);
          margin-bottom: 0.35rem;
        }
        .dashboard-feature__desc {
          font-size: 0.9rem;
          color: var(--color-text-muted, #8b949e);
          line-height: 1.6;
        }

        /* CTA button row */
        .dashboard-preview__cta {
          text-align: center;
          margin-top: 0.5rem;
        }

        /* ── Shared button styles ── */
        .btn {
          display: inline-block;
          padding: 0.85rem 2.25rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .btn:hover {
          opacity: 0.88;
          transform: translateY(-2px);
        }
        .btn--primary {
          background: var(--color-accent, #f5c842);
          color: #0d1117;
        }

        /* ── Responsive tweaks ── */
        @media (max-width: 640px) {
          .team-quote {
            padding: 1.5rem 1.25rem;
            border-left-width: 3px;
          }
          .dashboard-preview {
            padding: 1.75rem 1.25rem;
          }
          .impact-card__stat {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  )
}