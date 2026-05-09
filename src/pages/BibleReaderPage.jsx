import React, { useState, useEffect, useRef } from 'react'

// ── Updated Bible Versions ──────────────────────────────────────
const TRANSLATIONS = {
  '📜 Formal & Literal (Word-for-Word)': [
    { code: 'nasb', label: 'NASB', full: 'New American Standard Bible', desc: 'Most literal English translation available.' },
    { code: 'esv', label: 'ESV', full: 'English Standard Version', desc: 'Balances literalness with literary beauty.' },
    { code: 'kjv', label: 'KJV', full: 'King James Version', desc: 'The 1611 classic poetic rhythm.' },
    { code: 'nkjv', label: 'NKJV', full: 'New King James Version', desc: 'KJV style without archaic words.' },
    { code: 'rsv', label: 'RSV', full: 'Revised Standard Version', desc: 'Bridges ancient literalism and modern scholarship.' },
    { code: 'nrsv', label: 'NRSV', full: 'New Revised Standard Version', desc: 'Academic accuracy with gender-neutral language.' },
  ],
  '💡 Functional & Clear (Thought-for-Thought)': [
    { code: 'niv', label: 'NIV', full: 'New International Version', desc: 'Balance of accuracy and clarity.' },
    { code: 'csb', label: 'CSB', full: 'Christian Standard Bible', desc: 'More literal than NIV, smoother than ESV.' },
    { code: 'nlt', label: 'NLT', full: 'New Living Translation', desc: 'Modern, natural English for easy understanding.' },
    { code: 'gnt', label: 'GNT', full: 'Good News Translation', desc: 'Designed for clarity and global reach.' },
  ],
  '📖 Paraphrase & Modern': [
    { code: 'msg', label: 'MSG', full: 'The Message', desc: 'Contemporary slang and modern idioms.' },
    { code: 'tlb', label: 'TLB', full: 'The Living Bible', desc: 'Simplified version for a clear narrative.' },
    { code: 'tpt', label: 'TPT', full: 'The Passion Translation', desc: 'Focused on the heart and emotion of the text.' },
  ]
}

const ALL_TRANSLATIONS = Object.values(TRANSLATIONS).flat()

// ── Bible Books ──────────────────────────────────────────────────
const OLD_TESTAMENT = [
  { name: 'Genesis', chapters: 50 }, { name: 'Exodus', chapters: 40 }, { name: 'Leviticus', chapters: 27 },
  { name: 'Numbers', chapters: 36 }, { name: 'Deuteronomy', chapters: 34 }, { name: 'Joshua', chapters: 24 },
  { name: 'Judges', chapters: 21 }, { name: 'Ruth', chapters: 4 }, { name: '1 Samuel', chapters: 31 },
  { name: '2 Samuel', chapters: 24 }, { name: '1 Kings', chapters: 22 }, { name: '2 Kings', chapters: 25 },
  { name: '1 Chronicles', chapters: 29 }, { name: '2 Chronicles', chapters: 36 }, { name: 'Ezra', chapters: 10 },
  { name: 'Nehemiah', chapters: 13 }, { name: 'Esther', chapters: 10 }, { name: 'Job', chapters: 42 },
  { name: 'Psalms', chapters: 150 }, { name: 'Proverbs', chapters: 31 }, { name: 'Ecclesiastes', chapters: 12 },
  { name: 'Song of Solomon', chapters: 8 }, { name: 'Isaiah', chapters: 66 }, { name: 'Jeremiah', chapters: 52 },
  { name: 'Lamentations', chapters: 5 }, { name: 'Ezekiel', chapters: 48 }, { name: 'Daniel', chapters: 12 },
  { name: 'Hosea', chapters: 14 }, { name: 'Joel', chapters: 3 }, { name: 'Amos', chapters: 9 },
  { name: 'Obadiah', chapters: 1 }, { name: 'Jonah', chapters: 4 }, { name: 'Micah', chapters: 7 },
  { name: 'Nahum', chapters: 3 }, { name: 'Habakkuk', chapters: 3 }, { name: 'Zephaniah', chapters: 3 },
  { name: 'Haggai', chapters: 2 }, { name: 'Zechariah', chapters: 14 }, { name: 'Malachi', chapters: 4 },
]

const NEW_TESTAMENT = [
  { name: 'Matthew', chapters: 28 }, { name: 'Mark', chapters: 16 }, { name: 'Luke', chapters: 24 },
  { name: 'John', chapters: 21 }, { name: 'Acts', chapters: 28 }, { name: 'Romans', chapters: 16 },
  { name: '1 Corinthians', chapters: 16 }, { name: '2 Corinthians', chapters: 13 }, { name: 'Galatians', chapters: 6 },
  { name: 'Ephesians', chapters: 6 }, { name: 'Philippians', chapters: 4 }, { name: 'Colossians', chapters: 4 },
  { name: '1 Thessalonians', chapters: 5 }, { name: '2 Thessalonians', chapters: 3 }, { name: '1 Timothy', chapters: 6 },
  { name: '2 Timothy', chapters: 4 }, { name: 'Titus', chapters: 3 }, { name: 'Philemon', chapters: 1 },
  { name: 'Hebrews', chapters: 13 }, { name: 'James', chapters: 5 }, { name: '1 Peter', chapters: 5 },
  { name: '2 Peter', chapters: 3 }, { name: '1 John', chapters: 5 }, { name: '2 John', chapters: 1 },
  { name: '3 John', chapters: 1 }, { name: 'Jude', chapters: 1 }, { name: 'Revelation', chapters: 22 },
]

// ── Helpers ──────────────────────────────────────────────────────
const KEY_VERSION = 'scripturehub_version'
function loadPref(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } }
function savePref(key, value) { try { localStorage.setItem(key, JSON.stringify(value)) } catch {} }
function bookSlug(name) { return name.toLowerCase().replace(/\s+/g, '+') }

// NEW: Function to remove reference numbers and footnote marks
const cleanText = (text) => {
  if (!text) return ''
  return text
    .replace(/\[\d+\]/g, '')      // Remove [1] style markers
    .replace(/\d+:\d+/g, '')      // Remove 1:1 style references
    .replace(/¶/g, '')            // Remove paragraph markers
    .replace(/\s+/g, ' ')         // Clean up extra spaces
    .trim()
}

async function fetchChapter(bookName, chapter, translation) {
  const res = await fetch(`https://bible-api.com/${bookSlug(bookName)}+${chapter}?translation=${translation}`)
  if (!res.ok) throw new Error('Failed to load')
  const data = await res.json()
  return data.verses || []
}

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════
export default function BibleReaderPage() {
  const [view, setView] = useState('books')
  const [testament, setTestament] = useState('old')
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [verses, setVerses] = useState([])
  const [loading, setLoading] = useState(false)
  const [version, setVersion] = useState(() => loadPref(KEY_VERSION, 'kjv'))

  const [isReading, setIsReading] = useState(false)
  const [readingVerse, setReadingVerse] = useState(null)

  useEffect(() => { savePref(KEY_VERSION, version) }, [version])

  useEffect(() => {
    if (!selectedBook || !selectedChapter) return
    setLoading(true)
    fetchChapter(selectedBook.name, selectedChapter, version)
      .then(v => { setVerses(v); setLoading(false) })
      .catch(() => setLoading(false))
  }, [selectedBook, selectedChapter, version])

  const stopNarration = () => window.speechSynthesis.cancel()

  const speakVerse = (text, verseNum, autoNext = false) => {
    stopNarration()
    // Clean text before reading out loud
    const cleaned = cleanText(text)
    const utterance = new SpeechSynthesisUtterance(cleaned)
    utterance.rate = 0.88; utterance.pitch = 0.95; utterance.lang = 'en-US'
    utterance.onstart = () => { setIsReading(true); setReadingVerse(verseNum) }
    utterance.onend = () => {
      if (autoNext && verseNum < verses.length) {
        const next = verses.find(v => v.verse === verseNum + 1)
        if (next) speakVerse(next.text, next.verse, true)
      } else {
        setIsReading(false); setReadingVerse(null)
      }
    }
    window.speechSynthesis.speak(utterance)
  }

  const toggleNarration = () => {
    if (isReading) { stopNarration(); setIsReading(false); setReadingVerse(null) }
    else if (verses.length > 0) speakVerse(verses[0].text, verses[0].verse, true)
  }

  if (view === 'books') {
    return (
      <div className="br-page" style={s.page}>
        <h1 style={s.navTitle}>Holy Bible</h1>
        <div style={s.tabs}>
          <button onClick={() => setTestament('old')} style={{...s.tab, ...(testament==='old'?s.tabActive:{})}}>Old Testament</button>
          <button onClick={() => setTestament('new')} style={{...s.tab, ...(testament==='new'?s.tabActive:{})}}>New Testament</button>
        </div>
        <div style={s.grid}>
          {(testament === 'old' ? OLD_TESTAMENT : NEW_TESTAMENT).map(b => (
            <button key={b.name} style={s.card} onClick={() => { setSelectedBook(b); setView('chapters') }}>{b.name}</button>
          ))}
        </div>
      </div>
    )
  }

  if (view === 'chapters') {
    return (
      <div className="br-page" style={s.page}>
        <button onClick={() => setView('books')} style={s.backBtn}>&larr; Back to Books</button>
        <h1 style={s.navTitle}>{selectedBook.name}</h1>
        <div style={s.grid}>
          {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(ch => (
            <button key={ch} style={s.chapterBtn} onClick={() => { setSelectedChapter(ch); setView('reader') }}>{ch}</button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="br-page" style={s.page}>
      <header style={s.header}>
        <button onClick={() => { stopNarration(); setView('chapters') }} style={s.backBtn}>&larr; Chapters</button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={s.readerTitle}>{selectedBook.name} {selectedChapter}</h1>
          <select value={version} onChange={(e) => setVersion(e.target.value)} style={s.select}>
            {Object.entries(TRANSLATIONS).map(([cat, list]) => (
              <optgroup label={cat} key={cat}>
                {list.map(t => <option key={t.code} value={t.code}>{t.label} - {t.full}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <button 
          onClick={toggleNarration} 
          style={{...s.clergyBtn, background: isReading ? '#f0c040' : 'rgba(255,255,255,0.1)', color: isReading ? '#1a0a00' : '#f0c040'}}
        >
          {isReading ? '⏹ Stop' : '🔊 Listen'}
        </button>
      </header>

      <main style={s.scriptureColumn}>
        {loading ? <div style={s.loading}>Loading the Word...</div> : verses.map(v => (
          <p key={v.verse} style={{...s.verse, ...(readingVerse === v.verse ? s.reading : {})}} onClick={() => speakVerse(v.text, v.verse)}>
            <sup style={s.verseNum}>{v.verse}</sup> 
            {/* Cleaned text display */}
            <span style={s.verseText}>{cleanText(v.text)}</span>
          </p>
        ))}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>
    </div>
  )
}

const s = {
  page: { background: '#120a05', minHeight: '100vh', color: '#f0e6d2', padding: '2rem 1rem', fontFamily: "'Crimson Text', serif" },
  navTitle: { textAlign: 'center', color: '#f0c040', fontSize: '2.8rem', marginBottom: '1.5rem' },
  tabs: { display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' },
  tab: { padding: '10px 20px', borderRadius: '20px', border: '1px solid #f0c040', background: 'transparent', color: '#f0c040', cursor: 'pointer', fontFamily: 'inherit' },
  tabActive: { background: '#f0c040', color: '#1a0a00' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px', maxWidth: '900px', margin: '0 auto' },
  card: { padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(240,192,64,0.2)', color: '#f0e6d2', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontFamily: 'inherit' },
  chapterBtn: { padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid #f0c040', color: '#f0c040', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '850px', margin: '0 auto 2.5rem', borderBottom: '1px solid rgba(201,168,76,0.2)', paddingBottom: '1.5rem' },
  readerTitle: { fontSize: '2.2rem', color: '#f0c040', margin: '0 0 0.5rem 0' },
  select: { background: '#1c1008', color: '#f0e6d2', border: '1px solid #f0c040', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' },
  backBtn: { background: 'transparent', border: 'none', color: '#c8a96e', cursor: 'pointer', fontSize: '1.1rem' },
  clergyBtn: { padding: '12px 24px', borderRadius: '25px', border: '1px solid #f0c040', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' },
  scriptureColumn: { maxWidth: '800px', margin: '0 auto', lineHeight: '1.9' },
  verse: { marginBottom: '1.8rem', cursor: 'pointer', padding: '12px', borderRadius: '10px', transition: '0.3s' },
  reading: { background: 'rgba(240,192,64,0.15)', borderLeft: '5px solid #f0c040' },
  verseNum: { color: '#f0c040', marginRight: '12px', fontWeight: 'bold', fontSize: '1rem' },
  verseText: { fontSize: '1.45rem' },
  loading: { textAlign: 'center', fontSize: '1.2rem', color: '#f0c040', marginTop: '3rem' }
}