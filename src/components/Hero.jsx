import './Hero.css'

function Hero({ onStart }) {

  return (
    <div className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Get in the best shape of your life before summer</h1>
            <p className="hero-subtitle">
              Take the quiz and get your plan based on your stress, equipment, budget and hormones sent to you seconds after finishing quiz. Do your first workout tomorrow!
            </p>
            <div className="hero-social-proof">
              <span className="social-proof-item">
                100,000+ dads have already changed their life
              </span>
              <div className="social-proof-avatars">
                <div className="social-proof-avatar"></div>
                <div className="social-proof-avatar"></div>
                <div className="social-proof-avatar"></div>
                <div className="social-proof-avatar"></div>
                <div className="social-proof-avatar-more">+</div>
              </div>
            </div>
            
            <button className="hero-button" onClick={onStart}>
              Let's do it
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero

