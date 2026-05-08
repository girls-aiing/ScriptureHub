import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const SCRIPTS = {
  '/':             `Welcome to ScriptureHub — your sacred digital companion. Here on the home page, you will find your verse of the day, quick access to the Bible reader, and your personal growth dashboard. May your time here draw you closer to the Word of God.`,
  '/bible':        `Welcome to the Word. Here in the Bible Reader, you can explore different translations such as the King James Version, the NIV, and many more. Use the book and chapter selectors to navigate scripture. You can highlight your favourite verses and save personal notes in your journal.`,
  '/quizzes':      `Welcome to the Knowledge Hub. Here you can test and grow your understanding of scripture through carefully crafted Bible quizzes. Choose your difficulty level — from beginner to scholar — and challenge yourself to go deeper into the Word.`,
  '/ai':           `Welcome to your AI Scripture Consultant. This is your personal Bible study assistant, available any time. You can ask questions about any verse, request explanations of biblical events, explore theological topics, or simply ask for encouragement.`,
  '/dashboard':    `Welcome to your Growth Dashboard. This is your personal spiritual progress centre. Here you can track your reading streak, review your quiz scores, monitor your study goals, and celebrate the milestones you have reached on your faith journey.`,
  '/did-you-know': `Welcome to Did You Know — a treasury of biblical secrets. Each card here reveals a fascinating fact, a hidden connection, or a surprising truth from scripture that most people have never discovered. Click any card to reveal its secret.`,
  '/games':        `Welcome to the Spiritual Arcade — where faith meets fun! Here you will find sixteen interactive games designed to strengthen your knowledge of scripture. Choose any game to begin. Every game is rooted in the Word of God. May you grow in wisdom as you play!`,
  '/community':    `Welcome to the ScriptureHub Community. Here you can carve your own stone of remembrance by sharing a verse or testimony that has touched your heart. You can also earn treasure chest badges, walk the Prophet's Path, and discover hidden Easter eggs filled with ancient wisdom.`,
  '/settings':     `Welcome to Settings. Here you can personalise your entire ScriptureHub experience. Choose your preferred language, adjust the appearance, set your daily reading goal, and manage all your account data.`,
  '/games/speedtyper':  `Welcome to Speed Typer! A Bible verse will appear on screen. Type it out as fast and accurately as you can. Your words per minute and accuracy will both be tracked. The faster and more accurate you type, the better your score. Take a deep breath and begin when you are ready!`,
  '/games/swipe':       `Welcome to Swipe True or False! I will show you a Bible statement one at a time. Press the TRUE button if the statement is correct, or the FALSE button if it is wrong. You have ten questions in total. Trust what you know from the Word and go with your heart!`,
  '/games/fillblank':   `Welcome to Fill the Blank! Each question shows you a Bible verse with one missing word. Choose the correct word from the four options given. The scripture reference is shown at the top to help guide you. May the Word of God be hidden in your heart!`,
  '/games/whoami':      `Welcome to Who Am I! I will give you clues one at a time about a famous Bible character. Try to guess who it is with as few clues as possible — the fewer clues you use, the more points you earn. You can reveal more clues if you need help. Think carefully — who could it be?`,
  '/games/lightning':   `Welcome to Lightning Round — the sixty second Bible blitz! Answer as many Bible trivia questions as you can before the timer runs out. Tap your answer quickly and move straight on to the next question. Questions get harder as your rank increases. Are you ready? Let us go!`,
  '/games/scramble':    `Welcome to Scripture Scramble! The words of a Bible verse have been shuffled out of order. Click the words one by one in the correct order to rebuild the verse from scratch. Take your time, think carefully, and let the Holy Spirit guide your memory!`,
  '/games/wordle':      `Welcome to Verse Wordle! Your challenge is to guess a five letter Bible word in six tries or fewer. After each guess I will show you which letters are correct, which are in the wrong position, and which are not in the word at all. Use the hint shown at the top to help you find the answer!`,
  '/games/hangman':     `Welcome to Bible Hangman! A hidden biblical word is waiting to be discovered. Guess one letter at a time to reveal the word. You have six wrong guesses before the game ends. Use the category label and the hint shown on screen to guide your thinking. Choose your letters wisely!`,
  '/games/prophecy':    `Welcome to Prophetic Connections! On the left side you will see Old Testament prophecies. On the right side are their New Testament fulfilments. Click an Old Testament prophecy first, then click its matching New Testament fulfilment. Discover how God's Word connects beautifully across the centuries!`,
  '/games/chronology':  `Welcome to Chronology Challenge! The ten Bible events shown on screen are out of their correct historical order. Drag and drop them into the right sequence from earliest to latest. Think carefully through the flow of Scripture — from the creation of the world all the way to Pentecost!`,
  '/games/emoji':       `Welcome to Emoji Bible! I will show you a sequence of emojis that represent a well known Bible story. Your job is to choose which story the emojis are describing from the four options given. Have fun, think creatively, and let the pictures speak to you!`,
  '/games/nameBook':    `Welcome to Name That Book! I will show you a verse from the Bible. Your challenge is to identify which book of the Bible that verse comes from. Choose from the four options provided. How well do you truly know your Scripture? Let us find out!`,
  '/games/wisdom':      `Welcome to Wisdom Grid — logic puzzles drawn straight from Scripture! Read each question carefully and think through the biblical context before choosing your answer. These questions require both knowledge and wisdom. Remember — the fear of the Lord is the beginning of wisdom!`,
  '/games/connections': `Welcome to Daily Connections! Sixteen biblical words are arranged on screen. Your challenge is to find four groups of four words that each share a hidden biblical connection. Select four words and submit your group. Think carefully — some connections are cleverly disguised. Good luck!`,
  '/games/map':         `Welcome to Biblical Map Quest! I will name a sacred location from the Bible and give you a clue about it. Click on the correct spot on the ancient map to identify where that location is. Learn the geography of the Holy Land as you explore the world of Scripture!`,
  '/games/swordDrill':  `Welcome to Sword Drill! I will show you a Bible verse on screen. Your challenge is to type the correct book, chapter, and verse reference as fast as you can before the thirty second timer runs out. The Word of God is your sword — draw it quickly and accurately!`,
}

const PAGE_NAMES = {
  '/':             'Home',
  '/bible':        'Bible Reader',
  '/quizzes':      'Knowledge Hub',
  '/ai':           'AI Consultant',
  '/dashboard':    'Growth Dashboard',
  '/did-you-know': 'Did You Know',
  '/games':        'Bible Games',
  '/community':    'Community',
  '/settings':     'Settings',
  '/games/speedtyper':  '⌨️ Speed Typer',
  '/games/swipe':       '👆 Swipe True/False',
  '/games/fillblank':   '📝 Fill the Blank',
  '/games/whoami':      '🕵️ Who Am I?',
  '/games/lightning':   '⚡ Lightning Round',
  '/games/scramble':    '🔀 Scripture Scramble',
  '/games/wordle':      '🟩 Verse Wordle',
  '/games/hangman':     '🪢 Bible Hangman',
  '/games/prophecy':    '🔮 Prophetic Connections',
  '/games/chronology':  '📅 Chronology Challenge',
  '/games/emoji':       '😂 Emoji Bible',
  '/games/nameBook':    '📚 Name That Book',
  '/games/wisdom':      '🧩 Wisdom Grid',
  '/games/connections': '🔗 Daily Connections',
  '/games/map':         '🗺️ Biblical Map Quest',
  '/games/swordDrill':  '⚔️ Sword Drill',
}

const PREFERRED_VOICES = [
  'Microsoft Libby Online (Natural) - English (United Kingdom)',
  'Microsoft Sonia Online (Natural) - English (United Kingdom)',
  'Microsoft Ryan Online (Natural) - English (United Kingdom)',
  'Microsoft Emma Online (Natural) - English (United States)',
  'Microsoft Aria Online (Natural) - English (United States)',
  'Microsoft Jenny Online (Natural) - English (United States)',
  'Microsoft Ava Online (Natural) - English (United States)',
  'Microsoft Andrew Online (Natural) - English (United States)',
  'Microsoft Guy Online (Natural) - English (United States)',
  'Microsoft Brian Online (Natural) - English (United States)',
  'Microsoft Natasha Online (Natural) - English (Australia)',
  'Microsoft Clara Online (Natural) - English (Canada)',
]

let pendingPath = null

function getVol()   { return parseFloat(localStorage.getItem('scripturehub_voice_volume') ?? '0.85') }
function isMuted()  { return localStorage.getItem('scripturehub_voice_muted') === 'true' }
function isEnabled() {
  try { const s = JSON.parse(localStorage.getItem('scripturehub_settings') ?? '{}'); return s.voiceGuide !== false }
  catch { return true }
}

function getBestVoice() {
  const voices = window.speechSynthesis.getVoices()
  for (const name of PREFERRED_VOICES) {
    const v = voices.find(v => v.name === name)
    if (v) return v
  }
  return voices.find(v => v.lang.startsWith('en-GB'))
      || voices.find(v => v.lang.startsWith('en'))
      || voices[0] || null
}

export function speakText(text) {
  if (!('speechSynthesis' in window)) return
  if (isMuted() || !isEnabled()) return
  window.speechSynthesis.cancel()
  const keepAlive = setInterval(() => {
    if (!window.speechSynthesis.speaking) { clearInterval(keepAlive); return }
    window.speechSynthesis.pause(); window.speechSynthesis.resume()
  }, 10000)
  const utter = new SpeechSynthesisUtterance(text)
  const voice = getBestVoice()
  if (voice) utter.voice = voice
  utter.rate = 0.88; utter.pitch = 1.0; utter.volume = getVol()
  utter.onend = () => clearInterval(keepAlive)
  utter.onerror = () => clearInterval(keepAlive)
  window.speechSynthesis.speak(utter)
}

function doSpeak(path) {
  if (!('speechSynthesis' in window)) return
  if (isMuted() || !isEnabled()) return
  const text = SCRIPTS[path] || SCRIPTS[Object.keys(SCRIPTS).find(k => path.startsWith(k) && k !== '/')]
  if (!text) return
  window.speechSynthesis.cancel()
  const keepAlive = setInterval(() => {
    if (!window.speechSynthesis.speaking) { clearInterval(keepAlive); return }
    window.speechSynthesis.pause(); window.speechSynthesis.resume()
  }, 10000)
  const utter = new SpeechSynthesisUtterance(text)
  const voice = getBestVoice()
  if (voice) utter.voice = voice
  utter.rate = 0.88; utter.pitch = 1.0; utter.volume = getVol()
  utter.onend = () => clearInterval(keepAlive)
  utter.onerror = () => clearInterval(keepAlive)
  window.speechSynthesis.speak(utter)
}

export function stopVoiceGuide()      { try { window.speechSynthesis.cancel() } catch {} }
export function replayVoiceGuide(path) { doSpeak(path) }

// ── Default position: bottom-right corner ─────────────────────
function getDefaultPos() {
  return {
    x: window.innerWidth  - 80,
    y: window.innerHeight - 160,
  }
}

function getSavedPos() {
  try {
    const saved = JSON.parse(localStorage.getItem('scripturehub_vg_pos') ?? 'null')
    if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') return saved
  } catch {}
  return getDefaultPos()
}

export default function VoiceGuide() {
  const location                  = useLocation()
  const [speaking,  setSpeaking]  = useState(false)
  const [paused,    setPaused]    = useState(false)
  const [muted,     setMuted]     = useState(() => isMuted())
  const [volume,    setVolume]    = useState(() => getVol())
  const [showPanel, setShowPanel] = useState(false)
  const [unlocked,  setUnlocked]  = useState(false)

  // ── Drag state ────────────────────────────────────────────────
  const [pos,     setPos]     = useState(() => getSavedPos())
  const [dragging, setDragging] = useState(false)
  const dragStart  = useRef(null)   // { mx, my, ox, oy }
  const widgetRef  = useRef(null)

  const prevPath = useRef('')
  const pollRef  = useRef(null)
  const hideRef  = useRef(null)

  if (!('speechSynthesis' in window)) return null

  // ── Save position to localStorage whenever it changes ────────
  useEffect(() => {
    localStorage.setItem('scripturehub_vg_pos', JSON.stringify(pos))
  }, [pos])

  // ── Keep widget inside window on resize ──────────────────────
  useEffect(() => {
    function onResize() {
      setPos(p => ({
        x: Math.min(p.x, window.innerWidth  - 60),
        y: Math.min(p.y, window.innerHeight - 60),
      }))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── Mouse drag handlers ───────────────────────────────────────
  function onMouseDown(e) {
    // Only drag on the drag-handle, not on buttons/inputs
    if (e.target.closest('button') || e.target.closest('input')) return
    e.preventDefault()
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: pos.x, oy: pos.y }
    setDragging(true)
  }

  useEffect(() => {
    function onMouseMove(e) {
      if (!dragStart.current) return
      const dx = e.clientX - dragStart.current.mx
      const dy = e.clientY - dragStart.current.my
      setPos({
        x: Math.max(0, Math.min(window.innerWidth  - 60, dragStart.current.ox + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 60, dragStart.current.oy + dy)),
      })
    }
    function onMouseUp() {
      dragStart.current = null
      setDragging(false)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
    }
  }, [])

  // ── Touch drag handlers ───────────────────────────────────────
  function onTouchStart(e) {
    if (e.target.closest('button') || e.target.closest('input')) return
    const t = e.touches[0]
    dragStart.current = { mx: t.clientX, my: t.clientY, ox: pos.x, oy: pos.y }
    setDragging(true)
  }

  useEffect(() => {
    function onTouchMove(e) {
      if (!dragStart.current) return
      e.preventDefault()
      const t = e.touches[0]
      const dx = t.clientX - dragStart.current.mx
      const dy = t.clientY - dragStart.current.my
      setPos({
        x: Math.max(0, Math.min(window.innerWidth  - 60, dragStart.current.ox + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 60, dragStart.current.oy + dy)),
      })
    }
    function onTouchEnd() {
      dragStart.current = null
      setDragging(false)
    }
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend',  onTouchEnd)
    return () => {
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend',  onTouchEnd)
    }
  }, [])

  // ── Unlock speech on first user interaction ───────────────────
  useEffect(() => {
    function unlock() {
      if (unlocked) return
      const silent = new SpeechSynthesisUtterance(' ')
      silent.volume = 0
      silent.onend = () => {
        setUnlocked(true)
        if (pendingPath && !muted) { setTimeout(() => doSpeak(pendingPath), 300); pendingPath = null }
      }
      window.speechSynthesis.speak(silent)
      document.removeEventListener('click',    unlock)
      document.removeEventListener('keydown',  unlock)
      document.removeEventListener('touchend', unlock)
      document.removeEventListener('scroll',   unlock)
    }
    document.addEventListener('click',    unlock, { once: true })
    document.addEventListener('keydown',  unlock, { once: true })
    document.addEventListener('touchend', unlock, { once: true })
    document.addEventListener('scroll',   unlock, { once: true })
    return () => {
      document.removeEventListener('click',    unlock)
      document.removeEventListener('keydown',  unlock)
      document.removeEventListener('touchend', unlock)
      document.removeEventListener('scroll',   unlock)
    }
  }, [unlocked, muted])

  // ── Speak on route change ─────────────────────────────────────
  useEffect(() => {
    const path = location.pathname
    if (path === prevPath.current) return
    prevPath.current = path
    if (muted) return
    if (unlocked) { setTimeout(() => doSpeak(path), 600) }
    else { pendingPath = path }
  }, [location.pathname, muted, unlocked])

  // ── Poll speech state ─────────────────────────────────────────
  useEffect(() => {
    pollRef.current = setInterval(() => {
      setSpeaking(window.speechSynthesis.speaking && !window.speechSynthesis.paused)
      setPaused(window.speechSynthesis.paused)
    }, 200)
    return () => clearInterval(pollRef.current)
  }, [])

  // ── Cleanup ───────────────────────────────────────────────────
  useEffect(() => {
    return () => { stopVoiceGuide(); clearInterval(pollRef.current); clearTimeout(hideRef.current) }
  }, [])

  function toggleMute() {
    const next = !muted
    setMuted(next)
    localStorage.setItem('scripturehub_voice_muted', String(next))
    if (next) stopVoiceGuide()
  }

  function handleVolume(e) {
    const val = parseFloat(e.target.value)
    setVolume(val)
    localStorage.setItem('scripturehub_voice_volume', String(val))
  }

  function handlePlayPause() {
    if (paused)        { window.speechSynthesis.resume(); setPaused(false) }
    else if (speaking) { window.speechSynthesis.pause();  setPaused(true)  }
    else               { replayVoiceGuide(location.pathname) }
  }

  function handleStop() {
    stopVoiceGuide(); setSpeaking(false); setPaused(false); setShowPanel(false)
  }

  function handleReplay() {
    replayVoiceGuide(location.pathname); setShowPanel(false)
  }

  const accent = (() => {
    try { return JSON.parse(localStorage.getItem('scripturehub_settings') ?? '{}').accentColor || '#c9a84c' }
    catch { return '#c9a84c' }
  })()

  const pageName = PAGE_NAMES[location.pathname] || 'ScriptureHub'
  const isActive = speaking || paused

  return (
    <>
      <style>{`
        @keyframes vg-bar {
          0%,100% { transform: scaleY(0.35); }
          50%      { transform: scaleY(1.0);  }
        }
        @keyframes vg-in {
          from { opacity:0; transform:translateY(8px) scale(0.97); }
          to   { opacity:1; transform:translateY(0)   scale(1);    }
        }
        .vg-widget {
          position: fixed;
          z-index: 9998;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
          font-family: Georgia, serif;
          user-select: none;
        }
        .vg-drag-handle {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 3px;
          padding: 4px 0 2px;
          cursor: grab;
          opacity: 0.45;
          transition: opacity 0.2s;
        }
        .vg-drag-handle:hover { opacity: 1; }
        .vg-drag-handle span {
          display: block;
          width: 18px; height: 2px;
          background: #c9a84c;
          border-radius: 2px;
          margin: 1px 0;
        }
        .vg-widget.dragging { cursor: grabbing !important; }
        .vg-widget.dragging * { cursor: grabbing !important; }
      `}</style>

      <div
        ref={widgetRef}
        className={`vg-widget${dragging ? ' dragging' : ''}`}
        style={{ left: pos.x + 'px', top: pos.y + 'px' }}
      >
        {/* ── Drag handle — grab here to move ── */}
        <div
          className="vg-drag-handle"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          title="Drag to move"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span /><span /><span />
          </div>
        </div>

        {/* ── Speaking card ── */}
        {isActive && (
          <div style={{
            background: 'rgba(10,5,2,0.97)',
            border: '1px solid ' + accent + '88',
            borderRadius: '16px', padding: '1rem 1.25rem',
            minWidth: '265px', maxWidth: '320px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.65)',
            animation: 'vg-in 0.28s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '20px', flexShrink: 0 }}>
                {[0.5, 0.9, 1.0, 0.7, 0.4].map((h, i) => (
                  <span key={i} style={{
                    display: 'inline-block', width: '3px',
                    height: (h * 20) + 'px', borderRadius: '99px',
                    background: accent, transformOrigin: 'bottom',
                    animation: speaking ? `vg-bar ${0.45 + i * 0.08}s ease-in-out infinite` : 'none',
                    animationDelay: (i * 0.09) + 's',
                    opacity: speaking ? 1 : 0.3,
                    transition: 'opacity 0.3s',
                  }} />
                ))}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: accent, fontSize: '0.68rem', fontWeight: '800', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  🎙️ Voice Guide
                </p>
                <p style={{ color: '#f5ead8', fontSize: '0.86rem', fontWeight: '600', margin: 0 }}>
                  {paused ? '⏸ Paused' : pageName}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <CtrlBtn onClick={handlePlayPause} color={accent} title={paused ? 'Resume' : 'Pause'}>
                {paused ? '▶' : '⏸'}
              </CtrlBtn>
              <CtrlBtn onClick={handleStop} color="#e74c3c" title="Stop">⏹</CtrlBtn>
              <input type="range" min="0" max="1" step="0.05"
                value={volume} onChange={handleVolume}
                style={{ flex: 1, accentColor: accent, cursor: 'pointer' }} />
              <span style={{ color: accent, fontSize: '0.72rem', fontWeight: '800', minWidth: '32px', textAlign: 'right' }}>
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* ── Hover panel ── */}
        {showPanel && !isActive && (
          <div
            onMouseEnter={() => clearTimeout(hideRef.current)}
            onMouseLeave={() => { hideRef.current = setTimeout(() => setShowPanel(false), 400) }}
            style={{
              background: 'rgba(10,5,2,0.97)',
              border: '1px solid rgba(201,168,76,0.4)',
              borderRadius: '14px', padding: '0.95rem 1.1rem',
              minWidth: '235px', boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
              animation: 'vg-in 0.22s ease',
            }}
          >
            <p style={{ color: accent, fontSize: '0.7rem', fontWeight: '800', margin: '0 0 0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              🎙️ Voice Guide
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.7rem' }}>
              <span style={{ color: '#c8b89a', fontSize: '0.8rem', fontWeight: '600', minWidth: '62px' }}>
                🔊 Volume
              </span>
              <input type="range" min="0" max="1" step="0.05"
                value={volume} onChange={handleVolume}
                style={{ flex: 1, accentColor: accent, cursor: 'pointer' }} />
              <span style={{ color: accent, fontSize: '0.75rem', fontWeight: '800', minWidth: '32px', textAlign: 'right' }}>
                {Math.round(volume * 100)}%
              </span>
            </div>
            <button onClick={handleReplay} style={{
              width: '100%', padding: '0.5rem',
              background: accent + '22', border: '1px solid ' + accent + '55',
              borderRadius: '8px', color: accent,
              fontSize: '0.8rem', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'Georgia,serif',
            }}>
              🔁 Replay This Page
            </button>
            {!unlocked && (
              <p style={{ color: '#c8b89a', fontSize: '0.72rem', margin: '0.6rem 0 0', textAlign: 'center', lineHeight: '1.5' }}>
                👆 Click anywhere on the page<br/>to activate the voice guide
              </p>
            )}
          </div>
        )}

        {/* ── Mic button ── */}
        <button
          onClick={() => { if (isActive) handleStop(); else setShowPanel(p => !p) }}
          onMouseEnter={() => { clearTimeout(hideRef.current); if (!isActive) setShowPanel(true) }}
          onMouseLeave={() => { hideRef.current = setTimeout(() => setShowPanel(false), 1000) }}
          title={isActive ? 'Stop voice' : !unlocked ? 'Click anywhere to activate voice' : muted ? 'Voice Guide (muted)' : 'Voice Guide'}
          style={{
            width: '46px', height: '46px', borderRadius: '50%',
            background: isActive ? accent + '33' : 'rgba(10,5,2,0.97)',
            border: '1.5px solid ' + (isActive ? accent : !unlocked ? 'rgba(201,168,76,0.25)' : 'rgba(201,168,76,0.45)'),
            cursor: 'pointer', fontSize: '1.2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(20px)', transition: 'all 0.22s',
            opacity: !unlocked ? 0.6 : 1,
            boxShadow: isActive
              ? '0 0 22px ' + accent + '55, 0 2px 16px rgba(0,0,0,0.4)'
              : '0 2px 16px rgba(0,0,0,0.4)',
          }}
        >
          {!unlocked ? '🔒' : '🎙️'}
        </button>

        {/* ── Status pill ── */}
        <button onClick={toggleMute} style={{
          background: 'rgba(10,5,2,0.88)',
          border: '1px solid ' + (muted ? 'rgba(231,76,60,0.5)' : !unlocked ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.25)'),
          borderRadius: '999px', padding: '0.2rem 0.7rem',
          color: muted ? '#e74c3c' : !unlocked ? 'rgba(200,184,154,0.5)' : '#c8b89a',
          fontSize: '0.65rem', fontWeight: '700',
          cursor: 'pointer', fontFamily: 'Georgia,serif',
          backdropFilter: 'blur(12px)', letterSpacing: '0.05em',
          transition: 'all 0.2s',
        }}>
          {muted ? 'VOICE OFF' : !unlocked ? 'CLICK TO ACTIVATE' : 'VOICE ON'}
        </button>

      </div>
    </>
  )
}

function CtrlBtn({ onClick, color, title, children }) {
  return (
    <button onClick={onClick} title={title} style={{
      width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
      background: color + '22', border: '1px solid ' + color,
      color, fontSize: '0.85rem', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Georgia,serif', transition: 'all 0.18s',
    }}>
      {children}
    </button>
  )
}