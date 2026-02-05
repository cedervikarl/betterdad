import { useState, useEffect } from 'react'
import ConfidenceQuestion from './ConfidenceQuestion'
import './LoadingScreen.css'

function LoadingScreen({ onComplete, onConfidenceAnswer, userData }) {
  const [progress, setProgress] = useState(0)
  const [showConfidenceQuestion, setShowConfidenceQuestion] = useState(false)
  const [confidenceAnswered, setConfidenceAnswered] = useState(false)

  const loadingMessages = [
    "Analyzing your stress levels...",
    "Calculating optimal recovery for 35+...",
    "Customizing meal plan for your budget...",
    "Optimizing workout schedule...",
    "Finalizing your personalized plan..."
  ]

  // Get current message based on progress
  const getCurrentMessage = () => {
    if (progress < 20) return loadingMessages[0]
    if (progress < 40) return loadingMessages[1]
    if (progress < 60) return loadingMessages[2]
    if (progress < 80) return loadingMessages[3]
    return loadingMessages[4]
  }

  useEffect(() => {
    if (showConfidenceQuestion) {
      return // Don't run progress when showing question
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        // Pause at 50% to show confidence question
        if (prev >= 50 && !confidenceAnswered) {
          setShowConfidenceQuestion(true)
          return 50
        }
        
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => onComplete(), 500)
          return 100
        }
        
        return prev + 1
      })
    }, 100)

    return () => clearInterval(interval)
  }, [onComplete, confidenceAnswered, showConfidenceQuestion])

  // Continue progress after confidence is answered
  useEffect(() => {
    if (confidenceAnswered && !showConfidenceQuestion && progress === 50) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => onComplete(), 500)
            return 100
          }
          return prev + 1
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [confidenceAnswered, showConfidenceQuestion, progress, onComplete])

  const handleConfidenceAnswer = (answer) => {
    onConfidenceAnswer(answer)
    setConfidenceAnswered(true)
    setShowConfidenceQuestion(false)
  }

  const circumference = 2 * Math.PI * 45
  const offset = circumference - (progress / 100) * circumference

  if (showConfidenceQuestion) {
    return (
      <div className="loading-screen-container">
        <ConfidenceQuestion onAnswer={handleConfidenceAnswer} />
      </div>
    )
  }

  return (
    <div className="loading-screen-container">
      <div className="loading-screen-content">
        <div className="loading-circle-wrapper">
          <svg className="loading-circle" viewBox="0 0 100 100">
            <circle
              className="loading-circle-bg"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e0ddd8"
              strokeWidth="8"
            />
            <circle
              className="loading-circle-progress"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="loading-percentage">{progress}%</div>
        </div>
        <div className="loading-message-container">
          <p className="loading-message">{getCurrentMessage()}</p>
        </div>
        <h2 className="loading-title">Creating your personalized Better Dad Blueprint…</h2>
        
        <div className="loading-testimonial">
          <p className="loading-testimonial-text">100.000 people have chosen BetterDad</p>
          <div className="loading-rating">
            <span className="loading-stars">★★★★★</span>
            <span className="loading-review-text">"This program changed my life!"</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen




