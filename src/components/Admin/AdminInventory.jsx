import { useState } from 'react';
import useInventoryStore from '../../store/inventoryStore';
import { Package, Search, TrendingDown } from 'lucide-react';
import './AdminInventory.css';

function AdminInventory() {
  const { inventory, stores } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStore, setFilterStore] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [...new Set(inventory.map(item => item.category))];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStore = filterStore === 'all' || item.storeId === filterStore;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;

    return matchesSearch && matchesStore && matchesCategory;
  });

  const getStoreName = (storeId) => {
    const store = stores.find(s => s.id === storeId);
    return store?.name || 'N/A';
  };

  const totalValue = filteredInventory.reduce((sum, item) => sum + (item.price * item.stock), 0);
  const totalStock = filteredInventory.reduce((sum, item) => sum + item.stock, 0);
  const lowStockItems = filteredInventory.filter(item => item.stock < 10).length;

  return (
    <div className="admin-inventory-view">
      <div className="admin-inventory-header">
        <div>
          <h1>All Inventory</h1>
          <p>View inventory across all stores</p>
        </div>
      </div>

      <div className="inventory-filters">
        <input
          type="text"
          placeholder="Search by product name or SKU..."
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
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="inventory-stats">
        <div className="stat-box">
          <Package size={24} />
          <div>
            <span className="stat-label">Total Products</span>
            <span className="stat-value">{filteredInventory.length}</span>
          </div>
        </div>
        <div className="stat-box">
          <Package size={24} />
          <div>
            <span className="stat-label">Total Stock</span>
            <span className="stat-value">{totalStock.toLocaleString()}</span>
          </div>
        </div>
        <div className="stat-box">
          <Package size={24} />
          <div>
            <span className="stat-label">Total Value</span>
            <span className="stat-value">₹{totalValue.toLocaleString()}</span>
          </div>
        </div>
        <div className="stat-box warning">
          <TrendingDown size={24} />
          <div>
            <span className="stat-label">Low Stock Items</span>
            <span className="stat-value">{lowStockItems}</span>
          </div>
        </div>
      </div>

      <div className="inventory-table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Store</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Total Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map(item => (
              <tr key={item.id}>
                <td className="sku-cell">{item.sku}</td>
                <td className="name-cell">{item.name}</td>
                <td>{getStoreName(item.storeId)}</td>
                <td>{item.category}</td>
                <td className="stock-cell">
                  <span className={`stock-badge ${item.stock < 10 ? 'low' : item.stock < 50 ? 'medium' : 'high'}`}>
                    {item.stock}
                  </span>
                </td>
                <td>₹{item.price?.toLocaleString()}</td>
                <td className="value-cell">₹{(item.price * item.stock)?.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${item.stock < 10 ? 'critical' : item.stock < 50 ? 'warning' : 'good'}`}>
                    {item.stock < 10 ? 'Low Stock' : item.stock < 50 ? 'Normal' : 'Good'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredInventory.length === 0 && (
          <div className="no-data">
            <Package size={48} />
            <p>No inventory items found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminInventory;
