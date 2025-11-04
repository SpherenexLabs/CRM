import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,

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
          role: 'Store Manager',
          name: 'Sarah Manager',
          email: 'sarah@spherenex.com',
          storeId: 1,
          permissions: ['inventory', 'orders', 'sales', 'delivery']
        },
        {
          id: 3,
          username: 'manager2',
          password: 'manager123',
          role: 'Store Manager',
          name: 'Mike Store',
          email: 'mike@spherenex.com',
          storeId: 2,
          permissions: ['inventory', 'orders', 'sales', 'delivery']
        }
      ],

      // Login
      login: (username, password) => {
        const user = get().users.find(
          u => u.username === username && u.password === password
        );

        if (user) {
          const { password, ...userWithoutPassword } = user;
          set({
            currentUser: userWithoutPassword,
            isAuthenticated: true
          });
          return { success: true, user: userWithoutPassword };
        }

        return { success: false, message: 'Invalid credentials' };
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

      // Check if Store Manager
      isStoreManager: () => {
        const { currentUser } = get();
        return currentUser?.role === 'Store Manager';
      },

      // Get accessible stores
      getAccessibleStores: (allStores) => {
        const { currentUser } = get();
        if (!currentUser) return [];
        
        if (currentUser.role === 'Super Admin') {
          return allStores;
        }
        
        if (currentUser.role === 'Store Manager' && currentUser.storeId) {
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
      name: 'auth-storage'
    }
  )
);

export default useAuthStore;
