import './Header.css'
import Logo from './Logo'

function Header({ onOpenDocs }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <Logo />
        </div>
        <div className="header-right">
          <button className="header-menu" onClick={onOpenDocs} aria-label="Open docs">
            <span className="header-menu-line" />
            <span className="header-menu-line" />
            <span className="header-menu-line" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

