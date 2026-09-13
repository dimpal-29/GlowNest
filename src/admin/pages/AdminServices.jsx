import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import AdminSidebar from '../components/AdminSidebar.jsx';
import AdminNavbar from '../components/AdminNavbar.jsx';
import '../css/admin.css';

const CATEGORY_LABELS = {
  hair: 'Hair Care',
  skin: 'Skin & Facials',
  nails: 'Nails',
  makeup: 'Makeup',
  spa: 'Spa & Massage',
  bridal: 'Bridal'
};

export default function AdminServices() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState(null);

  // Form states
  const [form, setForm] = useState({
    title: '',
    category: 'hair',
    price: '',
    duration: '',
    desc: '',
    image: ''
  });

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await api.get('/services');
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditMode(false);
    setCurrentServiceId(null);
    setForm({
      title: '',
      category: 'hair',
      price: '₹',
      duration: 'mins',
      desc: '',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=500&q=80'
    });
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditMode(true);
    setCurrentServiceId(service.id);
    setForm({
      title: service.title,
      category: service.category,
      price: service.price,
      duration: service.duration,
      desc: service.desc,
      image: service.image
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({
      title: '',
      category: 'hair',
      price: '',
      duration: '',
      desc: '',
      image: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.price.trim() || !form.duration.trim() || !form.desc.trim()) {
      window.showAppToast('Please fill in all fields', 'error');
      return;
    }

    try {
      const payload = {
        title: form.title,
        category: form.category,
        price: form.price,
        duration: form.duration,
        desc: form.desc,
        image: form.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=500&q=80'
      };

      if (editMode) {
        await api.patch(`/services/${currentServiceId}`, payload);
        window.showAppToast('Service updated successfully', 'success');
      } else {
        // Generate a random high-end service id to prevent conflicts
        const newId = `svc_${Date.now()}`;
        await api.post('/services', { ...payload, id: newId });
        window.showAppToast('Service added successfully', 'success');
      }

      closeModal();
      fetchServices();
    } catch (err) {
      console.error('Error saving service:', err);
      window.showAppToast('Failed to save service', 'error');
    }
  };

  const handleDelete = async (serviceId) => {
    const confirmed = await window.showAppConfirm('Are you sure you want to delete this service? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await api.delete(`/services/${serviceId}`);
      window.showAppToast('Service deleted successfully', 'success');
      fetchServices();
    } catch (err) {
      console.error('Error deleting service:', err);
      window.showAppToast('Failed to delete service', 'error');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <AdminNavbar title="Services Management" onToggleSidebar={() => setSidebarOpen(true)} />

        <div className="admin-content">
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>All Services</h3>
              <button className="btn btn-primary btn-sm" onClick={openAddModal}>
                <i className="fa-solid fa-plus"></i> Add Service
              </button>
            </div>
            
            <div className="admin-card-body">
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh', fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '10px' }}></i> Loading Services...
                </div>
              ) : services.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No services found. Add one to get started!</p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Duration</th>
                        <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => (
                        <tr key={service.id}>
                          <td>
                            <img 
                              src={service.image} 
                              alt={service.title} 
                              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}
                            />
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{service.title}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {service.desc}
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>
                              {CATEGORY_LABELS[service.category] || service.category}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600, color: 'var(--color-gold)' }}>{service.price}</td>
                          <td>⏱ {service.duration}</td>
                          <td>
                            <div className="admin-btn-action-group" style={{ justifyContent: 'flex-end' }}>
                              <button 
                                className="admin-btn-icon edit" 
                                onClick={() => openEditModal(service)}
                                title="Edit Service"
                              >
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                              <button 
                                className="admin-btn-icon delete" 
                                onClick={() => handleDelete(service.id)}
                                title="Delete Service"
                              >
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
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

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editMode ? 'Edit Service Details' : 'Add New Service'}</h3>
              <i className="fa-solid fa-xmark admin-modal-close" onClick={closeModal}></i>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label htmlFor="serviceTitle">Service Name / Title</label>
                  <input 
                    type="text" 
                    id="serviceTitle"
                    name="title"
                    className="admin-form-control"
                    placeholder="e.g. Charcoal Peel-Off Facial"
                    value={form.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label htmlFor="serviceCategory">Category</label>
                    <select 
                      id="serviceCategory"
                      name="category"
                      className="admin-form-control"
                      value={form.category}
                      onChange={handleInputChange}
                    >
                      <option value="hair">Hair Care</option>
                      <option value="skin">Skin & Facials</option>
                      <option value="nails">Nails</option>
                      <option value="makeup">Makeup</option>
                      <option value="spa">Spa & Massage</option>
                      <option value="bridal">Bridal</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="servicePrice">Price (including currency symbol)</label>
                    <input 
                      type="text" 
                      id="servicePrice"
                      name="price"
                      className="admin-form-control"
                      placeholder="e.g. ₹699"
                      value={form.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label htmlFor="serviceDuration">Duration</label>
                    <input 
                      type="text" 
                      id="serviceDuration"
                      name="duration"
                      className="admin-form-control"
                      placeholder="e.g. 45 mins"
                      value={form.duration}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="serviceImage">Image Link / Path</label>
                    <input 
                      type="text" 
                      id="serviceImage"
                      name="image"
                      className="admin-form-control"
                      placeholder="e.g. /src/assets/services/svc_6_facial.jpg"
                      value={form.image}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="serviceDesc">Description</label>
                  <textarea 
                    id="serviceDesc"
                    name="desc"
                    className="admin-form-control"
                    placeholder="Provide a compelling description of the treatment..."
                    value={form.desc}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  {editMode ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
