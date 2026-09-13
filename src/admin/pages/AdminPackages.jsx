import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import AdminSidebar from '../components/AdminSidebar.jsx';
import AdminNavbar from '../components/AdminNavbar.jsx';
import '../css/admin.css';

export default function AdminPackages() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPackageId, setCurrentPackageId] = useState(null);

  // Form states
  const [form, setForm] = useState({
    name: '',
    subtitle: '',
    originalPrice: '',
    currentPrice: '',
    priceSuffix: '/session',
    savings: '',
    numericPrice: 0,
    popular: false
  });
  
  // Package features sub-state
  const [features, setFeatures] = useState([{ text: '', included: true }]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await api.get('/packages');
      setPackages(data);
    } catch (err) {
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const openAddModal = () => {
    setEditMode(false);
    setCurrentPackageId(null);
    setForm({
      name: '',
      subtitle: '',
      originalPrice: '₹',
      currentPrice: '₹',
      priceSuffix: '/session',
      savings: 'Save %',
      numericPrice: 0,
      popular: false
    });
    setFeatures([{ text: '', included: true }]);
    setModalOpen(true);
  };

  const openEditModal = (pkg) => {
    setEditMode(true);
    setCurrentPackageId(pkg.id);
    setForm({
      name: pkg.name,
      subtitle: pkg.subtitle,
      originalPrice: pkg.originalPrice,
      currentPrice: pkg.currentPrice,
      priceSuffix: pkg.priceSuffix,
      savings: pkg.savings,
      numericPrice: pkg.numericPrice,
      popular: pkg.popular || false
    });
    setFeatures(pkg.features && pkg.features.length > 0 ? pkg.features : [{ text: '', included: true }]);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'numericPrice' ? parseInt(value) || 0 : value)
    }));
  };

  // Feature handling methods
  const handleFeatureTextChange = (index, value) => {
    const updated = [...features];
    updated[index].text = value;
    setFeatures(updated);
  };

  const handleFeatureToggleIncluded = (index) => {
    const updated = [...features];
    updated[index].included = !updated[index].included;
    setFeatures(updated);
  };

  const addFeatureRow = () => {
    setFeatures(prev => [...prev, { text: '', included: true }]);
  };

  const removeFeatureRow = (index) => {
    if (features.length === 1) {
      window.showAppToast('A package must have at least one feature line', 'warning');
      return;
    }
    setFeatures(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if form or features are empty
    if (!form.name.trim() || !form.currentPrice.trim()) {
      window.showAppToast('Name and Current Price are required', 'error');
      return;
    }

    const validFeatures = features.filter(f => f.text.trim() !== '');
    if (validFeatures.length === 0) {
      window.showAppToast('Please provide at least one feature text line', 'error');
      return;
    }

    try {
      const payload = {
        name: form.name,
        subtitle: form.subtitle,
        originalPrice: form.originalPrice,
        currentPrice: form.currentPrice,
        priceSuffix: form.priceSuffix,
        savings: form.savings,
        numericPrice: form.numericPrice || parseInt(form.currentPrice.replace(/[^0-9]/g, '')) || 0,
        popular: form.popular,
        features: validFeatures
      };

      if (editMode) {
        await api.patch(`/packages/${currentPackageId}`, payload);
        window.showAppToast('Package updated successfully', 'success');
      } else {
        // Generate high-end package id to prevent conflicts
        const newId = `pkg_${Date.now()}`;
        await api.post('/packages', { ...payload, id: newId });
        window.showAppToast('Package added successfully', 'success');
      }

      closeModal();
      fetchPackages();
    } catch (err) {
      console.error('Error saving package:', err);
      window.showAppToast('Failed to save package', 'error');
    }
  };

  const handleDelete = async (pkgId) => {
    const confirmed = await window.showAppConfirm('Are you sure you want to delete this package?');
    if (!confirmed) return;

    try {
      await api.delete(`/packages/${pkgId}`);
      window.showAppToast('Package deleted successfully', 'success');
      fetchPackages();
    } catch (err) {
      console.error('Error deleting package:', err);
      window.showAppToast('Failed to delete package', 'error');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <AdminNavbar title="Packages Management" onToggleSidebar={() => setSidebarOpen(true)} />

        <div className="admin-content">
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>All Packages</h3>
              <button className="btn btn-primary btn-sm" onClick={openAddModal}>
                <i className="fa-solid fa-plus"></i> Add Package
              </button>
            </div>

            <div className="admin-card-body">
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh', fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '10px' }}></i> Loading Packages...
                </div>
              ) : packages.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No packages found. Add one to get started!</p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Package Name</th>
                        <th>Subtitle</th>
                        <th>Original Price</th>
                        <th>Promo Price</th>
                        <th>Popular</th>
                        <th>Total Features</th>
                        <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packages.map((pkg) => (
                        <tr key={pkg.id}>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{pkg.name}</div>
                            {pkg.savings && (
                              <span className="admin-badge completed" style={{ fontSize: '0.65rem', padding: '2px 6px', marginTop: '4px' }}>
                                {pkg.savings}
                              </span>
                            )}
                          </td>
                          <td>
                            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                              {pkg.subtitle}
                            </span>
                          </td>
                          <td style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
                            {pkg.originalPrice}
                          </td>
                          <td>
                            <strong style={{ color: 'var(--color-gold)', fontSize: '1rem' }}>{pkg.currentPrice}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{pkg.priceSuffix}</span>
                          </td>
                          <td>
                            {pkg.popular ? (
                              <span className="admin-badge confirmed" style={{ fontSize: '0.7rem' }}>Popular</span>
                            ) : (
                              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>No</span>
                            )}
                          </td>
                          <td>{pkg.features ? pkg.features.length : 0} features</td>
                          <td>
                            <div className="admin-btn-action-group" style={{ justifyContent: 'flex-end' }}>
                              <button 
                                className="admin-btn-icon edit" 
                                onClick={() => openEditModal(pkg)}
                                title="Edit Package"
                              >
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                              <button 
                                className="admin-btn-icon delete" 
                                onClick={() => handleDelete(pkg.id)}
                                title="Delete Package"
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

      {/* Add / Edit Package Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editMode ? 'Edit Package Details' : 'Add New Package'}</h3>
              <i className="fa-solid fa-xmark admin-modal-close" onClick={closeModal}></i>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label htmlFor="packageName">Package Name</label>
                    <input 
                      type="text" 
                      id="packageName"
                      name="name"
                      className="admin-form-control"
                      placeholder="e.g. Signature Radiance"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="admin-form-group checkbox-group" style={{ height: '100%', display: 'flex', alignItems: 'center', paddingTop: '20px' }}>
                    <input 
                      type="checkbox" 
                      id="packagePopular"
                      name="popular"
                      className="admin-form-control"
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      checked={form.popular}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="packagePopular" style={{ cursor: 'pointer' }}>Mark as Popular / Best Value</label>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="packageSubtitle">Subtitle</label>
                  <input 
                    type="text" 
                    id="packageSubtitle"
                    name="subtitle"
                    className="admin-form-control"
                    placeholder="e.g. Our most booked daily luxury"
                    value={form.subtitle}
                    onChange={handleInputChange}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="admin-form-group">
                    <label htmlFor="packageOrigPrice">Original Price</label>
                    <input 
                      type="text" 
                      id="packageOrigPrice"
                      name="originalPrice"
                      className="admin-form-control"
                      placeholder="e.g. ₹4,196"
                      value={form.originalPrice}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="packageCurrPrice">Current Price</label>
                    <input 
                      type="text" 
                      id="packageCurrPrice"
                      name="currentPrice"
                      className="admin-form-control"
                      placeholder="e.g. ₹2,999"
                      value={form.currentPrice}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="packageSuffix">Price Suffix</label>
                    <input 
                      type="text" 
                      id="packageSuffix"
                      name="priceSuffix"
                      className="admin-form-control"
                      placeholder="e.g. /session"
                      value={form.priceSuffix}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label htmlFor="packageSavings">Savings Text</label>
                    <input 
                      type="text" 
                      id="packageSavings"
                      name="savings"
                      className="admin-form-control"
                      placeholder="e.g. Save 29%"
                      value={form.savings}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor="packageNumericPrice">Numeric Price Value (for sorting)</label>
                    <input 
                      type="number" 
                      id="packageNumericPrice"
                      name="numericPrice"
                      className="admin-form-control"
                      placeholder="e.g. 2999"
                      value={form.numericPrice}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Dynamic Features List */}
                <div className="admin-form-group">
                  <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Package Features / Treatments</span>
                    <button type="button" className="admin-btn-inline" onClick={addFeatureRow} style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary-light)', padding: '4px 10px', fontSize: '0.8rem' }}>
                      <i className="fa-solid fa-plus"></i> Add line
                    </button>
                  </label>
                  
                  <div style={{ maxHeight: '180px', overflowY: 'auto', paddingRight: '5px', marginTop: '8px' }}>
                    {features.map((feature, idx) => (
                      <div key={idx} className="admin-features-input-row">
                        <input 
                          type="text"
                          className="admin-form-control"
                          placeholder="e.g. 24K Gold Facial Treatment"
                          value={feature.text}
                          onChange={(e) => handleFeatureTextChange(idx, e.target.value)}
                          required
                        />
                        <button 
                          type="button"
                          className={`admin-btn-inline ${feature.included ? 'completed' : 'delete'}`}
                          style={{ 
                            borderColor: feature.included ? 'var(--color-success)' : 'var(--color-error)',
                            color: feature.included ? 'var(--color-success)' : 'var(--color-error)',
                            backgroundColor: feature.included ? 'rgba(76, 175, 80, 0.08)' : 'rgba(231, 76, 60, 0.08)',
                            minWidth: '95px',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}
                          onClick={() => handleFeatureToggleIncluded(idx)}
                        >
                          {feature.included ? 'Included' : 'Excluded'}
                        </button>
                        <button 
                          type="button" 
                          className="admin-btn-icon delete"
                          onClick={() => removeFeatureRow(idx)}
                          style={{ flexShrink: 0 }}
                          title="Remove feature"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="admin-modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  {editMode ? 'Save Changes' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
