import { useEffect, useState } from 'react';
import useOrderStore from '../../store/orderStore';
import useInventoryStore from '../../store/inventoryStore';
import { Package, ShoppingCart, Calendar, DollarSign, User, MapPin, Phone } from 'lucide-react';
import './AdminOrders.css';

function AdminOrders() {
  const { orders } = useOrderStore();
  const { stores } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStore, setFilterStore] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesStore = filterStore === 'all' || order.storeId === filterStore;

    return matchesSearch && matchesStatus && matchesStore;
  });

  const getStoreName = (storeId) => {
    const store = stores.find(s => s.id === storeId);
    return store?.name || 'N/A';
  };

  return (
    <div className="admin-orders-view">
      <div className="admin-orders-header">
        <div>
          <h1>All Orders</h1>
          <p>View orders from all stores</p>
        </div>
      </div>

      <div className="orders-filters">
        <input
          type="text"
          placeholder="Search by customer name or order ID..."
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
          <option value="placed">Placed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="orders-stats">
        <div className="stat-box">
          <ShoppingCart size={24} />
          <div>
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{filteredOrders.length}</span>
          </div>
        </div>
        <div className="stat-box">
          <DollarSign size={24} />
          <div>
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">₹{filteredOrders
              .filter(o => o.paymentStatus === 'paid')
              .reduce((sum, o) => sum + (o.grandTotal || o.totalAmount || 0), 0)
              .toLocaleString()}</span>
          </div>
        </div>
        <div className="stat-box pending">
          <Package size={24} />
          <div>
            <span className="stat-label">Pending</span>
            <span className="stat-value">{orders.filter(o => o.status === 'placed').length}</span>
          </div>
        </div>
        <div className="stat-box success">
          <Package size={24} />
          <div>
            <span className="stat-label">Delivered</span>
            <span className="stat-value">{orders.filter(o => o.status === 'delivered').length}</span>
          </div>
        </div>
      </div>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Store</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td className="order-id">#{order.id?.substring(0, 8)}</td>
                <td>{getStoreName(order.storeId)}</td>
                <td>
                  <div className="customer-info">
                    <strong>{order.customerName}</strong>
                    {order.customerPhone && (
                      <small>{order.customerPhone}</small>
                    )}
                  </div>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.items?.length || 0} items</td>
                <td className="amount">₹{(order.grandTotal || order.totalAmount || 0).toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${order.status?.toLowerCase()}`}>
                    {order.status?.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="no-data">
            <ShoppingCart size={48} />
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
