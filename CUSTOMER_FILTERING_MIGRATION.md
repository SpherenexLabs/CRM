# Customer Data Filtering - Migration Guide

## For Existing Orders Without customerAccountId

If you have existing orders in Firebase that were created before this update, they won't have the `customerAccountId` field. Here's how to handle this:

### Option 1: Manual Update via Firebase Console

1. Go to Firebase Console → Realtime Database
2. Navigate to `orders/`
3. For each order, add the field:
   ```json
   {
     "customerAccountId": "customer-account-id-here"
   }
   ```

### Option 2: Create Test Data

For testing purposes, create new orders after logging in as a customer. These will automatically have the correct `customerAccountId`.

### Option 3: Migration Script (For Developers)

Add this temporary code to `App.jsx` to migrate existing orders (run once, then remove):

```javascript
// In App.jsx, add this useEffect (TEMPORARY - RUN ONCE ONLY)
useEffect(() => {
  const migrateOrders = async () => {
    const ordersRef = ref(db, 'orders');
    const snapshot = await get(ordersRef);
    
    if (snapshot.exists()) {
      const orders = snapshot.val();
      
      for (const orderId in orders) {
        const order = orders[orderId];
        
        // Skip if already has customerAccountId
        if (order.customerAccountId) continue;
        
        // Try to match by customer email or name
        // This is just an example - customize based on your data
        const customerAccount = customers.find(c => 
          c.email === order.customerEmail || 
          c.name === order.customerName
        );
        
        if (customerAccount) {
          const orderRef = ref(db, `orders/${orderId}`);
          await update(orderRef, {
            customerAccountId: customerAccount.id
          });
          console.log(`Migrated order ${orderId} to customer ${customerAccount.id}`);
        }
      }
    }
  };
  
  // Uncomment to run migration (ONCE ONLY)
  // migrateOrders();
}, []);
```

## Testing Instructions

### Test Case 1: New Customer Registration
1. Click "Register as Customer"
2. Fill in details:
   - Name: Test User
   - Email: test@example.com
   - Phone: 1234567890
   - Password: test123
3. Click Register
4. Login with email: test@example.com, password: test123
5. **Expected**: Dashboard shows 0 orders, ₹0 spent

### Test Case 2: Customer Creates Order (if applicable)
1. Login as customer (test@example.com)
2. Navigate to Orders
3. Create new order
4. **Expected**: Order appears in customer's dashboard

### Test Case 3: Customer Data Isolation
1. Register second customer: test2@example.com
2. Login as test2@example.com
3. **Expected**: Does NOT see orders from test@example.com

### Test Case 4: Staff View
1. Logout
2. Login as staff (username: manager1, password: manager123)
3. **Expected**: Sees ALL orders from all customers
4. Dashboard shows complete store statistics

### Test Case 5: Payments Filtering
1. Login as customer (test@example.com)
2. Navigate to Payments
3. **Expected**: Only sees payments for their own orders

## Common Issues & Solutions

### Issue: Customer sees no orders
**Cause**: Existing orders don't have `customerAccountId` field  
**Solution**: Either create new orders as that customer, or run migration script

### Issue: Customer sees all orders
**Cause**: Filtering logic not applied  
**Solution**: Verify you've refreshed the browser after code update

### Issue: Staff sees no orders
**Cause**: Over-aggressive filtering  
**Solution**: Staff should always see all orders (role !== 'Customer')

### Issue: Dashboard shows NaN values
**Cause**: Filtered array is empty and calculations fail  
**Solution**: Code includes fallbacks (|| 0), refresh browser

## Rollback Instructions

If you need to revert these changes:

1. **Dashboard.jsx**: Remove filtering, use `allOrders` directly
2. **Orders.jsx**: Remove filtering, use original `orders` from store
3. **Payments.jsx**: Remove filtering, use original `payments` from store
4. **CreateOrder.jsx**: Remove `customerAccountId` field from orderData

## Production Considerations

Before deploying to production:

1. **Test thoroughly** with multiple customer accounts
2. **Migrate existing orders** with customerAccountId
3. **Add logging** to track which customer views which data
4. **Consider performance** if customer has thousands of orders
5. **Add error boundaries** to catch filtering errors gracefully
6. **Update API/backend** if you have server-side filtering too

## Support

If customers report seeing incorrect data:
1. Check their `currentUser.id` in browser console
2. Check order's `customerAccountId` in Firebase
3. Verify role is exactly 'Customer' (case-sensitive)
4. Check browser console for errors
5. Clear browser cache and localStorage
