import React, { useState, useEffect, useRef } from 'react';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const SYSTEM_PROMPT = `You are a spiritual and biblical dream interpreter. When given a dream description, respond ONLY with a valid JSON object (no markdown, no backticks, no extra commentary text) matching this exact structural blueprint:
{
  "title": "A short, relevant title summarizing the dream theme",
  "symbols": ["Key Symbol 1", "Key Symbol 2"],
  "interpretation": "A supportive, insightful interpretation of the dream based on biblical archetypes, metaphors, or spiritual contexts in 3-4 sentences.",
  "scriptureRef": "Book Chapter:Verse (e.g., Genesis 40:8 or Joel 2:28)",
  "scriptureText": "The text of the relevant Bible verse.",
  "prayer": "A customized, uplifting prayer of 3-4 sentences addressing the dream's message, asking for guidance, protection, or fulfillment of God's promises."
}`;

export default function DreamInterpreterPage() {
  const hasFired = useRef(false);

  useEffect(() => {
    if (!hasFired.current) {
      window.dispatchEvent(new CustomEvent('vg:subpage', { detail: 'dreams' }));
      hasFired.current = true;
    }
  }, []);

  const [dreamInput, setDreamInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  // Voice Recording Hook States
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('dream_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse dream history", e);
      }
    }
  }, []);

  // START RECORDING AUDIO
  const startRecording = async () => {
    setError('');
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // Stop all audio tracks from stream to release the mic light indicator
        stream.getTracks().forEach(track => track.stop());
        
        // Process the captured audio blob
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access error:", err);
      setError("Could not access microphone. Please check your browser permissions.");
    }
  };

  // STOP RECORDING AUDIO
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // TRANSCRIBE VIA GROQ WHISPER API
  const transcribeAudio = async (audioBlob) => {
    setTranscribing(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'dream_audio.wav');
      formData.append('model', 'whisper-large-v3');

      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Audio transcription service failed.');

      const data = await response.json();
      if (data.text) {
        // Append transcribed voice text to existing text or update it
        setDreamInput(prev => prev ? `${prev} ${data.text}` : data.text);
      } else {
        setError('No speech could be clearly detected. Please try speaking closer to your device.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to convert your recorded voice into text. Please try typing your vision.');
    } finally {
      setTranscribing(false);
    }
  };

  const handleInterpret = async (e) => {
    if (e) e.preventDefault();
    if (!dreamInput.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `Interpret this dream: ${dreamInput}` }
          ],
          temperature: 0.6,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) throw new Error('Failed to fetch interpretation from services.');

      const data = await response.json();
      const parsedResult = JSON.parse(data.choices[0].message.content);
      
      setResult(parsedResult);

      const newHistoryItem = {
        id: Date.now(),
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        dreamText: dreamInput,
        interpretationData: parsedResult
      };
      
      const updatedHistory = [newHistoryItem, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('dream_history', JSON.stringify(updatedHistory));

    } catch (err) {
      console.error(err);
      setError('Could not process interpretation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item) => {
    setDreamInput(item.dreamText);
    setResult(item.interpretationData);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear your vision history?")) {
      setHistory([]);
      localStorage.removeItem('dream_history');
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '3rem auto', padding: '0 1.5rem', fontFamily: 'Georgia, serif', color: '#2d1f10' }}>
      
      {/* HEADER SECTION */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)', marginBottom: '1rem' }}>
          <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>🌙</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '400', letterSpacing: '-0.02em', margin: '0 0 0.5rem 0', color: '#1a1105' }}>
          Spiritual Dream Sanctuary
        </h1>
        <p style={{ color: '#665743', fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: '1.5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Uncover ancient scriptural context, decipher metabolic symbols, and receive custom prayers written uniquely for your overnight visions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: history.length > 0 ? '1fr 260px' : '1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* MAIN WORKSPACE */}
        <div>
          <div style={{ background: '#ffffff', border: '1px solid rgba(201,168,76,0.18)', borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 35px rgba(201,168,76,0.06)', marginBottom: '2.5rem' }}>
            <form onSubmit={handleInterpret}>
              
              {/* Form Label and Audio Record Toolbar Container */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c9a84c', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Describe Your Vision
                </label>
                
                {/* MICROPHONE/VOICE CONTROLS */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      disabled={transcribing || loading}
                      style={{
                        background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)',
                        borderRadius: '20px', padding: '0.35rem 0.85rem', fontSize: '0.8rem',
                        fontWeight: '600', color: '#7a5000', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.35rem',
                        fontFamily: 'system-ui, -apple-system, sans-serif', transition: 'all 0.2s',
                        opacity: transcribing ? 0.6 : 1
                      }}
                    >
                      <span>🎙️</span> {transcribing ? 'Converting Voice...' : 'Record Spoken Dream'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      style={{
                        background: '#c0392b', border: 'none',
                        borderRadius: '20px', padding: '0.35rem 0.85rem', fontSize: '0.8rem',
                        fontWeight: '700', color: '#ffffff', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.35rem',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        boxShadow: '0 0 10px rgba(192,57,43,0.4)'
                      }}
                    >
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#fff', animation: 'pulse 0.8s infinite alternate' }} />
                      Stop Recording
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={dreamInput}
                onChange={(e) => setDreamInput(e.target.value)}
                placeholder={isRecording ? "Listening to your voice... Speak clearly into your device microphone." : "Provide as many details, emotions, or specific objects from your dream as you can remember..."}
                rows={5}
                disabled={isRecording}
                style={{
                  width: '100%', padding: '1.2rem', borderRadius: '12px',
                  border: isRecording ? '1px solid #c0392b' : '1px solid rgba(201,168,76,0.3)',
                  background: isRecording ? 'rgba(192,57,43,0.01)' : 'rgba(201,168,76,0.02)',
                  fontSize: '1.05rem', color: '#1a1105', outline: 'none',
                  resize: 'vertical', fontFamily: 'Georgia, serif', boxSizing: 'border-box',
                  lineHeight: '1.6', transition: 'all 0.2s'
                }}
              />
              <button
                type="submit"
                disabled={loading || isRecording || transcribing || !dreamInput.trim()}
                style={{
                  width: '100%', padding: '1rem', marginTop: '1rem',
                  background: '#1a1105', color: '#fcf9f2', border: 'none',
                  borderRadius: '10px', fontSize: '1rem', fontWeight: '600',
                  letterSpacing: '0.02em', cursor: 'pointer', transition: 'all 0.2s',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  boxShadow: '0 4px 12px rgba(26,17,5,0.15)',
                  opacity: (loading || isRecording || transcribing || !dreamInput.trim()) ? 0.5 : 1
                }}
              >
                {loading ? 'Consulting Biblical Archetypes...' : 'Discern Spiritual Translation'}
              </button>
            </form>
          </div>

          {/* ERROR PANEL */}
          {error && (
            <div style={{ color: '#c0392b', background: '#fdf2f2', padding: '1rem', borderRadius: '10px', textAlign: 'center', fontWeight: '500', marginBottom: '2rem', fontSize: '0.95rem', fontFamily: 'system-ui, -apple-system, sans-serif', border: '1px solid #f5c6cb' }}>
              ⚠️ {error}
            </div>
          )}

          {/* RESULTS REPORT */}
          {result && (
            <div style={{ background: '#fdfbf7', border: '1px solid #c9a84c', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 15px 50px rgba(26,17,5,0.05)' }}>
              
              {/* Header & Title */}
              <div style={{ borderBottom: '1px solid rgba(201,168,76,0.2)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#c9a84c', display: 'block', marginBottom: '0.25rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Exegesis Report
                </span>
                <h2 style={{ color: '#1a1105', margin: 0, fontSize: '1.75rem', fontWeight: '400' }}>
                  {result.title}
                </h2>
              </div>
              
              {/* Symbols Deciphered */}
              <div style={{ marginBottom: '1.75rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#665743', fontSize: '0.85rem', fontWeight: '600', marginRight: '0.25rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Core Symbols:
                </span>
                {result.symbols?.map((symbol, index) => (
                  <span key={index} style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: '#7a5000', fontWeight: '500', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {symbol}
                  </span>
                ))}
              </div>

              {/* Primary Interpretation Narrative */}
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '1.15rem', color: '#2d1f10', lineHeight: '1.7', margin: 0, fontStyle: 'italic' }}>
                  "{result.interpretation}"
                </p>
              </div>

              {/* Scriptural Anchor Box */}
              <div style={{ borderLeft: '3px solid #c9a84c', paddingLeft: '1.25rem', margin: '2rem 0', background: 'rgba(201,168,76,0.03)', padding: '1.25rem 1.25rem 1.25rem 1.5rem', borderRadius: '0 12px 12px 0' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#c9a84c', display: 'block', letterSpacing: '0.05em', marginBottom: '0.4rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  SCRIPTURAL ANCHOR — {result.scriptureRef}
                </span>
                <p style={{ margin: 0, fontSize: '1rem', color: '#4d3d28', lineHeight: '1.6', fontWeight: '400' }}>
                  "{result.scriptureText}"
                </p>
              </div>

              {/* Devotional Prayer Space */}
              <div style={{ background: '#ffffff', borderRadius: '14px', padding: '1.5rem', marginTop: '2rem', border: '1px solid rgba(201,168,76,0.2)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.01)' }}>
                <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.1rem', color: '#1a1105', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                  <span style={{ fontSize: '1.2rem' }}>🙏</span> Bespoke Devotional Prayer
                </h3>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.65', color: '#4a3f31', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {result.prayer}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* SIDE PANEL HISTORY INVENTORY */}
        {history.length > 0 && (
          <div style={{ background: '#fdfcf9', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(201,168,76,0.15)', paddingBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#665743', fontFamily: 'system-ui, -apple-system, sans-serif' }}>RECENT VISIONS</span>
              <button type="button" onClick={clearHistory} style={{ background: 'none', border: 'none', color: '#c0392b', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'system-ui, -apple-system, sans-serif' }}>Clear</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {history.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => loadFromHistory(item)}
                  style={{ 
                    padding: '0.75rem', background: '#ffffff', border: '1px solid rgba(0,0,0,0.04)', 
                    borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.01)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#c9a84c'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#c9a84c', marginBottom: '0.25rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    <span>{item.date}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#1a1105', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.interpretationData?.title || 'Untitled Vision'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Embedded Animation Keyframe for Voice Recording Pulse */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.85); opacity: 0.5; }
          100% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>

    </div>
  );
}