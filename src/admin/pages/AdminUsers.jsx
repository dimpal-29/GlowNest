import React, { useEffect, useState } from 'react';
import { api } from '../../api.js';
import AdminSidebar from '../components/AdminSidebar.jsx';
import AdminNavbar from '../components/AdminNavbar.jsx';
import { useNavigate } from 'react-router-dom';
import '../css/admin.css';

const na = (val) => (val !== undefined && val !== null && val !== '' ? val : 'Not Available');

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, bookingsData] = await Promise.all([
          api.get('/users'),
          api.get('/bookings'),
        ]);
        setUsers(usersData);
        setBookings(bookingsData);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute per-user stats from bookings
  const getUserStats = (user) => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    const userBookings = bookings.filter(
      (b) => b.userId === user.id || b.email === user.email
    );
    const totalBookings = userBookings.length;
    const totalSpent = userBookings.reduce((sum, b) => sum + (Number(b.amountPaid) || 0), 0);
    const isActive = userBookings.some(
      (b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Pending'
    );
    const status = userBookings.length > 0 ? (isActive ? 'Active' : 'Inactive') : 'Inactive';
    return { fullName, totalBookings, totalSpent, status };
  };

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminNavbar title="Users Management" onToggleSidebar={() => setSidebarOpen(true)} />
        <div className="admin-content">
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>All Registered Users</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {users.length} user{users.length !== 1 ? 's' : ''} found
              </span>
            </div>
            <div className="admin-card-body" style={{ padding: 0 }}>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh', fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '10px' }}></i> Loading Users...
                </div>
              ) : users.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '40px' }}>
                  No registered users found.
                </p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Total Bookings</th>
                        <th>Total Spent</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, idx) => {
                        const { fullName, totalBookings, totalSpent, status } = getUserStats(user);
                        return (
                          <tr key={user.id}>
                            <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{idx + 1}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                  width: '36px', height: '36px', borderRadius: '50%',
                                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-gold))',
                                  color: '#fff', display: 'flex', alignItems: 'center',
                                  justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0
                                }}>
                                  {(fullName || 'U').charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>
                                  {na(fullName)}
                                </span>
                              </div>
                            </td>
                            <td style={{ color: 'var(--color-text-light)' }}>
                              <i className="fa-solid fa-envelope" style={{ marginRight: '6px', color: 'var(--color-text-muted)' }}></i>
                              {na(user.email)}
                            </td>
                            <td style={{ color: 'var(--color-text-light)' }}>
                              <i className="fa-solid fa-phone" style={{ marginRight: '6px', color: 'var(--color-text-muted)' }}></i>
                              {na(user.phone)}
                            </td>
                            <td>
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                fontWeight: 600, color: 'var(--color-secondary)'
                              }}>
                                <i className="fa-solid fa-calendar-check" style={{ color: 'var(--color-primary)', fontSize: '0.85rem' }}></i>
                                {totalBookings}
                              </span>
                            </td>
                            <td>
                              <strong style={{ color: 'var(--color-gold)', fontSize: '0.95rem' }}>
                                ₹{totalSpent.toLocaleString('en-IN')}
                              </strong>
                            </td>
                            <td>
                              <span className={`admin-badge ${status === 'Active' ? 'completed' : 'cancelled'}`}>
                                {status}
                              </span>
                            </td>
                            <td>
                              <button
                                className="admin-btn-text"
                                style={{
                                  color: 'var(--color-primary)', background: 'rgba(109,76,65,0.07)',
                                  border: '1px solid rgba(109,76,65,0.18)', borderRadius: '6px',
                                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px'
                                }}
                                onClick={() => navigate(`/admin/users/${user.id}`)}
                              >
                                <i className="fa-solid fa-eye" style={{ fontSize: '0.75rem' }}></i>
                                View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
