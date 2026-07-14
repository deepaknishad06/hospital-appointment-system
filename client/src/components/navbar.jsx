import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './navbar.css'

const Navbar = () => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('hospital_token')))

  const syncAuthState = () => {
    setIsLoggedIn(Boolean(localStorage.getItem('hospital_token')))
  }

  useEffect(() => {
    syncAuthState()

    const handleStorageChange = () => {
      syncAuthState()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('hospital_token')
    localStorage.removeItem('hospital_user')
    syncAuthState()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-fixed">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">MediCare Hospital</Link>

        <button
          className="navbar-toggle"
          onClick={() => {
            const menu = document.getElementById('menu')
            if (menu) {
              menu.classList.toggle('show')
            }
          }}
        >
          ☰
        </button>

        <ul className="navbar-links" id="menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/doctors">Doctors</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          {isLoggedIn ? (
            <li>
              <button type="button" className="navbar-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
