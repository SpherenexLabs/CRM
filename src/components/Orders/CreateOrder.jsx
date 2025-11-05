import { useState } from 'react';
import { Plus, Trash2, ShoppingCart, UserPlus, X } from 'lucide-react';
import useOrderStore from '../../store/orderStore';
import useCustomerStore from '../../store/customerStore';
import useInventoryStore from '../../store/inventoryStore';
import usePaymentStore from '../../store/paymentStore';
import useAuthStore from '../../store/authStore';
import { initiateRazorpayPayment } from '../../utils/razorpay';

function CreateOrder({ onSuccess }) {
  const { createOrder, updatePaymentStatus } = useOrderStore();
  const { customers, registerCustomer } = useCustomerStore();
  const { inventory, stores } = useInventoryStore();
  const { processPayment } = usePaymentStore();
  const { currentUser } = useAuthStore();

  const [orderItems, setOrderItems] = useState([]);
  const [formData, setFormData] = useState({
    customerId: '',
    storeId: '',
    shippingAddress: '',
    paymentMethod: 'Razorpay'
  });

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const addItem = () => {
    setOrderItems([...orderItems, { sku: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...orderItems];
    newItems[index][field] = value;

    if (field === 'sku') {
      const product = inventory.find(item => item.sku === value);
      if (product) {
        newItems[index].price = product.price;
        newItems[index].productName = product.productName;
      }
    }

    setOrderItems(newItems);
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      alert('Please fill in all required customer fields');
      return;
    }

    const result = await registerCustomer(newCustomer);
    
    if (result.success) {
      alert('Customer added successfully!');
      setFormData({ ...formData, customerId: result.id });
      setShowCustomerModal(false);
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
    } else {
      alert('Failed to add customer: ' + result.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerId || !formData.storeId || orderItems.length === 0) {
      alert('Please fill all required fields and add at least one item');
      return;
    }

    const customer = customers.find(c => c.id === formData.customerId);
    const totalAmount = calculateTotal();
    const grandTotal = totalAmount * 1.1; // Including 10% tax

    const orderData = {
      customerId: formData.customerId, // Keep as string (Firebase ID)
      customerAccountId: currentUser?.role === 'Customer' ? currentUser.id : null, // Link to customer account
      customerName: customer?.name || 'Unknown',
      storeId: formData.storeId, // Keep as string or number based on store structure
      items: orderItems,
      totalAmount,
      shippingAddress: formData.shippingAddress || customer?.address,
      paymentMethod: formData.paymentMethod
    };

    // If Razorpay is selected, initiate Razorpay payment
    if (formData.paymentMethod === 'Razorpay') {
      // First create the order
      const orderResult = await createOrder(orderData);
      
      if (!orderResult.success) {
        alert('Failed to create order: ' + orderResult.error);
        return;
      }
      
      // Then initiate Razorpay payment
      initiateRazorpayPayment(
        {
          orderId: orderResult.id,
          amount: grandTotal,
          customerName: customer?.name || 'Unknown',
          customerEmail: customer?.email || '',
          customerPhone: customer?.phone || ''
        },
        (response) => {
          // Payment success - update order status
          processPayment({
            orderId: orderResult.id,
            amount: grandTotal,
            method: 'Razorpay',
            provider: 'Razorpay',
            customerName: customer?.name || 'Unknown',
            transactionId: response.razorpay_payment_id,
            status: 'Success'
          });
          updatePaymentStatus(orderResult.id, 'paid', 'Razorpay');
          alert('Order created and payment successful!\nOrder ID: ' + orderResult.invoiceNumber + '\nPayment ID: ' + response.razorpay_payment_id);
          onSuccess();
        },
        (error) => {
          alert('Order created but payment failed: ' + (error?.error || 'Unknown error') + '\nYou can retry payment later.');
          onSuccess();
        }
      );
    } else {
      // For other payment methods, just create the order
      const result = await createOrder(orderData);
      if (result.success) {
        alert('Order created successfully!\nOrder ID: ' + result.invoiceNumber);
        onSuccess();
      } else {
        alert('Failed to create order: ' + result.error);
      }
    }
  };

  return (
    <div className="create-order">
      <h2>Create New Order</h2>

      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-section">
          <h3>Customer Information</h3>
          
          {/* Customer Selection with Add Button */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Customer *</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch' }}>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                className="form-control"
                required
                style={{ flex: 1 }}
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.email}
                  </option>
                ))}
              </select>
              <button 
                type="button" 
                onClick={() => setShowCustomerModal(true)}
                className="btn-add-customer"
                title="Add New Customer"
              >
                <UserPlus size={18} />
                <span>Add New</span>
              </button>
            </div>
          </div>

          {/* Store Selection */}
          <div className="form-row">
            <div className="form-group">
              <label>Store *</label>
              <select
                value={formData.storeId}
                onChange={(e) => setFormData({...formData, storeId: e.target.value})}
                className="form-control"
                required
              >
                <option value="">Select Store</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Shipping Address</label>
            <textarea
              value={formData.shippingAddress}
              onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
              className="form-control"
              rows="2"
              placeholder="Leave empty to use customer's default address"
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
              className="form-control"
            >
              <option value="Razorpay">Razorpay (UPI/Card/Wallet/NetBanking)</option>
              <option value="UPI">UPI - Direct</option>
              <option value="Card">Credit/Debit Card - Direct</option>
              <option value="Wallet">Wallet - Direct</option>
              <option value="Net Banking">Net Banking - Direct</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
            {formData.paymentMethod === 'Razorpay' && (
              <small style={{ color: '#6366f1', marginTop: '5px', display: 'block' }}>
                ✓ Secure payment gateway with multiple payment options
              </small>
            )}
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Order Items</h3>
            <button type="button" onClick={addItem} className="btn-add">
              <Plus size={16} />
              Add Item
            </button>
          </div>

          {orderItems.map((item, index) => (
            <div key={index} className="order-item">
              <div className="item-fields">
                <div className="form-group">
                  <label>Product</label>
                  <select
                    value={item.sku}
                    onChange={(e) => updateItem(index, 'sku', e.target.value)}
                    className="form-control"
                    required
                  >
                    <option value="">Select Product</option>
                    {inventory.map(product => (
                      <option key={product.id} value={product.sku}>
                        {product.productName} - ₹{product.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                    className="form-control"
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    value={item.price}
                    className="form-control"
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label>Subtotal</label>
                  <input
                    type="text"
                    value={`₹${(item.price * item.quantity).toFixed(2)}`}
                    className="form-control"
                    readOnly
                  />
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => removeItem(index)}
                className="btn-remove"
                title="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {orderItems.length === 0 && (
            <p className="empty-message">No items added. Click "Add Item" to start.</p>
          )}
        </div>

        {orderItems.length > 0 && (
          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%):</span>
              <span>₹{(calculateTotal() * 0.1).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Grand Total:</span>
              <span>₹{(calculateTotal() * 1.1).toFixed(2)}</span>
            </div>
          </div>
        )}

        <button type="submit" className="btn-submit">
          <ShoppingCart size={20} />
          Create Order
        </button>
      </form>

      {/* Add Customer Modal */}
      {showCustomerModal && (
        <div className="modal-overlay" onClick={() => setShowCustomerModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Customer</h3>
              <button 
                type="button" 
                className="modal-close" 
                onClick={() => setShowCustomerModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddCustomer} className="modal-form">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="form-control"
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  className="form-control"
                  placeholder="customer@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="form-control"
                  placeholder="+91 1234567890"
                  required
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  className="form-control"
                  rows="3"
                  placeholder="Enter full address"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowCustomerModal(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  <UserPlus size={18} />
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateOrder;




