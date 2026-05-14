import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

import { ThemeProvider }    from './context/ThemeContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'

import Navbar         from './components/Navbar.jsx'
import Footer         from './components/Footer.jsx'
import FloatingChat   from './components/FloatingChat.jsx'
import DarkModeToggle from './components/DarkModeToggle.jsx'
import VoiceGuide     from './components/VoiceGuide.jsx'

import HomePage             from './pages/HomePage.jsx'
import BibleReaderPage      from './pages/BibleReaderPage.jsx'
import KnowledgeHubPage     from './pages/KnowledgeHubPage.jsx'
import AIAdvicePage         from './pages/AIAdvicePage.jsx'
import DidYouKnowPage       from './pages/DidYouKnowPage.jsx'
import GamesPage            from './pages/GamesPage.jsx'
import CommunityPage        from './pages/CommunityPage.jsx'
import SettingsPage         from './pages/SettingsPage.jsx'
import NotFoundPage         from './pages/NotFoundPage.jsx'
import StudyProgressPage    from './pages/StudyProgressPage.jsx'
import ValuesHubPage        from './pages/ValuesHubPage.jsx'
import BiblicalSecretsPage  from './pages/BiblicalSecretsPage.jsx'
import PrayerJournalPage    from './pages/PrayerJournalPage.jsx'
import PrayerTab            from './pages/PrayerTab.jsx'
import BibleMapsPage        from './pages/BibleMapsPage.jsx'
import DeepSearchPage       from './pages/DeepSearchPage.jsx'

// Pages where the floating chat should be hidden
const HIDDEN_CHAT_PATHS = ['/ai']

function ConditionalFooter() {
  const { pathname } = useLocation()
  return pathname === '/' ? <Footer /> : null
}

function ConditionalChat() {
  const { pathname } = useLocation()
  return HIDDEN_CHAT_PATHS.includes(pathname) ? null : <FloatingChat />
}

function AppShell() {
  return (
    <div className="app-shell">
      <Navbar toggleSlot={<DarkModeToggle />} />
      <main className="app-main">
        <Routes>
          <Route path="/"             element={<HomePage />} />
          <Route path="/bible"        element={<BibleReaderPage />} />
          <Route path="/quizzes"      element={<KnowledgeHubPage />} />
          <Route path="/ai"           element={<AIAdvicePage />} />
          <Route path="/did-you-know" element={<DidYouKnowPage />} />
          <Route path="/games"        element={<GamesPage />} />
          <Route path="/community"    element={<CommunityPage />} />
          <Route path="/settings"     element={<SettingsPage />} />
          <Route path="/progress"     element={<StudyProgressPage />} />
          <Route path="/values"       element={<ValuesHubPage />} />
          <Route path="/secrets"      element={<BiblicalSecretsPage />} />
          <Route path="/prayer"       element={<PrayerJournalPage />} />
          <Route path="/prayer-guide" element={<PrayerTab />} />
          <Route path="/maps"         element={<BibleMapsPage />} />
          <Route path="/search"       element={<DeepSearchPage />} />
          <Route path="*"             element={<NotFoundPage />} />
        </Routes>
      </main>
      <ConditionalFooter />
      <ConditionalChat />
      <VoiceGuide />
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  )
}