import { useState } from 'react';
import { Edit, Trash2, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import useInventoryStore from '../../store/inventoryStore';

function InventoryList({ inventory, stores }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const { updateInventoryItem, deleteInventoryItem } = useInventoryStore();

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSave = () => {
    updateInventoryItem(editingId, editForm);
    setEditingId(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteInventoryItem(id);
    }
  };

  const getStoreName = (storeId) => {
    return stores.find(s => s.id === storeId)?.name || 'Unknown';
  };

  return (
    <div className="inventory-list">
      <div className="table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Store</th>
              <th>Quantity</th>
              <th>Min Threshold</th>
              <th>Price</th>
              <th>Last Updated</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id} className={item.quantity <= item.minThreshold ? 'low-stock' : ''}>
                <td data-label="SKU">{item.sku}</td>
                <td data-label="Product Name">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editForm.productName}
                      onChange={(e) => setEditForm({...editForm, productName: e.target.value})}
                      className="edit-input"
                    />
                  ) : (
                    item.productName
                  )}
                </td>
                <td data-label="Category">{item.category}</td>
                <td data-label="Store">{getStoreName(item.storeId)}</td>
                <td data-label="Quantity">
                  {editingId === item.id ? (
                    <input
                      type="number"
                      value={editForm.quantity}
                      onChange={(e) => setEditForm({...editForm, quantity: parseInt(e.target.value)})}
                      className="edit-input small"
                    />
                  ) : (
                    item.quantity
                  )}
                </td>
                <td data-label="Min. Threshold">
                  {editingId === item.id ? (
                    <input
                      type="number"
                      value={editForm.minThreshold}
                      onChange={(e) => setEditForm({...editForm, minThreshold: parseInt(e.target.value)})}
                      className="edit-input small"
                    />
                  ) : (
                    item.minThreshold
                  )}
                </td>
                <td data-label="Price">₹{item.price}</td>
                <td data-label="Last Updated">{format(item.lastUpdated, 'MMM dd, yyyy HH:mm')}</td>
                <td data-label="Status">
                  <span className={`status-badge ${item.quantity <= item.minThreshold ? 'status-danger' : 'status-success'}`}>
                    {item.quantity <= item.minThreshold ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td data-label="Actions">
                  <div className="action-buttons">
                    {editingId === item.id ? (
                      <>
                        <button onClick={handleSave} className="btn-icon btn-success" title="Save">
                          <Save size={16} />
                        </button>
                        <button onClick={handleCancel} className="btn-icon btn-secondary" title="Cancel">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(item)} className="btn-icon btn-primary" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="btn-icon btn-danger" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryList;




