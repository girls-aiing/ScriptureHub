// useVoiceGuide.js
// Thin re-export wrapper — all speech goes through VoiceGuide.jsx's engine.
// This file exists so existing imports across the app don't break.

import { speakText, stopVoiceGuide, announceHymnView } from '../components/VoiceGuide'

export { stopVoiceGuide }
export { announceHymnView }

// No-op — VoiceGuide.jsx handles all automatic page speech on route change.
export function speakPageGuide(_pathname, _userName) {}

export function speakHymnGuide(subpage) {
  announceHymnView(subpage)
}

export function pauseVoiceGuide() {
  try { window.speechSynthesis.pause() } catch {}
}

export function resumeVoiceGuide() {
  try { window.speechSynthesis.resume() } catch {}
}

export function isVoiceGuideSupported() {
  return 'speechSynthesis' in window
}

export function isVoiceGuideSpeaking() {
  return window.speechSynthesis?.speaking ?? false
}

export function getAvailableVoices() {
  return window.speechSynthesis?.getVoices() ?? []
}

export function clearSessionHistory() {}