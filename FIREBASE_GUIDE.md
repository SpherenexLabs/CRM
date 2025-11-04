# Firebase Integration Guide

## Overview
The Spherenex CRM now uses Firebase Realtime Database for live data synchronization across all users.

## Firebase Configuration
The app is connected to:
- **Project ID**: v2v-communication-d46c6
- **Database URL**: https://v2v-communication-d46c6-default-rtdb.firebaseio.com

## Database Structure

```
/
├── inventory/
│   ├── {itemId}/
│   │   ├── productName: string
│   │   ├── category: string
│   │   ├── sku: string
│   │   ├── storeId: string
│   │   ├── quantity: number
│   │   ├── minThreshold: number
│   │   ├── price: number
│   │   └── lastUpdated: timestamp
│   
├── stores/
│   ├── {storeId}/
│   │   ├── name: string
│   │   ├── location: string
│   │   └── contactPerson: string
│   
├── stockTransfers/
│   ├── {transferId}/
│   │   ├── fromStoreId: string
│   │   ├── toStoreId: string
│   │   ├── sku: string
│   │   ├── quantity: number
│   │   ├── reason: string
│   │   └── transferredAt: timestamp
│   
├── orders/
│   └── (to be implemented)
│   
├── customers/
│   └── (to be implemented)
│   
├── payments/
│   └── (to be implemented)
│   
└── deliveries/
    └── (to be implemented)
```

## How to Initialize Sample Data

### Method 1: Using Browser Console
1. Open the app in your browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Run:
```javascript
import { initializeSampleData } from './utils/initializeData';
initializeSampleData();
```

### Method 2: Firebase Console
1. Go to https://console.firebase.google.com/
2. Select project: v2v-communication-d46c6
3. Go to Realtime Database
4. Import the sample data from `firebase-sample-data.json`

## Firebase Rules Setup

For development, set these rules in Firebase Console:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

For production (more secure):

```json
{
  "rules": {
    "inventory": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$itemId": {
        ".validate": "newData.hasChildren(['productName', 'category', 'sku', 'storeId', 'quantity', 'minThreshold', 'price', 'lastUpdated'])"
      }
    },
    "stores": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "stockTransfers": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## Real-Time Features

### Inventory Management
- ✅ Real-time updates when items are added/updated/deleted
- ✅ Stock quantities sync across all connected clients
- ✅ Stock transfers tracked in real-time
- ✅ Low stock alerts update automatically

### Auto-sync
- All changes are automatically synced to Firebase
- Multiple users can view and edit simultaneously
- Changes appear instantly for all users

## API Usage

### Add Inventory Item
```javascript
const { addInventoryItem } = useInventoryStore();

await addInventoryItem({
  productName: 'Product Name',
  category: 'Electronics',
  sku: 'SKU-001',
  storeId: 'store1',
  quantity: 100,
  minThreshold: 20,
  price: 99.99
});
```

### Update Inventory
```javascript
const { updateInventoryItem } = useInventoryStore();

await updateInventoryItem('itemId', {
  quantity: 150,
  price: 89.99
});
```

### Delete Inventory
```javascript
const { deleteInventoryItem } = useInventoryStore();

await deleteInventoryItem('itemId');
```

### Transfer Stock
```javascript
const { transferStock } = useInventoryStore();

await transferStock(
  'fromStoreId',
  'toStoreId',
  'SKU-001',
  25,
  'Restocking'
);
```

## Testing

1. Open the app in two browser windows
2. Login in both windows
3. Add/edit an inventory item in one window
4. Watch it update instantly in the other window!

## Troubleshooting

### Data not loading?
- Check Firebase Console → Realtime Database
- Verify rules allow read/write access
- Check browser console for errors

### Updates not syncing?
- Verify internet connection
- Check Firebase quota limits
- Ensure proper authentication

## Next Steps

To complete Firebase integration:
1. ✅ Inventory Store (DONE)
2. ⏳ Orders Store
3. ⏳ Customers Store
4. ⏳ Payments Store
5. ⏳ Delivery Store
6. ⏳ Analytics Store

## Security Notes

⚠️ **Important**: 
- Current Firebase config is exposed in code
- For production, move config to environment variables
- Implement proper authentication
- Set strict security rules
- Enable Firebase App Check

---

**Last Updated**: 2025-11-03
**Version**: 1.0.0-firebase
