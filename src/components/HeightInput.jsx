import { useState, useEffect } from 'react'
import './HeightInput.css'

function HeightInput({ onNext, initialValue = '' }) {
  const [unit, setUnit] = useState('cm')
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-scroll to top when component mounts (desktop only)
  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    if (!isMobile) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [])

  // Clear value when unit changes
  useEffect(() => {
    setValue('')
    setError('')
  }, [unit])

  const handleChange = (e) => {
    let inputValue = e.target.value
    
    if (unit === 'ft') {
      // Handle backspace/delete: if user is deleting and value becomes just " ft" or similar, clear it
      if (inputValue.trim() === 'ft' || inputValue.trim() === '' || inputValue.match(/^\s*ft\s*$/)) {
        setValue('')
        setError('')
        return
      }
      
      // For feet: only allow digits, auto-format as "X ft Y"
      // Remove any non-digit characters
      const digitsOnly = inputValue.replace(/\D/g, '')
      
      if (digitsOnly === '') {
        setValue('')
        setError('')
        return
      }
      
      // Limit to max 2 digits: first = feet (3-8), second = inches (0-11)
      // If more than 2 digits, only take the first 2
      const limitedDigits = digitsOnly.slice(0, 2)
      
      if (limitedDigits.length === 1) {
        // Single digit: show "X ft"
        setValue(`${limitedDigits} ft`)
      } else {
        // Two digits: first = feet, second = inches
        const feet = limitedDigits[0]
        const inches = limitedDigits[1]
        setValue(`${feet} ft ${inches}`)
      }
      setError('')
    } else {
      // For cm: allow decimals with comma or period
      inputValue = inputValue.replace(',', '.')
      
      // Allow empty, numbers, and one decimal point
      if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
        setValue(inputValue)
        setError('')
      }
    }
  }
  
  const handleKeyDown = (e) => {
    if (unit === 'ft') {
      // If user selects all text (Ctrl+A / Cmd+A) and presses backspace/delete, clear the value
      if ((e.key === 'Backspace' || e.key === 'Delete') && e.target.selectionStart === 0 && e.target.selectionEnd === e.target.value.length) {
        setValue('')
        e.preventDefault()
      }
    }
  }

  const validateAndSubmit = (e) => {
    e.preventDefault()
    
    if (isSubmitting) return // Prevent double submission
    
    if (!value || value.trim() === '') {
      setError('Please enter your height')
      return
    }

    let numValue

    if (unit === 'ft') {
      // Parse "6 ft 4" format
      const match = value.match(/(\d+)\s*ft\s*(\d+)?/)
      if (match) {
        const feet = parseInt(match[1], 10)
        const inches = match[2] ? parseInt(match[2], 10) : 0
        
        if (isNaN(feet) || feet < 3 || feet > 8) {
          setError('Height must be between 3 and 8 ft')
          return
        }
        
        if (inches < 0 || inches > 11) {
          setError('Inches must be between 0 and 11')
          return
        }
        
        // Convert to decimal feet: 6 ft 4 = 6.33 feet (4/12 = 0.33)
        numValue = feet + (inches / 12)
      } else {
        // Try to parse as just digits (fallback)
        const digitsOnly = value.replace(/\D/g, '')
        if (digitsOnly.length >= 1) {
          const feet = parseInt(digitsOnly.slice(0, -1) || digitsOnly, 10)
          const inches = digitsOnly.length > 1 ? parseInt(digitsOnly.slice(-1), 10) : 0
          
          if (feet < 3 || feet > 8) {
            setError('Height must be between 3 and 8 ft')
            return
          }
          
          numValue = feet + (inches / 12)
        } else {
          setError('Please enter a valid height')
          return
        }
      }
    } else {
      // For cm: convert comma to period if present
      const normalizedValue = value.replace(',', '.')
      numValue = parseFloat(normalizedValue)

      if (isNaN(numValue)) {
        setError('Please enter a valid number')
        return
      }

      if (numValue < 100 || numValue > 250) {
        setError('Height must be between 100 and 250 cm')
        return
      }
    }

    // Convert to number and send
    setIsSubmitting(true)
    setTimeout(() => {
      onNext({ height: numValue, unit })
    }, 100)
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
              type={unit === 'ft' ? 'text' : 'number'}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={unit === 'cm' ? '170' : '64'}
              className="height-input-field"
              step={unit === 'cm' ? 'any' : undefined}
              min={unit === 'cm' ? 100 : undefined}
              max={unit === 'cm' ? 250 : undefined}
            />
          </div>
          {error && (
            <p className="height-input-error">{error}</p>
          )}
          <p className="height-input-subtext">
            {unit === 'cm' ? 'Range: 100-250 cm' : 'Range: 3-8 ft'}
          </p>
          <button 
            type="submit" 
            className="height-input-button"
            disabled={isSubmitting || !value || error}
          >
            {isSubmitting ? 'Loading...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default HeightInput




