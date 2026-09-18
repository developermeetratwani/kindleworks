import { useState } from 'react'
import PhoneCallIcon from './PhoneCallIcon'
import MessageSquareDashedIcon from './MessageSquareDashedIcon'
import EmailArrowRightIcon from './EmailArrowRightIcon'

export default function ContactSection() {
  const [activeTab, setActiveTab] = useState('mail') // 'mail' | 'call'
  const [copiedKey, setCopiedKey] = useState(null)

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2200)
    })
  }

  return (
    <section className="contact-section" id="contact">
      <div className="contact-section__inner">
        {/* Header */}
        <p className="contact-section__label reveal">Direct Channels</p>
        <h2 className="contact-section__heading reveal" style={{ transitionDelay: '0.1s' }}>
          <span>Contact</span>
          <span className="indent">Us</span>
        </h2>
        <p className="contact-section__sub reveal" style={{ transitionDelay: '0.15s' }}>
          Get in touch with the KindleWorks team directly. We are always ready to discuss new projects, partnerships, and technical questions.
        </p>

        {/* Tabs Switcher */}
        <div className="contact-tabs reveal" style={{ transitionDelay: '0.2s' }}>
          <button
            className={`contact-tab-btn ${activeTab === 'mail' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('mail')}
            aria-selected={activeTab === 'mail'}
            role="tab"
          >
            <EmailArrowRightIcon size={18} />
            <span>Mail Us</span>
          </button>

          <button
            className={`contact-tab-btn ${activeTab === 'call' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('call')}
            aria-selected={activeTab === 'call'}
            role="tab"
          >
            <PhoneCallIcon size={18} />
            <span>Call Us</span>
          </button>
        </div>

        {/* Tab Panel Content */}
        <div className="contact-panel-wrap reveal" style={{ transitionDelay: '0.25s' }}>
          {/* ── TAB 1: MAIL US ── */}
          {activeTab === 'mail' && (
            <div className="contact-panel contact-panel--mail" role="tabpanel">
              <div className="contact-card contact-card--featured">
                <div className="contact-card__icon-badge">
                  <EmailArrowRightIcon size={28} />
                </div>

                <div className="contact-card__meta">
                  <span className="contact-card__tag">Official Support & Enquiries</span>
                  <a
                    href="mailto:supportkindleworks@gmail.com"
                    className="contact-card__main-val contact-card__email-link"
                    title="Send an email"
                  >
                    supportkindleworks@gmail.com
                  </a>
                  <p className="contact-card__desc">
                    Drop us a message anytime. We typically respond within a few hours with comprehensive project consultation.
                  </p>
                </div>

                <div className="contact-card__actions">
                  <a
                    href="mailto:supportkindleworks@gmail.com"
                    className="btn-chamfer contact-action-btn"
                  >
                    <EmailArrowRightIcon size={16} />
                    Send Email
                  </a>

                  <button
                    className="contact-copy-btn"
                    onClick={() => handleCopy('supportkindleworks@gmail.com', 'email')}
                    aria-label="Copy email address"
                  >
                    {copiedKey === 'email' ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span style={{ color: '#22c55e' }}>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: CALL US ── */}
          {activeTab === 'call' && (
            <div className="contact-panel contact-panel--call" role="tabpanel">
              <div className="contact-grid">
                {/* 1. Normal Call */}
                <div className="contact-card">
                  <div className="contact-card__header-row">
                    <div className="contact-card__icon-badge">
                      <PhoneCallIcon size={24} />
                    </div>
                    <span className="contact-card__badge-pill">Normal Call</span>
                  </div>

                  <div className="contact-card__meta">
                    <span className="contact-card__tag">Direct Phone Line</span>
                    <a href="tel:+919727043225" className="contact-card__main-val">
                      +91 9727043225
                    </a>
                    <p className="contact-card__desc">
                      Available for immediate voice calls, project scoping, and urgent support.
                    </p>
                  </div>

                  <div className="contact-card__actions">
                    <a href="tel:+919727043225" className="btn-chamfer contact-action-btn">
                      <PhoneCallIcon size={16} />
                      Call Now
                    </a>

                    <button
                      className="contact-copy-btn"
                      onClick={() => handleCopy('+919727043225', 'phone1')}
                      aria-label="Copy phone number"
                    >
                      {copiedKey === 'phone1' ? (
                        <>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span style={{ color: '#22c55e' }}>Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                          <span>Copy Number</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. Whatsapp Call */}
                <div className="contact-card contact-card--whatsapp">
                  <div className="contact-card__header-row">
                    <div className="contact-card__icon-badge contact-card__icon-badge--whatsapp">
                      <MessageSquareDashedIcon size={24} />
                    </div>
                    <span className="contact-card__badge-pill contact-card__badge-pill--whatsapp">WhatsApp Call</span>
                  </div>

                  <div className="contact-card__meta">
                    <span className="contact-card__tag">WhatsApp Audio / Video & Chat</span>
                    <a
                      href="https://wa.me/918734824104?text=Hi%20KindleWorks%20team,%20I'd%20like%20to%20discuss%20a%20project!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-card__main-val"
                    >
                      +91 87348 24104
                    </a>
                    <p className="contact-card__desc">
                      Message or call directly on WhatsApp for quick inquiries, audio calls, and file sharing.
                    </p>
                  </div>

                  <div className="contact-card__actions">
                    <a
                      href="https://wa.me/918734824104?text=Hi%20KindleWorks%20team,%20I'd%20like%20to%20discuss%20a%20project!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-chamfer contact-action-btn contact-action-btn--whatsapp"
                    >
                      <MessageSquareDashedIcon size={16} />
                      Open WhatsApp
                    </a>

                    <a href="tel:+918734824104" className="contact-copy-btn" title="Direct Phone Call">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <span>Call</span>
                    </a>

                    <button
                      className="contact-copy-btn"
                      onClick={() => handleCopy('+918734824104', 'phone2')}
                      aria-label="Copy WhatsApp number"
                    >
                      {copiedKey === 'phone2' ? (
                        <>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span style={{ color: '#22c55e' }}>Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                          <span>Copy Number</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
