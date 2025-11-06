import { create } from 'zustand';
import { ref, onValue, push, update, remove, set as firebaseSet } from 'firebase/database';
import { db } from '../firebase/config';

const useInventoryStore = create((set, get) => ({
  inventory: [],
  stores: [],
  stockAlerts: [],
  stockTransfers: [],
  loading: true,
  error: null,

  // Initialize Firebase listeners
  initializeInventory: () => {
    // Listen to inventory
    const inventoryRef = ref(db, 'inventory');
    onValue(inventoryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const inventoryArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          lastUpdated: new Date(data[key].lastUpdated)
        }));
        set({ inventory: inventoryArray, loading: false });
      } else {
        set({ inventory: [], loading: false });
      }
    }, (error) => {
      set({ error: error.message, loading: false });
    });

    // Listen to stores
    const storesRef = ref(db, 'stores');
    onValue(storesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const storesArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        set({ stores: storesArray });
      } else {
        // Initialize default stores if none exist
        const defaultStores = [
          { name: 'Main Store', location: 'Downtown', contactPerson: 'John Doe' },
          { name: 'Branch A', location: 'Uptown', contactPerson: 'Jane Smith' },
          { name: 'Branch B', location: 'Suburb', contactPerson: 'Mike Johnson' },
        ];
        defaultStores.forEach(store => {
          const newStoreRef = push(storesRef);
          firebaseSet(newStoreRef, store);
        });
      }
    });

    // Listen to stock transfers
    const transfersRef = ref(db, 'stockTransfers');
    onValue(transfersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const transfersArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          transferredAt: new Date(data[key].transferredAt)
        }));
        set({ stockTransfers: transfersArray });
      } else {
        set({ stockTransfers: [] });
      }
    });
  },

  // Add new inventory item
  addInventoryItem: async (item) => {
    try {
      const inventoryRef = ref(db, 'inventory');
      const newItemRef = push(inventoryRef);
      
      // Clean the item data to ensure no invalid values
      const cleanItem = {
        sku: item.sku,
        productName: item.productName,
        category: item.category,
        storeId: item.storeId,
        quantity: Number(item.quantity) || 0,
        minThreshold: Number(item.minThreshold) || 10,
        price: Number(item.price) || 0,
        cost: Number(item.cost) || 0,
        supplier: item.supplier || '',
        tags: Array.isArray(item.tags) ? item.tags : [],
        lastUpdated: Date.now()
      };

      // Add customerAccountId if provided (for customer-added inventory)
      if (item.customerAccountId) {
        cleanItem.customerAccountId = item.customerAccountId;
      }

      await firebaseSet(newItemRef, cleanItem);
      return { success: true, id: newItemRef.key };
    } catch (error) {
      console.error('Error adding inventory item:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Update inventory item
  updateInventoryItem: async (id, updates) => {
    try {
      const itemRef = ref(db, `inventory/${id}`);
      await update(itemRef, {
        ...updates,
        lastUpdated: Date.now()
      });
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Delete inventory item
  deleteInventoryItem: async (id) => {
    try {
      const itemRef = ref(db, `inventory/${id}`);
      await remove(itemRef);
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Add new store
  addStore: async (storeData) => {
    try {
      const storesRef = ref(db, 'stores');
      const newStoreRef = push(storesRef);
      await firebaseSet(newStoreRef, {
        name: storeData.name,
        location: storeData.location,
        contactPerson: storeData.contactPerson,
        phone: storeData.phone || '',
        manager: storeData.manager || storeData.contactPerson
      });
      return { success: true, id: newStoreRef.key };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Update store
  updateStore: async (id, updates) => {
    try {
      const storeRef = ref(db, `stores/${id}`);
      await update(storeRef, updates);
      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Delete store
  deleteStore: async (id) => {
    try {
      // Check if store has inventory
      const state = get();
      const hasInventory = state.inventory.some(item => item.storeId === id);
      
      if (hasInventory) {
        return { success: false, error: 'Cannot delete store with inventory. Transfer items first.' };
      }

      const storeRef = ref(db, `stores/${id}`);
      await remove(storeRef);
      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Update stock quantity
  updateStock: async (id, quantity) => {
    try {
      const itemRef = ref(db, `inventory/${id}`);
      await update(itemRef, {
        quantity,
        lastUpdated: Date.now()
      });
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Transfer stock between stores
  transferStock: async (fromStoreId, toStoreId, sku, quantity, reason) => {
    try {
      const state = get();
      const fromItem = state.inventory.find(item => item.storeId === fromStoreId && item.sku === sku);
      const toItem = state.inventory.find(item => item.storeId === toStoreId && item.sku === sku);

      if (!fromItem || fromItem.quantity < quantity) {
        set({ error: 'Insufficient stock' });
        return;
      }

      // Update from store
      await update(ref(db, `inventory/${fromItem.id}`), {
        quantity: fromItem.quantity - quantity,
        lastUpdated: Date.now()
      });

      // Update to store or create new item
      if (toItem) {
        await update(ref(db, `inventory/${toItem.id}`), {
          quantity: toItem.quantity + quantity,
          lastUpdated: Date.now()
        });
      } else {
        const newItemRef = push(ref(db, 'inventory'));
        await firebaseSet(newItemRef, {
          ...fromItem,
          id: undefined,
          storeId: toStoreId,
          quantity,
          lastUpdated: Date.now()
        });
      }

      // Record transfer
      const transferRef = push(ref(db, 'stockTransfers'));
      await firebaseSet(transferRef, {
        fromStoreId,
        toStoreId,
        sku,
        quantity,
        reason,
        transferredAt: Date.now()
      });
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Get stock alerts (low stock items)
  getStockAlerts: () => {
    const state = get();
    return state.inventory.filter(item => item.quantity <= item.minThreshold);
  },

  // Get total inventory value
  getTotalInventoryValue: () => {
    const state = get();
    return state.inventory.reduce((total, item) => total + (item.quantity * item.price), 0);
  },

  // Get inventory by store
  getInventoryByStore: (storeId) => {
    const state = get();
    return state.inventory.filter(item => item.storeId === storeId);
  },

  // Get low stock items
  getLowStockItems: () => {
    const { inventory } = get();
    return inventory.filter(item => item.quantity <= item.minThreshold);
  },

  // Get total value
  getTotalValue: () => {
    const { inventory } = get();
    return inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },
}));

export default useInventoryStore;
