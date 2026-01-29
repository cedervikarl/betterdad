import { useState, useEffect } from 'react'
import './EmailCapture.css'

function EmailCapture({ onNext }) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)

  // Auto-scroll to top when component mounts (only if scrolled down)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.scrollY > 200) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
    }, 150)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email && consent) {
      window.localStorage.setItem('betterdad_email', email)
      onNext(email, consent)
    }
  }

  return (
    <div className="email-capture-container">
      <div className="email-capture-content">
        <h2 className="email-capture-title">Where should we send your DADBOD TO LEANBODY plan?</h2>
        <form onSubmit={handleSubmit} className="email-capture-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="email-capture-input"
            required
          />
          <label className="email-capture-consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            <span>I agree to receive my personalized workout plan</span>
          </label>
          <button type="submit" className="email-capture-button" disabled={!email || !consent}>
            Get My Plan
          </button>
        </form>
      </div>
    </div>
  )
}

export default EmailCapture




