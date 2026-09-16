import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ transparent = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const scrollTo = useCallback((id) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [navigate])

  return (
    <nav className="nav" id="main-nav" style={transparent ? {} : { background: 'var(--kw-bg)' }}>

      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <Link to="/" className="nav__logo" aria-label="KindleWorks Home">
        <img src="/logo_flame.png" alt="KindleWorks Logo" style={{ height: 28, width: 'auto' }} />
        {/* Text: visible on desktop, hidden on mobile top bar */}
        <span className="nav__logo-text nav__logo-text--desktop">KindleWorks</span>
      </Link>

      {/* ── Desktop Links ─────────────────────────────────────────────────── */}
      <div className="nav__links">
        <button className="nav__link" onClick={() => scrollTo('home')}>Home</button>
        <button className="nav__link" onClick={() => scrollTo('about')}>About</button>
        <button className="nav__link" onClick={() => scrollTo('work')}>Work</button>
        <button className="nav__link" onClick={() => scrollTo('features')}>Features</button>
        <button className="nav__link" onClick={() => scrollTo('pricing')}>Pricing</button>
        <button className="nav__link" onClick={() => scrollTo('contact')}>Contact</button>
        <Link to="/estimate" className="nav__link nav__link--accent">Get Estimate</Link>
      </div>

      {/* ── Desktop CTA ───────────────────────────────────────────────────── */}
      <div className="nav__cta-wrap">
        <Link to="/estimate" className="nav__contact-btn">
          <svg width="17" height="13" viewBox="0 0 17 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="1" width="15" height="11" rx="1.5"/>
            <polyline points="1 1 8.5 7.5 16 1"/>
          </svg>
          Get Estimate
        </Link>
      </div>

      {/* ── Hamburger (mobile only) ───────────────────────────────────────── */}
      <button
        className={`nav__hamburger${menuOpen ? ' is-active' : ''}`}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* ── Mobile Dropdown Menu ──────────────────────────────────────────── */}
      <div className={`nav__mobile-menu${menuOpen ? ' is-open' : ''}`}>
        {/* Menu header — flame + KindleWorks text */}
        <div className="nav__mobile-brand">
          <img src="/logo_flame.png" alt="KindleWorks Logo" style={{ height: 24, width: 'auto' }} />
          <span className="nav__mobile-brand-text">KindleWorks</span>
        </div>

        {/* Menu links */}
        <button onClick={() => scrollTo('home')}>Home</button>
        <button onClick={() => scrollTo('about')}>About</button>
        <button onClick={() => scrollTo('work')}>Work</button>
        <button onClick={() => scrollTo('features')}>Features</button>
        <button onClick={() => scrollTo('pricing')}>Pricing</button>
        <button onClick={() => scrollTo('contact')}>Contact</button>
        <Link to="/estimate" onClick={() => setMenuOpen(false)}>Get Estimate</Link>
      </div>
    </nav>
  )
}
