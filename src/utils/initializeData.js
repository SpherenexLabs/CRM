import { ref, set } from 'firebase/database';
import { db } from '../firebase/config';

// Sample data initialization
export const initializeSampleData = async () => {
  try {
    // Sample Inventory Data
    const sampleInventory = {
      item1: {
        productName: 'Laptop Dell XPS 15',
        category: 'Electronics',
        sku: 'DELL-XPS-001',
        storeId: 'store1',
        quantity: 25,
        minThreshold: 10,
        price: 1299.99,
        lastUpdated: Date.now()
      },
      item2: {
        productName: 'iPhone 15 Pro',
        category: 'Electronics',
        sku: 'APPL-IP15-001',
        storeId: 'store1',
        quantity: 8,
        minThreshold: 15,
        price: 999.99,
        lastUpdated: Date.now()
      },
      item3: {
        productName: 'Samsung Galaxy S24',
        category: 'Electronics',
        sku: 'SAMS-S24-001',
        storeId: 'store1',
        quantity: 30,
        minThreshold: 20,
        price: 899.99,
        lastUpdated: Date.now()
      },
      item4: {
        productName: 'Wireless Mouse',
        category: 'Accessories',
        sku: 'ACC-MOUSE-001',
        storeId: 'store1',
        quantity: 50,
        minThreshold: 30,
        price: 29.99,
        lastUpdated: Date.now()
      },
      item5: {
        productName: 'USB-C Cable',
        category: 'Accessories',
        sku: 'ACC-CABLE-001',
        storeId: 'store2',
        quantity: 100,
        minThreshold: 50,
        price: 9.99,
        lastUpdated: Date.now()
      }
    };

    // Sample Stores
    const sampleStores = {
      store1: {
        name: 'Main Store',
        location: 'Downtown',
        contactPerson: 'John Doe'
      },
      store2: {
        name: 'Branch A',
        location: 'Uptown',
        contactPerson: 'Jane Smith'
      },
      store3: {
        name: 'Branch B',
        location: 'Suburb',
        contactPerson: 'Mike Johnson'
      }
    };

    // Write to Firebase
    await set(ref(db, 'inventory'), sampleInventory);
    await set(ref(db, 'stores'), sampleStores);

    console.log('Sample data initialized successfully!');
    return { success: true, message: 'Sample data initialized' };
  } catch (error) {
    console.error('Error initializing sample data:', error);
    return { success: false, message: error.message };
  }
};

// Call this function from browser console if needed:
// window.initializeSampleData = initializeSampleData;
