import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useProgress } from '../hooks/useProgress'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
console.log('API Key loaded:', GROQ_API_KEY ? 'YES ✅' : 'MISSING ❌')

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

  // Strip emoji characters for cleaner speech
  const cleaned = text.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim()

  const utterance = new SpeechSynthesisUtterance(cleaned)
  utterance.rate   = 0.9
  utterance.pitch  = 1.0
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

// ─── SpeakButton component ────────────────────────────────────────────────────
const SpeakButton = ({ text, isSpeaking, onSpeak, onStop }) => (
  <button
    onClick={isSpeaking ? onStop : onSpeak}
    title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
    style={{
      background: isSpeaking
        ? 'rgba(240,192,64,0.25)'
        : 'rgba(255,255,255,0.07)',
      border: `1px solid ${isSpeaking ? '#f0c040' : 'rgba(240,192,64,0.2)'}`,
      borderRadius: '8px',
      padding: '3px 8px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      color: isSpeaking ? '#f0c040' : '#c8a96e',
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function AIConsultantPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Shalom and welcome! 🕊️ I'm Dr. Clergy, your Bible study companion. I've spent decades studying the scriptures — from Genesis to Revelation — and I'm here to explore God's Word with you.\n\nWhether you have a question about a specific verse, a theological concept, a biblical character, or just something that's been on your heart — ask away!\n\nWhat would you like to explore in the scriptures today?`
    }
  ])
  const [input, setInput]                   = useState('')
  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState('')
  const [speakingIndex, setSpeakingIndex]   = useState(null)
  const [voiceEnabled, setVoiceEnabled]     = useState(true)
  const messagesEndRef                       = useRef(null)

  // ✅ Progress tracking
  const { logSecret } = useProgress()

  // Voices load asynchronously in some browsers
  useEffect(() => {
    const load = () => {}
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  // Stop speaking when component unmounts
  useEffect(() => () => stopSpeaking(), [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-speak the latest assistant message
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

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    if (!GROQ_API_KEY) {
      setError('API key is missing. Please check your .env file.')
      return
    }

    const userMessage     = { role: 'user', content: input.trim() }

    // ✅ Record this question to progress tracker
    logSecret(input.trim())

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)
    setError('')
    stopSpeaking()
    setSpeakingIndex(null)

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
      const assistantMessage = {
        role: 'assistant',
        content: data.choices[0].message.content
      }

      setMessages(prev => {
        const next = [...prev, assistantMessage]
        // Auto-speak after state update
        setTimeout(() => autoSpeak(assistantMessage.content, next.length - 1), 100)
        return next
      })

    } catch (err) {
      console.error('Groq Error:', err)
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
    const welcome = `Shalom and welcome back! 🕊️ I'm ready for a fresh conversation. What scripture or topic would you like to explore today?`
    setMessages([{ role: 'assistant', content: welcome }])
    setError('')
  }

  const toggleVoice = () => {
    if (voiceEnabled) {
      stopSpeaking()
      setSpeakingIndex(null)
    }
    setVoiceEnabled(v => !v)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a0a00 0%, #2d1500 50%, #1a0a00 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem',
      fontFamily: "'Georgia', serif"
    }}>
      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0 rgba(240,192,64,0.5); }
          70%  { box-shadow: 0 0 0 6px rgba(240,192,64,0); }
          100% { box-shadow: 0 0 0 0 rgba(240,192,64,0); }
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✝️</div>
        <h1 style={{
          color: '#f0c040', fontSize: '2rem', fontWeight: 'bold',
          margin: '0 0 0.25rem 0',
          textShadow: '0 2px 8px rgba(240,192,64,0.4)'
        }}>
          AI Bible Consultant
        </h1>
        <p style={{ color: '#c8a96e', fontSize: '0.95rem', margin: '0 0 0.75rem 0' }}>
          Deep theological conversations powered by scripture
        </p>

        {/* Voice toggle */}
        <button
          onClick={toggleVoice}
          title={voiceEnabled ? 'Mute Dr. Clergy' : 'Unmute Dr. Clergy'}
          style={{
            background: voiceEnabled
              ? 'linear-gradient(135deg, #f0c040, #c8860a)'
              : 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(240,192,64,0.4)',
            borderRadius: '20px',
            padding: '0.4rem 1rem',
            color: voiceEnabled ? '#1a0a00' : '#c8a96e',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {voiceEnabled ? '🔊 Voice ON' : '🔇 Voice OFF'}
        </button>
      </div>

      {/* Chat Container */}
      <div style={{
        width: '100%', maxWidth: '780px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        border: '1px solid rgba(240,192,64,0.2)',
        display: 'flex', flexDirection: 'column',
        height: '65vh', overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '1.5rem',
          display: 'flex', flexDirection: 'column', gap: '1rem'
        }}>
          {messages.map((msg, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f0c040, #c8860a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', marginRight: '0.75rem',
                  flexShrink: 0, marginTop: '4px'
                }}>✝</div>
              )}

              <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  padding: '0.85rem 1.1rem',
                  borderRadius: msg.role === 'user'
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #c8860a, #f0c040)'
                    : 'rgba(255,255,255,0.08)',
                  color: msg.role === 'user' ? '#1a0a00' : '#f0e6d0',
                  fontSize: '0.95rem', lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  border: msg.role === 'assistant'
                    ? '1px solid rgba(240,192,64,0.15)' : 'none',
                  fontWeight: msg.role === 'user' ? '600' : '400'
                }}>
                  {msg.content}
                </div>

                {/* Speak button — only on assistant messages */}
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

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #f0c040, #c8860a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem'
              }}>✝</div>
              <div style={{
                padding: '0.85rem 1.1rem',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '18px 18px 18px 4px',
                border: '1px solid rgba(240,192,64,0.15)',
                color: '#c8a96e', fontSize: '0.9rem'
              }}>
                Dr. Clergy is reflecting on scripture... 📖
              </div>
            </div>
          )}

          {error && (
            <div style={{
              textAlign: 'center', color: '#ff6b6b', fontSize: '0.85rem',
              padding: '0.75rem', background: 'rgba(255,107,107,0.1)',
              borderRadius: '8px', border: '1px solid rgba(255,107,107,0.2)'
            }}>
              ⚠️ {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid rgba(240,192,64,0.15)',
          background: 'rgba(0,0,0,0.2)',
          display: 'flex', gap: '0.75rem', alignItems: 'flex-end'
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about any verse, passage, or biblical topic..."
            rows={2}
            style={{
              flex: 1, background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(240,192,64,0.3)',
              borderRadius: '12px', padding: '0.75rem 1rem',
              color: '#f0e6d0', fontSize: '0.95rem',
              fontFamily: "'Georgia', serif",
              resize: 'none', outline: 'none', lineHeight: '1.5'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim()
                  ? 'rgba(240,192,64,0.3)'
                  : 'linear-gradient(135deg, #f0c040, #c8860a)',
                border: 'none', borderRadius: '10px',
                padding: '0.65rem 1.2rem',
                color: loading || !input.trim() ? '#888' : '#1a0a00',
                fontWeight: 'bold', fontSize: '0.9rem',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Send ✝
            </button>
            <button
              onClick={clearChat}
              style={{
                background: 'transparent',
                border: '1px solid rgba(240,192,64,0.3)',
                borderRadius: '10px', padding: '0.5rem 1.2rem',
                color: '#c8a96e', fontSize: '0.8rem',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              New Chat
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p style={{
        color: 'rgba(200,169,110,0.5)', fontSize: '0.75rem',
        marginTop: '1rem', textAlign: 'center'
      }}>
        Press Enter to send • Shift+Enter for new line • 🔊 Dr. Clergy speaks every answer
      </p>
    </div>
  )
}