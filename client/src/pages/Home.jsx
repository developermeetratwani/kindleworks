import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ShaderCanvas from '../components/ShaderCanvas'
import ContactSection from '../components/ContactSection'
import ScrollTypewriter from '../components/ScrollTypewriter'
import { useReveal } from '../hooks/useReveal'

// ── Portfolio data ────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    img: '/civiclensai.jpg',
    alt: 'CivicLensAI',
    title: 'CivicLensAI',
    desc: 'An AI-powered civic platform where every civic issue is heard, classified, and resolved by artificial intelligence.',
    href: 'https://civiclensai-eight.vercel.app/',
  },
  {
    img: '/stafroom.jpg',
    alt: 'Stafroom: AI Powered Teaching Software',
    title: 'Stafroom: AI Powered Teaching Software',
    desc: 'A smart teaching workspace that remembers your classes, question banks, and students\' weak spots — one connected AI system.',
    href: 'https://stafroom.onrender.com/',
  },
  {
    img: '/portfolio.jpg',
    alt: 'Portfolio: Meet Ratwani',
    title: 'Portfolio: Meet Ratwani',
    desc: 'A sleek, dark-themed developer portfolio showcasing Full Stack Development and AI building expertise with stunning visuals.',
    href: 'https://portfoliomeetratwani250109.web.app/',
  },
  {
    img: '/rstore.jpg',
    alt: 'R Store',
    title: 'R Store',
    desc: 'A vibrant, cosmic-themed mobile e-commerce store offering the best mobile deals with premium devices and unbeatable prices.',
    href: 'https://r-sanju.web.app/',
  },
]

// ── Stats data ────────────────────────────────────────────────────────────────────────────────────
const STATS = [
  { number: '40+', label: 'Projects Delivered' },
  { number: '100%', label: 'Client Code Ownership' },
  { number: '40', label: 'Free Updates / Year' },
  { number: '₹7.5K', label: 'Starting Price' },
]

// ── Tech stack data ─────────────────────────────────────────────────────────────────────────────
const TECH_STACK = [
  { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
  { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
  { name: 'MongoDB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg' },
  { name: 'Next.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg' },
  { name: 'Firebase', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg' },
  { name: 'Vite', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg' },
  { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
  { name: 'Vercel', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg' },
  { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
  { name: 'Tailwind CSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Express.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg' },
  { name: 'Figma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' },
  { name: 'AWS S3', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
]

// ── Process steps data ────────────────────────────────────────────────────────────────────────────
const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Discovery & Brief',
    desc: 'We deep-dive into your brand, goals, and audience to build a precise project blueprint.',
  },
  {
    number: '02',
    title: 'Design & Prototype',
    desc: 'Custom wireframes and pixel-perfect mockups built around your brand identity.',
  },
  {
    number: '03',
    title: 'Build & Develop',
    desc: 'Clean, scalable code crafted with modern tech. No templates, no shortcuts.',
  },
  {
    number: '04',
    title: 'Test & Launch',
    desc: 'Rigorous cross-device QA, performance tuning, and seamless deployment to your infrastructure.',
  },
  {
    number: '05',
    title: 'Support & Grow',
    desc: 'Up to 40 free updates in Year 1. We’re your long-term digital partner.',
  },
]

// ── Feature cards data ────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: 'Pricing Transparency',
    desc: 'Every cost is outlined upfront with complete clarity. No hidden fees, no surprise invoices, no ambiguity.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>
      </svg>
    ),
    title: 'Complete Ownership',
    desc: 'Upon delivery, every line of code, every design asset, and every digital element belongs entirely to you.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/>
        <line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>
      </svg>
    ),
    title: 'Your Infrastructure',
    desc: 'Your website is deployed directly to your hosting account, ensuring full control without vendor lock-in.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/>
        <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/>
        <path d="M14.5 17.5 4.5 15"/>
      </svg>
    ),
    title: 'Bespoke by Design',
    desc: 'Every element is crafted around your brand identity and business objectives — never templated, always unique.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
    title: 'Zero Commissions',
    desc: 'We earn from our craft, not your revenue. No commissions on your sales, no percentage cuts — ever.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M8 16H3v5"/>
      </svg>
    ),
    title: '40 Free Updates',
    desc: 'Receive up to 40 updates at no additional cost during your first year — your website evolves with your business.',
  },
]

// ── Pricing data ──────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Basic',
    price: '₹7,500',
    range: 'to ₹8,500',
    suited: 'Best suited for small businesses, portfolios & local services.',
    features: ['Minimal & professional website', 'Essential pages included', 'Fully responsive design', 'Light development effort', 'Basic deployment guidance'],
    featured: false,
  },
  {
    name: 'Business',
    price: '₹9,000',
    range: 'to ₹14,000',
    suited: 'Ideal for growing businesses & professional service providers.',
    features: ['Custom UI/UX design', 'Light to medium animations', 'Refined, polished design', 'Fully responsive website', 'Enhanced user experience', 'Medium development effort'],
    featured: true,
    badge: 'Recommended',
  },
  {
    name: 'Premium',
    price: '₹17,000',
    range: 'to ₹20,000',
    suited: 'Perfect for brands seeking a premium digital presence.',
    features: ['Premium custom design', 'Rich, advanced UI/UX', 'Advanced animations', 'Rich visual experience', 'Higher development effort', 'Premium visual experience'],
    featured: false,
  },
]

// ── Video autoplay helper ─────────────────────────────────────────────────────
function useAutoplay(ref) {
  useEffect(() => {
    const video = ref.current
    if (!video) return
    const tryPlay = () => { video.muted = true; video.play().catch(() => {}) }
    tryPlay()
    const interval = setInterval(() => {
      if (!video.paused) { clearInterval(interval); return }
      tryPlay()
    }, 1000)
    document.addEventListener('click', tryPlay, { once: true })
    document.addEventListener('touchstart', tryPlay, { once: true })
    return () => clearInterval(interval)
  }, [ref])
}

// ═════════════════════════════════════════════════════════════════════════════
export default function Home() {
  const heroVideoRef  = useRef(null)
  const aboutVideoRef = useRef(null)

  useAutoplay(heroVideoRef)
  useAutoplay(aboutVideoRef)
  useReveal()

  return (
    <>
      {/* ── SECTION 1 — HERO ─────────────────────────────────── */}
      <section className="hero" id="home">
        <video
          ref={heroVideoRef}
          className="hero__video hero-morph-right"
          autoPlay muted loop playsInline preload="auto"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_050407_500d0339-ab28-41c1-9688-132a74a3b5aa.mp4"
        />
        {/* Orange ambient glow to override the blue light under the globe */}
        <div className="hero__video-glow" aria-hidden="true" />
        <div className="hero__scrim" aria-hidden="true" />

        <Navbar transparent />

        <div className="hero__content">
          <div className="hero__headline">
            <h1>
              {/* Left half components: morph in from Left side */}
              <span className="hero-morph-left" style={{ transitionDelay: '0.08s' }}>Crafting</span>
              <span className="hero-morph-left" style={{ transitionDelay: '0.18s' }}>Digital</span>
              <span className="hero-morph-left" style={{ transitionDelay: '0.28s' }}>Experience</span>

              {/* Right half components: morph in from Right side */}
              <span className="hero-morph-right indent" style={{ transitionDelay: '0.40s' }}>That</span>
              <span className="hero-morph-right indent" style={{ transitionDelay: '0.52s' }}>Define</span>
              <span className="hero-morph-right indent accent" style={{ transitionDelay: '0.64s' }}>Businesses</span>
            </h1>
          </div>
          <div className="hero__cta-wrap hero-morph-right" style={{ transitionDelay: '0.78s' }}>
            <Link to="/estimate" className="btn-chamfer">Get Your Estimate</Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 — ABOUT ────────────────────────────────── */}
      <section className="about" id="about">
        <div className="about__left">
          <h2 className="about__heading reveal">
            <span>About</span>
            <span className="indent">KindleWorks</span>
          </h2>
          <ScrollTypewriter
            text="KindleWorks crafts the digital infrastructure modern businesses rely on. From custom websites to full-scale digital products, we make sure your online presence is pixel-perfect and performance-driven. Custom-built. Transparent pricing. Yours from day one."
            className="about__text"
          />
          <div className="about__cta reveal" style={{ transitionDelay: '0.3s' }}>
            <a href="#features" className="btn-chamfer" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) }}>
              Learn More
            </a>
          </div>
        </div>
        <div className="about__right">
          <div className="about__video-wrap">
            <video
              ref={aboutVideoRef}
              className="about__video"
              autoPlay muted loop playsInline preload="auto"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_063501_2e2c8971-de1e-473a-8611-a0c9ae7ee186.mp4"
            />
            <div className="about__video-overlay" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — STATS BANNER ─────────────────────────────── */}
      <div className="stats-banner">
        {STATS.map((s) => (
          <div key={s.label} className="stats-banner__item">
            <div className="stats-banner__number">{s.number}</div>
            <div className="stats-banner__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── SECTION 3b — TECH TICKER ──────────────────────────────── */}
      <div className="tech-ticker">
        <p className="tech-ticker__label">Technologies We Work With</p>
        <div className="tech-ticker__track">
          {/* Double for seamless loop */}
          {[...TECH_STACK, ...TECH_STACK].map((tech, i) => (
            <span key={i} className="tech-ticker__item">
              <img src={tech.logo} alt={`${tech.name} logo`} style={{ height: '24px', width: 'auto', objectFit: 'contain' }} />
              {tech.name}
            </span>
          ))}
        </div>
      </div>

      {/* ── SECTION 3 — PORTFOLIO ────────────────────────────── */}
      <section className="portfolio" id="work">
        <p className="portfolio__label reveal">Our Work</p>
        <h2 className="portfolio__heading reveal" style={{ transitionDelay: '0.1s' }}>
          <span>Built to</span>
          <span className="indent">Impress</span>
        </h2>
        <div className="portfolio__grid">
          {PROJECTS.map((p, i) => (
            <div
              key={p.title}
              className="project-card-wrapper reveal"
              style={{ transitionDelay: `${0.15 + i * 0.1}s` }}
            >
              <article className="project-card">
                <img src={p.img} alt={p.alt} className="project-card__img" loading="lazy" />
                <div className="project-card__content">
                  <h3 className="project-card__title">{p.title}</h3>
                  <p className="project-card__desc">{p.desc}</p>
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="project-card__link">
                    View Work
                  </a>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 5 — PROCESS / ROADMAP ─────────────────────────── */}
      <section className="process" id="process">
        <p className="process__label reveal">How We Work</p>
        <h2 className="process__heading reveal" style={{ transitionDelay: '0.1s' }}>
          <span>Our</span>
          <span className="indent">Process</span>
        </h2>
        <div className="process__steps">
          {PROCESS_STEPS.map((step, i) => (
            <div
              key={step.number}
              className="process-step reveal"
              style={{ transitionDelay: `${0.1 + i * 0.12}s` }}
            >
              <div className="process-step__number">{step.number}</div>
              <h3 className="process-step__title">{step.title}</h3>
              <p className="process-step__desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4 — FEATURES ─────────────────────────────── */}
      <section className="features" id="features">
        <ShaderCanvas col1="#e85d26" col2="#F97316" bg="#e85d26" opacity={0.6} isLight={true} />
        <div className="features__inner">
          <p className="features__label reveal">Why Choose Us</p>
          <h2 className="features__heading reveal" style={{ transitionDelay: '0.1s' }}>
            <span>Why Choose</span>
            <span className="indent">KindleWorks</span>
          </h2>
          <div className="features__grid">
            {FEATURES.map((f) => (
              <article key={f.title} className="feat-card">
                <div className="feat-card__icon">{f.icon}</div>
                <h3 className="feat-card__title">{f.title}</h3>
                <p className="feat-card__desc">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — PRICING ──────────────────────────────── */}
      <section className="pricing" id="pricing">
        <p className="pricing__label reveal">Pricing</p>
        <h2 className="pricing__heading reveal" style={{ transitionDelay: '0.1s' }}>
          <span>Transparent</span>
          <span className="indent">Pricing</span>
        </h2>
        <p className="pricing__sub reveal" style={{ transitionDelay: '0.2s' }}>
          Choose a package that fits your business. No hidden charges. No commissions. Complete ownership after delivery.
        </p>
        <div className="pricing__grid">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`price-card reveal${plan.featured ? ' price-card--featured' : ''}`}
              style={{ transitionDelay: `${0.15 + i * 0.1}s` }}
            >
              {plan.badge && <div className="price-card__badge">{plan.badge}</div>}
              <div className="price-card__name">{plan.name}</div>
              <div className="price-card__price">{plan.price}</div>
              <div className="price-card__price-range">to {plan.range.replace('to ', '')}</div>
              <p className="price-card__suited">{plan.suited}</p>
              <ul className="price-card__features">
                {plan.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <Link to="/estimate" className="btn-chamfer price-card__btn">Get Estimate</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 6 — CONTACT CTA ──────────────────────────── */}
      <section className="contact-cta" id="estimate-cta">
        <ShaderCanvas col1="#e85d26" col2="#F97316" bg="#000000" opacity={1.0} isLight={false} />
        <div className="contact-cta__inner">
          <h2 className="contact-cta__heading reveal">
            Ready to<br /><span className="accent">Start Building?</span>
          </h2>
          <p className="contact-cta__text reveal" style={{ transitionDelay: '0.15s' }}>
            Every business is unique. Tell us what you need and we'll craft a custom plan specifically for you.
          </p>
          <div className="reveal" style={{ transitionDelay: '0.3s' }}>
            <Link to="/estimate" className="btn-chamfer">Get Free Estimate</Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 7 — CONTACT US (TABS) ──────────────────────── */}
      <ContactSection />

      <Footer />
    </>
  )
}

