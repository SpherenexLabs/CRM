import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, ShoppingCart, Users, IndianRupee, Truck } from 'lucide-react';
import useInventoryStore from '../../store/inventoryStore';
import useOrderStore from '../../store/orderStore';
import useCustomerStore from '../../store/customerStore';
import useDeliveryStore from '../../store/deliveryStore';
import useAuthStore from '../../store/authStore';
import './Dashboard.css';

function Dashboard() {
  const { currentUser } = useAuthStore();
  const { inventory, getTotalInventoryValue, getStockAlerts } = useInventoryStore();
  const { orders: allOrders, getTotalRevenue } = useOrderStore();
  const { customers, getCustomerAnalytics } = useCustomerStore();
  const { deliveryTasks } = useDeliveryStore();

  // Filter orders based on user role
  const orders = currentUser?.role === 'Customer' 
    ? allOrders.filter(order => order.customerAccountId === currentUser.id)
    : allOrders;

  // Calculate totals based on filtered orders
  const totalRevenue = orders.reduce((sum, order) => {
    if (order.paymentStatus === 'paid') {
      return sum + (order.grandTotal || 0);
    }
    return sum;
  }, 0);

  const totalInventoryValue = getTotalInventoryValue();
  const stockAlerts = getStockAlerts();
  const customerAnalytics = getCustomerAnalytics();

  // Filter delivery tasks for customers
  const filteredDeliveryTasks = currentUser?.role === 'Customer'
    ? deliveryTasks.filter(task => {
        const order = allOrders.find(o => o.id === task.orderId);
        return order?.customerAccountId === currentUser.id;
      })
    : deliveryTasks;

  // Stats - same for everyone but with filtered data for customers
  const stats = [
    {
      title: currentUser?.role === 'Customer' ? 'Total Spent' : 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      change: currentUser?.role === 'Customer' ? '' : '+12.5%',
      icon: <IndianRupee className="stat-icon" />,
      color: 'green'
    },
    {
      title: 'Total Orders',
      value: orders.length,
      change: currentUser?.role === 'Customer' ? '' : '+8.2%',
      icon: <ShoppingCart className="stat-icon" />,
      color: 'blue'
    },
    {
      title: currentUser?.role === 'Customer' ? 'Customer Status' : 'Total Customers',
      value: currentUser?.role === 'Customer' ? 'Active' : customers.length,
      change: currentUser?.role === 'Customer' ? '' : '+5.7%',
      icon: <Users className="stat-icon" />,
      color: 'purple'
    },
    {
      title: 'Inventory Value',
      value: `₹${totalInventoryValue.toLocaleString()}`,
      change: currentUser?.role === 'Customer' ? '' : '+3.1%',
      icon: <Package className="stat-icon" />,
      color: 'orange'
    }
  ];

  // Calculate revenue by month from actual orders - show last 6 months
  const revenueData = (() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Get last 6 months
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      last6Months.push({ monthIndex, year, name: monthNames[monthIndex] });
    }
    
    // Calculate revenue for each month
    return last6Months.map(({ monthIndex, year, name }) => {
      const monthRevenue = orders
        .filter(order => {
          if (!order.orderDate) return false;
          const orderDate = new Date(order.orderDate);
          return orderDate.getMonth() === monthIndex && 
                 orderDate.getFullYear() === year &&
                 order.paymentStatus === 'paid';
        })
        .reduce((sum, order) => sum + (order.grandTotal || 0), 0);
      
      return {
        month: name,
        revenue: Math.round(monthRevenue)
      };
    });
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
        <p>Welcome to your INVENLYTICS System</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-content">
              <div>
                <p className="stat-title">{stat.title}</p>
                <h2 className="stat-value">{stat.value}</h2>
                {stat.change && <span className="stat-change">{stat.change} from last month</span>}
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card chart-card">
          <h3>{currentUser?.role === 'Customer' ? 'My Spending Trend (Last 6 Months)' : 'Revenue Trend (Last 6 Months)'}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value) => [`₹${value.toLocaleString()}`, currentUser?.role === 'Customer' ? 'Spent' : 'Revenue']}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
                name={currentUser?.role === 'Customer' ? 'Spent' : 'Revenue'}
              />
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
          <h3>{currentUser?.role === 'Customer' ? 'My Recent Orders' : 'Recent Orders'}</h3>
          <div className="recent-list">
            {recentOrders.length === 0 ? (
              <p className="empty-state">No orders yet</p>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="recent-item">
                  <div>
                    <p className="item-title">Order #{order.id}</p>
                    {currentUser?.role !== 'Customer' && <p className="item-subtitle">{order.customerName}</p>}
                  </div>
                  <div className="item-right">
                    <p>₹{order.grandTotal?.toFixed(2) || '0.00'}</p>
                    <span className={`status-badge status-${order.status === 'delivered' ? 'success' : 'warning'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
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
          <h3>{currentUser?.role === 'Customer' ? 'My Deliveries' : 'Active Deliveries'}</h3>
          <div className="delivery-stats">
            <div className="delivery-stat">
              <div className="delivery-icon">
                <Truck size={24} />
              </div>
              <div>
                <p className="stat-number">{filteredDeliveryTasks.filter(t => t.status === 'in-transit').length}</p>
                <p className="stat-label">In Transit</p>
              </div>
            </div>
            <div className="delivery-stat">
              <div className="delivery-icon">
                <Package size={24} />
              </div>
              <div>
                <p className="stat-number">{filteredDeliveryTasks.filter(t => t.status === 'assigned').length}</p>
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




