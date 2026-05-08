import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import { playNavClick } from '../hooks/useSound.js'

export default function Navbar({ toggleSlot }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location  = useLocation()
  const { t }     = useLanguage()

  // Auto-close menu when page changes
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const closeMenu  = () => setMenuOpen(false)
  const toggleMenu = () => setMenuOpen(prev => !prev)

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname === path

  return (
    <>
      <style>{`
        /* ── Navbar Base ── */
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

        /* ── Brand ── */
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

        /* ── Desktop Links ── */
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

        /* ── Divider ── */
        .navbar__divider {
          width: 1px;
          height: 22px;
          background: rgba(240,192,64,0.2);
          flex-shrink: 0;
          margin: 0 0.25rem;
        }

        /* ── Right Side ── */
        .navbar__right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
          margin-left: 0.75rem;
        }

        /* ── Hamburger Button ── */
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
        .navbar__hamburger span.open:nth-child(1) {
          transform: translateY(9px) rotate(45deg);
        }
        .navbar__hamburger span.open:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .navbar__hamburger span.open:nth-child(3) {
          transform: translateY(-9px) rotate(-45deg);
        }

        /* ── Mobile Menu ── */
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

        /* ── Tablet adjustments ── */
        @media (max-width: 1200px) {
          .navbar__links a {
            font-size: 0.7rem;
            padding: 0.4rem 0.55rem;
          }
        }

        /* ── Mobile: hide desktop links, show hamburger ── */
        @media (max-width: 768px) {
          .navbar {
            padding: 0 1.25rem;
            height: 60px;
          }
          .navbar__links {
            display: none;
          }
          .navbar__hamburger {
            display: flex;
          }
          .navbar__right {
            margin-left: 0;
          }
          .navbar__mobile-menu {
            top: 60px;
          }
          .navbar__brand-name {
            font-size: 1.2rem;
          }
        }

        /* ── Very small phones ── */
        @media (max-width: 380px) {
          .navbar {
            padding: 0 1rem;
          }
          .navbar__brand-name {
            font-size: 1rem;
          }
          .navbar__brand-tagline {
            display: none;
          }
        }
      `}</style>

      {/* ════════ NAVBAR BAR ════════ */}
      <nav className="navbar" role="navigation" aria-label="Main navigation">

        {/* Brand */}
        <Link
          to="/"
          className="navbar__brand"
          onClick={() => { closeMenu(); playNavClick() }}
        >
          <span style={{ fontSize: '1.6rem' }}>✦</span>
          <div>
            <div className="navbar__brand-name">ScriptureHub</div>
            <div className="navbar__brand-tagline">by Silas Clergy</div>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul className="navbar__links" role="list">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}
              onClick={() => { closeMenu(); playNavClick() }}>
              {t('home')}
            </Link>
          </li>
          <li>
            <Link to="/bible" className={isActive('/bible') ? 'active' : ''}
              onClick={() => { closeMenu(); playNavClick() }}>
              {t('bible')}
            </Link>
          </li>
          <li>
            <Link to="/quizzes" className={isActive('/quizzes') ? 'active' : ''}
              onClick={() => { closeMenu(); playNavClick() }}>
              {t('quizzes')}
            </Link>
          </li>
          <li>
            <Link to="/ai" className={isActive('/ai') ? 'active' : ''}
              onClick={() => { closeMenu(); playNavClick() }}>
              {t('askAI')}
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}
              onClick={() => { closeMenu(); playNavClick() }}>
              {t('dashboard')}
            </Link>
          </li>
          <li>
            <Link to="/did-you-know" className={isActive('/did-you-know') ? 'active' : ''}
              onClick={() => { closeMenu(); playNavClick() }}>
              {t('didYouKnow')}
            </Link>
          </li>
          <li aria-hidden="true"><div className="navbar__divider" /></li>
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
          <li aria-hidden="true"><div className="navbar__divider" /></li>
          <li>
            <Link
              to="/progress"
              className={`progress-link${isActive('/progress') ? ' active' : ''}`}
              onClick={() => { closeMenu(); playNavClick() }}
            >
              📊 Progress
            </Link>
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
            <li>
              <Link to="/ai" className={isActive('/ai') ? 'active' : ''}
                onClick={() => { closeMenu(); playNavClick() }}>
                🤖 {t('askAI')}
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}
                onClick={() => { closeMenu(); playNavClick() }}>
                📈 {t('dashboard')}
              </Link>
            </li>
            <li>
              <Link to="/did-you-know" className={isActive('/did-you-know') ? 'active' : ''}
                onClick={() => { closeMenu(); playNavClick() }}>
                💡 {t('didYouKnow')}
              </Link>
            </li>
          </ul>

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

          {/* Progress */}
          <ul role="list">
            <li>
              <Link
                to="/progress"
                className={`progress-link${isActive('/progress') ? ' active' : ''}`}
                onClick={() => { closeMenu(); playNavClick() }}
              >
                📊 My Study Progress
              </Link>
            </li>
          </ul>

        </div>
      )}
    </>
  )
}