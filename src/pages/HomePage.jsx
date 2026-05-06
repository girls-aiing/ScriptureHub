import React from 'react'
import { Link } from 'react-router-dom'

/* ──────────────────────────────────────────────────────────────
   HomePage — ScriptureHub
   Contains the "Explore the Word" Feature Teasers preview section.
   Each card teases one core page: icon · tagline · CTA link.
────────────────────────────────────────────────────────────── */

// Feature teaser data — one object per site section
const FEATURE_TEASERS = [
  {
    id: 'bible-reader',
    icon: '📖',
    title: 'Bible Reader',
    tagline:
      'Immerse yourself in a distraction-free digital sanctuary designed for deep reading, even when you're completely offline.',
    ctaLabel: 'Go to Bible',
    to: '/bible-reader',
  },
  {
    id: 'knowledge-hub',
    icon: '🏆',
    title: 'Knowledge Hub',
    badge: '1,000+ Quizzes',
    tagline:
      'Test your scriptural mastery with over 1,000 engaging challenges that turn learning the Word into a fun, daily victory.',
    ctaLabel: 'Take a Quiz',
    to: '/knowledge-hub',
  },
  {
    id: 'daily-secrets',
    icon: '🔍',
    title: 'Daily Secrets',
    badge: 'Did You Know',
    tagline:
      'Unlock hidden historical context and fascinating biblical mysteries that will change the way you see your favourite verses.',
    ctaLabel: 'Discover Secrets',
    to: '/knowledge-hub',
  },
  {
    id: 'ai-consultant',
    icon: '🤖',
    title: 'AI Theological Assistant',
    tagline:
      'Get instant, accurate, and source-backed answers to your most complex faith questions from our scholarly AI guide.',
    ctaLabel: 'Ask a Question',
    to: '/ai-consultant',
  },
  {
    id: 'growth-dashboard',
    icon: '📈',
    title: 'Growth Dashboard',
    tagline:
      'Visualize your spiritual progress and celebrate your learning milestones with your personalized monthly impact report.',
    ctaLabel: 'View My Progress',
    to: '/growth-dashboard',
  },
]

export default function HomePage() {
  return (
    <main>
      {/* ── "Explore the Word" Feature Teasers Section ─────────── */}
      <section className="explore-section">
        {/* Section heading */}
        <div className="explore-header">
          <h2 className="explore-title">Explore the Word</h2>
          <p className="explore-subtitle">
            Your next step in faith is just one click away. Choose where you want to grow today.
          </p>
        </div>

        {/* Teaser cards grid */}
        <div className="teasers-grid">
          {FEATURE_TEASERS.map((feature) => (
            <article key={feature.id} className="teaser-card">

              {/* Icon */}
              <span className="teaser-icon" aria-hidden="true">
                {feature.icon}
              </span>

              {/* Title + optional badge */}
              <div className="teaser-title-row">
                <h3 className="teaser-title">{feature.title}</h3>
                {feature.badge && (
                  <span className="teaser-badge">{feature.badge}</span>
                )}
              </div>

              {/* Tagline */}
              <p className="teaser-tagline">{feature.tagline}</p>

              {/* CTA link — Radiant Gold to draw the eye */}
              <Link to={feature.to} className="teaser-cta">
                {feature.ctaLabel} &rarr;
              </Link>

            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
