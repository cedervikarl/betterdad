import './Hero.css'

function Hero({ onStart }) {

  return (
    <div className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Unlock Your DadBod Blueprint</h1>
            <p className="hero-subtitle">
              Personal home workout plan for busy dads who want to lose the belly, build muscle and get their energy back – starting with a 60-second quiz.
            </p>
            <div className="hero-social-proof">
              <span className="social-proof-item">
                Trusted by Over 150,000 Dads
              </span>
              <div className="social-proof-avatars">
                <div className="social-proof-avatar"></div>
                <div className="social-proof-avatar"></div>
                <div className="social-proof-avatar"></div>
                <div className="social-proof-avatar"></div>
                <div className="social-proof-avatar-more">+</div>
              </div>
            </div>
            
            <div className="hero-features">
              <div className="hero-feature">
                <div className="hero-feature-icon">✓</div>
                <div className="hero-feature-text">
                  <strong>Personalized plans</strong> tailored to your schedule
                </div>
              </div>
              <div className="hero-feature">
                <div className="hero-feature-icon">✓</div>
                <div className="hero-feature-text">
                  <strong>No gym required</strong> – workout from home
                </div>
              </div>
              <div className="hero-feature">
                <div className="hero-feature-icon">✓</div>
                <div className="hero-feature-text">
                  <strong>Proven results</strong> in just 4 weeks
                </div>
              </div>
            </div>
            <button className="hero-button" onClick={onStart}>
              Start Your Quiz
            </button>
            
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-number">150,000+</div>
                <div className="hero-stat-label">Dads transformed</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">4.9/5</div>
                <div className="hero-stat-label">Average rating</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">12 weeks</div>
                <div className="hero-stat-label">To see results</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero

