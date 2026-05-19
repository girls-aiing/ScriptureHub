import { useState, useCallback, useEffect, useRef } from "react";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const SYSTEM_PROMPT = `You are a Chief Lexicographer for a world-renowned name encyclopedia. 
Analyze the name provided and return a valid JSON object. 
Ensure the "meaning" sounds scholarly and literary. 
Structure:
{
  "name": "string",
  "meaning": "Scholarly description",
  "origin": { "language": "string", "culture": "string", "period": "string" },
  "pronunciation": "string",
  "variants": ["string"],
  "famousBearers": ["string"],
  "biblicalConnection": "string or null",
  "steps": [ { "title": "string", "detail": "string" } ]
}`;

const PLACEHOLDER_NAMES = ["Samuel", "Adah", "Immanuel", "Keturah", "Zion"];

export default function NameDictionaryPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedStep, setExpandedStep] = useState(0);

  // Microphone state handles
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Text To Speech Audio Player Generation state handles
  const [isSpeaking, setIsSpeaking] = useState(false);
  const activeAudioRef = useRef(null);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('vg:subpage', { detail: 'names' }));
  }, []);

  // START AUDIO RECORDING
  const startRecording = async () => {
    setError("");
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
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        stream.getTracks().forEach((track) => track.stop());
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access error:", err);
      setError("Unable to access microphone. Please confirm browser permissions.");
    }
  };

  // STOP AUDIO RECORDING
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // WHISPER SPEECH TRANSCRIPTION
  const transcribeAudio = async (audioBlob) => {
    setTranscribing(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "name_input.wav");
      formData.append("model", "whisper-large-v3");

      const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${API_KEY}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Audio transcription service failed.");

      const data = await response.json();
      if (data.text) {
        const transcribedName = data.text.replace(/[.#,?!]/g, "").trim();
        setQuery(transcribedName);
      } else {
        setError("No clear speech detected. Please speak closer to your microphone.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to convert speech to text. Please try typing the name manually.");
    } finally {
      setTranscribing(false);
    }
  };

  // NEW: GENERATE AI TEXT TO SPEECH AUDIO FOR PRONUNCIATION
  const speakName = async (nameToSpeak) => {
    if (!nameToSpeak || !nameToSpeak.trim()) return;
    
    // Stop any currently playing pronunciation sound
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
    }

    setIsSpeaking(true);
    setError("");

    try {
      // Using OpenAI/Groq standard TTS structure to generate custom spoken voice file
      const response = await fetch("https://api.groq.com/openai/v1/audio/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "tts-1",
          input: nameToSpeak,
          voice: "alloy" // balanced crisp pronounciation voice
        })
      });

      if (!response.ok) {
        throw new Error("AI Pronunciation Generation failed. Falling back to native local synth.");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      activeAudioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
      };
      
      await audio.play();
    } catch (err) {
      console.warn("TTS API Error - Triggering high quality Web Speech Synth alternative:", err);
      // Fallback seamlessly to native web browser voice synthesizer if offline or rate-limited
      try {
        const utterance = new SpeechSynthesisUtterance(nameToSpeak);
        utterance.rate = 0.85; // slightly slower cadence for high-clarity linguistic phonetics
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } catch (synthErr) {
        setIsSpeaking(false);
        setError("Linguistic audio translation engine is currently unavailable.");
      }
    }
  };

  const handleSearch = useCallback(async (targetQuery) => {
    const activeQuery = targetQuery || query;
    if (!activeQuery.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);
    setExpandedStep(0);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Analyze the name: "${activeQuery}"` },
          ],
          temperature: 0.3,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) throw new Error("Server responded with an error.");

      const rawJson = await response.json();
      const content = JSON.parse(rawJson.choices[0].message.content);
      setResult(content);
    } catch (err) {
      setError("Failed to retrieve name analysis. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Etymology & Name Lexicon</h1>
      <p style={styles.subtitle}>
        Discover the profound origins, variant paths, and scriptural weights behind chosen names.
      </p>

      <div style={styles.searchBox}>
        <div style={{ display: "flex", gap: "0.5rem", width: "100%", alignItems: "center" }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={isRecording ? "Listening to your voice..." : "Enter or speak a name..."}
            disabled={isRecording}
            style={{
              ...styles.input,
              borderColor: isRecording ? "#c0392b" : "#2c1e14",
              backgroundColor: isRecording ? "rgba(192,57,43,0.02)" : "#fff"
            }}
          />

          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={transcribing || loading}
              title="Record voice input"
              style={{ ...styles.micButton, opacity: transcribing ? 0.6 : 1 }}
            >
              🎙️ {transcribing && "..."}
            </button>
          ) : (
            <button onClick={stopRecording} title="Stop recording" style={styles.stopMicButton}>
              🛑
            </button>
          )}

          <button onClick={() => handleSearch()} disabled={loading || isRecording} style={styles.button}>
            {loading ? "Analyzing..." : "Examine"}
          </button>
        </div>

        <div style={styles.suggestionsContainer}>
          <span style={{ fontSize: "0.9rem", color: "#666" }}>Inspirations: </span>
          {PLACEHOLDER_NAMES.map((name) => (
            <button
              key={name}
              onClick={() => {
                setQuery(name);
                handleSearch(name);
              }}
              disabled={loading || isRecording}
              style={styles.chip}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {error && <div style={styles.errorCard}>⚠️ {error}</div>}

      {result && (
        <div style={styles.resultContainer}>
          <div style={styles.entryHeader}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
              <h2 style={styles.entryTitle}>{result.name}</h2>
              
              {/* TEXT TO SPEECH AI SPEAKER TRIGGER */}
              <button
                onClick={() => speakName(result.name)}
                disabled={isSpeaking}
                title="Listen to AI Pronunciation"
                style={{
                  ...styles.speakerButton,
                  backgroundColor: isSpeaking ? "#2c1e14" : "#f5ece3",
                  color: isSpeaking ? "#fff" : "#2c1e14"
                }}
              >
                {isSpeaking ? "🔊 Playing..." : "🔊 Pronounce"}
              </button>
            </div>
            <span style={styles.pronunciation}>/ {result.pronunciation} /</span>
          </div>

          <div style={styles.originGrid}>
            <div style={styles.originBox}>
              <strong>Language:</strong> {result.origin.language}
            </div>
            <div style={styles.originBox}>
              <strong>Culture:</strong> {result.origin.culture}
            </div>
            <div style={styles.originBox}>
              <strong>Era Period:</strong> {result.origin.period}
            </div>
          </div>

          <p style={styles.entryMeaning}>{result.meaning}</p>

          {result.biblicalConnection && (
            <div style={styles.scriptureNote}>
              <h4 style={styles.noteTitle}>Scriptural Profile</h4>
              <p style={{ margin: 0, fontSize: "1.1rem", lineHeight: "1.6" }}>{result.biblicalConnection}</p>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
            <div>
              <h3 style={styles.subHeading}>Morphological Variants</h3>
              <ul style={styles.list}>
                {result.variants.map((v, i) => (
                  <li key={i} style={styles.listItem}>{v}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={styles.subHeading}>Notable Chronological Bearers</h3>
              <ul style={styles.list}>
                {result.famousBearers.map((b, i) => (
                  <li key={i} style={styles.listItem}>{b}</li>
                ))}
              </ul>
            </div>
          </div>

          {result.steps && result.steps.length > 0 && (
            <div style={styles.chapterSection}>
              <h3 style={styles.chapterHeading}>Lexical Breakdown & Analysis</h3>
              <div style={styles.accordionContainer}>
                {result.steps.map((step, index) => {
                  const isExpanded = expandedStep === index;
                  return (
                    <div key={index} style={styles.accordionItem}>
                      <button onClick={() => setExpandedStep(index)} style={styles.accordionHeader}>
                        <span style={styles.accordionTitle}>
                          {index + 1}. {step.title}
                        </span>
                        <span>{isExpanded ? "▲" : "▼"}</span>
                      </button>
                      {isExpanded && <div style={styles.accordionContent}>{step.detail}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "960px",
    margin: "4rem auto",
    padding: "0 2rem",
    fontFamily: "'Georgia', serif",
    color: "#2c1e14",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "3rem",
    textAlign: "center",
    marginBottom: "0.5rem",
    fontWeight: "normal",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: "1.2rem",
    marginBottom: "3rem",
  },
  searchBox: {
    backgroundColor: "#fbf9f6",
    border: "2px solid #2c1e14",
    padding: "2rem",
    borderRadius: "4px",
    marginBottom: "3rem",
    boxShadow: "4px 4px 0px #2c1e14",
  },
  input: {
    flex: 1,
    padding: "1rem",
    fontSize: "1.2rem",
    fontFamily: "inherit",
    border: "2px solid #2c1e14",
    borderRadius: "2px",
    outline: "none",
    transition: "all 0.2s"
  },
  micButton: {
    padding: "0 1.2rem",
    fontSize: "1.3rem",
    height: "54px",
    cursor: "pointer",
    backgroundColor: "#f5ece3",
    border: "2px solid #2c1e14",
    borderRadius: "2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  },
  stopMicButton: {
    padding: "0 1.2rem",
    fontSize: "1.3rem",
    height: "54px",
    cursor: "pointer",
    backgroundColor: "#c0392b",
    border: "2px solid #2c1e14",
    borderRadius: "2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 8px rgba(192,57,43,0.4)",
  },
  speakerButton: {
    padding: "0.4rem 1rem",
    fontSize: "0.9rem",
    fontWeight: "600",
    border: "1px dashed #2c1e14",
    borderRadius: "20px",
    cursor: "pointer",
    fontFamily: "system-ui, sans-serif",
    transition: "all 0.2s",
    display: "inline-flex",
    alignItems: "center"
  },
  button: {
    backgroundColor: "#2c1e14",
    color: "#fff",
    border: "none",
    padding: "1rem 2rem",
    fontSize: "1.2rem",
    fontFamily: "inherit",
    cursor: "pointer",
    borderRadius: "2px",
    height: "54px",
  },
  suggestionsContainer: {
    marginTop: "1.2rem",
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: "transparent",
    border: "1px dashed #2c1e14",
    padding: "0.4rem 0.8rem",
    fontFamily: "inherit",
    cursor: "pointer",
    fontSize: "0.95rem",
    borderRadius: "2px",
  },
  errorCard: {
    backgroundColor: "#fdf2f2",
    color: "#b91c1c",
    padding: "1rem",
    borderRadius: "4px",
    marginBottom: "2rem",
    fontFamily: "system-ui, sans-serif",
    border: "1px solid #fca5a5",
  },
  resultContainer: {
    marginTop: "2rem",
  },
  entryHeader: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  entryTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "3.5rem",
    margin: "0",
    fontWeight: "normal",
  },
  pronunciation: {
    fontStyle: "italic",
    fontSize: "1.1rem",
    color: "#555",
    display: "block",
    marginTop: "0.5rem"
  },
  entryMeaning: {
    fontSize: "1.4rem",
    lineHeight: "1.6",
    marginBottom: "2rem",
    textAlign: "justify",
  },
  originGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    borderTop: "2px solid #2c1e14",
    borderBottom: "2px solid #2c1e14",
    padding: "1rem 0",
    marginBottom: "2rem",
  },
  originBox: {
    fontSize: "1.1rem",
  },
  scriptureNote: {
    backgroundColor: "rgba(139, 0, 0, 0.05)",
    padding: "1.5rem",
    borderLeft: "4px solid #8b0000",
    marginBottom: "2rem",
  },
  noteTitle: {
    margin: "0 0 0.5rem 0",
    color: "#8b0000",
    fontSize: "1.2rem",
  },
  subHeading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.5rem",
    borderBottom: "1px solid #2c1e14",
    paddingBottom: "0.5rem",
    fontWeight: "normal",
  },
  list: {
    paddingLeft: "1.2rem",
    lineHeight: "1.8",
  },
  listItem: {
    fontSize: "1.1rem",
    marginBottom: "0.4rem",
  },
  chapterSection: {
    marginTop: "3rem",
  },
  chapterHeading: {
    fontFamily: "'Playfair Display', serif",
    textAlign: "center",
    borderBottom: "1px solid #2c1e14",
    paddingBottom: "0.75rem",
    marginBottom: "2rem",
    fontSize: "1.8rem",
    fontWeight: "normal",
  },
  accordionContainer: {
    border: "1px solid #2c1e14",
    borderRadius: "2px",
  },
  accordionItem: {
    borderBottom: "1px solid #2c1e14",
  },
  accordionHeader: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.2rem",
    backgroundColor: "#fbf9f6",
    border: "none",
    textAlign: "left",
    fontFamily: "inherit",
    fontSize: "1.15rem",
    cursor: "pointer",
  },
  accordionTitle: {
    fontWeight: "bold",
  },
  accordionContent: {
    padding: "1.5rem",
    backgroundColor: "#fff",
    lineHeight: "1.6",
    fontSize: "1.1rem",
    borderTop: "1px dashed #2c1e14",
  },
};