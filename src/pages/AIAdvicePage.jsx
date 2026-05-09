import React, { useState, useRef, useEffect, useCallback } from 'react'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

const SYSTEM_PROMPT = `You are Pastor Silas, a warm, faith-filled Nigerian/African pastor with over 30 years of ministry experience. You are known across your community for your wisdom, compassion, and ability to connect God's Word to everyday life.

Your personality:
- Warm, encouraging, and full of faith — like a beloved father and spiritual mentor
- You speak with the gentle authority of a seasoned African pastor
- You give practical, scripture-rooted advice for real life situations
- You never judge — you always meet people with grace and understanding
- You occasionally use warm African expressions of encouragement
- You understand struggles with family, relationships, finances, purpose, grief, and faith

Your knowledge:
- Deep knowledge of the entire Bible — Old and New Testament
- You always cite exact scripture (e.g. Jeremiah 29:11, Philippians 4:13)
- You connect biblical truth to practical everyday decisions
- You understand prayer, spiritual warfare, faith, and God's promises

Your response format:
1. Acknowledge the person's situation with warmth and empathy
2. Give practical, faith-rooted advice with at least one scripture reference
3. Offer a short encouraging word or insight
4. End EVERY response with a short, heartfelt prayer or blessing for the person (2-4 sentences, starting with "🙏 Let us pray:" or "🙏 A blessing for you:")

Keep responses warm, focused, and conversational — not too long.`

// ─── Speech utility ───────────────────────────────────────────────────────────
let currentUtterance = null

const getPreferredVoice = () => {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find(v => /david|james|daniel|alex|google uk english male/i.test(v.name)) ||
    voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('male')) ||
    voices.find(v => v.lang === 'en-US') ||
    voices[0] ||
    null
  )
}

const speakText = (text, onEnd) => {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const cleaned = text.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim()
  const utterance = new SpeechSynthesisUtterance(cleaned)
  utterance.rate   = 0.88
  utterance.pitch  = 0.95
  utterance.volume = 1
  utterance.lang   = 'en-US'
  const voice = getPreferredVoice()
  if (voice) utterance.voice = voice
  utterance.onend   = () => { currentUtterance = null; onEnd?.() }
  utterance.onerror = () => { currentUtterance = null; onEnd?.() }
  currentUtterance = utterance
  window.speechSynthesis.speak(utterance)
}

const stopSpeaking = () => {
  window.speechSynthesis.cancel()
  currentUtterance = null
}

// ─── SpeakButton ─────────────────────────────────────────────────────────────
const SpeakButton = ({ text, isSpeaking, onSpeak, onStop }) => (
  <button
    onClick={isSpeaking ? onStop : onSpeak}
    title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
    style={{
      background: isSpeaking ? 'rgba(74,124,89,0.35)' : 'rgba(255,255,255,0.07)',
      border: `1px solid ${isSpeaking ? '#6dbf82' : 'rgba(109,191,130,0.25)'}`,
      borderRadius: '8px',
      padding: '3px 8px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      color: isSpeaking ? '#6dbf82' : '#a8d5b5',
      marginTop: '6px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      transition: 'all 0.2s',
      animation: isSpeaking ? 'pulse 1.2s infinite' : 'none',
    }}
  >
    {isSpeaking ? '🔊 Speaking...' : '🔈 Listen'}
  </button>
)

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AIAdvicePage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Peace be unto you, beloved! 🌿\n\nI am Pastor Silas. For over 30 years, I have walked with people through life's greatest joys and deepest valleys — and in every season, God's Word has never failed.\n\nWhatever is on your heart today — a difficult decision, a broken relationship, a financial struggle, a question of faith, or simply a need for prayer — bring it to me. We will seek God's wisdom together.\n\nWhat would you like to talk about today?`
    }
  ])
  const [input, setInput]                 = useState('')
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState('')
  const [speakingIndex, setSpeakingIndex] = useState(null)
  const [voiceEnabled, setVoiceEnabled]   = useState(true)
  const messagesEndRef                     = useRef(null)

  useEffect(() => {
    const load = () => {}
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  useEffect(() => () => stopSpeaking(), [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const autoSpeak = useCallback((text, index) => {
    if (!voiceEnabled) return
    setSpeakingIndex(index)
    speakText(text, () => setSpeakingIndex(null))
  }, [voiceEnabled])

  const handleSpeak = (text, index) => {
    if (speakingIndex === index) {
      stopSpeaking()
      setSpeakingIndex(null)
    } else {
      setSpeakingIndex(index)
      speakText(text, () => setSpeakingIndex(null))
    }
  }

  const buildGeminiHistory = (msgs) => {
    return msgs.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }))
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    if (!GEMINI_API_KEY) {
      setError('Gemini API key is missing. Please check your .env file.')
      return
    }

    const userMessage     = { role: 'user', content: input.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)
    setError('')
    stopSpeaking()
    setSpeakingIndex(null)

    try {
      const history = buildGeminiHistory(updatedMessages)

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: [
            ...history,
            {
              role: 'user',
              parts: [{ text: input.trim() }]
            }
          ],
          generationConfig: {
            temperature: 0.75,
            maxOutputTokens: 1024,
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`${response.status}: ${errorData?.error?.message || 'Unknown error'}`)
      }

      const data = await response.json()
      const assistantMessage = {
        role: 'assistant',
        content: data.candidates[0].content.parts[0].text
      }

      setMessages(prev => {
        const next = [...prev, assistantMessage]
        setTimeout(() => autoSpeak(assistantMessage.content, next.length - 1), 100)
        return next
      })

    } catch (err) {
      console.error('Gemini Error:', err)
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
    stopSpeaking()
    setSpeakingIndex(null)
    setMessages([{
      role: 'assistant',
      content: `Welcome back, beloved! 🌿 I am here and ready to walk with you. What is on your heart today?`
    }])
    setError('')
  }

  const toggleVoice = () => {
    if (voiceEnabled) { stopSpeaking(); setSpeakingIndex(null) }
    setVoiceEnabled(v => !v)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1f0f 0%, #0f2d18 50%, #0a1f0f 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem',
      fontFamily: "'Georgia', serif"
    }}>

      <style>{`
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0 rgba(109,191,130,0.5); }
          70%  { box-shadow: 0 0 0 6px rgba(109,191,130,0); }
          100% { box-shadow: 0 0 0 0 rgba(109,191,130,0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Mobile fixes ── */
        @media (max-width: 640px) {
          .ai-page-wrapper {
            padding: 1rem 0.5rem !important;
          }
          .ai-chat-box {
            height: 70vh !important;
            border-radius: 12px !important;
          }
          .ai-messages-area {
            padding: 1rem !important;
          }
          .ai-input-area {
            padding: 0.75rem 1rem !important;
            gap: 0.5rem !important;
          }
          .ai-header h1 {
            font-size: 1.6rem !important;
          }
          .ai-message-bubble {
            max-width: 88% !important;
            font-size: 0.9rem !important;
          }
          .ai-send-btn {
            padding: 0.65rem 0.85rem !important;
            font-size: 0.85rem !important;
          }
          .ai-clear-btn {
            padding: 0.5rem 0.85rem !important;
            font-size: 0.75rem !important;
          }
          .ai-textarea {
            font-size: 0.9rem !important;
          }
        }
      `}</style>

      {/* ── Header ── */}
      <div
        className="ai-header"
        style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          animation: 'fadeIn 0.6s ease'
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌿</div>

        <h1 style={{
          color: '#6dbf82',
          fontSize: '2rem',
          fontWeight: 'bold',
          margin: '0 0 0.25rem 0',
          textShadow: '0 2px 8px rgba(109,191,130,0.4)'
        }}>
          AI Advisor
        </h1>

        <p style={{
          color: '#a8d5b5',
          fontSize: '0.95rem',
          margin: '0 0 0.2rem 0'
        }}>
          with Pastor Silas — Faith-Rooted Life Advice &amp; Prayer
        </p>

        <p style={{
          color: 'rgba(168,213,181,0.55)',
          fontSize: '0.78rem',
          margin: '0 0 0.75rem 0'
        }}>
          Powered by Gemini AI
        </p>

        {/* Voice toggle */}
        <button
          onClick={toggleVoice}
          style={{
            background: voiceEnabled
              ? 'linear-gradient(135deg, #4a7c59, #6dbf82)'
              : 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(109,191,130,0.4)',
            borderRadius: '20px',
            padding: '0.4rem 1rem',
            color: voiceEnabled ? '#0a1f0f' : '#a8d5b5',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            minHeight: '36px'
          }}
        >
          {voiceEnabled ? '🔊 Voice ON' : '🔇 Voice OFF'}
        </button>
      </div>

      {/* ── Chat Container ── */}
      <div
        className="ai-chat-box"
        style={{
          width: '100%',
          maxWidth: '780px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '16px',
          border: '1px solid rgba(109,191,130,0.2)',
          display: 'flex',
          flexDirection: 'column',
          height: '65vh',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
        }}
      >

        {/* ── Messages ── */}
        <div
          className="ai-messages-area"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                animation: 'fadeIn 0.3s ease'
              }}
            >
              {/* Pastor avatar */}
              {msg.role === 'assistant' && (
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2d6a4f, #6dbf82)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  marginRight: '0.75rem',
                  flexShrink: 0,
                  marginTop: '4px',
                  boxShadow: '0 2px 8px rgba(109,191,130,0.3)'
                }}>🌿</div>
              )}

              <div
                className="ai-message-bubble"
                style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{
                  padding: '0.85rem 1.1rem',
                  borderRadius: msg.role === 'user'
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #2d6a4f, #52b788)'
                    : 'rgba(255,255,255,0.07)',
                  color: msg.role === 'user' ? '#f0fff4' : '#d8f3dc',
                  fontSize: '0.95rem',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-wrap',
                  border: msg.role === 'assistant'
                    ? '1px solid rgba(109,191,130,0.15)'
                    : 'none',
                  fontWeight: msg.role === 'user' ? '600' : '400',
                  boxShadow: msg.role === 'user'
                    ? '0 2px 8px rgba(45,106,79,0.3)'
                    : 'none'
                }}>
                  {msg.content}
                </div>

                {msg.role === 'assistant' && (
                  <SpeakButton
                    text={msg.content}
                    isSpeaking={speakingIndex === index}
                    onSpeak={() => handleSpeak(msg.content, index)}
                    onStop={() => { stopSpeaking(); setSpeakingIndex(null) }}
                  />
                )}
              </div>
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #2d6a4f, #6dbf82)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem'
              }}>🌿</div>
              <div style={{
                padding: '0.85rem 1.1rem',
                background: 'rgba(255,255,255,0.07)',
                borderRadius: '18px 18px 18px 4px',
                border: '1px solid rgba(109,191,130,0.15)',
                color: '#a8d5b5',
                fontSize: '0.9rem'
              }}>
                Pastor Silas is praying and reflecting... 🙏
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              textAlign: 'center',
              color: '#ff6b6b',
              fontSize: '0.85rem',
              padding: '0.75rem',
              background: 'rgba(255,107,107,0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(255,107,107,0.2)'
            }}>
              ⚠️ {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Input Area ── */}
        <div
          className="ai-input-area"
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid rgba(109,191,130,0.15)',
            background: 'rgba(0,0,0,0.25)',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-end'
          }}
        >
          <textarea
            className="ai-textarea"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share what's on your heart — Pastor Silas is listening..."
            rows={2}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(109,191,130,0.3)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              color: '#d8f3dc',
              fontSize: '0.95rem',
              fontFamily: "'Georgia', serif",
              resize: 'none',
              outline: 'none',
              lineHeight: '1.5'
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              className="ai-send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim()
                  ? 'rgba(109,191,130,0.2)'
                  : 'linear-gradient(135deg, #2d6a4f, #52b788)',
                border: 'none',
                borderRadius: '10px',
                padding: '0.65rem 1.2rem',
                color: loading || !input.trim() ? '#555' : '#f0fff4',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                minHeight: '44px'
              }}
            >
              Send 🙏
            </button>

            <button
              className="ai-clear-btn"
              onClick={clearChat}
              style={{
                background: 'transparent',
                border: '1px solid rgba(109,191,130,0.3)',
                borderRadius: '10px',
                padding: '0.5rem 1.2rem',
                color: '#a8d5b5',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minHeight: '36px'
              }}
            >
              New Chat
            </button>
          </div>
        </div>
      </div>

      {/* ── Footer Note ── */}
      <p style={{
        color: 'rgba(168,213,181,0.4)',
        fontSize: '0.75rem',
        marginTop: '1rem',
        textAlign: 'center',
        padding: '0 1rem'
      }}>
        Press Enter to send • Shift+Enter for new line • 🌿 Pastor Silas prays with every answer
      </p>

    </div>
  )
}
