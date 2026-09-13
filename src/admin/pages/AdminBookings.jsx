import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import AdminSidebar from '../components/AdminSidebar.jsx';
import AdminNavbar from '../components/AdminNavbar.jsx';
import '../css/admin.css';

export default function AdminBookings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await api.get('/bookings');
      // Sort bookings by date desc (recent first)
      const sorted = [...data].sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
      setBookings(sorted);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      // Find the booking to update locally first
      const bookingToUpdate = bookings.find(b => b.id === bookingId);
      if (!bookingToUpdate) return;

      // Update in db.json
      await api.patch(`/bookings/${bookingId}`, { bookingStatus: newStatus });
      window.showAppToast(`Booking status updated to ${newStatus}`, 'success');
      
      // Update local state without hitting the API again for better UX
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, bookingStatus: newStatus } : b));
    } catch (err) {
      console.error('Error updating booking status:', err);
      window.showAppToast('Failed to update booking status', 'error');
    }
  };

  const handlePaymentStatusChange = async (bookingId, newPaymentStatus) => {
    try {
      const bookingToUpdate = bookings.find(b => b.id === bookingId);
      if (!bookingToUpdate) return;

      // Update patch payload: if status is paid, set balanceRemaining to 0 and amountPaid to total
      const payload = {
        paymentStatus: newPaymentStatus,
        amountPaid: newPaymentStatus === 'Paid' ? bookingToUpdate.total : (newPaymentStatus === 'Pending' ? 0 : bookingToUpdate.amountPaid),
        balanceRemaining: newPaymentStatus === 'Paid' ? 0 : (newPaymentStatus === 'Pending' ? bookingToUpdate.total : bookingToUpdate.balanceRemaining)
      };

      await api.patch(`/bookings/${bookingId}`, payload);
      window.showAppToast(`Payment status updated to ${newPaymentStatus}`, 'success');
      
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, ...payload } : b));
    } catch (err) {
      console.error('Error updating payment status:', err);
      window.showAppToast('Failed to update payment status', 'error');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <AdminNavbar title="Bookings Management" onToggleSidebar={() => setSidebarOpen(true)} />

        <div className="admin-content">
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>All Client Appointments</h3>
            </div>

            <div className="admin-card-body">
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh', fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '10px' }}></i> Loading Bookings...
                </div>
              ) : bookings.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No bookings found yet.</p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Client Details</th>
                        <th>Booked Services</th>
                        <th>Date & Time</th>
                        <th>Total</th>
                        <th>Payment Status</th>
                        <th>Booking Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                            {booking.id}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{booking.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}><i className="fa-solid fa-envelope" style={{ marginRight: '4px' }}></i>{booking.email}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}><i className="fa-solid fa-phone" style={{ marginRight: '4px' }}></i>{booking.phone}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxWidth: '240px' }}>
                              {booking.services && booking.services.map((svc, i) => (
                                <div key={i} style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                  <span style={{ color: 'var(--color-text-light)' }}>• {svc.name}</span>
                                  <span style={{ fontWeight: 500, color: 'var(--color-text-muted)' }}>₹{svc.price}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 500 }}>{booking.date}</div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>⏱ {booking.time}</span>
                          </td>
                          <td>
                            <strong style={{ color: 'var(--color-gold)', fontSize: '1rem' }}>₹{booking.total}</strong>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <span className={`admin-badge ${booking.paymentStatus === 'Paid' ? 'completed' : (booking.paymentStatus === 'Partially Paid' ? 'pending' : 'cancelled')}`} style={{ textAlign: 'center', width: 'fit-content' }}>
                                {booking.paymentStatus}
                              </span>
                              <select 
                                className="admin-status-select" 
                                style={{ padding: '3px 6px', fontSize: '0.75rem', width: 'fit-content' }}
                                value={booking.paymentStatus} 
                                onChange={(e) => handlePaymentStatusChange(booking.id, e.target.value)}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Partially Paid">Partially Paid</option>
                                <option value="Paid">Paid</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <span className={`admin-badge ${booking.bookingStatus.toLowerCase()}`} style={{ textAlign: 'center', width: 'fit-content' }}>
                                {booking.bookingStatus}
                              </span>
                              <select 
                                className="admin-status-select" 
                                style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'fit-content' }}
                                value={booking.bookingStatus} 
                                onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
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
