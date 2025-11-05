import { useState } from 'react';
import { CreditCard, IndianRupee, CheckCircle, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import usePaymentStore from '../../store/paymentStore';
import useOrderStore from '../../store/orderStore';
import useAuthStore from '../../store/authStore';
import { initiateRazorpayPayment } from '../../utils/razorpay';
import './Payments.css';

function Payments() {
  const { payments: allPayments, processPayment, getPaymentStats, paymentMethods, paymentProviders } = usePaymentStore();
  const { orders } = useOrderStore();
  const { currentUser } = useAuthStore();

  // Filter payments based on user role
  const payments = currentUser?.role === 'Customer' 
    ? allPayments.filter(payment => {
        const order = orders.find(o => o.id === payment.orderId);
        return order?.customerAccountId === currentUser.id;
      })
    : allPayments;

  // Calculate stats from filtered payments
  const stats = {
    totalTransactions: payments.length,
    totalAmount: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    successfulTransactions: payments.filter(p => p.status === 'Success' || p.status === 'completed').length,
    successRate: payments.length > 0 
      ? ((payments.filter(p => p.status === 'Success' || p.status === 'completed').length / payments.length) * 100).toFixed(1)
      : 0
  };

  const [showProcessForm, setShowProcessForm] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    amount: '',
    method: 'UPI',
    provider: 'Razorpay',
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.provider === 'Razorpay') {
      // Use Razorpay for payment
      await initiateRazorpayPayment(
        {
          orderId: formData.orderId,
          amount: parseFloat(formData.amount),
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone
        },
        (response) => {
          // Payment success callback
          const paymentData = {
            ...formData,
            amount: parseFloat(formData.amount),
            transactionId: response.razorpay_payment_id,
            status: 'Success'
          };
          processPayment(paymentData);
          alert('Payment processed successfully via Razorpay!\nPayment ID: ' + response.razorpay_payment_id);
          setShowProcessForm(false);
          setFormData({ orderId: '', amount: '', method: 'UPI', provider: 'Razorpay', customerName: '', customerEmail: '', customerPhone: '' });
        },
        (error) => {
          // Payment failure callback
          alert('Payment failed: ' + error.error);
        }
      );
    } else {
      // Direct payment processing (for other providers)
      processPayment({
        ...formData,
        amount: parseFloat(formData.amount),
        status: 'Success'
      });
      alert('Payment processed successfully!');
      setShowProcessForm(false);
      setFormData({ orderId: '', amount: '', method: 'UPI', provider: 'Razorpay', customerName: '', customerEmail: '', customerPhone: '' });
    }
  };

  const cardStats = [
    { title: 'Total Transactions', value: stats.totalTransactions, icon: <CreditCard />, color: 'blue' },
    { title: 'Total Amount', value: `₹${stats.totalAmount.toFixed(2)}`, icon: <IndianRupee />, color: 'green' },
    { title: 'Success Rate', value: `${stats.successRate}%`, icon: <CheckCircle />, color: 'purple' },
    { title: 'Successful', value: stats.successfulTransactions, icon: <TrendingUp />, color: 'orange' },
  ];

  return (
    <div className="payments-container">
      <div className="payments-header">
        <h1>Payment System</h1>
        <button onClick={() => setShowProcessForm(!showProcessForm)} className="btn-primary">
          {showProcessForm ? 'Cancel' : 'Process New Payment'}
        </button>
      </div>

      <div className="stats-grid">
        {cardStats.map((stat, idx) => (
          <div key={idx} className={`stat-card stat-${stat.color}`}>
            <div className="stat-content">
              <div>
                <p className="stat-title">{stat.title}</p>
                <h2 className="stat-value">{stat.value}</h2>
              </div>
              <div className="stat-icon">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {showProcessForm && (
        <div className="payment-form-container">
          <form onSubmit={handleSubmit} className="payment-form">
            <h3>Process Payment</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Order ID</label>
                <input type="number" value={formData.orderId} onChange={(e) => setFormData({...formData, orderId: e.target.value})} className="form-control" required />
              </div>
              <div className="form-group">
                <label>Customer Name</label>
                <input type="text" value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} className="form-control" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Customer Email</label>
                <input type="email" value={formData.customerEmail} onChange={(e) => setFormData({...formData, customerEmail: e.target.value})} className="form-control" placeholder="customer@example.com" />
              </div>
              <div className="form-group">
                <label>Customer Phone</label>
                <input type="tel" value={formData.customerPhone} onChange={(e) => setFormData({...formData, customerPhone: e.target.value})} className="form-control" placeholder="+91 1234567890" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Amount (₹)</label>
                <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="form-control" required />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select value={formData.method} onChange={(e) => setFormData({...formData, method: e.target.value})} className="form-control">
                  {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Provider</label>
                <select value={formData.provider} onChange={(e) => setFormData({...formData, provider: e.target.value})} className="form-control">
                  {paymentProviders.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="btn-submit">
              {formData.provider === 'Razorpay' ? 'Pay with Razorpay' : 'Process Payment'}
            </button>
          </form>
        </div>
      )}

      <div className="payments-table-container">
        <h3>Payment History</h3>
        <table className="payments-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Provider</th>
              <th>Transaction ID</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id}>
                <td data-label="Payment ID">{payment.id}</td>
                <td data-label="Order ID">#{payment.orderId}</td>
                <td data-label="Customer">{payment.customerName}</td>
                <td data-label="Amount">₹{payment.amount.toFixed(2)}</td>
                <td data-label="Method">{payment.method}</td>
                <td data-label="Provider">{payment.provider}</td>
                <td data-label="Transaction ID">{payment.transactionId}</td>
                <td data-label="Status"><span className={`status-badge status-${payment.status === 'success' ? 'success' : 'danger'}`}>{payment.status}</span></td>
                <td data-label="Date">{format(payment.timestamp, 'MMM dd, yyyy HH:mm')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Payments;




