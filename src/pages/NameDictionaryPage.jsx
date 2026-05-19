import { useState, useCallback, useEffect } from "react";

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

  // NEW: Triggers the Voice Guide welcome sequence on page mount
  useEffect(() => {
    // This empty effect ensures that the global VoiceGuide component 
    // detects the route change and plays the corresponding path script.
    window.scrollTo(0, 0);
  }, []);

  const searchName = useCallback(async (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.3,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: `Examine the name: ${trimmed}` }],
          response_format: { type: "json_object" }
        }),
      });
      const data = await response.json();
      const parsed = JSON.parse(data.choices[0].message.content);
      setResult(parsed);
    } catch (err) {
      setError("The archives are currently unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div style={styles.bookContainer}>
      <style>{webFonts}</style>

      {/* --- Book Header --- */}
      <div style={styles.bookHeader}>
        <h1 style={styles.bookTitle}>The Universal Lexicon</h1>
        <p style={styles.bookSubtitle}>A scholarly treasury of names and their ancient origins</p>
        <div style={styles.goldDivider}>✦ ✦ ✦</div>
      </div>

      {/* --- Search Quill Section --- */}
      <form onSubmit={(e) => { e.preventDefault(); searchName(query); }} style={styles.searchSection}>
        <div style={styles.inputWrapper}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a name to examine..."
            style={styles.quillInput}
          />
          <button type="submit" disabled={loading} style={styles.examineBtn}>
            {loading ? "Consulting Archives..." : "Examine Name"}
          </button>
        </div>
        <div style={styles.tagRow}>
          {PLACEHOLDER_NAMES.map(n => (
            <span key={n} onClick={() => { setQuery(n); searchName(n); }} style={styles.miniTag}>{n}</span>
          ))}
        </div>
      </form>

      {/* --- Result Page --- */}
      {result && (
        <div style={styles.pagePaper}>
          <div style={styles.pageInner}>
            
            <div style={styles.nameHeader}>
              <span style={styles.dropCap}>{result.name.charAt(0)}</span>
              <div>
                <h2 style={styles.entryName}>{result.name}</h2>
                <p style={styles.entryPronounce}>{result.pronunciation} — {result.origin.language}</p>
              </div>
            </div>

            <p style={styles.entryMeaning}>{result.meaning}</p>

            <div style={styles.originGrid}>
              <div style={styles.originBox}><strong>Language:</strong> {result.origin.language}</div>
              <div style={styles.originBox}><strong>Culture:</strong> {result.origin.culture}</div>
              <div style={styles.originBox}><strong>Era:</strong> {result.origin.period}</div>
            </div>

            {result.biblicalConnection && (
              <div style={styles.scriptureNote}>
                <h4 style={styles.noteTitle}>Scriptural Context</h4>
                <p>{result.biblicalConnection}</p>
              </div>
            )}

            <div style={styles.footerInfo}>
              <strong>Historical Bearers:</strong> {result.famousBearers.join(", ")}
            </div>

            {/* Steps as Book Chapters */}
            <div style={styles.chapterSection}>
                <h3 style={styles.chapterHeading}>Etymological Breakdown</h3>
                {result.steps.map((s, i) => (
                    <div key={i} style={styles.chapterItem}>
                        <h4 style={styles.chapterSub}>Chapter {i+1}: {s.title}</h4>
                        <p style={styles.chapterText}>{s.detail}</p>
                    </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={{ color: "#e74c3c", textAlign: "center", margin: "1.5rem 0", fontSize: "1.1rem" }}>
          {error}
        </div>
      )}

      {!result && !loading && !error && (
        <div style={styles.emptyState}>
          <div style={styles.bigIcon}>📜</div>
          <p>The pages are blank. Enter a name above to begin your study.</p>
        </div>
      )}
    </div>
  );
}

const webFonts = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
`;

const styles = {
  bookContainer: {
    maxWidth: "850px",
    margin: "2rem auto",
    padding: "3rem",
    backgroundColor: "#2c1e14",
    borderRadius: "15px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.8), inset 0 0 100px rgba(0,0,0,0.5)",
    minHeight: "90vh",
    fontFamily: "'Crimson Text', serif",
    color: "#f3e5ab"
  },
  bookHeader: {
    textAlign: "center",
    marginBottom: "3rem"
  },
  bookTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "3.5rem",
    color: "#d4af37",
    margin: 0,
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
  },
  bookSubtitle: {
    fontSize: "1.2rem",
    fontStyle: "italic",
    opacity: 0.8
  },
  goldDivider: {
    color: "#d4af37",
    fontSize: "1.5rem",
    marginTop: "1rem"
  },
  searchSection: {
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: "2rem",
    borderRadius: "10px",
    marginBottom: "3rem",
    border: "1px solid #4a3728"
  },
  inputWrapper: {
    display: "flex",
    gap: "10px"
  },
  quillInput: {
    flex: 1,
    background: "#fdf6e3",
    border: "2px solid #af9444",
    padding: "12px 20px",
    fontSize: "1.2rem",
    borderRadius: "5px",
    fontFamily: "'Crimson Text', serif",
    color: "#2c1e14"
  },
  examineBtn: {
    padding: "12px 25px",
    backgroundColor: "#d4af37",
    color: "#2c1e14",
    border: "none",
    fontWeight: "bold",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem"
  },
  tagRow: {
    marginTop: "1rem",
    display: "flex",
    gap: "10px",
    justifyContent: "center"
  },
  miniTag: {
    fontSize: "0.9rem",
    color: "#d4af37",
    cursor: "pointer",
    textDecoration: "underline"
  },
  pagePaper: {
    background: "#fdf6e3",
    backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)",
    padding: "3rem",
    color: "#2c1e14",
    borderRadius: "3px",
    position: "relative",
    boxShadow: "5px 5px 15px rgba(0,0,0,0.3)",
    transform: "rotate(-0.5deg)"
  },
  pageInner: {
    border: "1px solid rgba(0,0,0,0.1)",
    padding: "2rem"
  },
  nameHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "1.5rem"
  },
  dropCap: {
    fontSize: "5rem",
    fontFamily: "'Playfair Display', serif",
    lineHeight: "1",
    color: "#8b0000",
    fontWeight: "bold"
  },
  entryName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "2.8rem",
    margin: 0,
    letterSpacing: "2px"
  },
  entryPronounce: {
    fontStyle: "italic",
    fontSize: "1.1rem",
    color: "#555"
  },
  entryMeaning: {
    fontSize: "1.4rem",
    lineHeight: "1.6",
    marginBottom: "2rem",
    textAlign: "justify"
  },
  originGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    borderTop: "2px solid #2c1e14",
    borderBottom: "2px solid #2c1e14",
    padding: "1rem 0",
    marginBottom: "2rem"
  },
  originBox: {
    fontSize: "1.1rem"
  },
  scriptureNote: {
    backgroundColor: "rgba(139, 0, 0, 0.05)",
    padding: "1.5rem",
    borderLeft: "4px solid #8b0000",
    marginBottom: "2rem"
  },
  noteTitle: {
    margin: "0 0 0.5rem 0",
    color: "#8b0000",
    fontSize: "1.2rem"
  },
  chapterSection: {
    marginTop: "3rem"
  },
  chapterHeading: {
    fontFamily: "'Playfair Display', serif",
    textAlign: "center",
    borderBottom: "1px solid #ccc",
    paddingBottom: "10px",
    marginBottom: "2rem"
  },
  chapterItem: {
    marginBottom: "2rem"
  },
  chapterSub: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    margin: "0 0 5px 0"
  },
  chapterText: {
    fontSize: "1.1rem",
    lineHeight: "1.5",
    color: "#444"
  },
  footerInfo: {
    fontSize: "1.1rem",
    marginTop: "1rem",
    borderTop: "1px dashed rgba(0,0,0,0.1)",
    paddingTop: "1rem"
  },
  emptyState: {
    textAlign: "center",
    padding: "5rem",
    opacity: 0.6
  },
  bigIcon: {
    fontSize: "5rem",
    marginBottom: "1rem"
  }
};