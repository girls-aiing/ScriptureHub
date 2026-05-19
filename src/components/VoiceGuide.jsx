import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// ─────────────────────────────────────────────────────────────────
// PAGE SCRIPTS & METRIC DATA CONFIGURATION
// ─────────────────────────────────────────────────────────────────
const SCRIPTS = {
  '/':             `Welcome to ScriptureHub — your sacred digital companion. Here on the home page, you will find your verse of the day, quick access to the Bible reader, and your personal growth dashboard. May your time here draw you closer to the Word of God.`,
  '/bible':        `Welcome to the Word. Here in the Bible Reader, you can explore different translations such as the King James Version, the World English Bible, and many more. Use the book and chapter selectors to navigate scripture. You can highlight your favourite verses and save personal notes in your journal.`,
  '/bible/hymns':  `Welcome to the Scripture Hub Hymn Centre. You have access to two magnificent collections. Hymns Ancient and Modern, containing eight hundred and forty seven selections. And Sacred Songs and Solos, the complete twelve hundred piece edition. Use the search bar to find any hymn by number, title, author, or lyric. May every song lift your heart to heaven.`,
  '/bible/hymn-detail': `You are now viewing the full hymn. Press the Listen All button to hear the entire hymn, or press the speaker button beside any section to hear just that part. Press Singing Mode for a beautiful full screen worship experience.`,
  '/quizzes':      `Welcome to the Knowledge Hub. Test and grow your understanding of scripture through carefully crafted Bible quizzes. Choose your difficulty level and challenge yourself to go deeper into the Word.`,
  '/ai':           `Welcome to your AI Scripture Advisor. Ask questions about any verse, request explanations of biblical events, explore theological topics, or simply ask for encouragement.`,
  '/did-you-know': `Welcome to Did You Know — a treasury of biblical secrets. Each card reveals a fascinating fact or surprising truth from scripture. Click any card to reveal its secret.`,
  '/games':        `Welcome to the Spiritual Arcade — where faith meets fun! Here you will find sixteen interactive games designed to strengthen your knowledge of scripture. May you grow in wisdom as you play!`,
  '/community':    `Welcome to the ScriptureHub Community. Share a verse or testimony, earn treasure chest badges, walk the Prophet's Path, and discover hidden Easter eggs filled with ancient wisdom.`,
  '/settings':     `Welcome to Settings. Personalise your ScriptureHub experience. Choose your preferred language, adjust the appearance, set your daily reading goal, and manage your account data.`,
  '/secrets':      `Welcome to Biblical Secrets. Here you will find sixty fascinating secrets hidden within Scripture. Tap any card to flip it and reveal the secret answer. Use the category buttons to explore a specific topic, or search by keyword.`,
  '/values':       `Welcome to Values for Success — the Youth Hub of ScriptureHub. Here you will find nine powerful life values, each combining Bible scriptures with practical real-world advice. Select any value card to explore its scriptures and tips.`,
  '/maps':         `Welcome to Bible Maps and Timelines — where the stories of Scripture come alive geographically and historically. Choose from four interactive maps and click location pins to reveal the biblical story behind every city.`,
  '/search':       `Welcome to AI Deep Search. Simply type how you feel or what you are going through, and the AI will find the most relevant Bible verses for your exact situation. God's Word has an answer for every season of life.`,
  '/prayer':       `Welcome to your Digital Prayer Journal — a private, sacred space between you and God. Write down your prayer requests, organise them by category, and track them over time. Your journal is stored privately on this device only.`,
  '/progress':     `Welcome to your Study Progress page. Track your Bible reading journey, see which books you have completed, and set daily reading goals. Every chapter you read is a step closer to knowing the full counsel of God's Word.`,
  '/games/speedtyper':  `Welcome to Speed Typer! A Bible verse will appear on screen. Type it out as fast and accurately as you can. Your words per minute and accuracy will both be tracked. Take a deep breath and begin when you are ready!`,
  '/games/swipe':       `Welcome to Swipe True or False! I will show you a Bible statement one at a time. Press True if the statement is correct, or False if it is wrong. You have ten questions in total. Trust what you know from the Word!`,
  '/games/fillblank':   `Welcome to Fill the Blank! Each question shows you a Bible verse with one missing word. Choose the correct word from the four options given. May the Word of God be hidden in your heart!`,
  '/games/whoami':      `Welcome to Who Am I! I will give you clues one at a time about a famous Bible character. Try to guess who it is with as few clues as possible. The fewer clues you use, the more points you earn!`,
  '/games/lightning':   `Welcome to Lightning Round — the sixty second Bible blitz! Answer as many Bible trivia questions as you can before the timer runs out. Are you ready? Let us go!`,
  '/games/scramble':    `Welcome to Scripture Scramble! The words of a Bible verse have been shuffled out of order. Click the words one by one in the correct order to rebuild the verse from scratch.`,
  '/games/wordle':      `Welcome to Verse Wordle! Your challenge is to guess a five letter Bible word in six tries or fewer. Use the hint shown at the top to help you find the answer!`,
  '/games/hangman':     `Welcome to Bible Hangman! A hidden biblical word is waiting to be discovered. Guess one letter at a time to reveal the word. You have six wrong guesses before the game ends.`,
  '/games/prophecy':    `Welcome to Prophetic Connections! Match Old Testament prophecies to their New Testament fulfilments. Discover how God's Word connects beautifully across the centuries!`,
  '/games/chronology':  `Welcome to Chronology Challenge! Drag and drop ten Bible events into the correct historical order from earliest to latest.`,
  '/games/emoji':       `Welcome to Emoji Bible! A sequence of emojis represents a well known Bible story. Choose which story the emojis are describing from the four options given.`,
  '/games/nameBook':    `Welcome to Name That Book! I will show you a verse from the Bible. Your challenge is to identify which book of the Bible that verse comes from.`,
  '/games/wisdom':      `Welcome to Wisdom Grid — logic puzzles drawn straight from Scripture! Think carefully before choosing your answer. The fear of the Lord is the beginning of wisdom!`,
  '/games/connections': `Welcome to Daily Connections! Find four groups of four words that each share a hidden biblical connection. Think carefully — some connections are cleverly disguised.`,
  '/games/map':         `Welcome to Biblical Map Quest! Click on the correct spot on the ancient map to identify each sacred location I name. Learn the geography of the Holy Land!`,
  '/games/swordDrill':  `Welcome to Sword Drill! Type the correct Bible reference as fast as you can before the thirty second timer runs out. The Word of God is your sword — draw it quickly!`,
  '/name-dictionary':   `Welcome to the Universal Lexicon. This is a scholarly treasury of historical names. Enter any name from any culture or language into the search archive above to uncover its ancient meanings, phonetic pronunciations, variants, and historical significance.`,
  '/ai/dreams':         `Welcome to the Biblical Dream Interpreter. Simply write down your dream or describe its core symbols in detail. The AI will look through scriptural principles, historical context, and prophetic metaphors to help you discover if your dream carries a divine message.`
}

const SUBPAGE_SCRIPTS = {
  'hymns':        SCRIPTS['/bible/hymns'],
  'hymn-detail':  SCRIPTS['/bible/hymn-detail'],
  'singing-mode': `You are now in Singing Mode — a distraction free worship experience. Use the Previous and Next buttons to move between sections. Press Listen to hear the current section read aloud. Press Exit when you are finished. Sing with all your heart to the Lord!`,
  'books':        `You are back in the Bible Reader. Select a testament, then choose a book and chapter to begin reading.`,
  'dreams':       SCRIPTS['/ai/dreams'],
}

const PAGE_NAMES = {
  '/':               'Home',
  '/bible':          'Bible Reader',
  '/bible/hymns':    'Hymn Centre',
  '/bible/hymn-detail': 'Hymn Detail',
  '/quizzes':       'Knowledge Hub',
  '/ai/dreams':     'Dream Interpreter',
  '/ai':            'AI Consultant',
  '/did-you-know':  'Did You Know',
  '/games':         'Bible Games',
  '/community':     'Community',
  '/settings':      'Settings',
  '/secrets':       'Biblical Secrets',
  '/values':       'Values for Success',
  '/maps':          'Bible Maps',
  '/search':        'AI Deep Search',
  '/prayer':        'Prayer Journal',
  '/progress':      'Study Progress',
  '/games/speedtyper':  'Speed Typer',
  '/games/swipe':       'Swipe True/False',
  '/games/fillblank':   'Fill the Blank',
  '/games/whoami':      'Who Am I?',
  '/games/lightning':   'Lightning Round',
  '/games/scramble':    'Scripture Scramble',
  '/games/wordle':      'Verse Wordle',
  '/games/hangman':     'Bible Hangman',
  '/games/prophecy':    'Prophetic Connections',
  '/games/chronology':  'Chronology Challenge',
  '/games/emoji':       'Emoji Bible',
  '/games/nameBook':    'Name That Book',
  '/games/wisdom':      'Wisdom Grid',
  '/games/connections': 'Daily Connections',
  '/games/map':         'Biblical Map Quest',
  '/games/swordDrill':  'Sword Drill',
  '/name-dictionary':   'Universal Lexicon',
}

const SUBPAGE_NAMES = {
  'hymns':        'Hymn Centre',
  'hymn-detail':  'Hymn Detail',
  'singing-mode': 'Singing Mode',
  'books':        'Bible Reader',
  'dreams':       'Dream Interpreter',
}

const PREFERRED_VOICES = [
  'Microsoft Libby Online (Natural) - English (United Kingdom)',
  'Microsoft Sonia Online (Natural) - English (United Kingdom)',
  'Microsoft Ryan Online (Natural) - English (United Kingdom)',
  'Microsoft Emma Online (Natural) - English (United States)',
  'Microsoft Aria Online (Natural) - English (United States)',
  'Microsoft Jenny Online (Natural) - English (United States)',
  'Microsoft Ava Online (Natural) - English (United States)',
  'Microsoft Andrew Online (Natural) - English (United States)',
  'Microsoft Guy Online (Natural) - English (United States)',
  'Microsoft Brian Online (Natural) - English (United States)',
]

// ─────────────────────────────────────────────────────────────────
// SINGLE GLOBAL ENGINE CONFIG
// ─────────────────────────────────────────────────────────────────
const engine = {
  stopped:   true,
  queue:     [],
  chunkIdx:  0,
  currentId: 0,
}

const getVol = () => parseFloat(localStorage.getItem('scripturehub_voice_volume') ?? '0.85');
const isMuted = () => localStorage.getItem('scripturehub_voice_muted') === 'true';
const isEnabled = () => {
  try {
    const s = JSON.parse(localStorage.getItem('scripturehub_settings') ?? '{}');
    return s.voiceGuide !== false;
  } catch {
    return true;
  }
};

function getBestVoice() {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  for (const name of PREFERRED_VOICES) {
    const v = voices.find(v => v.name === name);
    if (v) return v;
  }
  return voices.find(v => v.lang.startsWith('en-GB')) ||
         voices.find(v => v.lang.startsWith('en')) ||
         voices[0] || null;
}

function splitIntoChunks(text, maxChars = 200) {
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  const chunks = [];
  let current = '';
  for (const s of sentences) {
    if ((current + s).length > maxChars && current.length > 0) {
      chunks.push(current.trim());
      current = s;
    } else {
      current += s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

function engineSpeak(text, onDone) {
  if (!('speechSynthesis' in window)) return;
  if (!text || isMuted() || !isEnabled()) return;

  engine.stopped = true;
  engine.queue   = [];
  try { window.speechSynthesis.cancel(); } catch {}

  setTimeout(() => {
    const id = ++engine.currentId;
    engine.stopped  = false;
    engine.queue    = splitIntoChunks(text);
    engine.chunkIdx = 0;

    function speakNext() {
      if (engine.stopped || id !== engine.currentId) return;
      if (engine.chunkIdx >= engine.queue.length) {
        if (onDone) onDone();
        return;
      }
      const chunk = engine.queue[engine.chunkIdx];
      const utter = new SpeechSynthesisUtterance(chunk);
      const voice = getBestVoice();
      if (voice) utter.voice = voice;
      utter.rate   = 0.88;
      utter.pitch  = 1.0;
      utter.volume = getVol();

      utter.onend = () => {
        if (engine.stopped || id !== engine.currentId) return;
        engine.chunkIdx++;
        speakNext();
      };
      utter.onerror = (e) => {
        if (e.error === 'interrupted' || engine.stopped || id !== engine.currentId) return;
        engine.chunkIdx++;
        setTimeout(speakNext, 150);
      };
      try { window.speechSynthesis.speak(utter); } catch {}
    }

    if (window.speechSynthesis.getVoices().length > 0) {
      speakNext();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        speakNext();
      };
    }
  }, 80);
}

function engineStop() {
  engine.stopped = true;
  engine.queue   = [];
  engine.currentId++;
  try { window.speechSynthesis.cancel(); } catch {}
}

// ─────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────
export function speakText(text) { engineSpeak(text); }
export function stopVoiceGuide() { engineStop(); }
export function replayVoiceGuide(path) {
  const text = SCRIPTS[path] || SCRIPTS[Object.keys(SCRIPTS).find(k => path.startsWith(k) && k !== '/') || ''];
  if (text) engineSpeak(text);
}
export function announceHymnView(subpage) {
  const text = SUBPAGE_SCRIPTS[subpage];
  if (text) engineSpeak(text);
}

// ─────────────────────────────────────────────────────────────────
// MAIN VOICE GUIDE SYSTEM RUNTIME COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function VoiceGuide() {
  const location = useLocation();

  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(() => isMuted());
  const [volume, setVolume] = useState(() => getVol());
  const [showPanel, setShowPanel] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [currentLabel, setCurrentLabel] = useState('');

  const [pos, setPos] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('scripturehub_vg_pos') ?? 'null');
      if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') return saved;
    } catch {}
    return { x: window.innerWidth - 80, y: window.innerHeight - 160 };
  });
  const [dragging, setDragging] = useState(false);

  const dragStart = useRef(null);
  const prevPath = useRef(null);
  const pollRef = useRef(null);
  const hideRef = useRef(null);
  const replayText = useRef('');
  const unlockedRef = useRef(false);
  const activeSubpage = useRef(null);
  
  // Track deep paths that have fired speech on this unique entry visit cycle
  const completedVisits = useRef(new Set());

  useEffect(() => { unlockedRef.current = unlocked; }, [unlocked]);

  const getScript = (path) => {
    if (SCRIPTS[path]) return SCRIPTS[path];
    if ((path.startsWith('/ai/') && path !== '/ai/dreams' && path !== '/ai') || (path.startsWith('/bible/') && path !== '/bible')) return null;
    const key = Object.keys(SCRIPTS)
      .filter(k => k !== '/' && path.startsWith(k))
      .sort((a, b) => b.length - a.length)[0];
    return key ? SCRIPTS[key] : null;
  };

  const speakPage = (path) => {
    const text = getScript(path);
    if (!text) return;
    replayText.current = text;
    setCurrentLabel(PAGE_NAMES[path] || 'ScriptureHub');
    engineSpeak(text);
  };

  useEffect(() => {
    localStorage.setItem('scripturehub_vg_pos', JSON.stringify(pos));
  }, [pos]);

  useEffect(() => {
    const onResize = () => setPos(p => ({
      x: Math.min(p.x, window.innerWidth - 60),
      y: Math.min(p.y, window.innerHeight - 60),
    }));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onSubpage = (e) => {
      const subpage = e.detail;
      activeSubpage.current = subpage;
      
      const text = SUBPAGE_SCRIPTS[subpage];
      const label = SUBPAGE_NAMES[subpage] || 'Bible Reader';
      
      engineStop();
      
      if (!text || isMuted() || !isEnabled()) return;
      replayText.current = text;
      setCurrentLabel(label);
      
      if (unlockedRef.current) {
        setTimeout(() => {
          if (activeSubpage.current === subpage) {
            engineSpeak(text);
          }
        }, 150);
      }
    };
    window.addEventListener('vg:subpage', onSubpage);
    return () => window.removeEventListener('vg:subpage', onSubpage);
  }, []);

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    e.preventDefault();
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: pos.x, oy: pos.y };
    setDragging(true);
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!dragStart.current) return;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 60, dragStart.current.ox + (e.clientX - dragStart.current.mx))),
        y: Math.max(0, Math.min(window.innerHeight - 60, dragStart.current.oy + (e.clientY - dragStart.current.my))),
      });
    };
    const handlePointerUp = () => {
      dragStart.current = null;
      setDragging(false);
    };

    if (dragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragging]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const initialPath = location.pathname;
    prevPath.current = initialPath;

    const silent = new SpeechSynthesisUtterance(' ');
    silent.volume = 0;
    let resolved = false;
    const unlockAudio = () => {
      if (resolved) return;
      resolved = true;
      setUnlocked(true);
      if (isMuted() || !isEnabled()) return;
      
      if (initialPath === '/ai/dreams') {
        completedVisits.current.add('/ai/dreams');
      }
      setTimeout(() => speakPage(initialPath), 500);
    };

    silent.onend = unlockAudio;
    silent.onerror = () => {
      const events = ['click', 'keydown', 'pointerup', 'scroll'];
      const autoUnlockHandler = () => {
        events.forEach(ev => document.removeEventListener(ev, autoUnlockHandler));
        unlockAudio();
      };
      events.forEach(ev => document.addEventListener(ev, autoUnlockHandler, { once: true }));
    };
    try { window.speechSynthesis.cancel(); window.speechSynthesis.speak(silent); }
    catch { silent.onerror(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (prevPath.current === null || path === prevPath.current) return;
    prevPath.current = path;

    engineStop();
    if (muted || !unlockedRef.current || !isEnabled()) return;

    // Direct targeted execution strategy for Dream Interpreter path
    if (path === '/ai/dreams') {
      activeSubpage.current = null;
      if (!completedVisits.current.has(path)) {
        completedVisits.current.add(path);
        const routeTimeout = setTimeout(() => speakPage(path), 250);
        return () => clearTimeout(routeTimeout);
      }
      return; 
    }

    // Reset lock logic when user navigates completely away from the functional subpath
    if (path !== '/ai/dreams') {
      completedVisits.current.delete('/ai/dreams');
    }

    // Direct routing parameters ignore generic deep child routes
    if ((path.startsWith('/ai/') && path !== '/ai') || (path.startsWith('/bible/') && path !== '/bible') || path.split('/').filter(Boolean).length > 1) {
      return;
    }

    activeSubpage.current = null;
    const routeTimeout = setTimeout(() => speakPage(path), 250);
    return () => clearTimeout(routeTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, muted]);

  useEffect(() => {
    pollRef.current = setInterval(() => {
      if ('speechSynthesis' in window) {
        setSpeaking(window.speechSynthesis.speaking && !window.speechSynthesis.paused);
        setPaused(window.speechSynthesis.paused);
      }
    }, 250);
    return () => {
      clearInterval(pollRef.current);
      engineStop();
      clearTimeout(hideRef.current);
    };
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    localStorage.setItem('scripturehub_voice_muted', String(next));
    if (next) engineStop();
    else setTimeout(() => speakPage(location.pathname), 300);
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    localStorage.setItem('scripturehub_voice_volume', String(val));
  };

  const handlePlayPause = () => {
    if (!('speechSynthesis' in window)) return;
    if (paused) { window.speechSynthesis.resume(); setPaused(false); }
    else if (speaking) { window.speechSynthesis.pause(); setPaused(true); }
    else if (replayText.current) { engineSpeak(replayText.current); }
  };

  const handleStop = () => {
    engineStop(); setSpeaking(false); setPaused(false); setShowPanel(false);
  };

  const handleReplay = () => {
    if (replayText.current) engineSpeak(replayText.current);
    else speakPage(location.pathname);
    setShowPanel(false);
  };

  if (!('speechSynthesis' in window)) return null;

  const accent = (() => {
    try { return JSON.parse(localStorage.getItem('scripturehub_settings') ?? '{}').accentColor || '#c9a84c'; }
    catch { return '#c9a84c'; }
  })();

  const pageName = currentLabel || PAGE_NAMES[location.pathname] || 'ScriptureHub';
  const isActive = speaking || paused;

  return (
    <>
      <style>{`
        @keyframes vg-bar {
          0%,100% { transform: scaleY(0.35); }
          50%      { transform: scaleY(1.0);  }
        }
        @keyframes vg-in {
          from { opacity:0; transform:translateY(8px) scale(0.97); }
          to   { opacity:1; transform:translateY(0)   scale(1);    }
        }
        .vg-widget {
          position: fixed; z-index: 9998;
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 0.45rem;
          font-family: Georgia, serif; user-select: none;
          touch-action: none;
        }
        .vg-drag-handle {
          width: 100%; display: flex; justify-content: center;
          align-items: center; padding: 4px 0 2px;
          cursor: grab; opacity: 0.4; transition: opacity 0.2s;
        }
        .vg-drag-handle:hover { opacity: 1; }
        .vg-widget.dragging { cursor: grabbing !important; }
        .vg-widget.dragging * { cursor: grabbing !important; }
        .vg-ctrl-btn { transition: opacity 0.18s, transform 0.18s; }
        .vg-ctrl-btn:hover { opacity: 0.85; transform: scale(1.08); }
      `}</style>

      <div
        className={`vg-widget${dragging ? ' dragging' : ''}`}
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      >
        <div
          className="vg-drag-handle"
          onPointerDown={handlePointerDown}
          title="Drag to move"
        >
          <div style={{ display:'flex', flexDirection:'column', gap:'3px' }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                display:'block', width:'18px', height:'2px',
                background:'#c9a84c', borderRadius:'2px',
              }} />
            ))}
          </div>
        </div>

        {isActive && (
          <div style={{
            background:'rgba(10,5,2,0.97)', border:`1px solid ${accent}88`,
            borderRadius:'16px', padding:'0.9rem 1.1rem',
            minWidth:'260px', maxWidth:'310px',
            boxShadow:'0 8px 40px rgba(0,0,0,0.65)', animation:'vg-in 0.28s ease',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.65rem', marginBottom:'0.8rem' }}>
              <div style={{ display:'flex', alignItems:'flex-end', gap:'2px', height:'20px', flexShrink:0 }}>
                {[0.5, 0.9, 1.0, 0.7, 0.4].map((h, i) => (
                  <span key={i} style={{
                    display:'inline-block', width:'3px', height:`${h * 20}px`,
                    borderRadius:'99px', background:accent, transformOrigin:'bottom',
                    animation: speaking ? `vg-bar ${0.45 + i * 0.08}s ease-in-out infinite` : 'none',
                    animationDelay:`${i * 0.09}s`,
                    opacity: speaking ? 1 : 0.25, transition:'opacity 0.3s',
                  }} />
                ))}
              </div>
              <div style={{ flex:1 }}>
                <p style={{ color:accent, fontSize:'0.66rem', fontWeight:'800', margin:0, textTransform:'uppercase', letterSpacing:'0.1em' }}>
                  Voice Guide
                </p>
                <p style={{ color:'#f5ead8', fontSize:'0.86rem', fontWeight:'600', margin:0 }}>
                  {paused ? '⏸ Paused' : pageName}
                </p>
              </div>
            </div>
            <div style={{ display:'flex', gap:'0.45rem', alignItems:'center' }}>
              <CtrlBtn onClick={handlePlayPause} color={accent} title={paused ? 'Resume' : 'Pause'}>
                {paused ? '▶' : '⏸'}
              </CtrlBtn>
              <CtrlBtn onClick={handleStop} color="#e74c3c" title="Stop">⏹</CtrlBtn>
              <input
                type="range" min="0" max="1" step="0.05"
                value={volume} onChange={handleVolume}
                style={{ flex:1, accentColor:accent, cursor:'pointer' }}
              />
              <span style={{ color:accent, fontSize:'0.72rem', fontWeight:'800', minWidth:'32px', textAlign:'right' }}>
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        )}

        {showPanel && !isActive && (
          <div
            onMouseEnter={() => clearTimeout(hideRef.current)}
            onMouseLeave={() => { hideRef.current = setTimeout(() => setShowPanel(false), 400); }}
            style={{
              background:'rgba(10,5,2,0.97)', border:`1px solid rgba(201,168,76,0.4)`,
              borderRadius:'14px', padding:'0.95rem 1.1rem',
              minWidth:'235px', boxShadow:'0 8px 40px rgba(0,0,0,0.6)',
              animation:'vg-in 0.22s ease',
            }}
          >
            <p style={{ color:accent, fontSize:'0.7rem', fontWeight:'800', margin:'0 0 0.7rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>
              Voice Guide
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.7rem' }}>
              <span style={{ color:'#c8b89a', fontSize:'0.8rem', fontWeight:'600', minWidth:'62px' }}>🔊 Volume</span>
              <input
                type="range" min="0" max="1" step="0.05"
                value={volume} onChange={handleVolume}
                style={{ flex:1, accentColor:accent, cursor:'pointer' }}
              />
              <span style={{ color:accent, fontSize:'0.75rem', fontWeight:'800', minWidth:'32px', textAlign:'right' }}>
                {Math.round(volume * 100)}%
              </span>
            </div>
            <button onClick={handleReplay} style={{
              width:'100%', padding:'0.5rem',
              background:accent+'22', border:`1px solid ${accent}55`,
              borderRadius:'8px', color:accent,
              fontSize:'0.8rem', fontWeight:'700',
              cursor:'pointer', fontFamily:'Georgia,serif',
            }}>
              🔁 Replay This Page
            </button>
          </div>
        )}

        <button
          onClick={toggleMute}
          onMouseEnter={() => { clearTimeout(hideRef.current); if (!isActive) setShowPanel(true); }}
          onMouseLeave={() => { hideRef.current = setTimeout(() => setShowPanel(false), 1000); }}
          title={muted ? 'Voice Guide is muted — click to unmute' : 'Click to mute Voice Guide'}
          style={{
            background:'rgba(10,5,2,0.88)',
            border:`1px solid ${muted ? 'rgba(231,76,60,0.55)' : `${accent}44`}`,
            borderRadius:'999px', padding:'0.28rem 0.85rem',
            color: muted ? '#e74c3c' : accent,
            fontSize:'0.68rem', fontWeight:'800', cursor:'pointer',
            fontFamily:'Georgia,serif', backdropFilter:'blur(12px)',
            letterSpacing:'0.06em', transition:'all 0.2s',
            display:'flex', alignItems:'center', gap:'0.35rem',
          }}
        >
          <span style={{
            display:'inline-block', width:'6px', height:'6px', borderRadius:'50%',
            background:  muted ? '#e74c3c' : (speaking ? accent : `${accent}88`),
            boxShadow:   speaking && !muted ? `0 0 6px ${accent}` : 'none',
            transition:  'all 0.3s',
          }} />
          {muted ? 'VOICE OFF' : speaking ? 'PLAYING' : paused ? 'PAUSED' : 'VOICE ON'}
        </button>
      </div>
    </>
  );
}

function CtrlBtn({ onClick, color, title, children }) {
  return (
    <button onClick={onClick} title={title} className="vg-ctrl-btn" style={{
      width:'32px', height:'32px', borderRadius:'8px', flexShrink:0,
      background:color+'22', border:`1px solid ${color}`, color,
      fontSize:'0.85rem', cursor:'pointer',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:'Georgia,serif',
    }}>
      {children}
    </button>
  );
}