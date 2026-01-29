import './FinalPlan.css'

function FinalPlan({ userData, onNext }) {
  const currentWeight = userData.weight || 80
  const goalWeight = userData.goalWeight || 75
  const predictedDate = new Date()
  predictedDate.setMonth(predictedDate.getMonth() + 12)

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="final-plan-container">
      <div className="final-plan-content">
        <div className="final-plan-hero">
          <h1 className="final-plan-title">Your DadBod Elimination Protocol is ready</h1>
          <p className="final-plan-subtitle">
            Built from your answers — designed to fit real dad life, not a perfect fantasy.
          </p>
          <div className="final-plan-urgency">
            <div className="final-plan-urgency-badge">Bonus unlocked</div>
            <div className="final-plan-urgency-text">
              Claim your plan now to keep your <strong>personalized setup</strong> and bonus resources.
            </div>
          </div>
        </div>
        
        <div className="final-plan-stats">
          <div className="final-plan-stat">
            <div className="final-plan-stat-label">Current weight</div>
            <div className="final-plan-stat-value">{currentWeight} kg</div>
          </div>
          <div className="final-plan-stat">
            <div className="final-plan-stat-label">Goal weight</div>
            <div className="final-plan-stat-value">{goalWeight} kg</div>
          </div>
          <div className="final-plan-stat">
            <div className="final-plan-stat-label">Timeline</div>
            <div className="final-plan-stat-value">{formatDate(predictedDate)}</div>
          </div>
        </div>

        <div className="final-plan-includes">
          <h3 className="final-plan-includes-title">What's included in your plan:</h3>
          <ul className="final-plan-list">
            <li>Personalized workout routines tailored to your schedule</li>
            <li>Nutrition plan designed for busy dads</li>
            <li>Progress tracking and weekly check-ins</li>
            <li>Expert support and community access</li>
            <li>Flexible adjustments based on your results</li>
          </ul>
        </div>

        <button className="final-plan-button" onClick={onNext}>
          Continue
        </button>

        <p className="final-plan-footnote">
          You can review your plan options next. No long forms. No fluff.
        </p>
      </div>
    </div>
  )
}

export default FinalPlan




