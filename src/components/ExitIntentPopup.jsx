import { useState, useEffect } from 'react'
import './ExitIntentPopup.css'

function ExitIntentPopup({ onClose, onPurchase, bundlePrice, currencySymbol }) {
  useEffect(() => {
    // Prevent body scroll when popup is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="exit-intent-overlay" onClick={onClose}>
      <div className="exit-intent-popup" onClick={(e) => e.stopPropagation()}>
        <button className="exit-intent-close" onClick={onClose}>×</button>
        
        <div className="exit-intent-content">
          <div className="exit-intent-icon">⏰</div>
          <h2 className="exit-intent-title">Wait! Don't Miss Out</h2>
          <p className="exit-intent-text">
            Your personalized plan is ready, but this special price won't last forever.
          </p>
          
          <div className="exit-intent-offer">
            <div className="exit-intent-price">
              <span className="exit-intent-price-label">Your Price Today:</span>
              <span className="exit-intent-price-value">{currencySymbol}{bundlePrice.toFixed(2)}</span>
            </div>
            <div className="exit-intent-guarantee">
              <span className="exit-intent-shield">🛡️</span>
              <span>30-day money-back guarantee</span>
            </div>
          </div>

          <button className="exit-intent-button" onClick={onPurchase}>
            GET MY PLAN NOW - {currencySymbol}{bundlePrice.toFixed(2)}
          </button>
          
          <button className="exit-intent-dismiss" onClick={onClose}>
            No thanks, I'll pass
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExitIntentPopup

