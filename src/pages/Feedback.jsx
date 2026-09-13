import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import '../css/feedback.css';

export default function Feedback() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const hints = {
    1: 'Poor',
    2: 'Fair',
    3: 'Average',
    4: 'Good',
    5: 'Excellent!'
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isLoggedIn = localStorage.getItem('glowNest_isLoggedIn') === 'true';
    if (!isLoggedIn) {
      const confirmed = await window.showAppConfirm('Please login first to submit your feedback.');
      if (confirmed) {
        localStorage.setItem('glowNest_redirectAfterLogin', '/feedback');
        navigate('/login');
      }
      return;
    }

    const formData = {
      rating,
      message,
      name,
      submittedAt: new Date().toISOString()
    };

    const saveFeedback = async () => {
      try {
        await api.post('/feedbacks', formData);
        console.log('Feedback submitted:', formData);
        setSubmitted(true);
      } catch (err) {
        console.error('Feedback submission failed', err);
        if (window.showAppToast) window.showAppToast('Failed to submit feedback', 'error');
      }
    };
    saveFeedback();
  };

  return (
    <div>
      {/* Page Header */}
      <section className="page-header" style={{ background: "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80') center/cover", position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(62, 39, 35, 0.75)' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1>Share Your Feedback</h1>
          <p>Your opinion helps us grow and serve you better.</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span><i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem', margin: '0 8px' }}></i></span>
            <span>Feedback</span>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="feedback-section section">
        <div className="container">
          <div className="feedback-container box-reveal">
            <div className="feedback-header text-center">
              <h2>We Value Your Experience</h2>
              <p>Please take a moment to rate our services and tell us about your visit.</p>
            </div>

            {!submitted ? (
              <form className="feedback-page-form" onSubmit={handleSubmit}>
                <div className="form-group mb-2">
                  <label>Rating</label>
                  <div className="star-rating-input" id="starRating">
                    {[1, 2, 3, 4, 5].map(val => (
                      <span
                        key={val}
                        className={`star ${val <= displayRating ? 'active' : ''}`}
                        data-value={val}
                        onMouseOver={() => setHoverRating(val)}
                        onMouseOut={() => setHoverRating(null)}
                        onClick={() => setRating(val)}
                      >
                        <i className="fa-solid fa-star"></i>
                      </span>
                    ))}
                  </div>
                  <p className="rating-hint">{hints[displayRating]}</p>
                </div>

                <div className="form-group mb-2">
                  <label>Your Message</label>
                  <textarea
                    className="form-input"
                    id="feedbackMessage"
                    placeholder="What did you love? How can we improve?..."
                    rows="6"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-row mb-2">
                  <div className="form-group">
                    <label>Your Name (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      id="feedbackName"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-primary btn-lg w-100">
                    Submit Feedback <i className="fa-solid fa-paper-plane" style={{ marginLeft: '8px' }}></i>
                  </button>
                </div>
              </form>
            ) : (
              <div className="success-message text-center" style={{ display: 'block' }}>
                <div className="success-icon"><i className="fa-solid fa-circle-check"></i></div>
                <h2>Thank You!</h2>
                <p>Your feedback has been successfully submitted. We appreciate your time and kind words.</p>
                <div className="mt-2">
                  <Link to="/" className="btn btn-secondary">Back to Home</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
