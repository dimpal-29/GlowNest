import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api.js';
import AdminSidebar from '../components/AdminSidebar.jsx';
import AdminNavbar from '../components/AdminNavbar.jsx';
import '../css/admin.css';

const na = (val) =>
  val !== undefined && val !== null && val !== '' ? val : 'Not Available';

const formatDate = (dateStr) => {
  if (!dateStr) return 'Not Available';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

const Stars = ({ rating }) => (
  <span>
    {Array.from({ length: 5 }).map((_, i) => (
      <i
        key={i}
        className={`fa-star ${i < rating ? 'fa-solid' : 'fa-regular'}`}
        style={{ color: '#f1c40f', marginRight: '2px', fontSize: '0.85rem' }}
      ></i>
    ))}
  </span>
);

const InfoRow = ({ icon, label, value }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', gap: '10px',
    padding: '10px 0', borderBottom: '1px solid rgba(109,76,65,0.06)'
  }}>
    <div style={{
      width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
      background: 'rgba(109,76,65,0.08)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      color: 'var(--color-primary)', fontSize: '0.85rem'
    }}>
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <div>
      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</div>
      <div style={{ fontSize: '0.92rem', color: 'var(--color-secondary)', fontWeight: 500, marginTop: '2px' }}>{value}</div>
    </div>
  </div>
);

const StatBox = ({ icon, label, value, color }) => (
  <div style={{
    background: 'var(--color-white)', border: '1px solid rgba(109,76,65,0.08)',
    borderRadius: '12px', padding: '20px', display: 'flex',
    alignItems: 'center', gap: '14px', boxShadow: 'var(--shadow-sm)'
  }}>
    <div style={{
      width: '46px', height: '46px', borderRadius: '10px', flexShrink: 0,
      background: color + '18', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      color: color, fontSize: '1.2rem'
    }}>
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <div>
      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-secondary)', lineHeight: 1.2 }}>{value}</div>
    </div>
  </div>
);

const PaymentRow = ({ label, value, highlight }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 0', borderBottom: '1px solid rgba(109,76,65,0.06)'
  }}>
    <span style={{ fontSize: '0.88rem', color: 'var(--color-text-light)' }}>{label}</span>
    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: highlight || 'var(--color-secondary)' }}>{value}</span>
  </div>
);

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, allBookings, allFeedbacks] = await Promise.all([
          api.get(`/users/${id}`),
          api.get('/bookings'),
          api.get('/feedbacks'),
        ]);
        setUser(userData);

        const userBookings = allBookings.filter(
          (b) => b.userId === id || b.email === userData.email
        );
        setBookings(userBookings.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt)));

        const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
        const userFeedbacks = allFeedbacks.filter(
          (f) => f.email === userData.email || f.name === fullName
        );
        setFeedbacks(userFeedbacks.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
      } catch (err) {
        console.error('Error fetching user details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ── Derived stats ────────────────────────────────────────────────────────────
  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';

  const totalBookings = bookings.length;
  const completedBookings = bookings.filter((b) => b.bookingStatus === 'Completed').length;
  const cancelledBookings = bookings.filter((b) => b.bookingStatus === 'Cancelled').length;

  const totalSpent     = bookings.reduce((s, b) => s + (Number(b.amountPaid) || 0), 0);
  const paidCount      = bookings.filter((b) => b.paymentStatus === 'Paid').length;
  const partialCount   = bookings.filter((b) => b.paymentStatus === 'Partially Paid').length;
  const pendingCount   = bookings.filter((b) => b.paymentStatus === 'Pending').length;
  const balanceTotal   = bookings.reduce((s, b) => s + (Number(b.balanceRemaining) || 0), 0);

  const lastBookingDate = bookings.length > 0
    ? bookings.reduce((latest, b) => {
        const d = new Date(b.bookedAt);
        return d > latest ? d : latest;
      }, new Date(0))
    : null;

  // ── Loading / Not Found states ───────────────────────────────────────────────
  const Shell = ({ children }) => (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminNavbar title="User Details" onToggleSidebar={() => setSidebarOpen(true)} />
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Shell>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh', fontSize: '1.1rem', color: 'var(--color-primary)' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '10px' }}></i> Loading User Details...
        </div>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <i className="fa-solid fa-user-slash" style={{ fontSize: '3rem', color: 'var(--color-text-muted)', marginBottom: '16px', display: 'block' }}></i>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>User not found.</p>
          <button className="admin-btn-text" onClick={() => navigate('/admin/users')}
            style={{ marginTop: '16px', color: 'var(--color-primary)', background: 'rgba(109,76,65,0.08)', border: '1px solid rgba(109,76,65,0.2)', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' }}>
            ← Back to Users
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminNavbar title="User Details" onToggleSidebar={() => setSidebarOpen(true)} />
        <div className="admin-content">

          {/* Back button + header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
            <button
              onClick={() => navigate('/admin/users')}
              style={{
                background: 'rgba(109,76,65,0.08)', border: '1px solid rgba(109,76,65,0.15)',
                borderRadius: '8px', padding: '8px 16px', cursor: 'pointer',
                color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <i className="fa-solid fa-arrow-left"></i> Back to Users
            </button>
            <div>
              <h2 style={{ margin: 0, color: 'var(--color-secondary)', fontSize: '1.3rem', fontWeight: 700 }}>{na(fullName)}</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>User ID: {user.id}</span>
            </div>
          </div>

          {/* ── Top Row: Profile + Booking Statistics ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>

            {/* Profile Information */}
            <div className="admin-card" style={{ margin: 0 }}>
              <div className="admin-card-header">
                <h3><i className="fa-solid fa-user" style={{ marginRight: '8px', color: 'var(--color-primary)' }}></i>Profile Information</h3>
              </div>
              <div className="admin-card-body">
                <InfoRow icon="fa-user"         label="Full Name"          value={na(fullName)} />
                <InfoRow icon="fa-envelope"      label="Email"              value={na(user.email)} />
                <InfoRow icon="fa-phone"         label="Phone Number"       value={na(user.phone)} />
                <InfoRow icon="fa-shield-halved" label="Role"               value="Customer" />
                <InfoRow icon="fa-calendar-plus" label="Registration Date"  value={na(formatDate(user.createdAt || user.registeredAt))} />
                <InfoRow icon="fa-calendar-check" label="Last Booking Date" value={lastBookingDate ? formatDate(lastBookingDate.toISOString()) : 'Not Available'} />
              </div>
            </div>

            {/* Booking Statistics */}
            <div className="admin-card" style={{ margin: 0 }}>
              <div className="admin-card-header">
                <h3><i className="fa-solid fa-chart-bar" style={{ marginRight: '8px', color: 'var(--color-primary)' }}></i>Booking Statistics</h3>
              </div>
              <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <StatBox icon="fa-calendar-days" label="Total Bookings"     value={totalBookings}     color="var(--color-primary)" />
                <StatBox icon="fa-circle-check"  label="Completed Bookings" value={completedBookings}  color="var(--color-success)" />
                <StatBox icon="fa-circle-xmark"  label="Cancelled Bookings" value={cancelledBookings}  color="var(--color-error)" />
              </div>
            </div>
          </div>

          {/* ── Payment Summary ── */}
          <div className="admin-card" style={{ marginBottom: '24px' }}>
            <div className="admin-card-header">
              <h3><i className="fa-solid fa-indian-rupee-sign" style={{ marginRight: '8px', color: 'var(--color-primary)' }}></i>Payment Summary</h3>
            </div>
            <div className="admin-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
                <div>
                  <PaymentRow label="Total Spent (Paid)"      value={`₹${totalSpent.toLocaleString('en-IN')}`}    highlight="var(--color-success)" />
                  <PaymentRow label="Paid Bookings"           value={paidCount} />
                  <PaymentRow label="Partially Paid Bookings" value={partialCount} />
                  <PaymentRow label="Pending Payments"        value={pendingCount} />
                  <PaymentRow label="Remaining Balance"       value={`₹${balanceTotal.toLocaleString('en-IN')}`}   highlight={balanceTotal > 0 ? 'var(--color-error)' : 'var(--color-success)'} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Booking History ── */}
          <div className="admin-card" style={{ marginBottom: '24px' }}>
            <div className="admin-card-header">
              <h3><i className="fa-solid fa-clock-rotate-left" style={{ marginRight: '8px', color: 'var(--color-primary)' }}></i>Booking History</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{totalBookings} booking{totalBookings !== 1 ? 's' : ''}</span>
            </div>
            <div className="admin-card-body" style={{ padding: 0 }}>
              {bookings.length === 0 ? (
                <p style={{ padding: '30px 24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No booking history found for this user.
                </p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date &amp; Time</th>
                        <th>Services</th>
                        <th>Total Amount</th>
                        <th>Amount Paid</th>
                        <th>Balance Remaining</th>
                        <th>Booking Status</th>
                        <th>Payment Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => {
                        const bookingStatusClass = (b.bookingStatus || '').toLowerCase();
                        const paymentStatusClass =
                          b.paymentStatus === 'Paid' ? 'completed' :
                          b.paymentStatus === 'Partially Paid' ? 'pending' : 'cancelled';

                        return (
                          <tr key={b.id}>
                            <td>
                              <div style={{ fontWeight: 500 }}>{na(b.date)}</div>
                              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>⏱ {na(b.time)}</span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '220px' }}>
                                {b.services && b.services.length > 0 ? (
                                  b.services.map((svc, i) => (
                                    <div key={i} style={{ fontSize: '0.84rem', display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                      <span style={{ color: 'var(--color-text-light)' }}>• {svc.name}</span>
                                      <span style={{ fontWeight: 500, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>₹{svc.price}</span>
                                    </div>
                                  ))
                                ) : (
                                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Not Available</span>
                                )}
                              </div>
                            </td>
                            <td>
                              <strong style={{ color: 'var(--color-gold)' }}>
                                {b.total !== undefined ? `₹${Number(b.total).toLocaleString('en-IN')}` : 'Not Available'}
                              </strong>
                            </td>
                            <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                              {b.amountPaid !== undefined ? `₹${Number(b.amountPaid).toLocaleString('en-IN')}` : 'Not Available'}
                            </td>
                            <td style={{ color: Number(b.balanceRemaining) > 0 ? 'var(--color-error)' : 'var(--color-success)', fontWeight: 600 }}>
                              {b.balanceRemaining !== undefined ? `₹${Number(b.balanceRemaining).toLocaleString('en-IN')}` : 'Not Available'}
                            </td>
                            <td>
                              <span className={`admin-badge ${bookingStatusClass}`}>
                                {na(b.bookingStatus)}
                              </span>
                            </td>
                            <td>
                              <span className={`admin-badge ${paymentStatusClass}`}>
                                {na(b.paymentStatus)}
                              </span>
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

          {/* ── Feedback History ── */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3><i className="fa-solid fa-comment-dots" style={{ marginRight: '8px', color: 'var(--color-primary)' }}></i>Feedback History</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{feedbacks.length} feedback{feedbacks.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="admin-card-body">
              {feedbacks.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '16px 0' }}>
                  No feedback submitted by this user.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {feedbacks.map((f) => (
                    <div key={f.id} style={{
                      background: 'rgba(109,76,65,0.03)', border: '1px solid rgba(109,76,65,0.08)',
                      borderRadius: '10px', padding: '18px 20px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <Stars rating={f.rating} />
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {f.submittedAt ? formatDate(f.submittedAt) : 'Not Available'}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-light)', fontStyle: 'italic', lineHeight: 1.6 }}>
                        "{na(f.message)}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
