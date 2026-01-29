import './InfoSlide.css'

function InfoSlide({ text, image, onContinue }) {
  return (
    <div className="info-slide-container">
      <div className="info-slide-card">
        <div className="info-slide-content">
          <div className="info-slide-text">
            <p className="info-slide-message">{text}</p>
          </div>
          <div className="info-slide-image">
            {image ? (
              <img 
                src={image} 
                alt="" 
                className="info-slide-image-img"
              />
            ) : (
              <div className="info-slide-image-placeholder">
                <svg width="100%" height="100%" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="300" height="200" fill="#e8e6e2" rx="12"/>
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#9a9a9a" fontSize="14" fontFamily="system-ui">
                    Image
                  </text>
                </svg>
              </div>
            )}
          </div>
          <button className="info-slide-button" onClick={onContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default InfoSlide

