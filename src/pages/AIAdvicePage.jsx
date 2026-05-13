import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'

// ─── CONFIGURATION ───────────────────────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL_NAME   = "llama-3.3-70b-versatile"

const SYSTEM_PROMPT = `You are Pastor Silas, a warm, faith-filled Nigerian/African pastor with over 30 years of ministry experience. You are known for your wisdom and ability to connect God's Word to everyday life.

Your personality:
- Warm, encouraging fatherly mentor.
- Speak with gentle authority.
- Give practical, scripture-rooted advice.
- Always cite exact scripture (e.g. Jeremiah 29:11).

Your response format:
1. Acknowledge the person with warmth.
2. Give faith-rooted advice with scripture.
3. End EVERY response with a short, heartfelt prayer starting with "🙏 Let us pray:".`

// ─── SPEECH UTILITY ──────────────────────────────────────────────
const speakText = (text, onEnd) => {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const cleaned = text.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim()
  const utterance = new SpeechSynthesisUtterance(cleaned)
  utterance.rate  = 0.9
  utterance.pitch = 0.95
  utterance.lang  = 'en-US'
  utterance.onend = () => onEnd?.()
  window.speechSynthesis.speak(utterance)
}

const stopSpeaking = () => window.speechSynthesis.cancel()

// ─── SPEAK BUTTON ────────────────────────────────────────────────
const SpeakButton = ({ text, isSpeaking, onSpeak, onStop }) => (
  <button
    onClick={isSpeaking ? onStop : onSpeak}
    style={{
      background:   isSpeaking ? 'rgba(74,124,89,0.35)' : 'rgba(255,255,255,0.07)',
      border:       `1px solid ${isSpeaking ? '#6dbf82' : 'rgba(109,191,130,0.25)'}`,
      borderRadius: '8px',
      padding:      '4px 10px',
      cursor:       'pointer',
      fontSize:     '0.8rem',
      color:        isSpeaking ? '#6dbf82' : '#a8d5b5',
      marginTop:    '8px',
      display:      'inline-flex',
      alignItems:   'center',
      gap:          '5px',
    }}
  >
    {isSpeaking ? '🔊 Speaking...' : '🔈 Listen'}
  </button>
)

// ─── MAIN PAGE ───────────────────────────────────────────────────
export default function AIAdvicePage() {
  const { t } = useLanguage()
  const [messages, setMessages] = useState([
    {
      role:    'assistant',
      content: `Peace be unto you, beloved! 🌿\n\nI am Pastor Silas. How can I walk with you and pray with you today?`,
    }
  ])
  const [input,         setInput]         = useState('')
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState('')
  const [speakingIndex, setSpeakingIndex] = useState(null)
  const [isListening,   setIsListening]   = useState(false)

  const messagesEndRef = useRef(null)

  // ── CONTINUOUS RECORDING SETUP ───────────────────────────────
  // We use MediaRecorder + Groq Whisper-compatible approach:
  // SpeechRecognition with continuous=true and interimResults=true
  // so it NEVER auto-stops on silence — only stops when user clicks Stop.
  const recognitionRef = useRef(null)
  const interimRef     = useRef('')   // accumulates interim transcript

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return

    const rec = new SR()
    rec.continuous      = true   // ← KEY: never auto-stop on silence
    rec.interimResults  = true   // ← receive partial results while speaking
    rec.lang            = 'en-US'

    rec.onresult = (event) => {
      let interim = ''
      let final   = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) final += t
        else interim += t
      }
      // Append any newly finalised text to the input box
      if (final) {
        setInput(prev => (prev + ' ' + final).trim())
      }
      // Show live interim text in a ref (we display it separately)
      interimRef.current = interim
    }

    rec.onerror = (e) => {
      // 'no-speech' is normal during pauses — ignore it so recording continues
      if (e.error === 'no-speech') return
      console.error('Speech recognition error:', e.error)
      setIsListening(false)
    }

    // onend fires if the browser forcibly stops (e.g. tab loses focus).
    // We restart automatically if the user hasn't pressed Stop yet.
    rec.onend = () => {
      if (isListeningRef.current) {
        try { rec.start() } catch (_) {}
      } else {
        setIsListening(false)
      }
    }

    recognitionRef.current = rec
  }, []) // run once on mount

  // Keep a ref in sync with isListening so the onend closure can read it
  const isListeningRef = useRef(false)
  useEffect(() => { isListeningRef.current = isListening }, [isListening])

  // ── START / STOP RECORDING ───────────────────────────────────
  const startListening = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in this browser. Please use Chrome or Safari.')
      return
    }
    interimRef.current = ''
    setIsListening(true)
    try { recognitionRef.current.start() } catch (_) {}
  }

  const stopListening = () => {
    isListeningRef.current = false   // prevent auto-restart in onend
    setIsListening(false)
    try { recognitionRef.current?.stop() } catch (_) {}
  }

  // ── AUTO-SCROLL ──────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── SEND MESSAGE ─────────────────────────────────────────────
  const sendMessage = async () => {
    if (!input.trim() || loading) return
    if (!GROQ_API_KEY) {
      setError('Groq API key is missing. Please check your environment settings.')
      return
    }

    // Stop recording if still active when user sends
    if (isListening) stopListening()

    const userMessage     = { role: 'user', content: input.trim() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)
    setError('')
    stopSpeaking()
    setSpeakingIndex(null)

    try {
      const response = await fetch(GROQ_API_URL, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model:       MODEL_NAME,
          messages:    [
            { role: 'system', content: SYSTEM_PROMPT },
            ...updatedMessages.map(m => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.7,
          max_tokens:  1024,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data?.error?.message || 'The connection to the vestry was interrupted.')

      const assistantContent = data.choices[0].message.content
      setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }])
      setSpeakingIndex(updatedMessages.length)
      speakText(assistantContent, () => setSpeakingIndex(null))

    } catch (err) {
      console.error('Groq Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  // ── RENDER ───────────────────────────────────────────────────
  return (
    <div style={{
      minHeight:      '100vh',
      background:     'linear-gradient(135deg, #0a1f0f 0%, #0f2d18 50%, #0a1f0f 100%)',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      padding:        '2rem 1rem',
      fontFamily:     "'Georgia', serif",
    }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '3rem' }}>🌿</div>
        <h1 style={{ color: '#6dbf82', fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>Pastor Silas</h1>
        <p style={{ color: '#a8d5b5', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>Powered by Groq ⚡</p>
      </div>

      {/* Chat box */}
      <div style={{
        width:         '100%',
        maxWidth:      '750px',
        background:    'rgba(255,255,255,0.04)',
        borderRadius:  '16px',
        border:        '1px solid rgba(109,191,130,0.2)',
        display:       'flex',
        flexDirection: 'column',
        height:        '60vh',
        overflow:      'hidden',
      }}>

        {/* Messages */}
        <div style={{
          flex:          1,
          overflowY:     'auto',
          padding:       '1.5rem',
          display:       'flex',
          flexDirection: 'column',
          gap:           '1rem',
        }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                padding:      '0.85rem 1.1rem',
                borderRadius: '12px',
                background:   msg.role === 'user' ? '#2d6a4f' : 'rgba(255,255,255,0.07)',
                color:        '#d8f3dc',
                fontSize:     '0.95rem',
                maxWidth:     '85%',
                whiteSpace:   'pre-wrap',
              }}>
                {msg.content}
                {msg.role === 'assistant' && (
                  <div>
                    <SpeakButton
                      text={msg.content}
                      isSpeaking={speakingIndex === index}
                      onSpeak={() => { setSpeakingIndex(index); speakText(msg.content, () => setSpeakingIndex(null)) }}
                      onStop={() => { stopSpeaking(); setSpeakingIndex(null) }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ color: '#a8d5b5', fontSize: '0.9rem' }}>Pastor Silas is listening... 🙏</div>
          )}
          {error && (
            <div style={{ color: '#ff6b6b', background: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '8px' }}>
              ⚠️ {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div style={{
          padding:     '1rem',
          borderTop:   '1px solid rgba(109,191,130,0.2)',
          display:     'flex',
          gap:         '0.5rem',
          alignItems:  'flex-end',
          flexWrap:    'wrap',
        }}>

          {/* ── MIC CONTROLS ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>

            {/* START button — only visible when NOT recording */}
            {!isListening && (
              <button
                onClick={startListening}
                title="Start recording — speaks until you press Stop"
                style={{
                  background:    'rgba(255,255,255,0.1)',
                  border:        '1px solid rgba(109,191,130,0.4)',
                  borderRadius:  '50%',
                  width:         '45px',
                  height:        '45px',
                  cursor:        'pointer',
                  fontSize:      '1.2rem',
                  display:       'flex',
                  alignItems:    'center',
                  justifyContent:'center',
                  transition:    'all 0.3s ease',
                }}
              >
                🎤
              </button>
            )}

            {/* STOP button — only visible WHILE recording */}
            {isListening && (
              <button
                onClick={stopListening}
                title="Stop recording"
                style={{
                  background:    '#ff4d4d',
                  border:        'none',
                  borderRadius:  '50%',
                  width:         '45px',
                  height:        '45px',
                  cursor:        'pointer',
                  fontSize:      '1.2rem',
                  display:       'flex',
                  alignItems:    'center',
                  justifyContent:'center',
                  animation:     'pulse 1.5s infinite',
                  color:         '#fff',
                }}
              >
                ⏹
              </button>
            )}

            {/* Live status label */}
            <span style={{
              fontSize:  '0.62rem',
              color:     isListening ? '#ff8080' : '#a8d5b5',
              textAlign: 'center',
              lineHeight:'1.2',
            }}>
              {isListening ? '● REC' : 'Mic'}
            </span>
          </div>

          {/* Text area */}
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? '🔴 Recording… press ⏹ to stop' : t('askQuestion')}
            style={{
              flex:         1,
              background:   'rgba(255,255,255,0.06)',
              border:       `1px solid ${isListening ? 'rgba(255,77,77,0.5)' : 'rgba(109,191,130,0.3)'}`,
              borderRadius: '10px',
              padding:      '0.75rem',
              color:        '#d8f3dc',
              resize:       'none',
              outline:      'none',
              height:       '45px',
              fontFamily:   'Georgia, serif',
              fontSize:     '0.95rem',
              transition:   'border 0.3s',
            }}
          />

          {/* Send button */}
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              background:   loading || !input.trim() ? 'rgba(45,106,79,0.4)' : '#2d6a4f',
              color:        '#fff',
              border:       'none',
              borderRadius: '10px',
              padding:      '0 1.2rem',
              height:       '45px',
              cursor:       loading || !input.trim() ? 'not-allowed' : 'pointer',
              fontFamily:   'Georgia, serif',
              fontSize:     '0.95rem',
              transition:   'background 0.2s',
            }}
           >
            {t('send')} 🙏
          </button>
        </div>

        {/* Recording hint */}
        {isListening && (
          <p style={{
            margin:    '0 0 0.5rem',
            textAlign: 'center',
            color:     '#ff8080',
            fontSize:  '0.78rem',
          }}>
            🔴 Recording continuously — press ⏹ when you are done speaking
          </p>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes pulse {
          0%   { transform: scale(1);   box-shadow: 0 0 0 0   rgba(255,77,77,0.7); }
          70%  { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(255,77,77,0);  }
          100% { transform: scale(1);   box-shadow: 0 0 0 0   rgba(255,77,77,0);   }
        }
      `}</style>
    </div>
  )
}