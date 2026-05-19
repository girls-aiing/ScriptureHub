import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import { playNavClick } from '../hooks/useSound.js'

export default function Navbar({ toggleSlot }) {
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [discoveryOpen, setDiscoveryOpen] = useState(false)
  const [aiOpen,        setAiOpen]        = useState(false)
  const [prayerOpen,    setPrayerOpen]    = useState(false)

  const location = useLocation()
  const { t }    = useLanguage()

  const discoveryRef = useRef(null)
  const aiRef        = useRef(null)
  const prayerRef    = useRef(null)

  useEffect(() => {
    setMenuOpen(false)
    setDiscoveryOpen(false)
    setAiOpen(false)
    setPrayerOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function handleOutside(e) {
      if (discoveryRef.current && !discoveryRef.current.contains(e.target)) setDiscoveryOpen(false)
      if (aiRef.current        && !aiRef.current.contains(e.target))        setAiOpen(false)
      if (prayerRef.current    && !prayerRef.current.contains(e.target))    setPrayerOpen(false)
    }
    document.addEventListener('mousedown',  handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown',  handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [])

  const closeMenu  = () => {
    setMenuOpen(false)
    setDiscoveryOpen(false)
    setAiOpen(false)
    setPrayerOpen(false)
  }
  const toggleMenu = () => setMenuOpen(prev => !prev)

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname === path

  // Updated to include /dreams in the discovery active tabs list
  const isDiscoveryActive = ['/did-you-know', '/secrets', '/maps', '/name-dictionary', '/dreams'].includes(location.pathname)
  const isAiActive        = ['/ai', '/values', '/search'].includes(location.pathname)
  const isPrayerActive    = ['/prayer-guide', '/prayer', '/progress'].includes(location.pathname)

  const openAi        = () => { setAiOpen(p => !p);        setDiscoveryOpen(false); setPrayerOpen(false) }
  const openDiscovery = () => { setDiscoveryOpen(p => !p); setAiOpen(false);        setPrayerOpen(false) }
  const openPrayer    = () => { setPrayerOpen(p => !p);    setAiOpen(false);        setDiscoveryOpen(false) }

  return (
    <>
      <style>{`
        .navbar {
          background-color: #1a0a2e;
          padding: 0 2rem;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 12px rgba(0,0,0,0.4);
        }
        .navbar__brand {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .navbar__brand-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #f0c040;
          letter-spacing: 0.03em;
        }
        .navbar__brand-tagline {
          font-family: 'Montserrat', system-ui, sans-serif;
          font-size: 0.65rem;
          color: #a89bc2;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-top: -2px;
        }
        .navbar__links {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          list-style: none;
          margin: 0;
          padding: 0;
          flex-wrap: nowrap;
        }
        .navbar__links a {
          font-family: 'Montserrat', system-ui, sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          color: #c8b8e8;
          text-decoration: none;
          padding: 0.45rem 0.75rem;
          border-radius: 6px;
          transition: color 0.2s, background-color 0.2s;
          white-space: nowrap;
          display: block;
        }
        .navbar__links a:hover {
          color: #fff;
          background-color: rgba(240,192,64,0.12);
        }
        .navbar__links a.active {
          color: #f0c040;
          background-color: rgba(240,192,64,0.15);
          font-weight: 600;
        }
        .navbar__links a.progress-link {
          color: #f0c040;
          border: 1px solid rgba(240,192,64,0.35);
          border-radius: 20px;
          padding: 0.35rem 0.85rem;
          font-weight: 600;
        }
        .navbar__links a.progress-link:hover,
        .navbar__links a.progress-link.active {
          background-color: rgba(240,192,64,0.18);
        }
        .navbar__divider {
          width: 1px;
          height: 22px;
          background: rgba(240,192,64,0.2);
          flex-shrink: 0;
          margin: 0 0.25rem;
        }
        .dropdown-wrapper { position: relative; }
        .dropdown-trigger {
          font-family: 'Montserrat', system-ui, sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          color: #c8b8e8;
          background: none;
          border: none;
          padding: 0.45rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          transition: color 0.2s, background-color 0.2s;
        }
        .dropdown-trigger:hover,
        .dropdown-trigger.active {
          color: #f0c040;
          background-color: rgba(240,192,64,0.12);
        }
        .dropdown-trigger.active { font-weight: 600; }
        .dropdown-caret {
          font-size: 0.6rem;
          transition: transform 0.2s;
          display: inline-block;
        }
        .dropdown-caret.open { transform: rotate(180deg); }
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: #1a0a2e;
          border: 1px solid rgba(240,192,64,0.3);
          border-radius: 12px;
          padding: 6px;
          min-width: 220px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.6);
          z-index: 2000;
          animation: dropIn 0.18s ease;
        }
        @keyframes dropIn {
          from { opacity:0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity:1; transform: translateX(-50%) translateY(0); }
        }
        .dropdown-menu a {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 8px;
          font-family: 'Montserrat', system-ui, sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: #c8b8e8;
          text-decoration: none;
          transition: color 0.2s, background-color 0.2s;
          white-space: nowrap;
        }
        .dropdown-menu a:hover,
        .dropdown-menu a.active {
          color: #f0c040;
          background-color: rgba(240,192,64,0.1);
        }
        .dropdown-menu a.active { font-weight: 600; }
        .dropdown-divider {
          height: 1px;
          background: rgba(240,192,64,0.15);
          margin: 4px 6px;
        }
        .dropdown-label {
          font-family: 'Montserrat', system-ui, sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          color: rgba(240,192,64,0.5);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 6px 14px 2px;
        }
        .navbar__right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
          margin-left: 0.75rem;
        }
        .navbar__hamburger {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 28px;
          height: 20px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
        }
        .navbar__hamburger span {
          display: block;
          height: 2px;
          background-color: #f0c040;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .navbar__hamburger span.open:nth-child(1) { transform: translateY(9px) rotate(45deg); }
        .navbar__hamburger span.open:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .navbar__hamburger span.open:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }
        .navbar__mobile-menu {
          background-color: #1a0a2e;
          border-top: 1px solid rgba(240,192,64,0.2);
          padding: 0.75rem 1.25rem 1.5rem;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          animation: slideDown 0.25s ease;
          max-height: 85vh;
          overflow-y: auto;
          position: sticky;
          top: 70px;
          z-index: 999;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .navbar__mobile-menu ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }
        .navbar__mobile-menu a {
          display: flex;
          align-items: center;
          font-family: 'Montserrat', system-ui, sans-serif;
          font-size: 1rem;
          font-weight: 500;
          color: #c8b8e8;
          text-decoration: none;
          padding: 0.85rem 1rem;
          border-radius: 8px;
          transition: color 0.2s, background-color 0.2s;
          min-height: 48px;
        }
        .navbar__mobile-menu a:hover,
        .navbar__mobile-menu a.active {
          color: #f0c040;
          background-color: rgba(240,192,64,0.1);
        }
        .navbar__mobile-menu a.progress-link {
          color: #f0c040;
          font-weight: 700;
          border: 1px solid rgba(240,192,64,0.3);
          border-radius: 10px;
          margin-top: 0.25rem;
        }
        .navbar__mobile-menu a.progress-link:hover,
        .navbar__mobile-menu a.progress-link.active {
          background-color: rgba(240,192,64,0.15);
        }
        .navbar__mobile-divider {
          height: 1px;
          background: rgba(240,192,64,0.15);
          margin: 0.6rem 0;
        }
        .mobile-section-header {
          font-family: 'Montserrat', system-ui, sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          color: rgba(240,192,64,0.55);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.5rem 1rem 0.25rem;
        }
        .mobile-sub-item {
          display: flex;
          align-items: center;
          font-family: 'Montserrat', system-ui, sans-serif;
          font-size: 1rem;
          font-weight: 500;
          color: #c8b8e8;
          text-decoration: none;
          padding: 0.75rem 1rem 0.75rem 1.75rem;
          border-radius: 8px;
          transition: color 0.2s, background-color 0.2s;
          min-height: 44px;
          border-left: 2px solid rgba(240,192,64,0.2);
          margin-left: 0.5rem;
        }
        .mobile-sub-item:hover,
        .mobile-sub-item.active {
          color: #f0c040;
          background-color: rgba(240,192,64,0.08);
          border-left-color: #f0c040;
        }
        @media (max-width: 1200px) {
          .navbar__links a,
          .dropdown-trigger { font-size: 0.7rem; padding: 0.4rem 0.55rem; }
        }
        @media (max-width: 768px) {
          .navbar { padding: 0 1.25rem; height: 60px; }
          .navbar__links { display: none; }
          .navbar__hamburger { display: flex; }
          .navbar__right { margin-left: 0; }
          .navbar__mobile-menu { top: 60px; }
          .navbar__brand-name { font-size: 1.2rem; }
        }
        @media (max-width: 380px) {
          .navbar { padding: 0 1rem; }
          .navbar__brand-name { font-size: 1rem; }
          .navbar__brand-tagline { display: none; }
        }
      `}</style>

      {/* ════════ NAVBAR BAR ════════ */}
      <nav className="navbar" role="navigation" aria-label="Main navigation">

        {/* Brand */}
        <Link to="/" className="navbar__brand" onClick={() => { closeMenu(); playNavClick() }}>
          <span style={{ fontSize: '1.6rem' }}>✦</span>
          <div>
            <div className="navbar__brand-name">ScriptureHub</div>
            <div className="navbar__brand-tagline">by Silas Clergy</div>
          </div>
        </Link>

        {/* ── Desktop Links ── */}
        <ul className="navbar__links" role="list">

          {/* Home */}
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}
              onClick={() => { closeMenu(); playNavClick() }}>
              {t('home')}
            </Link>
          </li>

          {/* Bible */}
          <li>
            <Link to="/bible" className={isActive('/bible') ? 'active' : ''}
              onClick={() => { closeMenu(); playNavClick() }}>
              {t('bible')}
            </Link>
          </li>

          {/* Quizzes */}
          <li>
            <Link to="/quizzes" className={isActive('/quizzes') ? 'active' : ''}
              onClick={() => { closeMenu(); playNavClick() }}>
              {t('quizzes')}
            </Link>
          </li>

          {/* ── AI Advisor Dropdown ── */}
          <li ref={aiRef} className="dropdown-wrapper">
            <button
              className={`dropdown-trigger${isAiActive ? ' active' : ''}`}
              onClick={() => { openAi(); playNavClick() }}
              aria-expanded={aiOpen}
              aria-haspopup="true"
            >
              🤖 AI Advisor
              <span className={`dropdown-caret${aiOpen ? ' open' : ''}`}>▼</span>
            </button>
            {aiOpen && (
              <div className="dropdown-menu" role="menu">
                <div className="dropdown-label">AI Tools</div>
                <Link to="/ai" className={isActive('/ai') ? 'active' : ''}
                  role="menuitem" onClick={() => { closeMenu(); playNavClick() }}>
                  <span style={{ fontSize:'1.1rem' }}>🤖</span>
                  <div>
                    <div style={{ fontWeight:'600', marginBottom:'2px' }}>AI Advisor</div>
                    <div style={{ fontSize:'0.72rem', color:'#a89bc2', fontWeight:'400' }}>Ask any Bible question</div>
                  </div>
                </Link>
                <div className="dropdown-divider" />
                <Link to="/search" className={isActive('/search') ? 'active' : ''}
                  role="menuitem" onClick={() => { closeMenu(); playNavClick() }}>
                  <span style={{ fontSize:'1.1rem' }}>🔍</span>
                  <div>
                    <div style={{ fontWeight:'600', marginBottom:'2px' }}>AI Deep Search</div>
                    <div style={{ fontSize:'0.72rem', color:'#a89bc2', fontWeight:'400' }}>Search by feeling or need</div>
                  </div>
                </Link>
                <div className="dropdown-divider" />
                <div className="dropdown-label">Growth</div>
                <Link to="/values" className={isActive('/values') ? 'active' : ''}
                  role="menuitem" onClick={() => { closeMenu(); playNavClick() }}>
                  <span style={{ fontSize:'1.1rem' }}>🌟</span>
                  <div>
                    <div style={{ fontWeight:'600', marginBottom:'2px' }}>Values Hub</div>
                    <div style={{ fontSize:'0.72rem', color:'#a89bc2', fontWeight:'400' }}>Scriptures &amp; life advice</div>
                  </div>
                </Link>
              </div>
            )}
          </li>

          {/* ── Discovery Dropdown ── */}
          <li ref={discoveryRef} className="dropdown-wrapper">
            <button
              className={`dropdown-trigger${isDiscoveryActive ? ' active' : ''}`}
              onClick={() => { openDiscovery(); playNavClick() }}
              aria-expanded={discoveryOpen}
              aria-haspopup="true"
            >
              💡 Discover
              <span className={`dropdown-caret${discoveryOpen ? ' open' : ''}`}>▼</span>
            </button>
            {discoveryOpen && (
              <div className="dropdown-menu" role="menu">
                <div className="dropdown-label">Explore</div>
                <Link to="/did-you-know" className={isActive('/did-you-know') ? 'active' : ''}
                  role="menuitem" onClick={() => { closeMenu(); playNavClick() }}>
                  <span style={{ fontSize:'1.1rem' }}>💡</span>
                  <div>
                    <div style={{ fontWeight:'600', marginBottom:'2px' }}>Did You Know?</div>
                    <div style={{ fontSize:'0.72rem', color:'#a89bc2', fontWeight:'400' }}>Bible facts &amp; wonders</div>
                  </div>
                </Link>
                <div className="dropdown-divider" />
                <Link to="/secrets" className={isActive('/secrets') ? 'active' : ''}
                  role="menuitem" onClick={() => { closeMenu(); playNavClick() }}>
                  <span style={{ fontSize:'1.1rem' }}>🔍</span>
                  <div>
                    <div style={{ fontWeight:'600', marginBottom:'2px' }}>Biblical Secrets</div>
                    <div style={{ fontSize:'0.72rem', color:'#a89bc2', fontWeight:'400' }}>60 flip-card discoveries</div>
                  </div>
                </Link>
                <div className="dropdown-divider" />
                <Link to="/maps" className={isActive('/maps') ? 'active' : ''}
                  role="menuitem" onClick={() => { closeMenu(); playNavClick() }}>
                  <span style={{ fontSize:'1.1rem' }}>🗺️</span>
                  <div>
                    <div style={{ fontWeight:'600', marginBottom:'2px' }}>Bible Maps</div>
                    <div style={{ fontSize:'0.72rem', color:'#a89bc2', fontWeight:'400' }}>Interactive maps &amp; timelines</div>
                  </div>
                </Link>
                <div className="dropdown-divider" />
                <Link to="/name-dictionary" className={isActive('/name-dictionary') ? 'active' : ''}
                  role="menuitem" onClick={() => { closeMenu(); playNavClick() }}>
                  <span style={{ fontSize:'1.1rem' }}>📖</span>
                  <div>
                    <div style={{ fontWeight:'600', marginBottom:'2px' }}>Name Dictionary</div>
                    <div style={{ fontSize:'0.72rem', color:'#a89bc2', fontWeight:'400' }}>Meaning &amp; origin of any name</div>
                  </div>
                </Link>
                {/* Desktop Dropdown Link added for Dream Interpreter */}
                <div className="dropdown-divider" />
                <Link to="/dreams" className={isActive('/dreams') ? 'active' : ''}
                  role="menuitem" onClick={() => { closeMenu(); playNavClick() }}>
                  <span style={{ fontSize:'1.1rem' }}>🌙</span>
                  <div>
                    <div style={{ fontWeight:'600', marginBottom:'2px' }}>Dream Interpreter</div>
                    <div style={{ fontSize:'0.72rem', color:'#a89bc2', fontWeight:'400' }}>Biblical meanings of dreams</div>
                  </div>
                </Link>
              </div>
            )}
          </li>

          <li aria-hidden="true"><div className="navbar__divider" /></li>

          {/* Games */}
          <li>
            <Link to="/games" className={isActive('/games') ? 'active' : ''}
              onClick={() => { closeMenu(); playNavClick() }}>
              🎮 {t('games')}
            </Link>
          </li>

          {/* Community */}
          <li>
            <Link to="/community" className={isActive('/community') ? 'active' : ''}
              onClick={() => { closeMenu(); playNavClick() }}>
              🏛️ {t('community')}
            </Link>
          </li>

          {/* Settings */}
          <li>
            <Link to="/settings" className={isActive('/settings') ? 'active' : ''}
              onClick={() => { closeMenu(); playNavClick() }}>
              ⚙️ {t('settings')}
            </Link>
          </li>

          <li aria-hidden="true"><div className="navbar__divider" /></li>

          {/* ── My Journey Dropdown ── */}
          <li ref={prayerRef} className="dropdown-wrapper">
            <button
              className={`dropdown-trigger${isPrayerActive ? ' active' : ''}`}
              onClick={() => { openPrayer(); playNavClick() }}
              aria-expanded={prayerOpen}
              aria-haspopup="true"
            >
              🙏 My Journey
              <span className={`dropdown-caret${prayerOpen ? ' open' : ''}`}>▼</span>
            </button>
            {prayerOpen && (
              <div className="dropdown-menu" role="menu">
                <div className="dropdown-label">Personal</div>
                <Link to="/prayer-guide" className={isActive('/prayer-guide') ? 'active' : ''}
                  role="menuitem" onClick={() => { closeMenu(); playNavClick() }}>
                  <span style={{ fontSize:'1.1rem' }}>🙏</span>
                  <div>
                    <div style={{ fontWeight:'600', marginBottom:'2px' }}>Let's Pray</div>
                    <div style={{ fontSize:'0.72rem', color:'#a89bc2', fontWeight:'400' }}>Guided prayer with Dr. Silas</div>
                  </div>
                </Link>
                <div className="dropdown-divider" />
                <Link to="/prayer" className={isActive('/prayer') ? 'active' : ''}
                  role="menuitem" onClick={() => { closeMenu(); playNavClick() }}>
                  <span style={{ fontSize:'1.1rem' }}>📔</span>
                  <div>
                    <div style={{ fontWeight:'600', marginBottom:'2px' }}>Prayer Journal</div>
                    <div style={{ fontSize:'0.72rem', color:'#a89bc2', fontWeight:'400' }}>Private prayers &amp; answered ones</div>
                  </div>
                </Link>
                <div className="dropdown-divider" />
                <Link to="/progress" className={isActive('/progress') ? 'active' : ''}
                  role="menuitem" onClick={() => { closeMenu(); playNavClick() }}>
                  <span style={{ fontSize:'1.1rem' }}>📊</span>
                  <div>
                    <div style={{ fontWeight:'600', marginBottom:'2px' }}>Study Progress</div>
                    <div style={{ fontSize:'0.72rem', color:'#a89bc2', fontWeight:'400' }}>Track your Bible reading</div>
                  </div>
                </Link>
              </div>
            )}
          </li>

        </ul>

        {/* Right: Dark mode toggle + Hamburger */}
        <div className="navbar__right">
          {toggleSlot}
          <button
            className="navbar__hamburger"
            onClick={() => { toggleMenu(); playNavClick() }}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={menuOpen ? 'open' : ''} />
            <span className={menuOpen ? 'open' : ''} />
            <span className={menuOpen ? 'open' : ''} />
          </button>
        </div>

      </nav>

      {/* ════════ MOBILE DROPDOWN MENU ════════ */}
      {menuOpen && (
        <div className="navbar__mobile-menu" role="dialog" aria-label="Mobile navigation">

          {/* Main pages */}
          <ul role="list">
            <li>
              <Link to="/" className={isActive('/') ? 'active' : ''}
                onClick={() => { closeMenu(); playNavClick() }}>
                🏠 {t('home')}
              </Link>
            </li>
            <li>
              <Link to="/bible" className={isActive('/bible') ? 'active' : ''}
                onClick={() => { closeMenu(); playNavClick() }}>
                📖 {t('bible')}
              </Link>
            </li>
            <li>
              <Link to="/quizzes" className={isActive('/quizzes') ? 'active' : ''}
                onClick={() => { closeMenu(); playNavClick() }}>
                🧠 {t('quizzes')}
              </Link>
            </li>
          </ul>

          <div className="navbar__mobile-divider" />

          {/* AI Advisor section */}
          <div className="mobile-section-header">🤖 AI Advisor</div>
          <Link to="/ai"
            className={`mobile-sub-item${isActive('/ai') ? ' active' : ''}`}
            onClick={() => { closeMenu(); playNavClick() }}>
            🤖 AI Advisor
          </Link>
          <Link to="/search"
            className={`mobile-sub-item${isActive('/search') ? ' active' : ''}`}
            onClick={() => { closeMenu(); playNavClick() }}>
            🔍 AI Deep Search
          </Link>
          <Link to="/values"
            className={`mobile-sub-item${isActive('/values') ? ' active' : ''}`}
            onClick={() => { closeMenu(); playNavClick() }}>
            🌟 Values Hub
          </Link>

          <div className="navbar__mobile-divider" />

          {/* Discovery section */}
          <div className="mobile-section-header">💡 Discover</div>
          <Link to="/did-you-know"
            className={`mobile-sub-item${isActive('/did-you-know') ? ' active' : ''}`}
            onClick={() => { closeMenu(); playNavClick() }}>
            💡 Did You Know?
          </Link>
          <Link to="/secrets"
            className={`mobile-sub-item${isActive('/secrets') ? ' active' : ''}`}
            onClick={() => { closeMenu(); playNavClick() }}>
            🔍 Biblical Secrets
          </Link>
          <Link to="/maps"
            className={`mobile-sub-item${isActive('/maps') ? ' active' : ''}`}
            onClick={() => { closeMenu(); playNavClick() }}>
            🗺️ Bible Maps
          </Link>
          <Link to="/name-dictionary"
            className={`mobile-sub-item${isActive('/name-dictionary') ? ' active' : ''}`}
            onClick={() => { closeMenu(); playNavClick() }}>
            📖 Name Dictionary
          </Link>
          {/* Mobile Menu Item added for Dream Interpreter */}
          <Link to="/dreams"
            className={`mobile-sub-item${isActive('/dreams') ? ' active' : ''}`}
            onClick={() => { closeMenu(); playNavClick() }}>
            🌙 Dream Interpreter
          </Link>

          <div className="navbar__mobile-divider" />

          {/* Extra pages */}
          <ul role="list">
            <li>
              <Link to="/games" className={isActive('/games') ? 'active' : ''}
                onClick={() => { closeMenu(); playNavClick() }}>
                🎮 {t('games')}
              </Link>
            </li>
            <li>
              <Link to="/community" className={isActive('/community') ? 'active' : ''}
                onClick={() => { closeMenu(); playNavClick() }}>
                🏛️ {t('community')}
              </Link>
            </li>
            <li>
              <Link to="/settings" className={isActive('/settings') ? 'active' : ''}
                onClick={() => { closeMenu(); playNavClick() }}>
                ⚙️ {t('settings')}
              </Link>
            </li>
          </ul>

          <div className="navbar__mobile-divider" />

          {/* My Journey section */}
          <div className="mobile-section-header">🙏 My Journey</div>
          <Link to="/prayer-guide"
            className={`mobile-sub-item${isActive('/prayer-guide') ? ' active' : ''}`}
            onClick={() => { closeMenu(); playNavClick() }}>
            🙏 Let's Pray
          </Link>
          <Link to="/prayer"
            className={`mobile-sub-item${isActive('/prayer') ? ' active' : ''}`}
            onClick={() => { closeMenu(); playNavClick() }}>
            📔 Prayer Journal
          </Link>
          <Link to="/progress"
            className={`mobile-sub-item${isActive('/progress') ? ' active' : ''}`}
            onClick={() => { closeMenu(); playNavClick() }}>
            📊 Study Progress
          </Link>

        </div>
      )}
    </>
  )
}