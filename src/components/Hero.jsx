import './Hero.css'
import heroImage from '../assets/images/hero-workout.jpg'

function Hero({ onStart }) {
  return (
    <div className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text-section">
            <h1 className="hero-title">
              Get into the best shape of your life before summer
            </h1>
            <div className="hero-offer">
              OR GET YOUR MONEY BACK
            </div>
            <p className="hero-description">
              Take the 3 minute quiz and get your customized plan based on your life, stress, hormones and equipment sent to you in seconds.
            </p>
            <button className="hero-button" onClick={onStart}>
              Start Quiz
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
