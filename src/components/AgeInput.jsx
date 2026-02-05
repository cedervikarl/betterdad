import { useState, useEffect } from 'react'
import './AgeInput.css'

function AgeInput({ onNext, initialValue = '' }) {
  const [value, setValue] = useState(initialValue)

  // Auto-scroll to top when component mounts (desktop only)
  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    if (!isMobile) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value) {
      onNext({ age: value })
    }
  }

  return (
    <div className="age-input-container">
      <div className="age-input-content">
        <h2 className="age-input-title">How old are you?</h2>
        <form onSubmit={handleSubmit} className="age-input-form">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="35"
            className="age-input-field"
            required
            min={18}
            max={100}
          />
          <p className="age-input-subtext">
            Range: 18-100 years
          </p>
          <button type="submit" className="age-input-button">
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}

export default AgeInput




