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
      <Link to="/" className="nav__logo hero-morph-left" style={{ transitionDelay: '0.04s' }} aria-label="KindleWorks Home">
        <img src="/logo_flame.png" alt="KindleWorks Logo" style={{ height: 28, width: 'auto' }} />
        {/* Text: visible on desktop, hidden on mobile top bar */}
        <span className="nav__logo-text nav__logo-text--desktop">KindleWorks</span>
      </Link>

      {/* ── Desktop Links (Morph in from right with stagger) ───────────────── */}
      <div className="nav__links">
        <button className="nav__link hero-morph-right" style={{ transitionDelay: '0.08s' }} onClick={() => scrollTo('home')}>Home</button>
        <button className="nav__link hero-morph-right" style={{ transitionDelay: '0.14s' }} onClick={() => scrollTo('about')}>About</button>
        <button className="nav__link hero-morph-right" style={{ transitionDelay: '0.20s' }} onClick={() => scrollTo('work')}>Work</button>
        <button className="nav__link hero-morph-right" style={{ transitionDelay: '0.24s' }} onClick={() => scrollTo('process')}>Process</button>
        <button className="nav__link hero-morph-right" style={{ transitionDelay: '0.28s' }} onClick={() => scrollTo('features')}>Features</button>
        <button className="nav__link hero-morph-right" style={{ transitionDelay: '0.34s' }} onClick={() => scrollTo('pricing')}>Pricing</button>
        <Link to="/estimate" className="nav__link nav__link--accent hero-morph-right" style={{ transitionDelay: '0.40s' }}>Get Estimate</Link>
      </div>

      {/* ── Hamburger (mobile only) ───────────────────────────────────────── */}
      <button
        className={`nav__hamburger hero-morph-right${menuOpen ? ' is-active' : ''}`}
        style={{ transitionDelay: '0.15s' }}
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
        <Link to="/" className="nav__mobile-brand" onClick={() => setMenuOpen(false)}>
          <img src="/logo_flame.png" alt="KindleWorks Logo" style={{ height: 24, width: 'auto' }} />
          <span className="nav__mobile-brand-text">KindleWorks</span>
        </Link>

        {/* Menu links */}
        <button onClick={() => scrollTo('home')}>Home</button>
        <button onClick={() => scrollTo('about')}>About</button>
        <button onClick={() => scrollTo('work')}>Work</button>
        <button onClick={() => scrollTo('process')}>Process</button>
        <button onClick={() => scrollTo('features')}>Features</button>
        <button onClick={() => scrollTo('pricing')}>Pricing</button>
        <button onClick={() => scrollTo('contact')}>Contact</button>
        <Link to="/estimate" onClick={() => setMenuOpen(false)}>Get Estimate</Link>
      </div>
    </nav>
  )
}
