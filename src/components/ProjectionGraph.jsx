import { useEffect } from 'react'
import './ProjectionGraph.css'

function ProjectionGraph({ userData, onNext }) {
  // Auto-scroll to top when component mounts
  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    if (!isMobile) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [])
  const currentWeight = userData.weight || 80
  const goalWeight = userData.goalWeight || 75
  const weightLoss = currentWeight - goalWeight
  const predictedDate = new Date()
  predictedDate.setMonth(predictedDate.getMonth() + 2) // 2 months prediction
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const unit = userData.unit || 'kg'
  const currentWeightDisplay = `${currentWeight} ${unit}`
  const goalWeightDisplay = `${goalWeight} ${unit}`

  return (
    <div className="projection-graph-container">
      <div className="projection-graph-content">
        <p className="projection-subtitle">Based on 100,000+ dad transformations, here's your predicted timeline...</p>
        
        <div className="projection-graph-wrapper">
          <div className="projection-graph">
            <svg viewBox="0 0 400 200" className="projection-svg">
              <defs>
                <linearGradient id="weightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF4D4F" />
                  <stop offset="50%" stopColor="#FAAD14" />
                  <stop offset="100%" stopColor="#52C41A" />
                </linearGradient>
              </defs>
              <path
                d="M 50 150 Q 150 100, 200 80 T 350 50"
                stroke="url(#weightGradient)"
                strokeWidth="4"
                fill="none"
                className="projection-line"
              />
              <circle cx="50" cy="150" r="6" fill="#FF4D4F" />
              <circle cx="350" cy="50" r="6" fill="#52C41A" />
            </svg>
            <div className="projection-labels">
              <div className="projection-label-left">
                <span className="projection-label-weight">{currentWeightDisplay}</span>
                <span className="projection-label-text">Current weight</span>
              </div>
              <div className="projection-label-right">
                <span className="projection-label-weight">{goalWeightDisplay}</span>
                <span className="projection-label-text">Goal weight</span>
              </div>
            </div>
          </div>
        </div>

        <div className="projection-prediction">
          <p className="projection-text">
            You could reach <strong>{goalWeightDisplay}</strong> by <strong>{formatDate(predictedDate)}</strong>
          </p>
        </div>

        <button className="projection-graph-button" onClick={onNext}>
          Continue
        </button>
      </div>
    </div>
  )
}

export default ProjectionGraph




