import './Hero.css'
import heroImage from '../assets/images/info-5-guarantee.jpg'

function Hero({ onStart }) {
  return (
    <div className="hero-page">
      {/* HERO SECTION */}
      <section className="hero-section">
      <div className="hero-container">
          <div className="hero-grid">
        <div className="hero-content">
              <div className="hero-badge">100% Money-Back Guarantee</div>
              <h1 className="hero-title">
                Get into the best shape of your life before summer
              </h1>
              <div className="hero-guarantee-wrapper">
                <div className="hero-title-divider"></div>
                <p className="hero-guarantee">OR GET YOUR MONEY BACK</p>
              </div>
              <div className="hero-image-mobile">
                <img src={heroImage} alt="Fit dad" className="hero-image" />
              </div>
              <p className="hero-description">
                Take the 3 minute quiz and get your customized plan based on your life, stress, hormones and equipment sent to you in seconds.
              </p>
              <button className="hero-cta" onClick={onStart}>
                Start Quiz
              </button>
              <div className="hero-trust">
                <div className="trust-item">
                  <span className="trust-icon">✓</span>
                  <span>100,000+ dads transformed</span>
                </div>
                <div className="trust-item">
                  <span className="trust-icon">✓</span>
                  <span>Results in 4 weeks</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <img src={heroImage} alt="Fit dad working out" className="hero-image" />
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF SECTION */}
      <section className="social-proof-section">
        <div className="container">
          <h2 className="section-title">Join 100,000+ Dads Who Transformed Their Lives</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-quote">"Lost 24 lbs in 8 weeks without giving up weekends"</p>
              <div className="testimonial-author">
                <div className="testimonial-name">Michael, 34</div>
                <div className="testimonial-result">Lost 24 lbs</div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-quote">"Finally have energy to play with my kids after work"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar"></div>
                <div>
                  <div className="testimonial-name">David, 41</div>
                  <div className="testimonial-result">Lost 18 lbs</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-quote">"Best investment I've made. Plan fits my busy schedule"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar"></div>
                <div>
                  <div className="testimonial-name">James, 38</div>
                  <div className="testimonial-result">Lost 20 lbs</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-quote">"Simple, effective, and actually sustainable"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar"></div>
                <div>
                  <div className="testimonial-name">Robert, 42</div>
                  <div className="testimonial-result">Lost 22 lbs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">📋</div>
              <h3 className="step-title">Take Quiz</h3>
              <p className="step-description">60 seconds to answer questions about your goals, equipment, and lifestyle</p>
            </div>
            <div className="step-card">
              <div className="step-icon">📧</div>
              <h3 className="step-title">Get Your Plan</h3>
              <p className="step-description">Instantly receive your customized plan sent to your inbox in seconds</p>
            </div>
            <div className="step-card">
              <div className="step-icon">📈</div>
              <h3 className="step-title">See Results</h3>
              <p className="step-description">Follow your plan and see visible results in just 4 weeks</p>
            </div>
          </div>
          <button className="section-cta" onClick={onStart}>
            Start Your Transformation →
          </button>
        </div>
      </section>

      {/* GUARANTEE SECTION */}
      <section className="guarantee-section">
        <div className="container">
          <div className="guarantee-content">
            <div className="guarantee-badge-large">100% MONEY-BACK GUARANTEE</div>
            <h2 className="guarantee-title">Zero Risk. All Reward.</h2>
            <p className="guarantee-text">
              If you don't see results in 4 weeks, we refund every penny. No questions asked.
            </p>
            <button className="guarantee-cta" onClick={onStart}>
              Claim Your Guarantee →
            </button>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            <div className="faq-item">
              <div className="faq-question">Do I need a gym membership?</div>
              <div className="faq-answer">No, all workouts are designed to be done at home with minimal or no equipment.</div>
              </div>
            <div className="faq-item">
              <div className="faq-question">How much time per day?</div>
              <div className="faq-answer">15-30 minutes is all you need. We respect your time and focus on maximum efficiency.</div>
              </div>
            <div className="faq-item">
              <div className="faq-question">Will this work for me at 40+?</div>
              <div className="faq-answer">Yes, our plans are specifically designed for dads 35+ with busy schedules and real-life constraints.</div>
              </div>
            <div className="faq-item">
              <div className="faq-question">What if I travel a lot?</div>
              <div className="faq-answer">Perfect! Our plans are built for busy schedules and can be adapted to work anywhere, anytime.</div>
            </div>
          </div>
          <button className="section-cta" onClick={onStart}>
            Start Quiz Now →
          </button>
        </div>
      </section>
    </div>
  )
}

export default Hero
