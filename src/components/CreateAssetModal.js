import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X, DollarSign, Tag, Image } from 'lucide-react';
import { createAsset } from '../services/api';
import './CreateAssetModal.css';

const CreateAssetModal = ({ isOpen, onClose, onAssetCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'property',
    valuation: '',
    image_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'land', label: 'Land' },
    { value: 'property', label: 'Property' },
    { value: 'artifacts', label: 'Artifacts' },
    { value: 'paintings', label: 'Paintings' },
    { value: 'luxury_item', label: 'Luxury Item' },
    { value: 'collectibles', label: 'Collectibles' },
    { value: 'digital_data', label: 'Digital Data' },
    { value: 'miscellaneous', label: 'Miscellaneous' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Get user ID from localStorage
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user || !user.id) {
        setError('User not found. Please log in again.');
        setIsSubmitting(false);
        return;
      }      const response = await createAsset({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        valuation: parseFloat(formData.valuation) || 0,
        owner_id: user.id,
        image_url: formData.image_url || null
      });

      if (response.data.success) {
        onAssetCreated(response.data.data);
        resetForm();
        onClose();
      } else {
        setError(response.data.error || 'Failed to create asset');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create asset. Please try again.');
      console.error('Create asset error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'property',
      valuation: '',
      image_url: ''
    });
    setError('');
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <Tag size={24} />
            Create New Asset
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Asset Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Downtown Office Complex"
              required
            />
          </div>          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your asset..."
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="valuation">
              <DollarSign size={16} />
              Valuation (₹) *
            </label>
            <input
              type="number"
              id="valuation"
              name="valuation"
              value={formData.valuation}
              onChange={handleChange}
              placeholder="e.g., 5000000"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image_url">
              <Image size={16} />
              Image URL (optional)
            </label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CreateAssetModal;
