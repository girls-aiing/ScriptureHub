import React, { useState, useRef, useEffect } from 'react'

// ─── CONFIGURATION ───────────────────────────────────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL_NAME = "llama-3.3-70b-versatile"

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

// ─── SPEECH UTILITY ──────────────────────────────────────────────────────────
let currentUtterance = null

const speakText = (text, onEnd) => {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const cleaned = text.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim()
  const utterance = new SpeechSynthesisUtterance(cleaned)
  utterance.rate = 0.9
  utterance.pitch = 0.95
  utterance.lang = 'en-US'
  utterance.onend = () => { currentUtterance = null; onEnd?.() }
  window.speechSynthesis.speak(utterance)
}

const stopSpeaking = () => {
  window.speechSynthesis.cancel()
  currentUtterance = null
}

// ─── UI COMPONENTS ───────────────────────────────────────────────────────────
const SpeakButton = ({ text, isSpeaking, onSpeak, onStop }) => (
  <button
    onClick={isSpeaking ? onStop : onSpeak}
    style={{
      background: isSpeaking ? 'rgba(74,124,89,0.35)' : 'rgba(255,255,255,0.07)',
      border: `1px solid ${isSpeaking ? '#6dbf82' : 'rgba(109,191,130,0.25)'}`,
      borderRadius: '8px',
      padding: '4px 10px',
      cursor: 'pointer',
      fontSize: '0.8rem',
      color: isSpeaking ? '#6dbf82' : '#a8d5b5',
      marginTop: '8px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px'
    }}
  >
    {isSpeaking ? '🔊 Speaking...' : '🔈 Listen'}
  </button>
)

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function AIAdvicePage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Peace be unto you, beloved! 🌿\n\nI am Pastor Silas. How can I walk with you and pray with you today?`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [speakingIndex, setSpeakingIndex] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)

  // Speech Recognition Setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = useRef(null)

  useEffect(() => {
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition()
      recognition.current.continuous = false
      recognition.current.interimResults = false
      recognition.current.lang = 'en-US'

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      recognition.current.onerror = (event) => {
        console.error("Speech error:", event.error)
        setIsListening(false)
      }

      recognition.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [SpeechRecognition])

  const toggleListening = () => {
    if (!recognition.current) {
      alert("Voice recognition is not supported in this browser. Please use Chrome or Safari.")
      return
    }

    if (isListening) {
      recognition.current.stop()
    } else {
      setIsListening(true)
      recognition.current.start()
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    if (!GROQ_API_KEY) {
      setError('Groq API key is missing. Please check your Vercel settings.')
      return
    }

    const userMessage = { role: 'user', content: input.trim() }
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
          model: MODEL_NAME,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...updatedMessages.map(m => ({ role: m.role, content: m.content }))
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error?.message || 'The connection to the vestry was interrupted.')
      }

      const assistantContent = data.choices[0].message.content
      const assistantMessage = { role: 'assistant', content: assistantContent }

      setMessages(prev => [...prev, assistantMessage])
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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1f0f 0%, #0f2d18 50%, #0a1f0f 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '2rem 1rem', fontFamily: "'Georgia', serif"
    }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '3rem' }}>🌿</div>
        <h1 style={{ color: '#6dbf82', fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>Pastor Silas</h1>
        <p style={{ color: '#a8d5b5', fontSize: '0.9rem' }}>Powered by Groq ⚡</p>
      </div>

      {/* Chat Box */}
      <div style={{
          width: '100%', maxWidth: '750px', background: 'rgba(255,255,255,0.04)',
          borderRadius: '16px', border: '1px solid rgba(109,191,130,0.2)',
          display: 'flex', flexDirection: 'column', height: '60vh', overflow: 'hidden'
      }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                padding: '0.85rem 1.1rem', borderRadius: '12px',
                background: msg.role === 'user' ? '#2d6a4f' : 'rgba(255,255,255,0.07)',
                color: '#d8f3dc', fontSize: '0.95rem', maxWidth: '85%', whiteSpace: 'pre-wrap'
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
          {loading && <div style={{ color: '#a8d5b5', fontSize: '0.9rem' }}>Pastor Silas is listening... 🙏</div>}
          {error && <div style={{ color: '#ff6b6b', background: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '8px' }}>⚠️ {error}</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(109,191,130,0.2)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          
          {/* Microphone Button */}
          <button 
            onClick={toggleListening}
            title="Speak your heart"
            style={{
              background: isListening ? '#ff4d4d' : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '45px',
              height: '45px',
              cursor: 'pointer',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              animation: isListening ? 'pulse 1.5s infinite' : 'none'
            }}
          >
            {isListening ? '🛑' : '🎤'}
          </button>

          <textarea 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Speak your heart..."} 
            style={{
              flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(109,191,130,0.3)',
              borderRadius: '10px', padding: '0.75rem', color: '#d8f3dc', resize: 'none', outline: 'none',
              height: '45px'
          }} />
          
          <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
              background: '#2d6a4f', color: '#fff', border: 'none', borderRadius: '10px', padding: '0 1.2rem', height: '45px', cursor: 'pointer'
          }}>Send 🙏</button>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 77, 77, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(255, 77, 77, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 77, 77, 0); }
        }
      `}</style>
    </div>
  )
}