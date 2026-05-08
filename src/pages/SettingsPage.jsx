import React, { useState } from 'react'
import { useTheme }    from '../context/ThemeContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { playSave, playToggle, playTabSwitch } from '../hooks/useSound.js'
import { stopVoiceGuide } from '../hooks/useVoiceGuide.js'

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}
function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

const DEFAULT_SETTINGS = {
  fontSize:       'medium',
  fontFamily:     'georgia',
  accentColor:    '#c9a84c',
  verseOfDay:     true,
  soundEffects:   true,
  autoPlayAudio:  false,
  defaultBible:   'KJV',
  readingGoal:    3,
  notifications:  true,
  compactMode:    false,
  showStreak:     true,
  quizDifficulty: 'medium',
  floatingChat:   true,
  animationsOn:   true,
  voiceGuide:     true,
  voiceVolume:    0.85,
}

const ACCENT_COLORS = [
  { label: 'Gold',     value: '#c9a84c' },
  { label: 'Royal',    value: '#6c5ce7' },
  { label: 'Crimson',  value: '#c0392b' },
  { label: 'Emerald',  value: '#27ae60' },
  { label: 'Sapphire', value: '#2980b9' },
  { label: 'Rose',     value: '#e84393' },
]

const LANGUAGES = [
  { value: 'english',    label: 'English',   flag: '🇬🇧' },
  { value: 'french',     label: 'Français',  flag: '🇫🇷' },
  { value: 'spanish',    label: 'Español',   flag: '🇪🇸' },
  { value: 'portuguese', label: 'Português', flag: '🇧🇷' },
  { value: 'yoruba',     label: 'Yorùbá',    flag: '🇳🇬' },
  { value: 'swahili',    label: 'Kiswahili', flag: '🇰🇪' },
]

export default function SettingsPage() {
  const { darkMode, toggleDarkMode } = useTheme()
  const { language, changeLanguage, t } = useLanguage()
  const [settings, setSettings] = useState(() => loadJSON('scripturehub_settings', DEFAULT_SETTINGS))
  const [saved,    setSaved]    = useState(false)
  const [section,  setSection]  = useState('appearance')

  function update(key, val) { setSettings(prev => ({ ...prev, [key]: val })) }

  function saveSettings() {
    saveJSON('scripturehub_settings', settings)
    // Sync voice volume to its own key so VoiceGuide picks it up instantly
    localStorage.setItem('scripturehub_voice_volume', String(settings.voiceVolume ?? 0.85))
    // Sync voice muted state
    localStorage.setItem('scripturehub_voice_muted', settings.voiceGuide === false ? 'true' : 'false')
    setSaved(true)
    playSave()
    setTimeout(() => setSaved(false), 2500)
  }

  function resetSettings() {
    if (window.confirm('Reset all settings to default?')) {
      setSettings(DEFAULT_SETTINGS)
      saveJSON('scripturehub_settings', DEFAULT_SETTINGS)
    }
  }

  function clearAllData() {
    if (window.confirm('Delete ALL your progress, stones, badges, and settings?')) {
      localStorage.clear()
      setSettings(DEFAULT_SETTINGS)
      alert('All data cleared.')
      window.location.reload()
    }
  }

  const C = darkMode ? {
    pageBg: '#0a0500', cardBg: '#1e1008', cardBorder: 'rgba(201,168,76,0.2)',
    title: '#f5ead8', text: '#f5ead8', muted: '#c8b89a', gold: '#f0c040',
    inputBg: '#2a1810', inputBorder: 'rgba(201,168,76,0.35)', inputColor: '#f5ead8',
    sidebarBg: '#150a04', divider: 'rgba(201,168,76,0.12)',
  } : {
    pageBg: '#f5f0e8', cardBg: '#ffffff', cardBorder: '#e0d8c8',
    title: '#1a1a2e', text: '#1a1a2e', muted: '#666666', gold: '#8a6000',
    inputBg: '#ffffff', inputBorder: '#c9a84c', inputColor: '#1a1a2e',
    sidebarBg: '#ede8de', divider: '#e0d8c8',
  }

  const SECTIONS = [
    { id: 'appearance', icon: '🎨', label: t('appearance') },
    { id: 'language',   icon: '🌍', label: t('language') },
    { id: 'reading',    icon: '📖', label: t('reading') },
    { id: 'study',      icon: '🎓', label: t('studyQuizzes') },
    { id: 'features',   icon: '⚙️',  label: t('features') },
    { id: 'account',    icon: '👤', label: t('accountData') },
    { id: 'about',      icon: 'ℹ️',  label: t('about') },
  ]

  return (
    <div style={{ background: C.pageBg, minHeight: '100vh', fontFamily: 'Georgia,serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: settings.accentColor, fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '700', margin: '0 0 0.4rem' }}>⚙️ ScriptureHub</p>
          <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: '800', color: C.title, margin: '0 0 0.4rem' }}>{t('settingsTitle')}</h1>
          <p style={{ color: C.muted, fontSize: '0.95rem', margin: 0 }}>{t('settingsSubtitle')}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* ── Sidebar ── */}
          <div style={{ background: C.sidebarBg, border: '1px solid ' + C.cardBorder, borderRadius: '16px', padding: '0.75rem', position: 'sticky', top: '90px' }}>
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => { setSection(s.id); playTabSwitch() }} style={{
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                width: '100%', padding: '0.7rem 0.9rem', marginBottom: '0.2rem',
                background: section === s.id ? settings.accentColor + '22' : 'transparent',
                border: section === s.id ? '1px solid ' + settings.accentColor + '55' : '1px solid transparent',
                borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
                color: section === s.id ? settings.accentColor : C.muted,
                fontFamily: 'Georgia,serif', fontSize: '0.9rem',
                fontWeight: section === s.id ? '700' : '500', transition: 'all 0.18s',
              }}>
                <span>{s.icon}</span> {s.label}
              </button>
            ))}
            <div style={{ borderTop: '1px solid ' + C.divider, marginTop: '0.75rem', paddingTop: '0.75rem' }}>
              <button onClick={saveSettings} style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg,' + settings.accentColor + ',#a07830)', color: '#1a0a00', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Georgia,serif' }}>
                {saved ? t('saved') : t('saveSettings')}
              </button>
            </div>
          </div>

          {/* ── Main content ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* ── APPEARANCE ── */}
            {section === 'appearance' && (
              <>
                <SettingsCard title={t('darkMode')} desc={t('darkModeDesc')} C={C}>
                  <Toggle value={darkMode} onChange={() => { toggleDarkMode(); playToggle() }} accent={settings.accentColor} />
                </SettingsCard>

                <SettingsCard title={t('accentColour')} desc={t('accentColourDesc')} C={C}>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {ACCENT_COLORS.map(ac => (
                      <button key={ac.value} onClick={() => { update('accentColor', ac.value); playToggle() }} title={ac.label}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', background: ac.value, border: settings.accentColor === ac.value ? '3px solid ' + C.title : '3px solid transparent', cursor: 'pointer', outline: settings.accentColor === ac.value ? '2px solid ' + ac.value : 'none', outlineOffset: '2px', transition: 'all 0.18s', boxShadow: settings.accentColor === ac.value ? '0 0 0 3px ' + ac.value + '44' : 'none' }} />
                    ))}
                  </div>
                </SettingsCard>

                <SettingsCard title={t('fontSize')} desc={t('fontSizeDesc')} C={C}>
                  <RadioGroup
                    options={[{ label: t('small'), value: 'small' }, { label: t('medium'), value: 'medium' }, { label: t('large'), value: 'large' }, { label: t('extraLarge'), value: 'xlarge' }]}
                    value={settings.fontSize} onChange={v => { update('fontSize', v); playToggle() }} accent={settings.accentColor} C={C}
                  />
                </SettingsCard>

                <SettingsCard title={t('fontStyle')} desc={t('fontStyleDesc')} C={C}>
                  <RadioGroup
                    options={[{ label: 'Georgia', value: 'georgia' }, { label: 'Serif', value: 'serif' }, { label: 'Sans-Serif', value: 'sans' }, { label: 'Monospace', value: 'mono' }]}
                    value={settings.fontFamily} onChange={v => { update('fontFamily', v); playToggle() }} accent={settings.accentColor} C={C}
                  />
                </SettingsCard>

                <SettingsCard title={t('compactMode')} desc={t('compactModeDesc')} C={C}>
                  <Toggle value={settings.compactMode} onChange={v => { update('compactMode', v); playToggle() }} accent={settings.accentColor} />
                </SettingsCard>

                <SettingsCard title={t('animations')} desc={t('animationsDesc')} C={C}>
                  <Toggle value={settings.animationsOn} onChange={v => { update('animationsOn', v); playToggle() }} accent={settings.accentColor} />
                </SettingsCard>
              </>
            )}

            {/* ── LANGUAGE ── */}
            {section === 'language' && (
              <>
                <SettingsCard title={'🌍 ' + t('language')} desc={t('languageDesc')} C={C}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
                    {LANGUAGES.map(lang => (
                      <button key={lang.value} onClick={() => { changeLanguage(lang.value); playToggle() }} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.85rem 1rem', borderRadius: '12px', cursor: 'pointer',
                        background: language === lang.value ? settings.accentColor + '18' : C.cardBg,
                        border: '2px solid ' + (language === lang.value ? settings.accentColor : C.cardBorder),
                        color: language === lang.value ? settings.accentColor : C.text,
                        fontFamily: 'Georgia,serif', fontSize: '0.95rem',
                        fontWeight: language === lang.value ? '700' : '500',
                        transition: 'all 0.2s', textAlign: 'left',
                        boxShadow: language === lang.value ? '0 4px 14px ' + settings.accentColor + '30' : 'none',
                      }}>
                        <span style={{ fontSize: '1.5rem' }}>{lang.flag}</span>
                        <div>
                          <p style={{ margin: 0, fontWeight: '700', fontSize: '0.92rem' }}>{lang.label}</p>
                          {language === lang.value && <p style={{ margin: 0, fontSize: '0.72rem', color: settings.accentColor }}>✓ Active</p>}
                        </div>
                      </button>
                    ))}
                  </div>
                </SettingsCard>

                <SettingsCard title="✨ Live Preview" desc="See how your selected language looks across the site" C={C}>
                  <div style={{ background: C.pageBg, border: '1px solid ' + C.cardBorder, borderRadius: '12px', padding: '1.25rem', marginTop: '0.5rem' }}>
                    <p style={{ color: C.muted, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', margin: '0 0 0.75rem' }}>Navbar Preview</p>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {['home','bible','quizzes','askAI','dashboard','community','settings'].map(key => (
                        <span key={key} style={{ background: settings.accentColor + '18', border: '1px solid ' + settings.accentColor + '44', borderRadius: '6px', padding: '0.3rem 0.7rem', color: settings.accentColor, fontSize: '0.8rem', fontWeight: '600' }}>
                          {t(key)}
                        </span>
                      ))}
                    </div>
                    <div style={{ marginTop: '1rem', padding: '0.85rem', background: C.cardBg, border: '1px solid ' + C.cardBorder, borderRadius: '10px' }}>
                      <p style={{ color: C.muted, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', margin: '0 0 0.5rem' }}>Community Page Preview</p>
                      <p style={{ color: C.title, fontWeight: '800', fontSize: '1rem', margin: '0 0 0.25rem' }}>{t('communityTitle')}</p>
                      <p style={{ color: C.muted, fontSize: '0.85rem', margin: '0 0 0.75rem' }}>{t('communitySubtitle')}</p>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {['stoneWall','treasureChest','prophetPath','easterEggs'].map(key => (
                          <span key={key} style={{ background: C.pageBg, border: '1px solid ' + C.cardBorder, borderRadius: '999px', padding: '0.3rem 0.75rem', color: C.muted, fontSize: '0.8rem' }}>{t(key)}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </SettingsCard>
              </>
            )}

            {/* ── READING ── */}
            {section === 'reading' && (
              <>
                <SettingsCard title={t('defaultBible')} desc={t('defaultBibleDesc')} C={C}>
                  <SelectInput options={['KJV','NIV','ESV','NKJV','NLT','AMP','MSG','CSB','NASB','RSV']} value={settings.defaultBible} onChange={v => { update('defaultBible', v); playToggle() }} C={C} />
                </SettingsCard>

                <SettingsCard title={t('readingGoal')} desc={t('readingGoalDesc')} C={C}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <input type="range" min={1} max={10} value={settings.readingGoal}
                      onChange={e => update('readingGoal', Number(e.target.value))}
                      style={{ flex: 1, accentColor: settings.accentColor }} />
                    <span style={{ color: settings.accentColor, fontWeight: '800', fontSize: '1.1rem', minWidth: '100px' }}>
                      {settings.readingGoal} {settings.readingGoal === 1 ? t('chapter') : t('chapters')}
                    </span>
                  </div>
                </SettingsCard>

                <SettingsCard title={t('verseOfDay')} desc={t('verseOfDayDesc')} C={C}>
                  <Toggle value={settings.verseOfDay} onChange={v => { update('verseOfDay', v); playToggle() }} accent={settings.accentColor} />
                </SettingsCard>

                <SettingsCard title={t('autoPlay')} desc={t('autoPlayDesc')} C={C}>
                  <Toggle value={settings.autoPlayAudio} onChange={v => { update('autoPlayAudio', v); playToggle() }} accent={settings.accentColor} />
                </SettingsCard>
              </>
            )}

            {/* ── STUDY ── */}
            {section === 'study' && (
              <>
                <SettingsCard title={t('quizDifficulty')} desc={t('quizDifficultyDesc')} C={C}>
                  <RadioGroup
                    options={[{ label: t('beginner'), value: 'beginner' }, { label: t('medium'), value: 'medium' }, { label: t('hard'), value: 'hard' }, { label: t('scholar'), value: 'scholar' }]}
                    value={settings.quizDifficulty} onChange={v => { update('quizDifficulty', v); playToggle() }} accent={settings.accentColor} C={C}
                  />
                </SettingsCard>

                <SettingsCard title={t('showStreak')} desc={t('showStreakDesc')} C={C}>
                  <Toggle value={settings.showStreak} onChange={v => { update('showStreak', v); playToggle() }} accent={settings.accentColor} />
                </SettingsCard>

                <SettingsCard title={t('notifications')} desc={t('notificationsDesc')} C={C}>
                  <Toggle value={settings.notifications} onChange={v => { update('notifications', v); playToggle() }} accent={settings.accentColor} />
                </SettingsCard>

                <SettingsCard title={t('soundEffects')} desc={t('soundEffectsDesc')} C={C}>
                  <Toggle value={settings.soundEffects} onChange={v => { update('soundEffects', v); playToggle() }} accent={settings.accentColor} />
                </SettingsCard>

                {/* ── VOICE GUIDE CARD ── */}
                <SettingsCard
                  title="🎙️ Voice Guide"
                  desc="A calm AI voice welcomes you on each page and explains what you can do there. Perfect for all ages and accessibility needs."
                  C={C}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Enable / disable toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: C.muted, fontSize: '0.88rem', fontWeight: '600' }}>
                        {settings.voiceGuide !== false ? '🔊 Voice Guide is ON' : '🔇 Voice Guide is OFF'}
                      </span>
                      <Toggle
                        value={settings.voiceGuide !== false}
                        onChange={v => {
                          update('voiceGuide', v)
                          localStorage.setItem('scripturehub_voice_muted', v ? 'false' : 'true')
                          if (!v) stopVoiceGuide()
                          playToggle()
                        }}
                        accent={settings.accentColor}
                      />
                    </div>

                    {/* Volume slider */}
                    {settings.voiceGuide !== false && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ color: C.muted, fontSize: '0.85rem', fontWeight: '600', minWidth: '80px' }}>
                          🔊 Volume
                        </span>
                        <input
                          type="range" min="0" max="1" step="0.05"
                          value={settings.voiceVolume ?? 0.85}
                          onChange={e => {
                            const val = parseFloat(e.target.value)
                            update('voiceVolume', val)
                            localStorage.setItem('scripturehub_voice_volume', String(val))
                          }}
                          style={{ flex: 1, accentColor: settings.accentColor }}
                        />
                        <span style={{ color: settings.accentColor, fontWeight: '800', fontSize: '0.9rem', minWidth: '40px', textAlign: 'right' }}>
                          {Math.round((settings.voiceVolume ?? 0.85) * 100)}%
                        </span>
                      </div>
                    )}

                    {/* Info box */}
                    <div style={{ background: settings.accentColor + '12', border: '1px solid ' + settings.accentColor + '33', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                      <p style={{ color: C.muted, fontSize: '0.82rem', margin: 0, lineHeight: '1.7' }}>
                        ✦ The voice speaks <strong style={{ color: C.title }}>once per page per session</strong> — it will not repeat if you navigate back and forth.<br />
                        ✦ You can pause, replay, or stop it using the <strong style={{ color: C.title }}>🎙️ button</strong> in the bottom-right corner.<br />
                        ✦ Uses your device's built-in voice engine — <strong style={{ color: C.title }}>no internet required</strong>.
                      </p>
                    </div>

                  </div>
                </SettingsCard>
              </>
            )}

            {/* ── FEATURES ── */}
            {section === 'features' && (
              <>
                <SettingsCard title={t('floatingChat')} desc={t('floatingChatDesc')} C={C}>
                  <Toggle value={settings.floatingChat} onChange={v => { update('floatingChat', v); playToggle() }} accent={settings.accentColor} />
                </SettingsCard>
                <SettingsCard title="🪨 Stone Wall" desc="Enable the community Stone of Remembrance wall" C={C}>
                  <Toggle value={true} onChange={() => playToggle()} accent={settings.accentColor} />
                </SettingsCard>
                <SettingsCard title="🏆 Treasure Chest" desc="Enable badge tracking and the Treasure Chest" C={C}>
                  <Toggle value={true} onChange={() => playToggle()} accent={settings.accentColor} />
                </SettingsCard>
                <SettingsCard title="🕊️ Prophet's Path" desc="Enable the interactive biblical storytelling missions" C={C}>
                  <Toggle value={true} onChange={() => playToggle()} accent={settings.accentColor} />
                </SettingsCard>
                <SettingsCard title="🔍 Easter Eggs" desc="Enable hidden Easter egg discoveries" C={C}>
                  <Toggle value={true} onChange={() => playToggle()} accent={settings.accentColor} />
                </SettingsCard>
              </>
            )}

            {/* ── ACCOUNT ── */}
            {section === 'account' && (
              <>
                <SettingsCard title={t('progressSummary')} desc={t('progressDesc')} C={C}>
                  <ProgressSummary C={C} accent={settings.accentColor} />
                </SettingsCard>

                <SettingsCard title={t('exportData')} desc={t('exportDesc')} C={C}>
                  <button onClick={() => {
                    const data = {}
                    for (let i = 0; i < localStorage.length; i++) {
                      const k = localStorage.key(i)
                      if (k.startsWith('scripturehub')) data[k] = loadJSON(k, null)
                    }
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                    const url  = URL.createObjectURL(blob)
                    const a    = document.createElement('a')
                    a.href = url; a.download = 'scripturehub-data.json'; a.click()
                    URL.revokeObjectURL(url)
                  }} style={{ background: 'linear-gradient(135deg,' + settings.accentColor + ',#a07830)', color: '#1a0a00', border: 'none', borderRadius: '10px', padding: '0.7rem 1.5rem', fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Georgia,serif' }}>
                    {t('downloadBtn')}
                  </button>
                </SettingsCard>

                <SettingsCard title={t('resetSettings')} desc={t('resetDesc')} C={C}>
                  <button onClick={resetSettings} style={{ background: 'transparent', color: '#e67e22', border: '2px solid #e67e22', borderRadius: '10px', padding: '0.65rem 1.4rem', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Georgia,serif' }}>
                    {t('resetBtn')}
                  </button>
                </SettingsCard>

                <SettingsCard title={t('clearData')} desc={t('clearDesc')} C={C} danger>
                  <button onClick={clearAllData} style={{ background: 'transparent', color: '#e74c3c', border: '2px solid #e74c3c', borderRadius: '10px', padding: '0.65rem 1.4rem', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Georgia,serif' }}>
                    {t('clearBtn')}
                  </button>
                </SettingsCard>
              </>
            )}

            {/* ── ABOUT ── */}
            {section === 'about' && (
              <>
                <SettingsCard title="✦ About ScriptureHub" desc="" C={C}>
                  <div style={{ lineHeight: '1.85', color: C.muted, fontSize: '0.95rem' }}>
                    <p style={{ margin: '0 0 0.75rem' }}><strong style={{ color: C.title }}>ScriptureHub</strong> is a sacred digital space built to help believers engage deeply with the Word of God.</p>
                    <p style={{ margin: '0 0 0.75rem' }}>Built with love by <strong style={{ color: settings.accentColor }}>Silas Clergy</strong>.</p>
                    <p style={{ margin: 0, fontStyle: 'italic', color: settings.accentColor, fontWeight: '600' }}>"Your word is a lamp to my feet and a light to my path." — Psalm 119:105</p>
                  </div>
                </SettingsCard>

                <SettingsCard title="📋 Version & Info" desc="" C={C}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {[
                      ['Version',     '2.0.0'],
                      ['Platform',    'React + Vite'],
                      ['Storage',     'Local Browser Storage'],
                      ['Bible API',   'bible-api.com'],
                      ['AI Model',    'Google Gemini'],
                      ['Audio',       'Web Audio API — No external files'],
                      ['Voice Guide', 'Web Speech API — Built into your browser'],
                      ['Languages',   LANGUAGES.map(l => l.label).join(', ')],
                    ].map(([k,v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid ' + C.divider }}>
                        <span style={{ color: C.muted, fontSize: '0.88rem', fontWeight: '600' }}>{k}</span>
                        <span style={{ color: C.title, fontSize: '0.88rem', fontWeight: '700', textAlign: 'right', maxWidth: '60%' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </SettingsCard>

                <SettingsCard title="🔊 Audio Guide" desc="What each sound means" C={C}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                    {[
                      ['📄 Paper Whoosh',    'Every page navigation'],
                      ['🪵 Wooden Tap',      'Navbar link click'],
                      ['🎵 Harp Chime',      'Quiz correct answer'],
                      ['🔔 Soft Bell',       'Amen given on stone'],
                      ['✨ Ambient Shimmer', 'Easter egg discovered'],
                      ['🎶 Choir Hum',       'Badge or milestone earned'],
                      ['🪨 Deep Tap',        'Stone carved on wall'],
                      ['🔘 Click-Clack',     'Toggle or tab switch'],
                      ['💾 Confirmation',    'Settings saved'],
                      ['🎙️ Voice Guide',     'Calm spoken welcome on each page'],
                    ].map(([k,v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid ' + C.divider }}>
                        <span style={{ color: C.title, fontSize: '0.85rem', fontWeight: '600' }}>{k}</span>
                        <span style={{ color: C.muted, fontSize: '0.82rem' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </SettingsCard>
              </>
            )}

            {/* ── Bottom save/reset bar ── */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
              <button onClick={resetSettings} style={{ background: 'transparent', color: C.muted, border: '2px solid ' + C.cardBorder, borderRadius: '10px', padding: '0.65rem 1.4rem', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Georgia,serif' }}>
                {t('reset')}
              </button>
              <button onClick={saveSettings} style={{ background: 'linear-gradient(135deg,' + settings.accentColor + ',#a07830)', color: '#1a0a00', border: 'none', borderRadius: '10px', padding: '0.65rem 1.75rem', fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Georgia,serif' }}>
                {saved ? t('saved') : t('saveSettings')}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────

function SettingsCard({ title, desc, children, C, danger }) {
  return (
    <div style={{ background: C.cardBg, border: '1px solid ' + (danger ? '#e74c3c44' : C.cardBorder), borderLeft: '4px solid ' + (danger ? '#e74c3c' : '#c9a84c'), borderRadius: '0 14px 14px 0', padding: '1.25rem 1.5rem' }}>
      <div style={{ marginBottom: children ? '0.85rem' : 0 }}>
        <h3 style={{ color: C.title, fontWeight: '800', fontSize: '1rem', margin: '0 0 0.2rem', fontFamily: 'Georgia,serif' }}>{title}</h3>
        {desc && <p style={{ color: C.muted, fontSize: '0.85rem', margin: 0, lineHeight: '1.6' }}>{desc}</p>}
      </div>
      {children}
    </div>
  )
}

function Toggle({ value, onChange, accent }) {
  return (
    <button onClick={() => onChange(!value)} style={{ width: '52px', height: '28px', borderRadius: '999px', border: 'none', cursor: 'pointer', background: value ? accent : '#888', position: 'relative', transition: 'background 0.25s', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: '3px', left: value ? '27px' : '3px', width: '22px', height: '22px', borderRadius: '50%', background: '#fff', transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
    </button>
  )
}

function RadioGroup({ options, value, onChange, accent, C }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
      {options.map(opt => (
        <button key={opt.value} onClick={() => onChange(opt.value)} style={{ padding: '0.45rem 1rem', borderRadius: '999px', cursor: 'pointer', background: value === opt.value ? accent + '22' : 'transparent', border: '2px solid ' + (value === opt.value ? accent : C.cardBorder), color: value === opt.value ? accent : C.muted, fontFamily: 'Georgia,serif', fontSize: '0.85rem', fontWeight: value === opt.value ? '700' : '500', transition: 'all 0.18s' }}>
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function SelectInput({ options, value, onChange, C }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ background: C.inputBg, border: '2px solid ' + C.inputBorder, borderRadius: '8px', padding: '0.6rem 1rem', color: C.inputColor, fontSize: '0.95rem', fontFamily: 'Georgia,serif', outline: 'none', cursor: 'pointer', marginTop: '0.5rem', minWidth: '200px' }}>
      {options.map(o => <option key={o} value={o.toLowerCase()}>{o}</option>)}
    </select>
  )
}

function ProgressSummary({ C, accent }) {
  const stats  = loadJSON('scripturehub_stats', {})
  const stones = loadJSON('scripturehub_stones', [])
  const eggs   = loadJSON('scripturehub_eggs_found', [])
  const amened = loadJSON('scripturehub_amened', [])
  const items  = [
    { icon: '🪨', label: 'Stones Carved',  value: stats.stones   || stones.length || 0 },
    { icon: '🙏', label: 'Amens Given',    value: stats.amens    || amened.length || 0 },
    { icon: '📜', label: 'Quizzes Done',   value: stats.quizzes  || 0 },
    { icon: '📖', label: 'Chapters Read',  value: stats.chapters || 0 },
    { icon: '🔍', label: 'Eggs Found',     value: eggs.length },
    { icon: '🕊️', label: 'Missions Done',  value: stats.missions || 0 },
    { icon: '🔥', label: 'Day Streak',     value: stats.streak   || 0 },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
      {items.map(item => (
        <div key={item.label} style={{ background: C.pageBg, border: '1px solid ' + C.cardBorder, borderRadius: '12px', padding: '0.85rem', textAlign: 'center' }}>
          <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.3rem' }}>{item.icon}</span>
          <p style={{ color: accent, fontWeight: '800', fontSize: '1.2rem', margin: '0 0 0.15rem', fontFamily: 'Georgia,serif' }}>{item.value}</p>
          <p style={{ color: C.muted, fontSize: '0.72rem', margin: 0, lineHeight: '1.4', fontWeight: '600' }}>{item.label}</p>
        </div>
      ))}
    </div>
  )
}