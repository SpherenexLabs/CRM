# Razorpay Payment Integration Guide

## 🔐 Configuration

**Test API Key:** `rzp_test_1DP5mmOlF5G5ag`

The Razorpay integration is configured in `/src/utils/razorpay.js`

## ✅ Features Implemented

### 1. **Payment Processing in Orders**
- When creating a new order, select "Razorpay" as payment method
- System automatically opens Razorpay payment gateway
- Supports multiple payment modes:
  - UPI (Google Pay, PhonePe, Paytm, etc.)
  - Credit/Debit Cards
  - Net Banking
  - Wallets (Paytm, Mobikwik, etc.)

### 2. **Payment Processing Module**
- Navigate to **Payments** section
- Click **"Process New Payment"**
- Select "Razorpay" as provider
- Fill customer and order details
- Click **"Pay with Razorpay"** to open payment gateway

### 3. **Payment Flow**

```
1. User creates order/payment
2. Selects Razorpay as payment method
3. Razorpay checkout modal opens
4. Customer completes payment
5. System receives payment confirmation
6. Order status updated to "Paid"
7. Payment record saved in database
```

## 🧪 Testing

### Test Cards (for testing payments)

**Success Scenarios:**
- **Card Number:** 4111 1111 1111 1111
- **Expiry:** Any future date (e.g., 12/25)
- **CVV:** Any 3 digits (e.g., 123)
- **Name:** Any name

**UPI Testing:**
- Use UPI ID: `success@razorpay`
- For failed transactions: `failure@razorpay`

**NetBanking:**
- Select any bank
- Username/Password: Any value
- Will show success/failure options

### Test Mode Features
- No real money is charged
- All payments are simulated
- Payment IDs start with `pay_test_`
- Can test success and failure scenarios

## 📝 Implementation Details

### Files Modified:

1. **`/src/utils/razorpay.js`** - Razorpay configuration and helper functions
2. **`/src/components/Payments/Payments.jsx`** - Payment processing with Razorpay
3. **`/src/components/Orders/CreateOrder.jsx`** - Order creation with Razorpay payment
4. **`/index.html`** - Added Razorpay checkout script

### Key Functions:

#### `initiateRazorpayPayment(paymentData, onSuccess, onFailure)`
Opens Razorpay payment gateway with customer and order details

**Parameters:**
- `paymentData`: Object containing order ID, amount, customer info
- `onSuccess`: Callback function when payment succeeds
- `onFailure`: Callback function when payment fails

**Example:**
```javascript
initiateRazorpayPayment(
  {
    orderId: '12345',
    amount: 1500.00,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+91 9876543210'
  },
  (response) => {
    console.log('Payment successful:', response.razorpay_payment_id);
  },
  (error) => {
    console.log('Payment failed:', error);
  }
);
```

## 🔄 Payment Response

### Success Response:
```javascript
{
  razorpay_payment_id: "pay_test_xxxxxxxxxxxx",
  razorpay_order_id: "order_xxxxxxxxxxxx",
  razorpay_signature: "signature_hash"
}
```

### Failure Response:
```javascript
{
  error: "Payment cancelled by user",
  status: "Failed"
}
```

## 🌟 Features

### Customer Information Pre-fill
- Customer name, email, and phone are automatically filled
- Reduces data entry for customers
- Improves checkout experience

### Multiple Payment Options
- UPI
- Credit/Debit Cards
- Net Banking
- Wallets
- EMI (if enabled)

### Security
- PCI DSS compliant
- Secure checkout hosted by Razorpay
- No sensitive card data stored locally
- All transactions encrypted

### Mobile Responsive
- Works on desktop and mobile
- Native UPI apps integration on mobile
- Optimized checkout flow

## 🚀 Production Setup

### Steps to Go Live:

1. **Get Live API Keys**
   - Login to Razorpay Dashboard
   - Navigate to Settings → API Keys
   - Generate Live API Keys
   - Replace test key with live key in `/src/utils/razorpay.js`

2. **Update Configuration**
   ```javascript
   export const RAZORPAY_KEY_ID = 'rzp_live_your_actual_key';
   ```

3. **Server-side Verification (Recommended)**
   - Implement webhook to verify payment signature
   - Verify payment on server before marking as complete
   - Never trust client-side payment confirmation alone

4. **Enable Payment Methods**
   - Configure payment methods in Razorpay Dashboard
   - Enable UPI, Cards, NetBanking, Wallets as needed
   - Set up auto-settlements

5. **Webhook Configuration**
   - Add webhook URL in Razorpay Dashboard
   - Listen for payment.success, payment.failed events
   - Verify webhook signatures

## 📊 Payment Analytics

All payments are tracked and stored in:
- Firebase Realtime Database → `/payments`
- Payment Store (Zustand) → `usePaymentStore`

Track:
- Total transactions
- Success rate
- Payment methods distribution
- Revenue analytics

## ⚠️ Important Notes

### Security Best Practices:
1. **Never expose API secret** - Only use Key ID on client-side
2. **Verify payments server-side** - Don't trust client confirmations alone
3. **Use webhooks** - For reliable payment status updates
4. **Store payment IDs** - For reconciliation and refunds

### Test vs Live Mode:
- Test keys start with `rzp_test_`
- Live keys start with `rzp_live_`
- Keep them separate and secure
- Never commit API keys to version control

## 🆘 Troubleshooting

### Payment modal not opening:
- Check if Razorpay script is loaded in `index.html`
- Check browser console for errors
- Verify API key is correct

### Payment fails immediately:
- Check internet connection
- Verify test card details
- Check Razorpay dashboard for errors

### Payment success but not reflecting:
- Check callback functions
- Verify Firebase connection
- Check browser console logs

## 📞 Support

- **Razorpay Docs:** https://razorpay.com/docs/
- **Test Credentials:** https://razorpay.com/docs/payments/payments/test-card-details/
- **Support:** https://razorpay.com/support/

---

**Status:** ✅ Fully Integrated and Ready for Testing
**Environment:** Test Mode
**API Key:** rzp_test_1DP5mmOlF5G5ag
