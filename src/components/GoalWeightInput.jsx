import { useState, useEffect } from 'react'
import './GoalWeightInput.css'

function GoalWeightInput({ onNext, initialValue = '' }) {
  const [unit, setUnit] = useState('kg')
  const [value, setValue] = useState(initialValue)

  // Auto-scroll to top when component mounts (smooth, without showing URL bar)
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value) {
      onNext({ goalWeight: value, unit })
    }
  }

  return (
    <div className="goal-weight-input-container">
      <div className="goal-weight-input-content">
        <h2 className="goal-weight-input-title">What's your goal weight?</h2>
        <form onSubmit={handleSubmit} className="goal-weight-input-form">
          <div className="goal-weight-input-wrapper">
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
              placeholder={unit === 'kg' ? '75' : '165'}
              className="goal-weight-input-field"
              required
              min={unit === 'kg' ? 30 : 66}
              max={unit === 'kg' ? 200 : 440}
            />
          </div>
          <p className="goal-weight-input-subtext">
            {unit === 'kg' ? 'Range: 30-200 kg' : 'Range: 66-440 lbs'}
          </p>
          <button type="submit" className="goal-weight-input-button">
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}

export default GoalWeightInput




