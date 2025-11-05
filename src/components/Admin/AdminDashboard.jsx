import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, ShoppingCart, Users, IndianRupee, Store } from 'lucide-react';
import useInventoryStore from '../../store/inventoryStore';
import useOrderStore from '../../store/orderStore';
import useCustomerStore from '../../store/customerStore';
import './AdminDashboard.css';

function AdminDashboard() {
  const { inventory, stores, getTotalInventoryValue } = useInventoryStore();
  const { orders, getTotalRevenue } = useOrderStore();
  const { customers } = useCustomerStore();

  const totalInventoryValue = getTotalInventoryValue();
  const totalRevenue = getTotalRevenue();

  // Calculate stats across all stores
  const stats = [
    {
      title: 'Total Stores',
      value: stores.length,
      change: '+2 new',
      icon: <Store className="stat-icon" />,
      color: 'purple'
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      icon: <IndianRupee className="stat-icon" />,
      color: 'green'
    },
    {
      title: 'Total Orders',
      value: orders.length,
      change: '+8.2%',
      icon: <ShoppingCart className="stat-icon" />,
      color: 'blue'
    },
    {
      title: 'Total Customers',
      value: customers.length,
      change: '+5.7%',
      icon: <Users className="stat-icon" />,
      color: 'orange'
    },
    {
      title: 'Total Products',
      value: inventory.length,
      change: '+15 items',
      icon: <Package className="stat-icon" />,
      color: 'teal'
    },
    {
      title: 'Inventory Value',
      value: `₹${totalInventoryValue.toLocaleString()}`,
      change: '+3.1%',
      icon: <TrendingUp className="stat-icon" />,
      color: 'indigo'
    }
  ];

  // Store-wise revenue data
  const storeRevenueData = stores.map(store => {
    const storeOrders = orders.filter(order => order.storeId === store.id);
    const revenue = storeOrders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + (order.grandTotal || order.totalAmount || 0), 0);
    return {
      name: store.name,
      revenue: Math.round(revenue),
      orders: storeOrders.length
    };
  });

  // Store-wise inventory data
  const storeInventoryData = stores.map(store => {
    const storeInventory = inventory.filter(item => item.storeId === store.id);
    const totalValue = storeInventory.reduce((sum, item) => sum + (item.price * item.stock), 0);
    return {
      name: store.name,
      products: storeInventory.length,
      value: Math.round(totalValue)
    };
  });

  // Order status distribution - use actual status values
  const orderStatusData = [
    { name: 'Placed', value: orders.filter(o => o.status === 'placed').length, color: '#f59e0b' },
    { name: 'Shipped', value: orders.filter(o => o.status === 'shipped').length, color: '#3b82f6' },
    { name: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: '#10b981' },
    { name: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, color: '#ef4444' }
  ].filter(item => item.value > 0); // Only show statuses with data

  // Recent orders (last 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of all stores and operations</p>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`admin-stat-card ${stat.color}`}>
            <div className="stat-content">
              <div className="stat-header">
                <span className="stat-title">{stat.title}</span>
                {stat.icon}
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-change">{stat.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="admin-charts-section">
        {/* Store Revenue Chart */}
        <div className="admin-chart-card">
          <h3>Store-wise Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={storeRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#667eea" name="Revenue (₹)" />
              <Bar dataKey="orders" fill="#764ba2" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Store Inventory Chart */}
        <div className="admin-chart-card">
          <h3>Store-wise Inventory</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={storeInventoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="products" fill="#f093fb" name="Products" />
              <Bar dataKey="value" fill="#f5576c" name="Value (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Status and Recent Orders */}
      <div className="admin-bottom-section">
        {/* Order Status Pie Chart */}
        <div className="admin-chart-card">
          <h3>Order Status Distribution</h3>
          {orderStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">
              <ShoppingCart size={48} />
              <p>No orders available</p>
            </div>
          )}
        </div>

        {/* Recent Orders Table */}
        <div className="admin-chart-card">
          <h3>Recent Orders</h3>
          {recentOrders.length > 0 ? (
            <div className="recent-orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Store</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => {
                    const store = stores.find(s => s.id === order.storeId);
                    const orderAmount = order.grandTotal || order.totalAmount || 0;
                    return (
                      <tr key={order.id}>
                        <td>#{order.id?.substring(0, 8)}</td>
                        <td>{order.customerName}</td>
                        <td>{store?.name || 'N/A'}</td>
                        <td>₹{orderAmount.toLocaleString()}</td>
                        <td>
                          <span className={`status-badge ${order.status?.toLowerCase()}`}>
                            {order.status?.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">
              <ShoppingCart size={48} />
              <p>No recent orders</p>
            </div>
          )}
        </div>
      </div>

      {/* Stores Overview */}
      <div className="stores-overview">
        <h3>Stores Overview</h3>
        <div className="stores-grid">
          {stores.map(store => {
            const storeInventory = inventory.filter(item => item.storeId === store.id);
            const storeOrders = orders.filter(order => order.storeId === store.id);
            const storeRevenue = storeOrders
              .filter(order => order.paymentStatus === 'paid')
              .reduce((sum, order) => sum + (order.grandTotal || order.totalAmount || 0), 0);

            return (
              <div key={store.id} className="store-overview-card">
                <h4>{store.name}</h4>
                <p className="store-location">{store.location}</p>
                <div className="store-stats">
                  <div className="store-stat">
                    <Package size={18} />
                    <span>{storeInventory.length} Products</span>
                  </div>
                  <div className="store-stat">
                    <ShoppingCart size={18} />
                    <span>{storeOrders.length} Orders</span>
                  </div>
                  <div className="store-stat">
                    <IndianRupee size={18} />
                    <span>₹{storeRevenue.toLocaleString()}</span>
                  </div>
                </div>
                <p className="store-contact">Contact: {store.contactPerson}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
