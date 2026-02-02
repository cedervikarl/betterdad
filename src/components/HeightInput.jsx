import { useState, useEffect } from 'react'
import './HeightInput.css'

function HeightInput({ onNext, initialValue = '' }) {
  const [unit, setUnit] = useState('cm')
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState('')

  // Auto-scroll to top when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e) => {
    let inputValue = e.target.value
    
    // Replace comma with period for decimal separator
    inputValue = inputValue.replace(',', '.')
    
    // Allow empty, numbers, and one decimal point
    if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
      setValue(inputValue)
      setError('')
    }
  }

  const validateAndSubmit = (e) => {
    e.preventDefault()
    
    if (!value || value.trim() === '') {
      setError('Please enter your height')
      return
    }

    // Convert comma to period if present
    const normalizedValue = value.replace(',', '.')
    const numValue = parseFloat(normalizedValue)

    if (isNaN(numValue)) {
      setError('Please enter a valid number')
      return
    }

    // Validate range based on unit
    if (unit === 'cm') {
      if (numValue < 100 || numValue > 250) {
        setError('Height must be between 100 and 250 cm')
        return
      }
    } else {
      if (numValue < 3 || numValue > 8) {
        setError('Height must be between 3 and 8 ft')
        return
      }
    }

    // Convert to number and send
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
            <input
              type="number"
              value={value}
              onChange={handleChange}
              placeholder={unit === 'cm' ? '170' : '5.7'}
              className="height-input-field"
              step="any"
              min={unit === 'cm' ? 100 : 3}
              max={unit === 'cm' ? 250 : 8}
            />
          </div>
          {error && (
            <p className="height-input-error">{error}</p>
          )}
          <p className="height-input-subtext">
            {unit === 'cm' ? 'Range: 100-250 cm' : 'Range: 3-8 ft (decimals allowed)'}
          </p>
          <button type="submit" className="height-input-button">
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}

export default HeightInput




