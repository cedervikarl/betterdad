import { useState, useEffect, useRef } from 'react'
import './HeightInput.css'

function HeightInput({ onNext, initialValue = '' }) {
  const [unit, setUnit] = useState('cm')
  const [cmValue, setCmValue] = useState('')
  const [feet, setFeet] = useState('')
  const [inches, setInches] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const inchesRef = useRef(null)

  // Auto-scroll to top when component mounts (desktop only)
  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    if (!isMobile) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [])

  // Clear values when unit changes
  useEffect(() => {
    setCmValue('')
    setFeet('')
    setInches('')
    setError('')
  }, [unit])

  // Fokusera första fältet direkt för snabbare flow
  useEffect(() => {
    const firstInput = document.querySelector('.height-input-field')
    if (firstInput) firstInput.focus()
  }, [unit])

  const handleFeetChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 1) // Bara 1 siffra (3-8)
    setFeet(val)
    setError('')
    // Auto-hopp till inches när feet är ifyllt
    if (val.length === 1 && inchesRef.current) {
      inchesRef.current.focus()
    }
  }

  const handleInchesChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2) // Max 2 siffror (0-11)
    setInches(val)
    setError('')
  }

  const validateAndSubmit = (e) => {
    e.preventDefault()
    if (isSubmitting) return

    let numValue

    if (unit === 'ft') {
      const f = parseInt(feet)
      const i = parseInt(inches) || 0

      if (isNaN(f) || f < 3 || f > 8) {
        setError('Please enter feet (3-8)')
        return
      }

      if (i < 0 || i > 11) {
        setError('Inches must be 0-11')
        return
      }

      numValue = f + (i / 12)
    } else {
      numValue = parseFloat(cmValue)

      if (isNaN(numValue) || numValue < 100 || numValue > 250) {
        setError('Please enter height (100-250 cm)')
        return
      }
    }

    setIsSubmitting(true)
    // Ingen delay, skicka direkt för att minimera väntetid
    onNext({ height: numValue, unit })
  }

  return (
    <div className="height-input-container">
      <div className="height-input-content">
        <h2 className="height-input-title">How tall are you?</h2>
        <form onSubmit={validateAndSubmit} className="height-input-form">
          <div className="height-input-wrapper">
            <div className="unit-toggle">
              <button 
                type="button" 
                className={`unit-button ${unit === 'cm' ? 'active' : ''}`}
                onClick={() => setUnit('cm')}
              >
                cm
              </button>
              <button 
                type="button" 
                className={`unit-button ${unit === 'ft' ? 'active' : ''}`}
                onClick={() => setUnit('ft')}
              >
                ft
              </button>
            </div>
            {unit === 'ft' ? (
              <div className="dual-input-container">
                <div className="input-box">
                  <input
                    type="number"
                    pattern="\d*"
                    value={feet}
                    onChange={handleFeetChange}
                    placeholder="5"
                    className="height-input-field split"
                    min={3}
                    max={8}
                  />
                  <span className="input-label">ft</span>
                </div>
                <div className="input-box">
                  <input
                    type="number"
                    pattern="\d*"
                    ref={inchesRef}
                    value={inches}
                    onChange={handleInchesChange}
                    placeholder="7"
                    className="height-input-field split"
                    min={0}
                    max={11}
                  />
                  <span className="input-label">in</span>
                </div>
              </div>
            ) : (
              <input
                type="number"
                pattern="\d*"
                value={cmValue}
                onChange={(e) => setCmValue(e.target.value)}
                placeholder="175"
                className="height-input-field"
                step="any"
                min={100}
                max={250}
              />
            )}
          </div>
          {error && <p className="height-input-error">{error}</p>}
          <button 
            type="submit" 
            className="height-input-button" 
            disabled={isSubmitting || (unit === 'ft' ? !feet : !cmValue)}
          >
            {isSubmitting ? 'Processing...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default HeightInput
