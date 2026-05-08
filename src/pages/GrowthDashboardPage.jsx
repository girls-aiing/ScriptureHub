import React, { useState } from 'react'

const BIBLE_BOOKS = {
  'Old Testament': [
    { name: 'Genesis', chapters: 50, read: 50 },
    { name: 'Exodus', chapters: 40, read: 32 },
    { name: 'Leviticus', chapters: 27, read: 10 },
    { name: 'Numbers', chapters: 36, read: 8 },
    { name: 'Deuteronomy', chapters: 34, read: 20 },
    { name: 'Psalms', chapters: 150, read: 75 },
    { name: 'Proverbs', chapters: 31, read: 31 },
    { name: 'Isaiah', chapters: 66, read: 30 },
  ],
  'New Testament': [
    { name: 'Matthew', chapters: 28, read: 28 },
    { name: 'Mark', chapters: 16, read: 16 },
    { name: 'Luke', chapters: 24, read: 24 },
    { name: 'John', chapters: 21, read: 21 },
    { name: 'Acts', chapters: 28, read: 15 },
    { name: 'Romans', chapters: 16, read: 16 },
    { name: 'Galatians', chapters: 6, read: 6 },
    { name: 'Revelation', chapters: 22, read: 5 },
  ]
}

const STREAK_DATA = [
  [true, true, false, true, true, true, false],
  [true, true, true, true, false, true, true],
  [false, true, true, true, true, true, true],
  [true, true, true, false, true, true, true],
]

const TOPICS_STUDIED = [
  { topic: 'Grace', count: 24, color: '#f0c040' },
  { topic: 'Faith', count: 18, color: '#c8860a' },
  { topic: 'Wisdom', count: 15, color: '#a0d8a0' },
  { topic: 'Prayer', count: 12, color: '#90c0f0' },
  { topic: 'Love', count: 10, color: '#f09090' },
  { topic: 'Prophecy', count: 8, color: '#c090f0' },
]

const MEMORY_VERSES = [
  { ref: 'John 3:16', text: 'For God so loved the world that he gave his one and only Son...' },
  { ref: 'Philippians 4:13', text: 'I can do all things through Christ who strengthens me.' },
  { ref: 'Jeremiah 29:11', text: 'For I know the plans I have for you, declares the Lord...' },
  { ref: 'Romans 8:28', text: 'And we know that in all things God works for the good...' },
]

const JOURNAL_ENTRIES = [
  { date: 'Today', note: '💡 Realized the connection between Joseph\'s suffering and Christ\'s redemption.' },
  { date: 'Yesterday', note: '🙏 Psalm 23 brought deep peace during a stressful morning.' },
  { date: '3 days ago', note: '✨ The Sermon on the Mount — the Beatitudes hit differently today.' },
  { date: '5 days ago', note: '📖 Romans 8 — no condemnation! What a powerful truth.' },
]

const GOALS = [
  { title: 'Read New Testament in 90 days', progress: 72, target: 90, unit: 'days', color: '#f0c040' },
  { title: 'Memorize 20 verses this month', progress: 14, target: 20, unit: 'verses', color: '#a0d8a0' },
  { title: 'Pray daily for 30 days', progress: 22, target: 30, unit: 'days', color: '#90c0f0' },
  { title: 'Study all Pauline Epistles', progress: 6, target: 13, unit: 'books', color: '#f09090' },
]

// Circular Progress Ring Component
function CircularRing({ percentage, size = 120, strokeWidth = 10, color = '#f0c040', label, sublabel }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text
          x="50%" y="50%"
          textAnchor="middle" dominantBaseline="middle"
          fill="#f0e6d0" fontSize="1.1rem" fontWeight="bold"
          style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
        >
          {percentage}%
        </text>
      </svg>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#f0e6d0', fontSize: '0.85rem', fontWeight: '600' }}>{label}</div>
        {sublabel && <div style={{ color: '#c8a96e', fontSize: '0.75rem' }}>{sublabel}</div>}
      </div>
    </div>
  )
}

export default function GrowthDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [flippedVerse, setFlippedVerse] = useState(null)
  const [newGoal, setNewGoal] = useState('')
  const [goals, setGoals] = useState(GOALS)

  const totalChapters = Object.values(BIBLE_BOOKS).flat().reduce((a, b) => a + b.chapters, 0)
  const readChapters = Object.values(BIBLE_BOOKS).flat().reduce((a, b) => a + b.read, 0)
  const biblePercent = Math.round((readChapters / totalChapters) * 100)

  const ntBooks = BIBLE_BOOKS['New Testament']
  const ntRead = ntBooks.reduce((a, b) => a + b.read, 0)
  const ntTotal = ntBooks.reduce((a, b) => a + b.chapters, 0)
  const ntPercent = Math.round((ntRead / ntTotal) * 100)

  const otBooks = BIBLE_BOOKS['Old Testament']
  const otRead = otBooks.reduce((a, b) => a + b.read, 0)
  const otTotal = otBooks.reduce((a, b) => a + b.chapters, 0)
  const otPercent = Math.round((otRead / otTotal) * 100)

  const currentStreak = 12
  const longestStreak = 21
  const maxTopic = Math.max(...TOPICS_STUDIED.map(t => t.count))

  const tabs = ['overview', 'progress', 'goals', 'verses', 'journal']

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a0a00 0%, #2d1500 50%, #1a0a00 100%)',
      padding: '2rem 1rem',
      fontFamily: "'Georgia', serif",
      color: '#f0e6d0'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📊</div>
        <h1 style={{
          color: '#f0c040', fontSize: '2rem', fontWeight: 'bold',
          margin: '0 0 0.25rem 0', textShadow: '0 2px 8px rgba(240,192,64,0.4)'
        }}>
          Growth Dashboard
        </h1>
        <p style={{ color: '#c8a96e', fontSize: '0.95rem', margin: 0 }}>
          Your personal spiritual mission control ✝️
        </p>
      </div>

      {/* Streak Banner */}
      <div style={{
        maxWidth: '900px', margin: '0 auto 1.5rem auto',
        background: 'linear-gradient(135deg, rgba(240,192,64,0.15), rgba(200,134,10,0.15))',
        border: '1px solid rgba(240,192,64,0.3)',
        borderRadius: '16px', padding: '1rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '2.5rem' }}>🔥</div>
          <div>
            <div style={{ color: '#f0c040', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {currentStreak} Day Streak!
            </div>
            <div style={{ color: '#c8a96e', fontSize: '0.85rem' }}>
              Longest streak: {longestStreak} days 🏆
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {STREAK_DATA.flat().map((active, i) => (
            <div key={i} style={{
              width: '28px', height: '28px', borderRadius: '6px',
              background: active
                ? 'linear-gradient(135deg, #f0c040, #c8860a)'
                : 'rgba(255,255,255,0.08)',
              border: active ? 'none' : '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem'
            }}>
              {active ? '✝' : ''}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        maxWidth: '900px', margin: '0 auto 1.5rem auto',
        display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center'
      }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '0.5rem 1.2rem',
            borderRadius: '20px',
            border: activeTab === tab ? 'none' : '1px solid rgba(240,192,64,0.3)',
            background: activeTab === tab
              ? 'linear-gradient(135deg, #f0c040, #c8860a)'
              : 'transparent',
            color: activeTab === tab ? '#1a0a00' : '#c8a96e',
            fontWeight: activeTab === tab ? 'bold' : 'normal',
            cursor: 'pointer', fontSize: '0.85rem',
            textTransform: 'capitalize', fontFamily: "'Georgia', serif"
          }}>
            {tab === 'overview' ? '🏠 Overview' :
             tab === 'progress' ? '📖 Progress' :
             tab === 'goals' ? '🎯 Goals' :
             tab === 'verses' ? '📝 Verses' : '✍️ Journal'}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Circular Rings */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '16px', border: '1px solid rgba(240,192,64,0.2)',
              padding: '1.5rem'
            }}>
              <h2 style={{ color: '#f0c040', margin: '0 0 1.5rem 0', fontSize: '1.1rem' }}>
                📖 Bible Reading Progress
              </h2>
              <div style={{
                display: 'flex', justifyContent: 'space-around',
                flexWrap: 'wrap', gap: '1.5rem'
              }}>
                <CircularRing percentage={biblePercent} color="#f0c040" label="Whole Bible" sublabel={`${readChapters}/${totalChapters} chapters`} />
                <CircularRing percentage={ntPercent} color="#90c0f0" label="New Testament" sublabel={`${ntRead}/${ntTotal} chapters`} />
                <CircularRing percentage={otPercent} color="#a0d8a0" label="Old Testament" sublabel={`${otRead}/${otTotal} chapters`} />
              </div>
            </div>

            {/* Topics Studied */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '16px', border: '1px solid rgba(240,192,64,0.2)',
              padding: '1.5rem'
            }}>
              <h2 style={{ color: '#f0c040', margin: '0 0 1.5rem 0', fontSize: '1.1rem' }}>
                🔍 Topics Studied This Month
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {TOPICS_STUDIED.map(({ topic, count, color }) => (
                  <div key={topic}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      marginBottom: '0.3rem', fontSize: '0.9rem'
                    }}>
                      <span style={{ color: '#f0e6d0' }}>{topic}</span>
                      <span style={{ color: '#c8a96e' }}>{count} sessions</span>
                    </div>
                    <div style={{
                      height: '8px', borderRadius: '4px',
                      background: 'rgba(255,255,255,0.08)', overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%', borderRadius: '4px',
                        width: `${(count / maxTopic) * 100}%`,
                        background: color,
                        transition: 'width 1s ease'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem'
            }}>
              {[
                { icon: '📖', label: 'Chapters Read', value: readChapters },
                { icon: '🧠', label: 'Verses Memorized', value: 14 },
                { icon: '🙏', label: 'Prayer Days', value: 22 },
                { icon: '✍️', label: 'Journal Entries', value: 31 },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px', border: '1px solid rgba(240,192,64,0.2)',
                  padding: '1.25rem', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
                  <div style={{ color: '#f0c040', fontSize: '1.8rem', fontWeight: 'bold' }}>{value}</div>
                  <div style={{ color: '#c8a96e', fontSize: '0.8rem' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROGRESS TAB */}
        {activeTab === 'progress' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {Object.entries(BIBLE_BOOKS).map(([testament, books]) => (
              <div key={testament} style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px', border: '1px solid rgba(240,192,64,0.2)',
                padding: '1.5rem'
              }}>
                <h2 style={{ color: '#f0c040', margin: '0 0 1.25rem 0', fontSize: '1.1rem' }}>
                  {testament === 'New Testament' ? '✝️' : '📜'} {testament}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {books.map(({ name, chapters, read }) => {
                    const pct = Math.round((read / chapters) * 100)
                    return (
                      <div key={name}>
                        <div style={{
                          display: 'flex', justifyContent: 'space-between',
                          marginBottom: '0.3rem', fontSize: '0.9rem'
                        }}>
                          <span style={{ color: '#f0e6d0' }}>{name}</span>
                          <span style={{ color: pct === 100 ? '#a0d8a0' : '#c8a96e' }}>
                            {pct === 100 ? '✅ Complete' : `${read}/${chapters} chapters`}
                          </span>
                        </div>
                        <div style={{
                          height: '8px', borderRadius: '4px',
                          background: 'rgba(255,255,255,0.08)', overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%', borderRadius: '4px',
                            width: `${pct}%`,
                            background: pct === 100
                              ? 'linear-gradient(90deg, #a0d8a0, #60b860)'
                              : 'linear-gradient(90deg, #f0c040, #c8860a)',
                            transition: 'width 1s ease'
                          }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GOALS TAB */}
        {activeTab === 'goals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '16px', border: '1px solid rgba(240,192,64,0.2)',
              padding: '1.5rem'
            }}>
              <h2 style={{ color: '#f0c040', margin: '0 0 1.25rem 0', fontSize: '1.1rem' }}>
                🎯 My Spiritual Goals
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {goals.map(({ title, progress, target, unit, color }, i) => {
                  const pct = Math.round((progress / target) * 100)
                  return (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: '12px', padding: '1rem',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem'
                      }}>
                        <span style={{ color: '#f0e6d0', fontSize: '0.9rem', fontWeight: '600' }}>{title}</span>
                        <span style={{ color, fontSize: '0.85rem', fontWeight: 'bold' }}>
                          {progress}/{target} {unit}
                        </span>
                      </div>
                      <div style={{
                        height: '10px', borderRadius: '5px',
                        background: 'rgba(255,255,255,0.08)', overflow: 'hidden',
                        marginBottom: '0.4rem'
                      }}>
                        <div style={{
                          height: '100%', borderRadius: '5px',
                          width: `${pct}%`, background: color,
                          transition: 'width 1s ease'
                        }} />
                      </div>
                      <div style={{ color: '#c8a96e', fontSize: '0.78rem' }}>{pct}% complete</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Add New Goal */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '16px', border: '1px solid rgba(240,192,64,0.2)',
              padding: '1.5rem'
            }}>
              <h2 style={{ color: '#f0c040', margin: '0 0 1rem 0', fontSize: '1.1rem' }}>
                ➕ Add New Goal
              </h2>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  value={newGoal}
                  onChange={e => setNewGoal(e.target.value)}
                  placeholder="e.g. Read Psalms in 30 days..."
                  style={{
                    flex: 1, minWidth: '200px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(240,192,64,0.3)',
                    borderRadius: '10px', padding: '0.65rem 1rem',
                    color: '#f0e6d0', fontSize: '0.9rem',
                    fontFamily: "'Georgia', serif", outline: 'none'
                  }}
                />
                <button
                  onClick={() => {
                    if (newGoal.trim()) {
                      setGoals(prev => [...prev, {
                        title: newGoal.trim(), progress: 0,
                        target: 100, unit: 'days', color: '#f0c040'
                      }])
                      setNewGoal('')
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #f0c040, #c8860a)',
                    border: 'none', borderRadius: '10px',
                    padding: '0.65rem 1.2rem', color: '#1a0a00',
                    fontWeight: 'bold', cursor: 'pointer',
                    fontFamily: "'Georgia', serif"
                  }}
                >
                  Add Goal ✝
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MEMORY VERSES TAB */}
        {activeTab === 'verses' && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '16px', border: '1px solid rgba(240,192,64,0.2)',
            padding: '1.5rem'
          }}>
            <h2 style={{ color: '#f0c040', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
              📝 Memory Verse Vault
            </h2>
            <p style={{ color: '#c8a96e', fontSize: '0.85rem', margin: '0 0 1.5rem 0' }}>
              Tap a card to reveal the verse ✨
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              {MEMORY_VERSES.map(({ ref, text }, i) => (
                <div
                  key={i}
                  onClick={() => setFlippedVerse(flippedVerse === i ? null : i)}
                  style={{
                    background: flippedVerse === i
                      ? 'linear-gradient(135deg, rgba(240,192,64,0.2), rgba(200,134,10,0.2))'
                      : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${flippedVerse === i ? 'rgba(240,192,64,0.5)' : 'rgba(240,192,64,0.2)'}`,
                    borderRadius: '14px', padding: '1.25rem',
                    cursor: 'pointer', transition: 'all 0.3s',
                    minHeight: '120px', display: 'flex',
                    flexDirection: 'column', justifyContent: 'center',
                    alignItems: 'center', textAlign: 'center', gap: '0.75rem'
                  }}
                >
                  <div style={{ color: '#f0c040', fontWeight: 'bold', fontSize: '1rem' }}>{ref}</div>
                  {flippedVerse === i ? (
                    <div style={{ color: '#f0e6d0', fontSize: '0.85rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                      "{text}"
                    </div>
                  ) : (
                    <div style={{ color: '#c8a96e', fontSize: '0.8rem' }}>Tap to reveal 👆</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JOURNAL TAB */}
        {activeTab === 'journal' && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '16px', border: '1px solid rgba(240,192,64,0.2)',
            padding: '1.5rem'
          }}>
            <h2 style={{ color: '#f0c040', margin: '0 0 1.25rem 0', fontSize: '1.1rem' }}>
              ✍️ Spiritual Journal — Recent Insights
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {JOURNAL_ENTRIES.map(({ date, note }, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '12px', padding: '1rem',
                  border: '1px solid rgba(240,192,64,0.1)',
                  borderLeft: '3px solid #f0c040'
                }}>
                  <div style={{ color: '#c8a96e', fontSize: '0.78rem', marginBottom: '0.4rem' }}>
                    📅 {date}
                  </div>
                  <div style={{ color: '#f0e6d0', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <p style={{
        color: 'rgba(200,169,110,0.5)', fontSize: '0.75rem',
        marginTop: '2rem', textAlign: 'center'
      }}>
        "But grow in the grace and knowledge of our Lord" — 2 Peter 3:18 ✝️
      </p>
    </div>
  )
}
