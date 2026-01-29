import './Results.css'

const PLANS = [
  {
    id: 'kickstart',
    title: '4-Week Kickstart',
    subtitle: 'Quick visible results',
    description: 'Perfect for dads who want to see fast progress and build momentum.'
  },
  {
    id: 'leandad',
    title: '12-Week LeanDad Program',
    subtitle: 'Fat loss + muscle',
    description: 'A balanced program designed to help you lose fat while building lean muscle.'
  },
  {
    id: 'transformation',
    title: '24-Week Full Transformation',
    subtitle: 'Long-term change',
    description: 'The complete journey to transform your body and build lasting habits.'
  }
]

function Results({ onPlanSelect }) {
  return (
    <div className="results-container">
      <div className="results-content">
        <h1 className="results-title">Your DADBOD TO LEANBODY plan is ready</h1>
        <p className="results-subtitle">
          Based on your answers, we built a realistic plan that fits your age, schedule and current shape.
        </p>
        <div className="plans-grid">
          {PLANS.map((plan) => (
            <div key={plan.id} className="plan-card">
              <h3 className="plan-title">{plan.title}</h3>
              <p className="plan-subtitle">{plan.subtitle}</p>
              <p className="plan-description">{plan.description}</p>
              <button
                className="plan-button"
                onClick={() => onPlanSelect(plan)}
              >
                Continue
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Results

