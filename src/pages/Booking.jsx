import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import '../css/services.css';
import '../css/booking.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const TIME_SLOTS = {
  Morning: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  Afternoon: ['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM'],
  Evening: ['03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM'],
};

export default function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Booking data
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slotInfo, setSlotInfo] = useState({});

  // Calendar state
  const now = new Date();
  const [displayMonth, setDisplayMonth] = useState(now.getMonth());
  const [displayYear, setDisplayYear] = useState(now.getFullYear());

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [errors, setErrors] = useState({});

  // Confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Total price
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

  // Load from URL params and localStorage on mount
  useEffect(() => {
    let pendingCart = JSON.parse(localStorage.getItem('glowNest_pendingCart') || '[]');

    const paramService = searchParams.get('service');
    const paramPackage = searchParams.get('package');
    const paramPrice = searchParams.get('price');

    if (paramService || paramPackage) {
      let newName = paramService || paramPackage;
      newName = newName.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      newName = newName.replace(/\bHd\b/g, 'HD');
      const newPrice = paramPrice ? parseInt(paramPrice.replace(/[^0-9]/g, ''), 10) : 0;
      const alreadyExists = pendingCart.some(s => s.name.toLowerCase() === newName.toLowerCase());
      if (!alreadyExists) {
        pendingCart.push({ name: newName, price: newPrice });
        if (window.showAppToast) window.showAppToast(`${newName} added to your booking!`, 'success');
      }
    }

    setSelectedServices(pendingCart);
    localStorage.setItem('glowNest_pendingCart', JSON.stringify(pendingCart));

    // Auto-fill user details
    const currentUser = JSON.parse(localStorage.getItem('glowNest_currentUser') || '{}');
    if (currentUser.firstName) setFirstName(currentUser.firstName);
    if (currentUser.lastName) setLastName(currentUser.lastName);
    if (currentUser.email) setEmail(currentUser.email);
    if (currentUser.phone) setPhone(currentUser.phone);
  }, [searchParams]);

  // Remove a service
  const removeService = (index) => {
    const removed = selectedServices[index];
    const updated = selectedServices.filter((_, i) => i !== index);
    setSelectedServices(updated);
    localStorage.setItem('glowNest_pendingCart', JSON.stringify(updated));
    if (window.showAppToast) window.showAppToast(`${removed.name} removed`, 'info');
  };

  // Clear all
  const clearAll = () => {
    setSelectedServices([]);
    localStorage.setItem('glowNest_pendingCart', JSON.stringify([]));
    if (window.showAppToast) window.showAppToast('All selections cleared', 'info');
  };

  // Add more services → go to services page
  const addMore = () => {
    localStorage.setItem('glowNest_pendingCart', JSON.stringify(selectedServices));
    navigate('/services?mode=add');
  };

  // Calendar rendering
  const renderCalendarDays = () => {
    const firstDay = new Date(displayYear, displayMonth, 1).getDay();
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const cells = [];

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(displayYear, displayMonth, day);
      const isPast = dateObj < todayDate;
      const isToday = day === today.getDate() && displayMonth === today.getMonth() && displayYear === today.getFullYear();
      const dateStr = `${day} ${MONTH_NAMES[displayMonth]} ${displayYear}`;
      const isSelected = selectedDate === dateStr;

      cells.push(
        <div
          key={day}
          className={`calendar-day ${isPast ? 'disabled' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => {
            if (!isPast) {
              setSelectedDate(dateStr);
              setSelectedTime(null);
              checkTimeslotAvailability(dateStr);
            }
          }}
        >
          {day}
        </div>
      );
    }

    return cells;
  };

  const prevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const nextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  // Check timeslot availability
  const checkTimeslotAvailability = async (dateString) => {
    const today = new Date();
    const selectedDateObj = new Date(dateString);
    const isToday = selectedDateObj.toDateString() === today.toDateString();

    let bookings = [];
    try {
      bookings = await api.get('/bookings');
    } catch (e) {
      console.error('Failed to fetch bookings', e);
    }
    const dateBookings = bookings.filter(b => b.date === dateString);

    const timeCounts = {};
    dateBookings.forEach(b => {
      timeCounts[b.time] = (timeCounts[b.time] || 0) + 1;
    });

    const newSlotInfo = {};
    const maxSlots = 6;

    Object.values(TIME_SLOTS).flat().forEach(slotTime => {
      const count = timeCounts[slotTime] || 0;
      let status = 'available';
      let label = '';

      // Check if past time on today
      if (isToday) {
        const slotHour = parseInt(slotTime.split(':')[0]);
        const slotMinute = parseInt(slotTime.split(':')[1].split(' ')[0]);
        const slotAmPm = slotTime.split(' ')[1];
        let slotHour24 = slotHour;
        if (slotAmPm === 'PM' && slotHour !== 12) slotHour24 += 12;
        else if (slotAmPm === 'AM' && slotHour === 12) slotHour24 = 0;

        if (slotHour24 < today.getHours() || (slotHour24 === today.getHours() && slotMinute <= today.getMinutes())) {
          status = 'disabled';
          label = 'Unavailable';
        }
      }

      if (status !== 'disabled') {
        if (count >= maxSlots) {
          status = 'disabled';
          label = 'Slot Full';
        } else if (count > 0) {
          label = `${maxSlots - count} left`;
        }
      }

      newSlotInfo[slotTime] = { status, label };
    });

    setSlotInfo(newSlotInfo);
  };

  // Validation
  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (selectedServices.length === 0) {
          if (window.showAppToast) window.showAppToast('Please select a service or package.', 'warning');
          return false;
        }
        return true;
      case 2:
        if (!selectedDate) {
          if (window.showAppToast) window.showAppToast('Please select a date.', 'warning');
          return false;
        }
        if (!selectedTime) {
          if (window.showAppToast) window.showAppToast('Please select a time slot.', 'warning');
          return false;
        }
        return true;
      case 3:
        return validateDetails();
      default:
        return true;
    }
  };

  const validateDetails = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'Please enter your first name';
    if (!lastName.trim()) newErrors.lastName = 'Please enter your last name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Please enter a valid email address';
    if (!/^[\+]?[\d\s\-]{10,15}$/.test(phone.replace(/\s/g, ''))) newErrors.phone = 'Please enter a valid phone number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step navigation
  const goToStep = (step) => {
    if (step < 1 || step > totalSteps) return;
    if (step > currentStep && !validateStep(currentStep)) return;
    setCurrentStep(step);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  // Confirm booking
  const confirmBooking = async () => {
    const id = 'GN-' + Date.now().toString().slice(-6);
    setBookingId(id);

    const booking = {
      id,
      services: selectedServices,
      date: selectedDate,
      time: selectedTime,
      name: `${firstName} ${lastName}`,
      email: email,
      phone: phone,
      total: totalPrice,
      bookingStatus: 'Confirmed',
      paymentStatus: 'Pending',
      bookedAt: new Date().toISOString()
    };

    try {
      const createdBooking = await api.post('/bookings', booking);
      localStorage.removeItem('glowNest_pendingCart');

      if (window.showAppToast) window.showAppToast('Booking details saved. Redirecting to secure checkout...', 'success');

      setShowConfirmModal(true);

      setTimeout(() => {
        navigate(`/checkout?bookingId=${createdBooking.id}`);
      }, 1500);
    } catch (err) {
      console.error('Failed to confirm booking', err);
      if (window.showAppToast) window.showAppToast('Failed to save booking. Please try again.', 'error');
    }
  };

  // Progress line width
  const lineWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;

  // Check if user fields should be readonly (auto-filled from account)
  const currentUser = JSON.parse(localStorage.getItem('glowNest_currentUser') || '{}');
  const isFirstNameLocked = !!currentUser.firstName;
  const isLastNameLocked = !!currentUser.lastName;
  const isEmailLocked = !!currentUser.email;

  return (
    <div>
      {/* Page Header */}
      <section className="page-header" style={{ background: "url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1920&q=80') center/cover", position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(62, 39, 35, 0.75)' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1>Book Your Appointment</h1>
          <p>Schedule your beauty session in just a few simple steps.</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span><i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem', margin: '0 8px' }}></i></span>
            <span>Booking</span>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="booking-section">
        <div className="container">
          <div className="booking-container">

            {/* Progress Bar */}
            <div className="progress-bar" id="progressBar">
              <div className="progress-line" style={{ width: `${lineWidth}%` }}></div>
              {[
                { step: 1, label: 'Confirm Service' },
                { step: 2, label: 'Date & Time' },
                { step: 3, label: 'Your Details' },
                { step: 4, label: 'Review' },
              ].map(({ step, label }) => (
                <div
                  key={step}
                  className={`progress-step ${step < currentStep ? 'completed' : ''} ${step === currentStep ? 'active' : ''}`}
                  data-step={step}
                >
                  <div className="step-circle">
                    {step < currentStep ? <i className="fa-solid fa-check"></i> : step}
                  </div>
                  <div className="step-label">{label}</div>
                </div>
              ))}
            </div>

            {/* Step 1: Confirm Service */}
            <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
              <div className="step-title">
                <h2>Confirm Service</h2>
                <p>Please review your selected service or add more before picking a date.</p>
              </div>
              <div className="selected-service-banner" style={{ background: 'var(--color-bg-alt)', padding: '30px 20px', borderRadius: 'var(--radius-lg)', marginBottom: '20px', border: '1px solid rgba(109,76,65,0.1)', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '10px' }}>You have selected:</p>
                <div id="displaySelectedService">
                  {selectedServices.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', margin: 0 }}>No services selected yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                      {selectedServices.map((service, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(109, 76, 65, 0.03)', padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(109, 76, 65, 0.08)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600, color: 'var(--color-secondary)', fontSize: '0.95rem' }}>{service.name}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 700 }}>₹{service.price.toLocaleString('en-IN')}</span>
                          </div>
                          <button type="button" onClick={() => removeService(index)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Remove">
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button type="button" onClick={clearAll} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', opacity: 0.8 }}>
                          <i className="fa-solid fa-trash-can"></i> Clear All
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <p style={{ color: 'var(--color-text)', fontWeight: 600, marginTop: '8px' }}>₹{totalPrice.toLocaleString('en-IN')}</p>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={addMore}>+ Add More Services / Packages</button>
              </div>

              <div className="form-nav">
                <div></div>
                <button className="btn btn-primary" onClick={() => goToStep(2)}>Next: Pick Date →</button>
              </div>
            </div>

            {/* Step 2: Date & Time */}
            <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
              <div className="step-title">
                <h2>Choose Date & Time</h2>
                <p>Select your preferred appointment date and time slot</p>
              </div>
              <div className="datetime-grid">
                <div className="calendar-widget">
                  <div className="calendar-header">
                    <button className="calendar-nav-btn" onClick={prevMonth}>←</button>
                    <h4>{MONTH_NAMES[displayMonth]} {displayYear}</h4>
                    <button className="calendar-nav-btn" onClick={nextMonth}>→</button>
                  </div>
                  <div className="calendar-days-header">
                    <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                  </div>
                  <div className="calendar-days">
                    {renderCalendarDays()}
                  </div>
                </div>
                <div className="time-slots-wrapper">
                  <h4>Available Time Slots</h4>
                  {Object.entries(TIME_SLOTS).map(([period, slots]) => (
                    <div className="time-period" key={period}>
                      <h5>{period}</h5>
                      <div className="time-slots-grid">
                        {slots.map(time => {
                          const info = slotInfo[time] || {};
                          const isDisabled = info.status === 'disabled';
                          const isSelected = selectedTime === time;
                          return (
                            <button
                              key={time}
                              className={`time-slot ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''} ${info.status === 'disabled' && info.label === 'Slot Full' ? 'full' : ''}`}
                              data-time={time}
                              onClick={() => {
                                if (!isDisabled) setSelectedTime(time);
                              }}
                              disabled={isDisabled}
                            >
                              {time}
                              {info.label && <span className={`slot-status ${info.label.includes('left') ? 'info' : ''}`}>{info.label}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-nav">
                <button className="btn btn-secondary" onClick={() => goToStep(1)}>← Back</button>
                <button className="btn btn-primary" onClick={() => goToStep(3)}>Next: Your Details →</button>
              </div>
            </div>

            {/* Step 3: Personal Details */}
            <div className={`form-step ${currentStep === 3 ? 'active' : ''}`}>
              <div className="step-title">
                <h2>Your Details</h2>
                <p>Please provide your contact information</p>
              </div>
              <div className="details-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name <span className="required">*</span></label>
                    <input type="text" className={`form-input ${errors.firstName ? 'error' : ''}`} placeholder="Enter first name" value={firstName} onChange={(e) => { setFirstName(e.target.value); setErrors({ ...errors, firstName: '' }); }} readOnly={isFirstNameLocked} />
                    {errors.firstName && <div className="form-error visible">{errors.firstName}</div>}
                  </div>
                  <div className="form-group">
                    <label>Last Name <span className="required">*</span></label>
                    <input type="text" className={`form-input ${errors.lastName ? 'error' : ''}`} placeholder="Enter last name" value={lastName} onChange={(e) => { setLastName(e.target.value); setErrors({ ...errors, lastName: '' }); }} readOnly={isLastNameLocked} />
                    {errors.lastName && <div className="form-error visible">{errors.lastName}</div>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address <span className="required">*</span></label>
                  <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="Enter your email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }} readOnly={isEmailLocked} />
                  {errors.email && <div className="form-error visible">{errors.email}</div>}
                </div>
                <div className="form-group">
                  <label>Phone Number <span className="required">*</span></label>
                  <input type="tel" className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="+91 XXXXX XXXXX" value={phone} onChange={(e) => { setPhone(e.target.value); setErrors({ ...errors, phone: '' }); }} />
                  {errors.phone && <div className="form-error visible">{errors.phone}</div>}
                </div>
                <div className="form-group">
                  <label>Special Requests (Optional)</label>
                  <textarea className="form-input" placeholder="Any special requests or preferences..." value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)}></textarea>
                </div>
              </div>
              <div className="form-nav">
                <button className="btn btn-secondary" onClick={() => goToStep(2)}>← Back</button>
                <button className="btn btn-primary" onClick={() => goToStep(4)}>Review Booking →</button>
              </div>
            </div>

            {/* Step 4: Review & Confirm */}
            <div className={`form-step ${currentStep === 4 ? 'active' : ''}`}>
              <div className="step-title">
                <h2>Review & Confirm</h2>
                <p>Please review your booking details before confirming</p>
              </div>
              <div className="review-card">
                <div className="review-header">
                  <h3>Booking Summary</h3>
                  <p>Review your appointment details</p>
                </div>
                <div className="review-body">
                  <div className="review-item">
                    <span className="label">Services</span>
                    <span className="value">{selectedServices.map(s => s.name).join(', ') || '—'}</span>
                  </div>
                  <div className="review-item">
                    <span className="label">Date</span>
                    <span className="value">{selectedDate || '—'}</span>
                  </div>
                  <div className="review-item">
                    <span className="label">Time</span>
                    <span className="value">{selectedTime || '—'}</span>
                  </div>
                  <div className="review-item">
                    <span className="label">Name</span>
                    <span className="value">{`${firstName} ${lastName}`.trim() || '—'}</span>
                  </div>
                  <div className="review-item">
                    <span className="label">Email</span>
                    <span className="value">{email || '—'}</span>
                  </div>
                  <div className="review-item">
                    <span className="label">Phone</span>
                    <span className="value">{phone || '—'}</span>
                  </div>
                </div>
                <div className="review-total">
                  <span className="total-label">Total Amount</span>
                  <span className="total-price">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="form-nav">
                <button className="btn btn-secondary" onClick={() => goToStep(3)}>← Back</button>
                <button className="btn btn-primary btn-lg" onClick={confirmBooking}>✨ Confirm Booking</button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 9999, alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal" style={{ background: '#fff', padding: '40px', borderRadius: '20px', textAlign: 'center', maxWidth: '450px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div className="success-icon" style={{ fontSize: '3rem', marginBottom: '15px' }}>✅</div>
            <h2>Booking Confirmed!</h2>
            <p>Your appointment has been successfully booked. Redirecting to checkout...</p>
            <div className="booking-id" style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '15px' }}>{bookingId}</div>
          </div>
        </div>
      )}
    </div>
  );
}
