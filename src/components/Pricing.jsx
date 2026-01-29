import { useState, useEffect } from 'react'
import './Pricing.css'
import testimonialImage1 from '../assets/images/info-2-michael.jpg'
import testimonialImage2 from '../assets/images/info-1-success.jpg'
import testimonialImage3 from '../assets/images/info-3-lifestyle.jpg'
import bodyLowFat from '../assets/images/body-low-fat.jpg'
import bodyMediumFat from '../assets/images/body-medium-fat.jpg'
import bodyHigherFat from '../assets/images/body-higher-fat.jpg'
import bodyVeryHighFat from '../assets/images/body-very-high-fat.jpg'
import dreamLean from '../assets/images/dream-lean-defined.jpg'
import dreamAthletic from '../assets/images/dream-athletic-muscular.jpg'
import dreamBigger from '../assets/images/dream-bigger-strong.jpg'
import dreamSlimmer from '../assets/images/dream-slimmer-healthy.jpg'

function Pricing({ onSelectPlan, userData }) {
  const [selectedPlan, setSelectedPlan] = useState('4-week')
  const [timeLeft, setTimeLeft] = useState(5 * 60) // 5 minutes in seconds
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 5 * 60 // Reset to 5 minutes
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Calculate macros for blueprint preview
  const weight = userData?.weight || 80
  const height = userData?.height || 175
  const age = userData?.age || 35
  const goalWeight = userData?.goalWeight || weight - 5
  
  // Simple BMR calculation
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5
  const activityMultiplier = userData?.['9'] === 'Still full of energy' ? 1.725 : 
                            userData?.['9'] === 'Okay' ? 1.55 :
                            userData?.['9'] === 'Low energy but push through' ? 1.375 : 1.2
  const tdee = Math.round(bmr * activityMultiplier)
  const goal = userData?.['5'] || 'Lose fat'
  let dailyCalories = tdee
  if (goal.includes('Lose fat')) {
    dailyCalories = Math.round(tdee - 500)
  } else if (goal.includes('Build muscle')) {
    dailyCalories = Math.round(tdee + 300)
  }
  
  const protein = Math.round(dailyCalories * 0.4 / 4)
  const carbs = Math.round(dailyCalories * 0.3 / 4)
  const fats = Math.round(dailyCalories * 0.3 / 9)
  
  // Get workout days based on equipment and time
  const equipment = userData?.['7'] || 'No equipment'
  const timePerDay = userData?.['6'] || '20–30 minutes'
  const workoutDays = age >= 45 ? 3 : age >= 35 ? 3 : 4
  
  // Get body type images for before/after
  const getCurrentBodyImage = () => {
    const answer = userData?.['2'] || 'Medium body fat'
    if (answer.includes('Low')) return bodyLowFat
    if (answer.includes('Medium')) return bodyMediumFat
    if (answer.includes('Higher')) return bodyHigherFat
    if (answer.includes('Very high')) return bodyVeryHighFat
    return bodyMediumFat
  }
  
  const getDreamBodyImage = () => {
    const answer = userData?.['3'] || 'Just slimmer and healthier'
    if (answer.includes('Lean')) return dreamLean
    if (answer.includes('Athletic')) return dreamAthletic
    if (answer.includes('Bigger')) return dreamBigger
    if (answer.includes('slimmer')) return dreamSlimmer
    return dreamSlimmer
  }
  
  const currentBodyImage = getCurrentBodyImage()
  const dreamBodyImage = getDreamBodyImage()
  
  // Get body type labels
  const getCurrentBodyLabel = () => {
    const answer = userData?.['2'] || 'Medium body fat'
    if (answer.includes('Low')) return 'Low body fat'
    if (answer.includes('Medium')) return 'Medium body fat'
    if (answer.includes('Higher')) return 'Higher body fat'
    if (answer.includes('Very high')) return 'Very high body fat'
    return 'Medium body fat'
  }
  
  const getDreamBodyLabel = () => {
    const answer = userData?.['3'] || 'Just slimmer and healthier'
    if (answer.includes('Lean')) return 'Lean and defined'
    if (answer.includes('Athletic')) return 'Athletic and muscular'
    if (answer.includes('Bigger')) return 'Bigger and strong'
    if (answer.includes('slimmer')) return 'Slimmer and healthier'
    return 'Slimmer and healthier'
  }

  const plans = [
    {
      id: '1-week',
      name: '1-Week Trial',
      price: 142.84,
      originalPrice: 214.00,
      dailyPrice: 20.41,
      duration: '1 week',
      popular: false
    },
    {
      id: '4-week',
      name: '4-Week Plan',
      price: 428.56,
      originalPrice: 643.00,
      dailyPrice: 15.31,
      duration: '4 weeks',
      popular: true
    },
    {
      id: '12-week',
      name: '12-Week Plan',
      price: 714.27,
      originalPrice: 1071.00,
      dailyPrice: 8.50,
      duration: '12 weeks',
      popular: false
    }
  ]

  return (
    <div className="pricing-container">
      <div className="pricing-content">
        <div className="pricing-hero">
          <h1 className="pricing-hero-title">Your Plan is Ready</h1>
          <p className="pricing-hero-subtitle">
            Based on your answers, we've created a personalized DadBod Blueprint just for you.
          </p>
        </div>
        
        <div className="pricing-before-after">
          <div className="before-after-container">
            <div className="before-after-section">
              <div className="before-after-label">Now</div>
              <div className="before-after-image-wrapper">
                <img src={currentBodyImage} alt="Current body" className="before-after-image" />
              </div>
              <div className="before-after-info">
                <div className="before-after-info-item">
                  <div className="before-after-info-label">Body fat</div>
                  <div className="before-after-info-value">{getCurrentBodyLabel()}</div>
                </div>
              </div>
            </div>
            <div className="before-after-arrow">»</div>
            <div className="before-after-section">
              <div className="before-after-label">Your Goal</div>
              <div className="before-after-image-wrapper">
                <img src={dreamBodyImage} alt="Dream body" className="before-after-image" />
              </div>
              <div className="before-after-info">
                <div className="before-after-info-item">
                  <div className="before-after-info-label">Body fat</div>
                  <div className="before-after-info-value">{getDreamBodyLabel()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="pricing-title">Get visible results in 4 weeks!</h2>
        
        <div className="pricing-plans-grid">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id
            
            return (
              <div
                key={plan.id}
                className={`pricing-plan-card ${isSelected ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="pricing-popular-badge">MOST POPULAR</div>
                )}
                <h3 className="pricing-plan-name">{plan.name}</h3>
                <div className="pricing-plan-price">
                  <div className="pricing-price-daily-large">
                    kr{plan.dailyPrice.toFixed(2)} <span className="pricing-price-daily-label">per day</span>
                  </div>
                  <div className="pricing-price-total">
                    <span className="pricing-price-strikethrough-small">kr{plan.originalPrice.toFixed(2)}</span>
                    <span className="pricing-price-amount-small">kr{plan.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="pricing-plan-radio">
                  {isSelected ? (
                    <div className="pricing-radio-selected">✓</div>
                  ) : (
                    <div className="pricing-radio-unselected"></div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="pricing-urgency-button-wrapper">
          <div className="pricing-urgency-timer-inline">
            <span className="pricing-urgency-label-inline">Limited time offer expires in:</span>
            <span className="pricing-urgency-time-inline">{formatTime(timeLeft)}</span>
          </div>
          <button 
            className="pricing-button"
            onClick={async () => {
            const plan = plans.find(p => p.id === selectedPlan)
            if (!plan) return
            // Here we assume you have already captured the user's email in userData/email state
            // Always use likeikeab@gmail.com for now
            const email = 'likeikeab@gmail.com'
            try {
              console.log('Creating checkout session for plan:', plan.id)
              console.log('Email:', email)
              
              const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4242'
              const res = await fetch(`${backendUrl}/api/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId: plan.id, email }),
              })
              
              if (!res.ok) {
                const errorText = await res.text()
                let errorData
                try {
                  errorData = JSON.parse(errorText)
                } catch {
                  errorData = { error: errorText || 'Server error' }
                }
                console.error('Server error response:', errorData)
                console.error('Status:', res.status)
                alert(`Error: ${errorData.error || 'Could not connect to server. Make sure backend is running on port 4242.'}`)
                return
              }
              
              const data = await res.json()
              console.log('Checkout session created:', data)
              
              if (data?.url) {
                window.location.href = data.url
              } else {
                console.error('No URL in response:', data)
                alert('Could not start checkout. Please try again.')
              }
            } catch (e) {
              console.error('Fetch error:', e)
              console.error('Error details:', e.message, e.stack)
              alert(`Connection error: ${e.message}. Make sure backend server is running on port 4242.`)
            }
          }}
        >
          GET MY PLAN
        </button>
        </div>

        <div className="pricing-testimonials">
          <h3 className="pricing-testimonials-title">What dads are saying</h3>
          <div className="pricing-testimonials-grid">
            <div className="pricing-testimonial">
              <div className="pricing-testimonial-image">
                <img src={testimonialImage1} alt="Michael" className="pricing-testimonial-img" />
              </div>
              <div className="pricing-testimonial-content">
                <div className="pricing-testimonial-stars">★★★★★</div>
                <p className="pricing-testimonial-text">
                  "Lost 8kg in 6 weeks and finally have energy to play with my kids after work. Best investment I've made."
                </p>
                <p className="pricing-testimonial-name">Michael J., 34</p>
              </div>
            </div>
            <div className="pricing-testimonial">
              <div className="pricing-testimonial-image">
                <img src={testimonialImage2} alt="David" className="pricing-testimonial-img" />
              </div>
              <div className="pricing-testimonial-content">
                <div className="pricing-testimonial-stars">★★★★★</div>
                <p className="pricing-testimonial-text">
                  "The workouts fit perfectly into my busy schedule. No excuses anymore - I can do this at home!"
                </p>
                <p className="pricing-testimonial-name">David S., 41</p>
              </div>
            </div>
            <div className="pricing-testimonial">
              <div className="pricing-testimonial-image">
                <img src={testimonialImage3} alt="Robert" className="pricing-testimonial-img" />
              </div>
              <div className="pricing-testimonial-content">
                <div className="pricing-testimonial-stars">★★★★★</div>
                <p className="pricing-testimonial-text">
                  "Finally a plan that understands dads. Simple, effective, and I'm seeing results faster than I expected."
                </p>
                <p className="pricing-testimonial-name">Robert K., 38</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pricing-includes">
          <h3 className="pricing-includes-title">What's included in your plan</h3>
          <div className="pricing-includes-grid">
            <div className="pricing-include-item">
              <div className="pricing-include-icon">✓</div>
              <div className="pricing-include-text">
                <strong>Personalized workout routines</strong> tailored to your schedule and equipment
              </div>
            </div>
            <div className="pricing-include-item">
              <div className="pricing-include-icon">✓</div>
              <div className="pricing-include-text">
                <strong>Nutrition plan</strong> designed for busy dads with budget considerations
              </div>
            </div>
            <div className="pricing-include-item">
              <div className="pricing-include-icon">✓</div>
              <div className="pricing-include-text">
                <strong>Progress tracking</strong> and weekly check-ins to keep you motivated
              </div>
            </div>
            <div className="pricing-include-item">
              <div className="pricing-include-icon">✓</div>
              <div className="pricing-include-text">
                <strong>Expert support</strong> and community access for questions and motivation
              </div>
            </div>
            <div className="pricing-include-item">
              <div className="pricing-include-icon">✓</div>
              <div className="pricing-include-text">
                <strong>Flexible adjustments</strong> based on your results and feedback
              </div>
            </div>
            <div className="pricing-include-item">
              <div className="pricing-include-icon">✓</div>
              <div className="pricing-include-text">
                <strong>Home-based workouts</strong> - no gym membership required
              </div>
            </div>
          </div>
        </div>

        <div className="pricing-guarantee">
          <div className="pricing-guarantee-content">
            <div className="pricing-guarantee-icon-wrapper">
              <svg className="pricing-guarantee-shield" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 5V11C4 16.55 7.16 21.74 12 23C16.84 21.74 20 16.55 20 11V5L12 2Z" stroke="#1B3022" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="#52C41A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="pricing-guarantee-title">30-day money-back guarantee</h3>
            <p className="pricing-guarantee-description">
              We believe that our plan will work for you, and you should see visible results in only 4 weeks! We're even ready to return your money if you can demonstrate that you followed the plan but didn't see any results.
            </p>
          </div>
        </div>

        <div className="pricing-faq">
          <h3 className="pricing-faq-title">Frequently Asked Questions</h3>
          <div className="pricing-faq-list">
            <div className="pricing-faq-item">
              <h4 className="pricing-faq-question">How quickly will I see results?</h4>
              <p className="pricing-faq-answer">
                Most dads start seeing visible results within 4 weeks when following the plan consistently. Your energy levels typically improve within the first week.
              </p>
            </div>
            <div className="pricing-faq-item">
              <h4 className="pricing-faq-question">Do I need a gym membership?</h4>
              <p className="pricing-faq-answer">
                No! All workouts are designed to be done at home with minimal or no equipment. We'll adapt the plan based on what you have available.
              </p>
            </div>
            <div className="pricing-faq-item">
              <h4 className="pricing-faq-question">What if I'm a complete beginner?</h4>
              <p className="pricing-faq-answer">
                Perfect! Our plans are designed for all fitness levels, including complete beginners. We'll start you off with simple movements and progress from there.
              </p>
            </div>
            <div className="pricing-faq-item">
              <h4 className="pricing-faq-question">How much time do I need per day?</h4>
              <p className="pricing-faq-answer">
                Most workouts take 20-30 minutes, but we can adapt to your schedule. Even 10-15 minutes is better than nothing, and we'll work with what you have.
              </p>
            </div>
            <div className="pricing-faq-item">
              <h4 className="pricing-faq-question">Can I cancel anytime?</h4>
              <p className="pricing-faq-answer">
                Yes, you can cancel your subscription at any time through your account settings. There are no long-term commitments.
              </p>
            </div>
            <div className="pricing-faq-item">
              <h4 className="pricing-faq-question">Will I get support if I have questions?</h4>
              <p className="pricing-faq-answer">
                Absolutely! You'll have access to our community and can reach out with questions anytime. We're here to help you succeed.
              </p>
            </div>
          </div>
        </div>

        <p className="pricing-disclaimer">
          Your subscription will automatically renew. You can cancel anytime in your account settings.
        </p>

        <div className="pricing-legal">
          <button className="pricing-legal-button" onClick={() => window.dispatchEvent(new CustomEvent('betterdad:open-docs'))}>
            Docs
          </button>
          <div className="pricing-legal-meta">
            Likeike AB • Box 71, 193 22 Sigtuna •{' '}
            <a className="pricing-legal-link" href="mailto:likeikeab@gmail.com">likeikeab@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing

