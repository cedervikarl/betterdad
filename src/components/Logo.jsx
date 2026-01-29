import './Logo.css'
import logoImage from '../assets/images/dad-logo.png'

function Logo() {
  return (
    <div className="logo">
      <img src={logoImage} alt="Better Dad" className="logo-image" />
    </div>
  )
}

export default Logo

