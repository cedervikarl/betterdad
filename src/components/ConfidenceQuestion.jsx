import { useEffect } from 'react'
import './ConfidenceQuestion.css'

function ConfidenceQuestion({ onAnswer }) {
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
  const options = [
    "Not confident",
    "Somewhat",
    "Confident",
    "Very confident"
  ]

  return (
    <div className="confidence-question-container">
      <div className="confidence-question-content">
        <h2 className="confidence-question-title">How confident are you that you can follow your plan?</h2>
        <div className="confidence-options-container">
          {options.map((option, index) => (
            <button
              key={index}
              className="confidence-option-button"
              onClick={() => onAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConfidenceQuestion




