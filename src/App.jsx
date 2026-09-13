import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Pages
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Packages from './pages/Packages.jsx';
import Booking from './pages/Booking.jsx';
import Checkout from './pages/Checkout.jsx';
import Contact from './pages/Contact.jsx';
import Feedback from './pages/Feedback.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import MyBooking from './pages/MyBooking.jsx';

// Admin Pages
import AdminDashboard from './admin/pages/AdminDashboard.jsx';
import AdminUsers from './admin/pages/AdminUsers.jsx';
import AdminUserDetail from './admin/pages/AdminUserDetail.jsx';
import AdminLogin from './admin/pages/AdminLogin.jsx';
import AdminServices from './admin/pages/AdminServices.jsx';
import RequireAuth from './admin/components/RequireAuth.jsx';
import AdminPackages from './admin/pages/AdminPackages.jsx';
import AdminBookings from './admin/pages/AdminBookings.jsx';
import AdminFeedbacks from './admin/pages/AdminFeedbacks.jsx';

// ScrollToTop on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// AppContent Wrapper to access useLocation and render layout conditionally
function AppContent({
  toast,
  confirm,
  glowAlert,
  setToast,
  setConfirm,
  setGlowAlert,
  showBackToTop
}) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Hide user Navbar on admin routes */}
      {!isAdmin && <Navbar />}

      <main style={{ flex: '1 0 auto', paddingTop: isAdmin ? '0' : '100px' }}>
        <Routes>
          {/* User routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mybooking" element={<MyBooking />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/users" element={<RequireAuth><AdminUsers /></RequireAuth>} />
          <Route path="/admin/users/:id" element={<RequireAuth><AdminUserDetail /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
          <Route path="/admin/services" element={<RequireAuth><AdminServices /></RequireAuth>} />
          <Route path="/admin/packages" element={<RequireAuth><AdminPackages /></RequireAuth>} />
          <Route path="/admin/bookings" element={<RequireAuth><AdminBookings /></RequireAuth>} />
          <Route path="/admin/feedbacks" element={<RequireAuth><AdminFeedbacks /></RequireAuth>} />
        </Routes>
      </main>

      {/* Hide user Footer on admin routes */}
      {!isAdmin && <Footer />}

      {/* Back to Top - Hide on admin routes */}
      {!isAdmin && (
        <button
          className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      )}

      {/* Global App Toast Container */}
      <div className="app-toast-container">
        {toast.visible && (
          <div className={`app-toast visible ${toast.type}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </div>

      {/* Global Confirm Modal */}
      {confirm.active && (
        <div className="app-confirm-overlay active" onClick={() => {
          if (confirm.isAlert) {
            confirm.resolve(true);
            setConfirm({ message: '', active: false, resolve: null, isAlert: false });
          } else {
            confirm.resolve(false);
            setConfirm({ message: '', active: false, resolve: null, isAlert: false });
          }
        }}>
          <div className="app-confirm-card" onClick={(e) => e.stopPropagation()}>
            <div className="app-confirm-icon">
              <i className={`fa-solid ${confirm.isAlert ? 'fa-circle-info' : 'fa-circle-question'}`}></i>
            </div>
            <h3 className="app-confirm-title">GlowNest</h3>
            <p className="app-confirm-message">{confirm.message}</p>
            <div className="app-confirm-actions">
              {!confirm.isAlert && (
                <button
                  type="button"
                  className="btn btn-secondary app-confirm-no"
                  onClick={() => {
                    confirm.resolve(false);
                    setConfirm({ message: '', active: false, resolve: null, isAlert: false });
                  }}
                >
                  No
                </button>
              )}
              <button
                type="button"
                className="btn btn-primary app-confirm-yes"
                onClick={() => {
                  confirm.resolve(true);
                  setConfirm({ message: '', active: false, resolve: null, isAlert: false });
                }}
              >
                {confirm.isAlert ? 'OK' : 'Yes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global GlowAlert Modal */}
      {glowAlert.active && (
        <div className="glow-alert-overlay active" onClick={() => {
          window.GlowAlert.hide();
          if (glowAlert.onOk) glowAlert.onOk();
        }}>
          <div className="glow-alert-card" onClick={(e) => e.stopPropagation()}>
            <div className={`glow-alert-icon ${glowAlert.type}`}>
              {glowAlert.type === 'success' && <i className="fa-solid fa-circle-check"></i>}
              {glowAlert.type === 'error' && <i className="fa-solid fa-circle-xmark"></i>}
              {glowAlert.type === 'warning' && <i className="fa-solid fa-triangle-exclamation"></i>}
              {glowAlert.type === 'info' && <i className="fa-solid fa-circle-info"></i>}
            </div>
            <h3 className="glow-alert-title">{glowAlert.title}</h3>
            <p className="glow-alert-message">{glowAlert.message}</p>
            <div className="glow-alert-actions">
              {glowAlert.showYesNo ? (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      window.GlowAlert.hide();
                      if (glowAlert.onYes) glowAlert.onYes();
                    }}
                  >
                    {glowAlert.yesText}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      window.GlowAlert.hide();
                      if (glowAlert.onNo) glowAlert.onNo();
                    }}
                  >
                    {glowAlert.noText}
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    window.GlowAlert.hide();
                    if (glowAlert.onOk) glowAlert.onOk();
                  }}
                >
                  {glowAlert.okText}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  // Global States for Alert, Toast and Confirms
  const [toast, setToast] = useState({ message: '', type: 'info', visible: false });
  const [confirm, setConfirm] = useState({ message: '', active: false, resolve: null, isAlert: false });
  const [glowAlert, setGlowAlert] = useState({
    active: false,
    title: '',
    message: '',
    type: 'info',
    showYesNo: false,
    onYes: null,
    onNo: null,
    onOk: null,
    yesText: 'Yes',
    noText: 'No',
    okText: 'OK'
  });

  // Expose toast, alert, confirm globally to match old JS scripts syntax
  useEffect(() => {
    window.showAppToast = (message, type = 'info') => {
      setToast({ message, type, visible: true });
      setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2500);
    };

    window.showAppConfirm = (message) => {
      return new Promise((resolve) => {
        setConfirm({ message, active: true, resolve, isAlert: false });
      });
    };

    window.showAppAlert = (message) => {
      return new Promise((resolve) => {
        setConfirm({ message, active: true, resolve, isAlert: true });
      });
    };

    window.GlowAlert = {
      show(options) {
        setGlowAlert({
          active: true,
          title: options.title || 'Alert',
          message: options.message || '',
          type: options.type || 'info',
          showYesNo: options.showYesNo || false,
          onYes: options.onYes || null,
          onNo: options.onNo || null,
          onOk: options.onOk || null,
          yesText: options.yesText || 'Yes',
          noText: options.noText || 'No',
          okText: options.okText || 'OK'
        });
      },
      hide() {
        setGlowAlert(prev => ({ ...prev, active: false }));
      },
      success(message, title = 'Success', onOk = null) {
        this.show({ title, message, type: 'success', onOk });
      },
      error(message, title = 'Error', onOk = null) {
        this.show({ title, message, type: 'error', onOk });
      },
      warning(message, title = 'Warning', onOk = null) {
        this.show({ title, message, type: 'warning', onOk });
      },
      info(message, title = 'Info', onOk = null) {
        this.show({ title, message, type: 'info', onOk });
      },
      confirm(message, title = 'Confirm', onYes = null, onNo = null) {
        this.show({ title, message, type: 'info', showYesNo: true, onYes, onNo });
      }
    };
  }, []);

  // Back to Top button logic
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent
        toast={toast}
        confirm={confirm}
        glowAlert={glowAlert}
        setToast={setToast}
        setConfirm={setConfirm}
        setGlowAlert={setGlowAlert}
        showBackToTop={showBackToTop}
      />
    </BrowserRouter>
  );
}
