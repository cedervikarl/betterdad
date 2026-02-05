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

  // Calculate weight loss (handle both weight gain and loss)
  const weightChange = Math.abs(weightLoss)
  const unit = userData.weightUnit || userData.unit || 'kg'
  
  return (
    <div className="projection-graph-container">
      <div className="projection-graph-content">
        <div className="projection-graph-wrapper">
          <div className="projection-graph">
            <svg viewBox="0 0 400 200" className="projection-svg">
              <defs>
                <linearGradient id="weightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF4D4F" />
                  <stop offset="100%" stopColor="#52C41A" />
                </linearGradient>
              </defs>
              <path
                d="M 50 150 Q 200 120, 350 50"
                stroke="url(#weightGradient)"
                strokeWidth="5"
                fill="none"
                className="projection-line"
              />
              <circle cx="50" cy="150" r="8" fill="#FF4D4F" />
              <circle cx="350" cy="50" r="8" fill="#52C41A" />
            </svg>
          </div>
        </div>

        <div className="projection-prediction">
          <p className="projection-text">
            You could lose up to {weightChange.toFixed(1)} {unit} in the next 8 weeks
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




