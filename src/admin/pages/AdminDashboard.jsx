import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import AdminSidebar from '../components/AdminSidebar.jsx';
import AdminNavbar from '../components/AdminNavbar.jsx';
import '../css/admin.css';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    bookings: 0,
    revenue: 0,
    services: 0,
    packages: 0,
    feedbacks: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [usersData, bookingsData, servicesData, packagesData, feedbacksData] = await Promise.all([
          api.get('/users'),
          api.get('/bookings'),
          api.get('/services'),
          api.get('/packages'),
          api.get('/feedbacks')
        ]);

        // Calculate total revenue from all bookings
        const totalRevenue = bookingsData.reduce((acc, booking) => acc + (booking.total || 0), 0);

        setStats({
          users: usersData.length,
          bookings: bookingsData.length,
          revenue: totalRevenue,
          services: servicesData.length,
          packages: packagesData.length,
          feedbacks: feedbacksData.length
        });

        // Sort bookings by bookedAt date desc or slice recent ones (take last 5)
        const sortedBookings = [...bookingsData]
          .sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt))
          .slice(0, 5);
        setRecentBookings(sortedBookings);

        // Take last 3 feedbacks
        const sortedFeedbacks = [...feedbacksData]
          .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
          .slice(0, 3);
        setRecentFeedbacks(sortedFeedbacks);

      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <AdminNavbar title="Dashboard" onToggleSidebar={() => setSidebarOpen(true)} />

        <div className="admin-content">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', fontSize: '1.2rem', color: 'var(--color-primary-dark)', fontWeight: '600' }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '10px' }}></i> Loading Dashboard Data...
            </div>
          ) : (
            <>
              {/* Metrics Stats Grid */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Total Users</span>
                    <strong className="admin-stat-value">{stats.users}</strong>
                  </div>
                  <div className="admin-stat-icon users">
                    <i className="fa-solid fa-users"></i>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Total Bookings</span>
                    <strong className="admin-stat-value">{stats.bookings}</strong>
                  </div>
                  <div className="admin-stat-icon bookings">
                    <i className="fa-solid fa-calendar-check"></i>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Total Revenue</span>
                    <strong className="admin-stat-value">₹{stats.revenue.toLocaleString()}</strong>
                  </div>
                  <div className="admin-stat-icon revenue">
                    <i className="fa-solid fa-indian-rupee-sign"></i>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Total Services</span>
                    <strong className="admin-stat-value">{stats.services}</strong>
                  </div>
                  <div className="admin-stat-icon services">
                    <i className="fa-solid fa-spa"></i>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Total Packages</span>
                    <strong className="admin-stat-value">{stats.packages}</strong>
                  </div>
                  <div className="admin-stat-icon packages">
                    <i className="fa-solid fa-gem"></i>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-info">
                    <span className="admin-stat-label">Total Feedbacks</span>
                    <strong className="admin-stat-value">{stats.feedbacks}</strong>
                  </div>
                  <div className="admin-stat-icon feedbacks">
                    <i className="fa-solid fa-comment-dots"></i>
                  </div>
                </div>
              </div>

              {/* Highlights split grid */}
              <div className="admin-dash-grid">
                {/* Recent Bookings Card */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>Recent Bookings</h3>
                  </div>
                  <div className="admin-card-body">
                    {recentBookings.length === 0 ? (
                      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No bookings recorded yet.</p>
                    ) : (
                      <div className="admin-table-wrapper">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Client</th>
                              <th>Date & Time</th>
                              <th>Total</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentBookings.map((booking) => (
                              <tr key={booking.id}>
                                <td>
                                  <div style={{ fontWeight: 600 }}>{booking.name}</div>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{booking.email}</span>
                                </td>
                                <td>
                                  <div>{booking.date}</div>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{booking.time}</span>
                                </td>
                                <td style={{ fontWeight: 600, color: 'var(--color-gold)' }}>₹{booking.total}</td>
                                <td>
                                  <span className={`admin-badge ${booking.bookingStatus.toLowerCase()}`}>
                                    {booking.bookingStatus}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Feedbacks Card */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>Recent Feedbacks</h3>
                  </div>
                  <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {recentFeedbacks.length === 0 ? (
                      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No feedback comments yet.</p>
                    ) : (
                      recentFeedbacks.map((f) => (
                        <div key={f.id} className="admin-feedback-card" style={{ padding: '16px', boxShadow: 'none', border: '1px solid rgba(109,76,65,0.1)' }}>
                          <div className="admin-feedback-meta" style={{ paddingBottom: '8px' }}>
                            <div>
                              <div className="admin-feedback-name" style={{ fontSize: '0.92rem' }}>{f.name}</div>
                              <div className="admin-feedback-rating" style={{ fontSize: '0.75rem' }}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <i 
                                    key={i} 
                                    className={`fa-star ${i < f.rating ? 'fa-solid' : 'fa-regular'}`}
                                    style={{ color: '#f1c40f', marginRight: '1px' }}
                                  ></i>
                                ))}
                              </div>
                            </div>
                            <span className="admin-feedback-date" style={{ fontSize: '0.7rem' }}>
                              {new Date(f.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="admin-feedback-text" style={{ fontSize: '0.82rem', margin: 0 }}>"{f.message}"</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
