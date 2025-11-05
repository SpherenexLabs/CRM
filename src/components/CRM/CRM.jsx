import { useState } from 'react';
import { Users, Star, TrendingUp, Award, ThumbsUp } from 'lucide-react';
import { format } from 'date-fns';
import useCustomerStore from '../../store/customerStore';
import useOrderStore from '../../store/orderStore';
import useAuthStore from '../../store/authStore';
import './CRM.css';

function CRM() {
  const { currentUser } = useAuthStore();
  const { customers: allCustomers, getCustomerAnalytics, getRecommendations, getChurnRisk, addFeedback } = useCustomerStore();
  const { orders } = useOrderStore();
  const [activeTab, setActiveTab] = useState('customers');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Filter customers - if customer user, find their CRM profile
  // For customer users, show only customers who have placed orders matching their customerAccountId
  const customers = currentUser?.role === 'Customer'
    ? allCustomers.filter(customer => {
        // Check if this CRM customer has orders from this account
        return orders.some(order => 
          order.customerId === customer.id && 
          order.customerAccountId === currentUser.id
        );
      })
    : allCustomers;

  // Calculate analytics based on filtered customers
  const analytics = currentUser?.role === 'Customer'
    ? customers.length > 0
      ? {
          totalCustomers: customers.length,
          averageSpent: customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / customers.length,
          totalRevenue: customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0),
          avgFeedbackRating: customers.reduce((sum, c) => {
            const feedbacks = c.feedback || [];
            const avgRating = feedbacks.length > 0 
              ? feedbacks.reduce((s, f) => s + (f.rating || 0), 0) / feedbacks.length 
              : 0;
            return sum + avgRating;
          }, 0) / customers.length
        }
      : {
          totalCustomers: 0,
          averageSpent: 0,
          totalRevenue: 0,
          avgFeedbackRating: 0
        }
    : getCustomerAnalytics();

  const stats = [
    { 
      title: currentUser?.role === 'Customer' ? 'My Profile' : 'Total Customers', 
      value: currentUser?.role === 'Customer' ? (customers.length > 0 ? '1' : '0') : analytics.totalCustomers, 
      icon: <Users />, 
      color: 'blue' 
    },
    { 
      title: currentUser?.role === 'Customer' ? 'Total Spent' : 'Avg Spent', 
      value: `₹${(currentUser?.role === 'Customer' ? analytics.totalRevenue : analytics.averageSpent || 0).toFixed(2)}`, 
      icon: <TrendingUp />, 
      color: 'green' 
    },
    { 
      title: currentUser?.role === 'Customer' ? 'My Revenue' : 'Total Revenue', 
      value: `₹${(analytics.totalRevenue || 0).toFixed(2)}`, 
      icon: <Award />, 
      color: 'purple' 
    },
    { 
      title: 'Avg Rating', 
      value: (analytics.avgFeedbackRating || 0).toFixed(1), 
      icon: <Star />, 
      color: 'orange' 
    },
  ];

  return (
    <div className="crm-container">
      <h1>Customer Relationship Management</h1>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
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

      <div className="tabs">
        <button className={`tab ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
          {currentUser?.role === 'Customer' ? 'My Profile' : 'All Customers'}
        </button>
        <button className={`tab ${activeTab === 'loyalty' ? 'active' : ''}`} onClick={() => setActiveTab('loyalty')}>Loyalty Program</button>
        <button className={`tab ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>Feedback</button>
        <button className={`tab ${activeTab === 'churn' ? 'active' : ''}`} onClick={() => setActiveTab('churn')}>Churn Analysis</button>
      </div>

      {activeTab === 'customers' && (
        <div className="table-container">
          {customers.length === 0 && currentUser?.role === 'Customer' ? (
            <div className="empty-state" style={{padding: '3rem', textAlign: 'center'}}>
              <p style={{fontSize: '1.1rem', color: '#666'}}>
                No customer profile found. Your profile will be created automatically when you place your first order.
              </p>
            </div>
          ) : (
            <table className="crm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Tier</th>
                <th>Total Purchases</th>
                <th>Total Spent</th>
                <th>Loyalty Points</th>
                <th>Last Purchase</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id} onClick={() => setSelectedCustomer(customer)} style={{cursor: 'pointer'}}>
                  <td data-label="Name">{customer.name}</td>
                  <td data-label="Email">{customer.email}</td>
                  <td data-label="Phone">{customer.phone}</td>
                  <td data-label="Tier"><span className={`tier-badge tier-${customer.tier.toLowerCase()}`}>{customer.tier}</span></td>
                  <td data-label="Total Purchases">{customer.totalPurchases || 0}</td>
                  <td data-label="Total Spent">₹{(customer.totalSpent || 0).toFixed(2)}</td>
                  <td data-label="Loyalty Points">{customer.loyaltyPoints || 0}</td>
                  <td data-label="Last Purchase">{customer.lastPurchase ? format(customer.lastPurchase, 'MMM dd, yyyy') : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      )}

      {activeTab === 'loyalty' && (
        <div className="loyalty-container">
          <h3>Loyalty Tiers Distribution</h3>
          <div className="tier-stats">
            {Object.entries(analytics.tierDistribution).map(([tier, count]) => (
              <div key={tier} className={`tier-card tier-${tier.toLowerCase()}`}>
                <h4>{tier}</h4>
                <p className="tier-count">{count} customers</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="feedback-container">
          <h3>Customer Feedback</h3>
          {customers.flatMap(c => c.feedback.map(f => ({...f, customerName: c.name, customerId: c.id}))).map((feedback, idx) => (
            <div key={idx} className="feedback-card">
              <div className="feedback-header">
                <h4>{feedback.customerName}</h4>
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < feedback.rating ? '#facc15' : 'none'} stroke={i < feedback.rating ? '#facc15' : '#d1d5db'} />
                  ))}
                </div>
              </div>
              <p>{feedback.comment}</p>
              <small>{format(feedback.date, 'MMM dd, yyyy')}</small>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'churn' && (
        <div className="churn-container">
          <h3>Churn Risk Analysis</h3>
          {customers.map(c => {
            const risk = getChurnRisk(c.id);
            return (
              <div key={c.id} className={`churn-card risk-${risk.riskLevel}`}>
                <div className="churn-info">
                  <h4>{risk.name}</h4>
                  <p><strong>Risk Level:</strong> <span className={`risk-badge risk-${risk.riskLevel}`}>{risk.riskLevel.toUpperCase()}</span></p>
                  <p><strong>Days Since Last Purchase:</strong> {risk.daysSinceLastPurchase}</p>
                  <p><strong>Recommendation:</strong> {risk.recommendation}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CRM;




