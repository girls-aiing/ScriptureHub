import React from 'react'
import { useTheme } from '../context/ThemeContext.jsx'

export default function DarkModeToggle() {
  const { darkMode, setDarkMode } = useTheme()

  return (
    <button
      onClick={() => setDarkMode(p => !p)}
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Evening Study Mode'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: darkMode
          ? 'rgba(201,168,76,0.15)'
          : 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(201,168,76,0.3)',
        borderRadius: '20px',
        padding: '0.35rem 0.85rem',
        color: darkMode ? '#c9a84c' : 'rgba(240,230,210,0.6)',
        fontSize: '0.78rem',
        fontFamily: 'Georgia, serif',
        cursor: 'pointer',
        transition: 'all 0.3s',
        whiteSpace: 'nowrap',
      }}
    >
      {darkMode ? '☀️ Light Mode' : '🌙 Evening Study'}
    </button>
  )
}