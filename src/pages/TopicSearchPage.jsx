import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'

// ══════════════════════════════════════════════════════════════════
// API
// ══════════════════════════════════════════════════════════════════
const API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''
const API_URL = 'https://api.groq.com/openai/v1/chat/completions'

async function callGemini(prompt) {
  if (!API_KEY) throw new Error('NO_API_KEY')
  const res = await fetch(API_URL, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model:       'llama-3.3-70b-versatile',
      messages:    [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens:  1500,
    }),
  })
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    throw new Error(`API ${res.status}: ${errBody?.error?.message || res.statusText}`)
  }
  const data = await res.json()
  return data?.choices?.[0]?.message?.content || ''
}

// ══════════════════════════════════════════════════════════════════
// TOPIC DATABASE — 12 curated topics with 5 verses each
// ══════════════════════════════════════════════════════════════════
const TOPICS = [
  {
    id: 'peace', label: 'Peace', icon: '☮️',
    description: 'Finding calm and tranquility in God',
    color: '#4fc3f7',
    verses: [
      { ref: 'John 14:27',        text: 'Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.' },
      { ref: 'Philippians 4:6-7', text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.' },
      { ref: 'Isaiah 26:3',       text: 'You will keep in perfect peace those whose minds are steadfast, because they trust in you.' },
      { ref: 'Psalm 29:11',       text: 'The Lord gives strength to his people; the Lord blesses his people with peace.' },
      { ref: 'Colossians 3:15',   text: 'Let the peace of Christ rule in your hearts, since as members of one body you were called to peace.' },
    ],
  },
  {
    id: 'despair', label: 'Despair', icon: '💔',
    description: 'When everything feels dark and lost',
    color: '#f48fb1',
    verses: [
      { ref: 'Jeremiah 29:11',  text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.' },
      { ref: 'Psalm 34:18',     text: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.' },
      { ref: 'Romans 15:13',    text: 'May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.' },
      { ref: 'Psalm 42:11',     text: 'Why, my soul, are you downcast? Why so disturbed within me? Put your hope in God, for I will yet praise him, my Savior and my God.' },
      { ref: 'Revelation 21:4', text: 'He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away.' },
    ],
  },
  {
    id: 'hopelessness', label: 'Hopelessness', icon: '🌑',
    description: 'When you cannot see a way forward',
    color: '#b0bec5',
    verses: [
      { ref: 'Romans 5:3-4',       text: 'We also glory in our sufferings, because we know that suffering produces perseverance; perseverance, character; and character, hope.' },
      { ref: 'Lamentations 3:22-23', text: 'Because of the Lord\'s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.' },
      { ref: 'Psalm 31:24',        text: 'Be strong and take heart, all you who hope in the Lord.' },
      { ref: 'Isaiah 40:31',       text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.' },
      { ref: 'Hebrews 6:19',       text: 'We have this hope as an anchor for the soul, firm and secure.' },
    ],
  },
  {
    id: 'forgiveness', label: 'Forgiveness', icon: '🙏',
    description: 'Letting go of shame and moving forward',
    color: '#ce93d8',
    verses: [
      { ref: '1 John 1:9',   text: 'If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.' },
      { ref: 'Psalm 103:12', text: 'As far as the east is from the west, so far has he removed our transgressions from us.' },
      { ref: 'Romans 8:1',   text: 'Therefore, there is now no condemnation for those who are in Christ Jesus.' },
      { ref: 'Isaiah 43:25', text: 'I, even I, am he who blots out your transgressions, for my own sake, and remembers your sins no more.' },
      { ref: 'Micah 7:19',   text: 'You will again have compassion on us; you will tread our sins underfoot and hurl all our iniquities into the depths of the sea.' },
    ],
  },
  {
    id: 'faith', label: 'Faith', icon: '✨',
    description: 'Believing when you cannot see',
    color: '#f0c040',
    verses: [
      { ref: 'Hebrews 11:1',      text: 'Now faith is confidence in what we hope for and assurance about what we do not see.' },
      { ref: 'Mark 9:24',         text: 'I do believe; help me overcome my unbelief!' },
      { ref: 'Matthew 17:20',     text: 'Truly I tell you, if you have faith as small as a mustard seed, you can say to this mountain, "Move from here to there," and it will move. Nothing will be impossible for you.' },
      { ref: 'Romans 10:17',      text: 'Consequently, faith comes from hearing the message, and the message is heard through the word about Christ.' },
      { ref: '2 Corinthians 5:7', text: 'For we live by faith, not by sight.' },
    ],
  },
  {
    id: 'strength', label: 'Strength', icon: '💪',
    description: 'Finding power when you are exhausted',
    color: '#ffb74d',
    verses: [
      { ref: 'Philippians 4:13',   text: 'I can do all this through him who gives me strength.' },
      { ref: 'Isaiah 40:31',       text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.' },
      { ref: '2 Corinthians 12:9', text: 'My grace is sufficient for you, for my power is made perfect in weakness.' },
      { ref: 'Psalm 46:1',         text: 'God is our refuge and strength, an ever-present help in trouble.' },
      { ref: 'Nehemiah 8:10',      text: 'Do not grieve, for the joy of the Lord is your strength.' },
    ],
  },
  {
    id: 'love', label: 'Love', icon: '❤️',
    description: 'Understanding God\'s love and loving others',
    color: '#ef5350',
    verses: [
      { ref: '1 Corinthians 13:4-7', text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.' },
      { ref: 'John 3:16',            text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
      { ref: 'Romans 8:38-39',       text: 'For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.' },
      { ref: '1 John 4:19',          text: 'We love because he first loved us.' },
      { ref: 'Song of Solomon 8:7',  text: 'Many waters cannot quench love; rivers cannot sweep it away.' },
    ],
  },
  {
    id: 'anxiety', label: 'Anxiety', icon: '😰',
    description: 'Overcoming worry and fear',
    color: '#80deea',
    verses: [
      { ref: 'Philippians 4:6-7', text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.' },
      { ref: 'Matthew 6:34',      text: 'Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.' },
      { ref: '1 Peter 5:7',       text: 'Cast all your anxiety on him because he cares for you.' },
      { ref: 'John 14:27',        text: 'Peace I leave with you; my peace I give you. Do not let your hearts be troubled and do not be afraid.' },
      { ref: 'Isaiah 41:10',      text: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.' },
    ],
  },
  {
    id: 'grief', label: 'Grief', icon: '😢',
    description: 'Walking through loss and mourning',
    color: '#90a4ae',
    verses: [
      { ref: 'Psalm 34:18',         text: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.' },
      { ref: 'Matthew 5:4',         text: 'Blessed are those who mourn, for they will be comforted.' },
      { ref: 'John 11:35',          text: 'Jesus wept.' },
      { ref: 'Psalm 147:3',         text: 'He heals the brokenhearted and binds up their wounds.' },
      { ref: '2 Corinthians 1:3-4', text: 'Praise be to the God and Father of our Lord Jesus Christ, the Father of compassion and the God of all comfort, who comforts us in all our troubles.' },
    ],
  },
  {
    id: 'purpose', label: 'Purpose', icon: '🌟',
    description: 'Discovering who you are in God',
    color: '#aed581',
    verses: [
      { ref: 'Psalm 139:14',  text: 'I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.' },
      { ref: 'Ephesians 2:10', text: 'For we are God\'s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.' },
      { ref: 'Genesis 1:27',  text: 'So God created mankind in his own image, in the image of God he created them; male and female he created them.' },
      { ref: '1 Peter 2:9',   text: 'But you are a chosen people, a royal priesthood, a holy nation, God\'s special possession.' },
      { ref: 'Romans 8:17',   text: 'Now if we are children, then we are heirs — heirs of God and co-heirs with Christ.' },
    ],
  },
  {
    id: 'wisdom', label: 'Wisdom', icon: '🧠',
    description: 'Seeking God\'s guidance for decisions',
    color: '#b39ddb',
    verses: [
      { ref: 'James 1:5',      text: 'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.' },
      { ref: 'Proverbs 3:5-6', text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.' },
      { ref: 'Psalm 32:8',     text: 'I will instruct you and teach you in the way you should go; I will counsel you with my loving eye on you.' },
      { ref: 'Isaiah 30:21',   text: 'Whether you turn to the right or to the left, your ears will hear a voice behind you, saying, "This is the way; walk in it."' },
      { ref: 'Proverbs 9:10',  text: 'The fear of the Lord is the beginning of wisdom, and knowledge of the Holy One is understanding.' },
    ],
  },
  {
    id: 'healing', label: 'Healing', icon: '🏥',
    description: 'Finding restoration and wholeness',
    color: '#80cbc4',
    verses: [
      { ref: 'Psalm 103:3',    text: 'Who forgives all your sins and heals all your diseases.' },
      { ref: 'Isaiah 53:5',    text: 'But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.' },
      { ref: 'James 5:14-15',  text: 'Is anyone among you sick? Let them call the elders of the church to pray over them and anoint them with oil in the name of the Lord. And the prayer offered in faith will make the sick person well.' },
      { ref: 'Jeremiah 30:17', text: 'But I will restore you to health and heal your wounds, declares the Lord.' },
      { ref: '3 John 1:2',     text: 'Dear friend, I pray that you may enjoy good health and that all may go well with you, even as your soul is getting along well.' },
    ],
  },
]

// ══════════════════════════════════════════════════════════════════
// ANIMATIONS
// ══════════════════════════════════════════════════════════════════
const ANIM = `
  @keyframes tsiFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes tsiSpin   { to{transform:rotate(360deg)} }
  @keyframes tsiPulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .tsi-topic-btn { transition: transform 0.2s, box-shadow 0.2s; }
  .tsi-topic-btn:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
  .tsi-msg { animation: tsiFadeUp 0.3s ease both; }
`

// ══════════════════════════════════════════════════════════════════
// VERSE CARD
// ══════════════════════════════════════════════════════════════════
function VerseCard({ verse, color }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(`${verse.ref} — "${verse.text}"`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div style={{
      background:   'rgba(255,255,255,0.04)',
      border:       `1px solid ${color}40`,
      borderLeft:   `3px solid ${color}`,
      borderRadius: '0 12px 12px 0',
      padding:      '0.9rem 1.1rem',
      marginBottom: '0.6rem',
    }}>
      <div style={{ color, fontSize:'0.82rem', fontWeight:'700', marginBottom:'0.35rem' }}>
        📖 {verse.ref}
      </div>
      <p style={{
        color:'#f0e6d2', fontSize:'0.92rem', lineHeight:'1.7',
        margin:'0 0 0.5rem', fontStyle:'italic',
      }}>
        "{verse.text}"
      </p>
      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
        <button onClick={copy} style={{
          padding:'3px 10px', borderRadius:'10px',
          border:`1px solid ${color}40`,
          background: copied ? 'rgba(76,175,80,0.15)' : 'transparent',
          color: copied ? '#4caf50' : color,
          cursor:'pointer', fontFamily:'inherit', fontSize:'0.75rem',
        }}>
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
        <a
          href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(verse.ref)}&version=NIV`}
          target="_blank" rel="noopener noreferrer"
          style={{
            padding:'3px 10px', borderRadius:'10px',
            border:'1px solid rgba(255,255,255,0.12)',
            color:'#c8a96e', fontSize:'0.75rem',
            textDecoration:'none', display:'inline-block',
          }}
        >
          🔗 Full context
        </a>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// CHAT BUBBLE
// ══════════════════════════════════════════════════════════════════
function ChatBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className="tsi-msg" style={{
      display:        'flex',
      gap:            '10px',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom:   '0.85rem',
      alignItems:     'flex-end',
    }}>
      {!isUser && (
        <div style={{
          width:'34px', height:'34px', borderRadius:'50%', flexShrink:0,
          background:'linear-gradient(135deg,#f0c040,#c8860a)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'1rem',
        }}>🧑‍🏫</div>
      )}
      <div style={{
        maxWidth:     '78%',
        background:   isUser
          ? 'linear-gradient(135deg,rgba(123,79,207,0.35),rgba(90,47,160,0.25))'
          : 'rgba(255,255,255,0.06)',
        border:       isUser
          ? '1px solid rgba(123,79,207,0.45)'
          : '1px solid rgba(240,192,64,0.15)',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        padding:      '0.75rem 1rem',
        color:        '#f0e6d2',
        fontSize:     '0.93rem',
        lineHeight:   '1.7',
        whiteSpace:   'pre-wrap',
      }}>
        {msg.text}
      </div>
      {isUser && (
        <div style={{
          width:'34px', height:'34px', borderRadius:'50%', flexShrink:0,
          background:'rgba(123,79,207,0.3)',
          border:'1px solid rgba(123,79,207,0.4)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'1rem',
        }}>👤</div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════
export default function TopicSearchPage() {
  const { t } = useLanguage()

  // 'grid' = topic selection screen | 'chat' = study + chat screen
  const [screen,        setScreen]        = useState('grid')
  const [activeTopic,   setActiveTopic]   = useState(null)

  // Custom topic search
  const [customInput,   setCustomInput]   = useState('')
  const [customLoading, setCustomLoading] = useState(false)
  const [customError,   setCustomError]   = useState('')

  // Chat
  const [messages,      setMessages]      = useState([])
  const [chatInput,     setChatInput]     = useState('')
  const [aiLoading,     setAiLoading]     = useState(false)

  const messagesEndRef = useRef(null)
  const chatInputRef   = useRef(null)

  // Scroll chat to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Open a topic (curated or custom) ─────────────────────────
  function openTopic(topic) {
    setActiveTopic(topic)
    setScreen('chat')
    setMessages([{
      role: 'assistant',
      text: `Hello! I'm Dr. Silas, your Bible study companion. 📖\n\nI've loaded ${topic.verses.length} verses about "${topic.label}" for you to explore.\n\nYou can ask me anything, such as:\n• "How do these verses connect to each other?"\n• "How can I apply this to my life right now?"\n• "I am struggling with ${topic.label.toLowerCase()} — what does God say?"\n• "What is the historical background of these passages?"\n\nWhat would you like to explore?`,
    }])
    setChatInput('')
    setTimeout(() => chatInputRef.current?.focus(), 400)
  }

  // ── Search a custom topic via AI ─────────────────────────────
  async function handleCustomSearch(e) {
    e.preventDefault()
    const topic = customInput.trim()
    if (!topic) return

    setCustomLoading(true)
    setCustomError('')

    try {
      const prompt = `You are a Bible scholar. A user wants to find Bible verses about: "${topic}"

Return exactly 5 relevant Bible verses in this EXACT format, one per line:
VERSE: [Book Chapter:Verse] | [Complete verse text from NIV]

Only return the 5 VERSE lines. No introduction, no explanation, nothing else.`

      const raw    = await callGemini(prompt)
      const lines  = raw.match(/VERSE:\s*(.+)/g) || []
      const parsed = lines.map(line => {
        const content = line.replace(/^VERSE:\s*/i, '').trim()
        const parts   = content.split('|').map(p => p.trim())
        if (parts.length >= 2) {
          return {
            ref:  parts[0].replace(/^[""]|[""]$/g, '').trim(),
            text: parts[1].replace(/^[""]|[""]$/g, '').trim(),
          }
        }
        return null
      }).filter(Boolean)

      if (parsed.length === 0) {
        setCustomError('No verses found. Try a different topic like "patience" or "courage".')
      } else {
        openTopic({
          id:          'custom_' + Date.now(),
          label:       topic.charAt(0).toUpperCase() + topic.slice(1),
          icon:        '🔍',
          description: `Custom search: ${topic}`,
          color:       '#f0c040',
          verses:      parsed,
        })
        setCustomInput('')
      }
    } catch (err) {
      setCustomError('Search failed. Please check your internet connection and try again.')
    } finally {
      setCustomLoading(false)
    }
  }

  // ── Send a chat message to Dr. Silas ─────────────────────────
  async function handleSendMessage(e) {
    e.preventDefault()
    if (!chatInput.trim() || !activeTopic || aiLoading) return

    const userText = chatInput.trim()
    const userMsg  = { role: 'user', text: userText }
    setMessages(prev => [...prev, userMsg])
    setChatInput('')
    setAiLoading(true)

    try {
      const verseList = activeTopic.verses
        .map(v => `${v.ref}: "${v.text}"`)
        .join('\n\n')

      const recentHistory = messages
        .slice(-6)
        .map(m => `${m.role === 'user' ? 'User' : 'Dr. Silas'}: ${m.text}`)
        .join('\n\n')

      const prompt = `You are Dr. Silas — a warm, wise, and deeply compassionate Bible scholar and pastoral counsellor.

The user is studying Bible verses about the topic: "${activeTopic.label}"

The verses for this session are:
${verseList}

Recent conversation:
${recentHistory}

The user just said: "${userText}"

Your instructions:
1. Respond warmly and personally as Dr. Silas — like a trusted pastor, not a textbook
2. Reference specific verses from the list above by name when relevant
3. Help the user see how the verses connect to each other
4. Apply the teaching practically to real everyday life
5. If the user shares something personal or painful, respond with pastoral care and empathy FIRST, then bring in Scripture
6. Write in flowing, warm prose — NO bullet points
7. Keep your response to 2 to 4 paragraphs
8. End with either an encouraging thought or a gentle question to deepen their reflection

Begin your response directly — do not say "Here is my response" or similar.`

      const response = await callGemini(prompt)
      setMessages(prev => [...prev, { role: 'assistant', text: response }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'I\'m sorry, I encountered a connection error. Please check your internet and try again.',
      }])
    } finally {
      setAiLoading(false)
    }
  }

  // ── Go back to topic grid ─────────────────────────────────────
  function goBack() {
    setScreen('grid')
    setActiveTopic(null)
    setMessages([])
    setChatInput('')
  }

  // ════════════════════════════════════════════════════════════════
  // RENDER: TOPIC GRID SCREEN
  // ════════════════════════════════════════════════════════════════
  if (screen === 'grid') {
    return (
      <div style={gs.page}>
        <style>{ANIM}</style>

        {/* Header */}
        <div style={gs.header}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>📖</div>
          <h2 style={gs.title}>Topic Search</h2>
          <p style={gs.subtitle}>
            Choose a topic below — or type your own — then chat with
            <strong style={{ color: '#f0c040' }}> Dr. Silas</strong> about the verses
          </p>
        </div>

        {/* ── Custom search box ── */}
        <div style={gs.searchBox}>
          <div style={gs.searchLabel}>🔍 Search any topic</div>
          <p style={gs.searchHint}>
            Type any word or feeling — e.g. <em>patience, jealousy, loneliness, marriage, success</em>
          </p>
          <form onSubmit={handleCustomSearch} style={gs.searchForm}>
            <input
              type="text"
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              placeholder="Type a topic, emotion, or life situation…"
              style={gs.searchInput}
              disabled={customLoading}
            />
            <button
              type="submit"
              disabled={!customInput.trim() || customLoading}
              style={{
                ...gs.searchBtn,
                opacity: !customInput.trim() || customLoading ? 0.5 : 1,
                cursor:  !customInput.trim() || customLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {customLoading
                ? <span style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <span style={gs.spinner} /> Finding verses…
                  </span>
                : 'Find Verses →'}
            </button>
          </form>
          {customError && (
            <div style={{ color:'#ef5350', fontSize:'0.85rem', marginTop:'0.5rem' }}>
              ⚠️ {customError}
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={gs.divider}>
          <div style={gs.dividerLine} />
          <span style={gs.dividerText}>or choose a curated topic</span>
          <div style={gs.dividerLine} />
        </div>

        {/* ── Topic grid ── */}
        <div style={gs.grid}>
          {TOPICS.map((topic, i) => (
            <button
              key={topic.id}
              className="tsi-topic-btn"
              onClick={() => openTopic(topic)}
              style={{
                ...gs.topicCard,
                borderColor:      topic.color + '55',
                animationDelay:   `${i * 0.05}s`,
                animation:        'tsiFadeUp 0.4s ease both',
              }}
            >
              <div style={{ fontSize:'2.2rem', marginBottom:'0.5rem' }}>{topic.icon}</div>
              <div style={{ color:topic.color, fontSize:'1rem', fontWeight:'700', marginBottom:'0.25rem' }}>
                {topic.label}
              </div>
              <div style={{ color:'#9080b0', fontSize:'0.78rem', lineHeight:'1.4', marginBottom:'0.5rem' }}>
                {topic.description}
              </div>
              <div style={{
                background:   topic.color + '20',
                border:       `1px solid ${topic.color}40`,
                borderRadius: '8px',
                padding:      '2px 8px',
                color:        topic.color,
                fontSize:     '0.72rem',
                fontWeight:   '700',
                display:      'inline-block',
              }}>
                {topic.verses.length} verses
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════
  // RENDER: CHAT SCREEN
  // ════════════════════════════════════════════════════════════════
  return (
    <div style={cs.page}>
      <style>{ANIM}</style>

      {/* ── Top bar ── */}
      <div style={{
        ...cs.topBar,
        background:        `linear-gradient(135deg, ${activeTopic.color}18, rgba(10,5,20,0.98))`,
        borderBottomColor: activeTopic.color + '30',
      }}>
        <button onClick={goBack} style={cs.backBtn}>← Back</button>
        <div style={{ flex:1 }}>
          <div style={{ color:activeTopic.color, fontSize:'1.1rem', fontWeight:'800' }}>
            {activeTopic.icon} {activeTopic.label}
          </div>
          <div style={{ color:'#9080b0', fontSize:'0.78rem' }}>
            {activeTopic.verses.length} verses loaded • Chat with Dr. Silas
          </div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div style={cs.body}>

        {/* LEFT: Verses panel */}
        <div style={cs.versesPanel}>
          <div style={{
            color:         activeTopic.color,
            fontSize:      '0.78rem',
            fontWeight:    '700',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom:  '0.85rem',
          }}>
            📖 Loaded Verses ({activeTopic.verses.length})
          </div>
          {activeTopic.verses.map((v, i) => (
            <VerseCard key={i} verse={v} color={activeTopic.color} />
          ))}
          <div style={{
            marginTop:    '0.85rem',
            padding:      '0.65rem',
            background:   'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            color:        '#7a6040',
            fontSize:     '0.75rem',
            fontStyle:    'italic',
            textAlign:    'center',
          }}>
            💬 Ask Dr. Silas about any of these verses →
          </div>
        </div>

        {/* RIGHT: Chat panel */}
        <div style={cs.chatPanel}>

          {/* Dr. Silas header */}
          <div style={cs.drSilasBar}>
            <div style={cs.drSilasAvatar}>🧑‍🏫</div>
            <div>
              <div style={{ color:'#f0c040', fontWeight:'700', fontSize:'0.95rem' }}>Dr. Silas</div>
              <div style={{ color:'#7a6040', fontSize:'0.72rem' }}>Bible Scholar & Pastoral Guide</div>
            </div>
            <div style={{
              marginLeft:   'auto',
              background:   'rgba(76,175,80,0.15)',
              border:       '1px solid rgba(76,175,80,0.3)',
              borderRadius: '8px',
              padding:      '2px 8px',
              color:        '#4caf50',
              fontSize:     '0.68rem',
              fontWeight:   '700',
            }}>● Online</div>
          </div>

          {/* Messages */}
          <div style={cs.messages}>
            {messages.map((msg, i) => (
              <ChatBubble key={i} msg={msg} />
            ))}

            {/* Typing indicator */}
            {aiLoading && (
              <div className="tsi-msg" style={{
                display:'flex', gap:'10px', alignItems:'flex-end', marginBottom:'0.85rem',
              }}>
                <div style={{
                  width:'34px', height:'34px', borderRadius:'50%',
                  background:'linear-gradient(135deg,#f0c040,#c8860a)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'1rem', flexShrink:0,
                }}>🧑‍🏫</div>
                <div style={{
                  background:   'rgba(255,255,255,0.06)',
                  border:       '1px solid rgba(240,192,64,0.15)',
                  borderRadius: '16px 16px 16px 4px',
                  padding:      '0.75rem 1rem',
                  display:      'flex',
                  gap:          '6px',
                  alignItems:   'center',
                }}>
                  <span style={cs.spinner} />
                  <span style={{ color:'#c8a96e', fontSize:'0.85rem' }}>Dr. Silas is thinking…</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick question chips — shown only at the start */}
          {messages.length <= 1 && (
            <div style={cs.chips}>
              <div style={{ color:'#7a6040', fontSize:'0.72rem', marginBottom:'0.4rem' }}>
                💡 Tap a question to get started:
              </div>
              <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                {[
                  `How do these verses connect to each other?`,
                  `How can I apply this to my life today?`,
                  `I am struggling with ${activeTopic.label.toLowerCase()} right now`,
                  `What is the historical background of these passages?`,
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setChatInput(q); chatInputRef.current?.focus() }}
                    style={cs.chip}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSendMessage} style={cs.inputRow}>
            <input
              ref={chatInputRef}
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder={`Ask Dr. Silas about ${activeTopic.label.toLowerCase()}…`}
              style={cs.input}
              disabled={aiLoading}
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || aiLoading}
              style={{
                ...cs.sendBtn,
                opacity:    !chatInput.trim() || aiLoading ? 0.45 : 1,
                background: `linear-gradient(135deg, ${activeTopic.color}, ${activeTopic.color}bb)`,
              }}
            >
              📤
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════
// STYLES — GRID SCREEN
// ══════════════════════════════════════════════════════════════════
const gs = {
  page: {
    background: '#0a0514',
    minHeight:  '100vh',
    padding:    '1.5rem 1rem 3rem',
    fontFamily: 'Georgia, serif',
    color:      '#f0eaff',
  },
  header: {
    textAlign:    'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize:   '1.8rem',
    fontWeight: '800',
    color:      '#f0c040',
    margin:     '0 0 0.35rem',
  },
  subtitle: {
    color:      '#9080b0',
    fontSize:   '0.95rem',
    lineHeight: '1.6',
    margin:     0,
  },
  searchBox: {
    maxWidth:     '580px',
    margin:       '0 auto 1.25rem',
    background:   'rgba(255,255,255,0.04)',
    border:       '1px solid rgba(240,192,64,0.25)',
    borderRadius: '16px',
    padding:      '1.1rem 1.4rem',
  },
  searchLabel: {
    color:        '#f0c040',
    fontWeight:   '700',
    fontSize:     '0.9rem',
    marginBottom: '0.2rem',
  },
  searchHint: {
    color:        '#7a6040',
    fontSize:     '0.78rem',
    margin:       '0 0 0.75rem',
    lineHeight:   '1.5',
  },
  searchForm: {
    display:   'flex',
    gap:       '8px',
    flexWrap:  'wrap',
  },
  searchInput: {
    flex:         1,
    minWidth:     '180px',
    background:   'rgba(255,255,255,0.06)',
    border:       '1px solid rgba(240,192,64,0.3)',
    borderRadius: '10px',
    padding:      '0.65rem 0.9rem',
    color:        '#f0eaff',
    fontFamily:   'inherit',
    fontSize:     '0.92rem',
    outline:      'none',
  },
  searchBtn: {
    background:   'linear-gradient(135deg,#f0c040,#c8860a)',
    border:       'none',
    borderRadius: '10px',
    padding:      '0.65rem 1.1rem',
    color:        '#1a0a00',
    fontFamily:   'inherit',
    fontSize:     '0.88rem',
    fontWeight:   '700',
    transition:   'opacity 0.2s',
    whiteSpace:   'nowrap',
    display:      'flex',
    alignItems:   'center',
    gap:          '6px',
  },
  spinner: {
    width:          '12px',
    height:         '12px',
    borderRadius:   '50%',
    border:         '2px solid rgba(26,10,0,0.3)',
    borderTopColor: '#1a0a00',
    animation:      'tsiSpin 0.8s linear infinite',
    display:        'inline-block',
    flexShrink:     0,
  },
  divider: {
    display:    'flex',
    alignItems: 'center',
    gap:        '10px',
    maxWidth:   '580px',
    margin:     '0 auto 1.25rem',
  },
  dividerLine: {
    flex:       1,
    height:     '1px',
    background: 'rgba(240,192,64,0.15)',
  },
  dividerText: {
    color:     '#7a6040',
    fontSize:  '0.75rem',
    whiteSpace:'nowrap',
  },
  grid: {
    display:             'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap:                 '0.85rem',
    maxWidth:            '860px',
    margin:              '0 auto',
  },
  topicCard: {
    background:   '#12082a',
    border:       '2px solid',
    borderRadius: '14px',
    padding:      '1.1rem 0.9rem',
    textAlign:    'center',
    fontFamily:   'inherit',
    color:        'inherit',
    cursor:       'pointer',
  },
}

// ══════════════════════════════════════════════════════════════════
// STYLES — CHAT SCREEN
// ══════════════════════════════════════════════════════════════════
const cs = {
  page: {
    background:    '#0a0514',
    minHeight:     '100vh',
    display:       'flex',
    flexDirection: 'column',
    fontFamily:    'Georgia, serif',
    color:         '#f0eaff',
  },
  topBar: {
    display:      'flex',
    gap:          '12px',
    alignItems:   'center',
    padding:      '0.85rem 1.25rem',
    borderBottom: '1px solid',
    flexShrink:   0,
  },
  backBtn: {
    background:  'none',
    border:      'none',
    color:       '#f0c040',
    fontSize:    '0.9rem',
    fontWeight:  '700',
    cursor:      'pointer',
    fontFamily:  'inherit',
    whiteSpace:  'nowrap',
    padding:     '0.25rem 0.5rem',
  },
  body: {
    display:  'flex',
    flex:     1,
    overflow: 'hidden',
    minHeight: 0,
  },
  versesPanel: {
    width:      '300px',
    minWidth:   '300px',
    padding:    '1rem',
    overflowY:  'auto',
    borderRight:'1px solid rgba(240,192,64,0.1)',
    background: 'rgba(0,0,0,0.25)',
    // Hidden on small screens via inline — works fine for most cases
  },
  chatPanel: {
    flex:          1,
    display:       'flex',
    flexDirection: 'column',
    overflow:      'hidden',
    minWidth:      0,
  },
  drSilasBar: {
    display:      'flex',
    gap:          '10px',
    alignItems:   'center',
    padding:      '0.75rem 1.25rem',
    borderBottom: '1px solid rgba(240,192,64,0.1)',
    background:   'rgba(0,0,0,0.2)',
    flexShrink:   0,
  },
  drSilasAvatar: {
    width:          '38px',
    height:         '38px',
    borderRadius:   '50%',
    background:     'linear-gradient(135deg,#f0c040,#c8860a)',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    fontSize:       '1.2rem',
    flexShrink:     0,
  },
  messages: {
    flex:      1,
    overflowY: 'auto',
    padding:   '1.1rem 1.25rem',
    minHeight: 0,
  },
  chips: {
    padding:    '0.6rem 1.25rem',
    borderTop:  '1px solid rgba(240,192,64,0.08)',
    background: 'rgba(0,0,0,0.15)',
    flexShrink: 0,
  },
  chip: {
    padding:      '4px 10px',
    borderRadius: '12px',
    border:       '1px solid rgba(240,192,64,0.2)',
    background:   'rgba(240,192,64,0.06)',
    color:        '#c8a96e',
    cursor:       'pointer',
    fontFamily:   'inherit',
    fontSize:     '0.75rem',
    transition:   'all 0.15s',
    textAlign:    'left',
  },
  inputRow: {
    display:    'flex',
    gap:        '8px',
    padding:    '0.85rem 1.25rem',
    borderTop:  '1px solid rgba(240,192,64,0.1)',
    background: 'rgba(0,0,0,0.2)',
    flexShrink: 0,
  },
  input: {
    flex:         1,
    background:   'rgba(255,255,255,0.06)',
    border:       '1px solid rgba(240,192,64,0.25)',
    borderRadius: '10px',
    padding:      '0.65rem 0.9rem',
    color:        '#f0eaff',
    fontFamily:   'inherit',
    fontSize:     '0.92rem',
    outline:      'none',
  },
  sendBtn: {
    border:       'none',
    borderRadius: '10px',
    padding:      '0.65rem 1rem',
    color:        '#1a0a00',
    cursor:       'pointer',
    fontWeight:   '700',
    fontSize:     '1rem',
    transition:   'opacity 0.2s',
    flexShrink:   0,
  },
  spinner: {
    width:          '13px',
    height:         '13px',
    borderRadius:   '50%',
    border:         '2px solid rgba(240,192,64,0.2)',
    borderTopColor: '#f0c040',
    animation:      'tsiSpin 0.8s linear infinite',
    display:        'inline-block',
    flexShrink:     0,
  },
}