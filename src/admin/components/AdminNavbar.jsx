import React from 'react';

export default function AdminNavbar({ title, onToggleSidebar }) {
  return (
    <header className="admin-header">
      <div className="admin-header-title">
        <i className="fa-solid fa-bars admin-sidebar-toggle" onClick={onToggleSidebar}></i>
        <h1>{title}</h1>
      </div>

      <div className="admin-user-profile">
        <div className="admin-avatar">
          <span>A</span>
        </div>
        <div className="admin-profile-info">
          <span className="admin-profile-name">GlowNest Admin</span>
          <span className="admin-profile-role">Super Admin</span>
        </div>
      </div>
    </header>
  );
}
