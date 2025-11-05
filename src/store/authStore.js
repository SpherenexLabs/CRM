import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ref, onValue, push, remove, set as firebaseSet } from 'firebase/database';
import { db } from '../firebase/config';

const useAuthStore = create(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      customers: [], // Customer accounts from Firebase

      users: [
        {
          id: 1,
          username: 'admin',
          password: 'admin123', // In production, use hashed passwords
          role: 'Super Admin',
          name: 'John Administrator',
          email: 'admin@spherenex.com',
          permissions: ['all']
        },
        {
          id: 2,
          username: 'manager1',
          password: 'manager123',
          role: 'Store Customer',
          name: 'Sarah Customer',
          email: 'sarah@spherenex.com',
          storeId: 1,
          permissions: ['inventory', 'orders', 'sales', 'delivery']
        },
        {
          id: 3,
          username: 'manager2',
          password: 'manager123',
          role: 'Store Customer',
          name: 'Mike Store',
          email: 'mike@spherenex.com',
          storeId: 2,
          permissions: ['inventory', 'orders', 'sales', 'delivery']
        }
      ],

      // Initialize customer accounts listener
      initializeCustomers: () => {
        const customersRef = ref(db, 'customerAccounts');
        
        onValue(customersRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const customersArray = Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            }));
            set({ customers: customersArray });
          } else {
            set({ customers: [] });
          }
        });
      },

      // Register new customer
      registerCustomer: async (customerData) => {
        const { email, password, name, phone } = customerData;
        
        // Check if email already exists
        const existingCustomer = get().customers.find(c => c.email === email);
        if (existingCustomer) {
          return { success: false, message: 'Email already registered' };
        }

        try {
          const customersRef = ref(db, 'customerAccounts');
          const newCustomerRef = push(customersRef);
          
          const newCustomer = {
            email,
            password, // In production, hash this
            name,
            phone: phone || '',
            role: 'Customer',
            createdAt: Date.now(),
            isActive: true
          };

          await firebaseSet(newCustomerRef, newCustomer);
          
          return { success: true, message: 'Registration successful! Please login.' };
        } catch (error) {
          console.error('Registration error:', error);
          return { success: false, message: 'Registration failed. Please try again.' };
        }
      },

      // Login (supports both staff and customers)
      login: (emailOrUsername, password) => {
        // Check staff users first
        const staffUser = get().users.find(
          u => u.username === emailOrUsername && u.password === password
        );

        if (staffUser) {
          const { password, ...userWithoutPassword } = staffUser;
          set({
            currentUser: userWithoutPassword,
            isAuthenticated: true
          });
          return { success: true, user: userWithoutPassword };
        }

        // Check customer accounts
        const customer = get().customers.find(
          c => c.email === emailOrUsername && c.password === password && c.isActive
        );

        if (customer) {
          const { password, ...customerWithoutPassword } = customer;
          set({
            currentUser: customerWithoutPassword,
            isAuthenticated: true
          });
          return { success: true, user: customerWithoutPassword };
        }

        return { success: false, message: 'Invalid credentials' };
      },

      // Delete customer account (Admin only)
      deleteCustomer: async (customerId) => {
        try {
          const customerRef = ref(db, `customerAccounts/${customerId}`);
          await remove(customerRef);
          return { success: true, message: 'Customer account deleted successfully' };
        } catch (error) {
          console.error('Delete customer error:', error);
          return { success: false, message: 'Failed to delete customer account' };
        }
      },

      // Logout
      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false
        });
      },

      // Check permission
      hasPermission: (permission) => {
        const { currentUser } = get();
        if (!currentUser) return false;
        
        if (currentUser.permissions.includes('all')) return true;
        return currentUser.permissions.includes(permission);
      },

      // Check if Super Admin
      isSuperAdmin: () => {
        const { currentUser } = get();
        return currentUser?.role === 'Super Admin';
      },

      // Check if Store Customer
      isStoreManager: () => {
        const { currentUser } = get();
        return currentUser?.role === 'Store Customer';
      },

      // Get accessible stores
      getAccessibleStores: (allStores) => {
        const { currentUser } = get();
        if (!currentUser) return [];
        
        if (currentUser.role === 'Super Admin') {
          return allStores;
        }
        
        if (currentUser.role === 'Store Customer' && currentUser.storeId) {
          return allStores.filter(store => store.id === currentUser.storeId);
        }
        
        return [];
      },

      // Filter data by user access
      filterByAccess: (data, dataType) => {
        const { currentUser } = get();
        if (!currentUser) return [];
        
        if (currentUser.role === 'Super Admin') {
          return data;
        }
        
        if (currentUser.role === 'Store Manager' && currentUser.storeId) {
          return data.filter(item => item.storeId === currentUser.storeId);
        }
        
        return [];
      },

      // Get current user (alias for easier access)
      get user() {
        return get().currentUser;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;
