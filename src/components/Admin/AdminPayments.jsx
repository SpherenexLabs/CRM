import { useState } from 'react';
import usePaymentStore from '../../store/paymentStore';
import useInventoryStore from '../../store/inventoryStore';
import { CreditCard, Search, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import './AdminPayments.css';

function AdminPayments() {
  const { payments } = usePaymentStore();
  const { stores } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStore, setFilterStore] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStore = filterStore === 'all' || payment.storeId === filterStore;
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;

    return matchesSearch && matchesStore && matchesStatus;
  });

  const getStoreName = (storeId) => {
    const store = stores.find(s => s.id === storeId);
    return store?.name || 'N/A';
  };

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const successfulPayments = filteredPayments.filter(p => p.status === 'Success').length;
  const pendingPayments = filteredPayments.filter(p => p.status === 'Pending').length;
  const failedPayments = filteredPayments.filter(p => p.status === 'Failed').length;

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
          <option value="Success">Success</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
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
            {filteredPayments.map(payment => (
              <tr key={payment.id}>
                <td className="transaction-id">{payment.transactionId || 'N/A'}</td>
                <td className="order-id">#{payment.orderId?.substring(0, 8)}</td>
                <td>{getStoreName(payment.storeId)}</td>
                <td>{payment.customerName}</td>
                <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                <td>
                  <span className="payment-method">{payment.paymentMethod}</span>
                </td>
                <td className="amount">₹{payment.amount?.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${payment.status?.toLowerCase()}`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
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
