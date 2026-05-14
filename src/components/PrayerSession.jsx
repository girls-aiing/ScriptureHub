import React, { useState, useEffect, useRef } from 'react'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY || ''

async function callGroq(prompt) {
  if (!GROQ_KEY) throw new Error('NO_API_KEY')
  const res = await fetch(GROQ_URL, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model:       'llama-3.3-70b-versatile',
      messages:    [{ role: 'user', content: prompt }],
      temperature: 0.75,
      max_tokens:  1200,
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`API ${res.status}: ${err?.error?.message || res.statusText}`)
  }
  const data = await res.json()
  return data?.choices?.[0]?.message?.content || ''
}

const CATEGORY_LABELS = {
  strength:    '💪 Strength',
  peace:       '☮️ Peace',
  wisdom:      '🧠 Wisdom',
  forgiveness: '🕊️ Forgiveness',
  grace:       '✨ Grace',
  'gods-will': "🙏 God's Will",
}

export default function PrayerSession({ prayerData, onClose }) {
  const [messages,  setMessages]  = useState([])
  const [input,     setInput]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const endRef   = useRef(null)
  const inputRef = useRef(null)

  // ── Open with Dr. Silas greeting ──────────────────────────────
  useEffect(() => {
    startSession()
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!loading) setTimeout(() => inputRef.current?.focus(), 300)
  }, [loading])

  async function startSession() {
    setLoading(true)
    const catLabel = CATEGORY_LABELS[prayerData.category] || prayerData.category
    const prompt = `You are Dr. Silas — a warm, deeply compassionate Bible scholar and pastoral counsellor. You speak like a trusted pastor who genuinely cares about the person in front of you.

A person has come to you for prayer. Here is what they shared:

Prayer category: ${catLabel}
Their heart: "${prayerData.intention}"

Your task for this opening response:
1. Begin with a warm, personal greeting — acknowledge what they have shared with genuine empathy
2. Offer a brief spiritual word of comfort or encouragement rooted in Scripture (quote one relevant verse naturally in your prose)
3. Offer a short, heartfelt opening prayer (2–4 sentences) that speaks directly to their situation — address God directly in the prayer
4. Then gently invite them to continue the conversation — ask one caring question like "Would you like to share more?" or "Is there anything specific you'd like to bring before God today?"

Write in flowing, warm prose. No bullet points. Keep to 3–4 paragraphs maximum.
Begin directly with your greeting.`

    try {
      const reply = await callGroq(prompt)
      setMessages([{ role: 'assistant', text: reply }])
    } catch (err) {
      setMessages([{
        role: 'assistant',
        text: err.message === 'NO_API_KEY'
          ? "I'm Dr. Silas. It seems the connection isn't set up yet — please check that your VITE_GROQ_API_KEY is in your .env file and restart the server."
          : `I'm Dr. Silas. I encountered a connection issue (${err.message}). Please check your internet and try again.`,
      }])
    } finally {
      setLoading(false)
    }
  }

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', text: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const catLabel = CATEGORY_LABELS[prayerData.category] || prayerData.category
    const history  = messages
      .slice(-6)
      .map(m => `${m.role === 'user' ? 'Person' : 'Dr. Silas'}: ${m.text}`)
      .join('\n\n')

    const prompt = `You are Dr. Silas — a warm, wise, and compassionate Bible scholar and pastoral counsellor.

The person came to you for prayer about: ${catLabel}
Their original intention: "${prayerData.intention}"

Conversation so far:
${history}

The person just said: "${userMsg.text}"

Your instructions:
1. Respond warmly and personally as Dr. Silas — like a trusted pastor
2. If they share something painful, respond with empathy FIRST, then bring in Scripture
3. Offer a brief prayer or Scripture verse when appropriate
4. Help them feel heard, loved, and spiritually supported
5. End with an encouraging word or a gentle follow-up question
6. Write in flowing warm prose — NO bullet points
7. Keep to 2–3 paragraphs

Begin your response directly.`

    try {
      const reply = await callGroq(prompt)
      setMessages(prev => [...prev, { role: 'assistant', text: reply }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `I'm sorry, I encountered a connection error (${err.message}). Please try again.`,
      }])
    } finally {
      setLoading(false)
    }
  }

  const catLabel = CATEGORY_LABELS[prayerData.category] || prayerData.category

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        @keyframes fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
        .ps-msg { animation: fadeUp 0.3s ease both; }
      `}</style>

      {/* ── Top bar ── */}
      <div style={s.topBar}>
        <div style={s.topLeft}>
          <div style={s.avatar}>🧑‍🏫</div>
          <div>
            <div style={s.drName}>Dr. Silas</div>
            <div style={s.drRole}>Pastoral Prayer Guide</div>
          </div>
        </div>
        <div style={s.catTag}>{catLabel}</div>
        <button style={s.closeBtn} onClick={onClose}>✕ End Session</button>
      </div>

      {/* ── Intention banner ── */}
      <div style={s.intentionBanner}>
        <span style={s.intentionLabel}>🙏 Your prayer intention: </span>
        <span style={s.intentionText}>"{prayerData.intention}"</span>
      </div>

      {/* ── Messages ── */}
      <div style={s.messages}>
        {messages.map((msg, i) => (
          <div key={i} className="ps-msg" style={s.bubble(msg.role === 'user')}>
            {msg.role === 'assistant' && <div style={s.avatar}>🧑‍🏫</div>}
            <div style={s.bubbleText(msg.role === 'user')}>{msg.text}</div>
            {msg.role === 'user'      && <div style={s.userAvatar}>🙏</div>}
          </div>
        ))}

        {loading && (
          <div className="ps-msg" style={{ display:'flex', gap:'10px', alignItems:'flex-end' }}>
            <div style={s.avatar}>🧑‍🏫</div>
            <div style={s.typingBubble}>
              <div style={s.spinner} />
              <span style={{ color:'#c8a96e', fontSize:'0.85rem' }}>Dr. Silas is praying…</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* ── Quick prompts ── */}
      {messages.length <= 1 && !loading && (
        <div style={s.quickRow}>
          <div style={s.quickLabel}>💡 You might say:</div>
          <div style={s.quickChips}>
            {[
              'Please pray with me',
              'I need more comfort',
              'Share a Scripture for this',
              'I want to pray for someone else',
            ].map((q, i) => (
              <button key={i} style={s.chip}
                onClick={() => { setInput(q); inputRef.current?.focus() }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input ── */}
      <form onSubmit={sendMessage} style={s.inputRow}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Share your heart or ask Dr. Silas anything…"
          style={s.input}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          style={{ ...s.sendBtn, opacity: !input.trim() || loading ? 0.45 : 1 }}
        >
          🙏
        </button>
      </form>
    </div>
  )
}

const s = {
  page: {
    background:  '#0d0800',
    minHeight:   '100vh',
    display:     'flex',
    flexDirection:'column',
    fontFamily:  "'Crimson Text', serif",
    color:       '#f0e6d2',
    maxWidth:    '780px',
    margin:      '0 auto',
  },
  topBar: {
    display:        'flex',
    alignItems:     'center',
    gap:            '12px',
    padding:        '1rem 1.25rem',
    borderBottom:   '1px solid rgba(240,192,64,0.2)',
    background:     'linear-gradient(135deg, rgba(240,192,64,0.08), rgba(13,8,0,0.98))',
    flexShrink:     0,
    flexWrap:       'wrap',
  },
  topLeft: {
    display:    'flex',
    alignItems: 'center',
    gap:        '10px',
  },
  avatar: {
    width:          '40px',
    height:         '40px',
    borderRadius:   '50%',
    background:     'linear-gradient(135deg,#f0c040,#c8860a)',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    fontSize:       '1.2rem',
    flexShrink:     0,
  },
  drName: { color:'#f0c040', fontWeight:'700', fontSize:'0.95rem' },
  drRole: { color:'#7a6040', fontSize:'0.72rem' },
  catTag: {
    marginLeft:   'auto',
    background:   'rgba(240,192,64,0.12)',
    border:       '1px solid rgba(240,192,64,0.3)',
    borderRadius: '10px',
    padding:      '3px 10px',
    color:        '#f0c040',
    fontSize:     '0.75rem',
    fontWeight:   '700',
  },
  closeBtn: {
    background:   'transparent',
    border:       '1px solid rgba(240,192,64,0.3)',
    borderRadius: '20px',
    padding:      '6px 14px',
    color:        '#c8a96e',
    cursor:       'pointer',
    fontFamily:   'inherit',
    fontSize:     '0.85rem',
    flexShrink:   0,
  },
  intentionBanner: {
    padding:    '0.75rem 1.25rem',
    background: 'rgba(240,192,64,0.06)',
    borderBottom:'1px solid rgba(240,192,64,0.1)',
    fontSize:   '0.88rem',
    flexShrink: 0,
  },
  intentionLabel: { color:'#f0c040', fontWeight:'700' },
  intentionText:  { color:'#c8a96e', fontStyle:'italic' },
  messages: {
    flex:          1,
    overflowY:     'auto',
    padding:       '1.25rem',
    display:       'flex',
    flexDirection: 'column',
    gap:           '1rem',
  },
  bubble: (isUser) => ({
    display:        'flex',
    gap:            '10px',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    alignItems:     'flex-end',
  }),
  bubbleText: (isUser) => ({
    maxWidth:     '78%',
    background:   isUser
      ? 'linear-gradient(135deg,rgba(240,192,64,0.2),rgba(200,134,10,0.1))'
      : 'rgba(255,255,255,0.05)',
    border:       isUser
      ? '1px solid rgba(240,192,64,0.35)'
      : '1px solid rgba(240,192,64,0.1)',
    borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
    padding:      '0.85rem 1.1rem',
    color:        '#f0e6d2',
    fontSize:     '1rem',
    lineHeight:   '1.8',
    whiteSpace:   'pre-wrap',
  }),
  userAvatar: {
    width:'32px', height:'32px', borderRadius:'50%', flexShrink:0,
    background:'rgba(240,192,64,0.15)', border:'1px solid rgba(240,192,64,0.3)',
    display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem',
  },
  typingBubble: {
    background:   'rgba(255,255,255,0.05)',
    border:       '1px solid rgba(240,192,64,0.1)',
    borderRadius: '16px 16px 16px 4px',
    padding:      '0.75rem 1rem',
    display:      'flex', gap:'8px', alignItems:'center',
  },
  spinner: {
    width:'13px', height:'13px', borderRadius:'50%',
    border:'2px solid rgba(240,192,64,0.2)', borderTopColor:'#f0c040',
    animation:'spin 0.8s linear infinite', flexShrink:0,
  },
  quickRow: {
    padding:    '0.6rem 1.25rem',
    borderTop:  '1px solid rgba(240,192,64,0.08)',
    background: 'rgba(0,0,0,0.15)',
    flexShrink: 0,
  },
  quickLabel: { color:'#7a6040', fontSize:'0.72rem', marginBottom:'0.4rem' },
  quickChips: { display:'flex', gap:'6px', flexWrap:'wrap' },
  chip: {
    padding:      '4px 10px',
    borderRadius: '12px',
    border:       '1px solid rgba(240,192,64,0.2)',
    background:   'rgba(240,192,64,0.06)',
    color:        '#c8a96e',
    cursor:       'pointer',
    fontFamily:   'inherit',
    fontSize:     '0.75rem',
  },
  inputRow: {
    display:    'flex',
    gap:        '8px',
    padding:    '0.85rem 1.25rem',
    borderTop:  '1px solid rgba(240,192,64,0.15)',
    background: 'rgba(0,0,0,0.25)',
    flexShrink: 0,
  },
  input: {
    flex:         1,
    background:   'rgba(255,255,255,0.05)',
    border:       '1px solid rgba(240,192,64,0.25)',
    borderRadius: '12px',
    padding:      '0.7rem 1rem',
    color:        '#f0e6d2',
    fontFamily:   "'Crimson Text', serif",
    fontSize:     '1rem',
    outline:      'none',
  },
  sendBtn: {
    background:   'linear-gradient(135deg,#f0c040,#c8860a)',
    border:       'none',
    borderRadius: '12px',
    padding:      '0.7rem 1.1rem',
    color:        '#1a0a00',
    cursor:       'pointer',
    fontSize:     '1.1rem',
    flexShrink:   0,
    transition:   'opacity 0.2s',
  },
}