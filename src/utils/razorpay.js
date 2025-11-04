// Razorpay Configuration and Integration
export const RAZORPAY_KEY_ID = 'rzp_test_1DP5mmOlF5G5ag';

// Load Razorpay script dynamically
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Initialize Razorpay Payment
export const initiateRazorpayPayment = async (paymentData, onSuccess, onFailure) => {
  const res = await loadRazorpayScript();

  if (!res) {
    alert('Razorpay SDK failed to load. Please check your internet connection.');
    return;
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: Math.round(paymentData.amount * 100), // Amount in paise (multiply by 100)
    currency: 'INR',
    name: 'INVENLYTICS',
    description: `Payment for Order #${paymentData.orderId}`,
    // Removed image to avoid loading errors
    order_id: paymentData.razorpayOrderId || '', // Optional - for server-side order creation
    handler: function (response) {
      // Payment successful
      const paymentResult = {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        status: 'Success',
        ...paymentData
      };
      onSuccess(paymentResult);
    },
    prefill: {
      name: paymentData.customerName || '',
      email: paymentData.customerEmail || '',
      contact: paymentData.customerPhone || ''
    },
    notes: {
      order_id: paymentData.orderId,
      customer_id: paymentData.customerId || ''
    },
    theme: {
      color: '#6366f1'
    },
    modal: {
      ondismiss: function() {
        if (onFailure) {
          onFailure({
            error: 'Payment cancelled by user',
            status: 'Failed'
          });
        }
      }
    }
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

// Verify payment signature (should be done on server-side in production)
export const verifyPaymentSignature = (paymentId, orderId, signature) => {
  // This is a placeholder - in production, verify on server
  // using crypto.createHmac('sha256', secret).update(order_id + "|" + payment_id).digest('hex')
  console.log('Payment verification:', { paymentId, orderId, signature });
  return true;
};
