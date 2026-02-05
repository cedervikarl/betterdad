import { useState, useEffect } from 'react'
import { trackEvent } from '../utils/facebookPixel'
import './Pricing.css'

function Pricing({ onSelectPlan, userData }) {
  const [currency, setCurrency] = useState('EUR')
  const [timeLeft, setTimeLeft] = useState(5 * 60) // 5 minutes in seconds
  
  // Auto-scroll to top when component mounts (desktop only)
  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    if (!isMobile) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [])

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

  // Get dynamic headline based on quiz answers
  const getCurrentShape = () => {
    const answer = userData?.['2'] || 'Medium body fat'
    if (answer.includes('Low')) return 'Low body fat'
    if (answer.includes('Medium')) return 'Medium body fat'
    if (answer.includes('Higher')) return 'Higher body fat'
    if (answer.includes('Very high')) return 'Very high body fat'
    return 'Medium body fat'
  }

  const getDreamBody = () => {
    const answer = userData?.['3'] || 'Just slimmer and healthier'
    if (answer.includes('Lean')) return 'Lean and defined'
    if (answer.includes('Athletic')) return 'Athletic and muscular'
    if (answer.includes('Bigger')) return 'Bigger and strong'
    if (answer.includes('slimmer')) return 'Slimmer and healthier'
    return 'Slimmer and healthier'
  }

  // Calculate target weight and date
  const currentWeight = userData?.weight || 80
  const weightUnit = userData?.weightUnit || userData?.unit || 'kg'
  const targetWeight = (currentWeight * 0.9).toFixed(1)
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + 28) // 4 weeks
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  // Auto-detect currency
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timezone.includes('London') || timezone.includes('Europe/London')) {
      setCurrency('GBP')
    }
  }, [])

  // Single bundle pricing
  const bundlePrice = currency === 'GBP' ? 34.99 : 39.99
  const originalPrice = currency === 'GBP' ? 117 : 117
  const currencySymbol = currency === 'GBP' ? '£' : '€'

  const handlePurchase = async () => {
    const email = userData?.email || localStorage.getItem('betterdad_email') || 'likeikeab@gmail.com'
    
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4242'
      
      // Save profile BEFORE creating checkout session
      console.log('Saving profile before checkout...')
      const profileToSave = {
        ...userData,
        email: email
      }
      
      const saveRes = await fetch(`${backendUrl}/api/save-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileToSave),
      })
      
      if (!saveRes.ok) {
        console.error('Failed to save profile, but continuing...')
      } else {
        console.log('✅ Profile saved successfully')
      }
      
      // Create checkout session with bundle plan
      const res = await fetch(`${backendUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId: '4-week', // Use 4-week as bundle plan
          email, 
          currency 
        }),
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
        alert(`Error: ${errorData.error || 'Could not connect to server.'}`)
        return
      }
      
      const data = await res.json()
      console.log('Checkout session created:', data)
      
      // Track Facebook Pixel events
      trackEvent('AddToCart', {
        content_name: 'All-in-One Transformation Bundle',
        value: bundlePrice,
        currency: currency
      })
      
      trackEvent('InitiateCheckout', {
        value: bundlePrice,
        currency: currency
      })
      
      if (data?.url) {
        window.location.href = data.url
      } else {
        console.error('No URL in response:', data)
        alert('Could not start checkout. Please try again.')
      }
    } catch (e) {
      console.error('Fetch error:', e)
      alert(`Connection error: ${e.message}. Please try again.`)
    }
  }

  return (
    <div className="pricing-container">
      <div className="pricing-content">
        {/* Dynamic Headline */}
        <div className="pricing-hero">
          <h1 className="pricing-hero-title">
            We've analyzed your answers. Based on your <strong>{getCurrentShape()}</strong> and goal to become <strong>{getDreamBody()}</strong>, here is your 4-week blueprint.
          </h1>
          
          {/* Target Weight Visualization */}
          <div className="pricing-target-weight">
            Target weight: <strong>{targetWeight} {weightUnit}</strong> by <strong>{formatDate(targetDate)}</strong>
          </div>
        </div>

        {/* Value Stack - Vertical List */}
        <div className="pricing-value-stack">
          <h2 className="pricing-value-title">Your All-in-One Transformation Bundle includes:</h2>
          
          <div className="pricing-value-list">
            <div className="pricing-value-item">
              <div className="pricing-value-icon">✓</div>
              <div className="pricing-value-text">
                <strong>Custom Workout Blueprint</strong>
                <span>Tailored to your equipment and available time</span>
              </div>
            </div>

            <div className="pricing-value-item">
              <div className="pricing-value-icon">✓</div>
              <div className="pricing-value-text">
                <strong>Personalized Nutrition Plan</strong>
                <span>Based on your current weight and goal</span>
              </div>
            </div>

            <div className="pricing-value-item">
              <div className="pricing-value-icon">✓</div>
              <div className="pricing-value-text">
                <strong>The "Dad-Body" Recovery Guide</strong>
                <span>How to maintain shape despite sleep deprivation and stress</span>
              </div>
            </div>

            <div className="pricing-value-item">
              <div className="pricing-value-icon">✓</div>
              <div className="pricing-value-text">
                <strong>Instant Access</strong>
                <span>Start immediately on your phone</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="pricing-bundle">
          <div className="pricing-bundle-total">
            <span className="pricing-total-label">Total value:</span>
            <span className="pricing-total-value">{currencySymbol}{originalPrice}</span>
          </div>
          <div className="pricing-bundle-price">
            <span className="pricing-your-price-label">Your price today:</span>
            <span className="pricing-your-price-value">{currencySymbol}{bundlePrice.toFixed(2)}</span>
            <span className="pricing-one-time">(One-time payment)</span>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="pricing-currency-selector">
          <button
            className={`currency-button ${currency === 'EUR' ? 'active' : ''}`}
            onClick={() => setCurrency('EUR')}
          >
            € EUR
          </button>
          <button
            className={`currency-button ${currency === 'GBP' ? 'active' : ''}`}
            onClick={() => setCurrency('GBP')}
          >
            £ GBP
          </button>
        </div>

        {/* Urgency Timer */}
        <div className="pricing-urgency-timer">
          <span className="pricing-urgency-label">Limited time offer expires in:</span>
          <span className="pricing-urgency-time">{formatTime(timeLeft)}</span>
        </div>

        {/* Desktop Button */}
        <div className="pricing-desktop-button-wrapper">
          <button className="pricing-desktop-button" onClick={handlePurchase}>
            GET MY PLAN - {currencySymbol}{bundlePrice.toFixed(2)}
          </button>
          <div className="pricing-trust-badge-desktop">
            <span className="pricing-trust-icon">🛡️</span>
            <span className="pricing-trust-text">30-day money-back guarantee</span>
          </div>
        </div>

        {/* Sticky Footer Button (Mobile) */}
        <div className="pricing-sticky-footer">
          <button className="pricing-button-sticky" onClick={handlePurchase}>
            GET MY PLAN - {currencySymbol}{bundlePrice.toFixed(2)}
          </button>
          <div className="pricing-trust-badge">
            <span className="pricing-trust-icon">🛡️</span>
            <span className="pricing-trust-text">30-day money-back guarantee</span>
          </div>
        </div>

        {/* Testimonials */}
        <div className="pricing-testimonials">
          <h3 className="pricing-testimonials-title">What dads are saying</h3>
          <div className="pricing-testimonials-grid">
            <div className="pricing-testimonial">
              <div className="pricing-testimonial-stars">★★★★★</div>
              <p className="pricing-testimonial-text">
                "Lost 8kg in 6 weeks and finally have energy to play with my kids after work. Best investment I've made."
              </p>
              <p className="pricing-testimonial-name">Michael J., 34</p>
            </div>
            <div className="pricing-testimonial">
              <div className="pricing-testimonial-stars">★★★★★</div>
              <p className="pricing-testimonial-text">
                "The workouts fit perfectly into my busy schedule. No excuses anymore - I can do this at home!"
              </p>
              <p className="pricing-testimonial-name">David S., 41</p>
            </div>
            <div className="pricing-testimonial">
              <div className="pricing-testimonial-stars">★★★★★</div>
              <p className="pricing-testimonial-text">
                "Finally a plan that understands dads. Simple, effective, and I'm seeing results faster than I expected."
              </p>
              <p className="pricing-testimonial-name">Robert K., 38</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
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
          </div>
        </div>

        {/* Legal */}
        <div className="pricing-legal">
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
