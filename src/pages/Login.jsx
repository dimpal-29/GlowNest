import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import '../css/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false, visible: false });

  function showInlineMessage(text, isError = false) {
    setMessage({ text, isError, visible: true });
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

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password;

    if (!trimmedEmail || !trimmedPassword) {
      showInlineMessage('Please enter both email and password', true);
      return;
    }

    let users = [];
    try {
      users = await api.get('/users');
    } catch (err) {
      showInlineMessage('Failed to connect to server. Please try again later.', true);
      console.error(err);
      return;
    }
    
    const hashedInputPassword = await hashPassword(trimmedPassword);
    const user = users.find(u => u.email.toLowerCase() === trimmedEmail && u.password === hashedInputPassword);

    if (!user) {
      showInlineMessage('Invalid email or password', true);
      return;
    }

    localStorage.setItem('glowNest_isLoggedIn', 'true');
    localStorage.setItem('glowNest_userEmail', user.email);
    localStorage.setItem('glowNest_currentUser', JSON.stringify({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || ''
    }));

    showInlineMessage('Login successful! Redirecting to home page...');

    setTimeout(() => {
      const redirectTo = localStorage.getItem('glowNest_redirectAfterLogin') || '/';
      localStorage.removeItem('glowNest_redirectAfterLogin');
      navigate(redirectTo);
    }, 1000);
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Please enter your credentials to login</p>
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
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-container">
              <span className="input-icon"><i className="fa-solid fa-envelope"></i></span>
              <input
                type="email"
                className="form-input"
                id="loginEmail"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                id="loginPass"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-auth">Login</button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Create One</Link></p>
        </div>
      </div>
    </main>
  );
}
