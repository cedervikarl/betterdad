import { useState, useEffect } from 'react'
import './WeightInput.css'

function WeightInput({ onNext, initialValue = '' }) {
  const [unit, setUnit] = useState('kg')
  const [value, setValue] = useState(initialValue)

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
    if (value) {
      onNext({ weight: value, unit })
    }
  }

  return (
    <div className="weight-input-container">
      <div className="weight-input-content">
        <h2 className="weight-input-title">What's your current weight?</h2>
        <form onSubmit={handleSubmit} className="weight-input-form">
          <div className="weight-input-wrapper">
            <div className="unit-toggle">
              <button
                type="button"
                className={`unit-button ${unit === 'kg' ? 'active' : ''}`}
                onClick={() => setUnit('kg')}
              >
                kg
              </button>
              <button
                type="button"
                className={`unit-button ${unit === 'lbs' ? 'active' : ''}`}
                onClick={() => setUnit('lbs')}
              >
                lbs
              </button>
            </div>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={unit === 'kg' ? '80' : '176'}
              className="weight-input-field"
              required
              min={unit === 'kg' ? 30 : 66}
              max={unit === 'kg' ? 200 : 440}
            />
          </div>
          <p className="weight-input-subtext">
            {unit === 'kg' ? 'Range: 30-200 kg' : 'Range: 66-440 lbs'}
          </p>
          <button type="submit" className="weight-input-button">
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}

export default WeightInput




