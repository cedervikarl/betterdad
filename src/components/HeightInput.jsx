import { useState } from 'react'
import './HeightInput.css'

function HeightInput({ onNext, initialValue = '' }) {
  const [unit, setUnit] = useState('cm')
  const [value, setValue] = useState(initialValue)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value) {
      onNext({ height: value, unit })
    }
  }

  return (
    <div className="height-input-container">
      <div className="height-input-content">
        <h2 className="height-input-title">How tall are you?</h2>
        <form onSubmit={handleSubmit} className="height-input-form">
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
              onChange={(e) => setValue(e.target.value)}
              placeholder={unit === 'cm' ? '170' : '5.7'}
              className="height-input-field"
              required
              min={unit === 'cm' ? 100 : 3}
              max={unit === 'cm' ? 250 : 8}
            />
          </div>
          <p className="height-input-subtext">
            {unit === 'cm' ? 'Range: 100-250 cm' : 'Range: 3-8 ft'}
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




