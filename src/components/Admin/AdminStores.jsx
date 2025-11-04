import { useState } from 'react';
import { Store, Package, MapPin, User, Search, Eye } from 'lucide-react';
import useInventoryStore from '../../store/inventoryStore';
import './AdminStores.css';

function AdminStores() {
  const { stores, inventory } = useInventoryStore();
  const [selectedStore, setSelectedStore] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'inventory'
  const [searchTerm, setSearchTerm] = useState('');

  // Filter inventory by selected store
  const getStoreInventory = (storeId) => {
    return inventory.filter(item => item.storeId === storeId);
  };

  // Filter stores by search term
  const filteredStores = stores.filter(store =>
    store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewInventory = (store) => {
    setSelectedStore(store);
    setViewMode('inventory');
  };

  return (
    <div className="admin-stores">
      <div className="admin-stores-header">
        <div>
          <h1>Stores Management</h1>
          <p>View all store locations and their inventory</p>
        </div>
      </div>

      {viewMode === 'list' ? (
        <>
          {/* Search Bar */}
          <div className="stores-search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search stores by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Stores Grid */}
          <div className="stores-grid">
            {filteredStores.map(store => {
              return (
                <div key={store.id} className="store-card">
                  <div className="store-card-header">
                    <div className="store-icon">
                      <Store size={32} />
                    </div>
                  </div>

                  <div className="store-card-body">
                    <h3>{store.name}</h3>
                    
                    <div className="store-info">
                      <div className="info-item">
                        <MapPin size={16} />
                        <span>{store.location}</span>
                      </div>
                      <div className="info-item">
                        <User size={16} />
                        <span>{store.contactPerson}</span>
                      </div>
                    </div>

                    <button 
                      className="btn-view-inventory"
                      onClick={() => handleViewInventory(store)}
                    >
                      <Eye size={18} />
                      View Inventory
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <StoreInventoryView 
          store={selectedStore}
          inventory={getStoreInventory(selectedStore?.id)}
          onBack={() => setViewMode('list')}
        />
      )}
    </div>
  );
}

function StoreInventoryView({ store, inventory, onBack }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = inventory.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="store-inventory-view">
      <div className="inventory-header">
        <button className="btn-back" onClick={onBack}>
          ← Back to Stores
        </button>
        <div className="inventory-title">
          <h2>{store.name} - Inventory</h2>
          <p>{store.location}</p>
        </div>
      </div>

      <div className="inventory-search">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search inventory by name, category, or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="inventory-summary">
        <div className="summary-card">
          <Package size={24} />
          <div>
            <span className="summary-label">Total Products</span>
            <span className="summary-value">{inventory.length}</span>
          </div>
        </div>
        <div className="summary-card">
          <Package size={24} />
          <div>
            <span className="summary-label">Total Stock</span>
            <span className="summary-value">
              {inventory.reduce((sum, item) => sum + item.stock, 0)}
            </span>
          </div>
        </div>
        <div className="summary-card">
          <Package size={24} />
          <div>
            <span className="summary-label">Total Value</span>
            <span className="summary-value">
              ₹{inventory.reduce((sum, item) => sum + (item.price * item.stock), 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="inventory-table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
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
                <td>{item.category}</td>
                <td className="stock-cell">
                  <span className={`stock-badge ${item.stock < 10 ? 'low' : item.stock < 50 ? 'medium' : 'high'}`}>
                    {item.stock}
                  </span>
                </td>
                <td>₹{item.price?.toLocaleString()}</td>
                <td>₹{(item.price * item.stock)?.toLocaleString()}</td>
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

export default AdminStores;
