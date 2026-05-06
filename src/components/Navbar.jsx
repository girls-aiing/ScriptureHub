import React, { useState } from 'react'
// ── react-router-dom <Link> is used for ALL navigation ──────────────────────
// IMPORTANT: We never use plain <a href="..."> for internal pages.
// Why? Because <Link> keeps the React app alive between pages (no full reload).
// Plain <a> tags would reload the entire app from scratch every click.
import { Link, useLocation } from 'react-router-dom'

// ── Navigation link definitions ─────────────────────────────────────────────
// Add or remove pages here — the Navbar renders them automatically.
const NAV_LINKS = [
  { label: 'Home',      path: '/' },
  { label: 'Bible',     path: '/bible' },
  { label: 'Quizzes',   path: '/quizzes' },
  { label: 'Ask AI',    path: '/ai' },
  { label: 'Dashboard', path: '/dashboard' },
]

export default function Navbar() {
  // Track whether the mobile menu is open or closed
  const [menuOpen, setMenuOpen] = useState(false)

  // useLocation tells us which page the user is currently on
  // We use this to highlight the active nav link
  const location = useLocation()

  // Toggle the mobile hamburger menu open/closed
  const toggleMenu = () => setMenuOpen(prev => !prev)

  // Close the menu when a link is clicked (important on mobile)
  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      {/* ── Navbar Styles ── */}
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
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
        }

        /* ── Brand / Logo ── */
        .navbar__brand {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .navbar__logo-icon {
          font-size: 1.6rem;
        }
        .navbar__brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #f0c040;
          letter-spacing: 0.03em;
        }
        .navbar__brand-tagline {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.65rem;
          color: #a89bc2;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-top: -2px;
        }

        /* ── Desktop nav links ── */
        .navbar__links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .navbar__links a {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          color: #c8b8e8;
          text-decoration: none;
          padding: 0.5rem 0.9rem;
          border-radius: 6px;
          transition: color 0.2s, background-color 0.2s;
          letter-spacing: 0.03em;
        }
        .navbar__links a:hover {
          color: #ffffff;
          background-color: rgba(240, 192, 64, 0.12);
        }
        /* Active page link gets a gold underline highlight */
        .navbar__links a.active {
          color: #f0c040;
          background-color: rgba(240, 192, 64, 0.15);
          font-weight: 600;
        }

        /* ── CTA Button ── */
        .navbar__cta {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          background: linear-gradient(135deg, #f0c040, #d4a017);
          color: #1a0a2e;
          border: none;
          border-radius: 8px;
          padding: 0.5rem 1.2rem;
          cursor: pointer;
          text-decoration: none;
          margin-left: 0.75rem;
          transition: opacity 0.2s, transform 0.15s;
          letter-spacing: 0.04em;
        }
        .navbar__cta:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          color: #1a0a2e;
        }

        /* ── Hamburger button (mobile only) ── */
        .navbar__hamburger {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 26px;
          height: 18px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .navbar__hamburger span {
          display: block;
          height: 2px;
          background-color: #f0c040;
          border-radius: 2px;
          transition: all 0.3s;
        }

        /* ── Mobile menu panel ── */
        .navbar__mobile-menu {
          display: none;
        }

        /* ── Responsive: below 768px ── */
        @media (max-width: 768px) {
          .navbar__links {
            display: none; /* hide desktop links */
          }
          .navbar__hamburger {
            display: flex;
          }
          .navbar__mobile-menu {
            display: block;
            background-color: #1a0a2e;
            border-top: 1px solid rgba(240, 192, 64, 0.2);
            padding: 1rem 2rem 1.5rem;
          }
          .navbar__mobile-menu ul {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          .navbar__mobile-menu a {
            display: block;
            font-family: 'Montserrat', sans-serif;
            font-size: 1rem;
            font-weight: 500;
            color: #c8b8e8;
            text-decoration: none;
            padding: 0.65rem 0.5rem;
            border-radius: 6px;
            transition: color 0.2s, background-color 0.2s;
          }
          .navbar__mobile-menu a:hover,
          .navbar__mobile-menu a.active {
            color: #f0c040;
            background-color: rgba(240, 192, 64, 0.1);
          }
          .navbar__cta {
            display: block;
            text-align: center;
            margin: 1rem 0 0;
          }
        }
      `}</style>

      {/* ── Main Navbar Bar ── */}
      <nav className="navbar" role="navigation" aria-label="Main navigation">

        {/* Brand logo — Link takes user home */}
        <Link to="/" className="navbar__brand" onClick={closeMenu}>
          <span className="navbar__logo-icon" aria-hidden="true">✦</span>
          <div>
            <div className="navbar__brand-name">ScriptureHub</div>
            <div className="navbar__brand-tagline">by Silas Clergy</div>
          </div>
        </Link>

        {/* ── Desktop Navigation Links ── */}
        <ul className="navbar__links" role="list">
          {NAV_LINKS.map(link => (
            <li key={link.path}>
              {/*
                className receives 'active' when this link matches the current page.
                location.pathname === link.path handles exact matching.
                This gives users a clear visual cue of where they are.
              */}
              <Link
                to={link.path}
                className={location.pathname === link.path ? 'active' : ''}
                aria-current={location.pathname === link.path ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Start Studying CTA — separate visual emphasis */}
          <li>
            <Link to="/quizzes" className="navbar__cta">
              Start Studying
            </Link>
          </li>
        </ul>

        {/* ── Mobile Hamburger Button ── */}
        <button
          className="navbar__hamburger"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* ── Mobile Dropdown Menu ── */}
      {/* Only rendered in the DOM when menuOpen is true */}
      {menuOpen && (
        <div className="navbar__mobile-menu" role="navigation" aria-label="Mobile navigation">
          <ul role="list">
            {NAV_LINKS.map(link => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={location.pathname === link.path ? 'active' : ''}
                  onClick={closeMenu}
                  aria-current={location.pathname === link.path ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/quizzes" className="navbar__cta" onClick={closeMenu}>
            Start Studying
          </Link>
        </div>
      )}
    </>
  )
}
