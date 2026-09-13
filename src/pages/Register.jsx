import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import '../css/auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false, visible: false });

  function showInlineMessage(text, isError = false) {
    setMessage({ text, isError, visible: true });
  }

  function validateEmail(em) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
  }

  function validatePhone(ph) {
    return /^[6-9]\d{9}$/.test(ph.replace(/\s/g, ''));
  }

  async function hashPassword(pw) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pw);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fName = firstName.trim();
    const lName = lastName.trim();
    const em = email.trim().toLowerCase();
    const ph = phone.trim();
    const pw = password;

    if (!fName || !lName || !em || !ph || !pw) {
      showInlineMessage('All fields are required', true);
      return;
    }

    if (!validateEmail(em)) {
      showInlineMessage('Please enter a valid email address', true);
      return;
    }

    if (!validatePhone(ph)) {
      showInlineMessage('Please enter a valid 10-digit Indian mobile number', true);
      return;
    }

    if (pw.length < 6) {
      showInlineMessage('Password must be at least 6 characters', true);
      return;
    }

    try {
      const users = await api.get('/users');
      const exists = users.some(u => u.email === em);
      if (exists) {
        showInlineMessage('User already registered with this email', true);
        return;
      }

      const hashedPassword = await hashPassword(pw);
      await api.post('/users', { firstName: fName, lastName: lName, email: em, phone: ph, password: hashedPassword });
    } catch (err) {
      showInlineMessage('Failed to register. Please try again later.', true);
      console.error(err);
      return;
    }

    showInlineMessage('Account created successfully! Redirecting to login...');

    // Reset form
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setPassword('');

    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Join GlowNest</h2>
          <p>Create an account to manage your beauty bookings</p>
        </div>

        {message.visible && (
          <div
            className="auth-success-msg"
            style={{
              display: 'block',
              backgroundColor: message.isError ? '#fee2e2' : '#d1fae5',
              color: message.isError ? '#dc2626' : '#059669',
              padding: '12px 16px',
              borderRadius: '8px',
              marginTop: '16px',
              border: message.isError ? '1px solid #fecaca' : '1px solid #a7f3d0'
            }}
          >
            {message.text}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                className="form-input no-icon-input"
                id="regFirstName"
                placeholder="Jane"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                className="form-input no-icon-input"
                id="regLastName"
                placeholder="Doe"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-container">
              <span className="input-icon"><i className="fa-solid fa-envelope"></i></span>
              <input
                type="email"
                className="form-input"
                id="regEmail"
                placeholder="jane@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <div className="input-container">
              <span className="input-icon"><i className="fa-solid fa-phone"></i></span>
              <input
                type="tel"
                className="form-input"
                id="regPhone"
                placeholder="10-digit mobile number"
                maxLength="10"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-container">
              <span className="input-icon"><i className="fa-solid fa-lock"></i></span>
              <input
                type="password"
                className="form-input"
                id="regPass"
                placeholder="Minimum 6 characters"
                minLength="6"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-auth">Register</button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </main>
  );
}
