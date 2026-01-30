import { useEffect } from 'react'
import { trackPurchase } from '../utils/facebookPixel'
import './Success.css'

function Success({ sessionId, email, planPrice, currency }) {
  useEffect(() => {
    // Track purchase when user lands on success page
    if (planPrice && currency) {
      trackPurchase(planPrice, currency)
    }
  }, [planPrice, currency])
  const handleOpenEmail = () => {
    // Open default email client
    window.location.href = `mailto:${email || ''}`
  }

  return (
    <div className="success-container">
      <div className="success-content">
        <div className="success-icon">✓</div>
        <h1 className="success-title">Time to get to work! 💪</h1>
        <p className="success-message">
          Your payment was successful. Your personalized DadBod Elimination Protocol is being created right now.
        </p>
        
        <div className="success-email-box">
          <h2 className="success-email-title">Check your email</h2>
          <p className="success-email-text">
            We've sent your personalized plan to:
          </p>
          <a href={`mailto:${email || ''}`} className="success-email-address">{email || 'your email address'}</a>
          <p className="success-email-note">
            It may take a few minutes to arrive. Don't forget to check your spam folder!
          </p>
          <button className="success-email-button" onClick={handleOpenEmail}>
            Open Email App
          </button>
        </div>

        <div className="success-reviews">
          <h3 className="success-reviews-title">Join 150,000+ dads who've transformed their lives</h3>
          <div className="success-review-cards">
            <div className="success-review-card">
              <div className="success-review-stars">★★★★★</div>
              <p className="success-review-text">"Lost 8kg in 6 weeks. Finally have energy to play with my kids after work."</p>
              <p className="success-review-author">— Michael, 34</p>
            </div>
            <div className="success-review-card">
              <div className="success-review-stars">★★★★★</div>
              <p className="success-review-text">"Best investment I've made. The plan fits perfectly into my busy schedule."</p>
              <p className="success-review-author">— David, 41</p>
            </div>
            <div className="success-review-card">
              <div className="success-review-stars">★★★★★</div>
              <p className="success-review-text">"Simple, effective, and actually sustainable. This is the one that worked."</p>
              <p className="success-review-author">— James, 38</p>
            </div>
          </div>
        </div>

        <div className="success-motivation">
          <h3 className="success-motivation-title">You've got this!</h3>
          <p className="success-motivation-text">
            Consistency beats perfection. Start with Week 1, Day 1 today. Even 10 minutes is better than nothing.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Success

