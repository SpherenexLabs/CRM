import { create } from 'zustand';
import { ref, onValue, push, update, remove, set as firebaseSet, get as firebaseGet } from 'firebase/database';
import { db } from '../firebase/config';

// Helper function to auto-create delivery task
const createDeliveryTask = async (order, orderId) => {
  try {
    // Get available delivery agents
    const agentsRef = ref(db, 'deliveryAgents');
    const agentsSnapshot = await firebaseGet(agentsRef);
    
    if (!agentsSnapshot.exists()) {
      console.log('No delivery agents available');
      return;
    }
    
    const agents = agentsSnapshot.val();
    const agentsArray = Object.keys(agents).map(key => ({
      id: key,
      ...agents[key]
    }));
    
    // Find best available agent (least active deliveries)
    const availableAgent = agentsArray.reduce((best, agent) => 
      (agent.activeDeliveries || 0) < (best.activeDeliveries || 0) ? agent : best
    );
    
    // Determine zone based on shipping address or default
    const zone = determineZone(order.shippingAddress) || availableAgent.zone || 'Downtown';
    
    // Create delivery task
    const tasksRef = ref(db, 'deliveryTasks');
    const newTaskRef = push(tasksRef);
    
    await firebaseSet(newTaskRef, {
      orderId: orderId,
      customerName: order.customerName,
      address: order.shippingAddress || 'No address provided',
      zone: zone,
      agentId: availableAgent.id,
      agentName: availableAgent.name,
      status: 'assigned',
      assignedAt: Date.now(),
      estimatedDelivery: Date.now() + 86400000 // +24 hours
    });
    
    // Update agent's active deliveries count
    const agentRef = ref(db, `deliveryAgents/${availableAgent.id}`);
    await update(agentRef, {
      activeDeliveries: (availableAgent.activeDeliveries || 0) + 1
    });
    
    console.log(`✅ Delivery task created and assigned to ${availableAgent.name}`);
  } catch (error) {
    console.error('Error creating delivery task:', error);
  }
};

// Helper function to determine zone from address
const determineZone = (address) => {
  if (!address) return 'Downtown';
  
  const addressLower = address.toLowerCase();
  if (addressLower.includes('downtown') || addressLower.includes('central')) return 'Downtown';
  if (addressLower.includes('uptown') || addressLower.includes('north')) return 'Uptown';
  if (addressLower.includes('suburb') || addressLower.includes('residential')) return 'Suburb';
  if (addressLower.includes('industrial') || addressLower.includes('warehouse')) return 'Industrial Area';
  if (addressLower.includes('coastal') || addressLower.includes('beach')) return 'Coastal';
  
  return 'Downtown'; // Default zone
};

const useOrderStore = create((set, get) => ({
  orders: [],
  loading: true,
  error: null,

  // Initialize Firebase listener
  initializeOrders: () => {
    const ordersRef = ref(db, 'orders');
    
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          createdAt: new Date(data[key].createdAt),
          shippedAt: data[key].shippedAt ? new Date(data[key].shippedAt) : null,
          deliveredAt: data[key].deliveredAt ? new Date(data[key].deliveredAt) : null,
        }));
        set({ orders: ordersArray, loading: false });
      } else {
        set({ orders: [], loading: false });
      }
    }, (error) => {
      set({ error: error.message, loading: false });
    });
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      const ordersRef = ref(db, 'orders');
      const newOrderRef = push(ordersRef);
      const invoiceNumber = `INV-${Date.now()}`;
      
      await firebaseSet(newOrderRef, {
        ...orderData,
        invoiceNumber,
        createdAt: Date.now(),
        status: 'placed',
        paymentStatus: orderData.paymentStatus || 'pending',
        grandTotal: orderData.totalAmount * 1.1 // Add tax
      });
      
      return { success: true, id: newOrderRef.key, invoiceNumber };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Update order
  updateOrder: async (id, updates) => {
    try {
      const orderRef = ref(db, `orders/${id}`);
      await update(orderRef, updates);
      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    try {
      const state = get();
      const order = state.orders.find(o => o.id === id);
      
      const orderRef = ref(db, `orders/${id}`);
      const updates = { status };
      
      if (status === 'shipped') {
        updates.shippedAt = Date.now();
        
        // Auto-create delivery task when order is shipped
        if (order) {
          await createDeliveryTask(order, id);
        }
      } else if (status === 'delivered') {
        updates.deliveredAt = Date.now();
      }
      
      await update(orderRef, updates);
      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Delete order
  deleteOrder: async (id) => {
    try {
      const orderRef = ref(db, `orders/${id}`);
      await remove(orderRef);
      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Update payment status
  updatePaymentStatus: async (orderId, paymentStatus, paymentMethod) => {
    try {
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, {
        paymentStatus,
        paymentMethod,
        paidAt: Date.now()
      });
      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Get total revenue
  getTotalRevenue: () => {
    const { orders } = get();
    return orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, order) => sum + (order.grandTotal || 0), 0);
  },

  // Get orders by status
  // Get orders by status
  getOrdersByStatus: (status) => {
    const { orders } = get();
    return orders.filter(o => o.status === status);
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, {
        status: 'cancelled',
        cancelledAt: Date.now()
      });
      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Get order by ID
  getOrderById: (orderId) => {
    const { orders } = get();
    return orders.find(order => order.id === orderId);
  },

  // Get orders by customer
  getOrdersByCustomer: (customerId) => {
    const { orders } = get();
    return orders.filter(order => order.customerId === customerId);
  },

  // Get revenue by date range
  getRevenueByDateRange: (startDate, endDate) => {
    const { orders } = get();
    return orders
      .filter(order => 
        order.paymentStatus === 'paid' &&
        order.createdAt >= startDate &&
        order.createdAt <= endDate
      )
      .reduce((total, order) => total + (order.grandTotal || 0), 0);
  },
}));

export default useOrderStore;
