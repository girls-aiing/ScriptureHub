import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DailyManna from '../components/DailyManna.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

const FEATURE_TEASERS = [
  {
    id: 'bible-reader',
    icon: '📖',
    title: 'Bible Reader',
    tagline: 'Immerse yourself in a distraction-free digital sanctuary designed for deep reading, even when you\'re completely offline.',
    ctaLabel: 'Go to Bible',
    to: '/bible',
    color: '#4a90d9',
  },
  {
    id: 'knowledge-hub',
    icon: '🏆',
    title: 'Knowledge Hub',
    badge: '1,000+ Quizzes',
    tagline: 'Test your scriptural mastery with over 1,000 engaging challenges that turn learning the Word into a fun, daily victory.',
    ctaLabel: 'Take a Quiz',
    to: '/quizzes',
    color: '#e8a020',
  },
  {
    id: 'daily-secrets',
    icon: '🔍',
    title: 'Daily Secrets',
    badge: 'Did You Know',
    tagline: 'Unlock hidden historical context and fascinating biblical mysteries that will change the way you see your favourite verses.',
    ctaLabel: 'Discover Secrets',
    to: '/did-you-know',
    color: '#9b59b6',
  },
  {
    id: 'ai-consultant',
    icon: '🤖',
    title: 'AI Theological Assistant',
    tagline: 'Get instant, accurate, and source-backed answers to your most complex faith questions from our scholarly AI guide.',
    ctaLabel: 'Ask a Question',
    to: '/ai',
    color: '#27ae60',
  },
  {
    id: 'growth-dashboard',
    icon: '📈',
    title: 'Growth Dashboard',
    tagline: 'Visualize your spiritual progress and celebrate your learning milestones with your personalized monthly impact report.',
    ctaLabel: 'View My Progress',
    to: '/dashboard',
    color: '#e74c3c',
  },
]

const KEY_QUIZZES    = 'scripturehub_quizzes_done'
const KEY_SECRETS    = 'scripturehub_secrets_seen'
const KEY_CHAPTERS   = 'scripturehub_chapters_read'
const TOTAL_SECRETS  = 1000
const TOTAL_QUIZZES  = 1000
const TOTAL_CHAPTERS = 1189

function loadNum(key) {
  try { return parseInt(JSON.parse(localStorage.getItem(key))) || 0 }
  catch { return 0 }
}

export default function HomePage() {
  const navigate          = useNavigate()
  const { darkMode }      = useTheme()
  const [stats, setStats] = useState({ quizzes: 0, secrets: 0, chapters: 0 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setStats({
      quizzes:  loadNum(KEY_QUIZZES),
      secrets:  loadNum(KEY_SECRETS),
      chapters: loadNum(KEY_CHAPTERS),
    })
    setTimeout(() => setVisible(true), 80)
  }, [])

  const secretPct  = Math.min(100, Math.round((stats.secrets  / TOTAL_SECRETS)  * 100))
  const quizPct    = Math.min(100, Math.round((stats.quizzes  / TOTAL_QUIZZES)  * 100))
  const chapterPct = Math.min(100, Math.round((stats.chapters / TOTAL_CHAPTERS) * 100))

  // ── Color tokens — light vs dark ──────────────────────────────
  const C = darkMode ? {
    pageBg:       '#0a0500',
    heroGrad:     'linear-gradient(160deg, #1a0a00 0%, #2d1500 50%, #1a0800 100%)',
    heroBorder:   '1px solid rgba(201,168,76,0.2)',
    eyebrow:      '#c9a84c',
    heroTitle:    '#f5ead8',
    heroTitleGold:'#f0c040',
    heroSub:      '#c8b89a',
    sectionTitle: '#f5ead8',
    sectionSub:   '#b0a090',
    cardBg:       '#1e1008',
    cardBorder:   'rgba(201,168,76,0.25)',
    cardHoverBg:  '#2a1810',
    progLabel:    '#c8b89a',
    progTotal:    '#8a7a6a',
    progCta:      '#8a7a6a',
    teaserTitle:  '#f5ead8',
    teaserTagline:'#c8b89a',
    credBg:       'rgba(201,168,76,0.06)',
    credBorder:   'rgba(201,168,76,0.15)',
    credNum:      '#f0c040',
    credLabel:    '#b0a090',
    credDivider:  'rgba(201,168,76,0.15)',
  } : {
    pageBg:       '#fafaf8',
    heroGrad:     'linear-gradient(160deg, #1a1a2e 0%, #2d2d5e 50%, #1a1a2e 100%)',
    heroBorder:   '1px solid rgba(201,168,76,0.3)',
    eyebrow:      '#c9a84c',
    heroTitle:    '#ffffff',
    heroTitleGold:'#f0c040',
    heroSub:      '#d0cce8',
    sectionTitle: '#1a1a2e',
    sectionSub:   '#555555',
    cardBg:       '#ffffff',
    cardBorder:   '#e0d8c8',
    cardHoverBg:  '#fffbf0',
    progLabel:    '#444444',
    progTotal:    '#888888',
    progCta:      '#888888',
    teaserTitle:  '#1a1a2e',
    teaserTagline:'#444444',
    credBg:       '#f5f0e8',
    credBorder:   '#e0d8c8',
    credNum:      '#c9a84c',
    credLabel:    '#555555',
    credDivider:  '#e0d8c8',
  }

  return (
    <main style={{
      background: C.pageBg,
      opacity:    visible ? 1 : 0,
      transform:  visible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      minHeight:  '100vh',
    }}>

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section style={{
        background:   C.heroGrad,
        borderBottom: C.heroBorder,
        padding:      '4rem 1.5rem 3.5rem',
        textAlign:    'center',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p style={{
            fontSize:      '0.82rem',
            letterSpacing: '0.14em',
            color:         C.eyebrow,
            textTransform: 'uppercase',
            marginBottom:  '0.75rem',
            fontFamily:    'Georgia, serif',
            fontWeight:    '600',
          }}>✝ Welcome to ScriptureHub</p>

          <h1 style={{
            fontSize:    'clamp(2rem, 5vw, 3rem)',
            fontWeight:  '800',
            color:       C.heroTitle,
            lineHeight:  '1.25',
            margin:      '0 0 1rem',
            fontFamily:  'Georgia, serif',
          }}>
            Your Daily Companion<br />
            <span style={{ color: C.heroTitleGold }}>in God's Word</span>
          </h1>

          <p style={{
            fontSize:   '1.05rem',
            color:      C.heroSub,
            lineHeight: '1.75',
            maxWidth:   '520px',
            margin:     '0 auto 2rem',
            fontFamily: 'Georgia, serif',
          }}>
            A professional platform for Bible study, theological discovery,
            and spiritual growth — built for believers of every tradition.
          </p>

          <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/bible')}
              style={{
                background:  'linear-gradient(135deg, #c9a84c, #a07830)',
                border:      'none',
                borderRadius:'10px',
                padding:     '0.8rem 1.75rem',
                color:       '#1a0a00',
                fontWeight:  '800',
                fontSize:    '1rem',
                cursor:      'pointer',
                fontFamily:  'Georgia, serif',
                boxShadow:   '0 4px 16px rgba(201,168,76,0.4)',
              }}
            >📖 Start Reading</button>
            <button
              onClick={() => navigate('/did-you-know')}
              style={{
                background:   'transparent',
                border:       '2px solid #c9a84c',
                borderRadius: '10px',
                padding:      '0.8rem 1.75rem',
                color:        '#f0c040',
                fontWeight:   '700',
                fontSize:     '1rem',
                cursor:       'pointer',
                fontFamily:   'Georgia, serif',
              }}
            >🔍 Discover Secrets</button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          DAILY MANNA
      ══════════════════════════════════════════════════════ */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem 0' }}>
        <DailyManna darkMode={darkMode} />
      </section>

      {/* ══════════════════════════════════════════════════════
          STUDY PROGRESS
      ══════════════════════════════════════════════════════ */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{
            fontSize:   'clamp(1.4rem, 3vw, 1.85rem)',
            fontWeight: '800',
            color:      C.sectionTitle,
            margin:     '0 0 0.5rem',
            fontFamily: 'Georgia, serif',
          }}>📊 Your Study Progress</h2>
          <p style={{
            fontSize:   '1rem',
            color:      C.sectionSub,
            margin:     0,
            fontFamily: 'Georgia, serif',
          }}>
            Your journey through Scripture — tracked automatically as you explore.
          </p>
        </div>

        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap:                 '1.1rem',
        }}>
          <ProgressCard
            icon="🔍" label="Bible Secrets Discovered"
            value={stats.secrets}  total={TOTAL_SECRETS}  pct={secretPct}
            color="#9b59b6" C={C} onClick={() => navigate('/did-you-know')}
          />
          <ProgressCard
            icon="🏆" label="Quizzes Completed"
            value={stats.quizzes}  total={TOTAL_QUIZZES}  pct={quizPct}
            color="#e8a020" C={C} onClick={() => navigate('/quizzes')}
          />
          <ProgressCard
            icon="📖" label="Bible Chapters Read"
            value={stats.chapters} total={TOTAL_CHAPTERS} pct={chapterPct}
            color="#4a90d9" C={C} onClick={() => navigate('/bible')}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURE CARDS
      ══════════════════════════════════════════════════════ */}
      <section style={{ maxWidth: '1050px', margin: '0 auto', padding: '1rem 1.5rem 2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{
            fontSize:   'clamp(1.4rem, 3vw, 1.85rem)',
            fontWeight: '800',
            color:      C.sectionTitle,
            margin:     '0 0 0.5rem',
            fontFamily: 'Georgia, serif',
          }}>Explore the Word</h2>
          <p style={{
            fontSize:   '1rem',
            color:      C.sectionSub,
            margin:     0,
            fontFamily: 'Georgia, serif',
          }}>
            Your next step in faith is just one click away. Choose where you want to grow today.
          </p>
        </div>

        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap:                 '1.25rem',
        }}>
          {FEATURE_TEASERS.map((feature) => (
            <TeaserCard
              key={feature.id}
              feature={feature}
              C={C}
              onClick={() => navigate(feature.to)}
            />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CREDIBILITY STRIP
      ══════════════════════════════════════════════════════ */}
      <section style={{
        display:        'flex',
        justifyContent: 'center',
        flexWrap:       'wrap',
        background:     C.credBg,
        borderTop:      `1px solid ${C.credBorder}`,
        borderBottom:   `1px solid ${C.credBorder}`,
        padding:        '1.75rem 1rem',
      }}>
        {[
          { num: '66',     label: 'Books of the Bible' },
          { num: '1,000+', label: 'Bible Quizzes' },
          { num: '1,000+', label: 'Biblical Secrets' },
          { num: '11',     label: 'Bible Translations' },
          { num: '40+',    label: 'Bible Authors' },
        ].map(({ num, label }, i, arr) => (
          <div key={label} style={{
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:            '0.25rem',
            padding:        '0.5rem 2rem',
            borderRight:    i < arr.length - 1 ? `1px solid ${C.credDivider}` : 'none',
            fontFamily:     'Georgia, serif',
          }}>
            <span style={{
              fontSize:   '1.6rem',
              fontWeight: '800',
              color:      C.credNum,
              lineHeight: 1,
            }}>{num}</span>
            <span style={{
              fontSize:      '0.75rem',
              color:         C.credLabel,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              textAlign:     'center',
              fontWeight:    '600',
            }}>{label}</span>
          </div>
        ))}
      </section>

    </main>
  )
}

// ── Progress Card ─────────────────────────────────────────────────
function ProgressCard({ icon, label, value, total, pct, color, C, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:    hovered ? C.cardHoverBg : C.cardBg,
        border:        `2px solid ${hovered ? color : C.cardBorder}`,
        borderRadius:  '14px',
        padding:       '1.35rem',
        display:       'flex',
        flexDirection: 'column',
        gap:           '0.7rem',
        cursor:        'pointer',
        transition:    'all 0.25s ease',
        transform:     hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow:     hovered ? `0 8px 24px ${color}30` : 'none',
        fontFamily:    'Georgia, serif',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '1.3rem' }}>{icon}</span>
        <span style={{
          fontSize:      '0.8rem',
          color:         C.progLabel,
          fontWeight:    '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>{label}</span>
      </div>

      {/* Numbers */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
        <span style={{
          fontSize:   '2rem',
          fontWeight: '800',
          color:      color,
          lineHeight: 1,
        }}>{value.toLocaleString()}</span>
        <span style={{
          fontSize:   '0.9rem',
          color:      C.progTotal,
          fontWeight: '600',
        }}>/ {total.toLocaleString()}</span>
      </div>

      {/* Bar */}
      <div style={{
        height:       '8px',
        background:   C.cardBorder,
        borderRadius: '99px',
        overflow:     'hidden',
      }}>
        <div style={{
          height:       '100%',
          width:        `${Math.max(pct, pct > 0 ? 2 : 0)}%`,
          background:   `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: '99px',
          transition:   'width 0.8s ease',
          minWidth:     pct > 0 ? '6px' : '0',
        }} />
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize:   '0.85rem',
          fontWeight: '700',
          color:      color,
        }}>{pct}% complete</span>
        <span style={{
          fontSize:   '0.82rem',
          color:      C.progCta,
          fontWeight: '600',
        }}>Continue →</span>
      </div>
    </div>
  )
}

// ── Teaser Card ───────────────────────────────────────────────────
function TeaserCard({ feature, C, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:    hovered ? C.cardHoverBg : C.cardBg,
        border:        `2px solid ${hovered ? feature.color : C.cardBorder}`,
        borderTop:     `4px solid ${hovered ? feature.color : C.cardBorder}`,
        borderRadius:  '14px',
        padding:       '1.75rem 1.5rem',
        display:       'flex',
        flexDirection: 'column',
        gap:           '0.75rem',
        cursor:        'pointer',
        transition:    'all 0.25s ease',
        transform:     hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow:     hovered ? `0 8px 28px ${feature.color}25` : 'none',
        fontFamily:    'Georgia, serif',
      }}
    >
      <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>{feature.icon}</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        <h3 style={{
          fontSize:   '1.15rem',
          fontWeight: '800',
          color:      C.teaserTitle,
          margin:     0,
        }}>{feature.title}</h3>
        {feature.badge && (
          <span style={{
            fontSize:      '0.68rem',
            fontWeight:    '700',
            background:    '#fff3cd',
            color:         '#7a5000',
            border:        '1px solid #f0c040',
            borderRadius:  '999px',
            padding:       '0.15rem 0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>{feature.badge}</span>
        )}
      </div>

      <p style={{
        fontSize:   '0.95rem',
        color:      C.teaserTagline,
        lineHeight: '1.7',
        margin:     0,
        flex:       1,
      }}>{feature.tagline}</p>

      <span style={{
        fontSize:   '0.92rem',
        fontWeight: '700',
        color:      feature.color,
        marginTop:  '0.25rem',
      }}>{feature.ctaLabel} →</span>
    </div>
  )
}