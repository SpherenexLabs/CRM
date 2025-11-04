import { useState } from 'react';
import { Plus, Edit2, Trash2, Store, MapPin, User, Phone } from 'lucide-react';
import useInventoryStore from '../../store/inventoryStore';

function StoreManagement() {
  const { stores, addStore, updateStore, deleteStore } = useInventoryStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contactPerson: '',
    phone: '',
    manager: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingStore) {
      const result = await updateStore(editingStore.id, formData);
      if (result.success) {
        alert('Store updated successfully!');
        setEditingStore(null);
      } else {
        alert('Error: ' + result.error);
      }
    } else {
      const result = await addStore(formData);
      if (result.success) {
        alert('Store added successfully!');
        setShowAddForm(false);
      } else {
        alert('Error: ' + result.error);
      }
    }

    setFormData({
      name: '',
      location: '',
      contactPerson: '',
      phone: '',
      manager: ''
    });
  };

  const handleEdit = (store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      location: store.location,
      contactPerson: store.contactPerson,
      phone: store.phone || '',
      manager: store.manager || store.contactPerson
    });
    setShowAddForm(true);
  };

  const handleDelete = async (storeId) => {
    if (window.confirm('Are you sure you want to delete this store? This cannot be undone.')) {
      const result = await deleteStore(storeId);
      if (result.success) {
        alert('Store deleted successfully!');
      } else {
        alert('Error: ' + result.error);
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingStore(null);
    setFormData({
      name: '',
      location: '',
      contactPerson: '',
      phone: '',
      manager: ''
    });
  };

  return (
    <div className="store-management">
      <div className="store-header">
        <h2><Store size={24} /> Store Management</h2>
        {!showAddForm && (
          <button className="btn-primary" onClick={() => setShowAddForm(true)}>
            <Plus size={18} /> Add New Store
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="store-form-container">
          <h3>{editingStore ? 'Edit Store' : 'Add New Store'}</h3>
          <form onSubmit={handleSubmit} className="store-form">
            <div className="form-row">
              <div className="form-group">
                <label>
                  <Store size={16} /> Store Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Main Store, Branch A"
                />
              </div>
              <div className="form-group">
                <label>
                  <MapPin size={16} /> Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g., Downtown, Uptown"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <User size={16} /> Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  placeholder="e.g., John Doe"
                />
              </div>
              <div className="form-group">
                <label>
                  <Phone size={16} /> Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="e.g., +91 98765 43210"
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                <User size={16} /> Manager Name
              </label>
              <input
                type="text"
                value={formData.manager}
                onChange={(e) => setFormData({...formData, manager: e.target.value})}
                placeholder="e.g., Jane Smith"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingStore ? 'Update Store' : 'Add Store'}
              </button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="stores-grid">
        {stores.map(store => (
          <div key={store.id} className="store-card">
            <div className="store-card-header">
              <h3><Store size={20} /> {store.name}</h3>
              <div className="store-actions">
                <button className="btn-icon" onClick={() => handleEdit(store)} title="Edit Store">
                  <Edit2 size={18} />
                </button>
                <button className="btn-icon btn-danger" onClick={() => handleDelete(store.id)} title="Delete Store">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="store-card-body">
              <div className="store-info">
                <MapPin size={16} />
                <span>{store.location}</span>
              </div>
              <div className="store-info">
                <User size={16} />
                <span>{store.contactPerson || store.manager}</span>
              </div>
              {store.phone && (
                <div className="store-info">
                  <Phone size={16} />
                  <span>{store.phone}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {stores.length === 0 && !showAddForm && (
        <div className="empty-state">
          <Store size={48} />
          <p>No stores found</p>
          <button className="btn-primary" onClick={() => setShowAddForm(true)}>
            <Plus size={18} /> Add Your First Store
          </button>
        </div>
      )}
    </div>
  );
}

export default StoreManagement;
