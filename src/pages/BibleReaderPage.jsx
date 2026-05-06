import React, { useState } from 'react'

/* ═══════════════════════════════════════════════════════════════
   BibleReaderPage — Scripture reading with the Insight Overlay
   Interactive feature: "Reveal Secrets" toggle + side-drawer
   annotations powered by curated Did-You-Know data (no API).
═══════════════════════════════════════════════════════════════ */

// ── Curated insight data ─────────────────────────────────────────
// Each entry targets a specific word/phrase in the passage below.
// In a larger app you would load this from a JSON file.
const INSIGHTS = {
  'In the beginning': {
    hebrew: 'בְּרֵאשִׁית — Bereshit',
    meaning:
      'The very first word of the Hebrew Bible. It literally means "in a head" or "in a first thing" — pointing to God as the origin-point of all reality.',
    didYouKnow:
      'Jewish tradition says the Torah begins with the letter Bet (ב) — a letter that is open on three sides but closed on the left, symbolising that creation looks forward, not backward.',
    type: 'hebrew',
  },
  God: {
    hebrew: 'אֱלֹהִים — Elohim',
    meaning:
      'A plural noun used with a singular verb — one of the earliest grammatical hints that the God of Israel is both one and complex in nature.',
    didYouKnow:
      'Elohim appears 2,600 times in the Old Testament. Its plural form has fascinated theologians and linguists for centuries.',
    type: 'hebrew',
  },
  'the heavens and the earth': {
    hebrew: 'הַשָּׁמַיִם וְאֵת הָאָרֶץ',
    meaning:
      'Hebrew uses this pairing (heavens + earth) as a "merism" — a figure of speech meaning the totality of everything. It is the ancient equivalent of saying "the entire universe."',
    didYouKnow:
      'Scholars call this a cosmic merism. The same device appears in everyday language — when we say "I searched high and low" we mean everywhere.',
    type: 'hebrew',
  },
  'formless and empty': {
    hebrew: 'תֹהוּ וָבֹהוּ — Tohu wa-Bohu',
    meaning:
      'A rare poetic phrase describing primordial chaos. The two words rhyme in Hebrew, giving the text a haunting, lyrical quality that is almost impossible to replicate in translation.',
    didYouKnow:
      'Tohu wa-Bohu appears only three times in the entire Bible. Its echo-like sound was almost certainly intentional — an auditory picture of emptiness.',
    type: 'hebrew',
  },
  'Spirit of God': {
    hebrew: 'רוּחַ אֱלֹהִים — Ruach Elohim',
    meaning:
      'Ruach means breath, wind, or spirit — all three simultaneously. The image is of a divine wind hovering like a bird over still water, ready to bring life into being.',
    didYouKnow:
      'The same word Ruach is used when God breathes life into Adam (Genesis 2:7) and when the Spirit descends at Pentecost. One Hebrew root, three covenant moments.',
    type: 'hebrew',
  },
  'Let there be light': {
    greek: 'γενηθήτω φῶς — genēthētō phōs',
    meaning:
      'In the Septuagint (the Greek Old Testament), this phrase uses the same word for light — phōs — that John's Gospel uses: "God is light" (1 John 1:5). The New Testament writers heard the echo deliberately.',
    didYouKnow:
      'Light is created on Day 1, but the sun and stars are not created until Day 4. Ancient readers understood this as God himself being the first source of light — a theme Revelation 22:5 closes the Bible with.',
    type: 'greek',
  },
  'it was good': {
    hebrew: 'טוֹב — Tov',
    meaning:
      'The Hebrew word tov means good, beautiful, and useful all at once. God is not just checking a quality box — he is declaring creation to be aesthetically beautiful and purposefully ordered.',
    didYouKnow:
      'Tov appears seven times across Genesis 1. Seven is the number of completeness in Hebrew thought — a subtle signature of divine perfection woven into the creation poem.',
    type: 'hebrew',
  },
  'image of God': {
    hebrew: 'צֶלֶם אֱלֹהִים — Tselem Elohim',
    meaning:
      'In the ancient Near East, kings placed stone images (tselem) of themselves in distant provinces to represent their authority. Genesis declares every human being to be God's living image — a radical democratisation of royal dignity.',
    didYouKnow:
      'This concept — the Imago Dei — became the philosophical foundation for human rights, dignity, and equality in Western civilisation. It is arguably the most influential sentence in human history.',
    type: 'hebrew',
  },
}

// ── The Bible passage (Genesis 1:1-5 + 1:26 excerpt) ─────────────
// Highlighted tokens must exactly match keys in the INSIGHTS object.
const PASSAGE = [
  {
    verse: 1,
    tokens: [
      { text: 'In the beginning', highlight: true },
      { text: ', ', highlight: false },
      { text: 'God', highlight: true },
      { text: ' created ', highlight: false },
      { text: 'the heavens and the earth', highlight: true },
      { text: '.', highlight: false },
    ],
  },
  {
    verse: 2,
    tokens: [
      { text: 'Now the earth was ', highlight: false },
      { text: 'formless and empty', highlight: true },
      { text: ', darkness was over the surface of the deep, and the ', highlight: false },
      { text: 'Spirit of God', highlight: true },
      { text: ' was hovering over the waters.', highlight: false },
    ],
  },
  {
    verse: 3,
    tokens: [
      { text: 'And ', highlight: false },
      { text: 'God', highlight: true },
      { text: ' said, "', highlight: false },
      { text: 'Let there be light', highlight: true },
      { text: '," and there was light.', highlight: false },
    ],
  },
  {
    verse: 4,
    tokens: [
      { text: 'God', highlight: true },
      { text: ' saw that the light was good. He separated the light from the darkness.', highlight: false },
    ],
  },
  {
    verse: 5,
    tokens: [
      { text: 'God', highlight: true },
      { text: ' called the light "day," and the darkness he called "night." And there was evening, and there was morning — the first day. And ', highlight: false },
      { text: 'it was good', highlight: true },
      { text: '.', highlight: false },
    ],
  },
  {
    verse: 26,
    tokens: [
      { text: 'Then ', highlight: false },
      { text: 'God', highlight: true },
      { text: ' said, "Let us make mankind in our ', highlight: false },
      { text: 'image of God', highlight: true },
      { text: ', in our likeness…"', highlight: false },
    ],
  },
]

// ── Badge colours per insight type ───────────────────────────────
const TYPE_BADGE = {
  hebrew: { label: 'Hebrew Root', className: 'insight-badge insight-badge--hebrew' },
  greek:  { label: 'Greek Root',  className: 'insight-badge insight-badge--greek'  },
}

export default function BibleReaderPage() {
  // Controls whether the Insight Overlay is active
  const [overlayOn, setOverlayOn] = useState(false)

  // The insight object currently displayed in the side drawer (null = closed)
  const [activeInsight, setActiveInsight] = useState(null)

  // The word/phrase that was clicked (used as the drawer heading)
  const [activeTerm, setActiveTerm]       = useState('')

  // ── Handlers ───────────────────────────────────────────────────
  function handleToggle() {
    setOverlayOn(prev => !prev)
    // Close any open drawer when toggling off
    if (overlayOn) closeDrawer()
  }

  function handleWordClick(term) {
    if (!overlayOn) return          // Guard — overlay must be on
    const insight = INSIGHTS[term]
    if (!insight) return
    setActiveTerm(term)
    setActiveInsight(insight)
  }

  function closeDrawer() {
    setActiveInsight(null)
    setActiveTerm('')
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="br-page">

      {/* ── Persistent sub-header ─────────────────────────────── */}
      <header className="br-subheader">
        <div className="br-subheader__passage-label">
          <span className="br-book">Genesis</span>
          <span className="br-ref">1 : 1 – 26</span>
          <span className="br-translation">NIV</span>
        </div>

        {/* ── Reveal Secrets toggle ──────────────────────────── */}
        <div className="br-toggle-group" role="group" aria-label="Insight Overlay controls">
          <span className={`br-toggle-label ${overlayOn ? 'br-toggle-label--on' : ''}`}>
            {overlayOn ? '✦ Insights On' : 'Reveal Secrets'}
          </span>
          <button
            role="switch"
            aria-checked={overlayOn}
            className={`br-toggle ${overlayOn ? 'br-toggle--on' : ''}`}
            onClick={handleToggle}
            title={overlayOn ? 'Turn off Insight Overlay' : 'Turn on Insight Overlay'}
          >
            <span className="br-toggle__thumb" />
          </button>
        </div>
      </header>

      {/* ── Main content area — narrows when drawer is open ───── */}
      <div className={`br-content-area ${activeInsight ? 'br-content-area--narrowed' : ''}`}>

        {/* ── Scripture column ─────────────────────────────────── */}
        <main className="br-scripture-column">

          {overlayOn && (
            <p className="br-hint">
              ✦ Gold-underlined words carry hidden depths. Tap one to reveal its secret.
            </p>
          )}

          {PASSAGE.map(({ verse, tokens }) => (
            <p key={verse} className="br-verse">
              <sup className="br-verse-num">{verse}</sup>
              {tokens.map(({ text, highlight }, i) => {
                // Only render as interactive span when overlay is on AND highlighted
                const isClickable = overlayOn && highlight && INSIGHTS[text]
                return isClickable ? (
                  <span
                    key={i}
                    className={`br-word--insight ${
                      activeTerm === text ? 'br-word--active' : ''
                    }`}
                    onClick={() => handleWordClick(text)}
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && handleWordClick(text)}
                    role="button"
                    aria-label={`Reveal insight for: ${text}`}
                  >
                    {text}
                  </span>
                ) : (
                  <span key={i}>{text}</span>
                )
              })}
            </p>
          ))}
        </main>

        {/* ── Side Drawer ──────────────────────────────────────── */}
        {activeInsight && (
          <aside className="br-drawer" role="complementary" aria-label="Scripture insight panel">

            {/* Close button */}
            <button className="br-drawer__close" onClick={closeDrawer} aria-label="Close insight panel">
              ✕
            </button>

            {/* Header */}
            <div className="br-drawer__header">
              <span className={TYPE_BADGE[activeInsight.type].className}>
                {TYPE_BADGE[activeInsight.type].label}
              </span>
              <h2 className="br-drawer__term">"{activeTerm}"</h2>
              <p className="br-drawer__original">
                {activeInsight.hebrew || activeInsight.greek}
              </p>
            </div>

            {/* Meaning section */}
            <section className="br-drawer__section">
              <h3 className="br-drawer__section-title">📖 What it means</h3>
              <p className="br-drawer__body">{activeInsight.meaning}</p>
            </section>

            {/* Did You Know section */}
            <section className="br-drawer__section br-drawer__section--highlight">
              <h3 className="br-drawer__section-title">✦ Did You Know?</h3>
              <p className="br-drawer__body">{activeInsight.didYouKnow}</p>
            </section>

            {/* Nudge toward AI Consultant */}
            <div className="br-drawer__cta">
              <p>Want to go deeper?</p>
              <a href="/ai-consultant" className="br-drawer__cta-link">
                Ask the AI Consultant →
              </a>
            </div>

          </aside>
        )}
      </div>
    </div>
  )
}
