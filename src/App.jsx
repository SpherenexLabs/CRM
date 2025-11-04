import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, CreditCard, Truck, Users, Menu, X, BarChart3, Brain, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Inventory from './components/Inventory/Inventory';
import Orders from './components/Orders/Orders';
import Payments from './components/Payments/Payments';
import Delivery from './components/Delivery/Delivery';
import CRM from './components/CRM/CRM';
import Analytics from './components/Analytics/Analytics';
import MLInsights from './components/MLInsights/MLInsights';
import Login from './components/Login/Login';
import useAuthStore from './store/authStore';
import useInventoryStore from './store/inventoryStore';
import useOrderStore from './store/orderStore';
import usePaymentStore from './store/paymentStore';
import useDeliveryStore from './store/deliveryStore';
import useCustomerStore from './store/customerStore';
import './App.css';

function Navigation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/inventory', icon: <Package size={20} />, label: 'Inventory' },
    { path: '/orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
    { path: '/payments', icon: <CreditCard size={20} />, label: 'Payments' },
    { path: '/delivery', icon: <Truck size={20} />, label: 'Delivery' },
    { path: '/crm', icon: <Users size={20} />, label: 'CRM' },
    { path: '/analytics', icon: <BarChart3 size={20} />, label: 'Sales Analytics' },
    { path: '/ml-insights', icon: <Brain size={20} />, label: 'ML Insights' },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      // Force reload to login page
      window.location.href = '/';
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <button 
        className="mobile-menu-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Multi-store CRM</h2>
          <p>Multi-Store Management</p>
          {user && (
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => {
                // Close sidebar on mobile after clicking a link
                if (window.innerWidth <= 768) {
                  setIsSidebarOpen(false);
                }
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          <p>&copy; 2025 Spherenex</p>
        </div>
      </aside>
    </>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  const { isAuthenticated } = useAuthStore();
  const initializeInventory = useInventoryStore(state => state.initializeInventory);
  const initializeOrders = useOrderStore(state => state.initializeOrders);
  const initializePayments = usePaymentStore(state => state.initializePayments);
  const initializeDelivery = useDeliveryStore(state => state.initializeDelivery);
  const initializeCustomers = useCustomerStore(state => state.initializeCustomers);
  const [showLogin, setShowLogin] = useState(!isAuthenticated);

  // Initialize ALL Firebase listeners when app loads
  useEffect(() => {
    if (isAuthenticated) {
      initializeInventory();
      initializeOrders();
      initializePayments();
      initializeDelivery();
      initializeCustomers();
    }
  }, [isAuthenticated, initializeInventory, initializeOrders, initializePayments, initializeDelivery, initializeCustomers]);

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  return (
    <Router>
      {showLogin ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="app-container">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
              <Route path="/delivery" element={<ProtectedRoute><Delivery /></ProtectedRoute>} />
              <Route path="/crm" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/ml-insights" element={<ProtectedRoute><MLInsights /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      )}
    </Router>
  );
}

export default App;
