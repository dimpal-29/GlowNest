import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../../css/auth.css";

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple static credential check (demo)
    if (email === 'admin@glownest.com' && password === 'admin123') {
      // use the same key as RequireAuth
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Admin Login</h2>
          <p>Enter your admin credentials</p>
        </div>
        {error && (
          <div className="auth-success-msg" style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginTop: '16px',
            border: '1px solid #fecaca'
          }}>{error}</div>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <div className="input-container">
              <span className="input-icon"><i className="fa-solid fa-envelope"></i></span>
              <input
                type="email"
                className="form-input"
                id="adminEmail"
                placeholder="admin@glownest.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                id="adminPassword"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-auth" style={{ width: '100%', marginTop: '12px' }}>Login</button>
        </form>


      </div>
    </main>
  );
}
