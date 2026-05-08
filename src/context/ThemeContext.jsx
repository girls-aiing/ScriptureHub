import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('scripturehub_darkmode') === 'true' }
    catch { return false }
  })

  useEffect(() => {
    try { localStorage.setItem('scripturehub_darkmode', String(darkMode)) }
    catch {}
    document.body.style.background = darkMode ? '#0a0500' : '#f5f0e8'
  }, [darkMode])

  function toggleDarkMode() {
    setDarkMode(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}