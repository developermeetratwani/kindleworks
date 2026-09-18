import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BotMessageSquareIcon from './BotMessageSquareIcon'

const WELCOME_MSG = {
  role: 'bot',
  text: "Hi! 👋 I'm the KindleWorks AI assistant. Ask me anything about our services, pricing, or projects. I'm here to help!",
}

const CONTACT_TRIGGERS = [
  'contact', 'reach out', 'talk to someone', 'speak to', 'call you',
  'email you', 'get in touch', 'human', 'team', 'sales', 'speak with',
]

const BOOKING_TRIGGERS = [
  'book a call', 'schedule', 'appointment', 'meeting', 'book call',
  'call me', 'talk to you', 'consultation', 'free call', 'discovery call',
]

// Quick-action suggestion pills shown after welcome message
const QUICK_PILLS = [
  'Our Services',
  'View Pricing',
  'Book a Call',
  'Get Estimate',
]

function needsContactForm(text) {
  const lower = text.toLowerCase()
  return CONTACT_TRIGGERS.some((t) => lower.includes(t))
}

function needsBooking(text) {
  const lower = text.toLowerCase()
  return BOOKING_TRIGGERS.some((t) => lower.includes(t))
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [showPills, setShowPills] = useState(true)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactSent, setContactSent] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)


  // Build history for Gemini (only user/bot pairs, no contact forms)
  const geminiHistory = messages
    .filter((m) => m.role === 'bot' || m.role === 'user')
    .slice(1) // skip welcome
    .map((m) => ({ role: m.role === 'bot' ? 'model' : 'user', text: m.text }))

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return

    const userMsg = { role: 'user', text: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setShowPills(false)
    setInput('')
    setLoading(true)

    // Check booking intent
    if (needsBooking(text)) {
      setLoading(false)
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: "Absolutely! 🚀 We'd love to connect with you. Here are the quickest ways to get started:",
          type: 'booking',
        },
      ])
      return
    }

    // Check if contact intent detected
    if (needsContactForm(text)) {
      setLoading(false)
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: "I'd love to connect you with our team! Please share your details below and we'll get back to you shortly. 😊",
        },
      ])
      setShowContactForm(true)
      return
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: geminiHistory,
        }),
      })
      const data = await res.json()
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'bot', text: data.reply }])
      } else {
        setMessages((prev) => [...prev, { role: 'bot', text: 'Sorry, something went wrong. Please try again.' }])
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Network error. Please check your connection and try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handlePillClick = (pill) => {
    setShowPills(false)
    sendMessage(pill)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleContactSubmit = async () => {
    if (!contactName.trim() || !contactEmail.trim()) return

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName.trim(),
          email: contactEmail.trim(),
          message: 'Customer reached out via chat widget',
        }),
      })
    } catch {
      // silent fail — UI still shows success
    }

    setContactSent(true)
    setShowContactForm(false)
    setMessages((prev) => [
      ...prev,
      {
        role: 'bot',
        text: `Thanks, ${contactName.trim()}! 🎉 Our team will reach out to ${contactEmail.trim()} shortly. Is there anything else I can help you with?`,
      },
    ])
    setContactName('')
    setContactEmail('')
  }

  return (
    <>
      {/* Floating Bubble */}
      <button
        className="chatbot-bubble"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open chat with KindleWorks AI'}
        title="Chat with us"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <BotMessageSquareIcon size={28} continuous={true} />
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="chatbot-window" role="dialog" aria-label="KindleWorks AI Chat">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header__logo">KW</div>
            <div className="chatbot-header__info">
              <div className="chatbot-header__name">KindleWorks AI</div>
              <div className="chatbot-header__status">Online</div>
            </div>
            <button className="chatbot-header__close" onClick={() => setOpen(false)} aria-label="Close chat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages" role="log" aria-live="polite">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.type === 'booking' ? (
                  /* Booking message with action buttons */
                  <div>
                    <div className={`chat-msg chat-msg--${msg.role}`} style={{ whiteSpace: 'pre-wrap' }}>
                      {msg.text}
                    </div>
                    <div className="chat-actions" style={{ marginTop: 8 }}>
                      <Link
                        to="/estimate"
                        className="chat-action-btn chat-action-btn--primary"
                        onClick={() => setOpen(false)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1" ry="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
                        </svg>
                        Get Free Estimate →
                      </Link>
                      <a
                        href="https://wa.me/918734824104?text=Hi%20KindleWorks%2C%20I%27d%20like%20to%20discuss%20a%20project!"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chat-action-btn chat-action-btn--secondary"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                        </svg>
                        Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`chat-msg chat-msg--${msg.role}`}
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {msg.text}
                  </div>
                )}
              </div>
            ))}

            {/* Quick-action pills — shown only right after the welcome message */}
            {showPills && messages.length === 1 && (
              <div className="chat-pills">
                {QUICK_PILLS.map((pill) => (
                  <button
                    key={pill}
                    className="chat-pill"
                    onClick={() => handlePillClick(pill)}
                    disabled={loading}
                  >
                    {pill}
                  </button>
                ))}
              </div>
            )}

            {/* Contact Form */}
            {showContactForm && !contactSent && (
              <div className="chat-contact-form">
                <p style={{ fontSize: 13, marginBottom: 10, color: 'var(--kw-heading)', fontWeight: 700 }}>
                  Leave your details:
                </p>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleContactSubmit()}
                />
                <button onClick={handleContactSubmit}>Send →</button>
              </div>
            )}

            {/* Typing Indicator */}
            {loading && (
              <div className="chat-msg chat-msg--typing">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-area">
            <input
              ref={inputRef}
              type="text"
              className="chatbot-input"
              placeholder="Ask about our services..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              aria-label="Chat message"
            />
            <button
              className="chatbot-send"
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
