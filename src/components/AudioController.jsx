import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { playPageTurn } from '../hooks/useSound.js'

function loadVal(key, fallback) {
  try { return localStorage.getItem(key) ?? String(fallback) }
  catch { return String(fallback) }
}

let sharedCtx = null
function getSharedCtx() {
  try {
    if (!sharedCtx) sharedCtx = new (window.AudioContext || window.webkitAudioContext)()
    return sharedCtx
  } catch { return null }
}

async function unlockAudioContext() {
  const ctx = getSharedCtx()
  if (!ctx) return false
  if (ctx.state === 'running') return true
  try {
    await ctx.resume()
    const buf = ctx.createBuffer(1, 1, 22050)
    const src = ctx.createBufferSource()
    src.buffer = buf; src.connect(ctx.destination); src.start(0)
    return ctx.state === 'running'
  } catch { return false }
}

// ── Saved position helpers ────────────────────────────────────
function getDefaultPos() {
  return { x: 24, y: window.innerHeight - 160 }
}
function getSavedPos() {
  try {
    const saved = JSON.parse(localStorage.getItem('scripturehub_ac_pos') ?? 'null')
    if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') return saved
  } catch {}
  return getDefaultPos()
}

export default function AudioController() {
  const [muted,   setMuted]   = useState(() => loadVal('scripturehub_muted',  'false') === 'true')
  const [volume,  setVolume]  = useState(() => parseFloat(loadVal('scripturehub_volume', '0.8')))
  const [visible, setVisible] = useState(false)
  const [pulse,   setPulse]   = useState(false)
  const [ready,   setReady]   = useState(false)

  // ── Drag state ────────────────────────────────────────────────
  const [pos,      setPos]      = useState(() => getSavedPos())
  const [dragging, setDragging] = useState(false)
  const dragStart  = useRef(null)

  const prevPath  = useRef('')
  const hideTimer = useRef(null)
  const loc       = useLocation()

  // ── Save position ─────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('scripturehub_ac_pos', JSON.stringify(pos))
  }, [pos])

  // ── Keep inside window on resize ─────────────────────────────
  useEffect(() => {
    function onResize() {
      setPos(p => ({
        x: Math.min(p.x, window.innerWidth  - 60),
        y: Math.min(p.y, window.innerHeight - 60),
      }))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── Mouse drag ────────────────────────────────────────────────
  function onMouseDown(e) {
    if (e.target.closest('button') || e.target.closest('input')) return
    e.preventDefault()
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: pos.x, oy: pos.y }
    setDragging(true)
  }

  useEffect(() => {
    function onMouseMove(e) {
      if (!dragStart.current) return
      const dx = e.clientX - dragStart.current.mx
      const dy = e.clientY - dragStart.current.my
      setPos({
        x: Math.max(0, Math.min(window.innerWidth  - 60, dragStart.current.ox + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 60, dragStart.current.oy + dy)),
      })
    }
    function onMouseUp() { dragStart.current = null; setDragging(false) }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
    }
  }, [])

  // ── Touch drag ────────────────────────────────────────────────
  function onTouchStart(e) {
    if (e.target.closest('button') || e.target.closest('input')) return
    const t = e.touches[0]
    dragStart.current = { mx: t.clientX, my: t.clientY, ox: pos.x, oy: pos.y }
    setDragging(true)
  }

  useEffect(() => {
    function onTouchMove(e) {
      if (!dragStart.current) return
      e.preventDefault()
      const t = e.touches[0]
      const dx = t.clientX - dragStart.current.mx
      const dy = t.clientY - dragStart.current.my
      setPos({
        x: Math.max(0, Math.min(window.innerWidth  - 60, dragStart.current.ox + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 60, dragStart.current.oy + dy)),
      })
    }
    function onTouchEnd() { dragStart.current = null; setDragging(false) }
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend',  onTouchEnd)
    return () => {
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend',  onTouchEnd)
    }
  }, [])

  // ── Unlock on mount ───────────────────────────────────────────
  useEffect(() => {
    unlockAudioContext().then(ok => { if (ok) setReady(true) })
  }, [])

  // ── Unlock on any interaction ─────────────────────────────────
  useEffect(() => {
    async function tryUnlock() {
      if (ready) return
      const ok = await unlockAudioContext()
      if (ok) { setReady(true); console.log('✅ ScriptureHub Audio unlocked') }
    }
    const events = ['click', 'touchstart', 'keydown', 'mousedown', 'pointerdown', 'scroll']
    events.forEach(ev => document.addEventListener(ev, tryUnlock, { passive: true }))
    return () => events.forEach(ev => document.removeEventListener(ev, tryUnlock))
  }, [ready])

  // ── Page transition sound ─────────────────────────────────────
  useEffect(() => {
    const path = loc.pathname
    if (path !== prevPath.current && prevPath.current !== '') {
      if (ready && !muted) setTimeout(() => playPageTurn(), 80)
    }
    prevPath.current = path
  }, [loc.pathname, ready, muted])

  function toggleMute() {
    const next = !muted
    setMuted(next)
    localStorage.setItem('scripturehub_muted', String(next))
    setPulse(true)
    setTimeout(() => setPulse(false), 350)
  }

  function handleVolume(e) {
    const val = parseFloat(e.target.value)
    setVolume(val)
    localStorage.setItem('scripturehub_volume', String(val))
    if (muted && val > 0) { setMuted(false); localStorage.setItem('scripturehub_muted', 'false') }
  }

  function showPanel() {
    setVisible(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setVisible(false), 5000)
  }

  const accent   = (() => {
    try { return JSON.parse(localStorage.getItem('scripturehub_settings') ?? '{}').accentColor || '#c9a84c' }
    catch { return '#c9a84c' }
  })()

  const volIcon  = muted ? '🔇' : volume < 0.3 ? '🔈' : volume < 0.7 ? '🔉' : '🔊'
  const volLabel = muted ? 'Muted' : volume < 0.3 ? 'Low' : volume < 0.7 ? 'Medium' : 'High'

  return (
    <>
      <style>{`
        .ac-widget {
          position: fixed;
          z-index: 9999;
          display: flex;
          align-items: flex-end;
          gap: 0.5rem;
          user-select: none;
        }
        .ac-drag-handle {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 3px;
          padding: 6px 4px;
          cursor: grab;
          opacity: 0.45;
          transition: opacity 0.2s;
          align-self: center;
        }
        .ac-drag-handle:hover { opacity: 1; }
        .ac-drag-handle span {
          display: block;
          width: 18px; height: 2px;
          background: #c9a84c;
          border-radius: 2px;
        }
        .ac-widget.dragging { cursor: grabbing !important; }
        .ac-widget.dragging * { cursor: grabbing !important; }
      `}</style>

      <div
        className={`ac-widget${dragging ? ' dragging' : ''}`}
        style={{ left: pos.x + 'px', top: pos.y + 'px' }}
      >
        {/* ── Drag handle ── */}
        <div
          className="ac-drag-handle"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          title="Drag to move"
        >
          <span /><span /><span />
        </div>

        {/* ── Volume panel ── */}
        <div style={{
          background: 'rgba(10,5,2,0.97)',
          border: '1px solid rgba(201,168,76,0.4)',
          borderRadius: '14px',
          padding: '0.9rem 1.15rem',
          backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column', gap: '0.6rem',
          transition: 'opacity 0.22s, transform 0.22s',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
          pointerEvents: visible ? 'all' : 'none',
          minWidth: '230px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#c9a84c', fontSize: '0.72rem', fontWeight: '800', fontFamily: 'Georgia,serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              🔊 Organic Audio
            </span>
            <span style={{ color: ready ? '#27ae60' : '#e67e22', fontSize: '0.68rem', fontWeight: '700', fontFamily: 'Georgia,serif' }}>
              ● {ready ? 'Live' : 'Click to activate'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: '#c8b89a', fontSize: '0.75rem', fontFamily: 'Georgia,serif', minWidth: '55px', fontWeight: '600' }}>
              {volIcon} {volLabel}
            </span>
            <input
              type="range" min="0" max="1" step="0.05"
              value={muted ? 0 : volume}
              onChange={handleVolume}
              style={{ flex: 1, accentColor: accent, cursor: 'pointer' }}
            />
            <span style={{ color: accent, fontSize: '0.8rem', fontWeight: '800', minWidth: '36px', textAlign: 'right', fontFamily: 'Georgia,serif' }}>
              {muted ? '0%' : Math.round(volume * 100) + '%'}
            </span>
          </div>
          {!ready && (
            <p style={{ color: '#e67e22', fontSize: '0.7rem', margin: 0, fontFamily: 'Georgia,serif', textAlign: 'center', fontStyle: 'italic' }}>
              Click anywhere on the page to activate audio
            </p>
          )}
        </div>

        {/* ── Main button ── */}
        <button
          onClick={async () => {
            if (!ready) { const ok = await unlockAudioContext(); if (ok) setReady(true) }
            toggleMute()
          }}
          onMouseEnter={showPanel}
          title={!ready ? 'Click to enable audio' : muted ? 'Unmute' : 'Mute — hover to adjust volume'}
          aria-label={muted ? 'Unmute audio' : 'Mute audio'}
          style={{
            width: '46px', height: '46px', borderRadius: '50%',
            background: !ready
              ? 'rgba(80,50,10,0.97)'
              : muted
                ? 'rgba(100,20,10,0.97)'
                : 'rgba(10,5,2,0.97)',
            border: '1.5px solid ' + (!ready
              ? 'rgba(230,126,34,0.7)'
              : muted
                ? 'rgba(231,76,60,0.7)'
                : 'rgba(201,168,76,0.5)'),
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.2s',
            transform: pulse ? 'scale(1.3)' : 'scale(1)',
            boxShadow: !ready
              ? '0 2px 16px rgba(230,126,34,0.4)'
              : muted
                ? '0 2px 16px rgba(231,76,60,0.4)'
                : '0 2px 16px rgba(201,168,76,0.3)',
          }}
        >
          {!ready ? '🔕' : volIcon}
        </button>

      </div>
    </>
  )
}