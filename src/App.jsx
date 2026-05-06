/**
 * ════════════════════════════════════════════════════════════════
 * ScriptureHub — App Shell
 * Created by Silas Clergy
 *
 * PROJECT STRUCTURE AT A GLANCE
 * ─────────────────────────────
 * src/
 *  ├── main.jsx              → Mounts the React app into index.html's #root div
 *  ├── App.jsx               → THIS FILE: sets up all page routes + layout shell
 *  ├── index.css             → Global styles: fonts, colours, resets, utilities
 *  │
 *  ├── pages/               → One file per page — each page has ONE clear job
 *  │   ├── HomePage.jsx          → Landing page: hero, features, call-to-action
 *  │   ├── BibleReaderPage.jsx   → Offline Scripture reader (Zero-Data Mode)
 *  │   ├── KnowledgeHubPage.jsx  → 1,000+ gamified Bible quizzes
 *  │   ├── AIConsultantPage.jsx  → Theological AI for scholarly Q&A
 *  │   ├── GrowthDashboardPage.jsx → Personal faith-growth tracking
 *  │   └── NotFoundPage.jsx      → Friendly 404 fallback page
 *  │
 *  └── components/          → Reusable UI building blocks used across pages
 *      ├── Navbar.jsx            → Sticky top nav — all links use react-router <Link>
 *      ├── Footer.jsx            → Site footer with links + attribution
 *      ├── FeatureCard.jsx       → Homepage feature highlight card
 *      ├── QuizCard.jsx          → Individual quiz display card
 *      ├── DidYouKnowCard.jsx    → Scriptural "secret" reveal card
 *      ├── ChatBubble.jsx        → AI conversation message bubble
 *      ├── StatCard.jsx          → Single growth stat (e.g. "42 quizzes completed")
 *      ├── MonthlyReport.jsx     → Monthly faith-progress summary panel
 *      ├── DifficultyBadge.jsx   → Beginner / Scholar / Master badge chip
 *      └── SuggestedPrompt.jsx   → Clickable AI prompt suggestion chip
 *
 * HOW ROUTING WORKS
 * ─────────────────
 * BrowserRouter wraps the whole app so every component can access
 * the current URL. <Routes> picks the ONE matching <Route> to render.
 * The Navbar and Footer sit outside <Routes> so they appear on every page.
 *
 * ADDING A NEW PAGE (3 steps):
 *   1. Create   src/pages/MyNewPage.jsx
 *   2. Import   it at the top of this file
 *   3. Add      <Route path="/my-new-page" element={<MyNewPage />} />
 * ════════════════════════════════════════════════════════════════
 */

import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// ── Layout Components (visible on every page) ───────────────────────────────
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

// ── Page Components (each handles one route) ────────────────────────────────
import HomePage             from './pages/HomePage.jsx'
import BibleReaderPage      from './pages/BibleReaderPage.jsx'
import KnowledgeHubPage     from './pages/KnowledgeHubPage.jsx'
import AIConsultantPage     from './pages/AIConsultantPage.jsx'
import GrowthDashboardPage  from './pages/GrowthDashboardPage.jsx'
import NotFoundPage         from './pages/NotFoundPage.jsx'

export default function App() {
  return (
    /**
     * BrowserRouter — provides URL-awareness to the whole app.
     * Every <Link>, <Route>, and useLocation() call works because
     * BrowserRouter wraps everything here at the top level.
     */
    <BrowserRouter>

      {/*
        App layout: a vertical flex column that fills the full viewport height.
        This ensures the Footer always sticks to the bottom of the page,
        even on pages with very little content.
      */}
      <div className="app-shell">

        {/* Navbar is outside <Routes> — it shows on EVERY page */}
        <Navbar />

        {/*
          <main> is the content area between Navbar and Footer.
          flex: 1 makes it grow to fill all available vertical space.
          Each <Route> swaps in the matching page component here.
        */}
        <main className="app-main">
          <Routes>
            {/* ── Primary Routes ── */}
            <Route path="/"           element={<HomePage />} />
            <Route path="/bible"      element={<BibleReaderPage />} />
            <Route path="/quizzes"    element={<KnowledgeHubPage />} />
            <Route path="/ai"         element={<AIConsultantPage />} />
            <Route path="/dashboard" element={<GrowthDashboardPage />} />

            {/*
              Catch-all route — the * means "any path not matched above".
              Always keep this LAST so it only fires when nothing else matches.
            */}
            <Route path="*"           element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Footer is outside <Routes> — it shows on EVERY page */}
        <Footer />

      </div>
    </BrowserRouter>
  )
}
