import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { Users, Search, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import './AdminCustomers.css';

function AdminCustomers() {
  const { customers, initializeCustomers, deleteCustomer } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    initializeCustomers();
  }, [initializeCustomers]);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && customer.isActive) ||
      (filterStatus === 'inactive' && !customer.isActive);

    return matchesSearch && matchesStatus;
  });

  const handleDeleteCustomer = async (customerId, customerName) => {
    if (window.confirm(`Are you sure you want to delete customer "${customerName}"? They will not be able to login anymore.`)) {
      const result = await deleteCustomer(customerId);
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    }
  };

  return (
    <div className="admin-customers-view">
      <div className="admin-customers-header">
        <div>
          <h1>Customer Accounts</h1>
          <p>Manage registered customer accounts</p>
        </div>
      </div>

      <div className="customers-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="customers-stats">
        <div className="stat-box">
          <Users size={24} />
          <div>
            <span className="stat-label">Total Customers</span>
            <span className="stat-value">{customers.length}</span>
          </div>
        </div>
        <div className="stat-box success">
          <Users size={24} />
          <div>
            <span className="stat-label">Active</span>
            <span className="stat-value">{customers.filter(c => c.isActive).length}</span>
          </div>
        </div>
        <div className="stat-box failed">
          <Users size={24} />
          <div>
            <span className="stat-label">Inactive</span>
            <span className="stat-value">{customers.filter(c => !c.isActive).length}</span>
          </div>
        </div>
      </div>

      <div className="customers-table-wrapper">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Registered Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.id}>
                <td className="customer-name">
                  <div className="customer-info">
                    <strong>{customer.name}</strong>
                  </div>
                </td>
                <td>
                  <div className="email-cell">
                    <Mail size={16} />
                    <span>{customer.email}</span>
                  </div>
                </td>
                <td>
                  <div className="phone-cell">
                    <Phone size={16} />
                    <span>{customer.phone || 'N/A'}</span>
                  </div>
                </td>
                <td>
                  <div className="date-cell">
                    <Calendar size={16} />
                    <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${customer.isActive ? 'success' : 'inactive'}`}>
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                    className="btn-delete"
                    title="Delete customer account"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCustomers.length === 0 && (
          <div className="no-data">
            <Users size={48} />
            <p>No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCustomers;
