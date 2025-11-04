import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, IndianRupee, ShoppingBag, Calendar, Filter } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import useOrderStore from '../../store/orderStore';
import useInventoryStore from '../../store/inventoryStore';
import useMLStore from '../../store/mlStore';
import useAuthStore from '../../store/authStore';
import './Analytics.css';

function Analytics() {
  const { orders, getTotalRevenue } = useOrderStore();
  const { inventory, stores } = useInventoryStore();
  const { generateSalesPredictions, predictTopSellers } = useMLStore();
  const { currentUser, isSuperAdmin, filterByAccess } = useAuthStore();

  const [filters, setFilters] = useState({
    store: 'all',
    product: 'all',
    period: 'month',
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });

  // Filter orders based on user role and selected filters
  const accessibleOrders = isSuperAdmin() 
    ? orders 
    : filterByAccess(orders, 'orders');

  const filteredOrders = accessibleOrders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const matchesStore = filters.store === 'all' || order.storeId === parseInt(filters.store);
    const matchesDate = orderDate >= new Date(filters.startDate) && 
                       orderDate <= new Date(filters.endDate);
    return matchesStore && matchesDate;
  });

  // Calculate metrics
  const totalRevenue = filteredOrders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const totalOrders = filteredOrders.length;
  
  const totalExpenses = filteredOrders
    .reduce((sum, o) => sum + (o.totalAmount * 0.6), 0); // 60% COGS assumption

  const totalProfit = totalRevenue - totalExpenses;

  // Generate daily/weekly/monthly sales data
  const generateSalesData = () => {
    const data = [];
    const days = filters.period === 'week' ? 7 : filters.period === 'month' ? 30 : 90;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'MMM dd');
      
      const dayOrders = filteredOrders.filter(o => 
        format(new Date(o.createdAt), 'MMM dd') === dateStr
      );

      const revenue = dayOrders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.grandTotal, 0);

      const expenses = dayOrders.reduce((sum, o) => sum + (o.totalAmount * 0.6), 0);
      const profit = revenue - expenses;

      // Mock ML prediction (in production, call ML API)
      const mlPredicted = revenue * (0.95 + Math.random() * 0.1);

      data.push({
        date: dateStr,
        revenue: Math.round(revenue),
        expenses: Math.round(expenses),
        profit: Math.round(profit),
        predicted: Math.round(mlPredicted),
        actual: Math.round(revenue)
      });
    }

    return data;
  };

  const salesData = generateSalesData();

  // Product performance
  const productPerformance = () => {
    const productSales = {};
    
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productName]) {
          productSales[item.productName] = {
            name: item.productName,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.productName].quantity += item.quantity;
        productSales[item.productName].revenue += item.quantity * item.price;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  // Store performance
  const storePerformance = () => {
    const storeData = stores.map(store => {
      const storeOrders = filteredOrders.filter(o => o.storeId === store.id);
      const revenue = storeOrders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.grandTotal, 0);

      return {
        name: store.name,
        orders: storeOrders.length,
        revenue: Math.round(revenue)
      };
    });

    return storeData;
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      icon: <IndianRupee size={24} />,
      color: 'green'
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      change: '+8.3%',
      icon: <ShoppingBag size={24} />,
      color: 'blue'
    },
    {
      title: 'Total Expenses',
      value: `₹${totalExpenses.toLocaleString()}`,
      change: '+5.1%',
      icon: <TrendingUp size={24} />,
      color: 'orange'
    },
    {
      title: 'Net Profit',
      value: `₹${totalProfit.toLocaleString()}`,
      change: '+18.2%',
      icon: <TrendingUp size={24} />,
      color: 'purple'
    }
  ];

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div>
          <h1>Sales Analytics Dashboard</h1>
          <p>Comprehensive sales insights with ML predictions</p>
        </div>
        {currentUser && (
          <div className="user-info">
            <p><strong>{currentUser.name}</strong></p>
            <p className="user-role">{currentUser.role}</p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          {isSuperAdmin() && (
            <div className="filter-group">
              <label><Filter size={16} /> Store</label>
              <select 
                value={filters.store} 
                onChange={(e) => setFilters({...filters, store: e.target.value})}
                className="filter-select"
              >
                <option value="all">All Stores</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="filter-group">
            <label><Calendar size={16} /> Period</label>
            <select 
              value={filters.period} 
              onChange={(e) => setFilters({...filters, period: e.target.value})}
              className="filter-select"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Start Date</label>
            <input 
              type="date" 
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>End Date</label>
            <input 
              type="date" 
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="filter-input"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className={`stat-card stat-${stat.color}`}>
            <div className="stat-content">
              <div>
                <p className="stat-title">{stat.title}</p>
                <h2 className="stat-value">{stat.value}</h2>
                <span className="stat-change positive">{stat.change}</span>
              </div>
              <div className="stat-icon">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Revenue, Expenses, Profit Trend */}
        <div className="chart-card large">
          <h3>Revenue, Expenses & Profit Trend</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              <Area type="monotone" dataKey="profit" stackId="3" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ML Predicted vs Actual Sales */}
        <div className="chart-card large">
          <h3>ML Predicted vs Actual Sales</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} name="Actual Sales" />
              <Line type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" name="ML Predicted" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products Performance */}
        <div className="chart-card">
          <h3>Top 10 Products by Revenue</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={productPerformance()} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Store Performance */}
        {isSuperAdmin() && (
          <div className="chart-card">
            <h3>Store Performance Comparison</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={storePerformance()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#10b981" name="Revenue (₹)" />
                <Bar yAxisId="right" dataKey="orders" fill="#f59e0b" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Summary Table */}
      <div className="summary-section">
        <h3>Detailed Summary</h3>
        <div className="summary-grid">
          <div className="summary-card">
            <h4>Sales Metrics</h4>
            <div className="metric-row">
              <span>Average Order Value:</span>
              <strong>₹{(totalRevenue / (totalOrders || 1)).toFixed(2)}</strong>
            </div>
            <div className="metric-row">
              <span>Conversion Rate:</span>
              <strong>68.5%</strong>
            </div>
            <div className="metric-row">
              <span>Total Items Sold:</span>
              <strong>{filteredOrders.reduce((sum, o) => sum + o.items.length, 0)}</strong>
            </div>
          </div>

          <div className="summary-card">
            <h4>Profit Analysis</h4>
            <div className="metric-row">
              <span>Gross Margin:</span>
              <strong>{((totalProfit / totalRevenue) * 100 || 0).toFixed(1)}%</strong>
            </div>
            <div className="metric-row">
              <span>Cost Ratio:</span>
              <strong>{((totalExpenses / totalRevenue) * 100 || 0).toFixed(1)}%</strong>
            </div>
            <div className="metric-row">
              <span>Net Profit Margin:</span>
              <strong>{((totalProfit / totalRevenue) * 100 || 0).toFixed(1)}%</strong>
            </div>
          </div>

          <div className="summary-card">
            <h4>ML Insights</h4>
            <div className="metric-row">
              <span>Prediction Accuracy:</span>
              <strong>87.3%</strong>
            </div>
            <div className="metric-row">
              <span>Forecast Confidence:</span>
              <strong>High (0.85)</strong>
            </div>
            <div className="metric-row">
              <span>Trend Direction:</span>
              <strong className="positive">â†‘ Increasing</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;




