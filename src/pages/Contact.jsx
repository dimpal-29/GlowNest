import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/services.css';
import '../css/contact.css';

const FAQ_DATA = [
  { question: 'How do I book an appointment?', answer: 'You can book an appointment through our online booking page, by calling us at +91 98765 43210, or by visiting our studio directly. Online booking is available 24/7 and allows you to choose your preferred date, time, and services.' },
  { question: 'What is your cancellation policy?', answer: 'We understand plans can change. You can cancel or reschedule your appointment up to 4 hours before the scheduled time at no charge. Late cancellations may incur a 25% fee of the service cost.' },
  { question: 'Do you use organic products?', answer: 'Yes! We prioritize organic, cruelty-free, and dermatologically tested products. Our product line includes internationally recognized brands that are gentle on skin and environmentally responsible.' },
  { question: 'How early should I book for bridal services?', answer: 'We recommend booking bridal services at least 2–3 months in advance, and starting the pre-bridal package 6 weeks before the wedding. A trial session is included to ensure you love the look before your big day.' },
  { question: 'Do you offer home services?', answer: 'Yes, we offer home visit services for bridal makeup, party makeup, and selected spa treatments within Mumbai. Additional travel charges may apply depending on location. Please contact us for details.' },
  { question: 'What payment methods do you accept?', answer: 'We accept cash, all major credit/debit cards, UPI (GPay, PhonePe, Paytm), and net banking. Packages can also be paid in installments — ask our team for details.' },
];

const BUSINESS_HOURS = [
  { day: 1, name: 'Monday', time: '9:00 AM – 7:00 PM' },
  { day: 2, name: 'Tuesday', time: '9:00 AM – 7:00 PM' },
  { day: 3, name: 'Wednesday', time: '9:00 AM – 7:00 PM' },
  { day: 4, name: 'Thursday', time: '9:00 AM – 7:00 PM' },
  { day: 5, name: 'Friday', time: '9:00 AM – 7:00 PM' },
  { day: 6, name: 'Saturday', time: '9:00 AM – 7:00 PM' },
  { day: 0, name: 'Sunday', time: '10:00 AM – 7:00 PM' },
];

export default function Contact() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', subject: '', message: ''
  });

  const today = new Date().getDay();

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div>
      {/* Page Header */}
      <section className="page-header" style={{ background: "url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1920&q=80') center/cover", position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(62, 39, 35, 0.75)' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Reach out with any questions, feedback, or to schedule a visit.</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span><i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem', margin: '0 8px' }}></i></span>
            <span>Contact</span>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info Side */}
            <div className="contact-info reveal-left">
              <h2>Get in Touch</h2>
              <p>Have a question or want to book an appointment? We're here to help! Reach out through any of the channels below.</p>

              <div className="info-cards">
                <div className="info-card">
                  <div className="card-icon"><i className="fa-solid fa-location-dot"></i></div>
                  <div>
                    <h4>Visit Us</h4>
                    <p>123 Beauty Lane, Rose District,<br />Andheri West, Mumbai, MH 400001</p>
                  </div>
                </div>
                <div className="info-card">
                  <div className="card-icon"><i className="fa-solid fa-phone"></i></div>
                  <div>
                    <h4>Call Us</h4>
                    <p><a href="tel:+919876543210">+91 98765 43210</a></p>
                    <p><a href="tel:+919876543211">+91 98765 43211</a></p>
                  </div>
                </div>
                <div className="info-card">
                  <div className="card-icon"><i className="fa-solid fa-envelope"></i></div>
                  <div>
                    <h4>Email Us</h4>
                    <p><a href="mailto:hello@glownest.com">hello@glownest.com</a></p>
                    <p><a href="mailto:bookings@glownest.com">bookings@glownest.com</a></p>
                  </div>
                </div>
                <div className="info-card">
                  <div className="card-icon"><i className="fa-solid fa-clock"></i></div>
                  <div>
                    <h4>Working Hours</h4>
                    <p>Mon – Sat: 9:00 AM – 7:00 PM</p>
                    <p>Sunday: 10:00 AM – 7:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="contact-social">
                <h4>Follow Us</h4>
                <div className="social-links">
                  <a href="#" className="social-link" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                  <a href="#" className="social-link" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                  <a href="#" className="social-link" aria-label="Twitter"><i className="fa-brands fa-x-twitter"></i></a>
                  <a href="#" className="social-link" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
                  <a href="#" className="social-link" aria-label="Pinterest"><i className="fa-brands fa-pinterest"></i></a>
                </div>
              </div>
            </div>

            {/* Contact Form Side */}
            <div className="contact-form-wrapper reveal-right contact-form-premium">
              <div className="form-header">
                <h3>Send Us a Message</h3>
                <p>Fill out the form below and our team will get back to you shortly.</p>
              </div>

              {!formSubmitted ? (
                <form className="contact-form" id="contactForm" onSubmit={handleSubmit}>
                  <div className="form-row-grid">
                    <div className="form-group form-group-compact">
                      <label className="form-label-premium">First Name *</label>
                      <div className="input-wrapper">
                        <i className="fa-regular fa-user input-icon"></i>
                        <input type="text" className="form-input input-premium" name="firstName" placeholder="Jane" required value={formData.firstName} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="form-group form-group-compact">
                      <label className="form-label-premium">Last Name *</label>
                      <div className="input-wrapper">
                        <i className="fa-regular fa-user input-icon"></i>
                        <input type="text" className="form-input input-premium" name="lastName" placeholder="Doe" required value={formData.lastName} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label-premium">Email Address *</label>
                    <div className="input-wrapper">
                      <i className="fa-regular fa-envelope input-icon"></i>
                      <input type="email" className="form-input input-premium" name="email" placeholder="jane.doe@example.com" required value={formData.email} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label-premium">Subject *</label>
                    <div className="input-wrapper">
                      <i className="fa-regular fa-comment-dots input-icon"></i>
                      <input type="text" className="form-input input-premium" name="subject" placeholder="General Enquiry" required value={formData.subject} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label-premium">Message *</label>
                    <div className="input-wrapper">
                      <i className="fa-regular fa-message" style={{ position: 'absolute', left: '18px', top: '20px', color: 'var(--color-primary)', opacity: 0.7 }}></i>
                      <textarea className="form-input textarea-premium" name="message" placeholder="How can we help you today?" required value={formData.message} onChange={handleInputChange}></textarea>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-premium-send">
                    Send Message <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </form>
              ) : (
                <div className="form-success" style={{ display: 'block' }}>
                  <div className="icon"><i className="fa-solid fa-circle-check"></i></div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                </div>
              )}
            </div>
          </div>

          {/* Business Hours */}
          <div className="reveal hours-section-centered">
            <div className="hours-card hours-card-premium">
              <h4 className="hours-card-title-centered">
                <i className="fa-solid fa-calendar-days"></i> Business Hours
              </h4>
              <div className="hours-list">
                {BUSINESS_HOURS.map((item) => (
                  <div
                    key={item.day}
                    className={`hours-item hours-item-premium ${item.day === today ? 'hours-item-today-highlight' : ''}`}
                    data-day={item.day}
                  >
                    <span className="day-name">{item.name}{item.day === today ? ' (Today)' : ''}</span>
                    <span className="time">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <div className="section-header reveal">
            <h2>Find Us</h2>
            <p>Visit our studio in the heart of Mumbai's Rose District.</p>
          </div>
          <div className="map-wrapper reveal">
            <div className="map-placeholder">
              <div className="icon"><i className="fa-solid fa-location-dot"></i></div>
              <p>123 Beauty Lane, Rose District, Andheri West, Mumbai</p>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Open in Google Maps</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header reveal">
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions about our services and policies.</p>
          </div>
          <div className="faq-list reveal">
            {FAQ_DATA.map((faq, idx) => (
              <div key={idx} className={`faq-item ${activeFaq === idx ? 'active' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(idx)}>
                  <span>{faq.question}</span>
                  <span className="toggle-icon"><i className={`fa-solid ${activeFaq === idx ? 'fa-minus' : 'fa-plus'}`}></i></span>
                </button>
                <div className="faq-answer">
                  <div className="faq-answer-inner">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
