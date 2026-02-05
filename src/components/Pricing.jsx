import { useState, useEffect } from 'react'
import { trackEvent } from '../utils/facebookPixel'
import './Pricing.css'
import testimonialMichael from '../assets/images/testimonial-michael.jpg'
import testimonialDavid from '../assets/images/testimonial-david.jpg'
import testimonialRobert from '../assets/images/testimonial-robert.jpg'

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
            We've analyzed your answers. Based on your <strong className="pricing-highlight-green">{getCurrentShape()}</strong> and goal to become <strong className="pricing-highlight-green">{getDreamBody()}</strong>, here is your <strong>All-in-One Transformation Bundle</strong>.
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
          <div className="pricing-urgency-content">
            <span className="pricing-urgency-icon">⏰</span>
            <div className="pricing-urgency-text">
              <span className="pricing-urgency-label">Limited time offer expires in:</span>
              <span className="pricing-urgency-time">{formatTime(timeLeft)}</span>
            </div>
          </div>
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

        {/* Social Proof */}
        <div className="pricing-social-proof">
          <p className="pricing-social-proof-text">
            <span className="pricing-social-proof-icon">👥</span>
            Joined by <strong>42 other dads</strong> in the last hour
          </p>
        </div>

        {/* Testimonials */}
        <div className="pricing-testimonials">
          <h3 className="pricing-testimonials-title">What dads are saying</h3>
          <div className="pricing-testimonials-grid">
            <div className="pricing-testimonial">
              <div className="pricing-testimonial-image">
                <img src={testimonialMichael} alt="Michael" className="pricing-testimonial-img" />
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
                <img src={testimonialDavid} alt="David" className="pricing-testimonial-img" />
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
                <img src={testimonialRobert} alt="Robert" className="pricing-testimonial-img" />
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

        {/* How It Works */}
        <div className="pricing-how-it-works">
          <h3 className="pricing-how-it-works-title">How It Works</h3>
          <div className="pricing-steps">
            <div className="pricing-step">
              <div className="pricing-step-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 16H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h4 className="pricing-step-title">STEP 1: Take Quiz</h4>
              <p className="pricing-step-description">
                Answer a few quick questions about your body, goals, and lifestyle. We'll analyze your answers to create your personalized plan.
              </p>
            </div>

            <div className="pricing-step">
              <div className="pricing-step-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="pricing-step-title">STEP 2: Get Your Plan</h4>
              <p className="pricing-step-description">
                Your custom workout blueprint and nutrition plan are delivered to your inbox immediately. Start your first workout tomorrow.
              </p>
            </div>

            <div className="pricing-step">
              <div className="pricing-step-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="pricing-step-title">STEP 3: See Results</h4>
              <p className="pricing-step-description">
                Follow your personalized plan and see visible results in just 4 weeks. Track your progress and adjust as needed.
              </p>
            </div>
          </div>
        </div>

        {/* Guarantee Section */}
        <div className="pricing-guarantee-section">
          <div className="pricing-guarantee-content">
            <div className="pricing-guarantee-icon-wrapper">
              <svg className="pricing-guarantee-shield" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 5V11C4 16.55 7.16 21.74 12 23C16.84 21.74 20 16.55 20 11V5L12 2Z" stroke="#1B3022" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="#52C41A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="pricing-guarantee-title">30-Day Money-Back Guarantee</h3>
            <p className="pricing-guarantee-description">
              We believe that our plan will work for you, and you should see visible results in only 4 weeks! We're even ready to return your money if you can demonstrate that you followed the plan but didn't see any results.
            </p>
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
