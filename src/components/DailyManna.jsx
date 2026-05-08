import React, { useState } from 'react'

const MANNA = [
  { verse: 'John 3:16',            text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
  { verse: 'Psalm 23:1',           text: 'The Lord is my shepherd; I shall not want.' },
  { verse: 'Proverbs 3:5-6',       text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.' },
  { verse: 'Isaiah 40:31',         text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.' },
  { verse: 'Philippians 4:13',     text: 'I can do all this through him who gives me strength.' },
  { verse: 'Romans 8:28',          text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.' },
  { verse: 'Joshua 1:9',           text: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.' },
  { verse: 'Jeremiah 29:11',       text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.' },
  { verse: 'Matthew 11:28',        text: 'Come to me, all you who are weary and burdened, and I will give you rest.' },
  { verse: 'Psalm 46:1',           text: 'God is our refuge and strength, an ever-present help in trouble.' },
  { verse: 'Lamentations 3:22-23', text: "Because of the Lord's great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness." },
  { verse: 'Romans 8:38-39',       text: 'For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God.' },
  { verse: 'Psalm 119:105',        text: 'Your word is a lamp for my feet, a light on my path.' },
  { verse: 'Matthew 5:6',          text: 'Blessed are those who hunger and thirst for righteousness, for they will be filled.' },
  { verse: 'Hebrews 11:1',         text: 'Now faith is confidence in what we hope for and assurance about what we do not see.' },
  { verse: 'Galatians 5:22-23',    text: 'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.' },
  { verse: '2 Timothy 3:16',       text: 'All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness.' },
  { verse: 'Psalm 27:1',           text: 'The Lord is my light and my salvation — whom shall I fear? The Lord is the stronghold of my life — of whom shall I be afraid?' },
  { verse: 'John 14:6',            text: 'Jesus answered, "I am the way and the truth and the life. No one comes to the Father except through me."' },
  { verse: 'Ephesians 2:8-9',      text: 'For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God — not by works, so that no one can boast.' },
  { verse: 'Isaiah 41:10',         text: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.' },
  { verse: 'Psalm 34:8',           text: 'Taste and see that the Lord is good; blessed is the one who takes refuge in him.' },
  { verse: '1 Corinthians 13:4-5', text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking.' },
  { verse: 'Micah 6:8',            text: 'He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God.' },
  { verse: 'John 1:1',             text: 'In the beginning was the Word, and the Word was with God, and the Word was God.' },
  { verse: 'Revelation 21:4',      text: 'He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away.' },
  { verse: 'Psalm 1:1-2',          text: 'Blessed is the one who does not walk in step with the wicked or stand in the way that sinners take or sit in the company of mockers, but whose delight is in the law of the Lord.' },
  { verse: 'Matthew 6:33',         text: 'But seek first his kingdom and his righteousness, and all these things will be given to you as well.' },
  { verse: 'Romans 12:2',          text: 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind.' },
  { verse: 'Deuteronomy 31:6',     text: 'Be strong and courageous. Do not be afraid or terrified because of them, for the Lord your God goes with you; he will never leave you nor forsake you.' },
  { verse: 'Colossians 3:23',      text: 'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.' },
]

const MYSTERIES = [
  { title: 'The Bible has 66 books',           detail: 'Written by 40+ authors over 1,500 years — yet tells one unified story of redemption.' },
  { title: 'Jesus wept — the shortest verse',  detail: 'John 11:35 is the shortest verse in the Bible, yet carries the deepest emotion: God weeping with us.' },
  { title: 'Methuselah lived 969 years',        detail: 'He is the oldest person recorded in Scripture (Genesis 5:27) and died the same year as the Great Flood.' },
  { title: 'The number 7 appears 735 times',   detail: "Seven is God's number of completion — from Creation to Revelation, it signals divine perfection." },
  { title: 'Esther never mentions God',         detail: 'The book of Esther is one of only two Bible books (with Song of Solomon) that never directly names God — yet His hand is on every page.' },
  { title: 'The Bible was written in 3 languages', detail: 'Hebrew (Old Testament), Aramaic (parts of Daniel & Ezra), and Greek (New Testament).' },
  { title: 'Psalm 117 is the shortest chapter', detail: 'Only 2 verses long — yet it calls ALL nations to praise the Lord.' },
  { title: 'Psalm 119 is the longest chapter',  detail: '176 verses — every single one references the Word of God. It is an acrostic poem in Hebrew.' },
  { title: 'The Dead Sea Scrolls confirmed accuracy', detail: 'Found in 1947, these scrolls are 1,000 years older than previous manuscripts — and match our Bible almost perfectly.' },
  { title: 'Jonah was inside the fish 3 days',  detail: 'Jesus used this as a sign of His own death and resurrection (Matthew 12:40).' },
  { title: 'There are 8,674 verses in the NT',  detail: 'The New Testament contains 260 chapters and 138,020 words in the original Greek.' },
  { title: 'The word "Christian" appears only 3 times', detail: 'Acts 11:26, Acts 26:28, and 1 Peter 4:16 — yet the faith it describes fills every page.' },
]

function getDayIndex(arrayLength) {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  )
  return dayOfYear % arrayLength
}

export default function DailyManna({ darkMode }) {
  const manna   = MANNA[getDayIndex(MANNA.length)]
  const mystery = MYSTERIES[(getDayIndex(MYSTERIES.length) + 7) % MYSTERIES.length]
  const [tab,    setTab]    = useState('verse')
  const [copied, setCopied] = useState(false)

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  function copyVerse() {
    navigator.clipboard.writeText(`"${manna.text}" — ${manna.verse}`)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
      .catch(() => {})
  }

  // ── Color tokens ─────────────────────────────────────────────
  const C = darkMode ? {
    wrapBg:        '#1e1008',
    wrapBorder:    '1px solid rgba(201,168,76,0.3)',
    wrapBorderLeft:'4px solid #c9a84c',
    titleColor:    '#f0c040',
    dateColor:     '#c8b89a',
    tabBg:         'transparent',
    tabColor:      '#c8b89a',
    tabActiveBg:   'rgba(201,168,76,0.2)',
    tabActiveColor:'#f0c040',
    tabBorder:     '1px solid rgba(201,168,76,0.3)',
    verseText:     '#f5ead8',
    verseRef:      '#f0c040',
    copyBtnColor:  '#f0c040',
    copyBtnBorder: '1px solid rgba(201,168,76,0.5)',
    noteColor:     '#c8b89a',
    mysteryTitle:  '#f0c040',
    mysteryDetail: '#f5ead8',
  } : {
    wrapBg:        '#fffdf5',
    wrapBorder:    '1px solid #e0d0a0',
    wrapBorderLeft:'4px solid #c9a84c',
    titleColor:    '#8a6000',
    dateColor:     '#666666',
    tabBg:         'transparent',
    tabColor:      '#555555',
    tabActiveBg:   '#fff3cd',
    tabActiveColor:'#7a5000',
    tabBorder:     '1px solid #e0c060',
    verseText:     '#1a1a2e',
    verseRef:      '#8a6000',
    copyBtnColor:  '#7a5000',
    copyBtnBorder: '1px solid #c9a84c',
    noteColor:     '#666666',
    mysteryTitle:  '#7a5000',
    mysteryDetail: '#1a1a2e',
  }

  return (
    <section style={{
      background:   C.wrapBg,
      border:       C.wrapBorder,
      borderLeft:   C.wrapBorderLeft,
      borderRadius: '0 14px 14px 0',
      padding:      '1.5rem 1.75rem',
      fontFamily:   'Georgia, serif',
    }}>

      {/* ── Header ── */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        flexWrap:       'wrap',
        gap:            '0.75rem',
        marginBottom:   '1.25rem',
      }}>
        {/* Left: icon + title + date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '2rem' }}>🌅</span>
          <div>
            <p style={{
              color:      C.titleColor,
              fontWeight: '800',
              fontSize:   '1.1rem',
              margin:     0,
              letterSpacing: '0.03em',
            }}>Daily Manna</p>
            <p style={{
              color:    C.dateColor,
              fontSize: '0.82rem',
              margin:   0,
              fontWeight: '500',
            }}>{today}</p>
          </div>
        </div>

        {/* Right: tabs */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[
            { key: 'verse',   label: '📖 Verse'   },
            { key: 'mystery', label: '🔍 Mystery' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                background:   tab === key ? C.tabActiveBg   : C.tabBg,
                color:        tab === key ? C.tabActiveColor : C.tabColor,
                border:       C.tabBorder,
                borderRadius: '20px',
                padding:      '0.35rem 1rem',
                fontSize:     '0.82rem',
                fontWeight:   '700',
                cursor:       'pointer',
                fontFamily:   'Georgia, serif',
                transition:   'all 0.2s',
              }}
            >{label}</button>
          ))}
        </div>
      </div>

      {/* ── Verse Tab ── */}
      {tab === 'verse' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

          {/* The verse text */}
          <p style={{
            fontSize:   '1.15rem',
            fontStyle:  'italic',
            color:      C.verseText,
            lineHeight: '1.85',
            margin:     0,
            fontWeight: '500',
          }}>
            "{manna.text}"
          </p>

          {/* Reference + copy button */}
          <div style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            flexWrap:       'wrap',
            gap:            '0.5rem',
          }}>
            <span style={{
              color:      C.verseRef,
              fontWeight: '800',
              fontSize:   '1rem',
            }}>— {manna.verse}</span>

            <button
              onClick={copyVerse}
              style={{
                background:   'transparent',
                border:       C.copyBtnBorder,
                borderRadius: '6px',
                padding:      '0.3rem 0.85rem',
                color:        C.copyBtnColor,
                fontSize:     '0.82rem',
                fontWeight:   '700',
                cursor:       'pointer',
                fontFamily:   'Georgia, serif',
              }}
            >{copied ? '✓ Copied!' : '📋 Copy'}</button>
          </div>

          {/* Note */}
          <p style={{
            fontSize:   '0.8rem',
            color:      C.noteColor,
            fontStyle:  'italic',
            margin:     0,
            fontWeight: '500',
          }}>✨ New verse every day — come back tomorrow!</p>

        </div>
      )}

      {/* ── Mystery Tab ── */}
      {tab === 'mystery' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

          <p style={{
            fontSize:   '1.05rem',
            fontWeight: '800',
            color:      C.mysteryTitle,
            margin:     0,
            lineHeight: '1.5',
          }}>🕵️ {mystery.title}</p>

          <p style={{
            fontSize:   '1rem',
            color:      C.mysteryDetail,
            lineHeight: '1.8',
            margin:     0,
            fontWeight: '500',
          }}>{mystery.detail}</p>

          <p style={{
            fontSize:  '0.8rem',
            color:     C.noteColor,
            fontStyle: 'italic',
            margin:    0,
            fontWeight:'500',
          }}>🔄 New mystery revealed every 24 hours</p>

        </div>
      )}

    </section>
  )
}