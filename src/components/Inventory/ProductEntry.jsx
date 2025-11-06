import { useState } from 'react';
import { Package, Plus, Save, X } from 'lucide-react';
import useInventoryStore from '../../store/inventoryStore';
import useAuthStore from '../../store/authStore';
import './ProductEntry.css';

function ProductEntry() {
  const { addInventoryItem, stores } = useInventoryStore();
  const { currentUser } = useAuthStore();
  
  const [formData, setFormData] = useState({
    sku: '',
    productName: '',
    category: '',
    storeId: '',
    quantity: '',
    minThreshold: '',
    price: '',
    cost: '',
    supplier: '',
    tags: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = ['Electronics', 'Accessories', 'Clothing', 'Home', 'Sports', 'Books', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFormData({
      sku: '',
      productName: '',
      category: '',
      storeId: '',
      quantity: '',
      minThreshold: '',
      price: '',
      cost: '',
      supplier: '',
      tags: ''
    });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate required fields
      if (!formData.sku || !formData.productName || !formData.category || !formData.storeId) {
        setMessage({ type: 'error', text: 'Please fill in all required fields' });
        setLoading(false);
        return;
      }

      // Clean and validate data
      const cleanData = {
        sku: formData.sku.trim(),
        productName: formData.productName.trim(),
        category: formData.category,
        storeId: formData.storeId,
        quantity: parseInt(formData.quantity) || 0,
        minThreshold: parseInt(formData.minThreshold) || 10,
        price: parseFloat(formData.price) || 0,
        cost: parseFloat(formData.cost) || 0,
        supplier: formData.supplier.trim(),
        tags: formData.tags.length > 0 ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : []
      };

      // Add customer account ID if user is a customer
      if (currentUser && currentUser.role === 'Customer') {
        cleanData.customerAccountId = currentUser.id;
      }

      const result = await addInventoryItem(cleanData);

      if (result && result.success === false) {
        setMessage({ type: 'error', text: 'Failed to add product: ' + (result.error || 'Unknown error') });
        setLoading(false);
        return;
      }

      setMessage({ type: 'success', text: 'Product added successfully!' });
      
      // Reset form after 2 seconds
      setTimeout(() => {
        handleReset();
      }, 2000);

    } catch (error) {
      console.error('Error adding product:', error);
      setMessage({ type: 'error', text: 'Failed to add product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-entry-container">
      <div className="product-entry-header">
        <div className="header-content">
          <Package size={32} className="header-icon" />
          <div>
            <h1>Add New Product</h1>
            <p>Enter product details to add to inventory</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="product-entry-form">
        <div className="form-section">
          <h3>Product Information</h3>
          
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="sku">SKU / Product Code *</label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g., ELEC-001"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="productName">Product Name *</label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="e.g., Laptop Pro 15"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="storeId">Store *</label>
              <select
                id="storeId"
                name="storeId"
                value={formData.storeId}
                onChange={handleChange}
                required
              >
                <option value="">Select Store</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Stock & Pricing</h3>
          
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g., 50"
                min="0"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="minThreshold">Min Stock Threshold *</label>
              <input
                type="number"
                id="minThreshold"
                name="minThreshold"
                value={formData.minThreshold}
                onChange={handleChange}
                placeholder="e.g., 10"
                min="0"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="price">Selling Price (₹) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., 85000"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="cost">Cost Price (₹) *</label>
              <input
                type="number"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                placeholder="e.g., 65000"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Details</h3>
          
          <div className="form-grid">
            <div className="form-field full-width">
              <label htmlFor="supplier">Supplier</label>
              <input
                type="text"
                id="supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                placeholder="e.g., Tech Suppliers Inc."
              />
            </div>

            <div className="form-field full-width">
              <label htmlFor="tags">Tags (comma separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., electronics, laptops, premium"
              />
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div>
                Adding...
              </>
            ) : (
              <>
                <Plus size={20} />
                Add Product
              </>
            )}
          </button>
          <button type="button" className="btn-reset" onClick={handleReset} disabled={loading}>
            <X size={20} />
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductEntry;
