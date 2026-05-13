import React, { useState, useEffect } from 'react'
import { useProgress } from '../hooks/useProgress'
import { useLanguage } from '../context/LanguageContext.jsx'
import { speakPageGuide, stopVoiceGuide } from '../hooks/useVoiceGuide'

// ─── Config ───────────────────────────────────────────────────────────────────
const TIERS = ['follower','believer','messenger','deacon','evangelist','visionary']

const TIER_COLORS = {
  follower:   '#60a5fa',
  believer:   '#34d399',
  messenger:  '#f59e0b',
  deacon:     '#a78bfa',
  evangelist: '#f87171',
  visionary:  '#f0c040',
}

const TIER_ICONS = {
  follower:   '🌱',
  believer:   '✝️',
  messenger:  '📣',
  deacon:     '🕊️',
  evangelist: '🔥',
  visionary:  '👁️',
}

const DAILY_TIPS = [
  { verse: 'Psalm 119:105', text: '"Your word is a lamp to my feet and a light to my path."' },
  { verse: 'Joshua 1:8',    text: '"Meditate on it day and night, so that you may be careful to do everything written in it."' },
  { verse: 'Proverbs 4:7',  text: '"The beginning of wisdom is this: Get wisdom, and whatever you get, get insight."' },
  { verse: '2 Tim 3:16',    text: '"All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training."' },
  { verse: 'Romans 15:4',   text: '"Everything that was written in the past was written to teach us."' },
  { verse: 'Hebrews 4:12',  text: '"The word of God is alive and active, sharper than any double-edged sword."' },
  { verse: 'John 8:32',     text: '"Then you will know the truth, and the truth will set you free."' },
]

// ─── Small reusable components ────────────────────────────────────────────────
const ProgressBar = ({ value, max, color = '#f0c040', height = 10 }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div style={{
      width: '100%', height,
      borderRadius: 999,
      background: 'rgba(255,255,255,0.08)',
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${pct}%`, height: '100%',
        background: color, borderRadius: 999,
        transition: 'width 0.8s ease',
        boxShadow: `0 0 8px ${color}66`,
      }} />
    </div>
  )
}

const StatCard = ({ icon, label, value, max, color, subtitle, onClick }) => {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${hovered ? color + '66' : color + '33'}`,
        borderRadius: 16, padding: '1.5rem',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: `${color}22`, filter: 'blur(20px)',
        pointerEvents: 'none',
      }} />
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ color: '#c8a96e', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.75rem' }}>
        <span style={{ color, fontSize: '2.2rem', fontWeight: 'bold' }}>{value.toLocaleString()}</span>
        <span style={{ color: 'rgba(200,169,110,0.5)', fontSize: '0.9rem' }}>/ {max.toLocaleString()}</span>
      </div>
      <ProgressBar value={value} max={max} color={color} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.78rem' }}>
        <span style={{ color: 'rgba(200,169,110,0.6)' }}>{pct}% complete</span>
        {onClick && <span style={{ color }}>Continue →</span>}
      </div>
      {subtitle && (
        <div style={{ color: 'rgba(200,169,110,0.5)', fontSize: '0.75rem', marginTop: '0.4rem' }}>
          {subtitle}
        </div>
      )}
    </div>
  )
}

const HistoryItem = ({ icon, text, date, correct }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start',
    gap: '0.75rem', padding: '0.65rem 0',
    borderBottom: '1px solid rgba(240,192,64,0.08)',
  }}>
    <span style={{ fontSize: '1rem', marginTop: 2, flexShrink: 0 }}>{icon}</span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        color: '#f0e6d0', fontSize: '0.85rem',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {text}
      </div>
      <div style={{ color: 'rgba(200,169,110,0.5)', fontSize: '0.72rem', marginTop: 2 }}>
        {new Date(date).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })}
      </div>
    </div>
    {correct !== undefined && (
      <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{correct ? '✅' : '❌'}</span>
    )}
  </div>
)

const Badge = ({ emoji, label, color }) => (
  <div style={{
    background: `${color}18`, border: `1px solid ${color}44`,
    borderRadius: 20, padding: '0.4rem 1rem',
    fontSize: '0.85rem', color,
    display: 'flex', alignItems: 'center', gap: '0.4rem',
  }}>
    {emoji} {label}
  </div>
)

// ─── First Visit Tour Modal ───────────────────────────────────────────────────
const TourModal = ({ onClose }) => {
  const steps = [
    { icon: '📊', title: 'Overview Tab',   desc: 'See all your stats at a glance — secrets, quizzes, chapters and your tier breakdown.' },
    { icon: '🏆', title: 'Quizzes Tab',    desc: 'Every quiz answer you give is saved here with your accuracy score.' },
    { icon: '🔍', title: 'Secrets Tab',    desc: 'Every question you ask Dr. Clergy is recorded here.' },
    { icon: '📖', title: 'Chapters Tab',   desc: 'Every Bible chapter you read is tracked automatically.' },
    { icon: '🗺️', title: 'Your Roadmap',   desc: 'Progress from Follower all the way to Visionary as you study more.' },
  ]
  const [step, setStep] = useState(0)

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '1rem',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a0a00, #2d1500)',
        border: '1px solid rgba(240,192,64,0.4)',
        borderRadius: 20, padding: '2rem',
        maxWidth: 420, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 8, height: 8,
              borderRadius: 999,
              background: i === step ? '#f0c040' : 'rgba(240,192,64,0.25)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>

        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{steps[step].icon}</div>
        <h2 style={{ color: '#f0c040', fontSize: '1.3rem', margin: '0 0 0.75rem' }}>
          {steps[step].title}
        </h2>
        <p style={{ color: '#c8a96e', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 2rem' }}>
          {steps[step].desc}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(240,192,64,0.3)',
              borderRadius: 10, padding: '0.6rem 1.25rem',
              color: '#c8a96e', cursor: 'pointer',
              fontFamily: "'Georgia', serif", fontSize: '0.9rem',
            }}>
              ← Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} style={{
              background: 'linear-gradient(135deg, #f0c040, #c8860a)',
              border: 'none', borderRadius: 10,
              padding: '0.6rem 1.5rem',
              color: '#1a0a00', fontWeight: 'bold',
              cursor: 'pointer', fontFamily: "'Georgia', serif",
              fontSize: '0.9rem',
            }}>
              Next →
            </button>
          ) : (
            <button onClick={onClose} style={{
              background: 'linear-gradient(135deg, #f0c040, #c8860a)',
              border: 'none', borderRadius: 10,
              padding: '0.6rem 1.5rem',
              color: '#1a0a00', fontWeight: 'bold',
              cursor: 'pointer', fontFamily: "'Georgia', serif",
              fontSize: '0.9rem',
            }}>
              🙏 Let's Begin!
            </button>
          )}
        </div>

        <button onClick={onClose} style={{
          background: 'none', border: 'none',
          color: 'rgba(200,169,110,0.4)', fontSize: '0.75rem',
          cursor: 'pointer', marginTop: '1rem',
          fontFamily: "'Georgia', serif",
        }}>
          Skip tour
        </button>
      </div>
    </div>
  )
}

// ─── Welcome Banner ───────────────────────────────────────────────────────────
const WelcomeBanner = ({ progress, overallPct, onShowTour }) => {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const getMessage = () => {
    if (overallPct === 0)  return "Your Scripture journey begins here. Every step counts! 🌱"
    if (overallPct < 10)   return "You've taken your first steps — keep going! ✝️"
    if (overallPct < 30)   return "Great progress! You're building a strong foundation. 📣"
    if (overallPct < 60)   return "Halfway there — your dedication is inspiring! 🕊️"
    if (overallPct < 90)   return "Almost a Visionary! The finish line is in sight. 🔥"
    return "You are a true Scripture Visionary. Well done! 👁️"
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(240,192,64,0.12), rgba(200,100,10,0.08))',
      border: '1px solid rgba(240,192,64,0.3)',
      borderRadius: 20, padding: '1.75rem 2rem',
      marginBottom: '1.5rem',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 160, height: 160, borderRadius: '50%',
        background: 'rgba(240,192,64,0.08)', filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ color: 'rgba(200,169,110,0.7)', fontSize: '0.85rem', margin: '0 0 0.25rem' }}>
            {greeting} 👋
          </p>
          <h2 style={{ color: '#f0c040', fontSize: '1.5rem', margin: '0 0 0.5rem', fontWeight: 'bold' }}>
            Welcome back, Scripture Explorer!
          </h2>
          <p style={{ color: '#c8a96e', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
            {getMessage()}
          </p>
        </div>
        <button
          onClick={onShowTour}
          style={{
            background: 'rgba(240,192,64,0.12)',
            border: '1px solid rgba(240,192,64,0.35)',
            borderRadius: 12, padding: '0.5rem 1rem',
            color: '#f0c040', fontSize: '0.82rem',
            cursor: 'pointer', fontFamily: "'Georgia', serif",
            whiteSpace: 'nowrap', flexShrink: 0,
          }}
        >
          🗺️ View Guide
        </button>
      </div>

      <div style={{
        display: 'flex', gap: '1.5rem', marginTop: '1.25rem',
        flexWrap: 'wrap',
      }}>
        {[
          { label: 'Day Streak',   value: `${progress.streak} 🔥` },
          { label: 'Total Points', value: progress.totalScore.toLocaleString() + ' ⭐' },
          { label: 'Overall',      value: `${overallPct}% 📈` },
        ].map(s => (
          <div key={s.label}>
            <div style={{ color: 'rgba(200,169,110,0.5)', fontSize: '0.72rem' }}>{s.label}</div>
            <div style={{ color: '#f0e6d0', fontSize: '1.1rem', fontWeight: 'bold' }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────
const HowItWorks = () => {
  const cards = [
    { icon: '🔍', title: 'Ask Dr. Clergy',   color: '#60a5fa', desc: 'Every question you ask the AI consultant is automatically logged under Secrets.' },
    { icon: '🏆', title: 'Take Quizzes',      color: '#f0c040', desc: 'Every quiz answer — right or wrong — is saved with your accuracy tracked per tier.' },
    { icon: '📖', title: 'Read the Bible',    color: '#34d399', desc: 'Every chapter you open in the Bible Reader is counted toward your 1,189 chapter goal.' },
    { icon: '📊', title: 'Watch You Grow',    color: '#a78bfa', desc: 'Your overall score, streak, and tier rank update automatically as you study.' },
  ]
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(240,192,64,0.15)',
      borderRadius: 20, padding: '1.5rem',
      marginBottom: '1.5rem',
    }}>
      <h3 style={{ color: '#f0c040', margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 'bold' }}>
        📖 How It Works
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
      }}>
        {cards.map(c => (
          <div key={c.title} style={{
            background: `${c.color}0d`,
            border: `1px solid ${c.color}33`,
            borderRadius: 14, padding: '1rem',
          }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{c.icon}</div>
            <div style={{ color: c.color, fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
              {c.title}
            </div>
            <div style={{ color: 'rgba(200,169,110,0.65)', fontSize: '0.78rem', lineHeight: 1.5 }}>
              {c.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Getting Started Checklist ────────────────────────────────────────────────
const GettingStarted = ({ progress }) => {
  const totalQuiz = Object.values(progress.tierProgress).reduce((s, t) => s + t.total, 0)

  const tasks = [
    { done: progress.secrets  >= 1,  icon: '🔍', label: 'Ask Dr. Clergy your first question',  link: '/ai'       },
    { done: totalQuiz          >= 1,  icon: '🏆', label: 'Answer your first quiz question',      link: '/quizzes'  },
    { done: progress.chapters >= 1,  icon: '📖', label: 'Read your first Bible chapter',         link: '/bible'    },
    { done: progress.streak   >= 3,  icon: '🔥', label: 'Maintain a 3-day study streak',         link: null        },
    { done: totalQuiz          >= 10, icon: '🎯', label: 'Answer 10 quiz questions',              link: '/quizzes'  },
    { done: progress.secrets  >= 5,  icon: '💡', label: 'Discover 5 Bible secrets',              link: '/ai'       },
    { done: progress.chapters >= 10, icon: '📚', label: 'Read 10 Bible chapters',                link: '/bible'    },
  ]

  const done = tasks.filter(t => t.done).length

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(240,192,64,0.15)',
      borderRadius: 20, padding: '1.5rem',
      marginBottom: '1.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ color: '#f0c040', margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>
          🎯 Getting Started
        </h3>
        <span style={{
          background: 'rgba(240,192,64,0.15)',
          border: '1px solid rgba(240,192,64,0.3)',
          borderRadius: 20, padding: '0.2rem 0.75rem',
          color: '#f0c040', fontSize: '0.8rem', fontWeight: 'bold',
        }}>
          {done} / {tasks.length} done
        </span>
      </div>

      <ProgressBar value={done} max={tasks.length} color="#f0c040" height={6} />

      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {tasks.map((task, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.6rem 0.75rem', borderRadius: 10,
            background: task.done ? 'rgba(52,211,153,0.07)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${task.done ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)'}`,
            opacity: task.done ? 0.75 : 1,
          }}>
            <span style={{ fontSize: '1.1rem' }}>{task.done ? '✅' : '⬜'}</span>
            <span style={{ fontSize: '0.9rem' }}>{task.icon}</span>
            <span style={{
              color: task.done ? 'rgba(200,169,110,0.5)' : '#f0e6d0',
              fontSize: '0.85rem', flex: 1,
              textDecoration: task.done ? 'line-through' : 'none',
            }}>
              {task.label}
            </span>
            {!task.done && task.link && (
              <a href={task.link} style={{
                color: '#f0c040', fontSize: '0.75rem',
                textDecoration: 'none', flexShrink: 0,
              }}>
                Go →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Progress Roadmap ─────────────────────────────────────────────────────────
const ProgressRoadmap = ({ progress }) => {
  const totalQuiz = Object.values(progress.tierProgress).reduce((s, t) => s + t.total, 0)

  const milestones = [
    { tier: 'follower',   icon: '🌱', label: 'Follower',   color: '#60a5fa', req: 'Start your journey',         done: true },
    { tier: 'believer',   icon: '✝️', label: 'Believer',   color: '#34d399', req: '5 secrets + 5 quizzes',      done: progress.secrets >= 5  && totalQuiz >= 5  },
    { tier: 'messenger',  icon: '📣', label: 'Messenger',  color: '#f59e0b', req: '20 secrets + 20 quizzes',    done: progress.secrets >= 20 && totalQuiz >= 20 },
    { tier: 'deacon',     icon: '🕊️', label: 'Deacon',     color: '#a78bfa', req: '50 secrets + 50 quizzes',    done: progress.secrets >= 50 && totalQuiz >= 50 },
    { tier: 'evangelist', icon: '🔥', label: 'Evangelist', color: '#f87171', req: '100 secrets + 100 quizzes',  done: progress.secrets >= 100 && totalQuiz >= 100 },
    { tier: 'visionary',  icon: '👁️', label: 'Visionary',  color: '#f0c040', req: '500 secrets + 500 quizzes',  done: progress.secrets >= 500 && totalQuiz >= 500 },
  ]

  const currentIdx = [...milestones].reverse().findIndex(m => m.done)
  const activeTierIdx = currentIdx === -1 ? 0 : milestones.length - 1 - currentIdx

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(240,192,64,0.15)',
      borderRadius: 20, padding: '1.5rem',
      marginBottom: '1.5rem',
    }}>
      <h3 style={{ color: '#f0c040', margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 'bold' }}>
        🗺️ Your Progress Roadmap
      </h3>

      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 23, top: 24,
          width: 2, height: `calc(100% - 48px)`,
          background: 'rgba(240,192,64,0.15)',
          zIndex: 0,
        }} />

        {milestones.map((m, i) => (
          <div key={m.tier} style={{
            display: 'flex', alignItems: 'flex-start',
            gap: '1rem', marginBottom: i < milestones.length - 1 ? '1.25rem' : 0,
            position: 'relative', zIndex: 1,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
              background: m.done ? `${m.color}22` : 'rgba(255,255,255,0.05)',
              border: `2px solid ${m.done ? m.color : 'rgba(255,255,255,0.1)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem',
              boxShadow: m.done ? `0 0 12px ${m.color}44` : 'none',
              transition: 'all 0.3s',
            }}>
              {m.done ? m.icon : '🔒'}
            </div>

            <div style={{ paddingTop: '0.35rem' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginBottom: '0.2rem',
              }}>
                <span style={{
                  color: m.done ? m.color : 'rgba(200,169,110,0.4)',
                  fontWeight: 'bold', fontSize: '0.95rem',
                }}>
                  {m.label}
                </span>
                {i === activeTierIdx && (
                  <span style={{
                    background: 'rgba(240,192,64,0.2)',
                    border: '1px solid rgba(240,192,64,0.4)',
                    borderRadius: 20, padding: '0.1rem 0.5rem',
                    color: '#f0c040', fontSize: '0.65rem', fontWeight: 'bold',
                  }}>
                    CURRENT
                  </span>
                )}
                {m.done && i !== activeTierIdx && (
                  <span style={{ color: '#34d399', fontSize: '0.75rem' }}>✓ Unlocked</span>
                )}
              </div>
              <div style={{ color: 'rgba(200,169,110,0.5)', fontSize: '0.78rem' }}>
                {m.req}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tip of the Day ───────────────────────────────────────────────────────────
const TipOfTheDay = () => {
  const tip = DAILY_TIPS[new Date().getDay() % DAILY_TIPS.length]
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(96,165,250,0.08), rgba(167,139,250,0.08))',
      border: '1px solid rgba(96,165,250,0.25)',
      borderRadius: 16, padding: '1.25rem 1.5rem',
      marginBottom: '1.5rem',
      display: 'flex', gap: '1rem', alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: '1.75rem', flexShrink: 0 }}>💡</span>
      <div>
        <div style={{ color: '#60a5fa', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
          TIP OF THE DAY
        </div>
        <p style={{ color: '#f0e6d0', fontSize: '0.95rem', margin: '0 0 0.35rem', lineHeight: 1.6, fontStyle: 'italic' }}>
          {tip.text}
        </p>
        <span style={{ color: 'rgba(96,165,250,0.7)', fontSize: '0.8rem' }}>— {tip.verse}</span>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StudyProgressPage({ onNavigate }) {
  const { progress, reset } = useProgress()
  const { t } = useLanguage()
  const [activeTab, setActiveTab]       = useState('overview')
  const [confirmReset, setConfirmReset] = useState(false)
  const [showTour, setShowTour]         = useState(false)

  // ─── Voice Guide on page load ─────────────────────────────────────────────
  useEffect(() => {
    speakPageGuide('/progress')
    return () => stopVoiceGuide()
  }, [])

  // ─── Show tour on first visit ─────────────────────────────────────────────
  useEffect(() => {
    const seen = localStorage.getItem('progress_tour_seen')
    if (!seen) {
      setShowTour(true)
      localStorage.setItem('progress_tour_seen', 'true')
    }
  }, [])

    const tabs = [
    { id: 'overview', label: `📊 ${t('studyProgress')}` },
    { id: 'quizzes',  label: `🏆 ${t('quizzes')}`       },
    { id: 'secrets',  label: `🔍 ${t('biblicalSecrets')}` },
    { id: 'chapters', label: `📖 ${t('bible')}`          },
    { id: 'guide',    label: `🗺️ ${t('guidance')}`       },
  ]

  const overallPct = Math.round(
    (
      (progress.secrets  / 1000) +
      (progress.quizzes  / 1000) +
      (progress.chapters / 1189)
    ) / 3 * 100
  )

  const totalQuizAnswered = Object.values(progress.tierProgress)
    .reduce((sum, t) => sum + t.total, 0)
  const totalQuizCorrect = Object.values(progress.tierProgress)
    .reduce((sum, t) => sum + t.correct, 0)
  const accuracy = totalQuizAnswered > 0
    ? Math.round((totalQuizCorrect / totalQuizAnswered) * 100) : 0

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a0a00 0%, #2d1500 50%, #1a0a00 100%)',
      padding: '2rem 1rem',
      fontFamily: "'Georgia', serif",
      color: '#f0e6d0',
    }}>

      {showTour && <TourModal onClose={() => setShowTour(false)} />}

      <div style={{ maxWidth: 820, margin: '0 auto' }}>

        <TipOfTheDay />

        <WelcomeBanner
          progress={progress}
          overallPct={overallPct}
          onShowTour={() => setShowTour(true)}
        />

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📊</div>
          <h1 style={{
            color: '#f0c040', fontSize: '2rem', fontWeight: 'bold',
            margin: '0 0 0.25rem',
            textShadow: '0 2px 8px rgba(240,192,64,0.4)',
          }}>
            {t('studyProgress')}
          </h1>
          <p style={{ color: '#c8a96e', fontSize: '0.95rem', margin: 0 }}>
            Your journey through Scripture — tracked automatically as you explore.
          </p>

          <div style={{
            display: 'flex', justifyContent: 'center',
            gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap',
          }}>
            <Badge emoji="🔥" label={`${progress.streak} day streak`}              color="#f0c040" />
            <Badge emoji="⭐" label={`${progress.totalScore.toLocaleString()} pts`} color="#34d399" />
            <Badge emoji="🎯" label={`${accuracy}% accuracy`}                       color="#a78bfa" />
            <Badge emoji="📈" label={`${overallPct}% overall`}                      color="#60a5fa" />
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(240,192,64,0.2)',
          borderRadius: 16, padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginBottom: '0.6rem', fontSize: '0.85rem',
          }}>
            <span style={{ color: '#c8a96e' }}>🗺️ Overall Scripture Journey</span>
            <span style={{ color: '#f0c040', fontWeight: 'bold' }}>{overallPct}%</span>
          </div>
          <ProgressBar value={overallPct} max={100} color="#f0c040" height={16} />
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: '0.5rem', fontSize: '0.75rem',
            color: 'rgba(200,169,110,0.5)',
          }}>
            <span>Beginner</span>
            <span>Scholar</span>
            <span>Visionary</span>
          </div>
        </div>

        <div style={{
          display: 'flex', gap: '0.5rem',
          marginBottom: '1.5rem', flexWrap: 'wrap',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, #f0c040, #c8860a)'
                  : 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(240,192,64,0.3)',
                borderRadius: 10, padding: '0.5rem 1.1rem',
                color: activeTab === tab.id ? '#1a0a00' : '#c8a96e',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                fontSize: '0.85rem', cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: "'Georgia', serif",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem', marginBottom: '1.5rem',
            }}>
              <StatCard
                icon="🔍" label="Bible Secrets Discovered"
                value={progress.secrets} max={1000} color="#60a5fa"
                subtitle="Questions asked to Dr. Clergy"
                onClick={() => onNavigate?.('consultant')}
              />
              <StatCard
                icon="🏆" label="Quizzes Completed"
                value={progress.quizzes} max={1000} color="#f0c040"
                subtitle="Correct answers across all tiers"
                onClick={() => onNavigate?.('quiz')}
              />
              <StatCard
                icon="📖" label="Bible Chapters Read"
                value={progress.chapters} max={1189} color="#34d399"
                subtitle="Out of 1,189 total chapters"
                onClick={() => onNavigate?.('bible')}
              />
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(240,192,64,0.2)',
              borderRadius: 16, padding: '1.5rem',
              marginBottom: '1.5rem',
            }}>
              <h3 style={{ color: '#f0c040', margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 'bold' }}>
                🏅 Quiz Tier Breakdown
              </h3>
              {TIERS.map(tier => {
                const tp      = progress.tierProgress[tier] || { correct: 0, total: 0 }
                const tierPct = tp.total > 0 ? Math.round((tp.correct / tp.total) * 100) : 0
                return (
                  <div key={tier} style={{ marginBottom: '1rem' }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      marginBottom: '0.3rem', fontSize: '0.85rem',
                    }}>
                      <span style={{ color: TIER_COLORS[tier] }}>
                        {TIER_ICONS[tier]} {tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </span>
                      <span style={{ color: 'rgba(200,169,110,0.7)' }}>
                        {tp.correct} / {tp.total} correct ({tierPct}%)
                      </span>
                    </div>
                    <ProgressBar value={tp.correct} max={300} color={TIER_COLORS[tier]} height={8} />
                  </div>
                )
              })}
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(240,192,64,0.2)',
              borderRadius: 16, padding: '1.5rem',
            }}>
              <h3 style={{ color: '#f0c040', margin: '0 0 1rem', fontSize: '1rem', fontWeight: 'bold' }}>
                🕐 Recent Activity
              </h3>
              {[
                ...progress.quizHistory.slice(0, 5).map(q => ({
                  icon: q.correct ? '✅' : '❌',
                  text: `[Quiz] ${q.question}`,
                  date: q.date, correct: q.correct,
                })),
                ...progress.secretHistory.slice(0, 3).map(s => ({
                  icon: '🔍',
                  text: `[Dr. Clergy] ${s.question}`,
                  date: s.date,
                })),
                ...progress.chapterHistory.slice(0, 3).map(c => ({
                  icon: '📖',
                  text: `[Chapter] ${c.book} ${c.chapter}`,
                  date: c.date,
                })),
              ]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10)
                .map((item, i) => <HistoryItem key={i} {...item} />)
              }
              {progress.quizHistory.length === 0 &&
               progress.secretHistory.length === 0 &&
               progress.chapterHistory.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📖</div>
                  <p style={{ color: 'rgba(200,169,110,0.5)', fontSize: '0.9rem' }}>
                    No activity yet — start exploring Scripture!
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── QUIZZES TAB ── */}
        {activeTab === 'quizzes' && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(240,192,64,0.2)',
            borderRadius: 16, padding: '1.5rem',
          }}>
            <h3 style={{ color: '#f0c040', margin: '0 0 0.25rem', fontSize: '1rem' }}>🏆 Quiz History</h3>
            <p style={{ color: 'rgba(200,169,110,0.5)', fontSize: '0.8rem', margin: '0 0 1rem' }}>
              {totalQuizAnswered} answered · {totalQuizCorrect} correct · {accuracy}% accuracy
            </p>
            {progress.quizHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏆</div>
                <p style={{ color: 'rgba(200,169,110,0.5)' }}>No quizzes yet — go test your knowledge!</p>
              </div>
            ) : (
              progress.quizHistory.map((q, i) => (
                <HistoryItem key={i} icon={q.correct ? '✅' : '❌'}
                  text={`[${q.tier}] ${q.question}`} date={q.date} correct={q.correct} />
              ))
            )}
          </div>
        )}

        {/* ── SECRETS TAB ── */}
        {activeTab === 'secrets' && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(240,192,64,0.2)',
            borderRadius: 16, padding: '1.5rem',
          }}>
            <h3 style={{ color: '#60a5fa', margin: '0 0 0.25rem', fontSize: '1rem' }}>
              🔍 Questions Asked to Dr. Clergy
            </h3>
            <p style={{ color: 'rgba(200,169,110,0.5)', fontSize: '0.8rem', margin: '0 0 1rem' }}>
              {progress.secrets} total questions asked
            </p>
            {progress.secretHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
                <p style={{ color: 'rgba(200,169,110,0.5)' }}>No questions yet — ask Dr. Clergy anything!</p>
              </div>
            ) : (
              progress.secretHistory.map((s, i) => (
                <HistoryItem key={i} icon="🔍" text={s.question} date={s.date} />
              ))
            )}
          </div>
        )}

        {/* ── CHAPTERS TAB ── */}
        {activeTab === 'chapters' && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(240,192,64,0.2)',
            borderRadius: 16, padding: '1.5rem',
          }}>
            <h3 style={{ color: '#34d399', margin: '0 0 0.25rem', fontSize: '1rem' }}>📖 Bible Chapters Read</h3>
            <p style={{ color: 'rgba(200,169,110,0.5)', fontSize: '0.8rem', margin: '0 0 1rem' }}>
              {progress.chapters} of 1,189 chapters read
            </p>
            {progress.chapterHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📖</div>
                <p style={{ color: 'rgba(200,169,110,0.5)' }}>No chapters read yet — open your Bible!</p>
              </div>
            ) : (
              progress.chapterHistory.map((c, i) => (
                <HistoryItem key={i} icon="📖"
                  text={`${c.book} — Chapter ${c.chapter}`} date={c.date} />
              ))
            )}
          </div>
        )}

        {/* ── GUIDE TAB ── */}
        {activeTab === 'guide' && (
          <>
            <HowItWorks />
            <GettingStarted progress={progress} />
            <ProgressRoadmap progress={progress} />
          </>
        )}

        {/* ── Reset button ── */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,107,107,0.3)',
                borderRadius: 10, padding: '0.5rem 1.5rem',
                color: 'rgba(255,107,107,0.6)', fontSize: '0.8rem',
                cursor: 'pointer', fontFamily: "'Georgia', serif",
              }}
            >
              🗑️ Reset All Progress
            </button>
          ) : (
            <div>
              <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                ⚠️ Are you sure? This cannot be undone!
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <button
                  onClick={() => { reset(); setConfirmReset(false) }}
                  style={{
                    background: 'rgba(255,107,107,0.2)',
                    border: '1px solid #ff6b6b', borderRadius: 10,
                    padding: '0.5rem 1.5rem', color: '#ff6b6b',
                    fontSize: '0.85rem', cursor: 'pointer',
                    fontWeight: 'bold', fontFamily: "'Georgia', serif",
                  }}
                >
                  ✅ Yes, Reset Everything
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(240,192,64,0.3)',
                    borderRadius: 10, padding: '0.5rem 1.5rem',
                    color: '#c8a96e', fontSize: '0.85rem',
                    cursor: 'pointer', fontFamily: "'Georgia', serif",
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}