import './Checkout.css'

function Checkout({ plan }) {
  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-placeholder">
          <h2 className="checkout-title">Checkout placeholder</h2>
          <p className="checkout-text">Will be replaced with Shopify checkout later.</p>
          {plan && (
            <p className="checkout-plan">
              Selected plan: <strong>{plan.title}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Checkout

