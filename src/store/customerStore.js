import { create } from 'zustand';
import { ref, onValue, push, update, set as firebaseSet } from 'firebase/database';
import { db } from '../firebase/config';

const useCustomerStore = create((set, get) => ({
  customers: [],
  loading: true,
  error: null,

  // Initialize Firebase listeners
  initializeCustomers: () => {
    const customersRef = ref(db, 'customers');
    onValue(customersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const customersArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          registeredAt: new Date(data[key].registeredAt),
          lastPurchase: data[key].lastPurchase ? new Date(data[key].lastPurchase) : null,
          feedback: data[key].feedback ? data[key].feedback.map(f => ({
            ...f,
            date: new Date(f.date)
          })) : []
        }));
        set({ customers: customersArray, loading: false });
      } else {
        set({ customers: [], loading: false });
      }
    });
  },

  // Register customer
  registerCustomer: async (customerData) => {
    try {
      const customersRef = ref(db, 'customers');
      const newCustomerRef = push(customersRef);
      await firebaseSet(newCustomerRef, {
        ...customerData,
        registeredAt: Date.now(),
        totalPurchases: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        tier: 'Bronze',
        preferredCategories: [],
        feedback: []
      });

      return { success: true, id: newCustomerRef.key };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Update customer
  updateCustomer: async (customerId, updates) => {
    try {
      const customerRef = ref(db, `customers/${customerId}`);
      await update(customerRef, updates);
      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Add purchase - updates stats and tier
  addPurchase: async (customerId, amount) => {
    try {
      const state = get();
      const customer = state.customers.find(c => c.id === customerId);
      
      if (!customer) {
        return { success: false, message: 'Customer not found' };
      }

      const newTotalSpent = customer.totalSpent + amount;
      const newLoyaltyPoints = customer.loyaltyPoints + Math.floor(amount / 10);
      const newTotalPurchases = customer.totalPurchases + 1;
      
      // Update tier based on total spent
      let tier = 'Bronze';
      if (newTotalSpent >= 15000) tier = 'Platinum';
      else if (newTotalSpent >= 7000) tier = 'Gold';
      else if (newTotalSpent >= 3000) tier = 'Silver';

      const customerRef = ref(db, `customers/${customerId}`);
      await update(customerRef, {
        totalPurchases: newTotalPurchases,
        totalSpent: newTotalSpent,
        loyaltyPoints: newLoyaltyPoints,
        tier,
        lastPurchase: Date.now()
      });

      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Add customer feedback
  addFeedback: async (customerId, feedback) => {
    try {
      const state = get();
      const customer = state.customers.find(c => c.id === customerId);
      
      if (!customer) {
        return { success: false, message: 'Customer not found' };
      }

      const newFeedback = [...(customer.feedback || []), { ...feedback, date: Date.now() }];
      const customerRef = ref(db, `customers/${customerId}`);
      await update(customerRef, { feedback: newFeedback });

      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Redeem loyalty points
  redeemLoyaltyPoints: async (customerId, points) => {
    try {
      const state = get();
      const customer = state.customers.find(c => c.id === customerId);

      if (!customer || customer.loyaltyPoints < points) {
        return { success: false, message: 'Insufficient loyalty points' };
      }

      const customerRef = ref(db, `customers/${customerId}`);
      await update(customerRef, { loyaltyPoints: customer.loyaltyPoints - points });

      return { success: true, message: 'Points redeemed successfully' };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Helper methods (using local state)
  getCustomerById: (customerId) => {
    const state = get();
    return state.customers.find(c => c.id === customerId);
  },

  getCustomersByTier: (tier) => {
    const state = get();
    return state.customers.filter(c => c.tier === tier);
  },

  getRecommendations: (customerId) => {
    const state = get();
    const customer = state.customers.find(c => c.id === customerId);
    
    if (!customer) return [];

    // Simple recommendation based on preferred categories
    // In real app, this would use ML algorithms
    return customer.preferredCategories.map(cat => ({
      category: cat,
      reason: `Based on your interest in ${cat}`,
      discount: customer.tier === 'Platinum' ? 20 : customer.tier === 'Gold' ? 15 : 10
    }));
  },

  getChurnRisk: (customerId) => {
    const state = get();
    const customer = state.customers.find(c => c.id === customerId);
    
    if (!customer) return null;

    const daysSinceLastPurchase = customer.lastPurchase 
      ? Math.floor((new Date() - new Date(customer.lastPurchase)) / (1000 * 60 * 60 * 24))
      : 999; // Very high number if no purchase
    
    let riskLevel = 'low';
    if (daysSinceLastPurchase > 90) riskLevel = 'high';
    else if (daysSinceLastPurchase > 45) riskLevel = 'medium';

    return {
      customerId,
      name: customer.name,
      riskLevel,
      daysSinceLastPurchase,
      recommendation: riskLevel === 'high' 
        ? 'Send personalized offer immediately' 
        : riskLevel === 'medium' 
        ? 'Schedule follow-up email' 
        : 'Customer is engaged'
    };
  },

  getCustomerAnalytics: () => {
    const state = get();
    
    const totalCustomers = state.customers.length;
    const tierDistribution = state.customers.reduce((acc, c) => {
      acc[c.tier] = (acc[c.tier] || 0) + 1;
      return acc;
    }, {});

    const averageSpent = totalCustomers > 0 
      ? state.customers.reduce((sum, c) => sum + c.totalSpent, 0) / totalCustomers 
      : 0;
    const totalRevenue = state.customers.reduce((sum, c) => sum + c.totalSpent, 0);

    const allFeedback = state.customers.flatMap(c => c.feedback || []);
    const avgFeedbackRating = allFeedback.length > 0
      ? allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length
      : 0;

    return {
      totalCustomers,
      tierDistribution,
      averageSpent: averageSpent || 0,
      totalRevenue: totalRevenue || 0,
      avgFeedbackRating: avgFeedbackRating.toFixed(2)
    };
  },
}));

export default useCustomerStore;
