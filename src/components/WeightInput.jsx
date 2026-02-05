import { useState, useEffect } from 'react'
import './WeightInput.css'

function WeightInput({ onNext, initialWeight = '', initialGoalWeight = '' }) {
  const [unit, setUnit] = useState('kg')
  const [weight, setWeight] = useState(initialWeight)
  const [goalWeight, setGoalWeight] = useState(initialGoalWeight)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-scroll to top when component mounts (desktop only)
  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    if (!isMobile) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [])

  // Clear values when unit changes
  useEffect(() => {
    setWeight('')
    setGoalWeight('')
  }, [unit])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isSubmitting) return // Prevent double submission
    
    if (weight && goalWeight) {
      setIsSubmitting(true)
      // Small delay to show feedback before navigation
      setTimeout(() => {
        onNext({ weight, goalWeight, unit })
      }, 100)
    }
  }

  return (
    <div className="weight-input-container">
      <div className="weight-input-content">
        <h2 className="weight-input-title">What's your weight?</h2>
        <form onSubmit={handleSubmit} className="weight-input-form">
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
          
          <div className="weight-input-wrapper">
            <div className="weight-input-group">
              <label className="weight-input-label">Current Weight</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={unit === 'kg' ? '80' : '176'}
                className="weight-input-field"
                required
                step="any"
                min={unit === 'kg' ? 30 : 66}
                max={unit === 'kg' ? 200 : 440}
              />
            </div>
            
            <div className="weight-input-group">
              <label className="weight-input-label">Goal Weight</label>
              <input
                type="number"
                value={goalWeight}
                onChange={(e) => setGoalWeight(e.target.value)}
                placeholder={unit === 'kg' ? '75' : '165'}
                className="weight-input-field"
                required
                step="any"
                min={unit === 'kg' ? 30 : 66}
                max={unit === 'kg' ? 200 : 440}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="weight-input-button"
            disabled={isSubmitting || !weight || !goalWeight}
          >
            {isSubmitting ? 'Loading...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default WeightInput




