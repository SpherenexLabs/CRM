import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, ShoppingCart, Users, DollarSign, Truck } from 'lucide-react';
import useInventoryStore from '../../store/inventoryStore';
import useOrderStore from '../../store/orderStore';
import useCustomerStore from '../../store/customerStore';
import useDeliveryStore from '../../store/deliveryStore';
import './Dashboard.css';

function Dashboard() {
  const { inventory, getTotalInventoryValue, getStockAlerts } = useInventoryStore();
  const { orders, getTotalRevenue } = useOrderStore();
  const { customers, getCustomerAnalytics } = useCustomerStore();
  const { deliveryTasks } = useDeliveryStore();

  const totalInventoryValue = getTotalInventoryValue();
  const totalRevenue = getTotalRevenue();
  const stockAlerts = getStockAlerts();
  const customerAnalytics = getCustomerAnalytics();

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      icon: <DollarSign className="stat-icon" />,
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
      color: 'purple'
    },
    {
      title: 'Inventory Value',
      value: `₹${totalInventoryValue.toLocaleString()}`,
      change: '+3.1%',
      icon: <Package className="stat-icon" />,
      color: 'orange'
    }
  ];

  // Calculate revenue by month from actual orders
  const revenueData = (() => {
    const monthlyRevenue = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    orders.forEach(order => {
      if (order.orderDate) {
        const month = monthNames[new Date(order.orderDate).getMonth()];
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.totalAmount;
      }
    });

    return monthNames.map(month => ({
      month,
      revenue: monthlyRevenue[month] || 0
    })).filter(item => item.revenue > 0);
  })();

  // Order status distribution
  const orderStatusData = [
    { name: 'Placed', value: orders.filter(o => o.status === 'placed').length },
    { name: 'Shipped', value: orders.filter(o => o.status === 'shipped').length },
    { name: 'Delivered', value: orders.filter(o => o.status === 'delivered').length },
  ];

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981'];

  // Recent orders
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your Multi-Store CRM System</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-content">
              <div>
                <p className="stat-title">{stat.title}</p>
                <h2 className="stat-value">{stat.value}</h2>
                <span className="stat-change">{stat.change} from last month</span>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card chart-card">
          <h3>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card chart-card">
          <h3>Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card">
          <h3>Recent Orders</h3>
          <div className="recent-list">
            {recentOrders.map(order => (
              <div key={order.id} className="recent-item">
                <div>
                  <p className="item-title">Order #{order.id}</p>
                  <p className="item-subtitle">{order.customerName}</p>
                </div>
                <div className="item-right">
                  <p>₹{order.grandTotal.toFixed(2)}</p>
                  <span className={`status-badge status-${order.status === 'delivered' ? 'success' : 'warning'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Stock Alerts</h3>
          {stockAlerts.length === 0 ? (
            <p className="empty-state">No stock alerts</p>
          ) : (
            <div className="alert-list">
              {stockAlerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="alert-item">
                  <div>
                    <p className="item-title">{alert.productName}</p>
                    <p className="item-subtitle">{alert.sku}</p>
                  </div>
                  <div className="alert-badge">
                    <span>{alert.quantity} units</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <h3>Active Deliveries</h3>
          <div className="delivery-stats">
            <div className="delivery-stat">
              <div className="delivery-icon">
                <Truck size={24} />
              </div>
              <div>
                <p className="stat-number">{deliveryTasks.filter(t => t.status === 'in-transit').length}</p>
                <p className="stat-label">In Transit</p>
              </div>
            </div>
            <div className="delivery-stat">
              <div className="delivery-icon">
                <Package size={24} />
              </div>
              <div>
                <p className="stat-number">{deliveryTasks.filter(t => t.status === 'assigned').length}</p>
                <p className="stat-label">Assigned</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Customer Tiers</h3>
          <div className="tier-distribution">
            {Object.entries(customerAnalytics.tierDistribution).map(([tier, count]) => (
              <div key={tier} className="tier-row">
                <span className={`tier-label tier-${tier.toLowerCase()}`}>{tier}</span>
                <span className="tier-count">{count} customers</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;




