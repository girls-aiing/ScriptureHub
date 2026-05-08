// ScriptureHub Audio Engine — Final Fix

const ctx = new (window.AudioContext || window.webkitAudioContext)()

function vol() {
  try {
    const v = parseFloat(localStorage.getItem('scripturehub_volume'))
    return isNaN(v) ? 0.8 : v
  } catch { return 0.8 }
}

function muted() {
  try { return localStorage.getItem('scripturehub_muted') === 'true' }
  catch { return false }
}

function ok() {
  if (muted()) return false
  if (ctx.state === 'suspended') ctx.resume()
  return true
}

function tone(freq, delay, dur, gain, type = 'sine') {
  if (!ok()) return
  try {
    const now = ctx.currentTime + delay
    const o   = ctx.createOscillator()
    const g   = ctx.createGain()
    o.connect(g)
    g.connect(ctx.destination)
    o.type            = type
    o.frequency.value = freq
    g.gain.setValueAtTime(0.0001, now)
    g.gain.linearRampToValueAtTime(gain * vol(), now + 0.04)
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur)
    o.start(now)
    o.stop(now + dur + 0.05)
  } catch (e) { console.warn('tone:', e) }
}

function burst(filterFreq, delay, dur, gain) {
  if (!ok()) return
  try {
    const now     = ctx.currentTime + delay
    const samples = Math.floor(ctx.sampleRate * (dur + 0.05))
    const buf     = ctx.createBuffer(1, samples, ctx.sampleRate)
    const data    = buf.getChannelData(0)
    for (let i = 0; i < samples; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    const flt = ctx.createBiquadFilter()
    const g   = ctx.createGain()
    src.buffer          = buf
    flt.type            = 'bandpass'
    flt.frequency.value = filterFreq
    flt.Q.value         = 1.5
    src.connect(flt)
    flt.connect(g)
    g.connect(ctx.destination)
    g.gain.setValueAtTime(0.0001, now)
    g.gain.linearRampToValueAtTime(gain * vol(), now + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur)
    src.start(now)
    src.stop(now + dur + 0.05)
  } catch (e) { console.warn('burst:', e) }
}

export function playNavClick() {
  burst(1400, 0,    0.05, 0.7)
  burst(700,  0.03, 0.08, 0.4)
  tone(200,   0,    0.10, 0.2)
  tone(100,   0.02, 0.12, 0.1)
}

export function playPageTurn() {
  burst(500, 0,    0.22, 0.25)
  burst(350, 0.08, 0.28, 0.15)
  tone(160,  0,    0.32, 0.10)
}

export function playTabSwitch() {
  burst(1000, 0, 0.09, 0.30)
  tone(320,   0, 0.13, 0.10)
}

export function playToggle() {
  burst(2200, 0,    0.04, 0.60)
  burst(1500, 0.06, 0.04, 0.40)
  tone(900,   0,    0.04, 0.10, 'square')
  tone(600,   0.06, 0.04, 0.08, 'square')
}

export function playCorrect() {
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((f, i) => {
    tone(f,     i * 0.12, 0.9, 0.25, 'sine')
    tone(f * 2, i * 0.12, 0.6, 0.08, 'triangle')
  })
}

export function playWrong() {
  tone(280, 0,    0.45, 0.20)
  tone(220, 0.18, 0.45, 0.17)
  tone(175, 0.36, 0.50, 0.14)
}

export function playAmen() {
  tone(528,  0,    1.5, 0.25)
  tone(1056, 0,    1.0, 0.10)
  tone(792,  0.12, 1.3, 0.14)
  tone(264,  0,    1.7, 0.10)
}

export function playStoneCarve() {
  burst(280, 0,    0.12, 0.70)
  burst(180, 0.05, 0.18, 0.45)
  tone(75,   0,    0.45, 0.25)
  tone(110,  0,    0.28, 0.14)
}

export function playDiscovery() {
  const freqs = [523, 659, 784, 1047, 1319]
  freqs.forEach((f, i) => {
    tone(f,       i * 0.10, 1.5, 0.18, 'sine')
    tone(f * 1.5, i * 0.10, 1.1, 0.07, 'triangle')
  })
  burst(2000, 0, 1.6, 0.10)
  tone(65, 0, 2.0, 0.14)
}

export function playMilestone() {
  const choir = [130.81, 164.81, 196, 261.63, 329.63]
  const v     = vol()
  choir.forEach((freq, i) => {
    try {
      const now  = ctx.currentTime + i * 0.07
      const o    = ctx.createOscillator()
      const g    = ctx.createGain()
      const vib  = ctx.createOscillator()
      const vibG = ctx.createGain()
      vib.frequency.value = 5
      vibG.gain.value     = 4
      vib.connect(vibG)
      vibG.connect(o.frequency)
      o.connect(g)
      g.connect(ctx.destination)
      o.type            = 'sine'
      o.frequency.value = freq
      g.gain.setValueAtTime(0.0001, now)
      g.gain.linearRampToValueAtTime(0.18 * v, now + 0.5)
      g.gain.linearRampToValueAtTime(0.12 * v, now + 2.2)
      g.gain.exponentialRampToValueAtTime(0.0001, now + 3.8)
      vib.start(now); vib.stop(now + 3.8)
      o.start(now);   o.stop(now + 3.8)
    } catch {}
  })
}

export function playMissionComplete() {
  const melody = [392, 523.25, 659.25, 523.25, 783.99]
  melody.forEach((f, i) => {
    tone(f,     i * 0.18, 0.8, 0.22, 'sine')
    tone(f * 2, i * 0.18, 0.5, 0.07, 'triangle')
  })
  setTimeout(() => playMilestone(), 1500)
}

export function playSave() {
  tone(440, 0,    0.30, 0.18)
  tone(554, 0.15, 0.30, 0.18)
  tone(659, 0.30, 0.45, 0.20)
}

export function playBibleOpen() {
  const pads = [130.81, 196, 261.63, 329.63]
  pads.forEach((f, i) => tone(f, i * 0.15, 2.4, 0.12))
  burst(500, 0, 0.4, 0.06)
}

export function playHoverThrum() {
  tone(80,  0, 0.18, 0.06)
  tone(160, 0, 0.18, 0.04)
}

export function getAudioContext() { return ctx }
export function resumeAudio() {
  if (ctx.state === 'suspended') ctx.resume()
}