import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// ─────────────────────────────────────────────────────────────────
// PAGE SCRIPTS
// ─────────────────────────────────────────────────────────────────
const SCRIPTS = {
  '/':             `Welcome to ScriptureHub — your sacred digital companion. Here on the home page, you will find your verse of the day, quick access to the Bible reader, and your personal growth dashboard. May your time here draw you closer to the Word of God.`,
  '/bible':        `Welcome to the Word. Here in the Bible Reader, you can explore different translations such as the King James Version, the World English Bible, and many more. Use the book and chapter selectors to navigate scripture. You can highlight your favourite verses and save personal notes in your journal.`,
  '/bible/hymns':  `Welcome to the Scripture Hub Hymn Centre — a treasury of sacred song spanning centuries of worship. You have access to two magnificent collections. The first is Hymns Ancient and Modern, containing eight hundred and forty seven selections including traditional hymns, short songs, and chants. The second is Sacred Songs and Solos, the complete twelve hundred piece edition featuring beloved gospel classics and revival solos. Use the collection switcher at the top to choose your preferred book. Then use the search bar to find any hymn by its number, title, author, or even a line from the lyrics. You can also filter by category — such as Grace and Salvation, Praise and Worship, or Christmas — and sort by hymn number, title, or author. When you open a hymn, click the Singing Mode button for a beautiful full screen view with large text, perfect for singing from your phone or tablet during worship. You may also press the Listen button to hear any hymn read aloud. May every song lift your heart to heaven.`,
  '/bible/hymn-detail': `You are now viewing the full hymn. Each section is displayed clearly with its label — verse one, chorus, verse two, and so on. Press the Listen All button to hear the entire hymn read aloud, or press the small speaker button beside any individual section to hear just that part. For the best worship experience, press the Singing Mode button at the top. This opens a beautiful full screen view with large text, navigation dots to move between sections, and a Listen button for each verse. It is designed to be easy to read from any device during personal or group worship. Enjoy singing to the Lord.`,
  '/quizzes':      `Welcome to the Knowledge Hub. Here you can test and grow your understanding of scripture through carefully crafted Bible quizzes. Choose your difficulty level — from follower to visionary — and challenge yourself to go deeper into the Word.`,
  '/ai':           `Welcome to your AI Scripture Advisor. This is your personal Bible study assistant, available any time. You can ask questions about any verse, request explanations of biblical events, explore theological topics, or simply ask for encouragement.`,
  '/did-you-know': `Welcome to Did You Know — a treasury of biblical secrets. Each card here reveals a fascinating fact, a hidden connection, or a surprising truth from scripture that most people have never discovered. Click any card to reveal its secret.`,
  '/games':        `Welcome to the Spiritual Arcade — where faith meets fun! Here you will find sixteen interactive games designed to strengthen your knowledge of scripture. Choose any game to begin. Every game is rooted in the Word of God. May you grow in wisdom as you play!`,
  '/community':    `Welcome to the ScriptureHub Community. Here you can carve your own stone of remembrance by sharing a verse or testimony that has touched your heart. You can also earn treasure chest badges, walk the Prophet's Path, and discover hidden Easter eggs filled with ancient wisdom.`,
  '/settings':     `Welcome to Settings. Here you can personalise your entire ScriptureHub experience. Choose your preferred language, adjust the appearance, set your daily reading goal, and manage all your account data.`,
  '/secrets':      `Welcome to Biblical Secrets — the Discovery page of ScriptureHub. Here you will find sixty fascinating secrets hidden within the pages of Scripture. Each card holds a surprising question on the front. Tap any card to flip it and reveal the secret answer. You will discover amazing facts about Bible words and language, numbers and records, famous people, creation, the life of Jesus, prophecy and fulfilment, strange and surprising events, Africa in the Bible, and wisdom from Proverbs. Use the category buttons to explore a specific topic, or use the search bar to find a secret by keyword. You can also press Reveal All to uncover every secret at once, or copy any secret to share with friends and family. Track your progress at the top of the page. May every secret deepen your love for the Word of God.`,
  '/values':       `Welcome to Values for Success — the Youth Hub of ScriptureHub. Here you will find nine powerful life values, each one combining specific Bible scriptures with practical real-world advice. Whether you want to learn about diligence, integrity, entrepreneurship, money management, or leadership, every value has scriptures to inspire you and practical tips to guide you. This section was built especially for young people in communities like Ogbia who want to grow spiritually and succeed practically. Select any value card to explore its scriptures and tips. May God's Word light your path to success.`,
  '/maps':         `Welcome to Bible Maps and Timelines — where the stories of Scripture come alive geographically and historically. Choose from four interactive maps: the Travels of Paul, tracing his three missionary journeys across the Roman Empire; the Exodus Route, following Moses and Israel from Egypt to the Promised Land; the Life and Ministry of Jesus, exploring every significant location in the Gospels; and the Kingdom of Israel and Judah, showing the divided kingdom and the path to exile. Each map has clickable location pins that reveal the biblical story behind every city. You can also filter by journey or route, and switch to the Timelines view to see all of Bible history laid out in order. May this feature make the Word of God feel more real and alive to you.`,
  '/search':       `Welcome to AI Deep Search — the most powerful way to find scripture on ScriptureHub. This is not a normal search bar. You do not need to know any Bible verses or references. Simply type how you feel or what you are going through. You could type something like "I feel lonely and need strength," or "I am anxious about the future," or "How should I treat my neighbours." The AI will understand the meaning behind your words and find the most relevant Bible verses for your exact situation. It will also give you a personal, pastoral insight explaining how God's Word speaks to what you are facing. Your search history is saved privately on this device so you can return to previous searches. Use the suggestion chips on screen to get started quickly, or type your own search in the box. God's Word has an answer for every season of life — let us help you find it.`,
  '/prayer':       `Welcome to your Digital Prayer Journal — a private, sacred space between you and God. Here you can write down your prayer requests, organise them by category such as personal, family, health, provision, or guidance, and track them over time. When God answers a prayer, press the Mark as Answered button and add a note about how He answered it. Over weeks and months, your list of answered prayers becomes one of the most powerful faith-building tools you will ever have. Your journal is stored privately on this device only — no one else can read it. Use the tabs at the top to switch between your active prayers, your answered prayers, and all prayers. You can also view your prayer statistics to see your answer rate and how long God typically takes to respond. Start by pressing the New Prayer Request button. God is listening.`,
  '/progress':     `Welcome to your Study Progress page. Here you can track your Bible reading journey, see which books you have completed, and set daily reading goals. Every chapter you read is a step closer to knowing the full counsel of God's Word.`,
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

// ── Virtual sub-page scripts ──────────────────────────────────────
const SUBPAGE_SCRIPTS = {
  'hymns':        SCRIPTS['/bible/hymns'],
  'hymn-detail':  SCRIPTS['/bible/hymn-detail'],
  'singing-mode': `You are now in Singing Mode — a distraction free worship experience. The lyrics are displayed in large, clear text so you can sing along easily from any device. Use the Previous and Next buttons, or tap the dots at the bottom, to move between sections. Press the Listen button to hear the current section read aloud. When you are finished, press Exit to return to the hymn. Sing with all your heart to the Lord!`,
  'books':        `You are back in the Bible Reader. Select a testament, then choose a book and chapter to begin reading. You can also open the Hymn Centre at any time using the Hymn Centre button in the tab bar.`,
}

const PAGE_NAMES = {
  '/':                  'Home',
  '/bible':             'Bible Reader',
  '/bible/hymns':       'Hymn Centre',
  '/bible/hymn-detail': 'Hymn Detail',
  '/quizzes':           'Knowledge Hub',
  '/ai':                'AI Consultant',
  '/did-you-know':      'Did You Know',
  '/games':             'Bible Games',
  '/community':         'Community',
  '/settings':          'Settings',
  '/secrets':           '🔍 Biblical Secrets',
  '/values':            'Values for Success',
  '/maps':              '🗺️ Bible Maps',
  '/search':            '🔍 AI Deep Search',
  '/prayer':            '🙏 Prayer Journal',
  '/progress':          '📊 Study Progress',
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

const SUBPAGE_NAMES = {
  'hymns':        '🎵 Hymn Centre',
  'hymn-detail':  '🎵 Hymn Detail',
  'singing-mode': '🎤 Singing Mode',
  'books':        '📖 Bible Reader',
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

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────
function getVol()    { return parseFloat(localStorage.getItem('scripturehub_voice_volume') ?? '0.85') }
function isMuted()   { return localStorage.getItem('scripturehub_voice_muted') === 'true' }
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

// ─────────────────────────────────────────────────────────────────
// CORE SPEAK ENGINE
// ─────────────────────────────────────────────────────────────────
function splitIntoChunks(text, maxChars = 180) {
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text]
  const chunks = []
  let current = ''
  for (const s of sentences) {
    if ((current + s).length > maxChars && current.length > 0) {
      chunks.push(current.trim())
      current = s
    } else {
      current += s
    }
  }
  if (current.trim()) chunks.push(current.trim())
  return chunks
}

const engine = { queue: [], keepAlive: null, stopped: false }

function clearEngine() {
  engine.stopped = true
  engine.queue   = []
  clearInterval(engine.keepAlive)
  engine.keepAlive = null
  try { window.speechSynthesis.cancel() } catch {}
}

function speakChunk(idx, onAllDone) {
  if (engine.stopped || idx >= engine.queue.length) {
    if (!engine.stopped && onAllDone) onAllDone()
    return
  }
  const text  = engine.queue[idx]
  const utter = new SpeechSynthesisUtterance(text)
  const voice = getBestVoice()
  if (voice) utter.voice = voice
  utter.rate    = 0.88
  utter.pitch   = 1.0
  utter.volume  = getVol()
  utter.onend   = () => { if (!engine.stopped) speakChunk(idx + 1, onAllDone) }
  utter.onerror = (e) => {
    if (e.error === 'interrupted' || engine.stopped) return
    setTimeout(() => { if (!engine.stopped) speakChunk(idx + 1, onAllDone) }, 300)
  }
  try { window.speechSynthesis.speak(utter) } catch {}
}

function doSpeak(text, onDone) {
  if (!('speechSynthesis' in window)) return
  if (isMuted() || !isEnabled()) return
  if (!text) return
  clearEngine()
  engine.stopped = false
  engine.queue   = splitIntoChunks(text)
  const startWhenReady = () => {
    if (window.speechSynthesis.getVoices().length > 0) {
      speakChunk(0, onDone)
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null
        speakChunk(0, onDone)
      }
    }
  }
  startWhenReady()
}

function doSpeakPath(path, onDone) {
  const text =
    SCRIPTS[path] ||
    SCRIPTS[Object.keys(SCRIPTS).find(k => path.startsWith(k) && k !== '/') || '']
  doSpeak(text, onDone)
}

// ─────────────────────────────────────────────────────────────────
// PUBLIC EXPORTS
// ─────────────────────────────────────────────────────────────────
export function speakText(text)        { doSpeak(text) }
export function stopVoiceGuide()       { clearEngine() }
export function replayVoiceGuide(path) { doSpeakPath(path) }
export function announceHymnView(subpage) {
  const text = SUBPAGE_SCRIPTS[subpage]
  if (text) doSpeak(text)
}

// ─────────────────────────────────────────────────────────────────
// POSITION HELPERS
// ─────────────────────────────────────────────────────────────────
function getDefaultPos() {
  return { x: window.innerWidth - 80, y: window.innerHeight - 160 }
}
function getSavedPos() {
  try {
    const saved = JSON.parse(localStorage.getItem('scripturehub_vg_pos') ?? 'null')
    if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') return saved
  } catch {}
  return getDefaultPos()
}

// ─────────────────────────────────────────────────────────────────
// AUTO-PLAY BOOTSTRAP
// ─────────────────────────────────────────────────────────────────
function tryAutoUnlock(onUnlocked) {
  if (!('speechSynthesis' in window)) return
  const silent = new SpeechSynthesisUtterance(' ')
  silent.volume = 0
  let resolved  = false
  silent.onend = () => { if (resolved) return; resolved = true; onUnlocked() }
  silent.onerror = () => {
    if (resolved) return
    const handler = () => {
      if (resolved) return
      resolved = true
      document.removeEventListener('click',    handler)
      document.removeEventListener('keydown',  handler)
      document.removeEventListener('touchend', handler)
      document.removeEventListener('scroll',   handler)
      onUnlocked()
    }
    document.addEventListener('click',    handler, { once: true })
    document.addEventListener('keydown',  handler, { once: true })
    document.addEventListener('touchend', handler, { once: true })
    document.addEventListener('scroll',   handler, { once: true })
  }
  try { window.speechSynthesis.cancel(); window.speechSynthesis.speak(silent) }
  catch { silent.onerror() }
}

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function VoiceGuide() {
  const location = useLocation()

  const [speaking,     setSpeaking]     = useState(false)
  const [paused,       setPaused]       = useState(false)
  const [muted,        setMuted]        = useState(() => isMuted())
  const [volume,       setVolume]       = useState(() => getVol())
  const [showPanel,    setShowPanel]    = useState(false)
  const [unlocked,     setUnlocked]     = useState(false)
  const [currentLabel, setCurrentLabel] = useState('')

  const [pos,      setPos]      = useState(() => getSavedPos())
  const [dragging, setDragging] = useState(false)
  const dragStart  = useRef(null)
  const widgetRef  = useRef(null)
  const prevPath   = useRef('')
  const pollRef    = useRef(null)
  const hideRef    = useRef(null)
  const replayText = useRef('')

  if (!('speechSynthesis' in window)) return null

  useEffect(() => {
    localStorage.setItem('scripturehub_vg_pos', JSON.stringify(pos))
  }, [pos])

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

  useEffect(() => {
    function onSubpage(e) {
      const subpage = e.detail
      const text    = SUBPAGE_SCRIPTS[subpage]
      const label   = SUBPAGE_NAMES[subpage] || 'Bible Reader'
      if (!text) return
      if (isMuted() || !isEnabled()) return
      replayText.current = text
      setCurrentLabel(label)
      if (unlocked) setTimeout(() => doSpeak(text), 400)
    }
    window.addEventListener('vg:subpage', onSubpage)
    return () => window.removeEventListener('vg:subpage', onSubpage)
  }, [unlocked])

  function onMouseDown(e) {
    if (e.target.closest('button') || e.target.closest('input')) return
    e.preventDefault()
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: pos.x, oy: pos.y }
    setDragging(true)
  }
  useEffect(() => {
    function onMouseMove(e) {
      if (!dragStart.current) return
      setPos({
        x: Math.max(0, Math.min(window.innerWidth  - 60, dragStart.current.ox + (e.clientX - dragStart.current.mx))),
        y: Math.max(0, Math.min(window.innerHeight - 60, dragStart.current.oy + (e.clientY - dragStart.current.my))),
      })
    }
    function onMouseUp() { dragStart.current = null; setDragging(false) }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
    }
  }, [])

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
      setPos({
        x: Math.max(0, Math.min(window.innerWidth  - 60, dragStart.current.ox + (t.clientX - dragStart.current.mx))),
        y: Math.max(0, Math.min(window.innerHeight - 60, dragStart.current.oy + (t.clientY - dragStart.current.my))),
      })
    }
    function onTouchEnd() { dragStart.current = null; setDragging(false) }
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend',  onTouchEnd)
    return () => {
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend',  onTouchEnd)
    }
  }, [])

  useEffect(() => {
    const initialPath = location.pathname
    prevPath.current  = initialPath
    tryAutoUnlock(() => {
      setUnlocked(true)
      if (!isMuted() && isEnabled()) {
        const text = SCRIPTS[initialPath] ||
          SCRIPTS[Object.keys(SCRIPTS).find(k => initialPath.startsWith(k) && k !== '/') || '']
        if (text) {
          replayText.current = text
          setCurrentLabel(PAGE_NAMES[initialPath] || 'ScriptureHub')
          setTimeout(() => doSpeak(text), 300)
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const path = location.pathname
    if (path === prevPath.current) return
    prevPath.current = path
    if (muted) return
    const text = SCRIPTS[path] ||
      SCRIPTS[Object.keys(SCRIPTS).find(k => path.startsWith(k) && k !== '/') || '']
    if (!text) return
    replayText.current = text
    setCurrentLabel(PAGE_NAMES[path] || 'ScriptureHub')
    if (unlocked) setTimeout(() => doSpeak(text), 600)
  }, [location.pathname, muted, unlocked])

  useEffect(() => {
    pollRef.current = setInterval(() => {
      setSpeaking(window.speechSynthesis.speaking && !window.speechSynthesis.paused)
      setPaused(window.speechSynthesis.paused)
    }, 200)
    return () => clearInterval(pollRef.current)
  }, [])

  useEffect(() => {
    return () => {
      clearEngine()
      clearInterval(pollRef.current)
      clearTimeout(hideRef.current)
    }
  }, [])

  function toggleMute() {
    const next = !muted
    setMuted(next)
    localStorage.setItem('scripturehub_voice_muted', String(next))
    if (next) clearEngine()
  }

  function handleVolume(e) {
    const val = parseFloat(e.target.value)
    setVolume(val)
    localStorage.setItem('scripturehub_voice_volume', String(val))
  }

  function handlePlayPause() {
    if (paused)        { window.speechSynthesis.resume(); setPaused(false) }
    else if (speaking) { window.speechSynthesis.pause();  setPaused(true)  }
    else {
      if (replayText.current) doSpeak(replayText.current)
      else doSpeakPath(location.pathname)
    }
  }

  function handleStop() {
    clearEngine(); setSpeaking(false); setPaused(false); setShowPanel(false)
  }

  function handleReplay() {
    if (replayText.current) doSpeak(replayText.current)
    else doSpeakPath(location.pathname)
    setShowPanel(false)
  }

  const accent = (() => {
    try { return JSON.parse(localStorage.getItem('scripturehub_settings') ?? '{}').accentColor || '#c9a84c' }
    catch { return '#c9a84c' }
  })()

  const pageName = currentLabel || PAGE_NAMES[location.pathname] || 'ScriptureHub'
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
          gap: 0.45rem;
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
          opacity: 0.4;
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
        .vg-ctrl-btn { transition: opacity 0.18s, transform 0.18s; }
        .vg-ctrl-btn:hover { opacity: 0.85; transform: scale(1.08); }
      `}</style>

      <div
        ref={widgetRef}
        className={`vg-widget${dragging ? ' dragging' : ''}`}
        style={{ left: pos.x + 'px', top: pos.y + 'px' }}
      >
        {/* Drag handle */}
        <div
          className="vg-drag-handle"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          title="Drag to move"
        >
          <div style={{ display:'flex', flexDirection:'column', gap:'3px' }}>
            <span /><span /><span />
          </div>
        </div>

        {/* Active speaking card */}
        {isActive && (
          <div style={{
            background:   'rgba(10,5,2,0.97)',
            border:       `1px solid ${accent}88`,
            borderRadius: '16px',
            padding:      '0.9rem 1.1rem',
            minWidth:     '260px',
            maxWidth:     '310px',
            boxShadow:    '0 8px 40px rgba(0,0,0,0.65)',
            animation:    'vg-in 0.28s ease',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.65rem', marginBottom:'0.8rem' }}>
              <div style={{ display:'flex', alignItems:'flex-end', gap:'2px', height:'20px', flexShrink:0 }}>
                {[0.5, 0.9, 1.0, 0.7, 0.4].map((h, i) => (
                  <span key={i} style={{
                    display:         'inline-block',
                    width:           '3px',
                    height:          `${h * 20}px`,
                    borderRadius:    '99px',
                    background:      accent,
                    transformOrigin: 'bottom',
                    animation:       speaking
                      ? `vg-bar ${0.45 + i * 0.08}s ease-in-out infinite`
                      : 'none',
                    animationDelay:  `${i * 0.09}s`,
                    opacity:         speaking ? 1 : 0.25,
                    transition:      'opacity 0.3s',
                  }} />
                ))}
              </div>
              <div style={{ flex:1 }}>
                <p style={{
                  color:         accent,
                  fontSize:      '0.66rem',
                  fontWeight:    '800',
                  margin:        0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>
                  Voice Guide
                </p>
                <p style={{ color:'#f5ead8', fontSize:'0.86rem', fontWeight:'600', margin:0 }}>
                  {paused ? '⏸ Paused' : pageName}
                </p>
              </div>
            </div>
            <div style={{ display:'flex', gap:'0.45rem', alignItems:'center' }}>
              <CtrlBtn onClick={handlePlayPause} color={accent} title={paused ? 'Resume' : 'Pause'}>
                {paused ? '▶' : '⏸'}
              </CtrlBtn>
              <CtrlBtn onClick={handleStop} color="#e74c3c" title="Stop">⏹</CtrlBtn>
              <input
                type="range" min="0" max="1" step="0.05"
                value={volume} onChange={handleVolume}
                style={{ flex:1, accentColor:accent, cursor:'pointer' }}
              />
              <span style={{
                color:      accent,
                fontSize:   '0.72rem',
                fontWeight: '800',
                minWidth:   '32px',
                textAlign:  'right',
              }}>
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Hover panel (idle) */}
        {showPanel && !isActive && (
          <div
            onMouseEnter={() => clearTimeout(hideRef.current)}
            onMouseLeave={() => { hideRef.current = setTimeout(() => setShowPanel(false), 400) }}
            style={{
              background:   'rgba(10,5,2,0.97)',
              border:       `1px solid rgba(201,168,76,0.4)`,
              borderRadius: '14px',
              padding:      '0.95rem 1.1rem',
              minWidth:     '235px',
              boxShadow:    '0 8px 40px rgba(0,0,0,0.6)',
              animation:    'vg-in 0.22s ease',
            }}
          >
            <p style={{
              color:         accent,
              fontSize:      '0.7rem',
              fontWeight:    '800',
              margin:        '0 0 0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              Voice Guide
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.7rem' }}>
              <span style={{ color:'#c8b89a', fontSize:'0.8rem', fontWeight:'600', minWidth:'62px' }}>
                🔊 Volume
              </span>
              <input
                type="range" min="0" max="1" step="0.05"
                value={volume} onChange={handleVolume}
                style={{ flex:1, accentColor:accent, cursor:'pointer' }}
              />
              <span style={{
                color:      accent,
                fontSize:   '0.75rem',
                fontWeight: '800',
                minWidth:   '32px',
                textAlign:  'right',
              }}>
                {Math.round(volume * 100)}%
              </span>
            </div>
            <button onClick={handleReplay} style={{
              width:        '100%',
              padding:      '0.5rem',
              background:   accent + '22',
              border:       `1px solid ${accent}55`,
              borderRadius: '8px',
              color:        accent,
              fontSize:     '0.8rem',
              fontWeight:   '700',
              cursor:       'pointer',
              fontFamily:   'Georgia,serif',
            }}>
              🔁 Replay This Page
            </button>
          </div>
        )}

        {/* Mute / status pill */}
        <button
          onClick={toggleMute}
          onMouseEnter={() => { clearTimeout(hideRef.current); if (!isActive) setShowPanel(true) }}
          onMouseLeave={() => { hideRef.current = setTimeout(() => setShowPanel(false), 1000) }}
          title={muted ? 'Voice Guide is muted — click to unmute' : 'Click to mute Voice Guide'}
          style={{
            background:     'rgba(10,5,2,0.88)',
            border:         `1px solid ${muted ? 'rgba(231,76,60,0.55)' : `${accent}44`}`,
            borderRadius:   '999px',
            padding:        '0.28rem 0.85rem',
            color:          muted ? '#e74c3c' : accent,
            fontSize:       '0.68rem',
            fontWeight:     '800',
            cursor:         'pointer',
            fontFamily:     'Georgia,serif',
            backdropFilter: 'blur(12px)',
            letterSpacing:  '0.06em',
            transition:     'all 0.2s',
            display:        'flex',
            alignItems:     'center',
            gap:            '0.35rem',
          }}
        >
          <span style={{
            display:      'inline-block',
            width:        '6px',
            height:       '6px',
            borderRadius: '50%',
            background:   muted ? '#e74c3c' : (speaking ? accent : `${accent}88`),
            boxShadow:    speaking && !muted ? `0 0 6px ${accent}` : 'none',
            transition:   'all 0.3s',
          }} />
          {muted ? 'VOICE OFF' : speaking ? 'PLAYING' : paused ? 'PAUSED' : 'VOICE ON'}
        </button>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────
// CTRL BUTTON
// ─────────────────────────────────────────────────────────────────
function CtrlBtn({ onClick, color, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="vg-ctrl-btn"
      style={{
        width:          '32px',
        height:         '32px',
        borderRadius:   '8px',
        flexShrink:     0,
        background:     color + '22',
        border:         `1px solid ${color}`,
        color,
        fontSize:       '0.85rem',
        cursor:         'pointer',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontFamily:     'Georgia,serif',
      }}
    >
      {children}
    </button>
  )
}