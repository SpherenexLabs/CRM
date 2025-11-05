import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, CreditCard, Store, Menu, X, LogOut, Users } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import AdminDashboard from './AdminDashboard';
import AdminStores from './AdminStores';
import AdminOrders from './AdminOrders';
import AdminInventory from './AdminInventory';
import AdminPayments from './AdminPayments';
import AdminCustomers from './AdminCustomers';
import './AdminCRM.css';

function AdminCRM() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { currentUser, logout } = useAuthStore();

  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
    { path: '/admin/inventory', icon: <Package size={20} />, label: 'Inventory' },
    { path: '/admin/payments', icon: <CreditCard size={20} />, label: 'Payments' },
    { path: '/admin/stores', icon: <Store size={20} />, label: 'Stores' },
    { path: '/admin/customers', icon: <Users size={20} />, label: 'Customers' },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      window.location.href = '/';
    }
  };

  return (
    <div className="admin-container">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="admin-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <button 
        className="admin-mobile-menu-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <p>Multi-Store Management</p>
          {currentUser && (
            <div className="admin-user-info">
              <span className="admin-user-name">{currentUser.name}</span>
              <span className="admin-user-role">{currentUser.role}</span>
            </div>
          )}
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => {
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

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          <p>&copy; 2025 Spherenex</p>
        </div>
      </aside>

      <main className="admin-main-content">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/inventory" element={<AdminInventory />} />
          <Route path="/payments" element={<AdminPayments />} />
          <Route path="/stores" element={<AdminStores />} />
          <Route path="/customers" element={<AdminCustomers />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminCRM;
