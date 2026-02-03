import './Hero.css'
import heroImage from '../assets/images/hero-workout.jpg'

function Hero({ onStart }) {
  return (
    <div className="hero">
      <div className="hero-wrapper">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge">100% Money-Back Guarantee</div>
            <h1 className="hero-title">
              Get into the best shape of your life before summer
            </h1>
            <p className="hero-subtitle">
              OR GET YOUR MONEY BACK
            </p>
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
            <div className="hero-image-wrapper">
              <img src={heroImage} alt="Fit dad working out" className="hero-image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
