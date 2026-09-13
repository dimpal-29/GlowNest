import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import '../css/checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const [booking, setBooking] = useState(null);
  const [paymentMode, setPaymentMode] = useState('full'); // 'full' | 'partial'
  const [activeMethod, setActiveMethod] = useState('card'); // 'card' | 'upi' | 'netbanking'
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txId, setTxId] = useState('');

  // Form states
  const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');
  const [bank, setBank] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const bookings = await api.get('/bookings');
        const userEmail = localStorage.getItem('glowNest_userEmail');
        
        let targetBooking = null;
        if (bookingId) {
          targetBooking = bookings.find(b => String(b.id) === String(bookingId));
        } 
        
        if (!targetBooking) {
          const userBookings = bookings.filter(b => b.email === userEmail);
          if (userBookings.length > 0) {
            userBookings.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
            targetBooking = userBookings[0];
          }
        }
        
        if (targetBooking) {
          setBooking(targetBooking);
        } else {
          navigate('/booking');
        }
      } catch (err) {
        console.error('Failed to fetch bookings for checkout', err);
        navigate('/booking');
      }
    };
    fetchBooking();
  }, [navigate, bookingId]);

  if (!booking) return null;

  const isRemainingPayment = booking.balanceRemaining > 0 && booking.paymentStatus === 'Partially Paid';
  const amountToPay = isRemainingPayment ? booking.balanceRemaining : (paymentMode === 'partial' ? booking.total / 2 : booking.total);

  const handleCardInput = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
      let val = value.replace(/\D/g, '');
      let formatted = '';
      for (let i = 0; i < val.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += ' ';
        formatted += val[i];
      }
      formattedValue = formatted;
    } else if (name === 'expiry') {
      let val = value.replace(/\D/g, '');
      if (val.length > 2) {
        formattedValue = val.slice(0, 2) + ' / ' + val.slice(2, 4);
      } else {
        formattedValue = val;
      }
    }
    setCardDetails({ ...cardDetails, [name]: formattedValue });
  };

  const validateForm = () => {
    if (activeMethod === 'card') {
      if (!cardDetails.name) return 'Please enter cardholder name';
      if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 16) return 'Please enter a valid 16-digit card number';
      if (!cardDetails.expiry || !cardDetails.expiry.includes('/')) return 'Please enter card expiry (MM/YY)';
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) return 'Please enter a valid 3-digit CVV';
    } else if (activeMethod === 'upi') {
      if (!upiId) return 'Please enter your UPI ID or Scan QR';
      if (!upiId.includes('@')) return 'Please enter a valid UPI ID (e.g. user@upi)';
    } else if (activeMethod === 'netbanking') {
      if (!bank) return 'Please select your bank';
    }
    return null;
  };

  const handlePayment = async () => {
    const error = validateForm();
    if (error) {
      if (window.showAppToast) window.showAppToast(error, 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      const randomId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setTxId(randomId);

      const prevPaid = booking.amountPaid || 0;
      const newPaid = isRemainingPayment ? (prevPaid + amountToPay) : amountToPay;
      const balanceRemaining = booking.total - newPaid;
      const paymentStatus = balanceRemaining > 0 ? 'Partially Paid' : 'Paid';

      await api.patch(`/bookings/${booking.id}`, {
        amountPaid: newPaid,
        balanceRemaining: balanceRemaining,
        paymentStatus: paymentStatus
      });

      setShowSuccess(true);
      setIsProcessing(false);

      setTimeout(() => {
        navigate('/mybooking');
      }, 3000);
    } catch (err) {
      console.error('Payment update failed', err);
      if (window.showAppToast) window.showAppToast('Failed to process payment', 'error');
      setIsProcessing(false);
    }
  };

  // UPI QR generation
  const upiUrl = `upi://pay?pa=glownest@okaxis&pn=GlowNest&am=${amountToPay}&cu=INR`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}`;

  return (
    <div>
      {/* Checkout Section */}
      <section className="checkout-section" style={{ paddingTop: '50px' }}>
        <div className="container">
          <div className="checkout-grid">
            
            {/* Left: Payment Methods */}
            <div className="payment-card">
              <h2><i className="fa-solid fa-shield-halved"></i> Payment Method</h2>
              <p style={{ marginBottom: '25px', color: 'var(--color-text-muted)' }}>Choose how you'd like to pay for your appointment.</p>
              
              <div className="payment-methods">
                {/* Credit/Debit Card */}
                <div className={`method-option ${activeMethod === 'card' ? 'active' : ''}`} onClick={() => setActiveMethod('card')}>
                  <div className="method-content">
                    <span className="method-title">Credit / Debit Card</span>
                    <span className="method-desc">Visa, Mastercard, RuPay, Amex</span>
                  </div>
                  <div className="method-right">
                    <div className="method-icons">
                      <i className="fa-brands fa-cc-visa"></i>
                      <i className="fa-brands fa-cc-mastercard"></i>
                    </div>
                    <div className="method-radio"></div>
                  </div>
                </div>

                {/* UPI */}
                <div className={`method-option ${activeMethod === 'upi' ? 'active' : ''}`} onClick={() => setActiveMethod('upi')}>
                  <div className="method-content">
                    <span className="method-title">UPI / QR Code</span>
                    <span className="method-desc">Google Pay, PhonePe, Paytm</span>
                  </div>
                  <div className="method-right">
                    <div className="method-icons">
                      <i className="fa-solid fa-mobile-screen-button"></i>
                    </div>
                    <div className="method-radio"></div>
                  </div>
                </div>

                {/* Net Banking */}
                <div className={`method-option ${activeMethod === 'netbanking' ? 'active' : ''}`} onClick={() => setActiveMethod('netbanking')}>
                  <div className="method-content">
                    <span className="method-title">Net Banking</span>
                    <span className="method-desc">All major Indian banks supported</span>
                  </div>
                  <div className="method-right">
                    <div className="method-icons">
                      <i className="fa-solid fa-building-columns"></i>
                    </div>
                    <div className="method-radio"></div>
                  </div>
                </div>
              </div>

              {/* Card Form */}
              {activeMethod === 'card' && (
                <div className="card-form visible">
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input type="text" className="form-input" name="name" placeholder="Full name as on card" value={cardDetails.name} onChange={handleCardInput} />
                  </div>
                  <div className="form-group">
                    <label>Card Number</label>
                    <div style={{ position: 'relative' }}>
                      <input type="text" className="form-input" name="number" placeholder="xxxx xxxx xxxx xxxx" maxLength="19" value={cardDetails.number} onChange={handleCardInput} />
                      <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                        <i className="fa-solid fa-credit-card"></i>
                      </div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input type="text" className="form-input" name="expiry" placeholder="MM / YY" maxLength="7" value={cardDetails.expiry} onChange={handleCardInput} />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input type="password" className="form-input" name="cvv" placeholder="xxx" maxLength="3" value={cardDetails.cvv} onChange={handleCardInput} />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Form */}
              {activeMethod === 'upi' && (
                <div className="payment-method-details" style={{ display: 'block' }}>
                  <div style={{ textAlign: 'center', background: '#f9f9f9', padding: '25px', borderRadius: '15px', border: '1px dashed #e0e0e0' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '10px', color: 'var(--color-secondary)' }}>Scan & Pay</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>Use any UPI app to scan the QR code and pay.</p>
                    
                    <div style={{ width: '180px', height: '180px', background: 'white', margin: '0 auto 20px', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={qrApiUrl} alt="UPI QR Code" style={{ width: '100%', height: '100%' }} />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Amount to Pay</p>
                      <h4 style={{ color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: 700 }}>₹{amountToPay.toLocaleString('en-IN')}</h4>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px', opacity: 0.6 }}>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Google_Pay_Logo.svg" alt="GPay" style={{ height: '20px' }} />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" style={{ height: '20px' }} />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" style={{ height: '15px' }} />
                    </div>

                    <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '15px' }}>Or enter your UPI ID</p>
                      <div className="form-group" style={{ position: 'relative' }}>
                        <input type="text" className="form-input" placeholder="example@upi" style={{ textAlign: 'center', fontWeight: 600 }} value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 500 }}>Demo UPI ID: glownest@okaxis</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking Form */}
              {activeMethod === 'netbanking' && (
                <div className="payment-method-details" style={{ display: 'block' }}>
                  <div className="form-group">
                    <label>Select Your Bank</label>
                    <select className="form-input" value={bank} onChange={(e) => setBank(e.target.value)}>
                      <option value="" disabled>Choose a bank...</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                      <option value="pnb">Punjab National Bank</option>
                      <option value="bob">Bank of Baroda</option>
                      <option value="indusind">IndusInd Bank</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Account Holder Name <span style={{ fontWeight: 400, opacity: 0.6 }}>(Optional)</span></label>
                    <input type="text" className="form-input" placeholder="Name as per bank records" />
                  </div>
                  <div style={{ background: 'rgba(109, 76, 65, 0.05)', padding: '15px', borderRadius: '10px', borderLeft: '4px solid var(--color-primary)', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                    <i className="fa-solid fa-circle-info" style={{ marginRight: '8px' }}></i>
                    You will be redirected to your bank's secure website to complete the transaction.
                  </div>
                </div>
              )}
            </div>

            {/* Right: Summary */}
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {booking.services.map((service, index) => (
                  <div key={index} className="summary-item">
                    <div className="item-info">
                      <span className="item-name">{service.name}</span>
                    </div>
                    <span className="item-price">₹{service.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              
              {!isRemainingPayment && (
                <div className="payment-type-selector" style={{ marginBottom: '20px' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '10px' }}>Select Payment Type</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button className={`btn btn-secondary btn-sm payment-type-btn ${paymentMode === 'full' ? 'active' : ''}`} onClick={() => setPaymentMode('full')}>Full Payment</button>
                    <button className={`btn btn-secondary btn-sm payment-type-btn ${paymentMode === 'partial' ? 'active' : ''}`} onClick={() => setPaymentMode('partial')}>50% Deposit</button>
                  </div>
                </div>
              )}

              <div className="summary-total">
                <div className="total-row">
                  <span className="total-label">
                    {isRemainingPayment ? 'Remaining Balance to Pay' : (paymentMode === 'full' ? 'Total to Pay' : 'Deposit to Pay (50%)')}
                  </span>
                  <span className="total-amount">₹{amountToPay.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button className={`btn btn-primary btn-lg pay-btn ${isProcessing ? 'loading' : ''}`} onClick={handlePayment} disabled={isProcessing}>
                {isProcessing ? (
                  <><i className="fa-solid fa-circle-notch fa-spin"></i> Processing Payment...</>
                ) : (
                  <><i className="fa-solid fa-lock" style={{ fontSize: '0.8rem', marginRight: '8px' }}></i> Pay Securely</>
                )}
              </button>

              <div className="secure-badge">
                <i className="fa-solid fa-circle-check"></i>
                <span>Secure 256-bit SSL Encrypted Payment</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccess && (
        <div className="payment-modal active">
          <div className="payment-modal-content">
            <div className="success-check">
              <i className="fa-solid fa-check"></i>
            </div>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-secondary)', marginBottom: '10px' }}>Payment Successful!</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px', lineHeight: 1.6 }}>
              Your appointment is confirmed. A receipt and booking details have been sent to your email.
            </p>
            <div style={{ background: 'var(--color-bg-alt)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '30px' }}>
               <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', marginBottom: '5px' }}>Transaction ID</p>
               <p style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '1.2rem', color: 'var(--color-primary)' }}>{txId}</p>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-gold)', fontWeight: 600, textAlign: 'center' }}>Redirecting to your bookings...</p>
          </div>
        </div>
      )}
    </div>
  );
}
