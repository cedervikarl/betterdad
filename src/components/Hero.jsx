import './Hero.css'
import heroImage from '../assets/images/hero-workout.jpg'

function Hero({ onStart }) {
  return (
    <div className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text-section">
            <h1 className="hero-title">Get in the best shape of your life before summer</h1>
            <div className="hero-offer">OR GET YOUR MONEY BACK</div>
            <div className="hero-image-section-mobile">
              <img src={heroImage} alt="Fit dad" className="hero-image" />
            </div>
            <p className="hero-subtitle">
              Answer 21 questions to get a custom plan based on your stress, equipment, budget, and hormones. Sent to your inbox in seconds.
            </p>
            <button className="hero-button" onClick={onStart}>
              LET'S DO IT
            </button>
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

