import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = await window.showAppConfirm('Are you sure you want to log out from Admin Panel?');
    if (confirmed) {
      if (onClose) onClose();
      window.showAppToast('Logged out from Admin successfully', 'success');
      navigate('/');
    }
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="admin-sidebar-overlay" onClick={onClose}></div>
      )}

      <aside className={`admin-sidebar ${isOpen ? 'active' : ''}`}>
        <div className="admin-sidebar-logo">
          <h2>GlowNest</h2>
          <span>Admin Console</span>
        </div>

        <nav className="admin-sidebar-menu">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `admin-menu-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <i className="fa-solid fa-chart-line"></i>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) => `admin-menu-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <i className="fa-solid fa-users"></i>
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/admin/services"
            className={({ isActive }) => `admin-menu-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <i className="fa-solid fa-spa"></i>
            <span>Services</span>
          </NavLink>

          <NavLink
            to="/admin/packages"
            className={({ isActive }) => `admin-menu-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <i className="fa-solid fa-gem"></i>
            <span>Packages</span>
          </NavLink>

          <NavLink
            to="/admin/bookings"
            className={({ isActive }) => `admin-menu-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <i className="fa-solid fa-calendar-check"></i>
            <span>Bookings</span>
          </NavLink>

          <NavLink
            to="/admin/feedbacks"
            className={({ isActive }) => `admin-menu-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <i className="fa-solid fa-comment-dots"></i>
            <span>Feedbacks</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-menu-item" onClick={onClose} style={{ marginBottom: '8px' }}>
            <i className="fa-solid fa-globe"></i>
            <span>Go to Website</span>
          </Link>
          <button className="admin-menu-item" onClick={handleLogout} style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}>
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
