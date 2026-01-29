import { useState, useEffect } from 'react'
import './LoadingScreen.css'

function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => onComplete(), 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(interval)
  }, [onComplete])

  const circumference = 2 * Math.PI * 45
  const offset = circumference - (progress / 100) * circumference

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
        <h2 className="loading-title">Creating your personalized DadBod Elimination Protocol…</h2>
        
        <div className="loading-testimonial">
          <p className="loading-testimonial-text">150 million people have chosen BetterDad</p>
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




