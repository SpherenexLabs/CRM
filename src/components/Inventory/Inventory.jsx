import { useState } from 'react';
import { Package, AlertTriangle, TrendingUp, Store } from 'lucide-react';
import useInventoryStore from '../../store/inventoryStore';
import useAuthStore from '../../store/authStore';
import InventoryList from './InventoryList';
import StockAlerts from './StockAlerts';
import StockTransfer from './StockTransfer';
import StoreManagement from './StoreManagement';
import AddInventory from './AddInventory';
import './Inventory.css';

function Inventory() {
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedStore, setSelectedStore] = useState('all');
  
  const { 
    stores, 
    inventory, 
    getTotalInventoryValue, 
    getStockAlerts,
    getInventoryByStore 
  } = useInventoryStore();

  const stockAlerts = getStockAlerts();
  const totalValue = getTotalInventoryValue();

  const filteredInventory = selectedStore === 'all' 
    ? inventory 
    : getInventoryByStore(parseInt(selectedStore));

  const stats = [
    {
      title: 'Total Inventory Value',
      value: `₹${totalValue.toLocaleString()}`,
      icon: <TrendingUp className="stat-icon" />,
      color: 'blue'
    },
    {
      title: 'Total Items',
      value: inventory.length,
      icon: <Package className="stat-icon" />,
      color: 'green'
    },
    {
      title: 'Low Stock Alerts',
      value: stockAlerts.length,
      icon: <AlertTriangle className="stat-icon" />,
      color: 'red'
    },
    {
      title: 'Stores',
      value: stores.length,
      icon: <Store className="stat-icon" />,
      color: 'purple'
    }
  ];

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h1>Multi-Store Inventory Management</h1>
        <p>Centralized view of inventory across all branches</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-content">
              <div>
                <p className="stat-title">{stat.title}</p>
                <h2 className="stat-value">{stat.value}</h2>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="inventory-controls">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Inventory
          </button>
          <button 
            className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            Stock Alerts ({stockAlerts.length})
          </button>
          <button 
            className={`tab ${activeTab === 'transfer' ? 'active' : ''}`}
            onClick={() => setActiveTab('transfer')}
          >
            Transfer Stock
          </button>
          <button 
            className={`tab ${activeTab === 'stores' ? 'active' : ''}`}
            onClick={() => setActiveTab('stores')}
          >
            <Store size={16} /> Manage Stores
          </button>
        </div>

        {activeTab === 'all' && (
          <div className="filter-controls">
            <select 
              value={selectedStore} 
              onChange={(e) => setSelectedStore(e.target.value)}
              className="store-filter"
            >
              <option value="all">All Stores</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
            <AddInventory stores={stores} />
          </div>
        )}
      </div>

      <div className="inventory-content">
        {activeTab === 'all' && (
          <InventoryList inventory={filteredInventory} stores={stores} />
        )}
        {activeTab === 'alerts' && (
          <StockAlerts alerts={stockAlerts} stores={stores} />
        )}
        {activeTab === 'transfer' && (
          <StockTransfer stores={stores} />
        )}
        {activeTab === 'stores' && (
          <StoreManagement />
        )}
      </div>
    </div>
  );
}

export default Inventory;




