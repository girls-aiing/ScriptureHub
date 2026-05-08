import React, { useState, useRef, useEffect } from 'react'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY

const SYSTEM_PROMPT = `You are Dr. Clergy, a warm, deeply knowledgeable Bible scholar with 40 years of experience in theology, biblical history, Hebrew, Greek, and Christian spirituality. You have an encyclopedic knowledge of the entire Bible — Old and New Testament — including all books, chapters, verses, parables, prophecies, genealogies, and theological themes.

Your personality:
- Warm, wise, and conversational — like a trusted pastor and professor combined
- You never make up verses or misquote scripture
- You always cite exact book, chapter and verse (e.g. John 3:16)
- You explain things clearly for both beginners and scholars
- You connect Old Testament prophecy to New Testament fulfillment
- You understand different theological traditions (Catholic, Protestant, Orthodox, etc.)

Your response format:
1. Give a thorough, accurate, and engaging answer to the question
2. Always end with ONE thoughtful follow-up question to keep the conversation going
3. Keep responses focused and conversational — not too long
4. Use occasional paragraph breaks for readability`

export default function FloatingChat() {
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Shalom! 🕊️ I'm Dr. Clergy. Ask me anything about Scripture!`
    }
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const messagesEndRef        = useRef(null)

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    if (!GROQ_API_KEY) { setError('API key missing.'); return }

    const userMessage     = { role: 'user', content: input.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)
    setError('')

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...updatedMessages
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`${response.status}: ${errorData?.error?.message || 'Unknown error'}`)
      }

      const data = await response.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.choices[0].message.content
      }])
    } catch (err) {
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `Shalom! 🕊️ Fresh start — what would you like to explore in Scripture today?`
    }])
    setError('')
  }

  return (
    <div style={styles.wrapper}>

      {/* ── Chat Panel ── */}
      {open && (
        <div style={styles.panel}>

          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <span style={styles.headerIcon}>✝</span>
              <div>
                <p style={styles.headerTitle}>Dr. Clergy</p>
                <p style={styles.headerSub}>AI Bible Consultant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={styles.closeBtn}>✕</button>
          </div>

          {/* Messages */}
          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '0.6rem'
              }}>
                {msg.role === 'assistant' && (
                  <div style={styles.avatar}>✝</div>
                )}
                <div style={{
                  ...styles.bubble,
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #c8860a, #f0c040)'
                    : 'rgba(255,255,255,0.08)',
                  color: msg.role === 'user' ? '#1a0a00' : '#f0e6d0',
                  borderRadius: msg.role === 'user'
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  fontWeight: msg.role === 'user' ? '600' : '400',
                  border: msg.role === 'assistant'
                    ? '1px solid rgba(240,192,64,0.15)'
                    : 'none',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={styles.avatar}>✝</div>
                <div style={{ ...styles.bubble, color: '#c8a96e', fontSize: '0.82rem' }}>
                  Dr. Clergy is reflecting... 📖
                </div>
              </div>
            )}

            {error && (
              <p style={styles.errorMsg}>⚠️ {error}</p>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={styles.inputArea}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about any verse or topic..."
              rows={2}
              style={styles.textarea}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  ...styles.sendBtn,
                  background: loading || !input.trim()
                    ? 'rgba(240,192,64,0.3)'
                    : 'linear-gradient(135deg, #f0c040, #c8860a)',
                  color: loading || !input.trim() ? '#888' : '#1a0a00',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                Send ✝
              </button>
              <button onClick={clearChat} style={styles.clearBtn}>New Chat</button>
            </div>
          </div>

          {/* Hint */}
          <p style={styles.hint}>Enter to send · Shift+Enter for new line</p>
        </div>
      )}

      {/* ── Floating Button ── */}
      <button onClick={() => setOpen(prev => !prev)} style={styles.fab}>
        {open ? '✕' : '✝'}
        <span style={styles.fabLabel}>{open ? 'Close' : 'Ask Dr. Clergy'}</span>
      </button>

    </div>
  )
}

const styles = {
  wrapper: {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.75rem',
    fontFamily: 'Georgia, serif',
  },
  panel: {
    width: '360px',
    maxHeight: '520px',
    background: 'linear-gradient(135deg, #1a0a00 0%, #2d1500 100%)',
    borderRadius: '16px',
    border: '1px solid rgba(240,192,64,0.25)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.85rem 1rem',
    borderBottom: '1px solid rgba(240,192,64,0.15)',
    background: 'rgba(0,0,0,0.3)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  headerIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f0c040, #c8860a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    color: '#1a0a00',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  headerTitle: {
    color: '#f0c040',
    fontWeight: '700',
    fontSize: '0.95rem',
    margin: 0,
  },
  headerSub: {
    color: '#c8a96e',
    fontSize: '0.72rem',
    margin: 0,
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#c8a96e',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f0c040, #c8860a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    color: '#1a0a00',
    fontWeight: 'bold',
    flexShrink: 0,
    marginRight: '0.5rem',
    marginTop: '4px',
  },
  bubble: {
    maxWidth: '80%',
    padding: '0.65rem 0.9rem',
    fontSize: '0.85rem',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
  },
  errorMsg: {
    color: '#ff6b6b',
    fontSize: '0.78rem',
    textAlign: 'center',
    margin: '0.5rem 0',
  },
  inputArea: {
    display: 'flex',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    borderTop: '1px solid rgba(240,192,64,0.15)',
    background: 'rgba(0,0,0,0.2)',
    alignItems: 'flex-end',
  },
  textarea: {
    flex: 1,
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(240,192,64,0.3)',
    borderRadius: '10px',
    padding: '0.6rem 0.8rem',
    color: '#f0e6d0',
    fontSize: '0.85rem',
    fontFamily: 'Georgia, serif',
    resize: 'none',
    outline: 'none',
    lineHeight: '1.5',
  },
  sendBtn: {
    border: 'none',
    borderRadius: '8px',
    padding: '0.55rem 0.9rem',
    fontWeight: 'bold',
    fontSize: '0.82rem',
    transition: 'all 0.2s',
  },
  clearBtn: {
    background: 'transparent',
    border: '1px solid rgba(240,192,64,0.3)',
    borderRadius: '8px',
    padding: '0.4rem 0.9rem',
    color: '#c8a96e',
    fontSize: '0.75rem',
    cursor: 'pointer',
  },
  hint: {
    color: 'rgba(200,169,110,0.4)',
    fontSize: '0.68rem',
    textAlign: 'center',
    padding: '0.3rem 0 0.5rem',
    margin: 0,
  },
  fab: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'linear-gradient(135deg, #f0c040, #c8860a)',
    border: 'none',
    borderRadius: '50px',
    padding: '0.75rem 1.25rem',
    color: '#1a0a00',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(240,192,64,0.4)',
    fontFamily: 'Georgia, serif',
    transition: 'all 0.2s',
  },
  fabLabel: {
    fontSize: '0.88rem',
  },
}