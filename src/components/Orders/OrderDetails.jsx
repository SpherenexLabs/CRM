import { format } from 'date-fns';
import { X, Package, DollarSign, MapPin, CreditCard, FileText } from 'lucide-react';
import useOrderStore from '../../store/orderStore';

function OrderDetails({ order, onClose }) {
  const { updateOrderStatus, updatePaymentStatus, cancelOrder } = useOrderStore();

  const formatDate = (date, formatStr = 'MMM dd, yyyy HH:mm') => {
    if (!date) return 'N/A';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return 'N/A';
      return format(dateObj, formatStr);
    } catch (error) {
      return 'N/A';
    }
  };

  const handleStatusUpdate = (newStatus) => {
    if (window.confirm(`Update order status to "${newStatus}"?`)) {
      updateOrderStatus(order.id, newStatus);
      onClose();
    }
  };

  const handlePaymentUpdate = () => {
    if (order.paymentStatus !== 'paid') {
      updatePaymentStatus(order.id, 'paid', order.paymentMethod);
      alert('Payment marked as paid');
      onClose();
    }
  };

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(order.id);
      onClose();
    }
  };

  return (
    <div className="order-details">
      <div className="details-header">
        <div>
          <h2>Order #{order.id}</h2>
          <p>{order.invoiceNumber}</p>
        </div>
        <button onClick={onClose} className="btn-close">
          <X size={24} />
        </button>
      </div>

      <div className="details-grid">
        <div className="details-section">
          <h3><Package size={20} /> Order Information</h3>
          <div className="info-rows">
            <div className="info-row">
              <span className="label">Order Date:</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            {order.shippedAt && (
              <div className="info-row">
                <span className="label">Shipped Date:</span>
                <span>{formatDate(order.shippedAt)}</span>
              </div>
            )}
            {order.deliveredAt && (
              <div className="info-row">
                <span className="label">Delivered Date:</span>
                <span>{formatDate(order.deliveredAt)}</span>
              </div>
            )}
            <div className="info-row">
              <span className="label">Status:</span>
              <span className={`status-badge status-${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h3><DollarSign size={20} /> Payment Information</h3>
          <div className="info-rows">
            <div className="info-row">
              <span className="label">Payment Method:</span>
              <span>{order.paymentMethod}</span>
            </div>
            <div className="info-row">
              <span className="label">Payment Status:</span>
              <span className={`status-badge ${order.paymentStatus === 'paid' ? 'status-success' : 'status-warning'}`}>
                {order.paymentStatus}
              </span>
            </div>
            {order.paidAt && (
              <div className="info-row">
                <span className="label">Paid At:</span>
                <span>{formatDate(order.paidAt)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="details-section">
          <h3><MapPin size={20} /> Customer & Delivery</h3>
          <div className="info-rows">
            <div className="info-row">
              <span className="label">Customer:</span>
              <span>{order.customerName}</span>
            </div>
            <div className="info-row">
              <span className="label">Shipping Address:</span>
              <span>{order.shippingAddress}</span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h3><FileText size={20} /> Invoice Details</h3>
          <div className="info-rows">
            <div className="info-row">
              <span className="label">Subtotal:</span>
              <span>₹{(order.totalAmount || 0).toFixed(2)}</span>
            </div>
            <div className="info-row">
              <span className="label">Tax (10%):</span>
              <span>₹{(order.tax || (order.totalAmount || 0) * 0.1).toFixed(2)}</span>
            </div>
            <div className="info-row total-row">
              <span className="label">Grand Total:</span>
              <span>₹{(order.grandTotal || (order.totalAmount || 0) * 1.1).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="items-section">
        <h3>Order Items</h3>
        <table className="items-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, index) => (
              <tr key={index}>
                <td>{item.sku || 'N/A'}</td>
                <td>{item.productName || 'N/A'}</td>
                <td>{item.quantity || 0}</td>
                <td>₹{(item.price || 0).toFixed(2)}</td>
                <td>₹{((item.quantity || 0) * (item.price || 0)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="details-actions">
        {order.status === 'placed' && (
          <button 
            onClick={() => handleStatusUpdate('shipped')}
            className="btn-action btn-primary"
          >
            Mark as Shipped
          </button>
        )}
        {order.status === 'shipped' && (
          <button 
            onClick={() => handleStatusUpdate('delivered')}
            className="btn-action btn-success"
          >
            Mark as Delivered
          </button>
        )}
        {order.paymentStatus !== 'paid' && (
          <button 
            onClick={handlePaymentUpdate}
            className="btn-action btn-success"
          >
            Mark Payment as Paid
          </button>
        )}
        {order.status !== 'cancelled' && order.status !== 'delivered' && (
          <button 
            onClick={handleCancelOrder}
            className="btn-action btn-danger"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;




