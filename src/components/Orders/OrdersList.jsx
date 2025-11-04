import { format } from 'date-fns';
import { Eye, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

function OrdersList({ orders, onSelectOrder }) {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return 'N/A';
      return format(dateObj, 'MMM dd, yyyy');
    } catch (error) {
      return 'N/A';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'placed': return <Package size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'delivered': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Package size={16} />;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'placed': return 'status-warning';
      case 'shipped': return 'status-info';
      case 'delivered': return 'status-success';
      case 'cancelled': return 'status-danger';
      default: return 'status-secondary';
    }
  };

  return (
    <div className="orders-list">
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td data-label="Order ID">#{order.id}</td>
                <td data-label="Invoice">{order.invoiceNumber}</td>
                <td data-label="Customer">{order.customerName}</td>
                <td data-label="Items">{order.items?.length || 0} item(s)</td>
                <td data-label="Amount">₹{(order.grandTotal || order.totalAmount || 0).toFixed(2)}</td>
                <td data-label="Status">
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </td>
                <td data-label="Payment">
                  <span className={`status-badge ${order.paymentStatus === 'paid' ? 'status-success' : 'status-warning'}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td data-label="Date">{formatDate(order.createdAt)}</td>
                <td data-label="Actions">
                  <button 
                    className="btn-icon btn-primary"
                    onClick={() => onSelectOrder(order)}
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersList;




