import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useReveal } from '../hooks/useReveal'

const STEPS = [
  {
    id: 1,
    question: 'What type of project are you looking to build?',
    key: 'projectType',
    options: [
      'Corporate Website',
      'E-Commerce Store',
      'Portfolio / Personal Site',
      'Web App / SaaS',
      'Other',
    ],
  },
  {
    id: 2,
    question: 'What is your estimated timeline?',
    key: 'timeline',
    options: ['As soon as possible', '1-2 Months', '3+ Months', 'Flexible'],
  },
  {
    id: 3,
    question: 'What is your estimated budget?',
    key: 'budget',
    options: ['Under ₹10,000', '₹10,000 - ₹20,000', 'Above ₹20,000', 'Not Sure'],
  },
]

export default function Estimate() {
  const [step, setStep] = useState(0) // 0 = step 1, 1 = step 2, 2 = step 3, 3 = contact, 4 = success
  const [formData, setFormData] = useState({ projectType: '', timeline: '', budget: '', name: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useReveal('.reveal', [step])

  const selectOption = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setStep((s) => s + 1)
  }

  const goBack = () => {
    setStep((s) => s - 1)
    setError('')
  }

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please enter your name and email.')
      return
    }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setStep(4)
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="estimate-page">
        <Navbar />

        {/* Hero */}
        <div className="estimate-hero">
          <h1 className="estimate-hero__heading reveal">
            Let's build <br />
            <span className="accent">your vision</span>
          </h1>
        </div>

        {/* Form Section */}
        <div className="estimate-form-section">
          <div className="estimate-box">
            {/* Progress bar */}
            {step < 4 && (
              <div className="form-progress" aria-label="Form progress">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`form-progress__step${step > i ? ' done' : step === i ? ' done' : ''}`} />
                ))}
              </div>
            )}

            {/* Step 1, 2, 3 — option selectors */}
            {step < 3 && (
              <div className="form-step is-active">
                <h2 className="form-question">{STEPS[step].question}</h2>
                <div className="form-options">
                  {STEPS[step].options.map((opt) => (
                    <button
                      key={opt}
                      className={`form-option${formData[STEPS[step].key] === opt ? ' selected' : ''}`}
                      onClick={() => selectOption(STEPS[step].key, opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {step > 0 && (
                  <div className="form-actions">
                    <button className="btn-secondary" onClick={goBack}>← Back</button>
                  </div>
                )}
              </div>
            )}

            {/* Step 4 — Contact Details */}
            {step === 3 && (
              <div className="form-step is-active">
                <h2 className="form-question">Where should we send your estimate?</h2>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  autoComplete="name"
                />
                <input
                  type="email"
                  className="form-input"
                  placeholder="Your Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  autoComplete="email"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                {error && (
                  <p style={{ color: 'var(--kw-accent)', fontSize: 14, marginBottom: 12 }}>{error}</p>
                )}
                <div className="form-actions">
                  <button className="btn-secondary" onClick={goBack}>← Back</button>
                  <button
                    className="btn-chamfer"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Sending…' : 'Get Estimate'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 5 — Success */}
            {step === 4 && (
              <div className="form-step is-active form-success">
                <div className="form-success__icon">🎉</div>
                <h2 className="form-question">Request Received!</h2>
                <p style={{ color: 'var(--kw-body)', marginBottom: 24 }}>
                  We'll review your requirements and get back to you with a custom estimate shortly.
                </p>
                <Link to="/" className="btn-chamfer" style={{ justifyContent: 'center' }}>
                  Back to Home
                </Link>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
