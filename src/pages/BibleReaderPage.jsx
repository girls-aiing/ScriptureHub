import React, { useState, useEffect } from 'react'

// ── PASTE YOUR FULL API KEY HERE ─────────────────────────────────
// Get it free at: https://scripture.api.bible → My Apps
// It should be ~40 characters long
const API_KEY = 'bP7SgKnADnw5o0lKdruPfuFGE7uur_gSyVGLhnlSAK'

// ── Detect if key looks valid (API.Bible keys are 32+ chars) ─────
const KEY_LOOKS_VALID = API_KEY.length >= 32

// ── 1. Translations ───────────────────────────────────────────────
// When API key is valid → uses API.Bible (more translations)
// When API key is missing/short → falls back to bible-api.com (always works)
const TRANSLATIONS = [
  {
    code: 'kjv',
    apiBibleId: 'de4e12af7f28f599-02',
    label: 'KJV',
    full: 'King James Version',
    desc: 'The classic 1611 translation, poetic and majestic.',
    badge: '📜'
  },
  {
    code: 'asv',
    apiBibleId: '01b29f4b342acc35-01',
    label: 'ASV',
    full: 'American Standard Version',
    desc: 'A precise 1901 revision of the KJV.',
    badge: '📜'
  },
  {
    code: 'web',
    apiBibleId: '65eec8e0b60e656b-01',
    label: 'WEB',
    full: 'World English Bible',
    desc: 'A modern public domain translation.',
    badge: '💡'
  },
  {
    code: 'bbe',
    apiBibleId: 'f72b840c855f362c-04',
    label: 'BBE',
    full: 'Bible in Basic English',
    desc: 'Simple vocabulary, easy for all readers.',
    badge: '💡'
  },
  {
    code: 'ylt',
    apiBibleId: null,
    label: 'YLT',
    full: "Young's Literal Translation",
    desc: 'A very literal word-for-word translation from 1898.',
    badge: '📖'
  },
  {
    code: 'darby',
    apiBibleId: null,
    label: 'DARBY',
    full: 'Darby Translation',
    desc: 'John Nelson Darby\'s 1890 scholarly translation.',
    badge: '📖'
  },
  {
    code: 'dra',
    apiBibleId: null,
    label: 'DRA',
    full: 'Douay-Rheims (Catholic)',
    desc: 'The traditional Catholic English Bible.',
    badge: '✝️'
  },
]

// ── 2. Book ID maps ───────────────────────────────────────────────
const BOOK_ID_APIBIBLE = {
  'Genesis':'GEN','Exodus':'EXO','Leviticus':'LEV','Numbers':'NUM',
  'Deuteronomy':'DEU','Joshua':'JOS','Judges':'JDG','Ruth':'RUT',
  '1 Samuel':'1SA','2 Samuel':'2SA','1 Kings':'1KI','2 Kings':'2KI',
  '1 Chronicles':'1CH','2 Chronicles':'2CH','Ezra':'EZR','Nehemiah':'NEH',
  'Esther':'EST','Job':'JOB','Psalms':'PSA','Proverbs':'PRO',
  'Ecclesiastes':'ECC','Song of Solomon':'SNG','Isaiah':'ISA',
  'Jeremiah':'JER','Lamentations':'LAM','Ezekiel':'EZK','Daniel':'DAN',
  'Hosea':'HOS','Joel':'JOL','Amos':'AMO','Obadiah':'OBA',
  'Jonah':'JON','Micah':'MIC','Nahum':'NAM','Habakkuk':'HAB',
  'Zephaniah':'ZEP','Haggai':'HAG','Zechariah':'ZEC','Malachi':'MAL',
  'Matthew':'MAT','Mark':'MRK','Luke':'LUK','John':'JHN',
  'Acts':'ACT','Romans':'ROM','1 Corinthians':'1CO','2 Corinthians':'2CO',
  'Galatians':'GAL','Ephesians':'EPH','Philippians':'PHP','Colossians':'COL',
  '1 Thessalonians':'1TH','2 Thessalonians':'2TH','1 Timothy':'1TI',
  '2 Timothy':'2TI','Titus':'TIT','Philemon':'PHM','Hebrews':'HEB',
  'James':'JAS','1 Peter':'1PE','2 Peter':'2PE','1 John':'1JN',
  '2 John':'2JN','3 John':'3JN','Jude':'JUD','Revelation':'REV',
}

// ── 3. Hymns ──────────────────────────────────────────────────────
const CLASSIC_HYMNS = [
  {
    id: 'amazing-grace',
    title: 'Amazing Grace',
    author: 'John Newton (1779)',
    lyrics: `Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see.\n\n'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed.\n\nThrough many dangers, toils and snares,\nI have already come;\n'Tis grace hath brought me safe thus far,\nAnd grace will lead me home.`
  },
  {
    id: 'abide',
    title: 'Abide With Me',
    author: 'Henry Francis Lyte (1847)',
    lyrics: `Abide with me; fast falls the eventide;\nThe darkness deepens; Lord, with me abide.\nWhen other helpers fail and comforts flee,\nHelp of the helpless, O abide with me.\n\nSwift to its close ebbs out life's little day;\nEarth's joys grow dim, its glories pass away;\nChange and decay in all around I see;\nO Thou who changest not, abide with me.`
  },
  {
    id: 'holy',
    title: 'Holy, Holy, Holy',
    author: 'Reginald Heber (1826)',
    lyrics: `Holy, Holy, Holy! Lord God Almighty!\nEarly in the morning our song shall rise to Thee;\nHoly, Holy, Holy, merciful and mighty!\nGod in three Persons, blessed Trinity!\n\nHoly, Holy, Holy! All the saints adore Thee,\nCasting down their golden crowns around the glassy sea;\nCherubim and seraphim falling down before Thee,\nWhich wert, and art, and evermore shalt be.`
  },
  {
    id: 'great-is-thy',
    title: 'Great Is Thy Faithfulness',
    author: 'Thomas O. Chisholm (1923)',
    lyrics: `Great is Thy faithfulness, O God my Father,\nThere is no shadow of turning with Thee;\nThou changest not, Thy compassions, they fail not;\nAs Thou hast been Thou forever wilt be.\n\nGreat is Thy faithfulness! Great is Thy faithfulness!\nMorning by morning new mercies I see;\nAll I have needed Thy hand hath provided—\nGreat is Thy faithfulness, Lord, unto me!`
  },
  {
    id: 'all-hail',
    title: "All Hail the Power of Jesus' Name",
    author: 'Edward Perronet (1779)',
    lyrics: `All hail the power of Jesus' name!\nLet angels prostrate fall;\nBring forth the royal diadem,\nAnd crown Him Lord of all.\n\nYe chosen seed of Israel's race,\nYe ransomed from the fall,\nHail Him who saves you by His grace,\nAnd crown Him Lord of all.`
  },
]

// ── 4. Bible Books ────────────────────────────────────────────────
const OLD_TESTAMENT = [
  {name:'Genesis',chapters:50},{name:'Exodus',chapters:40},
  {name:'Leviticus',chapters:27},{name:'Numbers',chapters:36},
  {name:'Deuteronomy',chapters:34},{name:'Joshua',chapters:24},
  {name:'Judges',chapters:21},{name:'Ruth',chapters:4},
  {name:'1 Samuel',chapters:31},{name:'2 Samuel',chapters:24},
  {name:'1 Kings',chapters:22},{name:'2 Kings',chapters:25},
  {name:'1 Chronicles',chapters:29},{name:'2 Chronicles',chapters:36},
  {name:'Ezra',chapters:10},{name:'Nehemiah',chapters:13},
  {name:'Esther',chapters:10},{name:'Job',chapters:42},
  {name:'Psalms',chapters:150},{name:'Proverbs',chapters:31},
  {name:'Ecclesiastes',chapters:12},{name:'Song of Solomon',chapters:8},
  {name:'Isaiah',chapters:66},{name:'Jeremiah',chapters:52},
  {name:'Lamentations',chapters:5},{name:'Ezekiel',chapters:48},
  {name:'Daniel',chapters:12},{name:'Hosea',chapters:14},
  {name:'Joel',chapters:3},{name:'Amos',chapters:9},
  {name:'Obadiah',chapters:1},{name:'Jonah',chapters:4},
  {name:'Micah',chapters:7},{name:'Nahum',chapters:3},
  {name:'Habakkuk',chapters:3},{name:'Zephaniah',chapters:3},
  {name:'Haggai',chapters:2},{name:'Zechariah',chapters:14},
  {name:'Malachi',chapters:4},
]

const NEW_TESTAMENT = [
  {name:'Matthew',chapters:28},{name:'Mark',chapters:16},
  {name:'Luke',chapters:24},{name:'John',chapters:21},
  {name:'Acts',chapters:28},{name:'Romans',chapters:16},
  {name:'1 Corinthians',chapters:16},{name:'2 Corinthians',chapters:13},
  {name:'Galatians',chapters:6},{name:'Ephesians',chapters:6},
  {name:'Philippians',chapters:4},{name:'Colossians',chapters:4},
  {name:'1 Thessalonians',chapters:5},{name:'2 Thessalonians',chapters:3},
  {name:'1 Timothy',chapters:6},{name:'2 Timothy',chapters:4},
  {name:'Titus',chapters:3},{name:'Philemon',chapters:1},
  {name:'Hebrews',chapters:13},{name:'James',chapters:5},
  {name:'1 Peter',chapters:5},{name:'2 Peter',chapters:3},
  {name:'1 John',chapters:5},{name:'2 John',chapters:1},
  {name:'3 John',chapters:1},{name:'Jude',chapters:1},
  {name:'Revelation',chapters:22},
]

// ── 5. Helpers ────────────────────────────────────────────────────
const KEY_VERSION = 'scripturehub_version'
function loadPref(key, fb) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fb } catch { return fb }
}
function savePref(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}
function cleanText(text) {
  if (!text) return ''
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/¶/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
function parseVerses(raw) {
  if (!raw) return []
  const cleaned = raw.replace(/<[^>]*>/g, '').replace(/¶/g, '')
  const matches = [...cleaned.matchAll(/\[(\d+)\]\s*([\s\S]*?)(?=\[\d+\]|$)/g)]
  if (matches.length === 0) {
    const t = cleaned.replace(/\s+/g, ' ').trim()
    return t ? [{ verse: 1, text: t }] : []
  }
  return matches
    .map(m => ({ verse: Number(m[1]), text: m[2].replace(/\s+/g, ' ').trim() }))
    .filter(v => v.text.length > 0)
}

// ── 6. Fetch — tries API.Bible first, falls back to bible-api.com ─
async function fetchFromBibleApiCom(bookName, chapter, code) {
  const slug = encodeURIComponent(bookName.toLowerCase())
  const url = `https://bible-api.com/${slug}%20${chapter}?translation=${code}`
  console.log('📖 bible-api.com fetch:', url)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`bible-api.com error: HTTP ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  if (!data.verses?.length) throw new Error('No verses returned')
  return data.verses.map(v => ({ verse: v.verse, text: cleanText(v.text) }))
}

async function fetchFromApiBible(bookName, chapter, apiBibleId) {
  const bookCode = BOOK_ID_APIBIBLE[bookName]
  if (!bookCode) throw new Error(`Book not mapped: ${bookName}`)
  const chapterId = `${bookCode}.${chapter}`
  const url = `https://api.scripture.api.bible/v1/bibles/${apiBibleId}/chapters/${chapterId}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`
  console.log('📖 API.Bible fetch:', url)
  const res = await fetch(url, { headers: { 'api-key': API_KEY } })
  if (res.status === 401) throw new Error('API_KEY_INVALID')
  if (res.status === 404) throw new Error(`Chapter not found in this translation.`)
  if (!res.ok) throw new Error(`API.Bible error: HTTP ${res.status}`)
  const data = await res.json()
  const verses = parseVerses(data?.data?.content ?? '')
  if (!verses.length) throw new Error('No verses found in response.')
  return verses
}

async function fetchChapter(bookName, chapter, translationCode) {
  const translation = TRANSLATIONS.find(t => t.code === translationCode)
  if (!translation) throw new Error(`Unknown translation: ${translationCode}`)

  // If translation has an API.Bible ID AND key looks valid → try API.Bible first
  if (translation.apiBibleId && KEY_LOOKS_VALID) {
    try {
      return await fetchFromApiBible(bookName, chapter, translation.apiBibleId)
    } catch (err) {
      if (err.message === 'API_KEY_INVALID') {
        console.warn('⚠️ API.Bible key invalid, falling back to bible-api.com')
        // Fall through to bible-api.com below
      } else {
        throw err
      }
    }
  }

  // Always works fallback — bible-api.com
  return await fetchFromBibleApiCom(bookName, chapter, translationCode)
}

// ── 7. Main Component ─────────────────────────────────────────────
export default function BibleReaderPage() {
  const [view, setView]                       = useState('books')
  const [testament, setTestament]             = useState('old')
  const [selectedBook, setSelectedBook]       = useState(null)
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [selectedHymn, setSelectedHymn]       = useState(null)
  const [verses, setVerses]                   = useState([])
  const [loading, setLoading]                 = useState(false)
  const [error, setError]                     = useState(null)
  const [version, setVersion]                 = useState(
    () => loadPref(KEY_VERSION, 'kjv')
  )
  const [isReading, setIsReading]             = useState(false)
  const [readingVerse, setReadingVerse]       = useState(null)

  useEffect(() => { savePref(KEY_VERSION, version) }, [version])

  useEffect(() => {
    if (!selectedBook || !selectedChapter) return
    let cancelled = false
    setLoading(true)
    setVerses([])
    setError(null)
    fetchChapter(selectedBook.name, selectedChapter, version)
      .then(v  => { if (!cancelled) { setVerses(v);        setLoading(false) } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false) } })
    return () => { cancelled = true }
  }, [selectedBook, selectedChapter, version])

  const stopNarration = () => window.speechSynthesis.cancel()

  const speak = (text, verseNum = null) => {
    stopNarration()
    const utt = new SpeechSynthesisUtterance(cleanText(text))
    utt.rate = 0.88
    utt.onstart = () => { setIsReading(true);  setReadingVerse(verseNum) }
    utt.onend   = () => { setIsReading(false); setReadingVerse(null) }
    window.speechSynthesis.speak(utt)
  }

  const retry = () => {
    if (!selectedBook || !selectedChapter) return
    setLoading(true); setError(null); setVerses([])
    fetchChapter(selectedBook.name, selectedChapter, version)
      .then(v  => { setVerses(v);        setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }

  const currentTranslation = TRANSLATIONS.find(t => t.code === version)

  // ── VIEW: Hymn Detail ─────────────────────────────────────────
  if (view === 'hymn-detail' && selectedHymn) {
    return (
      <div style={s.page}>
        <header style={s.topBar}>
          <button style={s.backBtn} onClick={() => { stopNarration(); setView('hymns') }}>← Hymns</button>
          <button style={s.listenBtn} onClick={() => isReading ? stopNarration() : speak(selectedHymn.lyrics)}>
            {isReading ? '⏹ Stop' : '🔊 Listen'}
          </button>
        </header>
        <main style={s.hymnMain}>
          <h1 style={s.hymnTitle}>{selectedHymn.title}</h1>
          <p style={s.hymnAuthor}>{selectedHymn.author}</p>
          <pre style={s.hymnLyrics}>{selectedHymn.lyrics}</pre>
        </main>
        <style>{FONT}</style>
      </div>
    )
  }

  // ── VIEW: Hymn List ───────────────────────────────────────────
  if (view === 'hymns') {
    return (
      <div style={s.page}>
        <button style={s.backBtn} onClick={() => setView('books')}>← Back to Bible</button>
        <h1 style={s.navTitle}>🎵 Classic Hymnal</h1>
        <div style={s.grid}>
          {CLASSIC_HYMNS.map(h => (
            <button key={h.id} style={s.card}
              onClick={() => { setSelectedHymn(h); setView('hymn-detail') }}>
              <div style={s.cardTitle}>{h.title}</div>
              <div style={s.cardSub}>{h.author}</div>
            </button>
          ))}
        </div>
        <style>{FONT}</style>
      </div>
    )
  }

  // ── VIEW: Book List ───────────────────────────────────────────
  if (view === 'books') {
    return (
      <div style={s.page}>
        <h1 style={s.navTitle}>✝ Holy Bible</h1>
        <div style={s.tabs}>
          <button style={{...s.tab,...(testament==='old'?s.tabActive:{})}} onClick={() => setTestament('old')}>
            Old Testament
          </button>
          <button style={{...s.tab,...(testament==='new'?s.tabActive:{})}} onClick={() => setTestament('new')}>
            New Testament
          </button>
          <button style={{...s.tab, border:'1px solid #f0c040'}} onClick={() => setView('hymns')}>
            🎵 Hymns
          </button>
        </div>
        <div style={s.grid}>
          {(testament === 'old' ? OLD_TESTAMENT : NEW_TESTAMENT).map(b => (
            <button key={b.name} style={s.card}
              onClick={() => { setSelectedBook(b); setView('chapters') }}>
              <div style={s.cardTitle}>{b.name}</div>
              <div style={s.cardSub}>{b.chapters} chapters</div>
            </button>
          ))}
        </div>
        <style>{FONT}</style>
      </div>
    )
  }

  // ── VIEW: Chapter List ────────────────────────────────────────
  if (view === 'chapters') {
    return (
      <div style={s.page}>
        <button style={s.backBtn} onClick={() => setView('books')}>← Back to Books</button>
        <h1 style={s.navTitle}>{selectedBook.name}</h1>
        <div style={s.chapterGrid}>
          {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(ch => (
            <button key={ch} style={s.chapterBtn}
              onClick={() => { setSelectedChapter(ch); setView('reader') }}>
              {ch}
            </button>
          ))}
        </div>
        <style>{FONT}</style>
      </div>
    )
  }

  // ── VIEW: Reader ──────────────────────────────────────────────
  return (
    <div style={s.page}>
      <header style={s.readerHeader}>
        <button style={s.backBtn} onClick={() => { stopNarration(); setView('chapters') }}>
          ← Chapters
        </button>
        <div style={s.readerCenter}>
          <h1 style={s.readerTitle}>
            {selectedBook?.name} <span style={{color:'#c8a96e'}}>{selectedChapter}</span>
          </h1>
          <select
            value={version}
            onChange={e => { setVersion(e.target.value); setError(null) }}
            style={s.select}
          >
            {TRANSLATIONS.map(t => (
              <option key={t.code} value={t.code}>
                {t.badge} {t.label} — {t.full}
              </option>
            ))}
          </select>
          {currentTranslation && (
            <div style={s.transDesc}>{currentTranslation.desc}</div>
          )}
        </div>
        <button
          style={{...s.listenBtn, opacity:(loading||!verses.length)?0.35:1}}
          disabled={loading || !verses.length}
          onClick={() => isReading ? stopNarration() : speak(verses.map(v=>v.text).join('  '))}
        >
          {isReading ? '⏹ Stop' : '🔊 Listen'}
        </button>
      </header>

      <main style={s.scriptureColumn}>

        {/* Loading */}
        {loading && (
          <div style={s.centerMsg}>
            <div style={s.spinner}/>
            <div style={{marginTop:'1rem', color:'#f0c040'}}>📖 Loading the Word of God...</div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={s.errorBox}>
            <div style={{fontSize:'2.5rem',marginBottom:'0.75rem'}}>⚠️</div>
            <div style={{marginBottom:'1.5rem',lineHeight:'1.6'}}>{error}</div>
            <div style={s.btnRow}>
              <button style={s.retryBtn} onClick={retry}>🔄 Try Again</button>
              <button style={s.retryBtn} onClick={() => { setVersion('kjv'); setError(null) }}>
                Switch to KJV
              </button>
            </div>
          </div>
        )}

        {/* Waiting */}
        {!loading && !error && verses.length === 0 && (
          <div style={s.centerMsg}>🙏 Select a book and chapter to begin reading</div>
        )}

        {/* Verses */}
        {!loading && !error && verses.length > 0 && (
          <>
            <div style={s.versionBadge}>
              {currentTranslation?.badge} Reading: <strong>{currentTranslation?.full || version}</strong>
            </div>

            {verses.map(v => (
              <p
                key={v.verse}
                style={{...s.verse,...(readingVerse===v.verse?s.verseActive:{})}}
                onClick={() => speak(v.text, v.verse)}
                title="Tap to hear this verse"
              >
                <sup style={s.verseNum}>{v.verse}</sup>
                <span style={s.verseText}>{v.text}</span>
              </p>
            ))}

            {/* Prev / Next navigation */}
            <div style={s.chapterNav}>
              <button
                style={{...s.navBtn, opacity: selectedChapter<=1 ? 0.3 : 1}}
                disabled={selectedChapter <= 1}
                onClick={() => { stopNarration(); setSelectedChapter(c=>c-1); window.scrollTo(0,0) }}
              >
                ← Previous
              </button>
              <span style={s.navLabel}>Ch {selectedChapter} / {selectedBook?.chapters}</span>
              <button
                style={{...s.navBtn, opacity: selectedChapter>=selectedBook?.chapters ? 0.3 : 1}}
                disabled={selectedChapter >= selectedBook?.chapters}
                onClick={() => { stopNarration(); setSelectedChapter(c=>c+1); window.scrollTo(0,0) }}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </main>

      <style>{FONT}</style>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ── Font ──────────────────────────────────────────────────────────
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap');`

// ── Styles ────────────────────────────────────────────────────────
const s = {
  page:           { background:'#120a05', minHeight:'100vh', color:'#f0e6d2', padding:'2rem 1rem', fontFamily:"'Crimson Text', serif" },
  navTitle:       { textAlign:'center', color:'#f0c040', fontSize:'2.6rem', marginBottom:'1.5rem', fontWeight:'700' },
  tabs:           { display:'flex', justifyContent:'center', gap:'0.75rem', marginBottom:'2rem', flexWrap:'wrap' },
  tab:            { padding:'10px 22px', borderRadius:'20px', border:'1px solid transparent', background:'transparent', color:'#f0c040', cursor:'pointer', fontFamily:'inherit', fontSize:'1rem' },
  tabActive:      { background:'#f0c040', color:'#1a0a00', fontWeight:'700' },
  grid:           { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'12px', maxWidth:'920px', margin:'0 auto' },
  card:           { padding:'14px 12px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(240,192,64,0.25)', color:'#f0e6d2', borderRadius:'10px', cursor:'pointer', textAlign:'left', fontFamily:'inherit' },
  cardTitle:      { color:'#f0e6d2', fontWeight:'600', fontSize:'1rem', marginBottom:'4px' },
  cardSub:        { fontSize:'0.78rem', color:'#c8a96e' },
  chapterGrid:    { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(58px, 1fr))', gap:'10px', maxWidth:'700px', margin:'0 auto' },
  chapterBtn:     { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(240,192,64,0.4)', color:'#f0c040', borderRadius:'50%', width:'54px', height:'54px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontFamily:'inherit', fontSize:'1.05rem' },
  topBar:         { display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:'860px', margin:'0 auto 2rem' },
  readerHeader:   { display:'flex', justifyContent:'space-between', alignItems:'flex-start', maxWidth:'860px', margin:'0 auto 2rem', flexWrap:'wrap', gap:'1rem' },
  readerCenter:   { flex:1, textAlign:'center', minWidth:'200px' },
  readerTitle:    { fontSize:'2rem', color:'#f0c040', margin:'0 0 0.5rem', fontWeight:'700' },
  select:         { background:'#1c1008', color:'#f0e6d2', border:'1px solid #f0c040', padding:'7px 12px', borderRadius:'8px', fontFamily:'inherit', fontSize:'0.95rem', width:'100%', maxWidth:'340px', cursor:'pointer' },
  transDesc:      { fontSize:'0.82rem', color:'#c8a96e', fontStyle:'italic', marginTop:'5px' },
  backBtn:        { background:'transparent', border:'none', color:'#c8a96e', cursor:'pointer', fontSize:'1rem', fontFamily:'inherit', padding:'6px 0' },
  listenBtn:      { padding:'10px 22px', borderRadius:'25px', border:'1px solid #f0c040', color:'#f0c040', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:'1rem' },
  retryBtn:       { padding:'10px 20px', borderRadius:'25px', border:'1px solid #e67e22', color:'#e67e22', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:'1rem' },
  btnRow:         { display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' },
  scriptureColumn:{ maxWidth:'800px', margin:'0 auto' },
  versionBadge:   { textAlign:'center', color:'#c8a96e', fontSize:'0.95rem', fontStyle:'italic', marginBottom:'2rem', paddingBottom:'1rem', borderBottom:'1px solid rgba(240,192,64,0.2)' },
  verse:          { marginBottom:'1.6rem', cursor:'pointer', padding:'8px 10px', borderRadius:'8px', transition:'background 0.2s', lineHeight:'1.8' },
  verseActive:    { background:'rgba(240,192,64,0.12)', borderLeft:'3px solid #f0c040', paddingLeft:'14px' },
  verseNum:       { color:'#f0c040', marginRight:'8px', fontWeight:'700', fontSize:'0.9rem' },
  verseText:      { fontSize:'1.4rem' },
  centerMsg:      { textAlign:'center', fontSize:'1.15rem', color:'#f0c040', marginTop:'4rem', fontStyle:'italic' },
  spinner:        { width:'40px', height:'40px', border:'3px solid rgba(240,192,64,0.2)', borderTop:'3px solid #f0c040', borderRadius:'50%', animation:'spin 0.9s linear infinite', margin:'0 auto' },
  errorBox:       { textAlign:'center', color:'#e67e22', padding:'2.5rem 2rem', border:'1px solid #e67e22', borderRadius:'14px', maxWidth:'480px', margin:'3rem auto' },
  chapterNav:     { display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'3rem', paddingTop:'2rem', borderTop:'1px solid rgba(240,192,64,0.2)', maxWidth:'500px', margin:'3rem auto 0' },
  navBtn:         { padding:'10px 24px', borderRadius:'25px', border:'1px solid #f0c040', color:'#f0c040', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:'1rem' },
  navLabel:       { color:'#c8a96e', fontSize:'0.95rem', fontStyle:'italic' },
  hymnMain:       { maxWidth:'700px', margin:'0 auto', textAlign:'center' },
  hymnTitle:      { color:'#f0c040', fontSize:'2.4rem', marginBottom:'0.4rem', fontWeight:'700' },
  hymnAuthor:     { fontStyle:'italic', color:'#c8a96e', marginBottom:'2.5rem', fontSize:'1.1rem' },
  hymnLyrics:     { whiteSpace:'pre-wrap', fontSize:'1.4rem', color:'#f0e6d2', fontFamily:'inherit', lineHeight:'2', textAlign:'left', display:'inline-block' },
}
