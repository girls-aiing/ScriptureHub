import React, { useState } from 'react'
import { useTheme } from '../context/ThemeContext.jsx'
import { playStoneCarve, playAmen, playDiscovery, playTabSwitch, playMilestone } from '../hooks/useSound.js'

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}
function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

const KEY_STONES = 'scripturehub_stones'
const KEY_EGGS   = 'scripturehub_eggs_found'

const ALL_BADGES = [
  { id: 'first_stone',   tier: 'bronze', icon: '🪨', name: 'Stone Carver',      desc: 'Carved your first Stone of Remembrance',    condition: s => s.stones >= 1 },
  { id: 'five_stones',   tier: 'silver', icon: '🏛️', name: 'Wall Builder',       desc: 'Carved 5 stones on the community wall',     condition: s => s.stones >= 5 },
  { id: 'berean',        tier: 'gold',   icon: '📜', name: 'Berean Scholar',     desc: 'Completed 10 quizzes in the Knowledge Hub', condition: s => s.quizzes >= 10 },
  { id: 'watchman',      tier: 'gold',   icon: '🔭', name: 'Faithful Watchman',  desc: 'Visited ScriptureHub 7 days in a row',      condition: s => s.streak >= 7 },
  { id: 'explorer',      tier: 'silver', icon: '🗺️', name: 'Land Explorer',      desc: 'Found 3 hidden Easter eggs',                condition: s => s.eggs >= 3 },
  { id: 'prophet',       tier: 'gold',   icon: '🕊️', name: "Prophet's Disciple", desc: "Completed a full Prophet's Path mission",   condition: s => s.missions >= 1 },
  { id: 'reader',        tier: 'bronze', icon: '📖', name: 'Word Seeker',        desc: 'Read 10 Bible chapters',                    condition: s => s.chapters >= 10 },
  { id: 'secret_keeper', tier: 'silver', icon: '🔍', name: 'Secret Keeper',      desc: 'Discovered 25 biblical secrets',            condition: s => s.secrets >= 25 },
  { id: 'amen_giver',    tier: 'bronze', icon: '🙏', name: 'Amen Giver',         desc: 'Gave 5 Amens to community stones',          condition: s => s.amens >= 5 },
  { id: 'treasure',      tier: 'gold',   icon: '💎', name: 'Treasure Hunter',    desc: 'Earned 5 different badges',                 condition: s => s.badgeCount >= 5 },
]

const MISSIONS = [
  {
    id: 'nehemiah', title: "Nehemiah's Burden", icon: '🏰',
    subtitle: "The walls of Jerusalem lie in ruins. You are the king's cupbearer.",
    steps: [
      {
        scene: 'The king notices your sad face and asks: "Why does your face look so sad?" Your heart races. Speaking of sadness before the king could mean death.',
        verse: 'Nehemiah 2:2 — "I was very much afraid."',
        choices: [
          { text: 'Pray silently, then speak boldly', outcome: 'wise',    result: 'You breathe a prayer and speak with courage. The king listens.' },
          { text: 'Say nothing and look away',        outcome: 'unwise',  result: 'The moment passes. The walls remain broken. Opportunity lost.' },
          { text: 'Tell the king everything at once', outcome: 'neutral', result: 'The king is surprised but intrigued. He asks more questions.' },
        ],
      },
      {
        scene: 'The king asks: "What is it you want?" You have one moment to make your request. The future of Jerusalem hangs on your words.',
        verse: 'Nehemiah 2:4 — "Then I prayed to the God of heaven, and I answered the king."',
        choices: [
          { text: 'Pray first, then ask specifically', outcome: 'wise',    result: 'Your specific request impresses the king. He grants everything.' },
          { text: 'Ask for unlimited resources',       outcome: 'unwise',  result: "The king frowns. Greed has no place in God's work." },
          { text: 'Ask only for safe passage',         outcome: 'neutral', result: 'You receive passage but must trust God for the rest.' },
        ],
      },
      {
        scene: 'Enemies mock you: "What are you doing? Are you rebelling against the king?" The workers look to you for leadership.',
        verse: 'Nehemiah 2:20 — "The God of heaven will give us success."',
        choices: [
          { text: "Declare God's purpose and keep building", outcome: 'wise',    result: 'Your faith inspires the workers. The wall rises higher.' },
          { text: 'Argue back with the enemies',             outcome: 'unwise',  result: 'You waste precious time. The workers grow discouraged.' },
          { text: 'Send a letter to the king for help',      outcome: 'neutral', result: 'Help comes, but slowly. The work continues.' },
        ],
      },
    ],
  },
  {
    id: 'esther', title: "Esther's Courage", icon: '👑',
    subtitle: 'Your people face destruction. You are queen — but approaching the king uninvited means death.',
    steps: [
      {
        scene: 'Mordecai tells you: "Who knows whether you have not come to the kingdom for such a time as this?" Your cousin urges you to go to the king.',
        verse: 'Esther 4:14 — "For such a time as this."',
        choices: [
          { text: 'Fast for 3 days, then go boldly',   outcome: 'wise',    result: 'You prepare spiritually. God goes before you.' },
          { text: 'Refuse — it is too dangerous',       outcome: 'unwise',  result: 'Mordecai warns: deliverance will come another way, but you will perish.' },
          { text: 'Send a message to the king instead', outcome: 'neutral', result: 'The message is received but the king wants to see you in person.' },
        ],
      },
      {
        scene: 'The king extends his golden sceptre. He offers: "What is your request? Up to half the kingdom." This is your moment.',
        verse: 'Esther 5:3 — "What is your request?"',
        choices: [
          { text: 'Invite him to a banquet first',   outcome: 'wise',    result: "Wisdom! You build the moment carefully. The king's heart softens." },
          { text: "Immediately expose Haman's plot", outcome: 'neutral', result: 'The king is shocked but listens. The outcome is uncertain.' },
          { text: 'Ask for wealth to flee',          outcome: 'unwise',  result: 'You abandon your people. This is not the way of faith.' },
        ],
      },
    ],
  },
]

const EASTER_EGGS = [
  { id: 'scroll', icon: '📜', label: 'Ancient Scroll', secret: 'The Bible contains 3,566,480 letters, 810,697 words, and 31,102 verses. Every single one is God-breathed.' },
  { id: 'olive',  icon: '🫒', label: 'Olive Branch',   secret: 'The olive tree can live for over 2,000 years. Some trees in the Garden of Gethsemane may have witnessed Jesus praying.' },
  { id: 'dove',   icon: '🕊️', label: 'Dove of Peace',  secret: "The dove appears at Jesus' baptism — the only moment all three persons of the Trinity appear together (Matthew 3:16)." },
  { id: 'lamp',   icon: '🪔', label: 'Oil Lamp',       secret: "God's lamp never goes out. Psalm 119:105 — Your word is a lamp to my feet and a light to my path." },
  { id: 'fish',   icon: '🐟', label: 'Ichthus Fish',   secret: 'Early Christians used the fish as a secret code. ΙΧΘΥΣ means "Jesus Christ, Son of God, Saviour" in Greek.' },
]

const SAMPLE_STONES = [
  { id: 's1', name: 'Grace M.',  text: '"He restores my soul." — Psalm 23:3. This verse carried me through the darkest year of my life. God is faithful.', amens: 24, color: '#8B7355' },
  { id: 's2', name: 'David K.',  text: 'Reading Nehemiah reminded me that every great work faces opposition — but God completes it.', amens: 18, color: '#7a6545' },
  { id: 's3', name: 'Faith O.',  text: '"For such a time as this." — Esther 4:14. You are not here by accident. Your life has divine purpose.', amens: 31, color: '#9B8465' },
  { id: 's4', name: 'Samuel T.', text: 'From Creation to Pentecost — one unbroken story orchestrated by God!', amens: 12, color: '#6B5535' },
  { id: 's5', name: 'Ruth A.',   text: '"The Lord is my shepherd." Three words that changed everything. I was lost. Now I am found.', amens: 45, color: '#8B7355' },
  { id: 's6', name: 'Elijah P.', text: 'The way Isaiah 7:14 connects to Matthew 1:23 gave me chills. The Bible is ONE book.', amens: 22, color: '#7a6545' },
]

export default function CommunityPage() {
  const { darkMode } = useTheme()
  const [tab, setTab] = useState('wall')

  const C = darkMode ? {
    pageBg: '#0a0500', cardBg: '#1e1008', cardBorder: 'rgba(201,168,76,0.25)',
    title: '#f5ead8', sub: '#c8b89a', gold: '#f0c040', text: '#f5ead8',
    muted: '#c8b89a', inputBg: '#2a1810', inputBorder: 'rgba(201,168,76,0.35)',
    inputColor: '#f5ead8', tabActive: 'rgba(201,168,76,0.2)',
  } : {
    pageBg: '#fafaf8', cardBg: '#ffffff', cardBorder: '#e0d8c8',
    title: '#1a1a2e', sub: '#555555', gold: '#8a6000', text: '#1a1a2e',
    muted: '#666666', inputBg: '#ffffff', inputBorder: '#c9a84c',
    inputColor: '#1a1a2e', tabActive: 'rgba(201,168,76,0.2)',
  }

  const TABS = [
    { id: 'wall',    label: '🪨 Stone Wall' },
    { id: 'badges',  label: '🏆 Treasure Chest' },
    { id: 'prophet', label: "🕊️ Prophet's Path" },
    { id: 'eggs',    label: '🔍 Easter Eggs' },
  ]

  return (
    <div style={{ background: C.pageBg, minHeight: '100vh', padding: '2rem 1.5rem', fontFamily: 'Georgia,serif' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ color: C.gold, fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>
            ✝ ScriptureHub Community
          </p>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: '800', color: C.title, margin: '0 0 0.75rem' }}>
            The Living Stone Wall
          </h1>
          <p style={{ fontSize: '1rem', color: C.sub, maxWidth: '540px', margin: '0 auto', lineHeight: '1.75' }}>
            Carve your faith, earn rare badges, walk the Prophet's Path, and discover hidden treasures.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); playTabSwitch() }} style={{
              background: tab === t.id ? C.tabActive : 'transparent',
              border: '2px solid ' + (tab === t.id ? '#c9a84c' : C.cardBorder),
              borderRadius: '999px', padding: '0.5rem 1.25rem',
              color: tab === t.id ? '#c9a84c' : C.muted,
              fontFamily: 'Georgia,serif', fontSize: '0.9rem',
              fontWeight: tab === t.id ? '700' : '500',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>

        {tab === 'wall'    && <StoneWall     C={C} />}
        {tab === 'badges'  && <TreasureChest C={C} />}
        {tab === 'prophet' && <ProphetPath   C={C} />}
        {tab === 'eggs'    && <EasterEggs    C={C} />}

      </div>
    </div>
  )
}

function StoneWall({ C }) {
  const [stones,    setStones]    = useState(() => loadJSON(KEY_STONES, SAMPLE_STONES))
  const [name,      setName]      = useState('')
  const [text,      setText]      = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [amened,    setAmened]    = useState(() => loadJSON('scripturehub_amened', []))
  const COLORS = ['#8B7355','#7a6545','#9B8465','#6B5535','#8a7050','#705a40']

  function carveStone() {
    if (!name.trim() || !text.trim()) return
    const s = {
      id: 's' + Date.now(), name: name.trim(), text: text.trim(), amens: 0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }
    const updated = [s, ...stones]
    setStones(updated); saveJSON(KEY_STONES, updated)
    const stats = loadJSON('scripturehub_stats', {}); stats.stones = (stats.stones || 0) + 1
    saveJSON('scripturehub_stats', stats)
    setName(''); setText(''); setSubmitted(true)
    playStoneCarve()
    setTimeout(() => setSubmitted(false), 3000)
  }

  function giveAmen(id) {
    if (amened.includes(id)) return
    playAmen()
    const updated = stones.map(s => s.id === id ? { ...s, amens: s.amens + 1 } : s)
    setStones(updated); saveJSON(KEY_STONES, updated)
    const na = [...amened, id]; setAmened(na); saveJSON('scripturehub_amened', na)
    const stats = loadJSON('scripturehub_stats', {}); stats.amens = (stats.amens || 0) + 1
    saveJSON('scripturehub_stats', stats)
    const earned = ALL_BADGES.filter(b => b.condition(stats))
    if (earned.length >= 5) playMilestone()
  }

  return (
    <div>
      <div style={{ background: C.cardBg, border: '2px solid ' + C.cardBorder, borderLeft: '4px solid #c9a84c', borderRadius: '0 14px 14px 0', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ color: C.gold, fontWeight: '800', fontSize: '1.1rem', margin: '0 0 0.25rem' }}>✍️ Carve Your Stone</h3>
        <p style={{ color: C.muted, fontSize: '0.85rem', margin: '0 0 1rem', lineHeight: '1.6' }}>Share a verse or testimony. Your stone becomes part of the wall forever.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" maxLength={40}
            style={{ background: C.inputBg, border: '2px solid ' + C.inputBorder, borderRadius: '8px', padding: '0.7rem 1rem', color: C.inputColor, fontSize: '0.95rem', fontFamily: 'Georgia,serif', outline: 'none' }} />
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Carve your verse or encouragement here... (max 280 characters)" maxLength={280} rows={3}
            style={{ background: C.inputBg, border: '2px solid ' + C.inputBorder, borderRadius: '8px', padding: '0.7rem 1rem', color: C.inputColor, fontSize: '0.95rem', fontFamily: 'Georgia,serif', outline: 'none', resize: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ color: C.muted, fontSize: '0.78rem' }}>{text.length}/280</span>
            <button onClick={carveStone} disabled={!name.trim() || !text.trim()} style={{
              background: (!name.trim() || !text.trim()) ? '#888' : 'linear-gradient(135deg,#c9a84c,#a07830)',
              color: (!name.trim() || !text.trim()) ? '#ccc' : '#1a0a00',
              border: 'none', borderRadius: '10px', padding: '0.7rem 1.75rem',
              fontWeight: '800', fontSize: '0.95rem',
              cursor: (!name.trim() || !text.trim()) ? 'not-allowed' : 'pointer',
              fontFamily: 'Georgia,serif',
            }}>
              {submitted ? '✅ Stone Carved!' : '🪨 Carve My Stone'}
            </button>
          </div>
        </div>
      </div>

      <h3 style={{ color: C.title, fontWeight: '800', fontSize: '1.1rem', marginBottom: '1.25rem' }}>
        🏛️ The Wall of Remembrance — {stones.length} Stones
      </h3>
      <div style={{ columns: '2', columnGap: '1rem' }}>
        {stones.map(stone => (
          <StoneCard key={stone.id} stone={stone} C={C} onAmen={giveAmen} amened={amened.includes(stone.id)} />
        ))}
      </div>
    </div>
  )
}

function StoneCard({ stone, C, onAmen, amened }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        breakInside: 'avoid', marginBottom: '1rem',
        background: 'linear-gradient(145deg,' + stone.color + '22,' + stone.color + '11)',
        border: '2px solid ' + (hovered ? '#c9a84c' : stone.color + '55'),
        borderRadius: '12px', padding: '1.1rem',
        transition: 'all 0.22s', transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 6px 20px ' + stone.color + '30' : 'none',
        fontFamily: 'Georgia,serif', position: 'relative', overflow: 'hidden',
      }}>
      <p style={{ color: C.text, fontSize: '0.92rem', lineHeight: '1.75', margin: '0 0 0.85rem', fontStyle: 'italic', fontWeight: '500' }}>
        "{stone.text}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
        <span style={{ color: '#c9a84c', fontSize: '0.8rem', fontWeight: '700' }}>
          — {stone.name}{stone.date ? ' · ' + stone.date : ''}
        </span>
        <button onClick={() => onAmen(stone.id)} style={{
          background: amened ? 'rgba(201,168,76,0.15)' : 'transparent',
          border: '1px solid ' + (amened ? '#c9a84c' : C.cardBorder),
          borderRadius: '999px', padding: '0.25rem 0.75rem',
          color: amened ? '#c9a84c' : C.muted, fontSize: '0.78rem',
          fontWeight: '700', cursor: amened ? 'default' : 'pointer',
          fontFamily: 'Georgia,serif',
        }}>
          🙏 {stone.amens} {amened ? 'Amen ✓' : 'Amen'}
        </button>
      </div>
    </div>
  )
}

function TreasureChest({ C }) {
  const stats = loadJSON('scripturehub_stats', { stones:0, quizzes:0, streak:0, eggs:0, missions:0, chapters:0, secrets:0, amens:0, badgeCount:0 })
  stats.quizzes  = Math.max(stats.quizzes  || 0, loadJSON('scripturehub_quizzes_done', 0))
  stats.chapters = Math.max(stats.chapters || 0, loadJSON('scripturehub_chapters_read', 0))
  stats.secrets  = Math.max(stats.secrets  || 0, loadJSON('scripturehub_secrets_seen', 0))
  stats.streak   = Math.max(stats.streak   || 0, loadJSON('scripturehub_streak', 0))
  const earned = ALL_BADGES.filter(b => b.condition(stats))
  stats.badgeCount = earned.length

  const TIER = {
    gold:   { bg: 'linear-gradient(135deg,#f0c040,#c9a84c,#f0c040)', shadow: '0 4px 20px rgba(240,192,64,0.5)', border: '#f0c040' },
    silver: { bg: 'linear-gradient(135deg,#e0e0e0,#b0b0b0,#e0e0e0)', shadow: '0 4px 16px rgba(180,180,180,0.4)', border: '#c0c0c0' },
    bronze: { bg: 'linear-gradient(135deg,#cd7f32,#a0522d,#cd7f32)', shadow: '0 4px 14px rgba(205,127,50,0.4)', border: '#cd7f32' },
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <h3 style={{ color: C.title, fontWeight: '800', fontSize: '1.3rem', margin: '0 0 0.4rem' }}>💎 Your Treasure Chest</h3>
        <p style={{ color: C.muted, fontSize: '0.9rem', margin: 0 }}>{earned.length} of {ALL_BADGES.length} badges earned — keep exploring!</p>
      </div>

      {earned.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: '#c9a84c', fontWeight: '700', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>✨ Earned Badges</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '1rem' }}>
            {earned.map(badge => {
              const ts = TIER[badge.tier]
              return (
                <div key={badge.id} style={{ textAlign: 'center', padding: '1.25rem 0.75rem', background: C.cardBg, border: '2px solid ' + ts.border, borderRadius: '14px', boxShadow: ts.shadow, fontFamily: 'Georgia,serif' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: ts.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '1.6rem', boxShadow: ts.shadow }}>{badge.icon}</div>
                  <p style={{ color: C.title, fontWeight: '800', fontSize: '0.88rem', margin: '0 0 0.3rem' }}>{badge.name}</p>
                  <p style={{ color: C.muted, fontSize: '0.75rem', margin: 0, lineHeight: '1.5' }}>{badge.desc}</p>
                  <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: ts.border, background: ts.border + '22', borderRadius: '999px', padding: '0.15rem 0.6rem' }}>{badge.tier}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <p style={{ color: C.muted, fontWeight: '700', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>🔒 Locked Badges</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '1rem' }}>
        {ALL_BADGES.filter(b => !b.condition(stats)).map(badge => (
          <div key={badge.id} style={{ textAlign: 'center', padding: '1.25rem 0.75rem', background: C.cardBg, border: '2px solid ' + C.cardBorder, borderRadius: '14px', opacity: 0.55, fontFamily: 'Georgia,serif' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: C.cardBorder, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontSize: '1.6rem', filter: 'grayscale(1)' }}>{badge.icon}</div>
            <p style={{ color: C.muted, fontWeight: '700', fontSize: '0.88rem', margin: '0 0 0.3rem' }}>{badge.name}</p>
            <p style={{ color: C.muted, fontSize: '0.75rem', margin: 0, lineHeight: '1.5' }}>{badge.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProphetPath({ C }) {
  const [missionIdx, setMissionIdx] = useState(null)
  const [stepIdx,    setStepIdx]    = useState(0)
  const [choices,    setChoices]    = useState([])
  const [done,       setDone]       = useState(false)
  const [score,      setScore]      = useState(0)
  const mission = missionIdx !== null ? MISSIONS[missionIdx] : null

  function startMission(idx) { setMissionIdx(idx); setStepIdx(0); setChoices([]); setDone(false); setScore(0) }
  function backToList()      { setMissionIdx(null); setStepIdx(0); setChoices([]); setDone(false); setScore(0) }

  function makeChoice(choice) {
    const nc = [...choices, choice]
    setChoices(nc)
    const ns = score + (choice.outcome === 'wise' ? 2 : choice.outcome === 'neutral' ? 1 : 0)
    setScore(ns)
    if (stepIdx + 1 >= mission.steps.length) {
      setDone(true)
      const stats = loadJSON('scripturehub_stats', {}); stats.missions = (stats.missions || 0) + 1
      saveJSON('scripturehub_stats', stats)
      if (ns >= mission.steps.length * 2 * 0.8) playMilestone()
    } else {
      setStepIdx(s => s + 1)
    }
  }

  const maxScore = mission ? mission.steps.length * 2 : 0

  if (missionIdx === null) {
    return (
      <div>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h3 style={{ color: C.title, fontWeight: '800', fontSize: '1.3rem', margin: '0 0 0.4rem' }}>🕊️ The Prophet's Path</h3>
          <p style={{ color: C.muted, fontSize: '0.9rem', margin: '0 auto', lineHeight: '1.7', maxWidth: '520px' }}>
            Step into the sandals of biblical figures. Every choice shapes the story.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.1rem' }}>
          {MISSIONS.map((m, i) => <MissionCard key={m.id} mission={m} C={C} onClick={() => startMission(i)} />)}
        </div>
      </div>
    )
  }

  const step = mission.steps[stepIdx]
  const progress = (stepIdx / mission.steps.length) * 100

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <button onClick={backToList} style={{ background: 'none', border: 'none', color: '#c9a84c', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'Georgia,serif', marginBottom: '1.25rem', padding: 0 }}>
        ← Back to Missions
      </button>

      <div style={{ background: C.cardBg, border: '1px solid ' + C.cardBorder, borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '2rem' }}>{mission.icon}</span>
          <div>
            <h3 style={{ color: C.title, fontWeight: '800', fontSize: '1.1rem', margin: 0 }}>{mission.title}</h3>
            <p style={{ color: C.muted, fontSize: '0.82rem', margin: 0 }}>{mission.subtitle}</p>
          </div>
        </div>
        <div style={{ height: '6px', background: C.cardBorder, borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: progress + '%', background: 'linear-gradient(90deg,#c9a84c,#f0c040)', borderRadius: '99px', transition: 'width 0.5s' }} />
        </div>
        <p style={{ color: C.muted, fontSize: '0.78rem', margin: '0.4rem 0 0', textAlign: 'right' }}>Step {stepIdx + 1} of {mission.steps.length}</p>
      </div>

      {!done ? (
        <>
          <div style={{ background: C.cardBg, border: '2px solid ' + C.cardBorder, borderLeft: '4px solid #c9a84c', borderRadius: '0 14px 14px 0', padding: '1.5rem', marginBottom: '1.25rem' }}>
            <p style={{ color: C.text, fontSize: '1rem', lineHeight: '1.8', margin: '0 0 1rem', fontWeight: '500' }}>{step.scene}</p>
            <p style={{ color: '#c9a84c', fontSize: '0.85rem', fontStyle: 'italic', margin: 0, fontWeight: '600' }}>📜 {step.verse}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {step.choices.map((choice, i) => (
              <button key={i} onClick={() => makeChoice(choice)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.background = C.cardBorder }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.cardBorder; e.currentTarget.style.background = C.cardBg }}
                style={{ background: C.cardBg, border: '2px solid ' + C.cardBorder, borderRadius: '12px', padding: '1rem 1.25rem', textAlign: 'left', color: C.text, fontFamily: 'Georgia,serif', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', lineHeight: '1.6', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#c9a84c', fontWeight: '800', minWidth: '20px' }}>{String.fromCharCode(65 + i)}.</span>
                {choice.text}
              </button>
            ))}
          </div>
          {choices.length > 0 && (
            <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', background: choices[choices.length-1].outcome === 'wise' ? 'rgba(39,174,96,0.1)' : choices[choices.length-1].outcome === 'unwise' ? 'rgba(231,76,60,0.08)' : 'rgba(201,168,76,0.1)', border: '1px solid ' + (choices[choices.length-1].outcome === 'wise' ? '#27ae60' : choices[choices.length-1].outcome === 'unwise' ? '#e74c3c' : '#c9a84c'), borderRadius: '10px' }}>
              <p style={{ color: choices[choices.length-1].outcome === 'wise' ? '#27ae60' : choices[choices.length-1].outcome === 'unwise' ? '#e74c3c' : '#c9a84c', fontFamily: 'Georgia,serif', fontSize: '0.9rem', margin: 0, fontWeight: '600', lineHeight: '1.6' }}>
                {choices[choices.length-1].outcome === 'wise' ? '✅' : choices[choices.length-1].outcome === 'unwise' ? '❌' : '⚡'} {choices[choices.length-1].result}
              </p>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', background: C.cardBg, border: '2px solid ' + (score >= maxScore * 0.7 ? '#c9a84c' : C.cardBorder), borderRadius: '16px' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.75rem' }}>
            {score >= maxScore * 0.8 ? '🏆' : score >= maxScore * 0.5 ? '⭐' : '📜'}
          </span>
          <h3 style={{ color: C.title, fontWeight: '800', fontSize: '1.3rem', margin: '0 0 0.5rem', fontFamily: 'Georgia,serif' }}>Mission Complete!</h3>
          <p style={{ color: '#c9a84c', fontWeight: '800', fontSize: '1.1rem', margin: '0 0 0.75rem', fontFamily: 'Georgia,serif' }}>Wisdom Score: {score}/{maxScore}</p>
          <p style={{ color: C.muted, fontSize: '0.9rem', lineHeight: '1.7', margin: '0 0 1.5rem', fontFamily: 'Georgia,serif' }}>
            {score >= maxScore * 0.8 ? 'Excellent! You walked in wisdom.' : score >= maxScore * 0.5 ? 'Good effort! Wisdom grows with practice.' : 'Keep studying! Try again.'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => startMission(missionIdx)} style={{ background: 'linear-gradient(135deg,#c9a84c,#a07830)', color: '#1a0a00', border: 'none', borderRadius: '10px', padding: '0.75rem 1.5rem', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'Georgia,serif' }}>Try Again</button>
            <button onClick={backToList} style={{ background: 'transparent', color: '#c9a84c', border: '2px solid #c9a84c', borderRadius: '10px', padding: '0.75rem 1.5rem', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'Georgia,serif' }}>All Missions</button>
          </div>
        </div>
      )}
    </div>
  )
}

function MissionCard({ mission, C, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? C.cardBorder : C.cardBg, border: '2px solid ' + (hovered ? '#c9a84c' : C.cardBorder), borderRadius: '14px', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.22s', transform: hovered ? 'translateY(-3px)' : 'none', boxShadow: hovered ? '0 8px 24px rgba(201,168,76,0.2)' : 'none', fontFamily: 'Georgia,serif' }}>
      <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>{mission.icon}</span>
      <h3 style={{ color: C.title, fontWeight: '800', fontSize: '1.05rem', margin: '0 0 0.4rem' }}>{mission.title}</h3>
      <p style={{ color: C.muted, fontSize: '0.88rem', lineHeight: '1.65', margin: '0 0 0.85rem' }}>{mission.subtitle}</p>
      <p style={{ color: C.muted, fontSize: '0.78rem', margin: '0 0 0.75rem' }}>{mission.steps.length} decisions to make</p>
      <span style={{ color: '#c9a84c', fontWeight: '700', fontSize: '0.88rem' }}>Begin Mission →</span>
    </div>
  )
}

function EasterEggs({ C }) {
  const [found,    setFound]    = useState(() => loadJSON(KEY_EGGS, []))
  const [revealed, setRevealed] = useState(null)

  function findEgg(egg) {
    const nf = found.includes(egg.id) ? found : [...found, egg.id]
    setFound(nf); saveJSON(KEY_EGGS, nf); setRevealed(egg)
    playDiscovery()
    const stats = loadJSON('scripturehub_stats', {}); stats.eggs = nf.length
    saveJSON('scripturehub_stats', stats)
    if (nf.length >= 3) playMilestone()
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <h3 style={{ color: C.title, fontWeight: '800', fontSize: '1.3rem', margin: '0 0 0.4rem' }}>🔍 Hidden Easter Eggs</h3>
        <p style={{ color: C.muted, fontSize: '0.9rem', margin: 0, lineHeight: '1.7' }}>
          {found.length} of {EASTER_EGGS.length} secrets discovered. Click each symbol to reveal ancient wisdom.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {EASTER_EGGS.map(egg => <EggCard key={egg.id} egg={egg} isFound={found.includes(egg.id)} C={C} onClick={() => findEgg(egg)} />)}
      </div>
      {revealed && (
        <div style={{ background: 'linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.06))', border: '2px solid rgba(201,168,76,0.4)', borderRadius: '14px', padding: '1.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>{revealed.icon}</span>
          <h4 style={{ color: '#c9a84c', fontWeight: '800', fontSize: '1rem', margin: '0 0 0.75rem', fontFamily: 'Georgia,serif' }}>✨ {revealed.label} — Secret Revealed!</h4>
          <p style={{ color: C.text, fontSize: '0.95rem', lineHeight: '1.8', margin: 0, fontFamily: 'Georgia,serif', fontStyle: 'italic', fontWeight: '500' }}>"{revealed.secret}"</p>
        </div>
      )}
      <div style={{ marginTop: '1.5rem', background: C.cardBg, border: '1px solid ' + C.cardBorder, borderRadius: '12px', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: C.muted, fontSize: '0.82rem', fontFamily: 'Georgia,serif', fontWeight: '600' }}>Discovery Progress</span>
          <span style={{ color: '#c9a84c', fontWeight: '800', fontSize: '0.82rem', fontFamily: 'Georgia,serif' }}>{found.length}/{EASTER_EGGS.length}</span>
        </div>
        <div style={{ height: '8px', background: C.cardBorder, borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: ((found.length / EASTER_EGGS.length) * 100) + '%', background: 'linear-gradient(90deg,#c9a84c,#f0c040)', borderRadius: '99px', transition: 'width 0.6s' }} />
        </div>
        {found.length === EASTER_EGGS.length && (
          <p style={{ color: '#27ae60', fontWeight: '800', fontSize: '0.88rem', fontFamily: 'Georgia,serif', margin: '0.75rem 0 0', textAlign: 'center' }}>
            🎉 All secrets discovered! You have earned the Explorer badge!
          </p>
        )}
      </div>
    </div>
  )
}

function EggCard({ egg, isFound, C, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: isFound ? 'rgba(201,168,76,0.12)' : hovered ? C.cardBorder : C.cardBg, border: '2px solid ' + (isFound ? '#c9a84c' : hovered ? '#c9a84c' : C.cardBorder), borderRadius: '14px', padding: '1.25rem 0.75rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.22s', transform: hovered ? 'translateY(-3px) scale(1.03)' : 'none', boxShadow: hovered || isFound ? '0 6px 20px rgba(201,168,76,0.25)' : 'none', fontFamily: 'Georgia,serif' }}>
      <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '0.5rem', filter: isFound ? 'none' : hovered ? 'none' : 'grayscale(0.6)', transition: 'filter 0.2s' }}>{egg.icon}</span>
      <p style={{ color: isFound ? '#c9a84c' : C.muted, fontSize: '0.78rem', fontWeight: '700', margin: 0 }}>{isFound ? egg.label : '???'}</p>
      {isFound && <p style={{ color: '#27ae60', fontSize: '0.7rem', margin: '0.2rem 0 0', fontWeight: '700' }}>✓ Found</p>}
    </div>
  )
}