import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../assets/Logo.png';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLabel, setUserLabel] = useState('User');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync auth state on mount and on every route/location transition
  useEffect(() => {
    const hasLoginFlag = localStorage.getItem('glowNest_isLoggedIn') === 'true';
    const hasUserEmail = !!localStorage.getItem('glowNest_userEmail');
    const currentUserRaw = localStorage.getItem('glowNest_currentUser');
    const logged = hasLoginFlag && hasUserEmail && !!currentUserRaw;

    setIsLoggedIn(logged);
    if (logged) {
      try {
        const user = JSON.parse(currentUserRaw);
        const name = user.firstName || (user.email ? maskEmail(user.email) : 'User');
        setUserLabel(name);
      } catch (e) {
        setUserLabel('User');
      }
    }
  }, [location]);

  function maskEmail(email) {
    const [user, domain] = email.split('@');
    if (!user || !domain) return email;
    if (user.length <= 3) return user + '***@' + domain;
    return user.substring(0, 3) + '***@' + domain;
  }

  const handleLogout = async () => {
    // Close mobile menu if open
    setMobileMenuOpen(false);
    document.body.style.overflow = '';

    const confirmed = await window.showAppConfirm('Are you sure you want to logout?');
    if (!confirmed) return;

    localStorage.removeItem('glowNest_isLoggedIn');
    localStorage.removeItem('glowNest_userEmail');
    localStorage.removeItem('glowNest_currentUser');
    setIsLoggedIn(false);
    window.showAppToast('Logged out successfully', 'success');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    const nextState = !mobileMenuOpen;
    setMobileMenuOpen(nextState);
    document.body.style.overflow = nextState ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      <nav className="navbar scrolled" id="navbar">
        <div className="container">
          <Link to="/" className="nav-logo" onClick={closeMobileMenu}>
            <img src={logoImg} alt="GlowNest Logo" className="logo-img" />
          </Link>
          
          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
            <NavLink to="/services" className={({ isActive }) => isActive ? 'active' : ''}>Services</NavLink>
            <NavLink to="/packages" className={({ isActive }) => isActive ? 'active' : ''}>Packages</NavLink>
            <NavLink to="/mybooking" className={({ isActive }) => isActive ? 'active' : ''}>My Bookings</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink>
          </div>

          <div className="nav-actions nav-actions-inline-flex">
            {isLoggedIn ? (
              <>
                <span className="user-greeting" style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-primary-dark)',
                  fontWeight: '500',
                  marginRight: '0.5rem'
                }}>
                  Hi, {userLabel}
                </span>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-secondary btn-sm nav-login-btn">Login</Link>
            )}
            <Link to="/services" className="btn btn-primary btn-sm nav-book-btn">Book Now</Link>
          </div>

          <div className={`nav-toggle ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div 
        className={`nav-overlay ${mobileMenuOpen ? 'active' : ''}`} 
        onClick={closeMobileMenu}
      ></div>

      {/* Mobile Nav Drawer */}
      <div className={`nav-mobile ${mobileMenuOpen ? 'active' : ''}`}>
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>Home</NavLink>
        <NavLink to="/services" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>Services</NavLink>
        <NavLink to="/packages" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>Packages</NavLink>
        <NavLink to="/mybooking" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>My Bookings</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>About Us</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>Contact</NavLink>
        
        <div id="mobile-nav-actions" style={{ marginTop: '20px' }}>
          {isLoggedIn ? (
            <>
              <div className="user-greeting text-center mt-2 mb-1" style={{
                color: 'var(--color-primary-dark)',
                fontWeight: '500'
              }}>
                Hi, {userLabel}
              </div>
              <button 
                className="btn btn-secondary mt-1 logout-mobile" 
                style={{ width: '100%' }} 
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="btn btn-secondary mt-2 text-center" 
              style={{ display: 'block' }}
              onClick={closeMobileMenu}
            >
              Login
            </Link>
          )}
          <Link 
            to="/services" 
            className="btn btn-primary mt-1 text-center" 
            style={{ display: 'block' }}
            onClick={closeMobileMenu}
          >
            Book Now
          </Link>
        </div>
      </div>
    </>
  );
}
