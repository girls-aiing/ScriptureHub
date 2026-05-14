// useVoiceGuide.js
// Thin wrapper — all speech now goes through VoiceGuide.jsx's engine.
// This file exists only so other components can import stopVoiceGuide
// and speakPageGuide without breaking existing imports.

import { speakText, stopVoiceGuide, announceHymnView } from '../components/VoiceGuide'

// Re-export the engine controls so any file importing from here still works
export { stopVoiceGuide }
export { announceHymnView }

// speakPageGuide — called by pages that want to trigger a voice intro.
// The VoiceGuide component already handles page-change speech automatically,
// so this is a no-op to prevent double-speaking.
// If you ever need to force a manual announcement, call speakText() directly.
export function speakPageGuide(_pathname, _userName) {
  // Intentionally empty — VoiceGuide.jsx handles all automatic page speech.
  // Having two systems both speak on page load was the cause of repetition.
}

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

export function clearSessionHistory() {
  // Session history is now managed inside VoiceGuide.jsx (spokenPaths ref)
}