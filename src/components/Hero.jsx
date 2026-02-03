import './Hero.css'
import heroImage from '../assets/images/hero-workout.jpg'

function Hero({ onStart }) {
  return (
    <div className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text-section">
            <h1 className="hero-title">Get in the best shape of your life before summer</h1>
            <p className="hero-subtitle">
              Answer 21 questions to get a custom plan based on your stress, equipment, budget, and hormones. Sent to your inbox in seconds.
            </p>
            <div className="hero-high-value-tag">
              Do your first workout tomorrow!
            </div>
            <button className="hero-button" onClick={onStart}>
              LET'S DO IT
            </button>
            <div className="hero-trust-bar">
              100% Results or 100% Refund. Guaranteed.
            </div>
          </div>
          <div className="hero-image-section">
            <img src={heroImage} alt="Fit dad" className="hero-image" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero

