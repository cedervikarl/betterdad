import './InfoSlide.css'

function InfoSlide({ text, image, review, onContinue, autoDismiss }) {
  return (
    <div className="info-slide-container">
      <div className={`info-slide-card ${autoDismiss ? 'info-slide-auto-dismiss' : ''}`}>
        <div className="info-slide-content">
          <div className="info-slide-text">
            <p className="info-slide-message">{text}</p>
          </div>
          {review ? (
            <div className="info-slide-review">
              <div className="info-slide-review-stars">
                {'★'.repeat(review.rating)}
              </div>
              <p className="info-slide-review-text">"{review.text}"</p>
              <p className="info-slide-review-name">— {review.name}</p>
            </div>
          ) : image ? (
            <div className="info-slide-image">
              <img 
                src={image} 
                alt="" 
                className="info-slide-image-img"
              />
            </div>
          ) : null}
          {!autoDismiss && (
            <button className="info-slide-button" onClick={onContinue}>
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default InfoSlide

