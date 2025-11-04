import { create } from 'zustand';
import { ref, onValue, push, update, set as firebaseSet } from 'firebase/database';
import { db } from '../firebase/config';

const useDeliveryStore = create((set, get) => ({
  deliveryAgents: [],
  deliveryTasks: [],
  loading: true,
  error: null,

  // Initialize Firebase listeners
  initializeDelivery: () => {
    // Listen to delivery agents
    const agentsRef = ref(db, 'deliveryAgents');
    onValue(agentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const agentsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        set({ deliveryAgents: agentsArray, loading: false });
      } else {
        set({ deliveryAgents: [], loading: false });
      }
    });

    // Listen to delivery tasks
    const tasksRef = ref(db, 'deliveryTasks');
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tasksArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          assignedAt: new Date(data[key].assignedAt),
          estimatedDelivery: new Date(data[key].estimatedDelivery),
          deliveredAt: data[key].deliveredAt ? new Date(data[key].deliveredAt) : null
        }));
        set({ deliveryTasks: tasksArray });
      } else {
        set({ deliveryTasks: [] });
      }
    });
  },

  // Assign delivery
  assignDelivery: async (deliveryData) => {
    try {
      const tasksRef = ref(db, 'deliveryTasks');
      const newTaskRef = push(tasksRef);
      await firebaseSet(newTaskRef, {
        ...deliveryData,
        status: 'assigned',
        assignedAt: Date.now(),
        estimatedDelivery: deliveryData.estimatedDelivery || Date.now() + 86400000 // +24 hours
      });
      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Update delivery status
  updateDeliveryStatus: async (taskId, status) => {
    try {
      const state = get();
      const task = state.deliveryTasks.find(t => t.id === taskId);
      
      const taskRef = ref(db, `deliveryTasks/${taskId}`);
      const updates = { status };
      
      if (status === 'delivered') {
        updates.deliveredAt = Date.now();
        
        // Update agent's active deliveries count (decrease)
        if (task && task.agentId) {
          const agentRef = ref(db, `deliveryAgents/${task.agentId}`);
          const agent = state.deliveryAgents.find(a => a.id === task.agentId);
          
          if (agent) {
            await update(agentRef, {
              activeDeliveries: Math.max(0, (agent.activeDeliveries || 0) - 1),
              totalDeliveries: (agent.totalDeliveries || 0) + 1
            });
          }
        }
        
        // Also update the order status to delivered
        if (task && task.orderId) {
          const orderRef = ref(db, `orders/${task.orderId}`);
          await update(orderRef, {
            status: 'delivered',
            deliveredAt: Date.now()
          });
        }
      }
      
      await update(taskRef, updates);
      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  zones: ['Downtown', 'Uptown', 'Suburb', 'Industrial Area', 'Coastal'],

  // Add new delivery agent
  addDeliveryAgent: async (agentData) => {
    try {
      const agentsRef = ref(db, 'deliveryAgents');
      const newAgentRef = push(agentsRef);
      await firebaseSet(newAgentRef, {
        name: agentData.name,
        phone: agentData.phone,
        zone: agentData.zone,
        activeDeliveries: 0,
        totalDeliveries: 0
      });
      return { success: true, message: 'Delivery agent added successfully!' };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Reassign delivery to different agent
  reassignDelivery: async (deliveryId, newAgentId) => {
    try {
      const state = get();
      const newAgent = state.deliveryAgents.find(a => a.id === newAgentId);

      if (!newAgent) {
        return { success: false, message: 'Agent not found' };
      }

      const taskRef = ref(db, `deliveryTasks/${deliveryId}`);
      await update(taskRef, {
        agentId: newAgentId,
        agentName: newAgent.name,
        zone: newAgent.zone
      });

      return { success: true, message: 'Delivery reassigned successfully' };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Helper methods (using local state)
  getDeliveryAnalytics: () => {
    const state = get();
    const byZone = state.deliveryTasks.reduce((acc, d) => {
      acc[d.zone] = (acc[d.zone] || 0) + 1;
      return acc;
    }, {});

    const byAgent = state.deliveryAgents.map(agent => ({
      name: agent.name,
      total: agent.totalDeliveries,
      active: agent.activeDeliveries
    }));

    const byStatus = state.deliveryTasks.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    }, {});

    return { byZone, byAgent, byStatus };
  },

  getAgentPerformance: (agentId) => {
    const state = get();
    const agent = state.deliveryAgents.find(a => a.id === agentId);
    const agentDeliveries = state.deliveryTasks.filter(d => d.agentId === agentId);
    const completed = agentDeliveries.filter(d => d.status === 'delivered');

    return {
      agent,
      totalDeliveries: agentDeliveries.length,
      completedDeliveries: completed.length,
      activeDeliveries: agent?.activeDeliveries || 0,
      completionRate: agentDeliveries.length > 0 
        ? (completed.length / agentDeliveries.length * 100).toFixed(2) 
        : 0
    };
  },
}));

export default useDeliveryStore;
