import React, { useState, useEffect, useRef } from 'react'

// ── Bible Books ──────────────────────────────────────────────────
const OLD_TESTAMENT = [
  { name: 'Genesis', chapters: 50 },
  { name: 'Exodus', chapters: 40 },
  { name: 'Leviticus', chapters: 27 },
  { name: 'Numbers', chapters: 36 },
  { name: 'Deuteronomy', chapters: 34 },
  { name: 'Joshua', chapters: 24 },
  { name: 'Judges', chapters: 21 },
  { name: 'Ruth', chapters: 4 },
  { name: '1 Samuel', chapters: 31 },
  { name: '2 Samuel', chapters: 24 },
  { name: '1 Kings', chapters: 22 },
  { name: '2 Kings', chapters: 25 },
  { name: '1 Chronicles', chapters: 29 },
  { name: '2 Chronicles', chapters: 36 },
  { name: 'Ezra', chapters: 10 },
  { name: 'Nehemiah', chapters: 13 },
  { name: 'Esther', chapters: 10 },
  { name: 'Job', chapters: 42 },
  { name: 'Psalms', chapters: 150 },
  { name: 'Proverbs', chapters: 31 },
  { name: 'Ecclesiastes', chapters: 12 },
  { name: 'Song of Solomon', chapters: 8 },
  { name: 'Isaiah', chapters: 66 },
  { name: 'Jeremiah', chapters: 52 },
  { name: 'Lamentations', chapters: 5 },
  { name: 'Ezekiel', chapters: 48 },
  { name: 'Daniel', chapters: 12 },
  { name: 'Hosea', chapters: 14 },
  { name: 'Joel', chapters: 3 },
  { name: 'Amos', chapters: 9 },
  { name: 'Obadiah', chapters: 1 },
  { name: 'Jonah', chapters: 4 },
  { name: 'Micah', chapters: 7 },
  { name: 'Nahum', chapters: 3 },
  { name: 'Habakkuk', chapters: 3 },
  { name: 'Zephaniah', chapters: 3 },
  { name: 'Haggai', chapters: 2 },
  { name: 'Zechariah', chapters: 14 },
  { name: 'Malachi', chapters: 4 },
]

const NEW_TESTAMENT = [
  { name: 'Matthew', chapters: 28 },
  { name: 'Mark', chapters: 16 },
  { name: 'Luke', chapters: 24 },
  { name: 'John', chapters: 21 },
  { name: 'Acts', chapters: 28 },
  { name: 'Romans', chapters: 16 },
  { name: '1 Corinthians', chapters: 16 },
  { name: '2 Corinthians', chapters: 13 },
  { name: 'Galatians', chapters: 6 },
  { name: 'Ephesians', chapters: 6 },
  { name: 'Philippians', chapters: 4 },
  { name: 'Colossians', chapters: 4 },
  { name: '1 Thessalonians', chapters: 5 },
  { name: '2 Thessalonians', chapters: 3 },
  { name: '1 Timothy', chapters: 6 },
  { name: '2 Timothy', chapters: 4 },
  { name: 'Titus', chapters: 3 },
  { name: 'Philemon', chapters: 1 },
  { name: 'Hebrews', chapters: 13 },
  { name: 'James', chapters: 5 },
  { name: '1 Peter', chapters: 5 },
  { name: '2 Peter', chapters: 3 },
  { name: '1 John', chapters: 5 },
  { name: '2 John', chapters: 1 },
  { name: '3 John', chapters: 1 },
  { name: 'Jude', chapters: 1 },
  { name: 'Revelation', chapters: 22 },
]

// ── All 11 Free Translations ─────────────────────────────────────
const TRANSLATIONS = {
  '📖 Word-for-Word (Formal)': [
    {
      code: 'kjv',
      label: 'KJV',
      full: 'King James Version',
      year: '1611',
      desc: 'The most widely read English Bible in history. Majestic, poetic language.',
      lang: '🇬🇧 English',
    },
    {
      code: 'asv',
      label: 'ASV',
      full: 'American Standard Version',
      year: '1901',
      desc: 'Highly literal translation. Preferred by scholars for word studies.',
      lang: '🇺🇸 English',
    },
    {
      code: 'web',
      label: 'WEB',
      full: 'World English Bible',
      year: '2000',
      desc: 'Modern public domain update of the ASV. Clear and accurate.',
      lang: '🇺🇸 English',
    },
    {
      code: 'webbe',
      label: 'WEBBE',
      full: 'World English Bible (British)',
      year: '2000',
      desc: 'British spelling edition of the World English Bible.',
      lang: '🇬🇧 English',
    },
    {
      code: 'darby',
      label: 'DARBY',
      full: 'Darby Translation',
      year: '1890',
      desc: 'Extremely literal translation by John Nelson Darby. Used in prophecy study.',
      lang: '🇬🇧 English',
    },
    {
      code: 'ylt',
      label: 'YLT',
      full: "Young's Literal Translation",
      year: '1862',
      desc: "Robert Young's ultra-literal rendering of the original Hebrew and Greek.",
      lang: '🇬🇧 English',
    },
  ],
  '💡 Thought-for-Thought (Dynamic)': [
    {
      code: 'bbe',
      label: 'BBE',
      full: 'Bible in Basic English',
      year: '1949',
      desc: 'Uses only 850 basic English words. Perfect for new readers and ESL learners.',
      lang: '🇬🇧 English',
    },
    {
      code: 'oeb-us',
      label: 'OEB-US',
      full: 'Open English Bible (US Edition)',
      year: '2010',
      desc: 'Modern, readable translation. Free and open source.',
      lang: '🇺🇸 English',
    },
    {
      code: 'oeb-cw',
      label: 'OEB-CW',
      full: 'Open English Bible (Commonwealth)',
      year: '2010',
      desc: 'Commonwealth spelling edition of the Open English Bible.',
      lang: '🌍 English',
    },
  ],
  '🌍 Global Languages': [
    {
      code: 'almeida',
      label: 'ALMEIDA',
      full: 'Almeida Revista e Corrigida',
      year: '1848',
      desc: 'The most widely used Portuguese Bible translation. João Ferreira de Almeida.',
      lang: '🇧🇷 Portuguese',
    },
    {
      code: 'rccv',
      label: 'RCCV',
      full: 'Romanian Corrected Cornilescu',
      year: '1924',
      desc: 'The standard Romanian Protestant Bible translation.',
      lang: '🇷🇴 Romanian',
    },
  ],
}

const ALL_TRANSLATIONS = Object.values(TRANSLATIONS).flat()

// ── LocalStorage Helpers ─────────────────────────────────────────
const KEY_VERSION    = 'scripturehub_version'
const KEY_PARALLEL   = 'scripturehub_parallel'
const KEY_PAR_MODE   = 'scripturehub_parmode'
const KEY_HIGHLIGHTS = 'scripturehub_highlights'

function loadPref(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}
function savePref(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

// ── API Fetch ────────────────────────────────────────────────────
function bookSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '+')
}
async function fetchChapter(bookName, chapter, translation) {
  const url = `https://bible-api.com/${bookSlug(bookName)}+${chapter}?translation=${translation}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Could not load chapter.')
  const data = await res.json()
  return data.verses || []
}

// ── Verse key for highlights ─────────────────────────────────────
function verseKey(book, chapter, verse) {
  return `${book}__${chapter}__${verse}`
}

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════
export default function BibleReaderPage() {

  const [view,            setView]           = useState('books')
  const [testament,       setTestament]      = useState('old')
  const [selectedBook,    setSelectedBook]   = useState(null)
  const [selectedChapter, setSelectedChapter]= useState(null)

  // Translations
  const [version,         setVersion]        = useState(() => loadPref(KEY_VERSION,  'kjv'))
  const [parallelVersion, setParallelVersion]= useState(() => loadPref(KEY_PARALLEL, 'web'))
  const [parallelMode,    setParallelMode]   = useState(() => loadPref(KEY_PAR_MODE, false))

  // Verses
  const [verses,          setVerses]         = useState([])
  const [versesB,         setVersesB]        = useState([])
  const [loading,         setLoading]        = useState(false)
  const [loadingB,        setLoadingB]       = useState(false)
  const [error,           setError]          = useState(null)
  const [errorB,          setErrorB]         = useState(null)

  // Highlights
  const [highlights,      setHighlights]     = useState(() => loadPref(KEY_HIGHLIGHTS, {}))

  // Dropdowns
  const [dropOpen,        setDropOpen]       = useState(false)
  const [parDropOpen,     setParDropOpen]    = useState(false)
  const [search,          setSearch]         = useState('')
  const [parSearch,       setParSearch]      = useState('')
  const dropRef    = useRef(null)
  const parDropRef = useRef(null)

  // ── Persist prefs ──────────────────────────────────────────────
  useEffect(() => savePref(KEY_VERSION,    version),         [version])
  useEffect(() => savePref(KEY_PARALLEL,   parallelVersion), [parallelVersion])
  useEffect(() => savePref(KEY_PAR_MODE,   parallelMode),    [parallelMode])
  useEffect(() => savePref(KEY_HIGHLIGHTS, highlights),      [highlights])

  // ── Close dropdowns on outside click ──────────────────────────
  useEffect(() => {
    function onClickOutside(e) {
      if (dropRef.current    && !dropRef.current.contains(e.target))    setDropOpen(false)
      if (parDropRef.current && !parDropRef.current.contains(e.target)) setParDropOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // ── Fetch primary ──────────────────────────────────────────────
  useEffect(() => {
    if (!selectedBook || !selectedChapter) return
    setLoading(true)
    setError(null)
    setVerses([])
    fetchChapter(selectedBook.name, selectedChapter, version)
      .then(v  => { setVerses(v);  setLoading(false) })
      .catch(() => { setError('Sorry, this chapter could not be loaded. Please check your connection and try again.'); setLoading(false) })
  }, [selectedBook, selectedChapter, version])

  // ── Fetch parallel ─────────────────────────────────────────────
  useEffect(() => {
    if (!parallelMode || !selectedBook || !selectedChapter) return
    setLoadingB(true)
    setErrorB(null)
    setVersesB([])
    fetchChapter(selectedBook.name, selectedChapter, parallelVersion)
      .then(v  => { setVersesB(v);  setLoadingB(false) })
      .catch(() => { setErrorB('Could not load parallel version.'); setLoadingB(false) })
  }, [parallelMode, selectedBook, selectedChapter, parallelVersion])

  // ── Highlight toggle ───────────────────────────────────────────
  function toggleHighlight(key) {
    setHighlights(prev => {
      const next = { ...prev }
      next[key] ? delete next[key] : (next[key] = true)
      return next
    })
  }

  // ── Navigation ─────────────────────────────────────────────────
  function handleBookSelect(book) {
    setSelectedBook(book)
    setSelectedChapter(null)
    setVerses([])
    setVersesB([])
    setView('chapters')
  }
  function handleChapterSelect(ch) {
    setSelectedChapter(ch)
    setView('reader')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function handlePrevChapter() {
    if (selectedChapter > 1) {
      setSelectedChapter(p => p - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  function handleNextChapter() {
    if (selectedChapter < selectedBook.chapters) {
      setSelectedChapter(p => p + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // ── Translation helpers ────────────────────────────────────────
  function infoFor(code) {
    return ALL_TRANSLATIONS.find(t => t.code === code) ?? { label: code.toUpperCase(), full: code.toUpperCase(), lang: '', desc: '' }
  }

  function filterList(list, q) {
    if (!q.trim()) return null
    const lq = q.toLowerCase()
    return list.filter(t =>
      t.label.toLowerCase().includes(lq) ||
      t.full.toLowerCase().includes(lq)  ||
      t.lang.toLowerCase().includes(lq)
    )
  }

  const books = testament === 'old' ? OLD_TESTAMENT : NEW_TESTAMENT

  // ════════════════════════════════════════════════════════════════
  // VIEW: BOOKS
  // ════════════════════════════════════════════════════════════════
  if (view === 'books') {
    return (
      <div className="br-page">
        <div className="br-nav-header">
          <h1 className="br-nav-title">Holy Bible</h1>
          <p className="br-nav-subtitle">Choose a book to begin reading</p>
          <div className="br-testament-toggle">
            <button
              className={`br-testament-btn ${testament === 'old' ? 'br-testament-btn--active' : ''}`}
              onClick={() => setTestament('old')}
            >Old Testament</button>
            <button
              className={`br-testament-btn ${testament === 'new' ? 'br-testament-btn--active' : ''}`}
              onClick={() => setTestament('new')}
            >New Testament</button>
          </div>
        </div>
        <div className="br-books-grid">
          {books.map(book => (
            <button
              key={book.name}
              className="br-book-card"
              onClick={() => handleBookSelect(book)}
            >
              <span className="br-book-card__name">{book.name}</span>
              <span className="br-book-card__chapters">{book.chapters} ch</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════
  // VIEW: CHAPTERS
  // ════════════════════════════════════════════════════════════════
  if (view === 'chapters') {
    return (
      <div className="br-page">
        <div className="br-nav-header">
          <button className="br-back-btn" onClick={() => setView('books')}>
            &larr; Back to Books
          </button>
          <h1 className="br-nav-title">{selectedBook.name}</h1>
          <p className="br-nav-subtitle">Select a chapter</p>
        </div>
        <div className="br-chapters-grid">
          {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(ch => (
            <button
              key={ch}
              className="br-chapter-btn"
              onClick={() => handleChapterSelect(ch)}
            >{ch}</button>
          ))}
        </div>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════
  // VIEW: READER
  // ════════════════════════════════════════════════════════════════
  const primaryInfo  = infoFor(version)
  const parallelInfo = infoFor(parallelVersion)
  const filteredMain = filterList(ALL_TRANSLATIONS, search)
  const filteredPar  = filterList(ALL_TRANSLATIONS, parSearch)

  return (
    <div className="br-page">

      {/* ── Reader Header ── */}
      <header className="br-reader-header">
        <button className="br-back-btn" onClick={() => setView('chapters')}>
          &larr; Chapters
        </button>
        <div className="br-reader-heading">
          <h1 className="br-reader-book">{selectedBook.name}</h1>
          <span className="br-reader-chapter">Chapter {selectedChapter}</span>
          <span className="br-reader-translation">{primaryInfo.full}</span>
        </div>
        <button className="br-back-btn" onClick={() => setView('books')}>
          All Books
        </button>
      </header>

      {/* ══════════════════════════════════════════════════════════
          VERSION TOOLBAR
      ══════════════════════════════════════════════════════════ */}
      <div style={s.toolbar}>

        {/* ── Primary Version ── */}
        <div style={s.toolGroup}>
          <span style={s.toolLabel}>📖 Version</span>
          <div ref={dropRef} style={{ position: 'relative' }}>
            <button
              style={s.dropTrigger}
              onClick={() => { setDropOpen(p => !p); setSearch('') }}
              aria-label="Select Bible translation"
            >
              <span style={s.triggerCode}>{primaryInfo.label}</span>
              <span style={s.triggerFull}>{primaryInfo.full}</span>
              <span style={s.triggerLang}>{primaryInfo.lang}</span>
              <span style={s.triggerArrow}>{dropOpen ? '▲' : '▼'}</span>
            </button>

            {dropOpen && (
              <div style={s.dropPanel}>
                {/* Search */}
                <div style={s.dropSearchWrap}>
                  <span style={s.dropSearchIcon}>🔍</span>
                  <input
                    autoFocus
                    placeholder="Search by name or language..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={s.dropSearch}
                  />
                </div>

                {/* Count badge */}
                <div style={s.dropCount}>
                  {ALL_TRANSLATIONS.length} translations available
                </div>

                <div style={s.dropScroll}>
                  {(filteredMain ?? []).length > 0 && filteredMain
                    ? filteredMain.map(t => (
                        <TranslationItem
                          key={t.code}
                          t={t}
                          active={version === t.code}
                          onSelect={() => { setVersion(t.code); setDropOpen(false); setSearch('') }}
                        />
                      ))
                    : search.trim()
                      ? <p style={s.noResults}>No translations found for "{search}"</p>
                      : Object.entries(TRANSLATIONS).map(([cat, list]) => (
                          <div key={cat}>
                            <p style={s.dropCat}>{cat}</p>
                            {list.map(t => (
                              <TranslationItem
                                key={t.code}
                                t={t}
                                active={version === t.code}
                                onSelect={() => { setVersion(t.code); setDropOpen(false) }}
                              />
                            ))}
                          </div>
                        ))
                  }
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={s.toolDivider} />

        {/* ── Parallel Mode Toggle ── */}
        <div style={s.toolGroup}>
          <span style={s.toolLabel}>⚡ Parallel Mode</span>
          <button
            style={{ ...s.parallelBtn, ...(parallelMode ? s.parallelBtnOn : {}) }}
            onClick={() => setParallelMode(p => !p)}
            aria-label="Toggle parallel mode"
          >
            <span>{parallelMode ? '✓ ON' : 'OFF'}</span>
          </button>
        </div>

        {/* ── Parallel Version (only when ON) ── */}
        {parallelMode && (
          <>
            <div style={s.toolDivider} />
            <div style={s.toolGroup}>
              <span style={s.toolLabel}>📗 Compare With</span>
              <div ref={parDropRef} style={{ position: 'relative' }}>
                <button
                  style={s.dropTrigger}
                  onClick={() => { setParDropOpen(p => !p); setParSearch('') }}
                  aria-label="Select parallel translation"
                >
                  <span style={s.triggerCode}>{parallelInfo.label}</span>
                  <span style={s.triggerFull}>{parallelInfo.full}</span>
                  <span style={s.triggerLang}>{parallelInfo.lang}</span>
                  <span style={s.triggerArrow}>{parDropOpen ? '▲' : '▼'}</span>
                </button>

                {parDropOpen && (
                  <div style={s.dropPanel}>
                    <div style={s.dropSearchWrap}>
                      <span style={s.dropSearchIcon}>🔍</span>
                      <input
                        autoFocus
                        placeholder="Search translations..."
                        value={parSearch}
                        onChange={e => setParSearch(e.target.value)}
                        style={s.dropSearch}
                      />
                    </div>
                    <div style={s.dropCount}>
                      {ALL_TRANSLATIONS.length} translations available
                    </div>
                    <div style={s.dropScroll}>
                      {(filteredPar ?? []).length > 0 && filteredPar
                        ? filteredPar.map(t => (
                            <TranslationItem
                              key={t.code}
                              t={t}
                              active={parallelVersion === t.code}
                              onSelect={() => { setParallelVersion(t.code); setParDropOpen(false); setParSearch('') }}
                            />
                          ))
                        : parSearch.trim()
                          ? <p style={s.noResults}>No translations found for "{parSearch}"</p>
                          : Object.entries(TRANSLATIONS).map(([cat, list]) => (
                              <div key={cat}>
                                <p style={s.dropCat}>{cat}</p>
                                {list.map(t => (
                                  <TranslationItem
                                    key={t.code}
                                    t={t}
                                    active={parallelVersion === t.code}
                                    onSelect={() => { setParallelVersion(t.code); setParDropOpen(false) }}
                                  />
                                ))}
                              </div>
                            ))
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── Highlight hint ── */}
        <div style={{ marginLeft: 'auto' }}>
          <span style={s.hint}>💡 Tap any verse to highlight</span>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════
          SCRIPTURE AREA
      ══════════════════════════════════════════════════════════ */}
      <main className="br-scripture-column">

        {loading && (
          <div className="br-loading">
            <div className="br-loading__spinner" />
            <p>Loading scripture...</p>
          </div>
        )}

        {error && (
          <div className="br-error">
            <p>{error}</p>
            <button className="br-retry-btn" onClick={() => setSelectedChapter(c => c)}>
              Try Again
            </button>
          </div>
        )}

        {/* ── Parallel: two columns ── */}
        {!loading && !error && parallelMode ? (
          <div style={s.parallelGrid}>

            {/* Column A — primary */}
            <div style={s.parallelCol}>
              <div style={s.parallelColHeader}>
                <span style={s.parallelColCode}>{primaryInfo.label}</span>
                <span style={s.parallelColName}>{primaryInfo.full}</span>
                <span style={s.parallelColLang}>{primaryInfo.lang}</span>
              </div>
              {verses.map(({ verse, text }) => {
                const key = verseKey(selectedBook.name, selectedChapter, verse)
                return (
                  <p
                    key={verse}
                    className="br-verse"
                    style={highlights[key] ? s.highlighted : s.verseHover}
                    onClick={() => toggleHighlight(key)}
                    title="Click to highlight"
                  >
                    <sup className="br-verse-num">{verse}</sup>
                    <span className="br-verse-text">{text.trim()}</span>
                  </p>
                )
              })}
            </div>

            {/* Divider */}
            <div style={s.parallelDivider} />

            {/* Column B — parallel */}
            <div style={s.parallelCol}>
              <div style={s.parallelColHeader}>
                <span style={s.parallelColCode}>{parallelInfo.label}</span>
                <span style={s.parallelColName}>{parallelInfo.full}</span>
                <span style={s.parallelColLang}>{parallelInfo.lang}</span>
              </div>
              {loadingB && (
                <p style={{ color: '#c8a96e', fontSize: '0.85rem', fontStyle: 'italic' }}>
                  Loading {parallelInfo.label}...
                </p>
              )}
              {errorB && (
                <p style={{ color: '#ff6b6b', fontSize: '0.82rem' }}>⚠️ {errorB}</p>
              )}
              {versesB.map(({ verse, text }) => {
                const key = verseKey(selectedBook.name, selectedChapter, verse)
                return (
                  <p
                    key={verse}
                    className="br-verse"
                    style={highlights[key] ? s.highlighted : s.verseHover}
                    onClick={() => toggleHighlight(key)}
                    title="Click to highlight"
                  >
                    <sup className="br-verse-num">{verse}</sup>
                    <span className="br-verse-text">{text.trim()}</span>
                  </p>
                )
              })}
            </div>

          </div>

        ) : (

          /* ── Single column ── */
          !loading && !error && verses.map(({ verse, text }) => {
            const key = verseKey(selectedBook.name, selectedChapter, verse)
            return (
              <p
                key={verse}
                className="br-verse"
                style={highlights[key] ? s.highlighted : s.verseHover}
                onClick={() => toggleHighlight(key)}
                title="Click to highlight"
              >
                <sup className="br-verse-num">{verse}</sup>
                <span className="br-verse-text">{text.trim()}</span>
              </p>
            )
          })

        )}
      </main>

      {/* ── Chapter Navigation ── */}
      {!loading && !error && verses.length > 0 && (
        <nav className="br-chapter-nav">
          <button
            className="br-chapter-nav__btn"
            onClick={handlePrevChapter}
            disabled={selectedChapter === 1}
          >&larr; Previous Chapter</button>
          <span className="br-chapter-nav__label">
            {selectedBook.name} {selectedChapter}
          </span>
          <button
            className="br-chapter-nav__btn"
            onClick={handleNextChapter}
            disabled={selectedChapter === selectedBook.chapters}
          >Next Chapter &rarr;</button>
        </nav>
      )}

    </div>
  )
}

// ── Translation Item Sub-component ───────────────────────────────
function TranslationItem({ t, active, onSelect }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      style={{
        ...s.dropItem,
        ...(active  ? s.dropItemActive  : {}),
        ...(hovered ? s.dropItemHovered : {}),
      }}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={s.dropItemTop}>
        <span style={s.dropItemCode}>{t.label}</span>
        <span style={s.dropItemLang}>{t.lang}</span>
        {active && <span style={s.dropItemCheck}>✓</span>}
      </div>
      <div style={s.dropItemFull}>{t.full} · {t.year}</div>
      <div style={s.dropItemDesc}>{t.desc}</div>
    </button>
  )
}

// ── Styles ────────────────────────────────────────────────────────
const s = {
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '0.75rem',
    maxWidth: '900px',
    margin: '0 auto 1.75rem',
    padding: '0.9rem 1.25rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: '14px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
  },
  toolGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    position: 'relative',
  },
  toolLabel: {
    fontSize: '0.75rem',
    color: 'rgba(240,230,210,0.5)',
    fontFamily: 'Georgia, serif',
    whiteSpace: 'nowrap',
  },
  toolDivider: {
    width: '1px',
    height: '28px',
    background: 'rgba(201,168,76,0.2)',
  },
  hint: {
    fontSize: '0.7rem',
    color: 'rgba(240,230,210,0.3)',
    fontFamily: 'Georgia, serif',
    fontStyle: 'italic',
  },

  // ── Trigger button ──
  dropTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'rgba(201,168,76,0.08)',
    border: '1px solid rgba(201,168,76,0.3)',
    borderRadius: '8px',
    padding: '0.4rem 0.8rem',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    color: '#f0e6d2',
    transition: 'all 0.2s',
  },
  triggerCode: {
    fontWeight: '700',
    fontSize: '0.9rem',
    color: '#c9a84c',
  },
  triggerFull: {
    fontSize: '0.78rem',
    color: 'rgba(240,230,210,0.65)',
  },
  triggerLang: {
    fontSize: '0.75rem',
    color: 'rgba(240,230,210,0.4)',
  },
  triggerArrow: {
    fontSize: '0.6rem',
    color: '#c9a84c',
    marginLeft: '0.2rem',
  },

  // ── Dropdown panel ──
  dropPanel: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    zIndex: 1000,
    background: '#1c1008',
    border: '1px solid rgba(201,168,76,0.3)',
    borderRadius: '12px',
    width: '320px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
    overflow: 'hidden',
  },
  dropSearchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 0.85rem',
    borderBottom: '1px solid rgba(201,168,76,0.15)',
    background: 'rgba(0,0,0,0.2)',
  },
  dropSearchIcon: {
    fontSize: '0.85rem',
  },
  dropSearch: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#f0e6d2',
    fontSize: '0.85rem',
    fontFamily: 'Georgia, serif',
    outline: 'none',
  },
  dropCount: {
    fontSize: '0.68rem',
    color: 'rgba(240,230,210,0.35)',
    padding: '0.3rem 0.85rem',
    borderBottom: '1px solid rgba(201,168,76,0.1)',
    fontFamily: 'Georgia, serif',
  },
  dropScroll: {
    maxHeight: '300px',
    overflowY: 'auto',
    padding: '0.4rem 0',
  },
  dropCat: {
    fontSize: '0.68rem',
    fontWeight: '700',
    color: '#c9a84c',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    padding: '0.6rem 0.85rem 0.2rem',
    margin: 0,
  },
  dropItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
    width: '100%',
    background: 'transparent',
    border: 'none',
    padding: '0.55rem 0.85rem',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'Georgia, serif',
    transition: 'background 0.15s',
  },
  dropItemActive: {
    background: 'rgba(201,168,76,0.15)',
  },
  dropItemHovered: {
    background: 'rgba(255,255,255,0.05)',
  },
  dropItemTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  dropItemCode: {
    fontWeight: '700',
    fontSize: '0.85rem',
    color: '#c9a84c',
  },
  dropItemLang: {
    fontSize: '0.72rem',
    color: 'rgba(240,230,210,0.45)',
  },
  dropItemCheck: {
    marginLeft: 'auto',
    color: '#c9a84c',
    fontWeight: '700',
    fontSize: '0.85rem',
  },
  dropItemFull: {
    fontSize: '0.78rem',
    color: 'rgba(240,230,210,0.7)',
  },
  dropItemDesc: {
    fontSize: '0.72rem',
    color: 'rgba(240,230,210,0.4)',
    lineHeight: '1.4',
  },
  noResults: {
    color: 'rgba(240,230,210,0.4)',
    fontSize: '0.82rem',
    textAlign: 'center',
    padding: '1rem',
    fontStyle: 'italic',
    margin: 0,
  },

  // ── Parallel toggle ──
  parallelBtn: {
    padding: '0.35rem 0.9rem',
    borderRadius: '20px',
    border: '1px solid rgba(201,168,76,0.3)',
    background: 'transparent',
    color: 'rgba(240,230,210,0.45)',
    fontWeight: '700',
    fontSize: '0.8rem',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    transition: 'all 0.2s',
  },
  parallelBtnOn: {
    background: 'linear-gradient(135deg, #c9a84c, #a07830)',
    color: '#1a0a00',
    border: '1px solid #c9a84c',
  },

  // ── Parallel grid ──
  parallelGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1px 1fr',
    gap: '0 1.5rem',
    alignItems: 'start',
  },
  parallelCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  parallelColHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.85rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid rgba(201,168,76,0.2)',
  },
  parallelColCode: {
    fontWeight: '700',
    fontSize: '0.85rem',
    color: '#c9a84c',
    fontFamily: 'Georgia, serif',
  },
  parallelColName: {
    fontSize: '0.78rem',
    color: 'rgba(240,230,210,0.65)',
    fontFamily: 'Georgia, serif',
  },
  parallelColLang: {
    fontSize: '0.72rem',
    color: 'rgba(240,230,210,0.35)',
    fontFamily: 'Georgia, serif',
    marginLeft: 'auto',
  },
  parallelDivider: {
    background: 'rgba(201,168,76,0.2)',
    width: '1px',
  },

  // ── Verse styles ──
  verseHover: {
    cursor: 'pointer',
  },
  highlighted: {
    background: 'rgba(201,168,76,0.15)',
    borderLeft: '3px solid #c9a84c',
    borderRadius: '0 6px 6px 0',
    paddingLeft: '0.6rem',
    cursor: 'pointer',
  },
}