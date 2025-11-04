import { create } from 'zustand';
import { ref, onValue, push, set as firebaseSet } from 'firebase/database';
import { db } from '../firebase/config';

const usePaymentStore = create((set, get) => ({
  payments: [],
  loading: true,
  error: null,
  paymentMethods: ['UPI', 'Credit Card', 'Debit Card', 'Wallet', 'Net Banking'],
  paymentProviders: ['Razorpay', 'PayPal', 'Stripe'],

  // Initialize Firebase listener
  initializePayments: () => {
    const paymentsRef = ref(db, 'payments');
    
    onValue(paymentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const paymentsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          timestamp: new Date(data[key].timestamp),
        }));
        set({ payments: paymentsArray, loading: false });
      } else {
        set({ payments: [], loading: false });
      }
    }, (error) => {
      set({ error: error.message, loading: false });
    });
  },

  // Process payment
  processPayment: async (paymentData) => {
    try {
      const paymentId = `PAY-${Date.now()}`;
      // Use existing transactionId from Razorpay or generate new one
      const transactionId = paymentData.transactionId || `TXN-${(paymentData.method || 'UPI').toUpperCase()}-${Math.random().toString(36).substr(2, 9)}`;

      const newPayment = {
        ...paymentData,
        transactionId,
        status: paymentData.status?.toLowerCase() || 'success',
        timestamp: Date.now(),
      };

      const paymentsRef = ref(db, 'payments');
      const newPaymentRef = push(paymentsRef);
      await firebaseSet(newPaymentRef, newPayment);

      return { success: true, payment: { id: newPaymentRef.key, ...newPayment } };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Get payment by ID
  getPaymentById: (paymentId) => {
    const { payments } = get();
    return payments.find(p => p.id === paymentId);
  },

  // Get payments by order
  getPaymentsByOrder: (orderId) => {
    const { payments } = get();
    return payments.filter(p => p.orderId === orderId);
  },

  // Get payments by method
  getPaymentsByMethod: (method) => {
    const { payments } = get();
    return payments.filter(p => p.method === method);
  },

  // Get payment stats
  getPaymentStats: () => {
    const { payments } = get();
    const totalTransactions = payments.length;
    const successfulTransactions = payments.filter(p => p.status === 'success').length;
    const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    
    const methodBreakdown = payments.reduce((acc, p) => {
      acc[p.method] = (acc[p.method] || 0) + 1;
      return acc;
    }, {});

    return {
      totalTransactions,
      successfulTransactions,
      totalAmount,
      methodBreakdown,
      successRate: totalTransactions > 0 ? (successfulTransactions / totalTransactions * 100).toFixed(2) : 0
    };
  },
}));

export default usePaymentStore;
