import { useState } from 'react';
import { Plus, X, Package } from 'lucide-react';
import useInventoryStore from '../../store/inventoryStore';

function AddInventory({ stores }) {
  const { addInventoryItem } = useInventoryStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    sku: '',
    productName: '',
    category: '',
    storeId: '',
    quantity: 0,
    minThreshold: 10,
    price: 0,
    cost: 0,
    supplier: '',
    tags: []
  });

  const categories = ['Electronics', 'Accessories', 'Clothing', 'Home', 'Sports', 'Books', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await addInventoryItem({
      ...formData,
      quantity: parseInt(formData.quantity),
      minThreshold: parseInt(formData.minThreshold),
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      tags: formData.tags.length > 0 ? formData.tags.split(',').map(t => t.trim()) : []
    });

    alert('Product added successfully!');
    setShowForm(false);
    setFormData({
      sku: '',
      productName: '',
      category: '',
      storeId: '',
      quantity: 0,
      minThreshold: 10,
      price: 0,
      cost: 0,
      supplier: '',
      tags: []
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      sku: '',
      productName: '',
      category: '',
      storeId: '',
      quantity: 0,
      minThreshold: 10,
      price: 0,
      cost: 0,
      supplier: '',
      tags: []
    });
  };

  return (
    <div className="add-inventory">
      {!showForm && (
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={18} /> Add Product
        </button>
      )}

      {showForm && (
        <div className="add-inventory-modal">
          <div className="modal-overlay" onClick={handleCancel}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2><Package size={24} /> Add New Product</h2>
              <button className="btn-close" onClick={handleCancel}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="add-inventory-form">
              <div className="form-row">
                <div className="form-group">
                  <label>SKU / Product Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    placeholder="e.g., ELEC-001"
                  />
                </div>
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData({...formData, productName: e.target.value})}
                    placeholder="e.g., Laptop Pro 15"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Store *</label>
                  <select
                    required
                    value={formData.storeId}
                    onChange={(e) => setFormData({...formData, storeId: e.target.value})}
                  >
                    <option value="">Select Store</option>
                    {stores.map(store => (
                      <option key={store.id} value={store.id}>{store.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    placeholder="e.g., 50"
                  />
                </div>
                <div className="form-group">
                  <label>Min Stock Threshold *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.minThreshold}
                    onChange={(e) => setFormData({...formData, minThreshold: e.target.value})}
                    placeholder="e.g., 10"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="e.g., 85000"
                  />
                </div>
                <div className="form-group">
                  <label>Cost Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    placeholder="e.g., 65000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Supplier</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  placeholder="e.g., Tech Suppliers Inc."
                />
              </div>

              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="e.g., electronics, laptops, premium"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  <Plus size={18} /> Add Product
                </button>
                <button type="button" className="btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddInventory;
