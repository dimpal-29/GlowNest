import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import '../css/auth.css';

export default function MyBooking() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('9:00 AM');
  const [bookingToEdit, setBookingToEdit] = useState(null);
  const [editServices, setEditServices] = useState([]);
  const [serviceToAdd, setServiceToAdd] = useState('');
  const [allOptions, setAllOptions] = useState([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('glowNest_isLoggedIn') === 'true';
    const userEmail = localStorage.getItem('glowNest_userEmail');

    if (!isLoggedIn || !userEmail) {
      navigate('/login');
      return;
    }

    const fetchOptions = async () => {
      try {
        const [servicesRes, packagesRes] = await Promise.all([
          api.get('/services'),
          api.get('/packages')
        ]);
        const options = [
          ...servicesRes.map(s => ({ name: s.title, price: parseInt(String(s.price).replace(/[^0-9]/g, ''), 10) || 0 })),
          ...packagesRes.map(p => ({ name: p.name, price: p.numericPrice }))
        ];
        setAllOptions(options);
      } catch (err) {
        console.error('Failed to fetch options', err);
      }
    };
    fetchOptions();

    const fetchBookings = async () => {
      try {
        const allBookingsRaw = await api.get('/bookings');
        const now = new Date();
        const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;

        const allBookings = allBookingsRaw.filter(b => {
          try {
            const bookingDateTime = new Date(b.date + ' ' + b.time);
            if (bookingDateTime > now) return true;
            return (now - bookingDateTime) < twoDaysInMs;
          } catch (e) {
            return true;
          }
        });

        const userBookings = allBookings.filter(b => b.email === userEmail);
        userBookings.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
        setBookings(userBookings);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      }
    };
    fetchBookings();
  }, [navigate]);

  const handleCancelBooking = async (id) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    const bookedAtTime = new Date(booking.bookedAt || (booking.date + ' ' + booking.time));
    const now = new Date();
    const hoursSinceBooking = (now - bookedAtTime) / (1000 * 60 * 60);

    if (hoursSinceBooking > 24) {
      if (window.showAppAlert) window.showAppAlert('Booking modification period has expired.');
      return;
    } else {
      let confirmed = false;
      if (window.showAppConfirm) {
        confirmed = await window.showAppConfirm('Are you sure you want to cancel your booking? Full refund will be processed to your original payment method.');
      } else {
        confirmed = window.confirm('Are you sure you want to cancel your booking? Full refund will be processed to your original payment method.');
      }
      if (!confirmed) return;
    }

    try {
      await api.patch(`/bookings/${id}`, { bookingStatus: 'Cancelled' });
      setBookings(bookings.map(b => b.id === id ? { ...b, bookingStatus: 'Cancelled' } : b));
      if (window.showAppToast) window.showAppToast('Booking cancelled successfully', 'success');
    } catch (err) {
      console.error('Failed to cancel booking', err);
      if (window.showAppToast) window.showAppToast('Failed to cancel booking', 'error');
    }
  };

  const openEditModal = (id) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    const bookedAtTime = new Date(booking.bookedAt || (booking.date + ' ' + booking.time));
    const now = new Date();
    const hoursSinceBooking = (now - bookedAtTime) / (1000 * 60 * 60);

    if (hoursSinceBooking > 24) {
      if (window.showAppAlert) window.showAppAlert('Booking modification period has expired.');
      return;
    }

    setBookingToEdit(id);
    setEditServices([...booking.services]);
    setServiceToAdd('');
    
    // Parse date
    try {
      const dateParts = booking.date.split(' ');
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const monthIndex = monthNames.indexOf(dateParts[1]);
      const day = parseInt(dateParts[0]);
      const year = parseInt(dateParts[2]);
      if (monthIndex !== -1) {
        const formattedDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setEditDate(formattedDate);
      }
    } catch(e) {}
    
    setEditTime(booking.time);
    setShowEditModal(true);
  };

  const handleConfirmEdit = async () => {
    if (!editDate || !editTime) {
      if (window.showAppAlert) window.showAppAlert('Please select both date and time.');
      return;
    }

    const dateObj = new Date(editDate);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const formattedDate = `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

    const prevBooking = bookings.find(b => b.id === bookingToEdit);
    if (prevBooking) {
      const newTotal = editServices.reduce((sum, s) => sum + s.price, 0);
      const amountPaid = prevBooking.amountPaid !== undefined 
        ? prevBooking.amountPaid 
        : (prevBooking.paymentStatus === 'Paid' ? prevBooking.total : prevBooking.total / 2);
      
      let balanceRemaining = newTotal - amountPaid;
      if (balanceRemaining < 0) balanceRemaining = 0;
      
      let newPaymentStatus = prevBooking.paymentStatus;
      if (balanceRemaining > 0) {
        newPaymentStatus = 'Partially Paid';
      } else if (balanceRemaining === 0 && amountPaid > 0) {
        newPaymentStatus = 'Paid';
      }

      const updates = {
        date: formattedDate,
        time: editTime,
        services: editServices,
        total: newTotal,
        amountPaid: amountPaid,
        balanceRemaining: balanceRemaining,
        paymentStatus: newPaymentStatus
      };

      try {
        await api.patch(`/bookings/${bookingToEdit}`, updates);
        setBookings(bookings.map(b => b.id === bookingToEdit ? { ...b, ...updates } : b));
        setShowEditModal(false);
        setBookingToEdit(null);
        if (window.showAppToast) window.showAppToast('Booking updated successfully', 'success');
      } catch (err) {
        console.error('Failed to update booking', err);
        if (window.showAppToast) window.showAppToast('Failed to update booking', 'error');
      }
    }
  };

  const handlePayRemaining = (id) => {
    navigate(`/checkout?bookingId=${id}`);
  };

  const getStatusDisplay = (b) => {
    const payStatus = b.paymentStatus || 'Pending';
    let payStatusText = payStatus;
    let payStatusColor = '#FF9800';
    const actualBalance = b.balanceRemaining !== undefined ? b.balanceRemaining : (payStatus === 'Partially Paid' || payStatus === 'Partial' ? b.total / 2 : 0);

    let bookStatus = b.bookingStatus || 'Confirmed';
    const bookingDateTime = new Date(b.date + ' ' + b.time);
    const now = new Date();
    if (bookStatus !== 'Cancelled' && bookingDateTime < now) {
      bookStatus = 'Completed';
    }

    const isCancelled = bookStatus === 'Cancelled';

    if (isCancelled) {
      if (payStatus === 'Paid' || payStatus === 'Partially Paid' || payStatus === 'Partial') {
        payStatusText = 'Refund in 24 hours';
        payStatusColor = '#FF9800';
      } else {
        payStatusText = '-';
        payStatusColor = '#9E9E9E';
      }
    } else {
      if (payStatus === 'Paid') payStatusColor = '#4CAF50';
      else if (payStatus === 'Partially Paid' || payStatus === 'Partial') {
        payStatusColor = '#2196F3';
        payStatusText = `Partial (₹${actualBalance.toLocaleString('en-IN')} Due)`;
      }
    }

    let bookStatusColor = '#4CAF50';
    if (isCancelled) bookStatusColor = '#E74C3C';
    if (bookStatus === 'Completed') bookStatusColor = '#2196F3';

    const bookedAtTime = new Date(b.bookedAt || (b.date + ' ' + b.time));
    const hoursSinceBooking = (now - bookedAtTime) / (1000 * 60 * 60);
    const isCompleted = bookStatus === 'Completed';
    const isLocked = hoursSinceBooking > 24 || isCancelled || isCompleted;

    let lockMessage = "Booking modification period has expired.";
    if (isCancelled) lockMessage = "This booking has been cancelled.";
    if (isCompleted) lockMessage = "This booking is already completed.";

    return { payStatusText, payStatusColor, bookStatus, bookStatusColor, isLocked, lockMessage, isCancelled, payStatus, actualBalance };
  };

  return (
    <main className="dashboard-container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container">
        <div className="modal-header">
          <h1>My Bookings</h1>
          <p>Manage your confirmed appointments and beauty schedule.</p>
        </div>

        <div className="bookings-table-wrapper">
          {bookings.length === 0 ? (
            <div id="noBookings" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.5 }}>
                <i className="fa-solid fa-calendar-days" style={{ color: 'var(--color-primary-light)' }}></i>
              </div>
              <h3>No Bookings Found</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>You haven't booked any beauty services yet.</p>
              <Link to="/services" className="btn btn-primary">View Services</Link>
            </div>
          ) : (
            <div className="bookings-list">
              <div className="booking-row header">
                <div className="booking-cell">Service / Package</div>
                <div className="booking-cell">Date</div>
                <div className="booking-cell">Time</div>
                <div className="booking-cell">Total</div>
                <div className="booking-cell">Booking Status</div>
                <div className="booking-cell">Payment Status</div>
              </div>

              {bookings.map(b => {
                const { payStatusText, payStatusColor, bookStatus, bookStatusColor, isLocked, lockMessage, isCancelled, payStatus, actualBalance } = getStatusDisplay(b);
                return (
                  <div key={b.id} className={`booking-row ${isCancelled ? 'cancelled' : ''}`}>
                    <div className="booking-cell" data-label="Service">
                      <div className="service-names">{b.services.map(s => s.name).join(', ')}</div>
                    </div>
                    <div className="booking-cell" data-label="Date">{b.date}</div>
                    <div className="booking-cell" data-label="Time">{b.time}</div>
                    <div className="booking-cell" data-label="Total">
                      <div style={{ fontWeight: 600 }}>Total: ₹{b.total.toLocaleString('en-IN')}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', marginTop: '4px' }}>
                        Paid: ₹{(b.amountPaid !== undefined ? b.amountPaid : (b.total - actualBalance)).toLocaleString('en-IN')}
                      </div>
                      {actualBalance > 0 && (
                        <div style={{ fontSize: '0.8rem', color: '#dc2626', marginTop: '2px', fontWeight: 600 }}>
                          Remaining: ₹{actualBalance.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                    <div className="booking-cell" data-label="Booking Status">
                      <span style={{ color: bookStatusColor, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        {bookStatus}
                      </span>
                    </div>
                    <div className="booking-cell" data-label="Payment Status">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span style={{ color: payStatusColor, fontWeight: 600, fontSize: '0.8rem', padding: '4px 10px', background: `${payStatusColor}15`, borderRadius: '4px', border: `1px solid ${payStatusColor}30`, display: 'inline-block', whiteSpace: 'nowrap', width: 'fit-content' }}>
                            {payStatusText}
                          </span>
                          {!isCancelled && !isLocked && actualBalance > 0 && (
                            <button onClick={() => handlePayRemaining(b.id)} style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                              Pay Remaining
                            </button>
                          )}
                        </div>
                        
                        {!isCancelled && (
                          <div className="booking-actions" style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="edit-btn"
                              title={isLocked ? lockMessage : 'Edit Booking'}
                              onClick={() => isLocked ? window.showAppAlert && window.showAppAlert(lockMessage) : openEditModal(b.id)}
                              style={{ background: isLocked ? '#f5f5f5' : '#f0f0f0', border: 'none', cursor: isLocked ? 'not-allowed' : 'pointer', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isLocked ? '#ccc' : 'var(--color-primary)', transition: 'all 0.2s' }}
                              disabled={isLocked}
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button
                              className="delete-btn"
                              title={isLocked ? lockMessage : 'Cancel Booking'}
                              onClick={() => isLocked ? window.showAppAlert && window.showAppAlert(lockMessage) : handleCancelBooking(b.id)}
                              style={{ background: isLocked ? '#f5f5f5' : '#fee2e2', border: 'none', cursor: isLocked ? 'not-allowed' : 'pointer', width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isLocked ? '#ccc' : '#dc2626', transition: 'all 0.2s' }}
                              disabled={isLocked}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="glow-alert-overlay active" style={{ display: 'flex' }}>
          <div className="glow-alert-card" style={{ maxWidth: '600px' }}>
            <h3 style={{ marginBottom: '20px' }}>✏️ Edit Booking</h3>
            <div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '5px' }}>Services</label>
                <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '8px', border: '1px solid #eee', marginBottom: '10px' }}>
                  {editServices.map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}>
                      <span>{s.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 600 }}>₹{s.price.toLocaleString('en-IN')}</span>
                        <button onClick={() => setEditServices(editServices.filter((_, i) => i !== idx))} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: '0 5px' }}><i className="fa-solid fa-trash"></i></button>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <select value={serviceToAdd} onChange={e => setServiceToAdd(e.target.value)} className="form-input" style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                      <option value="">Select service to add...</option>
                      {allOptions.map((opt, i) => (
                        <option key={i} value={opt.name}>{opt.name} - ₹{opt.price.toLocaleString('en-IN')}</option>
                      ))}
                    </select>
                    <button onClick={() => {
                      if (!serviceToAdd) return;
                      const svc = allOptions.find(o => o.name === serviceToAdd);
                      if (svc) setEditServices([...editServices, svc]);
                      setServiceToAdd('');
                    }} style={{ background: 'var(--color-secondary)', color: 'white', border: 'none', padding: '0 15px', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
                  </div>
                </div>
                {(() => {
                  const currentTotal = editServices.reduce((sum, s) => sum + s.price, 0);
                  const activeBooking = bookings.find(b => b.id === bookingToEdit) || {};
                  const amountPaid = activeBooking.amountPaid !== undefined ? activeBooking.amountPaid : (activeBooking.paymentStatus === 'Paid' ? activeBooking.total : (activeBooking.total / 2));
                  let newRemaining = currentTotal - amountPaid;
                  if (newRemaining < 0) newRemaining = 0;
                  return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', background: '#e0f2fe', padding: '10px', borderRadius: '8px', fontSize: '0.9rem' }}>
                      <div>New Total: <strong>₹{currentTotal.toLocaleString('en-IN')}</strong></div>
                      <div>Paid: <strong>₹{(amountPaid || 0).toLocaleString('en-IN')}</strong></div>
                      <div style={{ color: newRemaining > 0 ? '#dc2626' : '#16a34a' }}>Remaining: <strong>₹{newRemaining.toLocaleString('en-IN')}</strong></div>
                    </div>
                  );
                })()}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '5px' }}>New Date</label>
                <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="form-input" style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '8px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '5px' }}>New Time</label>
                <select value={editTime} onChange={(e) => setEditTime(e.target.value)} className="form-input" style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '8px' }}>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="12:30 PM">12:30 PM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="01:30 PM">01:30 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                  <option value="05:30 PM">05:30 PM</option>
                </select>
              </div>
              <div style={{ background: '#fff3cd', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', color: '#856404' }}>
                <strong>⚠️ Refund Policy:</strong> Changes allowed only within 24 hours of booking confirmation. After that, no refund will be provided.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleConfirmEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
