// ScriptureHub Voice Guide — useVoiceGuide.js
// Uses Web Speech API — no external service needed

const SCRIPTS = {
  '/': {
    name: 'Home',
    message: `Welcome to ScriptureHub — your sacred digital companion. 
      Here on the home page, you will find your verse of the day, 
      quick access to the Bible reader, and your personal growth dashboard. 
      May your time here draw you closer to the Word of God.`,
  },
  '/bible': {
    name: 'Bible Reader',
    message: `Welcome to the Word. 
      Here in the Bible Reader, you can explore different translations 
      such as the King James Version, the NIV, and many more. 
      Use the book and chapter selectors to navigate scripture. 
      You can highlight your favourite verses and save personal notes in your journal. 
      Take your time — every word here is God-breathed.`,
  },
  '/bible/hymns': {
    name: 'Hymn Centre',
    message: `Welcome to the Scripture Hub Hymn Centre — a treasury of sacred song 
      spanning centuries of worship. 
      You have access to two magnificent collections. 
      The first is Hymns Ancient and Modern, containing eight hundred and forty seven selections 
      including traditional hymns, short songs, and chants. 
      The second is Sacred Songs and Solos, the complete twelve hundred piece edition 
      featuring beloved gospel classics and revival solos. 
      Use the collection switcher at the top to choose your preferred book. 
      Then use the search bar to find any hymn by its number, title, author, 
      or even a line from the lyrics. 
      You can also filter by category and sort by hymn number, title, or author. 
      When you open a hymn, click Singing Mode for a beautiful full screen worship experience. 
      May every song lift your heart to heaven.`,
  },
  '/bible/hymn-detail': {
    name: 'Hymn Detail',
    message: `You are now viewing the full hymn. 
      Each section is displayed clearly with its label — verse one, chorus, verse two, and so on. 
      Press Listen All to hear the entire hymn read aloud, 
      or press the small speaker button beside any section to hear just that part. 
      For the best worship experience, press the Singing Mode button at the top. 
      This opens a beautiful full screen view with large text 
      and navigation dots to move between sections. 
      Enjoy singing to the Lord.`,
  },
  '/bible/singing-mode': {
    name: 'Singing Mode',
    message: `You are now in Singing Mode — a distraction free worship experience. 
      The lyrics are displayed in large, clear text so you can sing along easily 
      from any device. 
      Use the Previous and Next buttons, or tap the dots at the bottom, 
      to move between sections. 
      Press the Listen button to hear the current section read aloud. 
      When you are finished, press Exit to return to the hymn. 
      Sing with all your heart to the Lord!`,
  },
  '/quizzes': {
    name: 'Knowledge Hub',
    message: `Welcome to the Knowledge Hub. 
      Here you can test and grow your understanding of scripture 
      through carefully crafted Bible quizzes. 
      Choose your difficulty level — from beginner to scholar — 
      and challenge yourself to go deeper into the Word. 
      Every correct answer brings you one step closer to wisdom.`,
  },
  '/ai': {
    name: 'AI Consultant',
    message: `Welcome to your AI Scripture Consultant. 
      This is your personal Bible study assistant, available any time. 
      You can ask questions about any verse, request explanations of biblical events, 
      explore theological topics, or simply ask for encouragement. 
      Type your question below and receive a thoughtful, scripture-based response.`,
  },
  '/did-you-know': {
    name: 'Did You Know',
    message: `Welcome to Did You Know — a treasury of biblical secrets. 
      Each card here reveals a fascinating fact, 
      a hidden connection, or a surprising truth from scripture 
      that most people have never discovered. 
      Click any card to reveal its secret and expand your knowledge of the Bible.`,
  },
  '/games': {
    name: 'Bible Games',
    message: `Welcome to Bible Games — where faith meets fun! 
      Here you will find interactive games designed to strengthen 
      your knowledge of scripture in an enjoyable way. 
      Whether you are playing alone or challenging yourself, 
      every game is rooted in the Word of God. Enjoy and learn!`,
  },
  '/community': {
    name: 'Community',
    message: `Welcome to the ScriptureHub Community — the living stone wall. 
      Here you can carve your own stone of remembrance 
      by sharing a verse or testimony that has touched your heart. 
      You can also earn treasure chest badges, 
      walk the Prophet's Path through interactive biblical missions, 
      and discover hidden Easter eggs filled with ancient wisdom. 
      You are not alone on this journey.`,
  },
  '/settings': {
    name: 'Settings',
    message: `Welcome to Settings. 
      Here you can personalise your entire ScriptureHub experience. 
      Choose your preferred language, adjust the appearance, 
      set your daily reading goal, configure your Bible version, 
      and manage all your account data. 
      Make this space truly your own.`,
  },
  '/progress': {
    name: 'Study Progress',
    message: `Welcome to your Study Progress page. 
      Here you can see exactly how far you have come on your scripture journey. 
      Track the Bible secrets you have discovered, 
      review your quiz scores and streaks, 
      and see how many chapters you have read. 
      Every step you take in the Word is recorded here as a testimony of your growth. 
      Keep pressing forward — your Visionary crown awaits!`,
  },
}

// Track which pages have been spoken this session
const spokenThisSession = new Set()

let currentUtterance = null
let isSpeaking       = false

function getBestVoice() {
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null

  const preferred = [
    'Google UK English Female',
    'Google UK English Male',
    'Microsoft Libby Online (Natural) - English (United Kingdom)',
    'Microsoft Ryan Online (Natural) - English (United Kingdom)',
    'Microsoft Aria Online (Natural) - English (United States)',
    'Microsoft Guy Online (Natural) - English (United States)',
    'Google US English',
    'Samantha',
    'Karen',
    'Daniel',
  ]

  for (const name of preferred) {
    const match = voices.find(v => v.name === name)
    if (match) return match
  }

  return voices.find(v => v.lang.startsWith('en')) || voices[0]
}

// ── Core speak function used by all exports ───────────────────────
function _speak(message, key = null) {
  if (!message) return
  try {
    const settings = JSON.parse(localStorage.getItem('scripturehub_settings') ?? '{}')
    if (settings.voiceGuide === false) return
  } catch {}
  if (localStorage.getItem('scripturehub_voice_muted') === 'true') return

  stopVoiceGuide()

  setTimeout(() => {
    try {
      const utterance = new SpeechSynthesisUtterance(message.trim())

      const trySpeak = () => {
        const voice = getBestVoice()
        if (voice) utterance.voice = voice
        utterance.rate   = 0.88
        utterance.pitch  = 1.0
        utterance.volume = parseFloat(
          localStorage.getItem('scripturehub_voice_volume') ?? '0.85'
        )
        utterance.onstart = () => { isSpeaking = true }
        utterance.onend   = () => { isSpeaking = false; currentUtterance = null }
        utterance.onerror = () => { isSpeaking = false; currentUtterance = null }

        currentUtterance = utterance
        window.speechSynthesis.speak(utterance)
        if (key) spokenThisSession.add(key)
      }

      if (window.speechSynthesis.getVoices().length > 0) {
        trySpeak()
      } else {
        window.speechSynthesis.onvoiceschanged = trySpeak
      }
    } catch (e) {
      console.warn('VoiceGuide error:', e)
    }
  }, 800)
}

// ── Speak a page guide (once per session) ────────────────────────
export function speakPageGuide(pathname, userName = null) {
  if (spokenThisSession.has(pathname)) return
  const script = SCRIPTS[pathname]
  if (!script) return

  let message = script.message.trim()
  if (userName) message = `Welcome back, ${userName}! ` + message
  _speak(message, pathname)
}

// ── NEW: Speak a hymn sub-page guide (always speaks, no session lock)
// Called from BibleReaderPage when the user enters the hymn centre,
// opens a hymn, enters singing mode, or returns to the book list.
//
// Usage:
//   import { speakHymnGuide } from '../hooks/useVoiceGuide'
//   speakHymnGuide('hymns')          // entering hymn list
//   speakHymnGuide('hymn-detail')    // opening a specific hymn
//   speakHymnGuide('singing-mode')   // entering singing mode
//   speakHymnGuide('books')          // returning to Bible books
export function speakHymnGuide(subpage) {
  const key = `/bible/${subpage}`
  const script = SCRIPTS[key]
  if (script) {
    _speak(script.message, null)   // null = no session lock, always speaks
    return
  }
  // Fallback for 'books' (returning to Bible reader)
  if (subpage === 'books') {
    _speak(
      `You are back in the Bible Reader. Select a testament, then choose a book and chapter to begin reading. You can also open the Hymn Centre at any time using the Hymn Centre button in the tab bar.`,
      null
    )
  }
}

export function stopVoiceGuide() {
  try {
    window.speechSynthesis.cancel()
    isSpeaking       = false
    currentUtterance = null
  } catch {}
}

export function pauseVoiceGuide() {
  try { window.speechSynthesis.pause() } catch {}
}

export function resumeVoiceGuide() {
  try { window.speechSynthesis.resume() } catch {}
}

export function isVoiceGuideSupported() {
  return 'speechSynthesis' in window
}

export function isVoiceGuideSpeaking() {
  return isSpeaking
}

export function getAvailableVoices() {
  return window.speechSynthesis.getVoices()
}

export function clearSessionHistory() {
  spokenThisSession.clear()
}