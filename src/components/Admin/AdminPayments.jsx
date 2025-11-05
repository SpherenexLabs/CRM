import { useState } from 'react';
import usePaymentStore from '../../store/paymentStore';
import useInventoryStore from '../../store/inventoryStore';
import useOrderStore from '../../store/orderStore';
import { CreditCard, Search, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import './AdminPayments.css';

function AdminPayments() {
  const { payments } = usePaymentStore();
  const { stores } = useInventoryStore();
  const { orders } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStore, setFilterStore] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Get storeId from order
    const order = orders.find(o => o.id === payment.orderId);
    const paymentStoreId = order?.storeId;
    
    const matchesStore = filterStore === 'all' || paymentStoreId === filterStore;
    
    // Map status values
    const paymentStatus = payment.status === 'completed' ? 'success' : payment.status;
    const matchesStatus = filterStatus === 'all' || paymentStatus === filterStatus;

    return matchesSearch && matchesStore && matchesStatus;
  });

  const getStoreName = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const store = stores.find(s => s.id === order.storeId);
      return store?.name || 'N/A';
    }
    return 'N/A';
  };

  const totalAmount = filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const successfulPayments = filteredPayments.filter(p => p.status === 'completed' || p.status === 'success').length;
  const pendingPayments = filteredPayments.filter(p => p.status === 'pending').length;
  const failedPayments = filteredPayments.filter(p => p.status === 'failed').length;

  return (
    <div className="admin-payments-view">
      <div className="admin-payments-header">
        <div>
          <h1>All Payments</h1>
          <p>View payment transactions from all stores</p>
        </div>
      </div>

      <div className="payments-filters">
        <input
          type="text"
          placeholder="Search by order ID or customer name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select 
          value={filterStore} 
          onChange={(e) => setFilterStore(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Stores</option>
          {stores.map(store => (
            <option key={store.id} value={store.id}>{store.name}</option>
          ))}
        </select>

        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="payments-stats">
        <div className="stat-box">
          <DollarSign size={24} />
          <div>
            <span className="stat-label">Total Amount</span>
            <span className="stat-value">₹{totalAmount.toLocaleString()}</span>
          </div>
        </div>
        <div className="stat-box success">
          <CheckCircle size={24} />
          <div>
            <span className="stat-label">Successful</span>
            <span className="stat-value">{successfulPayments}</span>
          </div>
        </div>
        <div className="stat-box pending">
          <CreditCard size={24} />
          <div>
            <span className="stat-label">Pending</span>
            <span className="stat-value">{pendingPayments}</span>
          </div>
        </div>
        <div className="stat-box failed">
          <XCircle size={24} />
          <div>
            <span className="stat-label">Failed</span>
            <span className="stat-value">{failedPayments}</span>
          </div>
        </div>
      </div>

      <div className="payments-table-wrapper">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Order ID</th>
              <th>Store</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => {
              const paymentDate = payment.processedAt || payment.paymentDate || payment.createdAt;
              const paymentMethod = payment.method || payment.paymentMethod || 'N/A';
              const displayStatus = payment.status === 'completed' ? 'SUCCESS' : payment.status?.toUpperCase();
              
              return (
                <tr key={payment.id}>
                  <td className="transaction-id">{payment.transactionId || payment.id || 'N/A'}</td>
                  <td className="order-id">#{payment.orderId?.substring(0, 8)}</td>
                  <td>{getStoreName(payment.orderId)}</td>
                  <td>{payment.customerName}</td>
                  <td>{paymentDate ? new Date(paymentDate).toLocaleDateString() : 'Invalid Date'}</td>
                  <td>
                    <span className="payment-method">{paymentMethod}</span>
                  </td>
                  <td className="amount">₹{(payment.amount || 0).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${payment.status === 'completed' ? 'success' : payment.status?.toLowerCase()}`}>
                      {displayStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredPayments.length === 0 && (
          <div className="no-data">
            <CreditCard size={48} />
            <p>No payments found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPayments;
