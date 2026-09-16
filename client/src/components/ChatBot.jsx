import { useState, useRef, useEffect } from 'react'

const WELCOME_MSG = {
  role: 'bot',
  text: "Hi! 👋 I'm the KindleWorks AI assistant. Ask me anything about our services, pricing, or projects. I'm here to help!",
}

const CONTACT_TRIGGERS = [
  'contact', 'reach out', 'talk to someone', 'speak to', 'call you',
  'email you', 'get in touch', 'human', 'team', 'sales', 'speak with',
]

function needsContactForm(text) {
  const lower = text.toLowerCase()
  return CONTACT_TRIGGERS.some((t) => lower.includes(t))
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MSG])
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
    setInput('')
    setLoading(true)

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
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
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
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages" role="log" aria-live="polite">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-msg chat-msg--${msg.role}`}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {msg.text}
              </div>
            ))}

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
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
