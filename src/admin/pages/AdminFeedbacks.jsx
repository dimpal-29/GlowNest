import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import AdminSidebar from '../components/AdminSidebar.jsx';
import AdminNavbar from '../components/AdminNavbar.jsx';
import '../css/admin.css';

export default function AdminFeedbacks() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await api.get('/feedbacks');
      // Sort feedbacks: most recent first
      const sorted = [...data].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      setFeedbacks(sorted);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <AdminNavbar title="Feedback Management" onToggleSidebar={() => setSidebarOpen(true)} />

        <div className="admin-content">
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Client Testimonials & Feedbacks</h3>
            </div>

            <div className="admin-card-body">
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh', fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '10px' }}></i> Loading Feedbacks...
                </div>
              ) : feedbacks.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No feedback comments found yet.</p>
              ) : (
                <div className="admin-feedback-grid">
                  {feedbacks.map((f) => (
                    <div key={f.id} className="admin-feedback-card">
                      <div className="admin-feedback-meta">
                        <div>
                          <div className="admin-feedback-name">{f.name}</div>
                          <div className="admin-feedback-rating">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <i 
                                key={i} 
                                className={`fa-star ${i < f.rating ? 'fa-solid' : 'fa-regular'}`}
                                style={{ color: '#f1c40f', marginRight: '2px' }}
                              ></i>
                            ))}
                          </div>
                        </div>
                        <span className="admin-feedback-date">
                          {new Date(f.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="admin-feedback-text">"{f.message}"</p>
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
