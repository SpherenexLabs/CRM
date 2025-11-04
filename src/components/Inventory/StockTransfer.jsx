import { useState } from 'react';
import { ArrowRightLeft, CheckCircle } from 'lucide-react';
import useInventoryStore from '../../store/inventoryStore';

function StockTransfer({ stores }) {
  const { inventory, transferStock } = useInventoryStore();
  const [formData, setFormData] = useState({
    fromStore: '',
    toStore: '',
    sku: '',
    quantity: '',
    reason: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const availableProducts = formData.fromStore 
    ? inventory.filter(item => item.storeId === parseInt(formData.fromStore))
    : [];

  const selectedProduct = formData.sku 
    ? availableProducts.find(item => item.sku === formData.sku)
    : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.fromStore || !formData.toStore || !formData.sku || !formData.quantity) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    if (formData.fromStore === formData.toStore) {
      setMessage({ type: 'error', text: 'Source and destination stores must be different' });
      return;
    }

    const result = transferStock(
      parseInt(formData.fromStore),
      parseInt(formData.toStore),
      formData.sku,
      parseInt(formData.quantity),
      formData.reason
    );

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setFormData({
        fromStore: '',
        toStore: '',
        sku: '',
        quantity: '',
        reason: ''
      });
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="stock-transfer">
      <div className="transfer-header">
        <ArrowRightLeft className="transfer-icon" />
        <h2>Transfer Stock Between Stores</h2>
      </div>

      <div className="transfer-container">
        <form onSubmit={handleSubmit} className="transfer-form">
          <div className="form-row">
            <div className="form-group">
              <label>From Store *</label>
              <select
                value={formData.fromStore}
                onChange={(e) => setFormData({...formData, fromStore: e.target.value, sku: '', quantity: ''})}
                className="form-control"
                required
              >
                <option value="">Select source store</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>To Store *</label>
              <select
                value={formData.toStore}
                onChange={(e) => setFormData({...formData, toStore: e.target.value})}
                className="form-control"
                required
              >
                <option value="">Select destination store</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Product *</label>
            <select
              value={formData.sku}
              onChange={(e) => setFormData({...formData, sku: e.target.value})}
              className="form-control"
              required
              disabled={!formData.fromStore}
            >
              <option value="">Select product</option>
              {availableProducts.map(item => (
                <option key={item.id} value={item.sku}>
                  {item.productName} - {item.sku} (Available: {item.quantity})
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="product-info">
              <h4>Product Details</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Current Stock:</span>
                  <span className="value">{selectedProduct.quantity} units</span>
                </div>
                <div className="info-item">
                  <span className="label">Price:</span>
                  <span className="value">₹{selectedProduct.price}</span>
                </div>
                <div className="info-item">
                  <span className="label">Category:</span>
                  <span className="value">{selectedProduct.category}</span>
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Quantity to Transfer *</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              className="form-control"
              min="1"
              max={selectedProduct?.quantity || 999}
              required
              disabled={!formData.sku}
            />
            {selectedProduct && (
              <small className="form-hint">
                Maximum available: {selectedProduct.quantity} units
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Reason for Transfer</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              className="form-control"
              rows="3"
              placeholder="Optional: Enter reason for stock transfer"
            />
          </div>

          {message.text && (
            <div className={`message message-${message.type}`}>
              {message.type === 'success' && <CheckCircle size={20} />}
              <span>{message.text}</span>
            </div>
          )}

          <button type="submit" className="btn-submit">
            <ArrowRightLeft size={20} />
            Transfer Stock
          </button>
        </form>
      </div>
    </div>
  );
}

export default StockTransfer;




